import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(req.url);
    const vendorIdStr = searchParams.get("vendorId");
    
    if (!vendorIdStr) {
      return NextResponse.json({ error: "vendorId is required" }, { status: 400 });
    }

    const vendorId = parseInt(vendorIdStr);

    // Verify permission
    if (user.role !== "admin" && user.userId !== vendorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch only the necessary fields (status, createdAt) for orders belonging to this vendor
    const vendorOrders = await prisma.order.findMany({
      where: {
        items: {
          some: { vendorId }
        }
      },
      select: {
        status: true,
        createdAt: true
      }
    });

    let totalPending = 0;
    let totalPacked = 0;
    let totalDispatched = 0;
    let totalDelivered = 0;
    let totalReturned = 0;
    let totalCancelled = 0;
    let todayOrders = 0;

    for (const order of vendorOrders) {
      if (order.status === "CONFIRMED") totalPending++;
      else if (order.status === "PACKED") totalPacked++;
      else if (order.status === "DISPATCHED") totalDispatched++;
      else if (order.status === "DELIVERED") totalDelivered++;
      else if (order.status === "RETURNED") totalReturned++;
      else if (order.status === "CANCELLED" || order.status === "RETURN_REJECTED") totalCancelled++;

      if (order.createdAt >= startOfToday) {
        todayOrders++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        pending: totalPending,
        packed: totalPacked,
        dispatched: totalDispatched,
        delivered: totalDelivered,
        returned: totalReturned,
        cancelled: totalCancelled,
        today: todayOrders
      }
    });

  } catch (error: any) {
    console.error("Vendor stats error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
