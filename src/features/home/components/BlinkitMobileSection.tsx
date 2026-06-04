"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  GlassWater,
  Bell,
  Boxes,
  Coffee,
  UtensilsCrossed,
  Grid,
  Soup,
  LayoutGrid,
  ChevronRight,
  Flame,
  Sparkles,
  Package,
  Globe,
} from "lucide-react";

/* ─── Category Data ─── */
const mobileCategories = [
  {
    id: "copper",
    name: "Copper",
    icon: GlassWater,
    href: "/products/material/copper",
    bg: "from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/30",
    iconClr: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "brass",
    name: "Brass",
    icon: Bell,
    href: "/products/material/brass",
    bg: "from-amber-100 to-yellow-200 dark:from-amber-900/50 dark:to-amber-800/30",
    iconClr: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "steel",
    name: "Steel",
    icon: Boxes,
    href: "/products/material/steel",
    bg: "from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-700/30",
    iconClr: "text-slate-600 dark:text-slate-400",
  },
  {
    id: "ceramic",
    name: "Ceramic",
    icon: Coffee,
    href: "/products/material/ceramic",
    bg: "from-stone-100 to-stone-200 dark:from-stone-800/50 dark:to-stone-700/30",
    iconClr: "text-stone-600 dark:text-stone-400",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: UtensilsCrossed,
    href: "/products?category=kitchen-utility",
    bg: "from-emerald-100 to-teal-200 dark:from-emerald-900/50 dark:to-emerald-800/30",
    iconClr: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "racks",
    name: "Racks",
    icon: Grid,
    href: "/products?category=kitchen-racks",
    bg: "from-purple-100 to-violet-200 dark:from-purple-900/50 dark:to-purple-800/30",
    iconClr: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: Soup,
    href: "/products?category=dinner-sets",
    bg: "from-rose-100 to-pink-200 dark:from-rose-900/50 dark:to-rose-800/30",
    iconClr: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "all",
    name: "See All",
    icon: LayoutGrid,
    href: "/products",
    bg: "from-orange-100 to-amber-200 dark:from-orange-900/50 dark:to-orange-800/30",
    iconClr: "text-orange-600 dark:text-orange-400",
  },
];

/* ─── Banner Data ─── */
const banners = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 40% Off",
    desc: "Premium bronze & copper cookware",
    cta: "Shop Now",
    href: "/products",
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    icon: Flame,
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh Collection",
    desc: "Handcrafted brass dinner sets",
    cta: "Explore",
    href: "/products?category=dinner-sets",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Export Quality",
    subtitle: "Global Standards",
    desc: "Certified for international markets",
    cta: "Learn More",
    href: "/about",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: Globe,
  },
  {
    id: 4,
    title: "Bulk Orders",
    subtitle: "Best Wholesale Prices",
    desc: "Free shipping on large orders",
    cta: "Get Quote",
    href: "/contact",
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    icon: Package,
  },
];

/* ─── Component ─── */
export const BlinkitMobileSection = () => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent((p) => (p + 1) % banners.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + banners.length) % banners.length), []);

  /* Auto-play */
  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) next();
    else if (diff < -40) prev();
    timerRef.current = setInterval(next, 4000);
  };

  return (
    <section className="lg:hidden">
      {/* ── Category Grid (Blinkit style) ── */}
      <div className="bg-gradient-to-b from-orange-50/80 via-amber-50/40 to-transparent dark:from-orange-950/30 dark:via-amber-950/10 dark:to-transparent px-4 pt-4 pb-5">
        <div className="grid grid-cols-4 gap-y-5 gap-x-3">
          {mobileCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center gap-1.5 active:scale-95 transition-transform duration-150"
              >
                {/* Circle */}
                <div
                  className={`w-[56px] h-[56px] rounded-full flex items-center justify-center bg-gradient-to-br ${cat.bg} shadow-sm border border-white/60 dark:border-white/10 transition-all duration-200 group-active:scale-95`}
                >
                  <Icon size={22} strokeWidth={1.8} className={cat.iconClr} />
                </div>
                {/* Label */}
                <span className="text-[10px] font-semibold text-body text-center leading-tight w-full truncate">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Promotional Banner Carousel ── */}
      <div className="px-4 pb-4">
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Track */}
          <div
            className="flex will-change-transform"
            style={{
              width: `${banners.length * 100}%`,
              transform: `translateX(-${current * (100 / banners.length)}%)`,
              transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {banners.map((b) => {
              const Icon = b.icon;
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className="block flex-shrink-0"
                  style={{ width: `${100 / banners.length}%` }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${b.gradient} p-5 min-h-[130px] flex items-center`}
                  >
                    {/* Decorative */}
                    <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-sm" />
                    <div className="absolute -right-2 -bottom-4 w-20 h-20 rounded-full bg-white/[0.07]" />

                    {/* Content */}
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={13} className="text-white/80" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                          {b.title}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-white leading-tight mb-0.5">
                        {b.subtitle}
                      </h3>
                      <p className="text-xs text-white/75 mb-3">{b.desc}</p>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-[11px] font-bold text-white border border-white/20">
                        {b.cta}
                        <ChevronRight size={12} />
                      </span>
                    </div>

                    {/* Big background icon */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.1]">
                      <Icon size={80} strokeWidth={1} className="text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  backgroundColor:
                    i === current ? "rgb(249, 115, 22)" : "var(--border)",
                }}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
