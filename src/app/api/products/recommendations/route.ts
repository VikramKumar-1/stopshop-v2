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

    let recommendationsMap = new Map<number, any>();

    // Step 1: "Frequently Bought Together" (Collaborative Filtering)
    const pairs = await prisma.productPair.findMany({
      where: {
        OR: [
          { productA: productId },
          { productB: productId }
        ]
      },
      orderBy: { score: 'desc' },
      take: limit
    });

    if (pairs.length > 0) {
      const pairProductIds = pairs.map(p => p.productA === productId ? p.productB : p.productA);
      
      const boughtTogetherProducts = await prisma.product.findMany({
        where: { id: { in: pairProductIds }, active: true }
      });

      boughtTogetherProducts.forEach(prod => {
        recommendationsMap.set(prod.id, prod);
      });
    }

    // Step 2: Smart Content Matching (if we need more products)
    if (recommendationsMap.size < limit) {
      const orConditions: any[] = [];
      if (category && typeof category === "string" && category !== "[object Object]") {
        orConditions.push({ categoryName: category });
      }
      if (material && typeof material === "string" && material !== "[object Object]") {
        orConditions.push({ material: material });
      }

      if (orConditions.length > 0) {
        const excludeIds = [productId, ...Array.from(recommendationsMap.keys())];
        
        // Fetch matching products
        const matchingProducts = await prisma.product.findMany({
          where: {
            id: { notIn: excludeIds },
            active: true,
            OR: orConditions
          },
          take: limit * 2 // Fetch extra to sort them by rating
        });

        // Basic Math Scoring: Prioritize matching material AND category, then sort by rating
        matchingProducts.sort((a, b) => {
          let scoreA = (a.categoryName === category ? 5 : 0) + (a.material === material ? 5 : 0) + (a.rating || 0);
          let scoreB = (b.categoryName === category ? 5 : 0) + (b.material === material ? 5 : 0) + (b.rating || 0);
          return scoreB - scoreA;
        });

        for (const prod of matchingProducts) {
          if (recommendationsMap.size >= limit) break;
          recommendationsMap.set(prod.id, prod);
        }
      }
    }

    // Step 3: Trending Fallback (Highest Ratings/Reviews)
    if (recommendationsMap.size < limit) {
      const excludeIds = [productId, ...Array.from(recommendationsMap.keys())];
      const trendingProducts = await prisma.product.findMany({
        where: {
          id: { notIn: excludeIds },
          active: true
        },
        orderBy: [
          { reviews: 'desc' },
          { rating: 'desc' },
          { id: 'asc' }
        ],
        take: limit - recommendationsMap.size
      });

      for (const prod of trendingProducts) {
        recommendationsMap.set(prod.id, prod);
      }
    }

    return NextResponse.json({ success: true, products: Array.from(recommendationsMap.values()) });
  } catch (error: any) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
