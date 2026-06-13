"use client";
import { ArrowRight, Star, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { useRegion } from "@/context/RegionContext";

const giftSets = [
  {
    id: 1,
    name: "Imperial Dining Set (12-Piece)",
    tag: "Royal Luxury",
    tagColor: "from-orange-600 to-rose-600",
    description: "A complete dining set including thalis, katoris, tumblers, and spoons. Crafted in pure Bell Metal (Kansa) and packaged in a luxury wooden chest.",
    specs: "12 Items | Handcrafted Wood Box",
    image: "/bronze-hero.png",
    rating: 5.0,
    reviews: 28
  },
  {
    id: 2,
    name: "Ayurveda Wellness Gift Box",
    tag: "Wellness Curated",
    tagColor: "from-teal-600 to-orange-600",
    description: "The ultimate wellness gift containing a handcrafted water lota, two healing cups, and pure bronze stirring spoons. Curated for health-conscious living.",
    specs: "5 Items | Eco-friendly Hard Box",
    image: "/bronze-lota.png",
    rating: 4.9,
    reviews: 19
  },
  {
    id: 3,
    name: "Festive Urli & Diya Collection",
    tag: "Limited Heritage",
    tagColor: "from-purple-600 to-pink-600",
    description: "Add a touch of elegance to any setting with a grand hand-cast bronze urli bowl accompanied by four exquisite floating leaf diyas.",
    specs: "5 Items | Premium Gift Wrapping",
    image: "/bronze-kadai.png",
    rating: 4.8,
    reviews: 14
  },
  {
    id: 4,
    name: "Heritage Cookware Starter Set",
    tag: "Best Value",
    tagColor: "from-emerald-600 to-bronze-600",
    description: "A beautiful starter package combining a heavy-duty bronze kadai and a traditional handi. The perfect wedding or housewarming registry gift.",
    specs: "2 Heavy Cookware | Custom Cotton Bags",
    image: "/bronze-kadai.png",
    rating: 4.9,
    reviews: 35
  }
];

export const GiftCollections = () => {
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
    <section className="py-6 md:py-12 relative overflow-hidden section-glass-ambient ambient-purple border-y border-bronze-500/10">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-6">
          <div className="max-w-xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-4"
            >
              <Gift size={14} className="text-bronze-500" />
              Curated For Gifting
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-heading">
              Premium <span className="gradient-text">Gift Collections</span>
            </h2>
          </div>

          {/* Navigation controls (Arrows) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-bronze-500/20 bg-surface-card hover:bg-surface-hover text-heading shadow-md hover:shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-bronze-500/20 bg-surface-card hover:bg-surface-hover text-heading shadow-md hover:shadow-lg"
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
          className="flex overflow-x-auto gap-6 pb-4 pt-2 scrollbar-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {giftSets.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[290px] sm:w-[330px] flex flex-col justify-between bg-surface-card border border-bronze-500/[0.14] rounded-3xl overflow-hidden shadow-sm"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50 dark:bg-white/5">
                <div className="absolute top-4 left-4 z-20 glass-light text-heading border border-bronze-500/10 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm">
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
                    Request Gifting Details
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
