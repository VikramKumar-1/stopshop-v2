import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { Suspense } from "react";
import { Metadata } from "next";

import { prisma } from "@/lib/db";

type Props = {
  params: { materialName: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function formatName(str: string) {
  if (!str) return "";
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const material = params.materialName;
  const category = searchParams.category as string;
  
  const settings = await prisma.adminSettings.findFirst({
    select: { 
      seoMaterialTitleTemplate: true, 
      seoMaterialDescTemplate: true,
      seoMaterialCategoryTitleTemplate: true,
      seoMaterialCategoryDescTemplate: true
    }
  });

  const matName = formatName(material);
  let title = settings?.seoMaterialTitleTemplate
    ? settings.seoMaterialTitleTemplate.replace(/\[Material\]/g, matName)
    : `Buy Premium ${matName} Utensils & Cookware Online | StopShop`;
    
  let description = settings?.seoMaterialDescTemplate
    ? settings.seoMaterialDescTemplate.replace(/\[Material\]/g, matName)
    : `Shop authentic and premium ${matName} kitchenware, utensils, and bartan. Best prices and worldwide shipping.`;

  if (category) {
    const catName = formatName(category);
    title = settings?.seoMaterialCategoryTitleTemplate
      ? settings.seoMaterialCategoryTitleTemplate.replace(/\[Material\]/g, matName).replace(/\[Category\]/g, catName)
      : `Shop ${matName} ${catName} Online at Best Prices | StopShop`;
      
    description = settings?.seoMaterialCategoryDescTemplate
      ? settings.seoMaterialCategoryDescTemplate.replace(/\[Material\]/g, matName).replace(/\[Category\]/g, catName)
      : `Explore our wide range of premium ${matName} ${catName}. Durable, food-grade, and stylish kitchenware at the best prices.`;
  }

  return { title, description };
}

export default function MaterialProductsPage({ params }: { params: { materialName: string } }) {
  const rawMaterial = params.materialName;

  // Capitalize first letter to match database values (e.g. copper -> Copper)
  const formattedMaterial = rawMaterial
    ? rawMaterial.charAt(0).toUpperCase() + rawMaterial.slice(1).toLowerCase()
    : "";

  return (
    <Suspense fallback={
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    }>
      <ProductCatalog initialMaterialOverride={formattedMaterial} />
    </Suspense>
  );
}
