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
    } else if ((user.role === "vendor" || user.parentVendorId) && asVendor && parseInt(asVendor) === (user.role === "vendor" ? user.userId : user.parentVendorId)) {
       const effVendorId = user.role === "vendor" ? user.userId : user.parentVendorId;
       whereClause.items = {
          some: { vendorId: effVendorId }
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
         user: {
            select: { id: true, name: true, email: true, mobile: true }
         },
         items: {
            include: {
               product: {
                  include: {
                     vendor: {
                        select: { id: true, name: true, email: true, mobile: true, location: true, gstin: true, artisanId: true }
                     }
                  }
               }
            }
         },
         returnRequest: true,
         settlements: true
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
