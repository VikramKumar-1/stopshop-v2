import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = requireRole(req, ["admin"]);
    if (admin instanceof NextResponse) return admin;

    const vendorId = parseInt(params.id);
    if (isNaN(vendorId)) {
       return NextResponse.json({ success: false, error: "Invalid vendor ID" }, { status: 400 });
    }

    // 1. Fetch products for this vendor
    const products = await prisma.product.findMany({
      where: { vendorId },
      select: { 
         id: true, 
         name: true, 
         slug: true,
         image: true, 
         active: true, 
         price: true,
         stock: true
      },
      orderBy: { id: 'desc' }
    });

    if (products.length === 0) {
      return NextResponse.json({ success: true, products: [] });
    }

    // 2. Fetch revenue from OrderItems
    // Exclude items that belong to cancelled or fully returned orders if needed
    // We will exclude CANCELLED, RETURNED, RETURN_APPROVED
    const revenueGroups = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { 
         vendorId,
         order: {
            status: {
               notIn: ["CANCELLED", "RETURNED", "RETURN_APPROVED"]
            }
         }
      },
      _sum: { totalPaise: true }
    });

    const revenueMap = new Map<number, number>();
    revenueGroups.forEach(g => {
       revenueMap.set(g.productId, g._sum.totalPaise || 0);
    });

    // 3. Map revenue to products
    const productsWithRevenue = products.map(p => ({
      ...p,
      revenuePaise: revenueMap.get(p.id) || 0
    }));

    return NextResponse.json({ success: true, products: productsWithRevenue });
  } catch (error: any) {
    console.error("Fetch vendor products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
