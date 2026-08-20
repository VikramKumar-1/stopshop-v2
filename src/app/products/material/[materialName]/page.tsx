import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { materialName: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  
  return {
    alternates: {
      canonical: `${baseUrl}/products/material/${params.materialName}`,
    },
  };
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
