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
    
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (!isInternal && user && user.role === "vendor") {
      const ownsItem = order.items.some((item: any) => item.vendorId === user.userId);
      if (!ownsItem) {
        return NextResponse.json({ success: false, error: "Unauthorized: You do not own items in this order" }, { status: 403 });
      }
    }

    if (order.status !== "CONFIRMED" && order.status !== "PACKED") {
      return NextResponse.json({ success: false, error: "Order must be CONFIRMED or PACKED to ship" }, { status: 400 });
    }

    if (order.shiprocketShipmentId) {
       return NextResponse.json({ success: false, error: "Shipment already created" }, { status: 400 });
    }

    const settings = await prisma.adminSettings.findFirst();
    const pickupLocation = settings?.shiprocketPickupLocation || "Primary";

    // 1. Create Order in Shiprocket
    const srOrder = await ShiprocketService.createOrder(order, order.items, pickupLocation);

    await prisma.order.update({
      where: { id: order.id },
      data: {
        shiprocketOrderId: srOrder.shiprocket_order_id,
        shiprocketShipmentId: srOrder.shipment_id,
      }
    });

    let awbCode = null;
    let courierName = null;
    let shippingLabelUrl = null;

    // 2. Auto-Assign Courier if enabled
    if (settings?.shiprocketAutoAssign) {
      try {
        const assignment = await ShiprocketService.assignCourier(srOrder.shipment_id);
        awbCode = assignment.awb_code;
        courierName = assignment.courier_name;

        // 3. Generate Label
        shippingLabelUrl = await ShiprocketService.generateLabel(srOrder.shipment_id);

        // 4. Schedule Pickup
        await ShiprocketService.schedulePickup(srOrder.shipment_id);

        // 5. Update Order Status (Keep status as PACKED, only attach AWB and shipping details)
        await prisma.order.update({
          where: { id: order.id },
          data: {
            awbCode,
            courierName,
            courierId: assignment.courier_id,
            shippingLabelUrl,
            status: "PACKED"
          }
        });
      } catch (err) {
        console.error("Auto-assign failed, falling back to manual", err);
      }
    }

    return NextResponse.json({
      success: true,
      shiprocketOrderId: srOrder.shiprocket_order_id,
      shiprocketShipmentId: srOrder.shipment_id,
      awbCode,
      courierName,
      shippingLabelUrl
    });

  } catch (error: any) {
    console.error("Shiprocket create shipment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
