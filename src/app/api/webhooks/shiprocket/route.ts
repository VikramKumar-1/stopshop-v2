import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-api-key");
    // In production, verify against a configured webhook token

    const body = await req.json();
    const { awb, current_status, shipment_status } = body;

    if (!awb || !current_status) {
       return NextResponse.json({ success: false, error: "Invalid webhook payload" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { awbCode: awb },
          { returnAwbCode: awb }
        ]
      }
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const isReturn = order.returnAwbCode === awb;

    const updates: any = {
      shiprocketStatus: current_status,
    };

    // Auto-update internal status based on Shiprocket status
    const statusMap: Record<string, string> = {
      "PICKED UP": "DISPATCHED",
      "IN TRANSIT": "DISPATCHED",
      "OUT FOR DELIVERY": "DISPATCHED",
      "DELIVERED": "DELIVERED",
      "RTO INITIATED": "RTO",
      "RTO DELIVERED": "RTO_DELIVERED"
    };

    const newStatus = statusMap[current_status.toUpperCase()];
    
    if (newStatus && newStatus !== order.status) {
       updates.status = newStatus;
       if (newStatus === "DELIVERED" && !isReturn) {
          updates.deliveredAt = new Date();
       }
    }

    // Special Handling for Returns
    if (isReturn && newStatus === "DELIVERED") {
       const returnReq = await prisma.returnRequest.findUnique({
          where: { orderId: order.id }
       });

       if (returnReq) {
          await prisma.$transaction([
             prisma.order.update({
                where: { id: order.id },
                data: { shiprocketStatus: current_status }
             }),
             prisma.returnRequest.update({
                where: { id: returnReq.id },
                data: { vendorDeliveredAt: new Date() }
             })
          ]);
          return NextResponse.json({ success: true, message: "Return Delivered - SLA Timer Started" });
       }
    }

    // Handle RTO Delivered (Returned to Origin) -> Restore stock
    if (newStatus === "RTO_DELIVERED" && order.status !== "RTO_DELIVERED" && !isReturn) {
       await prisma.$transaction(async (tx) => {
         const items = await tx.orderItem.findMany({ where: { orderId: order.id } });
         for (const item of items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } }
            });
         }
         
         await tx.order.update({
           where: { id: order.id },
           data: updates
         });
       });
    } else {
       await prisma.order.update({
         where: { id: order.id },
         data: updates
       });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Shiprocket webhook error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
