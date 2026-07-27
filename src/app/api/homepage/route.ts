import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.adminSettings.findFirst({
      select: { homepageSections: true, mobileBanners: true },
    });

    const sections = (settings?.homepageSections as any[] | null) || [];
    const mobileBanners = (settings?.mobileBanners as any[] | null) || [];

    // Collect all product IDs from all sections
    const allProductIds: number[] = [];
    for (const sec of sections) {
      if (sec.productIds && Array.isArray(sec.productIds)) {
        allProductIds.push(...sec.productIds);
      }
    }

    // Fire ALL independent DB queries in parallel (products + vendor count + categories)
    const [products, vendorCount, categories] = await Promise.all([
      allProductIds.length > 0
        ? prisma.product.findMany({
            where: { id: { in: allProductIds }, active: true },
            include: { category: true },
          })
        : Promise.resolve([]),
      prisma.user.count({
        where: { role: "vendor", vendorStatus: "APPROVED" }
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" }
      })
    ]);

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Build response: sections with populated products
    const populatedSections = sections
      .map((sec: any) => {
        const sectionProducts = (sec.productIds || [])
          .map((id: number) => productMap.get(id))
          .filter(Boolean);

        return {
          slug: sec.slug,
          title: sec.title || sec.slug,
          products: sectionProducts,
        };
      })
      .filter((sec: any) => sec.products.length > 0);

    return NextResponse.json(
      { sections: populatedSections, mobileBanners, vendorCount, categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
        }
      }
    );
  } catch (error: any) {
    console.error("Homepage sections error:", error);
    return NextResponse.json({ sections: [], mobileBanners: [], categories: [] });
  }
}
