"use client";

import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    }>
      <ProductCatalog />
    </Suspense>
  );
}
