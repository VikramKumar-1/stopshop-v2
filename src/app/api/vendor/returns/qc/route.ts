import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const user = requireRole(req, ["vendor"]);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    const { returnId, action, vendorQcNotes, vendorQcImages } = body;

    if (!returnId || !action) {
      return NextResponse.json({ success: false, error: "Missing returnId or action" }, { status: 400 });
    }

    if (!["QC_PASSED", "QC_FAILED"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    if (action === "QC_FAILED" && (!vendorQcNotes || !vendorQcImages || !Array.isArray(vendorQcImages) || vendorQcImages.length === 0)) {
      return NextResponse.json({ success: false, error: "Notes and photos are required when failing a QC" }, { status: 400 });
    }

    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: returnId },
      include: { order: { include: { items: true } } }
    });

    if (!returnRequest) {
      return NextResponse.json({ success: false, error: "Return not found" }, { status: 404 });
    }

    if (action === "QC_PASSED") {
       // 1. Process immediate Refund and Stock Restoration
       await prisma.$transaction(async (tx) => {
          await tx.returnRequest.update({
             where: { id: returnId },
             data: { 
                status: "REFUND_INITIATED",
                vendorQcNotes: "QC PASSED: Vendor approved return.",
                vendorQcImages: null
             }
          });

          await tx.order.update({
             where: { id: returnRequest.orderId },
             data: { status: "RETURNED" } // Terminal state
          });

          // Restore Stock
          const returnItems = returnRequest.returnItems as any[];
          for (const item of returnItems) {
             await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } }
             });
          }

          // Cancel Settlement so vendor is not paid
          await tx.settlement.updateMany({
             where: { orderId: returnRequest.orderId },
             data: { status: "CANCELLED" }
          });
       });

       // Trigger Razorpay Refund
       if (returnRequest.order.paymentGateway === "razorpay" && returnRequest.order.razorpayPaymentId) {
          if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
             try {
                const razorpay = new Razorpay({
                   key_id: process.env.RAZORPAY_KEY_ID,
                   key_secret: process.env.RAZORPAY_KEY_SECRET,
                });
                await razorpay.payments.refund(returnRequest.order.razorpayPaymentId, {
                   amount: returnRequest.order.totalPaise,
                   notes: { reason: "Vendor approved QC Pass" }
                });
                await prisma.returnRequest.update({
                   where: { id: returnId },
                   data: { refundStatus: "completed", refundedAt: new Date() }
                });
             } catch (rpe) {
                console.error("Razorpay refund failed in vendor QC passed:", rpe);
             }
          }
       }

       return NextResponse.json({ success: true, message: "QC Passed, refund initiated and stock restored." });
    }

    if (action === "QC_FAILED") {
       // 2. Dispute raised: route to Admin review by setting status to RECEIVED_AT_WAREHOUSE
       await prisma.$transaction([
          prisma.returnRequest.update({
             where: { id: returnId },
             data: {
                status: "RECEIVED_AT_WAREHOUSE",
                qcNotes: vendorQcNotes, // Set main qcNotes so admin sees it in admin panel
                qcImages: vendorQcImages, // Set main qcImages so admin sees it
                vendorQcNotes,
                vendorQcImages,
             }
          }),
          prisma.order.update({
             where: { id: returnRequest.orderId },
             data: { status: "RETURN_RECEIVED" } // Changes order status to trigger admin resolution
          })
       ]);

       return NextResponse.json({ success: true, message: "QC Failed. Dispute sent to admin for final review." });
    }

    return NextResponse.json({ success: false, error: "Invalid flow" }, { status: 400 });

  } catch (error: any) {
    console.error("Vendor QC error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
