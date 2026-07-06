import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";
import { RAZORPAY_CONFIG } from "@/lib/paymentConfig";


export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
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

      if (order.status !== "PENDING" && order.paymentStatus === "PAID") {
         return order; // Already verified (maybe webhook hit first)
      }

      // 3. Deduct Stock and Track Co-Purchases
      for (const item of order.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
           throw new Error(`Out of stock for item ${item.productName}`);
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
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
    });

    // Order confirmed; wait for vendor packing before creating Shiprocket shipment

    return NextResponse.json({ success: true, orderId: result.id });
  } catch (error: any) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
