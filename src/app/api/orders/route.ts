import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (user instanceof NextResponse) return user;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    let whereClause: any = {};

    const asVendor = searchParams.get("vendorId");

    if (user.role === "admin") {
       if (asVendor) {
           whereClause.items = { some: { vendorId: parseInt(asVendor) } };
       }
    } else if (user.role === "vendor" && asVendor && parseInt(asVendor) === user.userId) {
       whereClause.items = {
          some: { vendorId: user.userId }
       };
       if (status) {
          whereClause.status = status === "PENDING" ? { not: "PENDING" } : status;
       } else {
          whereClause.status = { not: "PENDING" };
       }
    } else {
       whereClause.userId = user.userId;
    }

    if (status && user.role !== "vendor") {
       whereClause.status = status;
    }

    const total = await prisma.order.count({ where: whereClause });
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
         items: true,
         returnRequest: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    });

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
