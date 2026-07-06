"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useRegion } from "@/context/RegionContext";

interface RecommendedSectionProps {
  productId: number;
  category?: string;
  material?: string;
  productSlug?: string;
  productName?: string;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  productId,
  category = "",
  material = ""
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { convertPrice } = useRegion();

  useEffect(() => {
    if (!productId) return;
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/products/recommendations?productId=${productId}&category=${encodeURIComponent(category)}&material=${encodeURIComponent(material)}&limit=10`
        );
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [productId, category, material]);

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

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-heading uppercase tracking-wide flex items-center gap-2">
            <span>Frequently Bought Together</span>
          </h2>
          <p className="text-xs text-muted font-medium mt-1">
            Handpicked items crafted with similar materials and design excellence.
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        {products.length > 2 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-heading hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors shadow-sm active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-heading hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors shadow-sm active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Smooth Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {products.map((item) => {
          const mainImg = item.image || (item.images && item.images.length > 0 ? item.images[0] : "/images/placeholder.jpg");
          const hasReviews = item.reviews && item.reviews > 0;
          const ratingDisplay = item.rating ? parseFloat(item.rating).toFixed(1) : "5.0";

          return (
            <Link
              key={item.id}
              href={`/product/${item.slug || item.id}`}
              className="group shrink-0 snap-start w-[240px] sm:w-[260px] md:w-[280px] bg-surface border border-border rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-surface-card overflow-hidden">
                <Image
                  src={mainImg}
                  alt={item.name || "Handcrafted item"}
                  fill
                  sizes="280px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.categoryName && (
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.categoryName}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  {hasReviews ? (
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <Star size={12} className="fill-orange-500" />
                      <span className="text-xs font-black text-heading">{ratingDisplay}</span>
                      <span className="text-[10px] text-muted">({item.reviews})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted mb-1">
                      <Star size={12} />
                      <span className="text-[10px] font-bold">New Arrival</span>
                    </div>
                  )}
                  <h3 className="font-bold text-sm text-heading line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                  <span className="font-black text-heading text-sm">
                    {convertPrice(item.price || item.mrp || 0, item, false)}
                  </span>
                  <span className="text-xs font-bold text-orange-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
