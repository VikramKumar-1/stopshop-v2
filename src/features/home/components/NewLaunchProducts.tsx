"use client";

import { ArrowRight, Star, Sparkles, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useRegion } from "@/context/RegionContext";

const newProducts = [
  {
    id: 1,
    name: "Pure Kansa Tumbler Set",
    tag: "New Launch",
    tagColor: "from-rose-500 to-orange-500",
    description: "Set of 6 premium handcrafted bell metal (Kansa) water glasses with an exquisite mirror-finish polish.",
    specs: "Set of 6 | 320ml | Mirror Finish",
    image: "/bronze-lota.webp",
    rating: 5.0,
    reviews: 8
  },
  {
    id: 2,
    name: "Artisanal Spice Box (Masala Dani)",
    tag: "Exclusive",
    tagColor: "from-teal-500 to-bronze-500",
    description: "An elegant kitchen organizer containing 7 individual bronze bowls protected by a hand-carved floral lid.",
    specs: "7 Bowls | Engraved Floral Lid",
    image: "/bronze-hero.webp",
    rating: 4.9,
    reviews: 14
  },
  {
    id: 3,
    name: "Heavy-Duty Bronze Frypan",
    tag: "Just Added",
    tagColor: "from-purple-500 to-indigo-500",
    description: "Premium heavy-gauge bronze frypan with an insulated handle, optimized for roasting spices and quick cooking.",
    specs: "Diameter: 9.5 inches | Induction Friendly",
    image: "/bronze-kadai.webp",
    rating: 4.8,
    reviews: 6
  },
  {
    id: 4,
    name: "Royal Bronze Jug",
    tag: "New Launch",
    tagColor: "from-orange-600 to-red-500",
    description: "Traditional wellness water jug handcrafted from pure bronze to boost digestion and purify your daily drinking water.",
    specs: "Capacity: 2 Litres | 100% Lead-Free",
    image: "/bronze-lota.webp",
    rating: 5.0,
    reviews: 5
  }
];

export const NewLaunchProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { convertWeight } = useRegion();
  const isScrollingRef = useRef(false);
  const dragThreshold = 8;
  const startX = useRef(0);
  const startY = useRef(0);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startX.current = clientX;
    startY.current = clientY;
    isScrollingRef.current = false;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaX = Math.abs(clientX - startX.current);
    const deltaY = Math.abs(clientY - startY.current);
    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      isScrollingRef.current = true;
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isScrollingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="pt-3 md:pt-4 pb-10 md:pb-12 relative overflow-hidden bg-premium-dark-bronze">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-6">
          <div className="max-w-xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-xs font-semibold text-orange-200 border border-orange-500/20 tracking-wider uppercase mb-4"
            >
              <Sparkles size={14} className="text-orange-400" />
              Latest Arrivals
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-orange-100">
              New <span className="gradient-text">Launch Products</span>
            </h2>
          </div>

          {/* Navigation controls (Arrows) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-orange-500/20 bg-white/5 hover:bg-white/10 text-orange-100 shadow-md hover:shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-orange-500/20 bg-white/5 hover:bg-white/10 text-orange-100 shadow-md hover:shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Product Container */}
        <div
          ref={scrollRef}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
          onTouchMove={handleDragMove}
          onMouseMove={handleDragMove}
          className="flex overflow-x-auto gap-6 pb-8 pt-2 scrollbar-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {newProducts.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[290px] sm:w-[330px] flex flex-col justify-between bg-surface-card border border-bronze-500/[0.14] rounded-3xl overflow-hidden shadow-sm"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50 dark:bg-white/5">
                <div className={`absolute top-4 left-4 z-20 bg-gradient-to-r ${product.tagColor} text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg`}>
                  {product.tag}
                </div>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-w-330px) 100vw, 330px"
                  loading="lazy"
                  className="object-cover"
                />

              </div>

              {/* Product Info */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5 text-[11px]">
                    <div className="flex items-center text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" className="stroke-none" />
                      ))}
                    </div>
                    <span className="font-semibold text-heading">{product.rating}</span>
                    <span className="text-muted">({product.reviews})</span>
                  </div>

                  <h3 className="text-lg font-bold text-heading mb-2 leading-snug line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-body line-clamp-2 mb-4 leading-relaxed h-[36px]">
                    {product.description}
                  </p>
                </div>

                <div>
                  {/* Specs scroll list */}
                  <div className="flex gap-1 overflow-x-auto scrollbar-none py-0.5 no-scrollbar max-w-full mb-5">
                    {product.specs ? (
                      product.specs.split(" | ").map((spec, i) => (
                        <span key={i} className="whitespace-nowrap shrink-0 px-2 py-0.5 rounded-full bg-orange-500/5 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 text-[8px] sm:text-[10px] font-bold border border-orange-500/10">
                          {spec.toLowerCase().includes("kg") || spec.toLowerCase().includes("gm") || spec.toLowerCase().includes("lbs")
                            ? convertWeight(spec)
                            : spec}
                        </span>
                      ))
                    ) : (
                      <span className="whitespace-nowrap shrink-0 px-2 py-0.5 rounded-full bg-orange-500/5 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 text-[8px] sm:text-[10px] font-bold border border-orange-500/10">
                        Standard
                      </span>
                    )}
                  </div>

                  <Link
                    href="/contact"
                    onClickCapture={handleLinkClick}
                    className="group/btn inline-flex items-center justify-center gap-1.5 px-5 py-3 w-full rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-semibold shadow-md shadow-bronze-500/10 hover:shadow-lg hover:shadow-bronze-500/25 text-xs"
                  >
                    Inquire Launch Price
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
