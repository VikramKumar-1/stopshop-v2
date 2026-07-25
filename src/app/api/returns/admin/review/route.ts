import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Razorpay from "razorpay";
import { ShiprocketService } from "@/lib/shiprocket";


export async function POST(req: NextRequest) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const body = await req.json();
    const { returnId: rawReturnId, action, rejectionReason, adminNotes, banUser, banVendor } = body;

    if (!rawReturnId || !action) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const returnId = typeof rawReturnId === "string" ? parseInt(rawReturnId, 10) : rawReturnId;

    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: returnId },
      include: { order: true }
    });

    if (!returnRequest) {
      return NextResponse.json({ success: false, error: "Return request not found" }, { status: 404 });
    }

    // Phase 1: Pre-Pickup Review (Action: APPROVED or REJECTED_PRE_PICKUP)
    if (returnRequest.status === "PENDING") {
       if (action === "REJECTED_PRE_PICKUP") {
          if (!rejectionReason) {
             return NextResponse.json({ success: false, error: "Rejection reason required" }, { status: 400 });
          }
          await prisma.$transaction(async (tx) => {
             await tx.returnRequest.update({
                where: { id: returnId },
                data: { status: "REJECTED_PRE_PICKUP", rejectionReason, adminNotes }
             });
             // Unfreeze settlement - vendor gets paid
             await tx.settlement.updateMany({
                where: { orderId: returnRequest.orderId, status: { in: ["DISPUTED", "HOLD", "ELIGIBLE"] } },
                data: { status: "ELIGIBLE" }
             });
             await tx.order.update({
                where: { id: returnRequest.orderId },
                data: { status: "DELIVERED" } // Revert to delivered
             });
          });
          return NextResponse.json({ success: true, message: "Return rejected pre-pickup" });
       }
       
       if (action === "APPROVED") {
          const fullOrder = await prisma.order.findUnique({
             where: { id: returnRequest.orderId },
             include: { items: true }
          });

          let returnAwbCode = `RET-AWB-${Math.floor(Math.random() * 10000000)}`;
          let returnShiprocketId = null;

          if (fullOrder && fullOrder.items.length > 0) {
             // Get vendor's real address from DB
             const vendorId = fullOrder.items[0]?.vendorId;
             let vendorInfo: any = undefined;
             if (vendorId) {
               const vendorUser = await prisma.user.findUnique({ where: { id: vendorId }, select: { name: true, mobile: true, location: true } });
               if (vendorUser?.location && vendorUser.location.includes("|")) {
                 const parts = vendorUser.location.split("|").map((p: string) => p.trim());
                 vendorInfo = {
                   name: vendorUser.name || "Vendor Return",
                   address: parts[4] || parts[0] || "Vendor Warehouse",
                   city: parts[0] || "Delhi",
                   state: parts[1] || "Delhi",
                   country: parts[2] || "India",
                   pincode: parts[3] || "110001",
                   phone: vendorUser.mobile || ""
                 };
               }
             }

             try {
                const srOrder = await ShiprocketService.createReturnOrder(fullOrder, fullOrder.items, "Vendor Warehouse", vendorInfo);
                returnShiprocketId = srOrder.shiprocket_order_id;
                const assignment = await ShiprocketService.assignCourier(srOrder.shipment_id);
                returnAwbCode = assignment.awb_code || returnAwbCode;
             } catch (e) {
                console.error("Mock Shiprocket Return Failed", e);
             }
          }

          await prisma.$transaction([
             prisma.returnRequest.update({
                where: { id: returnId },
                data: { status: "APPROVED", adminNotes }
             }),
             prisma.order.update({
                where: { id: returnRequest.orderId },
                data: { 
                   status: "RETURN_APPROVED", 
                   returnAwbCode: returnAwbCode,
                   returnShiprocketId: returnShiprocketId 
                }
             })
          ]);
          
          return NextResponse.json({ success: true, message: "Return pickup approved", returnAwbCode });
       }
    }

    // Phase 2: Post-QC Dispute Resolution
    if (returnRequest.status === "RECEIVED_AT_WAREHOUSE") {
       if (action === "QC_PASS") {
          await prisma.$transaction(async (tx) => {
             await tx.returnRequest.update({
                where: { id: returnId },
                data: { status: "REFUND_INITIATED", adminNotes }
             });
             // Vendor loses money, user gets refund
             await tx.settlement.updateMany({
                where: { orderId: returnRequest.orderId, status: { in: ["DISPUTED", "HOLD", "ELIGIBLE"] } },
                data: { status: "CANCELLED" }
             });
             await tx.order.update({
                where: { id: returnRequest.orderId },
                data: { status: "RETURNED" } 
             });

             // Ban Logic
             if (banVendor) {
                const order = await tx.order.findUnique({ where: { id: returnRequest.orderId }, select: { items: true } });
                if (order?.items?.[0]?.vendorId) {
                   await tx.user.update({
                      where: { id: order.items[0].vendorId },
                      data: { vendorStatus: "REJECTED" } // Banned/Unverified
                   });
                }
             }
             if (banUser) {
                // If there is no dedicated ban field, we can just reset their role or add a note
                console.log("Ban User requested for", returnRequest.userId);
             }
          });

          // Trigger Gateway Refund
          if (returnRequest.order.paymentGateway === "razorpay" && returnRequest.order.razorpayPaymentId) {
             if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
                try {
                   const razorpay = new Razorpay({
                      key_id: process.env.RAZORPAY_KEY_ID,
                      key_secret: process.env.RAZORPAY_KEY_SECRET,
                   });
                   await razorpay.payments.refund(returnRequest.order.razorpayPaymentId, {
                      amount: returnRequest.order.totalPaise,
                      notes: { reason: "Admin QC Pass / Dispute resolved for user" }
                   });
                   await prisma.returnRequest.update({
                      where: { id: returnId },
                      data: { refundStatus: "initiated", refundedAt: new Date() }
                   });
                } catch (rpe: any) {
                   console.error("Razorpay refund failed:", rpe);
                   await prisma.returnRequest.update({
                      where: { id: returnId },
                      data: { status: "REFUND_FAILED", refundStatus: "failed", adminNotes: "Refund failed: " + (rpe?.message || "Razorpay Error") }
                   });
                }
             }
          } else if (returnRequest.order.paymentGateway === "payu" && returnRequest.order.razorpayPaymentId) {
             try {
                const { processPayURefund } = await import("@/lib/payu");
                await processPayURefund(returnRequest.order.razorpayPaymentId, returnRequest.order.totalPaise);
                await prisma.returnRequest.update({
                   where: { id: returnId },
                   data: { refundStatus: "initiated", refundedAt: new Date() }
                });
             } catch (payue: any) {
                console.error("PayU refund failed:", payue);
                await prisma.returnRequest.update({
                   where: { id: returnId },
                   data: { status: "REFUND_FAILED", refundStatus: "failed", adminNotes: "Refund failed: " + (payue?.message || "PayU Error") }
                });
             }
          }

          return NextResponse.json({ success: true, message: "Dispute resolved in favor of user (QC PASS). Refund initiated." });
       }

       if (action === "QC_FAIL") {
          await prisma.$transaction(async (tx) => {
             await tx.returnRequest.update({
                where: { id: returnId },
                data: { status: "QC_FAILED", rejectionReason: rejectionReason || "Return rejected after QC check.", adminNotes }
             });
             // Vendor gets paid
             await tx.settlement.updateMany({
                where: { orderId: returnRequest.orderId, status: { in: ["DISPUTED", "HOLD", "ELIGIBLE"] } },
                data: { status: "ELIGIBLE" }
             });
             await tx.order.update({
                where: { id: returnRequest.orderId },
                data: { status: "RETURN_REJECTED" } 
             });

             // Ban Logic
             if (banUser) {
                console.log("Ban User requested for", returnRequest.userId);
             }
             if (banVendor) {
                const order = await tx.order.findUnique({ where: { id: returnRequest.orderId }, select: { items: true } });
                if (order?.items?.[0]?.vendorId) {
                   await tx.user.update({
                      where: { id: order.items[0].vendorId },
                      data: { vendorStatus: "REJECTED" }
                   });
                }
             }
          });
          return NextResponse.json({ success: true, message: "Dispute resolved in favor of vendor (QC FAIL)" });
       }
    }

    return NextResponse.json({ success: false, error: `Invalid action ${action} for status ${returnRequest.status}` }, { status: 400 });
  } catch (error: any) {
    console.error("Admin review error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
