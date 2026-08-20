import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { Suspense } from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

function formatName(str: string) {
  if (!str) return "";
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const category = searchParams.category as string;
  const search = searchParams.search as string;

  const settings = await prisma.adminSettings.findFirst({
    select: { seoCategoryTitleTemplate: true, seoCategoryDescTemplate: true }
  });

  let title = "Explore Our Collections | Premium Kitchenware | StopShop";
  let description = "Discover our premium range of utensils, cookware, and brass artifacts at StopShop. Buy authentic Indian kitchenware online.";

  if (category) {
    const catName = formatName(category);
    title = settings?.seoCategoryTitleTemplate 
      ? settings.seoCategoryTitleTemplate.replace(/\[Category\]/g, catName)
      : `Buy ${catName} Online | Best Kitchen Utensils | StopShop`;
      
    description = settings?.seoCategoryDescTemplate
      ? settings.seoCategoryDescTemplate.replace(/\[Category\]/g, catName)
      : `Explore our wide range of premium ${catName}. Durable, food-grade, and stylish kitchenware at the best prices. Order now with home delivery!`;
  } else if (search) {
    title = `Search results for "${search}" | StopShop`;
    description = `Find the best ${search} at StopShop. Premium quality kitchenware and bartan.`;
  }

  return { title, description };
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    }>
      <ProductCatalog />
    </Suspense>
  );
}
