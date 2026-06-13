"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";

const categoryCards = [
  {
    title: "Kitchen Essentials",
    link: "/products?category=kitchen-utility",
    linkText: "Explore all",
    items: [
      { name: "Brass Cookware", image: "/bronze-hero.png", href: "/products?category=brass-cookware" },
      { name: "Copper Products", image: "/bronze-lota.png", href: "/products?category=copper-products" },
      { name: "Steel Essentials", image: "/collection-tableware.png", href: "/products?category=steel-essentials" },
      { name: "Kitchen Racks", image: "/bronze-kadai.png", href: "/products?category=kitchen-racks" },
    ],
  },
  {
    title: "Home & Living",
    link: "/products?category=home-living",
    linkText: "See more",
    items: [
      { name: "Home Living", image: "/bronze-hero.png", href: "/products?category=home-living" },
      { name: "Bedroom Essentials", image: "/collection-tableware.png", href: "/products?category=bedroom-essentials" },
      { name: "Living Room", image: "/bronze-hero.png", href: "/products?category=living-room" },
      { name: "Handicrafts", image: "/bronze-kadai.png", href: "/products?category=handicrafts" },
    ],
  },
  {
    title: "Spiritual & Gifting",
    link: "/products?category=pooja-collection",
    linkText: "Explore all",
    items: [
      { name: "Pooja Collection", image: "/collection-pooja.png", href: "/products?category=pooja-collection" },
      { name: "Gifting Sets", image: "/collection-tableware.png", href: "/products?category=gifting" },
      { name: "Drinkware", image: "/bronze-lota.png", href: "/products?category=drinkware" },
      { name: "Decor Items", image: "/bronze-hero.png", href: "/products?category=handicrafts" },
    ],
  },
  {
    title: "Trending Now",
    link: "/products?sort=best-sellers",
    linkText: "See more",
    items: [
      { name: "Brass Dinner Sets", image: "/collection-tableware.png", href: "/products?category=brass-cookware" },
      { name: "Copper Bottles", image: "/bronze-lota.png", href: "/products?category=copper-products" },
      { name: "Bronze Kadai", image: "/bronze-kadai.png", href: "/products?category=kitchen-utility" },
      { name: "Artisan Decor", image: "/bronze-hero.png", href: "/products?category=handicrafts" },
    ],
  },
];

export const CategoryCards = () => {
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
    <section className="pt-4 pb-1 md:pt-6 md:pb-2 relative overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="relative group/scroll">
          {/* Mobile Arrows */}
          <button
            onClick={() => scroll("left")}
            className="sm:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-surface-card text-orange-600 shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center border border-orange-500/30 bg-surface-card text-orange-600 shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>

          {/* Cards container: flex scroll on mobile, grid on desktop */}
          <div
            ref={scrollRef}
            className="flex sm:grid overflow-x-auto sm:overflow-visible gap-4 sm:gap-5 pb-4 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth px-4 -mx-4 sm:px-0 sm:mx-0 sm:grid-cols-2 lg:grid-cols-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categoryCards.map((card, cardIndex) => (
              <div
                key={cardIndex}
                className="snap-start snap-always shrink-0 w-[85%] sm:w-auto bg-surface-card border border-bronze-500/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
              >
                {/* Card Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-heading mb-4 leading-snug">
                    {card.title}
                  </h3>

                  {/* 2x2 Product Grid */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {card.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="group flex flex-col"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-orange-50 dark:bg-white/5 border border-bronze-500/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 14vw"
                            loading="lazy"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[11px] sm:text-xs text-body font-medium mt-1.5 leading-tight line-clamp-2">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* See More Link */}
                <Link
                  href={card.link}
                  className="inline-block mt-4 text-sm font-semibold text-bronze-600 dark:text-bronze-400"
                >
                  {card.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </section>
  );
};
