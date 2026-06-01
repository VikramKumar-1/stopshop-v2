import { MetadataRoute } from "next";
import { getProductsForSitemap } from "@/features/products/services/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://stopshop.com"; // Replace with your production domain name

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

    const productRoutes = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.id}`,
      lastModified: prod.createdAt.toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    return routes;
  }
}
