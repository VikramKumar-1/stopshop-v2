import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import Razorpay from "razorpay";
import { RAZORPAY_CONFIG } from "@/lib/paymentConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_CONFIG.keySecret; // Fallback for dev

    // Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const razorpayEventId = req.headers.get("x-razorpay-event-id") || `evt_${Date.now()}_${Math.random()}`;

    // --- IDEMPOTENCY CHECK ---
    try {
      const existingEvent = await prisma.webhookEvent.findUnique({
        where: {
          eventId_provider: { eventId: razorpayEventId, provider: "razorpay" }
        }
      });

      if (existingEvent) {
        return NextResponse.json({ success: true, message: "Already processed" });
      }

      await prisma.webhookEvent.create({
        data: {
          eventId: razorpayEventId,
          provider: "razorpay",
          status: "PROCESSING",
          payload: event
        }
      });
    } catch (e) {
       // If unique constraint fails here, it means another thread just created it (race condition)
       return NextResponse.json({ success: true, message: "Already processing concurrently" });
    }

    // --- PROCESS EVENTS ---
    if (event.event === "order.paid") {
      const paymentPayload = event.payload.payment.entity;
      const orderPayload = event.payload.order.entity;
      const razorpay_order_id = orderPayload.id;
      const razorpay_payment_id = paymentPayload.id;

      try {
        await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({
            where: { paymentOrderId: razorpay_order_id },
            include: { items: true }
          });

          if (!order) throw new Error("Order not found");

          if (order.status !== "PENDING" && order.paymentStatus === "PAID") {
             return order; // Already verified by frontend
          }

          // Deduct Stock (Atomic Concurrency Safe)
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

          // Calculate Commission
          const settings = await tx.adminSettings.findFirst();
          const commissionRate = settings?.defaultCommissionRate || 10;
          const commissionPaise = Math.round(order.totalPaise * (commissionRate / 100));
          const vendorPayoutPaise = order.totalPaise - commissionPaise;

          // Update Order
          await tx.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              razorpayPaymentId: razorpay_payment_id,
              commissionRate,
              commissionPaise,
              vendorPayoutPaise,
              settlementStatus: "HOLD", 
            }
          });

          // Create Settlement entries per vendor
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
                  holdUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
             });
          }
        });
      } catch (txError: any) {
        console.error("Razorpay webhook transaction error:", txError);
        
        // Auto-Refund Logic for Race Conditions
        if (txError.message && txError.message.includes("OUT_OF_STOCK_ERROR")) {
           try {
              const razorpay = new Razorpay({
                key_id: RAZORPAY_CONFIG.keyId,
                key_secret: RAZORPAY_CONFIG.keySecret,
              });
              
              const failedOrder = await prisma.order.findUnique({ where: { paymentOrderId: razorpay_order_id } });
              
              if (failedOrder) {
                 await razorpay.payments.refund(razorpay_payment_id, {
                    amount: failedOrder.totalPaise,
                    notes: { reason: "Auto-refunded due to out of stock race condition via Webhook" }
                 });

                 await prisma.order.update({
                    where: { id: failedOrder.id },
                    data: {
                       status: "CANCELLED_OUT_OF_STOCK",
                       paymentStatus: "REFUNDED",
                       razorpayPaymentId: razorpay_payment_id
                    }
                 });
              }
           } catch (refundErr) {
              console.error("Failed to auto-refund out-of-stock order via Webhook:", refundErr);
           }
        } else {
           throw txError; // Propagate other errors to mark webhook as failed
        }
      }
    } else if (event.event === "refund.processed") {
       // --- REFUND WEBHOOK LOGIC ---
       const refundEntity = event.payload.refund.entity;
       const razorpay_payment_id = refundEntity.payment_id;

       const order = await prisma.order.findFirst({
         where: { razorpayPaymentId: razorpay_payment_id }
       });

       if (order) {
          // Update Order Payment Status
          await prisma.order.update({
             where: { id: order.id },
             data: { paymentStatus: "REFUNDED" }
          });

          // Also update Return Request if exists
          const returnReq = await prisma.returnRequest.findUnique({
             where: { orderId: order.id }
          });

          if (returnReq) {
             await prisma.returnRequest.update({
                where: { id: returnReq.id },
                data: { status: "REFUND_COMPLETED" }
             });
          }
       }
    } else if (event.event === "transfer.processed") {
       // --- TRANSFER / PAYOUT WEBHOOK LOGIC ---
       const transferEntity = event.payload.transfer.entity;
       const transferId = transferEntity.id;
       
       const settlement = await prisma.settlement.findFirst({
          where: { vendorPaymentRef: transferId }
       });

       if (settlement) {
          await prisma.settlement.update({
             where: { id: settlement.id },
             data: { status: "SETTLED" }
          });

          // Check if we need to update the parent Order
          const otherSettlements = await prisma.settlement.findMany({
             where: { orderId: settlement.orderId, id: { not: settlement.id } }
          });
          
          if (otherSettlements.every(os => ["SETTLED", "CANCELLED"].includes(os.status))) {
             await prisma.order.update({
                where: { id: settlement.orderId },
                data: { settlementStatus: "SETTLED" }
             });
          }
       }
    } else if (event.event === "transfer.failed") {
       const transferEntity = event.payload.transfer.entity;
       const transferId = transferEntity.id;
       
       const settlement = await prisma.settlement.findFirst({
          where: { vendorPaymentRef: transferId }
       });

       if (settlement) {
          await prisma.settlement.update({
             where: { id: settlement.id },
             data: { status: "FAILED", notes: transferEntity.error_description || "Razorpay transfer failed" }
          });
       }
    }

    // Mark event as PROCESSED successfully
    await prisma.webhookEvent.update({
      where: { eventId_provider: { eventId: razorpayEventId, provider: "razorpay" } },
      data: { status: "PROCESSED" }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Razorpay webhook global error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
