import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Shiprocket Webhook Payload Example:
// {
//   "awb": "123456789",
//   "current_status": "DELIVERED",
//   "current_status_id": 7,
//   "order_id": "YOUR_ORDER_ID" // This maps to our database order ID
// }

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Security: Verify the webhook secret from Shiprocket
    const shiprocketToken = req.headers.get("x-shiprocket-token");
    if (process.env.SHIPROCKET_WEBHOOK_SECRET && shiprocketToken !== process.env.SHIPROCKET_WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, error: "Unauthorized webhook signature" }, { status: 401 });
    }

    const body = await req.json();
    const { order_id, current_status, awb } = body;

    if (!order_id || !current_status) {
      return NextResponse.json({ success: false, error: "Invalid payload format" }, { status: 400 });
    }

    // 2. Find the Order in our Database
    const order = await prisma.order.findUnique({
      where: { id: String(order_id) } // Assuming Shiprocket passes our string UUID/CUID back
    });

    if (!order) {
      // If not found by primary ID, maybe it was passed as orderNumber
      const orderNumMatch = await prisma.order.findFirst({
        where: { orderNumber: String(order_id) }
      });
      if (!orderNumMatch) {
         return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
    }

    const actualOrderId = order?.id || (await prisma.order.findFirst({ where: { orderNumber: String(order_id) } }))?.id;
    if(!actualOrderId) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    // 3. Handle FORWARD Delivery (Shiprocket delivers product to Customer)
    if (current_status === "DELIVERED") {
      await prisma.order.update({
        where: { id: actualOrderId },
        data: { status: "DELIVERED" } // This starts the 7-day return window in the UI
      });
      return NextResponse.json({ success: true, message: "Order marked as delivered" });
    }

    // 4. Handle REVERSE Pickup Delivery (Shiprocket returns product to Vendor)
    // Shiprocket status for Reverse Delivered might be "RTO DELIVERED" or a custom status.
    // Assuming "RETURN_DELIVERED" for clarity, update this based on actual Shiprocket docs when live.
    if (current_status === "RETURN_DELIVERED" || current_status === "RTO DELIVERED") {
      // Update the ReturnRequest to start the 24-hr SLA timer
      const returnReq = await prisma.returnRequest.findUnique({
         where: { orderId: actualOrderId }
      });

      if (returnReq) {
         await prisma.returnRequest.update({
            where: { id: returnReq.id },
            data: { 
               vendorDeliveredAt: new Date(), // STARTS THE 24-HR SLA TIMER!
            }
         });
         return NextResponse.json({ success: true, message: "Vendor delivery timestamp recorded for SLA" });
      }
    }

    return NextResponse.json({ success: true, message: `Ignored status: ${current_status}` });

  } catch (error: any) {
    console.error("Shiprocket Webhook Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
