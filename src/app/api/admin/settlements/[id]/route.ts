import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

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
