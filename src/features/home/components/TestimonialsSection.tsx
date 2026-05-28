"use client";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";

const testimonials = [
  {
    quote: "Excellent brass cookware quality. The kadai is exactly like traditional ones my grandmother used.",
    name: "James Carter",
    role: "Wholesale Buyer, UK",
    flag: "🇬🇧",
    rating: 5,
    product: "Heritage Bronze Kadai",
  },
  {
    quote: "Received safely in Qatar. Premium packaging and the copper bottles are stunning. Will reorder.",
    name: "Sarah Al-Rashid",
    role: "Hospitality Procurement, UAE",
    flag: "🇦🇪",
    rating: 5,
    product: "Copper Water Bottle Set",
  },
  {
    quote: "Premium packaging. The entire shipment of 200 units arrived in perfect condition. Outstanding.",
    name: "Klaus Weber",
    role: "Retail Chain Manager, Germany",
    flag: "🇩🇪",
    rating: 5,
    product: "Brass Dinner Set",
  },
  {
    quote: "Best supplier for authentic Indian kitchenware. Quality is consistent across every batch.",
    name: "Fatima Hassan",
    role: "Restaurant Owner, Saudi Arabia",
    flag: "🇸🇦",
    rating: 5,
    product: "Steel Cookware Set",
  },
  {
    quote: "The artisan story behind each product resonates with our customers. Beautiful craftsmanship.",
    name: "Emily Richardson",
    role: "Boutique Owner, Australia",
    flag: "🇦🇺",
    rating: 5,
    product: "Handicraft Collection",
  },
  {
    quote: "Seamless export process. From quote to delivery in 10 days. Very professional team.",
    name: "Rajesh Gupta",
    role: "Distributor, Singapore",
    flag: "🇸🇬",
    rating: 5,
    product: "Bulk Brass Utensils",
  },
];

export const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="py-6 md:py-8 relative overflow-hidden section-glass-ambient ambient-indigo">
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-bronze-500/5 rounded-full blur-[180px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div className="text-center md:text-left space-y-3">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm uppercase tracking-[0.2em] text-orange-600 dark:text-bronze-400 font-medium"
            >
              Customer Reviews
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading"
            >
              Trusted <span className="gradient-text">Globally</span>
            </motion.h2>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-bronze-500/20 bg-surface-card hover:bg-surface-hover text-heading shadow-sm hover:shadow-md transition-all active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-bronze-500/20 bg-surface-card hover:bg-surface-hover text-heading shadow-sm hover:shadow-md transition-all active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable testimonials */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-5 pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[350px] glass rounded-2xl p-5 sm:p-6 gradient-border hover-lift flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-amber-400 stroke-none" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote size={20} className="text-bronze-500/20 absolute -top-1 -left-1" />
                  <p className="text-body text-sm leading-relaxed pl-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Product tag */}
                <span className="inline-block text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-bronze-500/10 text-bronze-600 dark:text-bronze-400 font-medium">
                  {t.product}
                </span>
              </div>

              {/* Reviewer */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-bronze-400/20 to-bronze-600/20 flex items-center justify-center text-base sm:text-lg">
                  {t.flag}
                </div>
                <div>
                  <p className="text-sm font-semibold text-heading">{t.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
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
