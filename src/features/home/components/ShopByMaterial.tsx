"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

const materials = [
  {
    id: "brass",
    name: "Pure Brass",
    tagline: "Timeless Golden Warmth",
    description: "Traditional Indian brass crafted for cookware and décor.",
    image: "/bronze-hero.png",
    productCount: "48 Products",
    bgClass: "from-[#251805] to-[#110A01]",
    textColor: "text-amber-200",
  },
  {
    id: "copper",
    name: "Ayur Copper",
    tagline: "Ayurvedic Wellness Metal",
    description: "Pure copper vessels known for health benefits.",
    image: "/bronze-lota.png",
    productCount: "36 Products",
    bgClass: "from-[#2A1005] to-[#110501]",
    textColor: "text-orange-200",
  },
  {
    id: "steel",
    name: "Modern Steel",
    tagline: "Durability Meets Design",
    description: "Premium stainless steel kitchenware built to last.",
    image: "/collection-tableware.png",
    productCount: "52 Products",
    bgClass: "from-[#1F2229] to-[#0E1013]",
    textColor: "text-zinc-300",
  },
  {
    id: "ceramic",
    name: "Artisan Ceramic",
    tagline: "Earthy Indian Motifs",
    description: "Hand-painted ceramic serving pieces and dinnerware.",
    image: "/bronze-kadai.png",
    productCount: "24 Products",
    bgClass: "from-[#121E15] to-[#070D09]",
    textColor: "text-emerald-200",
  },
  {
    id: "glass",
    name: "Crystal Glass",
    tagline: "Hand-Blown Transparency",
    description: "Designer glassware and home décor pieces.",
    image: "/collection-tableware.png",
    productCount: "18 Products",
    bgClass: "from-[#0F1626] to-[#070B14]",
    textColor: "text-indigo-200",
  },
];

export const ShopByMaterial = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="pt-3 pb-2 md:pt-4 md:pb-3 relative overflow-hidden bg-surface border-y border-bronze-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between mb-2.5 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-light text-[8px] sm:text-[9px] font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-1.5">
              <span className="w-1 h-1 rounded-full bg-bronze-500" />
              Premium Materials
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading">
              Shop by <span className="gradient-text">Material</span>
            </h2>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card text-orange-700 dark:text-orange-300 shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card text-orange-700 dark:text-orange-300 shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Material Cards Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {materials.map((material) => (
            <div
              key={material.id}
              className="shrink-0 w-[290px] sm:w-[400px] md:w-[440px] aspect-[16/10] sm:aspect-[1.8/1] relative rounded-3xl overflow-hidden shadow-lg border border-bronze-500/10 will-change-transform [contain:paint]"
            >
              <Link
                href={`/products/material/${material.id}`}
                className="relative block w-full h-full transform-gpu"
              >
                {/* Background Color/Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${material.bgClass}`} />

                {/* Left Side Content */}
                <div className="absolute inset-y-0 left-0 w-[55%] flex flex-col justify-between p-4 sm:p-6 z-10">
                  <div className="space-y-1 sm:space-y-2">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-orange-400 dark:text-bronze-300 uppercase">
                      {material.productCount}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
                      {material.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-300/80 leading-snug line-clamp-2">
                      {material.tagline}
                    </p>
                  </div>

                  {/* EXPLORE Button */}
                  <div>
                    <span className="inline-block bg-white text-stone-950 font-sans font-bold text-[8px] sm:text-[10px] tracking-wider uppercase px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl shadow-md leading-none">
                      Explore
                    </span>
                  </div>
                </div>

                {/* Right Side Image */}
                <div className="absolute bottom-3.5 right-2 sm:right-3 w-[45%] h-[78%] z-0 select-none pointer-events-none overflow-hidden rounded-2xl">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-full object-cover object-bottom"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
