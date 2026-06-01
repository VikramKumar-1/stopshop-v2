"use client";

import { useParams } from "next/navigation";
import { ProductCatalog } from "@/features/products/components/ProductCatalog";

export default function MaterialProductsPage() {
  const params = useParams();
  const rawMaterial = params.materialName as string;

  // Capitalize first letter to match database values (e.g. copper -> Copper)
  const formattedMaterial = rawMaterial
    ? rawMaterial.charAt(0).toUpperCase() + rawMaterial.slice(1).toLowerCase()
    : "";

  return <ProductCatalog initialMaterialOverride={formattedMaterial} />;
}
