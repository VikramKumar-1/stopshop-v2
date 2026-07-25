import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // SECURITY: Require CRON_SECRET, internal secret, or admin role
    const authHeader = req.headers.get("authorization") || req.headers.get("x-internal-secret");
    const validCronSecret = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const validInternalSecret = authHeader === (process.env.JWT_SECRET || "internal");

    if (!validCronSecret && !validInternalSecret) {
      const user = requireRole(req, ["admin"]);
      if (user instanceof NextResponse) return user;
    }

    // Find all returns that failed their refund attempt
    const failedReturns = await prisma.returnRequest.findMany({
      where: {
        status: "REFUND_FAILED"
      },
      include: { order: true }
    });

    if (failedReturns.length === 0) {
      return NextResponse.json({ success: true, message: "No failed refunds to retry" });
    }

    const processedIds: number[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const returnReq of failedReturns) {
      if (!returnReq.order.razorpayPaymentId) {
        continue; // No transaction ID, cannot refund
      }

      // Trigger Gateway Refund
      if (returnReq.order.paymentGateway === "razorpay") {
         if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            try {
               const razorpay = new Razorpay({
                  key_id: process.env.RAZORPAY_KEY_ID,
                  key_secret: process.env.RAZORPAY_KEY_SECRET,
               });
               await razorpay.payments.refund(returnReq.order.razorpayPaymentId, {
                  amount: returnReq.order.totalPaise,
                  notes: { reason: "Auto-retry failed refund" }
               });
               await prisma.returnRequest.update({
                  where: { id: returnReq.id },
                  data: { status: "REFUND_INITIATED", refundStatus: "initiated", refundedAt: new Date(), adminNotes: "Refund retry successful" }
               });
               successCount++;
            } catch (rpe: any) {
               console.error(`Razorpay refund retry failed for order ${returnReq.orderId}:`, rpe);
               await prisma.returnRequest.update({
                  where: { id: returnReq.id },
                  data: { adminNotes: `Refund failed again: ${rpe?.message || "Razorpay Error"}` }
               });
               failCount++;
            }
         }
      } else if (returnReq.order.paymentGateway === "payu") {
         try {
            const { processPayURefund } = await import("@/lib/payu");
            await processPayURefund(returnReq.order.razorpayPaymentId, returnReq.order.totalPaise);
            await prisma.returnRequest.update({
               where: { id: returnReq.id },
               data: { status: "REFUND_INITIATED", refundStatus: "initiated", refundedAt: new Date(), adminNotes: "Refund retry successful (PayU)" }
            });
            successCount++;
         } catch (payue: any) {
            console.error(`PayU refund retry failed for order ${returnReq.orderId}:`, payue);
            await prisma.returnRequest.update({
               where: { id: returnReq.id },
               data: { adminNotes: `Refund failed again: ${payue?.message || "PayU Error"}` }
            });
            failCount++;
         }
      }

      processedIds.push(returnReq.id);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${processedIds.length} failed refunds. Success: ${successCount}, Failed Again: ${failCount}`, 
      processedIds 
    });

  } catch (error: any) {
    console.error("Cron Retry Refund error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
