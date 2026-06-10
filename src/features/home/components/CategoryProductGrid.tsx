"use client";
import { motion } from "framer-motion";
import { ArrowRight, Star, Check, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useRegion } from "@/context/RegionContext";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  slug?: string;
  description: string;
  specs: string;
  image: string;
  rating: number;
  reviews: number;
  price?: number;
  mrp?: number;
  discount?: number;
  categoryName?: string;
  category?: { name: string };
  material?: string;
}

interface CategoryProductGridProps {
  title: string;
  tagLine: string;
  products: Product[];
  viewAllLink: string;
  accentColor: string; // e.g. "bronze" | "rose" | "emerald"
}

export const CategoryProductGrid = ({
  title,
  tagLine,
  products,
  viewAllLink,
  accentColor
}: CategoryProductGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { convertPrice, convertWeight, getRawPrice, formatPrice } = useRegion();
  const { addToCart } = useCart();

  const renderTitle = (titleText: string) => {
    const words = titleText.split(" ");
    if (words.length > 1) {
      const firstWord = words[0];
      const rest = words.slice(1).join(" ");
      let accentTextClass = "";
      if (accentColor === "emerald" || accentColor === "bronze") {
        accentTextClass = "bg-gradient-to-r from-bronze-600 via-bronze-500 to-orange-600 bg-clip-text text-transparent dark:from-bronze-400 dark:via-bronze-300 dark:to-orange-400";
      } else if (accentColor === "rose") {
        accentTextClass = "bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 bg-clip-text text-transparent";
      } else {
        accentTextClass = "gradient-text";
      }

      return (
        <>
          <span className={accentTextClass}>{firstWord}</span>{" "}
          <span className={accentColor === "rose" ? "text-orange-100" : "text-heading"}>
            {rest}
          </span>
        </>
      );
    }
    return titleText;
  };

  const ambientClass = 
    accentColor === "emerald" 
      ? "ambient-emerald" 
      : accentColor === "rose" 
        ? "ambient-rose" 
        : "ambient-gold";

  return (
    <section className={`pt-1.5 pb-5 md:pt-2 md:pb-8 relative overflow-hidden ${
      accentColor === "rose" 
        ? "bg-premium-maroon" 
        : `section-glass-ambient ${ambientClass}`
    } border-b border-bronze-500/10`}>
      {/* Traditional Pooja Mandala Top Hanging Ornament Drawing */}
      {accentColor === "rose" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[250px] pointer-events-none z-0 overflow-hidden select-none opacity-90">
          <svg 
            className="w-full h-full text-orange-500/80" 
            viewBox="0 0 400 200" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.8"
          >
            <defs>
              <radialGradient id="goldGlow" cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.2" />
                <stop offset="60%" stopColor="#D97706" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#7D4B2C" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="maroonPetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#800B1A" />
                <stop offset="100%" stopColor="#4A050E" />
              </linearGradient>
              <linearGradient id="goldOutline" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Gold Ambient Glow behind Mandala */}
            <circle cx="200" cy="0" r="180" fill="url(#goldGlow)" stroke="none" />

            {/* Concentric Decorative Rings */}
            <circle cx="200" cy="0" r="170" stroke="url(#goldOutline)" strokeOpacity="0.3" strokeDasharray="2,4" />
            <circle cx="200" cy="0" r="158" stroke="url(#goldOutline)" strokeOpacity="0.2" />
            <circle cx="200" cy="0" r="148" stroke="url(#goldOutline)" strokeOpacity="0.4" strokeDasharray="3,3" />

            {/* Outer Layer: Golden Flame-Like Petals (Radiating from 200,0) */}
            <g stroke="url(#goldOutline)" strokeWidth="1.2" strokeOpacity="0.85">
              <path d="M 200 0 L 180 135 C 190 160, 210 160, 220 135 Z" fill="none" />
              <path d="M 200 0 L 105 110 C 117 132, 137 122, 142 98 Z" fill="none" />
              <path d="M 200 0 L 295 110 C 283 132, 263 122, 258 98 Z" fill="none" />
              
              <path d="M 200 0 L 52 75 C 67 95, 85 82, 85 58 Z" fill="none" />
              <path d="M 200 0 L 348 75 C 333 95, 315 82, 315 58 Z" fill="none" />
              
              <path d="M 200 0 L 12 28 C 27 45, 45 28, 40 5 Z" fill="none" />
              <path d="M 200 0 L 388 28 C 373 45, 355 28, 360 5 Z" fill="none" />

              {/* Intermediate Outer Petals */}
              <path d="M 200 0 L 142 128 C 152 150, 168 142, 172 118 Z" fill="none" />
              <path d="M 200 0 L 258 128 C 248 150, 232 142, 228 118 Z" fill="none" />

              <path d="M 200 0 L 78 98 C 92 118, 108 108, 110 82 Z" fill="none" />
              <path d="M 200 0 L 322 98 C 308 118, 292 108, 290 82 Z" fill="none" />
            </g>

            {/* Middle Layer: Ornate Maroon Petals with Gold Borders */}
            <g stroke="url(#goldOutline)" strokeWidth="1" fill="url(#maroonPetal)">
              <path d="M 200 0 L 185 95 C 191 113, 209 113, 215 95 Z" />
              <path d="M 200 0 L 132 85 C 141 100, 155 93, 157 75 Z" />
              <path d="M 200 0 L 268 85 C 259 100, 245 93, 243 75 Z" />
              
              <path d="M 200 0 L 88 60 C 98 73, 111 63, 111 45 Z" />
              <path d="M 200 0 L 312 60 C 302 73, 289 63, 289 45 Z" />

              <path d="M 200 0 L 45 25 C 55 35, 68 25, 66 8 Z" />
              <path d="M 200 0 L 355 25 C 345 35, 332 25, 334 8 Z" />

              {/* Intermediate Maroon Petals */}
              <path d="M 200 0 L 160 92 C 168 108, 180 100, 183 82 Z" />
              <path d="M 200 0 L 240 92 C 232 108, 220 100, 217 82 Z" />

              <path d="M 200 0 L 110 75 C 119 88, 131 80, 133 62 Z" />
              <path d="M 200 0 L 290 75 C 281 88, 269 80, 267 62 Z" />
            </g>

            {/* Inner Ring Details */}
            <circle cx="200" cy="0" r="58" stroke="url(#goldOutline)" strokeWidth="1.2" />
            <circle cx="200" cy="0" r="50" stroke="url(#goldOutline)" strokeWidth="0.8" strokeDasharray="2,2" />

            {/* Central Radiating Gold Starburst lines */}
            <g stroke="#FBBF24" strokeWidth="1.5">
              <line x1="200" y1="0" x2="200" y2="42" />
              <line x1="200" y1="0" x2="158" y2="28" />
              <line x1="200" y1="0" x2="242" y2="28" />
              <line x1="200" y1="0" x2="175" y2="38" />
              <line x1="200" y1="0" x2="225" y2="38" />
              <line x1="200" y1="0" x2="135" y2="18" />
              <line x1="200" y1="0" x2="265" y2="18" />
              <line x1="200" y1="0" x2="115" y2="0" strokeWidth="2.5" />
              <line x1="200" y1="0" x2="285" y2="0" strokeWidth="2.5" />
            </g>

            {/* Center Core Cap */}
            <circle cx="200" cy="0" r="24" fill="#6B0914" stroke="url(#goldOutline)" strokeWidth="1.5" />
            <circle cx="200" cy="0" r="15" fill="#FBBF24" stroke="none" />
            <circle cx="200" cy="0" r="7" fill="#2D0A11" stroke="none" />
          </svg>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4 md:mb-5 gap-4">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                accentColor === "rose" 
                  ? "bg-white/10 text-orange-200 border-orange-500/25" 
                  : "bg-bronze-500/5 text-bronze-800 dark:text-bronze-300 border-bronze-500/25"
              } text-[8px] sm:text-[9px] font-bold tracking-widest uppercase mb-1.5`}
            >
              <span className={`w-1 h-1 rounded-full ${
                accentColor === "rose" ? "bg-orange-400" : "bg-bronze-500"
              } animate-pulse`} />
              {tagLine}
            </motion.div>
            
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-display font-bold ${
              accentColor === "rose" ? "text-orange-100" : "text-heading"
            }`}>
              {renderTitle(title)}
            </h2>
          </div>

          {/* Scroll Controls beside title */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (scrollRef.current) {
                  const { scrollLeft, clientWidth } = scrollRef.current;
                  scrollRef.current.scrollTo({ left: scrollLeft - clientWidth * 0.75, behavior: "smooth" });
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => {
                if (scrollRef.current) {
                  const { scrollLeft, clientWidth } = scrollRef.current;
                  scrollRef.current.scrollTo({ left: scrollLeft + clientWidth * 0.75, behavior: "smooth" });
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal 2-Row Grid Container */}
        <div 
          ref={scrollRef}
          className="grid grid-rows-2 grid-flow-col auto-cols-[calc(50%-8px)] sm:auto-cols-[230px] lg:auto-cols-[250px] gap-4 sm:gap-6 pb-6 pt-2 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {products.slice(0, 12).map((product, index) => {
            const displayPrice = product.price || Math.round(product.id * 100 + 299);
            const displayMrp = product.mrp || Math.round(product.id * 150 + 499);
            const rawMrp = getRawPrice(displayMrp, product, true);
            const rawPrice = getRawPrice(displayPrice, product, false);
            const savedAmount = Math.max(0, rawMrp - rawPrice);

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug || product.id}`}
                className="group snap-start snap-always shrink-0 w-full flex flex-col justify-between bg-surface-card border border-bronze-500/[0.14] rounded-2xl max-sm:rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-bronze-500/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50/50 dark:bg-white/5 border-b border-bronze-500/[0.08]">
                  {product.discount !== undefined && product.discount > 0 && (
                    <div className="absolute top-3 right-3 z-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      {product.discount}% OFF
                    </div>
                  )}
                  
                  <span className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md capitalize">
                    {product.category?.name || product.categoryName?.replace(/-/g, " ") || title || "Premium"}
                  </span>

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Stars and Rating */}
                    <div className="flex items-center gap-1 mb-1 sm:mb-2 text-[10px] sm:text-xs flex-wrap">
                      <div className="flex items-center text-orange-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" className="stroke-none" />
                        ))}
                      </div>
                      <span className="font-semibold text-heading ml-1">{product.rating}</span>
                      <span className="text-muted">({product.reviews})</span>
                      {product.material && (
                        <>
                          <span className="text-bronze-500 font-semibold">•</span>
                          <span className="font-semibold text-bronze-700 dark:text-bronze-300">{product.material}</span>
                        </>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xs sm:text-lg font-bold text-heading mb-1 sm:mb-1.5 leading-snug line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-1.5 mt-0.5 sm:mt-2 mb-1.5 sm:mb-4 flex-wrap">
                      <span className="text-sm sm:text-lg font-bold text-heading">{convertPrice(displayPrice, product, false)}</span>
                      {rawMrp > rawPrice && (
                        <>
                          <span className="text-[10px] sm:text-sm text-muted line-through">{convertPrice(displayMrp, product, true)}</span>
                          <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                            (Save {formatPrice(savedAmount)})
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* Specs scroll list */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-none py-0.5 no-scrollbar max-w-full mb-3 sm:mb-4">
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

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 w-full mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                        className="px-3 py-2 sm:py-2.5 rounded-xl border border-bronze-500 text-bronze-500 dark:text-bronze-400 hover:bg-bronze-500/10 transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/checkout?productId=${product.id}`;
                        }}
                        className="flex-grow inline-flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-bold shadow-md shadow-bronze-500/10 hover:shadow-lg hover:shadow-bronze-500/25 transition-all duration-300 text-[10px] sm:text-xs active:scale-[0.97] cursor-pointer text-center"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Center See More Button */}
        <div className="mt-4 md:mt-5 text-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-bronze-500/10 to-orange-500/10 hover:from-bronze-500/20 hover:to-orange-500/20 backdrop-blur-md border border-bronze-500/20 hover:border-bronze-500/40 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
          >
            See More
            <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
