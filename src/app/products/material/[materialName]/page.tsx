import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata({ params, searchParams }: { params: { materialName: string }, searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  
  const query = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) query.set(key, Array.isArray(value) ? value[0] : value);
  });
  const queryString = query.toString();
  const canonical = `${baseUrl}/products/material/${params.materialName}${queryString ? `?${queryString}` : ""}`;

  return {
    alternates: {
      canonical,
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
