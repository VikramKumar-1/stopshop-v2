"use client";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    accentColor: "text-amber-400/30",
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
    accentColor: "text-orange-500/20",
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
    accentColor: "text-zinc-400/25",
    textColor: "text-zinc-300",
  },
  {
    id: "ceramic",
    name: "Artisan Ceramic",
    tagline: "Earthy Indian Motifs",
    description: "Hand-painted ceramic serving pieces and dinnerware.",
    image: "/bronze-kadai.png",
    productCount: "24 Products",
    bgClass: "from-[#121E15] to-[#070D09]", // Deep forest-green matching reference
    accentColor: "text-emerald-400/25",
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
    accentColor: "text-indigo-400/25",
    textColor: "text-indigo-200",
  },
];

export const ShopByMaterial = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="pt-3 pb-2 md:pt-4 md:pb-3 relative overflow-hidden bg-surface border-y border-bronze-500/10">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-amber-500/[0.05] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 -right-40 w-[500px] h-[500px] bg-orange-500/[0.05] rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between mb-2.5 gap-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-light text-[8px] sm:text-[9px] font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-bronze-500" />
              Premium Materials
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading">
              Shop by <span className="gradient-text">Material</span>
            </h2>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Material Cards Container */}
        <div
          ref={scrollRef}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
          onTouchMove={handleDragMove}
          onMouseMove={handleDragMove}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {materials.map((material, index) => (
            <div
              key={material.id}
              className="snap-start snap-always shrink-0 w-[290px] sm:w-[400px] md:w-[440px] aspect-[16/10] sm:aspect-[1.8/1] relative rounded-3xl overflow-hidden shadow-lg border border-bronze-500/10 hover:border-bronze-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-bronze-500/[0.04]"
            >
              <Link href={`/material/${material.id}`} onClickCapture={handleLinkClick} className="block w-full h-full">
                {/* Background Color/Gradient matching user's dark palette */}
                <div className={`absolute inset-0 bg-gradient-to-br ${material.bgClass}`} />

                {/* Ambient glow inside card */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-orange-400/10 rounded-full blur-[80px]" />
                </div>

                {/* SVG Hanging String Lights / Lanterns from the user request reference image */}
                <svg
                  className={`absolute top-0 right-0 left-0 h-10 w-full ${material.textColor} opacity-40 pointer-events-none`}
                  viewBox="0 0 300 40"
                  fill="none"
                >
                  <path
                    d="M 0 0 Q 37.5 12 75 0 Q 112.5 12 150 0 Q 187.5 12 225 0 Q 262.5 12 300 0"
                    stroke="currentColor"
                    strokeWidth="0.75"
                  />
                  <path
                    d="M 0 0 Q 37.5 20 75 0 Q 112.5 20 150 0 Q 187.5 20 225 0 Q 262.5 20 300 0"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="2,3"
                  />
                  {/* Hanging elements (moon/stars/lantern style dots) */}
                  <circle cx="37.5" cy="12" r="1.5" fill="currentColor" />
                  <line x1="37.5" y1="12" x2="37.5" y2="18" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="37.5" cy="19.5" r="1" fill="currentColor" />

                  <circle cx="112.5" cy="12" r="1.5" fill="currentColor" />
                  <line x1="112.5" y1="12" x2="112.5" y2="24" stroke="currentColor" strokeWidth="0.5" />
                  {/* Miniature Star / Moon symbol */}
                  <circle cx="112.5" cy="25.5" r="1" fill="currentColor" />

                  <circle cx="187.5" cy="12" r="1.5" fill="currentColor" />
                  <line x1="187.5" y1="12" x2="187.5" y2="18" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="187.5" cy="19.5" r="1" fill="currentColor" />

                  <circle cx="262.5" cy="12" r="1.5" fill="currentColor" />
                  <line x1="262.5" y1="12" x2="262.5" y2="24" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="262.5" cy="25.5" r="1" fill="currentColor" />
                </svg>

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

                  {/* BUY NOW / EXPLORE Button */}
                  <div>
                    <span className="inline-block bg-white text-stone-950 hover:bg-orange-50 font-sans font-bold text-[8px] sm:text-[10px] tracking-wider uppercase px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl shadow-md transition-all duration-300 active:scale-95 leading-none">
                      Explore
                    </span>
                  </div>
                </div>

                {/* Right Side Image (Product cutout overlapping on the right side) */}
                <div className="absolute bottom-3.5 right-2 sm:right-3 w-[45%] h-[78%] z-0 select-none pointer-events-none">
                  <div className="relative w-full h-full overflow-visible">
                    {/* Shadow underneath the image for cutout pop effect */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-[10px] bg-black/40 rounded-full blur-md" />
                    
                    <Image
                      src={material.image}
                      alt={material.name}
                      fill
                      sizes="(max-width: 640px) 150px, 200px"
                      className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-1"
                    />
                  </div>
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
