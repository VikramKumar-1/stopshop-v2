"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShieldCheck, Package } from "lucide-react";

const slides = [
  {
    src: "/bronze-kadai.png",
    title: "Bronze Kadai",
    description: "Hand-hammered heavy-duty cooking kadai built for generations.",
    tag: "Best Seller"
  },
  {
    src: "/collection-tableware.png",
    title: "Brass Dinner Set",
    description: "Royal brass dining sets with intricate hand-etched artistry.",
    tag: "Premium Collection"
  },
  {
    src: "/bronze-lota.png",
    title: "Copper Water Bottle",
    description: "Pure copper drinkware for natural wellness and hydration.",
    tag: "Wellness Essentials"
  },
  {
    src: "/bronze-hero.png",
    title: "Home Living Decor",
    description: "Handcrafted bronze and brass pieces for elegant Indian homes.",
    tag: "Home & Living"
  }
];

const trustBadges = [
  { icon: Star, label: "Trusted by buyers in 20+ countries", color: "text-amber-500" },
  { icon: ShieldCheck, label: "Quality Checked", color: "text-emerald-500" },
  { icon: Package, label: "Export Packaging", color: "text-bronze-500 dark:text-bronze-400" },
  { icon: null, label: "Recognised by Govt. of India", color: "text-orange-600 dark:text-orange-400", isEmblem: true },
];

export const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play with stable ref so it never goes stale
  useEffect(() => {
    timerRef.current = setInterval(() => {
      handleNext();
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
  };

  return (
    <section id="hero-section" className="relative min-h-0 py-4 sm:py-6 lg:py-6 flex items-center overflow-hidden section-glass-ambient">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-4 pb-6 md:pt-6 md:pb-8 lg:pt-2 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-5 animate-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold tracking-tight leading-[1.1] text-heading">
              India&apos;s Finest
              <br />
              <span className="gradient-text">Kitchen & Home</span>
              <br />
              Essentials Crafted
              <br className="hidden sm:block" />
              <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl"> for the World</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 text-white font-semibold shadow-xl shadow-bronze-500/20 hover:shadow-bronze-500/40 hover:from-bronze-400 hover:to-bronze-500 text-sm"
              >
                Request a Quote
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full glass text-heading font-semibold hover:bg-surface-hover text-sm"
              >
                Explore Export Program
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {badge.isEmblem ? (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 flex items-center justify-center shadow-sm shrink-0 p-1">
                      <img
                        src="/Emblem_of_India.svg"
                        alt="Emblem of India"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-card border border-bronze-500/10 flex items-center justify-center shadow-sm shrink-0">
                      {badge.icon && <badge.icon size={15} className={badge.color} />}
                    </div>
                  )}
                  <span className="text-xs sm:text-sm text-body font-medium leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Product Showcase Slider */}
          <div className="hidden lg:flex relative w-full h-auto py-8 md:py-0 md:h-[450px] lg:h-[500px] items-center justify-center">
            {/* Main Interactive Slider */}
            <div
              className="relative w-full max-w-[440px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-bronze-900/20 dark:shadow-black/30 bg-black/10"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Pure CSS transform track — no Framer Motion animation conflicts */}
              <div
                className="absolute inset-0 flex h-full will-change-transform transform-gpu"
                style={{
                  width: `${slides.length * 100}%`,
                  transform: `translateX(-${current * (100 / slides.length)}%)`,
                  transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="relative h-full flex-shrink-0"
                    style={{ width: `${100 / slides.length}%` }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 440px) 100vw, 440px"
                      priority={true}
                      className="object-cover pointer-events-none"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Slide Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white pointer-events-none select-none z-10">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-bronze-500/80 text-white mb-3 shadow-sm">
                        {slide.tag}
                      </span>
                      <h3 className="text-2xl font-display font-bold mb-1 shadow-sm">
                        {slide.title}
                      </h3>
                      <p className="text-sm text-white/90 shadow-sm">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Controls */}
              <div className="absolute top-4 right-4 z-20 hidden md:flex gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 border border-white/20 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 border border-white/20 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className="h-2 rounded-full"
                    style={{
                      width: index === current ? "24px" : "8px",
                      backgroundColor: index === current ? "#fbbf24" : "rgba(255,255,255,0.45)",
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating badge: Orders — smaller on mobile */}
            <div
              className="absolute left-1 sm:-left-4 lg:-left-8 top-1/4 glass rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-4 shadow-2xl z-20"
            >
              <p className="text-base sm:text-2xl font-display font-bold text-heading">500+</p>
              <p className="text-[10px] sm:text-xs text-muted">Orders Shipped</p>
            </div>

            {/* Floating badge: Quality — smaller on mobile */}
            <div
              className="absolute right-1 sm:-right-4 lg:-right-6 bottom-1/4 glass rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-4 shadow-2xl z-20"
            >
              <p className="text-base sm:text-2xl font-display font-bold gradient-text">100%</p>
              <p className="text-[10px] sm:text-xs text-muted">Quality Assured</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
    </section>
  );
};
