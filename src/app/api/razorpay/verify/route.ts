import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import { RAZORPAY_CONFIG } from "@/lib/paymentConfig";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing Razorpay parameters" }, { status: 400 });
    }

    // 1. Verify Signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_CONFIG.keySecret)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // 2. Start a Prisma Transaction to ensure atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Find the order
      const order = await tx.order.findUnique({
        where: { paymentOrderId: razorpay_order_id },
        include: { items: true }
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status !== "PENDING" || order.paymentStatus !== "PENDING") {
         return order; // Already verified (maybe webhook hit first)
      }

      // Acquire lock and prevent concurrent webhook processing
      const lock = await tx.order.updateMany({
         where: { id: order.id, paymentStatus: "PENDING" },
         data: { paymentStatus: "PROCESSING" }
      });

      if (lock.count === 0) return order; // Another process grabbed it

      // 3. Deduct Stock (Atomic Concurrency Safe)
      for (const item of order.items) {
        const updateResult = await tx.product.updateMany({
          where: { 
             id: item.productId,
             stock: { gte: item.quantity }
          },
          data: { stock: { decrement: item.quantity } }
        });
        
        if (updateResult.count === 0) {
           throw new Error(`OUT_OF_STOCK_ERROR: Someone just bought the last stock of ${item.productName}.`);
        }
      }

      // Track 'Frequently Bought Together' pairs
      if (order.items.length > 1) {
        for (let i = 0; i < order.items.length; i++) {
          for (let j = i + 1; j < order.items.length; j++) {
            const pA = Math.min(order.items[i].productId, order.items[j].productId);
            const pB = Math.max(order.items[i].productId, order.items[j].productId);
            
            await tx.productPair.upsert({
              where: { productA_productB: { productA: pA, productB: pB } },
              update: { score: { increment: 1 } },
              create: { productA: pA, productB: pB, score: 1 }
            });
          }
        }
      }

      // 4. Calculate Commission
      const settings = await tx.adminSettings.findFirst();
      const commissionRate = settings?.defaultCommissionRate || 10;
      const commissionPaise = Math.round(order.totalPaise * (commissionRate / 100));
      const vendorPayoutPaise = order.totalPaise - commissionPaise;

      // 5. Update Order
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          razorpayPaymentId: razorpay_payment_id,
          commissionRate,
          commissionPaise,
          vendorPayoutPaise,
          settlementStatus: "HOLD", // Wait for delivery + return window
        }
      });

      // 6. Create Settlement entries per vendor
      const vendorTotals: Record<number, number> = {};
      for (const item of order.items) {
         if (item.vendorId) {
            vendorTotals[item.vendorId] = (vendorTotals[item.vendorId] || 0) + item.totalPaise;
         }
      }

      for (const [vendorId, total] of Object.entries(vendorTotals)) {
         const vComm = Math.round(total * (commissionRate / 100));
         await tx.settlement.create({
            data: {
              orderId: order.id,
              vendorId: Number(vendorId),
              orderAmountPaise: total,
              commissionPaise: vComm,
              vendorPayoutPaise: total - vComm,
              status: "HOLD",
              holdUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default hold, updated on delivery
            }
         });
      }

      return updatedOrder;
    }, { maxWait: 10000, timeout: 30000 });

    // Order confirmed; wait for vendor packing before creating Shiprocket shipment

    return NextResponse.json({ success: true, orderId: result.id });
  } catch (error: any) {
    console.error("Razorpay verify error:", error);

    // Auto-Refund Logic for Race Conditions
    if (error.message && error.message.includes("OUT_OF_STOCK_ERROR")) {
       try {
          const razorpay = new Razorpay({
            key_id: RAZORPAY_CONFIG.keyId,
            key_secret: RAZORPAY_CONFIG.keySecret,
          });
          
          // Get order total to refund
          const failedOrder = await prisma.order.findUnique({ where: { paymentOrderId: body.razorpay_order_id } });
          
          if (failedOrder) {
             await razorpay.payments.refund(body.razorpay_payment_id, {
                amount: failedOrder.totalPaise,
                notes: { reason: "Auto-refunded due to out of stock race condition" }
             });

             await prisma.order.update({
                where: { id: failedOrder.id },
                data: {
                   status: "CANCELLED_OUT_OF_STOCK",
                   paymentStatus: "REFUNDED",
                   razorpayPaymentId: body.razorpay_payment_id
                }
             });
          }
       } catch (refundErr) {
          console.error("Failed to auto-refund out-of-stock order:", refundErr);
       }
    }

    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
