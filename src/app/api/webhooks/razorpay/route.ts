import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { RAZORPAY_CONFIG } from "@/lib/paymentConfig";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature || !RAZORPAY_CONFIG.webhookSecret) {
      return NextResponse.json({ success: false, error: "Missing signature or secret" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_CONFIG.webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "order.paid") {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Ensure idempotency and verify order
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { paymentOrderId: orderId },
          include: { items: true }
        });

        if (order && order.status === "PENDING" && order.paymentStatus === "PENDING") {
           // Acquire lock
           const lock = await tx.order.updateMany({
              where: { id: order.id, paymentStatus: "PENDING" },
              data: { paymentStatus: "PROCESSING" }
           });
           if (lock.count === 0) return; // Processed concurrently

           // Verify amount matches
           if (order.totalPaise === paymentEntity.amount) {
              // Same logic as verify endpoint
              for (const item of order.items) {
                await tx.product.update({
                  where: { id: item.productId },
                  data: { stock: { decrement: item.quantity } }
                });
              }

              const settings = await tx.adminSettings.findFirst();
              const commissionRate = settings?.defaultCommissionRate || 10;
              const commissionPaise = Math.round(order.totalPaise * (commissionRate / 100));
              
              await tx.order.update({
                where: { id: order.id },
                data: {
                  paymentStatus: "PAID",
                  status: "CONFIRMED",
                  razorpayPaymentId: razorpayPaymentId,
                  paymentData: paymentEntity,
                  commissionRate,
                  commissionPaise,
                  vendorPayoutPaise: order.totalPaise - commissionPaise,
                  settlementStatus: "HOLD",
                }
              });

              // Create Settlement entries
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
           }
        }
      });
    } else if (event.event === "transfer.processed") {
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

          // Check if we need to update the Order
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
