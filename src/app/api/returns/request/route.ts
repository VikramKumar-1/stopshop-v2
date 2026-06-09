import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ShiprocketService } from "@/lib/shiprocket";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    const { orderId, reason, reasonDetail, returnImages, returnItems } = body;

    if (!orderId || !reason || !returnItems || returnItems.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (!returnImages || !Array.isArray(returnImages) || returnImages.length < 6 || returnImages.length > 8) {
      return NextResponse.json({ success: false, error: "Exactly 6 to 8 photos are required to process a return" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, returnRequest: true }
    });

    if (!order || order.userId !== user.userId) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "DELIVERED") {
      return NextResponse.json({ success: false, error: "Can only return delivered orders" }, { status: 400 });
    }

    if (order.returnRequest) {
      return NextResponse.json({ success: false, error: "Return already requested for this order" }, { status: 400 });
    }

    // Check return window
    if (!order.deliveredAt) {
      return NextResponse.json({ success: false, error: "Delivery date not recorded" }, { status: 400 });
    }

    const returnWindowMs = order.returnWindowDays * 24 * 60 * 60 * 1000;
    if (Date.now() - new Date(order.deliveredAt).getTime() > returnWindowMs) {
      return NextResponse.json({ success: false, error: "Return window has expired" }, { status: 400 });
    }

    // Create the Return Request (AUTO-APPROVED)
    const returnRequest = await prisma.$transaction(async (tx) => {
       const req = await tx.returnRequest.create({
         data: {
           orderId: order.id,
           userId: user.userId,
           reason,
           reasonDetail,
           returnImages,
           returnItems,
           status: "APPROVED" // Auto-approve the return
         }
       });

       // Update Order Status
       await tx.order.update({
         where: { id: order.id },
         data: { status: "RETURN_APPROVED" } // Auto-approve
       });

       // Freeze settlement if it's still HOLD or ELIGIBLE
       await tx.settlement.updateMany({
         where: { orderId: order.id, status: { in: ["HOLD", "ELIGIBLE"] } },
         data: { status: "DISPUTED" }
       });

       return req;
    });

    // Trigger Reverse Pickup instantly without HTTP fetch overhead
    try {
      let returnAwbCode = `RET-AWB-${Math.floor(Math.random() * 10000000)}`;
      let returnShiprocketId = null;
      
      const srOrder = await ShiprocketService.createReturnOrder(order, returnItems, "Vendor Warehouse");
      returnShiprocketId = srOrder.shiprocket_order_id;
      const assignment = await ShiprocketService.assignCourier(srOrder.shipment_id);
      returnAwbCode = assignment.awb_code || returnAwbCode;

      await prisma.order.update({
        where: { id: order.id },
        data: { returnAwbCode, returnShiprocketId }
      });
    } catch (e) {
      console.error("Auto reverse-pickup trigger failed", e);
    }

    return NextResponse.json({ success: true, returnRequest });
  } catch (error: any) {
    console.error("Return request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
