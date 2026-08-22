import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, requireAuth } from "@/lib/auth";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { 
         items: true,
         returnRequest: true,
         settlements: user.role === "admin" || user.role === "vendor" ? true : false
      }
    });

    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (user.role === "user" && order.userId !== user.userId) {
       return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (user.role === "vendor") {
       const isBuyer = order.userId === user.userId;
       const isSeller = order.items.some((item: any) => item.vendorId === user.userId);
       if (!isBuyer && !isSeller) {
          return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
       }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = requireRole(req, ["admin", "vendor"]);
    if (admin instanceof NextResponse) return admin;

    const body = await req.json();
    const { status, deliveryDate, cancellationReason } = body;

    if (!status) {
       return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const updates: any = { status };

    if (deliveryDate !== undefined) {
       updates.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    }

    if (status === "CANCELLED") {
       if (cancellationReason) {
         updates.cancellationReason = cancellationReason;
       }
       // Auto-refund for paid orders
       if (order.paymentStatus === "PAID" || order.paymentStatus === "COMPLETED") {
          if (order.paymentGateway === "razorpay" && order.paymentOrderId) {
             try {
                const Razorpay = (await import("razorpay")).default;
                const { RAZORPAY_CONFIG, isRazorpayConfigured } = await import("@/lib/paymentConfig");
                if (isRazorpayConfigured()) {
                   const razorpay = new Razorpay({
                     key_id: RAZORPAY_CONFIG.keyId,
                     key_secret: RAZORPAY_CONFIG.keySecret,
                   });
                   await razorpay.payments.refund(order.razorpayPaymentId || order.paymentOrderId, {
                     amount: order.totalPaise,
                     notes: { reason: cancellationReason || "Order Cancelled by Vendor/Admin" }
                   });
                   updates.paymentStatus = "REFUNDED";
                }
             } catch (refundError) {
                console.error("Auto-refund failed:", refundError);
                // We still cancel the order but maybe append a note
                updates.cancellationReason = (updates.cancellationReason || "") + " [REFUND FAILED - MANUAL INTERVENTION REQUIRED]";
             }
          }
          // TODO: PayU refund logic
       }
    }

    if (status === "DELIVERED" && order.status !== "DELIVERED") {
       updates.deliveredAt = new Date();
    }

    const updated = await prisma.order.update({
       where: { id: order.id },
       data: updates
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
