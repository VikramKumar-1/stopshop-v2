import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = requireRole(req, ["vendor"]);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    const { orderItemId, dispatchImages } = body;

    if (!orderItemId || !dispatchImages || !Array.isArray(dispatchImages)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (dispatchImages.length < 5 || dispatchImages.length > 8) {
      return NextResponse.json({ success: false, error: "Must upload between 5 and 8 dispatch photos" }, { status: 400 });
    }

    // Verify vendor owns this order item
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true }
    });

    if (!orderItem) {
      return NextResponse.json({ success: false, error: "Order item not found" }, { status: 404 });
    }

    if (orderItem.vendorId !== user.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized for this item" }, { status: 403 });
    }

    // Update the item with dispatch photos
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { dispatchImages }
    });

    // Check if all items in this order have dispatch images uploaded
    // If so, we can optionally mark the order as PACKED automatically
    const allItems = await prisma.orderItem.findMany({
       where: { orderId: orderItem.orderId }
    });
    
    const allPacked = allItems.every(item => {
       let imgs = item.dispatchImages;
       if (typeof imgs === 'string') {
          try { imgs = JSON.parse(imgs as string); } catch(e) {}
       }
       const isPacked = imgs && Array.isArray(imgs) && imgs.length >= 5;
       console.log(`[Dispatch Check] Item ${item.id}: isPacked=${isPacked}, vendorId=${item.vendorId}, imgsLength=${Array.isArray(imgs) ? imgs.length : 'not_array'}`);
       return isPacked;
    });

    console.log(`[Dispatch Result] orderId=${orderItem.orderId}, allPacked=${allPacked}`);

    if (allPacked && (orderItem.order.status === "CONFIRMED" || orderItem.order.status === "PENDING")) {
       await prisma.order.update({
          where: { id: orderItem.orderId },
          data: { status: "PACKED" }
       });

       // Trigger auto-shiprocket integration asynchronously
       fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/shiprocket/create-shipment`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ orderId: orderItem.orderId })
       }).catch(e => console.error("Auto-ship trigger failed on packing completion", e));
    }

    return NextResponse.json({ success: true, message: "Dispatch photos uploaded successfully", allPacked });
  } catch (error: any) {
    console.error("Vendor dispatch upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
