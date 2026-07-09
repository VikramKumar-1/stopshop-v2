import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ShiprocketService } from "@/lib/shiprocket";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-internal-secret");
    const isInternal = authHeader && authHeader === (process.env.JWT_SECRET || "internal");
    
    let user: any = null;
    if (!isInternal) {
      user = requireRole(req, ["admin", "vendor"]);
      if (user instanceof NextResponse) return user;
    }

    const { orderId, returnRequestId } = await req.json();

    if (!orderId || !returnRequestId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const fullOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!fullOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (!isInternal && user && user.role === "vendor") {
      const ownsItem = fullOrder.items.some((item: any) => item.vendorId === user.userId);
      if (!ownsItem) {
        return NextResponse.json({ success: false, error: "Unauthorized: You do not own items in this order" }, { status: 403 });
      }
    }

    let returnAwbCode = `RET-AWB-${Math.floor(Math.random() * 10000000)}`;
    let returnShiprocketId = null;

    try {
      // Send it back to Vendor Warehouse
      const srOrder = await ShiprocketService.createReturnOrder(fullOrder, fullOrder.items, "Vendor Warehouse");
      returnShiprocketId = srOrder.shiprocket_order_id;
      const assignment = await ShiprocketService.assignCourier(srOrder.shipment_id);
      returnAwbCode = assignment.awb_code || returnAwbCode;
      
      // We don't generate labels for return shipments immediately in Shiprocket
    } catch (e) {
      console.error("Mock Shiprocket Return Failed", e);
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        returnAwbCode,
        returnShiprocketId
      }
    });

    return NextResponse.json({ success: true, returnAwbCode });
  } catch (error: any) {
    console.error("Return pickup creation failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
