import { MetadataRoute } from "next";
import { getProductsForSitemap } from "@/features/products/services/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  // Static routes
  const routes = ["", "/products", "/contact", "/about"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // Dynamic product routes from service
    const products = await getProductsForSitemap();

    const productRoutes = products.map((prod: any) => ({
      url: `${baseUrl}/product/${prod.slug || prod.id}`,
      lastModified: prod.createdAt.toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    return routes;
  }
}
