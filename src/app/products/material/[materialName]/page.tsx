"use client";

import { useParams } from "next/navigation";
import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { Suspense } from "react";

export default function MaterialProductsPage() {
  const params = useParams();
  const rawMaterial = params.materialName as string;

  // Capitalize first letter to match database values (e.g. copper -> Copper)
  const formattedMaterial = rawMaterial
    ? rawMaterial.charAt(0).toUpperCase() + rawMaterial.slice(1).toLowerCase()
    : "";

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    }>
      <ProductCatalog initialMaterialOverride={formattedMaterial} />
    </Suspense>
  );
}
