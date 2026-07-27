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

    if (sections.length === 0) {
      return NextResponse.json({ sections: [], mobileBanners });
    }

    // Collect all product IDs from all sections
    const allProductIds: number[] = [];
    for (const sec of sections) {
      if (sec.productIds && Array.isArray(sec.productIds)) {
        allProductIds.push(...sec.productIds);
      }
    }

    if (allProductIds.length === 0) {
      return NextResponse.json({ sections: [] });
    }

    // Fetch all products in one query
    const products = await prisma.product.findMany({
      where: { id: { in: allProductIds }, active: true },
      include: { category: true },
    });

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

    // Get accurate count of approved vendors
    const vendorCount = await prisma.user.count({
      where: { role: "vendor", vendorStatus: "APPROVED" }
    });

    return NextResponse.json(
      { sections: populatedSections, mobileBanners, vendorCount },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
        }
      }
    );
  } catch (error: any) {
    console.error("Homepage sections error:", error);
    return NextResponse.json({ sections: [], mobileBanners: [] });
  }
}
