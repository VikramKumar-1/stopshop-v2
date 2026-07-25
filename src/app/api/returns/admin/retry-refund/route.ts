import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Razorpay from "razorpay";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const body = await req.json();
    const { returnId: rawReturnId } = body;

    if (!rawReturnId) {
      return NextResponse.json({ success: false, error: "Missing returnId" }, { status: 400 });
    }

    const returnId = typeof rawReturnId === "string" ? parseInt(rawReturnId, 10) : rawReturnId;

    const returnReq = await prisma.returnRequest.findUnique({
      where: { id: returnId },
      include: { order: true }
    });

    if (!returnReq) {
      return NextResponse.json({ success: false, error: "Return request not found" }, { status: 404 });
    }

    if (returnReq.status !== "REFUND_FAILED") {
      return NextResponse.json({ success: false, error: "Return request is not in REFUND_FAILED status" }, { status: 400 });
    }

    if (!returnReq.order.razorpayPaymentId) {
      return NextResponse.json({ success: false, error: "No original transaction ID found to refund" }, { status: 400 });
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
                notes: { reason: "Admin manual retry of failed refund" }
             });
             await prisma.returnRequest.update({
                where: { id: returnReq.id },
                data: { status: "REFUND_INITIATED", refundStatus: "initiated", refundedAt: new Date(), adminNotes: "Refund manually retried and initiated successfully." }
             });
             return NextResponse.json({ success: true, message: "Refund initiated via Razorpay" });
          } catch (rpe: any) {
             console.error(`Razorpay refund manual retry failed for order ${returnReq.orderId}:`, rpe);
             await prisma.returnRequest.update({
                where: { id: returnReq.id },
                data: { adminNotes: `Refund failed again: ${rpe?.message || "Razorpay Error"}` }
             });
             return NextResponse.json({ success: false, error: rpe?.message || "Razorpay Error" }, { status: 500 });
          }
       } else {
          return NextResponse.json({ success: false, error: "Razorpay credentials missing on server" }, { status: 500 });
       }
    } else if (returnReq.order.paymentGateway === "payu") {
       try {
          const { processPayURefund } = await import("@/lib/payu");
          await processPayURefund(returnReq.order.razorpayPaymentId, returnReq.order.totalPaise);
          await prisma.returnRequest.update({
             where: { id: returnReq.id },
             data: { status: "REFUND_INITIATED", refundStatus: "initiated", refundedAt: new Date(), adminNotes: "Refund manually retried and initiated successfully (PayU)." }
          });
          return NextResponse.json({ success: true, message: "Refund initiated via PayU" });
       } catch (payue: any) {
          console.error(`PayU refund manual retry failed for order ${returnReq.orderId}:`, payue);
          await prisma.returnRequest.update({
             where: { id: returnReq.id },
             data: { adminNotes: `Refund failed again: ${payue?.message || "PayU Error"}` }
          });
          return NextResponse.json({ success: false, error: payue?.message || "PayU Error" }, { status: 500 });
       }
    }

    return NextResponse.json({ success: false, error: "Unknown payment gateway" }, { status: 400 });

  } catch (error: any) {
    console.error("Manual Retry Refund error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
