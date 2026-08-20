import { ProductCatalog } from "@/features/products/components/ProductCatalog";
import { Suspense } from "react";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: "All Products - StopShop",
  alternates: {
    canonical: `${baseUrl}/products`,
  },
};

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
