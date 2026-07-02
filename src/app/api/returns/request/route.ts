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

    // Check 7-day return window
    const deliveryTimestamp = order.deliveredAt 
      ? new Date(order.deliveredAt).getTime() 
      : new Date(order.updatedAt || order.createdAt).getTime();

    const returnWindowMs = (order.returnWindowDays || 7) * 24 * 60 * 60 * 1000;
    if (Date.now() - deliveryTimestamp > returnWindowMs) {
      return NextResponse.json({ success: false, error: "Return window (7 days) has expired for this order" }, { status: 400 });
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

       // Settlement is NOT auto-frozen here.
       // Admin can manually hold the settlement from the dashboard if needed.

       return req;
    });

    // Trigger Reverse Pickup instantly without HTTP fetch overhead
    try {
      let returnAwbCode = `RET-AWB-${Math.floor(Math.random() * 10000000)}`;
      let returnShiprocketId = null;
      
      // Get the vendor's real address from DB
      const vendorId = order.items?.[0]?.vendorId;
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

      const srOrder = await ShiprocketService.createReturnOrder(order, returnItems, "Vendor Warehouse", vendorInfo);
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
