import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/ordersDb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, deliveryDate } = body;
    const orderId = params.id;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = updateOrderStatus(orderId, status, deliveryDate);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (e: any) {
    console.error("Error updating order status:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}
