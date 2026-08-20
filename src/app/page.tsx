import React from "react";
import { Metadata } from "next";
import { HomePage } from "@/features/home";
import { prisma } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  alternates: {
    canonical: baseUrl,
  },
};

export const revalidate = 60; // ISR: regenerate page every 60 seconds

export default async function HomeRoute() {
  try {
    const [initialProducts, settings, vendorCount, categories] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        take: 60,
        orderBy: { createdAt: "desc" },
        include: { category: true }
      }),
      prisma.adminSettings.findFirst({ select: { homepageSections: true, mobileBanners: true } }),
      prisma.user.count({ where: { role: "vendor", vendorStatus: "APPROVED" } }),
      prisma.category.findMany({ orderBy: { name: "asc" } })
    ]);

    const sections = (settings?.homepageSections as any[] | null) || [];
    const mobileBanners = (settings?.mobileBanners as any[] | null) || [];
    const allProductIds: number[] = [];
    for (const sec of sections) {
      if (sec.productIds && Array.isArray(sec.productIds)) {
        allProductIds.push(...sec.productIds);
      }
    }

    const sectionProducts = allProductIds.length > 0
      ? await prisma.product.findMany({ where: { id: { in: allProductIds }, active: true }, include: { category: true } })
      : [];
    const productMap = new Map(sectionProducts.map((p) => [p.id, p]));

    const populatedSections = sections
      .map((sec: any) => ({
        slug: sec.slug,
        title: sec.title || sec.slug,
        products: (sec.productIds || []).map((id: number) => productMap.get(id)).filter(Boolean),
      }))
      .filter((sec: any) => sec.products.length > 0);

    const initialHpData = { sections: populatedSections, mobileBanners, vendorCount, categories };

    return <HomePage initialProducts={initialProducts} initialHpData={initialHpData} />;
  } catch (error) {
    console.error("Failed server prefetch for homepage:", error);
    return <HomePage />;
  }
}
