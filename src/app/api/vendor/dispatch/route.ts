import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;
    if (user.role !== "vendor" && !user.parentVendorId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const effVendorId = user.role === "vendor" ? user.id : user.parentVendorId;

    const body = await req.json();
    const { orderId, orderItemId, dispatchImages } = body;

    const targetOrderId = orderId || null;
    let targetOrderItemId = orderItemId || null;

    if ((!targetOrderId && !targetOrderItemId) || !dispatchImages || !Array.isArray(dispatchImages)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (dispatchImages.length < 2) {
      return NextResponse.json({ success: false, error: "Must upload at least 2 packing proof photos" }, { status: 400 });
    }

    let targetOrder: any = null;

    if (targetOrderId) {
      const orderIdStr = String(targetOrderId);
      targetOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { id: orderIdStr },
            { orderNumber: orderIdStr }
          ]
        },
        include: { items: true }
      });
      if (targetOrder && targetOrder.items.length > 0) {
        targetOrderItemId = targetOrder.items[0].id;
      }
    } else if (targetOrderItemId) {
      const itemIdNum = parseInt(String(targetOrderItemId));
      if (!isNaN(itemIdNum)) {
        const item = await prisma.orderItem.findUnique({
          where: { id: itemIdNum },
          include: { order: true }
        });
        if (item) {
          targetOrder = item.order;
        }
      }
    }

    if (!targetOrder || !targetOrderItemId) {
      return NextResponse.json({ success: false, error: "Order or Order Item not found" }, { status: 404 });
    }

    const orderItemIdNum = parseInt(String(targetOrderItemId));
    const orderItem = await prisma.orderItem.findUnique({ where: { id: orderItemIdNum } });

    if (!orderItem || orderItem.vendorId !== effVendorId) {
      return NextResponse.json({ success: false, error: "Unauthorized for this item" }, { status: 403 });
    }

    // Update the item with dispatch photos
    await prisma.orderItem.update({
      where: { id: orderItemIdNum },
      data: { dispatchImages }
    });

    // Check if any item or all items in this order have dispatch images uploaded
    const allItems = await prisma.orderItem.findMany({
       where: { orderId: targetOrder.id }
    });
    
    const anyPacked = allItems.some(item => {
       let imgs = item.dispatchImages;
       if (typeof imgs === 'string') {
          try { imgs = JSON.parse(imgs as string); } catch(e) {}
       }
       return imgs && (Array.isArray(imgs) ? imgs.length > 0 : true);
    });

    const allPacked = allItems.every(item => {
       let imgs = item.dispatchImages;
       if (typeof imgs === 'string') {
          try { imgs = JSON.parse(imgs as string); } catch(e) {}
       }
       return imgs && (Array.isArray(imgs) ? imgs.length > 0 : true);
    });

    console.log(`[Dispatch Result] orderId=${targetOrder.id}, anyPacked=${anyPacked}, allPacked=${allPacked}`);

    // Update order status to PACKED immediately as soon as vendor packs any item!
    if (anyPacked && (targetOrder.status === "CONFIRMED" || targetOrder.status === "PENDING" || targetOrder.status === "PROCESSING")) {
       await prisma.order.update({
          where: { id: targetOrder.id },
          data: { status: "PACKED" }
       });
    }

    if (allPacked) {
       // Trigger auto-shiprocket integration asynchronously when all items are packed
       fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/shiprocket/create-shipment`, {
           method: "POST",
           headers: { 
             "Content-Type": "application/json",
             "x-internal-secret": process.env.JWT_SECRET || "internal",
             "Cookie": req.headers.get("cookie") || ""
           },
           body: JSON.stringify({ orderId: targetOrder.id })
       }).catch(e => console.error("Auto-ship trigger failed on packing completion", e));
    }

    return NextResponse.json({ success: true, message: "Dispatch photos uploaded successfully", anyPacked, allPacked });
  } catch (error: any) {
    console.error("Vendor dispatch upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
