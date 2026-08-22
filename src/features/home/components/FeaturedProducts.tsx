"use client";
import { ArrowRight, Star, ShoppingCart, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useRegion } from "@/context/RegionContext";
import { useCart } from "@/context/CartContext";

const products = [
  {
    id: 1,
    name: "Heritage Bronze Kadai",
    slug: "heritage-bronze-kadai",
    category: "Cookware",
    tag: "Best Seller",
    tagColor: "from-orange-500 to-red-500",
    description: "Heavy-duty pure bronze cooking kadai, hand-beaten by traditional coppersmiths for uniform heating.",
    specs: "Weight: 2.4 kg | Hand-Hammered",
    image: "/bronze-kadai.webp",
    rating: 4.9,
    reviews: 124,
    price: 2499,
    mrp: 3199,
    discount: 22,
  },
  {
    id: 2,
    name: "Artisanal Bronze Lota",
    slug: "artisanal-bronze-lota",
    category: "Wellness",
    tag: "Trending",
    tagColor: "from-blue-500 to-indigo-500",
    description: "Traditional wellness water vessel designed to naturally purify and alkaline drinking water overnight.",
    specs: "Capacity: 1.5 Litres | Pure Kansa",
    image: "/bronze-lota.webp",
    rating: 4.8,
    reviews: 89,
    price: 1899,
    mrp: 2499,
    discount: 24,
  },
  {
    id: 3,
    name: "Royal Bronze Thali Set",
    slug: "royal-bronze-thali-set",
    category: "Serveware",
    tag: "Limited Edition",
    tagColor: "from-purple-500 to-pink-500",
    description: "An exquisite multi-piece dining set fit for royalty, featuring intricate hand-etched rims.",
    specs: "7-Piece Set | Velvet Case Included",
    image: "/bronze-hero.webp",
    rating: 5.0,
    reviews: 42,
    price: 5999,
    mrp: 7999,
    discount: 25,
  },
  {
    id: 4,
    name: "Handcrafted Bronze Handi",
    slug: "handcrafted-bronze-handi",
    category: "Cookware",
    tag: "Traditional",
    tagColor: "from-emerald-500 to-teal-500",
    description: "Elegant deep-cooking pot with lid, perfect for slow-cooking biryanis and traditional curries.",
    specs: "Capacity: 3 Litres | Heavy Bottom",
    image: "/bronze-hero.webp",
    rating: 4.7,
    reviews: 67,
    price: 3299,
    mrp: 4499,
    discount: 27,
  },
  {
    id: 5,
    name: "Premium Bronze Urli Bowl",
    slug: "premium-bronze-urli-bowl",
    category: "Decor",
    tag: "New Arrival",
    tagColor: "from-rose-500 to-orange-500",
    description: "Decorative urli bowl used for wellness floating flowers or preparing traditional Ayurvedic oil baths.",
    specs: "Diameter: 12 inches | Solid Cast",
    image: "/bronze-kadai.webp",
    rating: 4.9,
    reviews: 31,
    price: 2199,
    mrp: 2999,
    discount: 27,
  },
  {
    id: 6,
    name: "Traditional Bronze Tumbler Set",
    slug: "traditional-bronze-tumbler-set",
    category: "Drinkware",
    tag: "Value Pack",
    tagColor: "from-cyan-500 to-blue-500",
    description: "Set of premium bronze tumblers for serving lassi, water, or traditional drinks.",
    specs: "Set of 4 | 350ml each",
    image: "/bronze-lota.webp",
    rating: 4.6,
    reviews: 58,
    price: 1599,
    mrp: 2199,
    discount: 27,
  },
  {
    id: 7,
    name: "Classic Bronze Patila",
    slug: "classic-bronze-patila",
    category: "Cookware",
    tag: "Everyday Use",
    tagColor: "from-amber-500 to-orange-500",
    description: "Flat-bottomed classic bronze cooking vessel designed for boiling milk, preparing tea.",
    specs: "Weight: 1.8 kg | Pure Bronze",
    image: "/bronze-hero.webp",
    rating: 4.8,
    reviews: 73,
    price: 1999,
    mrp: 2699,
    discount: 26,
  },
  {
    id: 8,
    name: "Brass Dinner Set Premium",
    slug: "brass-dinner-set-premium",
    category: "Serveware",
    tag: "Popular",
    tagColor: "from-orange-500 to-amber-500",
    description: "Complete brass dinner set with plates, bowls, and spoons in a luxury gift box.",
    specs: "12-Piece Set | Gift Box",
    image: "/collection-tableware.webp",
    rating: 4.9,
    reviews: 96,
    price: 4999,
    mrp: 6499,
    discount: 23,
  },
];

export const FeaturedProducts = ({ products: propProducts }: { products?: any[] }) => {
  const router = useRouter();
  const displayProducts = (propProducts && propProducts.length > 0) ? propProducts : products;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { convertPrice, convertWeight, getRawPrice, formatPrice } = useRegion();
  const { addToCart } = useCart();
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
    <section className="lazy-scroll-section pt-5 pb-2 md:pt-6 md:pb-3 relative overflow-hidden section-glass-ambient ambient-bronze">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-2 md:mb-3 gap-4">
          <div className="max-w-xl">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-light text-[8px] sm:text-[9px] font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-1.5"
            >
              <TrendingUp size={11} className="text-bronze-500" />
              Most Popular
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading">
              Best <span className="gradient-text">Sellers</span>
            </h2>
          </div>

          {/* View All */}
          <div>
            <Link
              href="/products?sort=best-sellers"
              className="text-sm font-semibold text-bronze-600 dark:text-bronze-400 hover:text-bronze-500 hidden sm:inline-flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Relative wrapper for scroll container and overlay arrows */}
        <div className="relative group/scroll">
          
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 sm:-left-5 lg:-left-8 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-orange-500/40 bg-surface-card hover:bg-surface-hover text-orange-600 dark:text-orange-400 shadow-md hover:shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Scrollable Product Container */}
          <div
            ref={scrollRef}
            onTouchStart={handleDragStart}
            onMouseDown={handleDragStart}
            onTouchMove={handleDragMove}
            onMouseMove={handleDragMove}
            className="flex items-stretch overflow-x-auto gap-4 sm:gap-5 pb-6 pt-2 scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {displayProducts.map((product: any) => {
              const discountVal = product.discount || Math.round(((product.mrp - product.price) / (product.mrp || 1)) * 100) || 0;
              const catName = product.categoryName || product.category || "Best Seller";
              return (
              <Link
                key={product.id}
                href={`/product/${product.slug || product.id}`}
                onClickCapture={handleLinkClick}
                className="group shrink-0 w-[200px] sm:w-[230px] lg:w-[250px] min-h-[365px] sm:min-h-[415px] lg:min-h-[450px] h-auto flex flex-col justify-between bg-surface-card border border-bronze-500/[0.12] rounded-2xl overflow-hidden shadow-sm cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-orange-50 dark:bg-white/5">
                  {/* Discount badge */}
                  {discountVal > 0 && (
                    <div className="absolute top-3 right-3 z-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      {discountVal}% OFF
                    </div>
                  )}
                  <Image
                    src={product.image || "/bronze-kadai.webp"}
                    alt={product.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 280px"
                    loading="lazy"
                    unoptimized={!product.image?.includes("cloudinary")}
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[11px]">
                      <div className="flex items-center gap-0.5 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold">
                        <span>{product.rating || 5.0}</span>
                        <Star size={8} fill="currentColor" className="stroke-none" />
                      </div>
                      <span className="text-muted">({product.reviews || 0})</span>
                      <span className="text-[9px] text-muted">•</span>
                      <span className="text-[9px] text-muted font-medium">{catName}</span>
                    </div>

                    {/* Name with line-clamp-2 - height scales naturally */}
                    <h3 className="text-xs sm:text-base font-bold text-heading leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Price Section — Amazon style */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-heading">{convertPrice(product.price, product, false)}</span>
                      <span className="text-[10px] sm:text-xs text-muted line-through">{convertPrice(product.mrp, product, true)}</span>
                      <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                        (Save {formatPrice(Math.max(0, getRawPrice(product.mrp, product, true) - getRawPrice(product.price, product, false)))})
                      </span>
                    </div>

                    {/* Specs scroll list */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-none py-0.5 no-scrollbar max-w-full">
                      {product.specs ? (
                        String(product.specs).split(" | ").map((spec: string, i: number) => (
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
                        setTimeout(() => {
                          router.push(product.slug ? `/checkout/${product.slug}-${product.id}` : `/checkout?productId=${product.id}`);
                        }, 50);
                      }}
                      className="flex-grow inline-flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-bold text-[10px] sm:text-xs cursor-pointer text-center"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 sm:-right-5 lg:-right-8 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-orange-500/40 bg-surface-card hover:bg-surface-hover text-orange-600 dark:text-orange-400 shadow-md hover:shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>

        </div>

        {/* Mobile View All link */}
        <div className="mt-2 text-center sm:hidden">
          <Link
            href="/products?sort=best-sellers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-bronze-600 dark:text-bronze-400"
          >
            View All Best Sellers
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
      
      {/* Hide Scrollbar Style Inject */}
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
