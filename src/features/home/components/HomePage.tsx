"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  HeroSection,
  ShopByCollections,
  FeaturedProducts,
  CategoryProductGrid,
  ShopByMaterial,
  HeritageStory,
  CategoryCards,
  VendorSection,
} from "../index";

// Lazy load below-the-fold components to reduce bundle size and speed up page load
const ExportProgram = dynamic(() => import("./ExportProgram").then(mod => mod.ExportProgram), { ssr: false });
const TestimonialsSection = dynamic(() => import("./TestimonialsSection").then(mod => mod.TestimonialsSection), { ssr: false });
const WhyChooseUs = dynamic(() => import("./WhyChooseUs").then(mod => mod.WhyChooseUs), { ssr: false });
const FAQSection = dynamic(() => import("./FAQSection").then(mod => mod.FAQSection), { ssr: false });
const ShopByVideos = dynamic(() => import("./ShopByVideos").then(mod => mod.ShopByVideos), { ssr: false });
const GiftCollections = dynamic(() => import("./GiftCollections").then(mod => mod.GiftCollections), { ssr: false });

// Mock Fallbacks in case database has no products yet
const mockKitchenUtility = [
  { id: 1, name: "Heritage Bronze Kadai", description: "Heavy-duty pure bronze cooking kadai.", specs: "Weight: 2.4 kg | Hand-Hammered", image: "/bronze-kadai.png", rating: 4.9, reviews: 124, price: 2499, mrp: 3199 },
  { id: 2, name: "Handcrafted Bronze Handi", description: "Elegant deep-cooking pot with lid.", specs: "Capacity: 3 Litres", image: "/bronze-hero.png", rating: 4.7, reviews: 67, price: 3299, mrp: 4499 }
];

export const HomePage = () => {
  const [groupedProducts, setGroupedProducts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchHomeProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        
        // Group products by their Category Name
        const groups: Record<string, any[]> = {};
        data.forEach((product: any) => {
          const catName = product.category?.name || "Premium Collection";
          if (!groups[catName]) {
            groups[catName] = [];
          }
          groups[catName].push(product);
        });

        setGroupedProducts(groups);
      }
    } catch (e) {
      console.error("Failed to load products dynamically on homepage", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeProducts();

    // Auto-refresh homepage products when user switches back to this tab
    const handleFocus = () => {
      fetchHomeProducts();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category Grid */}
      <ShopByCollections />

      {/* 3. Best Sellers */}
      <FeaturedProducts />

      {/* 4. Shop by Material */}
      <ShopByMaterial />

      {/* 5. Dynamic Category Product Grids (Loaded from DB) */}
      {loading ? (
        <section className="pt-8 pb-12 relative overflow-hidden section-glass-ambient ambient-gold border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-end justify-between gap-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-3 w-28 bg-border/60 rounded" />
                <div className="h-7 w-56 bg-border rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-border/60" />
                <div className="w-8 h-8 rounded-full bg-border/60" />
              </div>
            </div>

            {/* Product Cards Grid Skeleton */}
            <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc(50%-8px)] sm:auto-cols-[230px] lg:auto-cols-[250px] gap-4 sm:gap-6 pb-6 overflow-hidden">
              {[...Array(6)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="group shrink-0 w-full flex flex-col justify-between bg-surface-card border border-border rounded-2xl p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-[4/3] w-full bg-border/50 rounded-xl" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-2.5 w-1/3 bg-border/40 rounded" />
                    <div className="h-4.5 w-3/4 bg-border/70 rounded" />
                    <div className="h-4 w-1/2 bg-border/50 rounded" />
                  </div>
                  <div className="h-9 w-full bg-border/80 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : Object.keys(groupedProducts).length === 0 ? (
        // Fallback display if DB is empty
        <>
          <CategoryProductGrid
            title="Kitchen Utility"
            tagLine="Heritage Cooking Essentials"
            products={mockKitchenUtility}
            viewAllLink="/products?category=kitchen-utility"
            accentColor="emerald"
          />
        </>
      ) : (
        // Dynamic generation of sections for categories containing products
        Object.entries(groupedProducts).map(([categoryName, productsList]) => {
          const categorySlug = productsList[0]?.categoryName || "";
          
          // Tailor colors and headers dynamically
          let accentColor = "bronze";
          let tagLine = "Premium Workshop Crafts";

          if (categorySlug === "kitchen-utility") {
            accentColor = "emerald";
            tagLine = "Heritage Cooking Essentials";
          } else if (categorySlug === "brass-cookware") {
            accentColor = "bronze";
            tagLine = "Royal Dining & Serveware";
          } else if (categorySlug === "pooja-collection") {
            accentColor = "rose";
            tagLine = "Sacred Ritual Vessels";
          } else if (categorySlug === "copper-products") {
            accentColor = "bronze";
            tagLine = "Ayurvedic Wellness Essentials";
          } else if (categorySlug === "steel-essentials") {
            accentColor = "emerald";
            tagLine = "Durable Steel Collections";
          } else if (categorySlug === "dinner-sets") {
            accentColor = "rose";
            tagLine = "Exquisite Dining Sets";
          } else if (categorySlug === "home-living") {
            accentColor = "bronze";
            tagLine = "Elegant Household Decor";
          } else if (categorySlug === "handicrafts") {
            accentColor = "rose";
            tagLine = "Individually Hammered Handicrafts";
          }

          return (
            <CategoryProductGrid
              key={categoryName}
              title={categoryName}
              tagLine={tagLine}
              products={productsList}
              viewAllLink={`/products?category=${categorySlug}`}
              accentColor={accentColor}
            />
          );
        })
      )}

      {/* 6. Amazon-style Category Cards */}
      <CategoryCards />

      {/* 10. Heritage + Artisan Story */}
      <HeritageStory />

      {/* Vendor Section - Artisan Clusters */}
      <VendorSection />

      {/* Shop By Videos Section */}
      <ShopByVideos />

      {/* Gift Collections Section */}
      <GiftCollections />

      {/* 11. Export Program */}
      <ExportProgram />

      {/* 12. Customer Reviews */}
      <TestimonialsSection />

      {/* 14. Why StopShop (Trust + Story) */}
      <WhyChooseUs />

      {/* 15. FAQ Section */}
      <FAQSection />
    </>
  );
};
