import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Razorpay from "razorpay";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const settlementId = parseInt(params.id);
    const body = await req.json();
    const { action, vendorPaymentRef, vendorPaymentMode, notes } = body;

    const settlement = await prisma.settlement.findUnique({
      where: { id: settlementId }
    });

    if (!settlement) {
      return NextResponse.json({ success: false, error: "Settlement not found" }, { status: 404 });
    }

    if (action === "SETTLE") {
       if (settlement.status !== "ELIGIBLE") {
          return NextResponse.json({ success: false, error: "Can only settle ELIGIBLE settlements" }, { status: 400 });
       }
       if (!vendorPaymentRef || !vendorPaymentMode) {
          return NextResponse.json({ success: false, error: "Payment reference and mode required" }, { status: 400 });
       }

       const updated = await prisma.$transaction(async (tx) => {
          const s = await tx.settlement.update({
             where: { id: settlementId },
             data: {
               status: "SETTLED",
               settledAt: new Date(),
               vendorPaymentRef,
               vendorPaymentMode,
               notes
             }
          });

          // Also update the order settlement status if all vendor settlements for this order are SETTLED
          const otherSettlements = await tx.settlement.findMany({
             where: { orderId: settlement.orderId, id: { not: settlementId } }
          });
          
          if (otherSettlements.every(os => os.status === "SETTLED" || os.status === "CANCELLED")) {
             await tx.order.update({
                where: { id: settlement.orderId },
                data: { settlementStatus: "SETTLED" }
             });
          }

          return s;
       });

       return NextResponse.json({ success: true, data: updated });
    }

    if (action === "SETTLE_RAZORPAY") {
       if (settlement.status !== "ELIGIBLE") {
          return NextResponse.json({ success: false, error: "Can only settle ELIGIBLE settlements" }, { status: 400 });
       }
       
       const { testMode } = body;
       let vendor: any = null;

       if (!testMode) {
          if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
             return NextResponse.json({ success: false, error: "Razorpay keys missing from .env" }, { status: 500 });
          }

          vendor = await prisma.user.findUnique({ where: { id: settlement.vendorId } });
          if (!vendor || !vendor.razorpayAccountId) {
             return NextResponse.json({ success: false, error: "Vendor does not have a linked Razorpay account" }, { status: 400 });
          }
       }

       let transferId = "mock_trf_" + Math.random().toString(36).substring(2, 11).toUpperCase();

       if (!testMode) {
          const razorpay = new Razorpay({
             key_id: process.env.RAZORPAY_KEY_ID!,
             key_secret: process.env.RAZORPAY_KEY_SECRET!,
          });

          try {
             const transferPayload = {
                account: vendor.razorpayAccountId!,
                amount: settlement.vendorPayoutPaise,
                currency: "INR",
                notes: {
                   orderId: settlement.orderId,
                   settlementId: String(settlement.id)
                }
             };

             const transfer = await razorpay.transfers.create(transferPayload);
             transferId = transfer.id;
          } catch (error: any) {
             console.error("Razorpay transfer failed:", error);
             return NextResponse.json({ success: false, error: error.description || error.message || "Razorpay transfer failed" }, { status: 400 });
          }
       }

       const updated = await prisma.$transaction(async (tx) => {
          const s = await tx.settlement.update({
             where: { id: settlementId },
             data: {
               status: testMode ? "SETTLED" : "PROCESSING",
               settledAt: new Date(),
               vendorPaymentRef: transferId,
               vendorPaymentMode: testMode ? "razorpay_route_mock" : "razorpay_route"
             }
          });

          const otherSettlements = await tx.settlement.findMany({
             where: { orderId: settlement.orderId, id: { not: settlementId } }
          });
          
          const targetStatus = testMode ? "SETTLED" : "PROCESSING";
          const allowedStatuses = testMode ? ["SETTLED", "CANCELLED"] : ["SETTLED", "PROCESSING", "CANCELLED"];
          if (otherSettlements.every(os => allowedStatuses.includes(os.status))) {
             await tx.order.update({
                where: { id: settlement.orderId },
                data: { settlementStatus: targetStatus }
             });
          }

          return s;
       });

       return NextResponse.json({ success: true, data: updated });
    }

    if (action === "DISPUTE") {
       const updated = await prisma.settlement.update({
          where: { id: settlementId },
          data: { status: "DISPUTED", notes }
       });
       return NextResponse.json({ success: true, data: updated });
    }

    if (action === "UPDATE_STATUS") {
       const { status } = body;
       if (!["HOLD", "ELIGIBLE"].includes(status)) {
           return NextResponse.json({ success: false, error: "Invalid status update" }, { status: 400 });
       }
       const updated = await prisma.settlement.update({
          where: { id: settlementId },
          data: { status }
       });
       return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Settlement action error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
