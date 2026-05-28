"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const categories = [
  {
    id: "kitchen-utility",
    name: "Kitchen Utility",
    image: "/bronze-kadai.png",
    bgClass: "from-[#121E15] to-[#070D09]", // forest green
    fadeClass: "from-[#121E15] to-transparent",
    textColor: "text-emerald-200",
  },
  {
    id: "brass-cookware",
    name: "Brass Cookware",
    image: "/bronze-hero.png",
    bgClass: "from-[#251805] to-[#110A01]", // deep bronze
    fadeClass: "from-[#251805] to-transparent",
    textColor: "text-amber-200",
  },
  {
    id: "copper-products",
    name: "Copper Products",
    image: "/bronze-lota.png",
    bgClass: "from-[#2A1005] to-[#110501]", // deep copper
    fadeClass: "from-[#2A1005] to-transparent",
    textColor: "text-orange-200",
  },
  {
    id: "steel-essentials",
    name: "Steel Essentials",
    image: "/collection-tableware.png",
    bgClass: "from-[#1F2229] to-[#0E1013]", // slate steel
    fadeClass: "from-[#1F2229] to-transparent",
    textColor: "text-zinc-300",
  },
  {
    id: "home-living",
    name: "Home Living",
    image: "/bronze-hero.png",
    bgClass: "from-[#24170A] to-[#100903]", // earthy brown
    fadeClass: "from-[#24170A] to-transparent",
    textColor: "text-amber-200/90",
  },
  {
    id: "bedroom",
    name: "Bedroom Essentials",
    image: "/collection-tableware.png",
    bgClass: "from-[#0F1626] to-[#070B14]", // indigo
    fadeClass: "from-[#0F1626] to-transparent",
    textColor: "text-indigo-200",
  },
  {
    id: "living-room",
    name: "Living Room",
    image: "/bronze-hero.png",
    bgClass: "from-[#261016] to-[#110408]", // warm burgundy
    fadeClass: "from-[#261016] to-transparent",
    textColor: "text-rose-200",
  },
  {
    id: "handicrafts",
    name: "Handicrafts",
    image: "/bronze-kadai.png",
    bgClass: "from-[#1D1026] to-[#0D0412]", // deep purple
    fadeClass: "from-[#1D1026] to-transparent",
    textColor: "text-purple-200",
  },
  {
    id: "pooja-collection",
    name: "Pooja Collection",
    image: "/collection-pooja.png",
    bgClass: "from-[#2B0E0E] to-[#130303]", // crimson red
    fadeClass: "from-[#2B0E0E] to-transparent",
    textColor: "text-red-200",
  },
  {
    id: "kitchen-racks",
    name: "Kitchen Racks",
    image: "/bronze-hero.png",
    bgClass: "from-[#0D1F1D] to-[#040C0B]", // teal
    fadeClass: "from-[#0D1F1D] to-transparent",
    textColor: "text-teal-200",
  },
];

export const ShopByCollections = () => {
  return (
    <section className="pt-3 pb-2 md:pt-4 md:pb-3 relative overflow-hidden bg-surface border-y border-bronze-500/10">
      {/* Subtle background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/[0.04] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-bronze-500/[0.04] rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-bronze-500" />
            Shop by Category
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading">
            Explore Our <span className="gradient-text">Collections</span>
          </h2>
        </div>

        {/* Categories Grid - Increased max-width for larger cards, aspect ratio adjusted to 1.2/1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group relative block w-full aspect-[1.2/1] rounded-2xl sm:rounded-3xl overflow-hidden border border-bronze-500/10 hover:border-bronze-500/30 bg-bronze-900 shadow-sm hover:shadow-xl hover:shadow-bronze-500/[0.04] hover:-translate-y-1.5 transition-all duration-300"
            >
              <Link href={`/category/${cat.id}`} className="flex flex-col w-full h-full">
                
                {/* Upper portion: Image container (height adjusted to 60% for larger images) */}
                <div className="relative w-full h-[60%] overflow-hidden bg-black/10">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Fade overlay: bottom 30% of the image container */}
                  <div className={`absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t ${cat.fadeClass} opacity-90 z-10`} />
                  
                  {/* Subtle top shadow */}
                  <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/20 to-transparent z-10" />

                  {/* Decorative Lights SVG overlay */}
                  <svg
                    className={`absolute top-0 right-0 left-0 h-5 w-full ${cat.textColor} opacity-40 pointer-events-none z-20`}
                    viewBox="0 0 200 30"
                    fill="none"
                  >
                    <path
                      d="M 0 0 Q 25 8 50 0 Q 75 8 100 0 Q 125 8 150 0 Q 175 8 200 0"
                      stroke="currentColor"
                      strokeWidth="0.75"
                    />
                    <path
                      d="M 0 0 Q 25 14 50 0 Q 75 14 100 0 Q 125 14 150 0 Q 175 14 200 0"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      strokeDasharray="1.5,2.5"
                    />
                  </svg>
                </div>

                {/* Lower portion: Centered Text Area (height adjusted to 40%) */}
                <div className={`relative w-full h-[40%] bg-gradient-to-br ${cat.bgClass} px-3 sm:px-4 flex items-center justify-center text-center z-10 border-t border-white/[0.02]`}>
                  <h3 className="text-[11px] sm:text-xs md:text-sm lg:text-base font-display font-bold text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
                    {cat.name}
                  </h3>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
