"use client";

import { ArrowRight, Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";
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
  isAboveFold?: boolean; // Only first section should set this to true
}

export const CategoryProductGrid = ({
  title,
  tagLine,
  products,
  viewAllLink,
  accentColor,
  isAboveFold = false
}: CategoryProductGridProps) => {
  const router = useRouter();
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
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const ambientClass = 
    accentColor === "emerald" 
      ? "ambient-emerald" 
      : accentColor === "rose" 
        ? "ambient-rose" 
        : "ambient-gold";

  return (
    <section className={`lazy-scroll-section pt-1.5 pb-5 md:pt-2 md:pb-8 relative overflow-hidden ${
      accentColor === "rose" 
        ? "bg-premium-maroon" 
        : `section-glass-ambient ${ambientClass}`
    } border-b border-bronze-500/10`}>
      {/* Traditional Pooja Mandala Top Hanging Ornament Drawing */}
      {accentColor === "rose" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[250px] pointer-events-none z-0 overflow-hidden select-none [contain:strict]">
          <img 
            src="/images/pooja-mandala.svg" 
            alt="Pooja Mandala Decorative Ornament" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4 md:mb-5 gap-4">
          <div className="max-w-xl">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                accentColor === "rose" 
                  ? "bg-white/10 text-orange-200 border-orange-500/25" 
                  : "bg-bronze-500/5 text-bronze-800 dark:text-bronze-300 border-bronze-500/25"
              } text-[8px] sm:text-[9px] font-bold tracking-widest uppercase mb-1.5`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                accentColor === "rose" ? "bg-orange-400" : "bg-bronze-500"
              }`} />
              {tagLine}
            </div>
            
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-display font-bold ${
              accentColor === "rose" ? "text-orange-100" : "text-heading"
            }`}>
              {renderTitle(title)}
            </h2>
          </div>

          {/* Scroll Controls beside title */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              style={{
                touchAction: "manipulation",
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              style={{
                touchAction: "manipulation",
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Grid Container */}
        <div 
          ref={scrollRef}
          className={`grid ${products.length > 4 ? "grid-rows-2" : "grid-rows-1"} grid-flow-col auto-cols-[calc(50%-8px)] sm:auto-cols-[230px] lg:auto-cols-[250px] gap-4 sm:gap-6 pb-3 pt-2 overflow-x-auto scrollbar-none`}
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
                className="group shrink-0 w-full flex flex-col justify-between bg-surface-card border border-bronze-500/[0.14] rounded-2xl max-sm:rounded-xl overflow-hidden shadow-sm cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50/50 dark:bg-white/5 border-b border-bronze-500/[0.08]">
                  {product.discount !== undefined && product.discount > 0 && (
                    <div className="absolute top-3 right-3 z-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      {product.discount}% OFF
                    </div>
                  )}
                  
                  <span className="absolute bottom-3 left-3 z-10 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-md capitalize">
                    {product.category?.name || product.categoryName?.replace(/-/g, " ") || title || "Premium"}
                  </span>

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    priority={isAboveFold && index < 4}
                    loading={isAboveFold && index < 4 ? "eager" : "lazy"}
                    unoptimized={!product.image?.includes("cloudinary")}
                    className="object-cover"
                  />

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
                        className="px-3 py-2 sm:py-2.5 rounded-xl border border-bronze-500 text-bronze-500 dark:text-bronze-400 hover:bg-bronze-500/10 flex items-center justify-center cursor-pointer shrink-0"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/checkout?productId=${product.id}`);
                        }}
                        className="flex-grow inline-flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-bold text-[10px] sm:text-xs cursor-pointer text-center"
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
        <div className="mt-2 md:mt-3 text-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-bronze-500/10 to-orange-500/10 hover:from-bronze-500/20 hover:to-orange-500/20 border border-bronze-500/20 hover:border-bronze-500/40 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-semibold shadow-sm"
          >
            See More
            <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
