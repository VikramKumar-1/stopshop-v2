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
} from "../index";
import { BlinkitMobileSection } from "./BlinkitMobileSection";

// Lazy load below-the-fold components to reduce bundle size and speed up page load
const ExportProgram = dynamic(() => import("./ExportProgram").then(mod => mod.ExportProgram), { ssr: false });
const TestimonialsSection = dynamic(() => import("./TestimonialsSection").then(mod => mod.TestimonialsSection), { ssr: false });
const WhyChooseUs = dynamic(() => import("./WhyChooseUs").then(mod => mod.WhyChooseUs), { ssr: false });
const FAQSection = dynamic(() => import("./FAQSection").then(mod => mod.FAQSection), { ssr: false });

// Mock Fallbacks in case database has no products yet
const generateMock = (base: any[]) => {
  return Array.from({ length: 12 }).map((_, i) => ({
    ...base[i % base.length],
    id: base[i % base.length].id * 100 + i,
  }));
};

const mockKitchenUtility = generateMock([
  { id: 1, name: "Heritage Bronze Kadai", description: "Heavy-duty pure bronze cooking kadai.", specs: "Weight: 2.4 kg | Hand-Hammered", image: "/bronze-kadai.webp", rating: 4.9, reviews: 124, price: 2499, mrp: 3199, material: "Bronze", categoryName: "kitchen-utility" },
  { id: 2, name: "Handcrafted Bronze Handi", description: "Elegant deep-cooking pot with lid.", specs: "Capacity: 3 Litres", image: "/bronze-hero.webp", rating: 4.7, reviews: 67, price: 3299, mrp: 4499, material: "Bronze", categoryName: "kitchen-utility" }
]);

const mockPoojaCollection = generateMock([
  { id: 101, name: "Premium Brass Puja Thali Set", description: "Complete handcrafted puja thali with components.", specs: "Material: Brass | 7 Pieces", image: "/collection-pooja.webp", rating: 4.8, reviews: 89, price: 1899, mrp: 2499, material: "Brass", categoryName: "pooja-collection" },
  { id: 102, name: "Hand-Hammered Copper Lota", description: "Traditional copper vessel for prayer water.", specs: "Material: Copper | 500ml", image: "/bronze-lota.webp", rating: 4.9, reviews: 210, price: 899, mrp: 1299, material: "Copper", categoryName: "pooja-collection" }
]);

const mockBrassCookware = generateMock([
  { id: 201, name: "Royal Brass Cookware Kadai", description: "Traditional solid brass cooking vessel.", specs: "Material: Brass | 2.5 Litre", image: "/bronze-kadai.webp", rating: 4.8, reviews: 54, price: 2899, mrp: 3599, material: "Brass", categoryName: "brass-cookware" },
  { id: 202, name: "Artisan Brass Patila Pot", description: "Deep-bottom brass pot for milk and curries.", specs: "Capacity: 2 Litres", image: "/bronze-hero.webp", rating: 4.6, reviews: 32, price: 3599, mrp: 4299, material: "Brass", categoryName: "brass-cookware" }
]);

const mockCopperProducts = generateMock([
  { id: 301, name: "Ayurvedic Pure Copper Water Bottle", description: "Joint-less pure copper leakproof water bottle.", specs: "Capacity: 1 Litre", image: "/bronze-lota.webp", rating: 4.9, reviews: 342, price: 999, mrp: 1399, material: "Copper", categoryName: "copper-products" },
  { id: 302, name: "Traditional Copper Hammered Jug Set", description: "Elegant copper jug with matching glasses.", specs: "1 Jug + 2 Glasses", image: "/collection-tableware.webp", rating: 4.7, reviews: 118, price: 1899, mrp: 2499, material: "Copper", categoryName: "copper-products" }
]);

const mockSteelEssentials = generateMock([
  { id: 401, name: "Premium Tri-Ply Stainless Steel Frypan", description: "High-grade tri-ply stainless steel skillet.", specs: "Diameter: 24cm", image: "/collection-tableware.webp", rating: 4.8, reviews: 93, price: 1499, mrp: 1999, material: "Steel", categoryName: "steel-essentials" },
  { id: 402, name: "Durable Steel Storage Containers", description: "Airtight modular kitchen container set.", specs: "Set of 3 Containers", image: "/bronze-kadai.webp", rating: 4.6, reviews: 45, price: 799, mrp: 1099, material: "Steel", categoryName: "steel-essentials" }
]);

const mockDinnerSets = generateMock([
  { id: 501, name: "Vedic Bronze Thali Dinner Set", description: "Traditional pure bronze dinner set.", specs: "Kansa / Bronze | 6 Pieces", image: "/collection-tableware.webp", rating: 4.9, reviews: 156, price: 4999, mrp: 5999, material: "Bronze", categoryName: "dinner-sets" },
  { id: 502, name: "Royal Brass Dinner Set", description: "Exquisite solid brass design dinner set.", specs: "Brass | 5 Pieces", image: "/collection-tableware.webp", rating: 4.8, reviews: 78, price: 3899, mrp: 4599, material: "Brass", categoryName: "dinner-sets" }
]);

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export const HomePage = ({ initialProducts, initialHpData }: { initialProducts?: any[]; initialHpData?: any }) => {
  const { data: allProducts, isLoading: loadingProducts } = useSWR('/api/products?take=60', fetcher, { fallbackData: initialProducts });
  const { data: hpData, isLoading: loadingSections } = useSWR('/api/homepage', fetcher, { fallbackData: initialHpData });

  const groupedProducts = React.useMemo(() => {
    if (allProducts && Array.isArray(allProducts) && allProducts.length > 0) {
      const groups: Record<string, any[]> = {};
      allProducts.forEach((product: any) => {
        const catName = product.category?.name || "Premium Collection";
        if (!groups[catName]) {
          groups[catName] = [];
        }
        groups[catName].push(product);
      });
      return groups;
    }
    return {
      "Kitchen Utility": mockKitchenUtility,
      "Pooja Collection": mockPoojaCollection,
      "Brass Cookware": mockBrassCookware,
      "Copper Products": mockCopperProducts,
      "Steel Essentials": mockSteelEssentials,
      "Dinner Sets": mockDinnerSets,
    };
  }, [allProducts]);

  const [homepageSections, setHomepageSections] = useState<any[]>([]);
  const [mobileBanners, setMobileBanners] = useState<any[]>([]);
  const [showBelowFold, setShowBelowFold] = useState(false);

  useEffect(() => {
    // Defer rendering of heavy below-the-fold grids to ensure instant tab switching on mobile
    const timer = setTimeout(() => setShowBelowFold(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hpData) {
      if (hpData.sections) setHomepageSections(hpData.sections);
      if (hpData.mobileBanners) setMobileBanners(hpData.mobileBanners);
    }
  }, [hpData]);

  const loading = (loadingProducts || loadingSections) && Object.keys(groupedProducts).length === 0;

  const hasCategory = (slug: string) => {
    return Object.entries(groupedProducts).some(([name, products]) => {
      const prodSlug = products[0]?.categoryName || "";
      const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return prodSlug === slug || normalizedName.includes(slug) || slug.includes(normalizedName);
    });
  };

  // Compute Best Seller products (Admin controlled + Top Rated/Featured filter)
  const bestSellerSection = homepageSections.find((s: any) => s.slug === "best-sellers");
  const manualBestSellers = bestSellerSection?.products || [];
  const manualIds = new Set(manualBestSellers.map((p: any) => p.id));
  
  let autoBestSellers: any[] = [];
  if (manualBestSellers.length < 15 && allProducts) {
    const candidates = (allProducts || []).filter((p: any) => !manualIds.has(p.id));
    
    // Only auto-fill with products that are explicitly featured or have actual reviews/sales
    const qualified = candidates.filter((p: any) => p.featured || (p.reviews && p.reviews > 0));
    
    qualified.sort((a: any, b: any) => {
      if (b.featured !== a.featured) return b.featured ? 1 : -1;
      if ((b.reviews || 0) !== (a.reviews || 0)) return (b.reviews || 0) - (a.reviews || 0);
      return (b.rating || 0) - (a.rating || 0);
    });

    if (qualified.length > 0) {
      autoBestSellers = qualified.slice(0, 15 - manualBestSellers.length);
    } else if (manualBestSellers.length === 0) {
      // Fallback only if database has featured items
      autoBestSellers = candidates.filter((p: any) => p.featured).slice(0, 15);
    }
  }
  const bestSellerProducts = [...manualBestSellers, ...autoBestSellers];

  return (
    <>
      {/* Blinkit-style mobile section (category grid + banners) — mobile only */}
      <BlinkitMobileSection banners={mobileBanners} />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category Grid */}
      <ShopByCollections categoriesData={hpData?.categories} />

      {/* 3. Best Sellers */}
      <FeaturedProducts products={bestSellerProducts.length > 0 ? bestSellerProducts : undefined} />

      {/* 4. Shop by Material */}
      {showBelowFold && (
        <>
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
      ) : Object.keys(groupedProducts).length === 0 && homepageSections.length === 0 ? (
        // Fallback display if DB is empty and no admin sections - Render ALL mock sections
        <>
          <CategoryProductGrid title="Kitchen Utility" tagLine="Heritage Cooking Essentials" products={mockKitchenUtility} viewAllLink="/products?category=kitchen-utility" accentColor="emerald" isAboveFold />
          <CategoryProductGrid title="Brass Cookware" tagLine="Royal Dining & Serveware" products={mockBrassCookware} viewAllLink="/products?category=brass-cookware" accentColor="bronze" />
          <CategoryProductGrid title="Pooja Collection" tagLine="Sacred Ritual Vessels" products={mockPoojaCollection} viewAllLink="/products?category=pooja-collection" accentColor="rose" />
          <CategoryProductGrid title="Copper Products" tagLine="Ayurvedic Wellness Essentials" products={mockCopperProducts} viewAllLink="/products?category=copper-products" accentColor="bronze" />
          <CategoryProductGrid title="Steel Essentials" tagLine="Durable Steel Collections" products={mockSteelEssentials} viewAllLink="/products?category=steel-essentials" accentColor="emerald" />
          <CategoryProductGrid title="Dinner Sets" tagLine="Exquisite Dining Sets" products={mockDinnerSets} viewAllLink="/products?category=dinner-sets" accentColor="bronze" />
        </>
      ) : (() => {
        // Merge admin-configured sections + remaining DB categories
        const getAccent = (slug: string) => {
          if (slug === "best-sellers") return { accentColor: "rose", tagLine: "Handpicked Top Rated & Most Popular Products" };
          if (slug === "kitchen-utility") return { accentColor: "emerald", tagLine: "Heritage Cooking Essentials" };
          if (slug === "brass-cookware") return { accentColor: "bronze", tagLine: "Royal Dining & Serveware" };
          if (slug === "pooja-collection") return { accentColor: "rose", tagLine: "Sacred Ritual Vessels" };
          if (slug === "copper-products") return { accentColor: "bronze", tagLine: "Ayurvedic Wellness Essentials" };
          if (slug === "steel-essentials") return { accentColor: "emerald", tagLine: "Durable Steel Collections" };
          if (slug === "dinner-sets") return { accentColor: "bronze", tagLine: "Exquisite Dining Sets" };
          return { accentColor: "bronze", tagLine: "Premium Workshop Crafts" };
        };

        // Filter out best-sellers since it is already rendered in <FeaturedProducts /> above
        const sectionsToRender = homepageSections.filter((s: any) => s.slug !== "best-sellers");

        // Track which category slugs admin has configured
        const adminConfiguredSlugs = new Set(sectionsToRender.map((s: any) => s.slug));

        return (
          <>
            {/* 1. Admin-configured sections first — show assigned products + auto-fill remaining up to 15 */}
            {sectionsToRender.map((section: any, sectionIdx: number) => {
              const { accentColor, tagLine } = getAccent(section.slug);
              
              const manualProducts = section.products || [];
              const manualIds = new Set(manualProducts.map((p: any) => p.id));
              let autoProducts = [];

              if (manualProducts.length < 15) {
                if (section.slug === "best-sellers") {
                  const allAvailable = Object.values(groupedProducts).flat() as any[];
                  autoProducts = allAvailable
                    .filter((p: any) => !manualIds.has(p.id))
                    .sort((a: any, b: any) => (b.rating || 5) - (a.rating || 5))
                    .slice(0, 15 - manualProducts.length);
                } else {
                  const listEntry = Object.entries(groupedProducts).find(([_, list]: any) => list[0]?.categoryName === section.slug);
                  const availableAuto = listEntry ? (listEntry[1] as any[]) : [];
                  autoProducts = availableAuto
                    .filter((p: any) => !manualIds.has(p.id))
                    .slice(0, 15 - manualProducts.length);
                }
              }

              const finalProducts = [...manualProducts, ...autoProducts];
              if (finalProducts.length === 0) return null;

              return (
                <CategoryProductGrid
                  key={`hp-${section.slug}`}
                  title={section.title || section.slug}
                  tagLine={tagLine}
                  products={finalProducts}
                  viewAllLink={section.slug === "best-sellers" ? "/products" : `/products?category=${section.slug}`}
                  accentColor={accentColor}
                  isAboveFold={sectionIdx === 0}
                />
              );
            })}

            {/* 2. Remaining categories from DB that admin hasn't configured */}
            {Object.entries(groupedProducts).map(([categoryName, productsList]) => {
              const categorySlug = productsList[0]?.categoryName || "";
              // Skip if admin already configured this category
              if (adminConfiguredSlugs.has(categorySlug)) return null;

              const { accentColor, tagLine } = getAccent(categorySlug);
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
            })}

            {/* 3. Mock fallbacks for categories not in DB at all */}
            {!hasCategory("kitchen-utility") && !adminConfiguredSlugs.has("kitchen-utility") && (
              <CategoryProductGrid title="Kitchen Utility" tagLine="Heritage Cooking Essentials" products={mockKitchenUtility} viewAllLink="/products?category=kitchen-utility" accentColor="emerald" />
            )}
            {!hasCategory("brass-cookware") && !adminConfiguredSlugs.has("brass-cookware") && (
              <CategoryProductGrid title="Brass Cookware" tagLine="Royal Dining & Serveware" products={mockBrassCookware} viewAllLink="/products?category=brass-cookware" accentColor="bronze" />
            )}
            {!hasCategory("pooja-collection") && !adminConfiguredSlugs.has("pooja-collection") && (
              <CategoryProductGrid title="Pooja Collection" tagLine="Sacred Ritual Vessels" products={mockPoojaCollection} viewAllLink="/products?category=pooja-collection" accentColor="rose" />
            )}
            {!hasCategory("copper-products") && !adminConfiguredSlugs.has("copper-products") && (
              <CategoryProductGrid title="Copper Products" tagLine="Ayurvedic Wellness Essentials" products={mockCopperProducts} viewAllLink="/products?category=copper-products" accentColor="bronze" />
            )}
            {!hasCategory("steel-essentials") && !adminConfiguredSlugs.has("steel-essentials") && (
              <CategoryProductGrid title="Steel Essentials" tagLine="Durable Steel Collections" products={mockSteelEssentials} viewAllLink="/products?category=steel-essentials" accentColor="emerald" />
            )}
            {!hasCategory("dinner-sets") && !adminConfiguredSlugs.has("dinner-sets") && (
              <CategoryProductGrid title="Dinner Sets" tagLine="Exquisite Dining Sets" products={mockDinnerSets} viewAllLink="/products?category=dinner-sets" accentColor="bronze" />
            )}
          </>
        );
      })()}

      {/* 10. Heritage + Artisan Story */}
      <HeritageStory vendorCount={hpData?.vendorCount || 0} />

      {/* 11. Export Program */}
      <ExportProgram />

      {/* 12. Customer Reviews */}
      <TestimonialsSection />

      {/* 14. Why StopShop (Trust + Story) */}
      <WhyChooseUs />

      {/* 15. FAQ Section */}
      <FAQSection />
        </>
      )}
    </>
  );
};
