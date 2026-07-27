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
    const rawLimit = parseInt(searchParams.get("limit") || "15");
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const status = searchParams.get("status");

    let whereClause: any = {};

    const asVendor = searchParams.get("vendorId");
    const targetVendorId = asVendor ? parseInt(asVendor) : null;
    const effUserId = user.id || user.userId;
    const currentVendorId = user.role === "vendor" ? effUserId : user.parentVendorId;

    if (user.role === "admin") {
      if (targetVendorId) {
        whereClause.items = { some: { vendorId: targetVendorId } };
      }
    } else if (currentVendorId && targetVendorId && targetVendorId === currentVendorId) {
      whereClause.items = {
        some: { vendorId: currentVendorId }
      };
      if (status) {
        whereClause.status = status === "PENDING" ? { not: "PENDING" } : status;
      } else {
        whereClause.status = { not: "PENDING" };
      }
    } else {
      whereClause.userId = effUserId;
      if (!status) {
        whereClause.status = { not: "PENDING" };
      }
    }

    if (status && user.role !== "vendor") {
       whereClause.status = status;
    }

    const total = await prisma.order.count({ where: whereClause });
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
         user: {
            select: { id: true, name: true, email: true, mobile: true }
         },
         items: {
            include: {
               product: {
                  select: {
                     id: true,
                     name: true,
                     slug: true,
                     image: true,
                     images: true,
                     vendorId: true
                  }
               }
            }
         },
         returnRequest: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    });

    let stats: any[] | undefined = undefined;
    if (searchParams.get("getStats") === "true") {
       stats = await prisma.order.findMany({
          where: whereClause,
          select: {
             status: true,
             paymentMethod: true,
             currency: true,
             totalPaise: true,
             commissionPaise: true
          }
       });
    }

    return NextResponse.json({
      success: true,
      orders,
      stats,
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
