import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getProductById, getProductBySlug } from "@/features/products/services/product";
import ProductDetails from "@/features/products/components/ProductDetails";
import { prisma } from "@/lib/db";

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const numericId = parseInt(params.slug);
    const product = isNaN(numericId)
      ? await getProductBySlug(params.slug)
      : await getProductById(numericId);
      
    if (!product) return { title: "Product Not Found | StopShop" };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    return {
      title: `${product.name} — Premium Handcrafted ${product.material} Cookware`,
      description: `${(product.description || "").slice(0, 155)}... Buy 100% authentic, hand-beaten ${product.material} bartan. Export quality certified.`,
      keywords: [product.name, product.material, product.categoryName, "StopShop", "handmade", "authentic", "premium", "cookware"].filter(Boolean).join(", "),
      authors: [{ name: "StopShop" }],
      publisher: "StopShop",
      robots: "index, follow",
      alternates: {
        canonical: `${baseUrl}/product/${product.slug}`,
      },
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.image }],
        url: `${baseUrl}/product/${product.slug}`,
        siteName: "StopShop",
      },
    };
  } catch (err: any) {
    console.error("Error in generateMetadata:", err);
    return { title: "Error | StopShop" };
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  try {
    const numericId = parseInt(params.slug);
    const product = isNaN(numericId)
      ? await getProductBySlug(params.slug)
      : await getProductById(numericId);

    if (!product) {
      notFound();
    }

    // Redirect to slug-based URL for SEO if accessed via ID
    if (!isNaN(numericId) && product.slug) {
      redirect(`/product/${product.slug}`);
    }

    let additionalImages: string[] = [];
    if (product.images) {
      if (Array.isArray(product.images)) {
        additionalImages = product.images as string[];
      } else if (typeof product.images === "string") {
        try {
          additionalImages = JSON.parse(product.images);
        } catch (e) {
          additionalImages = [];
        }
      }
    }
    const allImages = [product.image, ...additionalImages];

    // Fetch cross-sell bundle products
    let bundleProducts: any[] = [];
    if (product.crossSellIds && Array.isArray(product.crossSellIds) && product.crossSellIds.length > 0) {
      bundleProducts = await prisma.product.findMany({
        where: { id: { in: product.crossSellIds as number[] }, active: true },
        select: { id: true, name: true, image: true, price: true, mrp: true }
      });
    }

    return <ProductDetails product={product} allImages={allImages} bundleProducts={bundleProducts} />;
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT") || error.digest === "NEXT_NOT_FOUND" || error.message === "NEXT_NOT_FOUND") {
      throw error;
    }
    console.error("Error in ProductDetailPage server component:", error);
    return (
      <div style={{ padding: "20px", color: "red", background: "#fee" }}>
        <h1>Failed to render product page (Server Component Error)</h1>
        <pre>{error.message || error.toString()}</pre>
        <pre>{error.stack}</pre>
      </div>
    );
  }
}
