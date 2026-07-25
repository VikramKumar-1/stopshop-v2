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

    // 1. Fetch the SLA window from Settings
    const settings = await prisma.adminSettings.findFirst();
    const slaHours = settings?.vendorReturnSlaHours || 24;
    const cutoffTime = new Date(Date.now() - slaHours * 60 * 60 * 1000);

    // 2. Find all returns that were delivered to vendor BEFORE the cutoff time,
    // and are STILL sitting in "APPROVED" (meaning vendor never opened dispute/passed it)
    const expiredReturns = await prisma.returnRequest.findMany({
      where: {
        status: "APPROVED",
        vendorDeliveredAt: {
          lte: cutoffTime, // Delivered BEFORE the cutoff time (meaning it has been longer than SLA)
          not: null
        }
      },
      include: { order: true }
    });

    if (expiredReturns.length === 0) {
      return NextResponse.json({ success: true, message: "No expired SLAs found" });
    }

    const processedIds: number[] = [];

    // 3. Process them: Automatically "QC_PASS" them to refund the user
    for (const returnReq of expiredReturns) {
      await prisma.$transaction(async (tx) => {
        await tx.returnRequest.update({
          where: { id: returnReq.id },
          data: { 
             status: "REFUND_INITIATED", 
             adminNotes: `AUTO-APPROVED: Vendor failed to respond within the ${slaHours}-hour SLA.` 
          }
        });

        // Cancel vendor settlement (user gets refund)
        await tx.settlement.updateMany({
          where: { orderId: returnReq.orderId, status: "DISPUTED" },
          data: { status: "CANCELLED" }
        });

        await tx.order.update({
          where: { id: returnReq.orderId },
          data: { status: "RETURNED" } 
        });
      });
      
      // Trigger Gateway Refund
      if (returnReq.order.paymentGateway === "razorpay" && returnReq.order.razorpayPaymentId) {
         if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            try {
               const razorpay = new Razorpay({
                  key_id: process.env.RAZORPAY_KEY_ID,
                  key_secret: process.env.RAZORPAY_KEY_SECRET,
               });
               await razorpay.payments.refund(returnReq.order.razorpayPaymentId, {
                  amount: returnReq.order.totalPaise,
                  notes: { reason: "Auto-approved due to SLA expiration" }
               });
               await prisma.returnRequest.update({
                  where: { id: returnReq.id },
                  data: { refundStatus: "initiated", refundedAt: new Date() }
               });
            } catch (rpe: any) {
               console.error(`Razorpay refund failed for SLA cron, order ${returnReq.orderId}:`, rpe);
               await prisma.returnRequest.update({
                  where: { id: returnReq.id },
                  data: { status: "REFUND_FAILED", refundStatus: "failed", adminNotes: `Refund failed: ${rpe?.message || "Razorpay Error"} (Auto-approved due to SLA expiration)` }
               });
            }
         }
      } else if (returnReq.order.paymentGateway === "payu" && returnReq.order.razorpayPaymentId) {
         try {
            const { processPayURefund } = await import("@/lib/payu");
            await processPayURefund(returnReq.order.razorpayPaymentId, returnReq.order.totalPaise);
            await prisma.returnRequest.update({
               where: { id: returnReq.id },
               data: { refundStatus: "initiated", refundedAt: new Date() }
            });
         } catch (payue: any) {
            console.error(`PayU refund failed for SLA cron, order ${returnReq.orderId}:`, payue);
            await prisma.returnRequest.update({
               where: { id: returnReq.id },
               data: { status: "REFUND_FAILED", refundStatus: "failed", adminNotes: `Refund failed: ${payue?.message || "PayU Error"} (Auto-approved due to SLA expiration)` }
            });
         }
      }

      processedIds.push(returnReq.id);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${processedIds.length} expired returns`, 
      processedIds 
    });

  } catch (error: any) {
    console.error("Cron SLA error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
