import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = parseInt(searchParams.get("productId") || "0");
    const category = searchParams.get("category") || "";
    const material = searchParams.get("material") || "";
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!productId) {
      return NextResponse.json({ success: false, error: "Missing productId" }, { status: 400 });
    }

    const orConditions: any[] = [];
    if (category && typeof category === "string" && category !== "[object Object]") {
      orConditions.push({ categoryName: category });
    }
    if (material && typeof material === "string" && material !== "[object Object]") {
      orConditions.push({ material: material });
    }

    // First try finding matching active products in the same categoryName or material
    let recommendations: any[] = [];
    if (orConditions.length > 0) {
      recommendations = await prisma.product.findMany({
        where: {
          id: { not: productId },
          active: true,
          OR: orConditions
        },
        take: limit,
        orderBy: { id: "desc" }
      });
    }

    // If we have fewer than limit recommendations, fill with other active products
    if (recommendations.length < limit) {
      const existingIds = new Set([productId, ...recommendations.map(p => p.id)]);
      const moreProducts = await prisma.product.findMany({
        where: {
          id: { notIn: Array.from(existingIds) },
          active: true
        },
        take: limit - recommendations.length,
        orderBy: { id: "desc" }
      });
      recommendations = [...recommendations, ...moreProducts];
    }

    return NextResponse.json({ success: true, products: recommendations });
  } catch (error: any) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
