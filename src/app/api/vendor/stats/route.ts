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

    // Run parallel count queries using Prisma
    // We count items directly that belong to this vendor
    const [
      totalPending,
      totalPacked,
      totalDispatched,
      totalDelivered,
      totalReturned,
      totalCancelled,
      todayOrders
    ] = await Promise.all([
      prisma.orderItem.count({ where: { vendorId, order: { status: { in: ["PENDING", "CONFIRMED"] } } } }),
      prisma.orderItem.count({ where: { vendorId, order: { status: "PACKED" } } }),
      prisma.orderItem.count({ where: { vendorId, order: { status: "DISPATCHED" } } }),
      prisma.orderItem.count({ where: { vendorId, order: { status: "DELIVERED" } } }),
      prisma.orderItem.count({ where: { vendorId, order: { status: "RETURNED" } } }),
      prisma.orderItem.count({ where: { vendorId, order: { status: { in: ["CANCELLED", "RETURN_REJECTED"] } } } }),
      prisma.orderItem.count({ where: { vendorId, order: { createdAt: { gte: startOfToday } } } })
    ]);

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
