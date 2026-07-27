"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";

// Predefined styles for categories
const categoryStylePresets: Record<string, { bgClass: string; fadeClass: string; textColor: string; fallbackImage: string }> = {
  "kitchen-utility": {
    bgClass: "from-[#121E15] to-[#070D09]", // forest green
    fadeClass: "from-[#121E15] to-transparent",
    textColor: "text-emerald-200",
    fallbackImage: "/cat-kitchen-utility.webp",
  },
  "brass-cookware": {
    bgClass: "from-[#251805] to-[#110A01]", // deep bronze
    fadeClass: "from-[#251805] to-transparent",
    textColor: "text-amber-200",
    fallbackImage: "/cat-brass-cookware.webp",
  },
  "copper-products": {
    bgClass: "from-[#2A1005] to-[#110501]", // deep copper
    fadeClass: "from-[#2A1005] to-transparent",
    textColor: "text-orange-200",
    fallbackImage: "/cat-copper-products.webp",
  },
  "steel-essentials": {
    bgClass: "from-[#1F2229] to-[#0E1013]", // slate steel
    fadeClass: "from-[#1F2229] to-transparent",
    textColor: "text-zinc-300",
    fallbackImage: "/cat-steel-essentials.webp",
  },
  "home-living": {
    bgClass: "from-[#24170A] to-[#100903]", // earthy brown
    fadeClass: "from-[#24170A] to-transparent",
    textColor: "text-amber-200/90",
    fallbackImage: "/cat-home-living.webp",
  },
  "bedroom-essentials": {
    bgClass: "from-[#0F1626] to-[#070B14]", // indigo
    fadeClass: "from-[#0F1626] to-transparent",
    textColor: "text-indigo-200",
    fallbackImage: "/cat-home-living.webp",
  },
  "living-room": {
    bgClass: "from-[#261016] to-[#110408]", // warm burgundy
    fadeClass: "from-[#261016] to-transparent",
    textColor: "text-rose-200",
    fallbackImage: "/cat-living-room.webp",
  },
  "handicrafts": {
    bgClass: "from-[#1D1026] to-[#0D0412]", // deep purple
    fadeClass: "from-[#1D1026] to-transparent",
    textColor: "text-purple-200",
    fallbackImage: "/cat-handicrafts.webp",
  },
  "pooja-collection": {
    bgClass: "from-[#2B0E0E] to-[#130303]", // crimson red
    fadeClass: "from-[#2B0E0E] to-transparent",
    textColor: "text-red-200",
    fallbackImage: "/cat-pooja-collection.webp",
  },
  "kitchen-racks": {
    bgClass: "from-[#0D1F1D] to-[#040C0B]", // teal
    fadeClass: "from-[#0D1F1D] to-transparent",
    textColor: "text-teal-200",
    fallbackImage: "/cat-kitchen-racks.webp",
  },
  "dinner-sets": {
    bgClass: "from-[#2A1005] to-[#110501]", // deep copper/bronze
    fadeClass: "from-[#2A1005] to-transparent",
    textColor: "text-amber-200",
    fallbackImage: "/cat-dinner-sets.webp", 
  },
};

// Default styling fallback for new dynamic categories
const defaultCategoryStyle = {
  bgClass: "from-[#251805] to-[#110A01]", // premium deep bronze
  fadeClass: "from-[#251805] to-transparent",
  textColor: "text-amber-200",
  fallbackImage: "/logo4.jpg"
};

const defaultCategoriesList = [
  { id: "brass-cookware", name: "Brass Cookware", image: "/cat-brass-cookware.webp", ...categoryStylePresets["brass-cookware"] },
  { id: "copper-products", name: "Copper Products", image: "/cat-copper-products.webp", ...categoryStylePresets["copper-products"] },
  { id: "dinner-sets", name: "Dinner Sets", image: "/cat-dinner-sets.webp", ...categoryStylePresets["dinner-sets"] },
  { id: "handicrafts", name: "Handicrafts", image: "/cat-handicrafts.webp", ...categoryStylePresets["handicrafts"] },
  { id: "home-living", name: "Home Living", image: "/cat-home-living.webp", ...categoryStylePresets["home-living"] },
  { id: "kitchen-racks", name: "Kitchen Racks", image: "/cat-kitchen-racks.webp", ...categoryStylePresets["kitchen-racks"] },
  { id: "kitchen-utility", name: "Kitchen Utility", image: "/cat-kitchen-utility.webp", ...categoryStylePresets["kitchen-utility"] },
  { id: "living-room", name: "Living Room", image: "/cat-living-room.webp", ...categoryStylePresets["living-room"] },
  { id: "pooja-collection", name: "Pooja Collection", image: "/cat-pooja-collection.webp", ...categoryStylePresets["pooja-collection"] },
  { id: "steel-essentials", name: "Steel Essentials", image: "/cat-steel-essentials.webp", ...categoryStylePresets["steel-essentials"] },
];

export const ShopByCollections = ({ categoriesData }: { categoriesData?: any[] }) => {
  const [categoriesList, setCategoriesList] = useState<any[]>(defaultCategoriesList);

  useEffect(() => {
    const rawData = categoriesData || [];
    if (rawData.length > 0) {
      const formatted = rawData
        .filter((cat: any) => cat.slug !== "bedroom-essentials")
        .map((cat: any) => {
          const preset = categoryStylePresets[cat.slug] || defaultCategoryStyle;
          
          const oldGenericImages = [
            "/bronze-kadai.webp", "/bronze-hero.webp", "/bronze-lota.webp", 
            "/collection-tableware.webp", "/collection-pooja.webp", "/logo4.jpg"
          ];
          
          let finalImage = cat.image;
          if (!finalImage || oldGenericImages.includes(finalImage)) {
            finalImage = preset.fallbackImage;
          }
          // Auto-upgrade old .png category images to compressed .webp
          if (finalImage && finalImage.startsWith("/cat-") && finalImage.endsWith(".png")) {
            finalImage = finalImage.replace(".png", ".webp");
          }

          return {
            id: cat.slug,
            name: cat.name,
            image: finalImage,
            bgClass: preset.bgClass,
            fadeClass: preset.fadeClass,
            textColor: preset.textColor,
          };
        });
      setCategoriesList(formatted);
    }
  }, [categoriesData]);

  const displayCategories = categoriesList.length > 0 ? categoriesList : defaultCategoriesList;

  return (
    <section className="lazy-scroll-section pt-3 pb-2 md:pt-4 md:pb-3 relative overflow-hidden bg-surface border-y border-bronze-500/10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 md:mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-bronze-500" />
            Shop by Category
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading">
            Explore Our <span className="gradient-text">Collections</span>
          </h2>
        </div>

        {/* Categories Grid - Increased max-width for larger cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {displayCategories.map((cat, index) => (
            <div
              key={cat.id}
              className="group relative block w-full aspect-[1.2/1] rounded-2xl sm:rounded-3xl overflow-hidden border border-bronze-500/10 hover:border-bronze-500/30 bg-bronze-900 shadow-sm"
            >
              <Link href={`/products?category=${cat.id}`} className="flex flex-col w-full h-full">
                
                {/* Upper portion: Image container */}
                <div className="relative w-full h-[60%] overflow-hidden bg-black/10">
                  <Image
                    src={cat.image || "/logo4.jpg"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority
                    loading="eager"
                    unoptimized={!(cat.image || "").includes("cloudinary")}
                    className="object-cover"
                  />
                  {/* Subtle fade transition between image and text */}
                  <div className={`absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t ${cat.fadeClass} pointer-events-none`} />
                </div>

                {/* Lower portion: Centered Text Area */}
                <div className={`relative w-full h-[40%] bg-gradient-to-br ${cat.bgClass} px-3 sm:px-4 flex items-center justify-center text-center z-10`}>
                  <h3 className="text-[11px] sm:text-xs md:text-sm lg:text-base font-display font-bold text-white leading-snug line-clamp-2">
                    {cat.name}
                  </h3>
                </div>

              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
