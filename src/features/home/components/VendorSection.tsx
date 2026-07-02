"use client";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Award, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
  specialty: string;
  rating: string;
  logo: React.ReactNode;
}

const vendors: Vendor[] = [
  {
    id: 1,
    name: "Vedic Brass",
    category: "Brassware Artisans",
    location: "Moradabad, Uttar Pradesh",
    specialty: "Hand-cast heavy brass",
    rating: "4.9",
    logo: (
      <svg className="w-12 h-12 text-amber-500" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M50 22 L50 78 M22 50 L78 50" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
        {/* Diya/Flame motif */}
        <path d="M50 35 C42 47 42 62 50 68 C58 62 58 47 50 35 Z" fill="url(#brassGradient)" />
        <circle cx="50" cy="53" r="5" fill="#ea580c" />
        <defs>
          <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 2,
    name: "Ayur Copper",
    category: "Copper Smiths",
    location: "Tambavati, Maharashtra",
    specialty: "99.6% Pure Copper Vessels",
    rating: "4.8",
    logo: (
      <svg className="w-12 h-12 text-orange-500" viewBox="0 0 100 100" fill="currentColor">
        <rect x="15" y="15" width="70" height="70" rx="12" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.75" />
        {/* Leaf/Water drop motif */}
        <path d="M50 28 C37 42 42 66 50 72 C58 66 63 42 50 28 Z" fill="url(#copperGradient)" />
        <path d="M50 28 V72" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
        <defs>
          <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 3,
    name: "Kansa Kitchen",
    category: "Bell Metal Guild",
    location: "Sarthebari, Assam",
    specialty: "Traditional Kansa Cookware",
    rating: "5.0",
    logo: (
      <svg className="w-12 h-12 text-yellow-600" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
        {/* Concentric alloy patterns */}
        <g transform="translate(50,50)">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="-32"
              x2="0"
              y2="-26"
              stroke="currentColor"
              strokeWidth="2"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="16" fill="url(#kansaGradient)" />
        <defs>
          <linearGradient id="kansaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 4,
    name: "Himalayan Clay",
    category: "Organic Earthenware",
    location: "Kangra Valley, HP",
    specialty: "Slow-firing Terracotta",
    rating: "4.7",
    logo: (
      <svg className="w-12 h-12 text-amber-800" viewBox="0 0 100 100" fill="currentColor">
        <path d="M10 80 Q50 90 90 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Mountain + Pot outline */}
        <path d="M25 75 L42 45 L50 55 L65 35 L80 75 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="50" cy="72" rx="20" ry="12" fill="url(#clayGradient)" />
        <defs>
          <linearGradient id="clayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 5,
    name: "Royal Serveware",
    category: "Jaipur Luxury Guild",
    location: "Jaipur, Rajasthan",
    specialty: "Meenakari & Gold Foil Work",
    rating: "4.9",
    logo: (
      <svg className="w-12 h-12 text-amber-500" viewBox="0 0 100 100" fill="currentColor">
        <polygon points="50,15 61,38 86,38 66,53 74,77 50,62 26,77 34,53 14,38 39,38" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="48" r="14" fill="url(#royalGradient)" />
        <circle cx="50" cy="48" r="6" fill="#fff8f0" fillOpacity="0.3" />
        <defs>
          <linearGradient id="royalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 6,
    name: "Ganga Pottery",
    category: "Studio Terracotta",
    location: "Khurja, Uttar Pradesh",
    specialty: "Lead-free Ceramic Pots",
    rating: "4.8",
    logo: (
      <svg className="w-12 h-12 text-orange-700" viewBox="0 0 100 100" fill="currentColor">
        {/* Flower / Petals design */}
        <g transform="translate(50,50)" stroke="currentColor" strokeWidth="1" fill="none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="20"
              rx="8"
              ry="16"
              transform={`rotate(${deg})`}
              strokeOpacity="0.6"
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="15" fill="url(#gangaGradient)" />
        <defs>
          <linearGradient id="gangaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 7,
    name: "Indus Cookware",
    category: "Iron & Stoneware",
    location: "Palakkad, Kerala",
    specialty: "Pre-seasoned Cast Iron",
    rating: "4.9",
    logo: (
      <svg className="w-12 h-12 text-amber-700" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Sun & Tree motif */}
        <path d="M50 25 C38 45 42 70 50 75 C58 70 62 45 50 25 Z" fill="url(#indusGradient)" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
        <defs>
          <linearGradient id="indusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 8,
    name: "Heritage Loom",
    category: "Artisan Kitchen Linens",
    location: "Karur, Tamil Nadu",
    specialty: "Organic Loomed Linens",
    rating: "4.6",
    logo: (
      <svg className="w-12 h-12 text-orange-600" viewBox="0 0 100 100" fill="currentColor">
        <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Thread weaver motif */}
        <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.4">
          <line x1="30" y1="20" x2="30" y2="80" />
          <line x1="42" y1="20" x2="42" y2="80" />
          <line x1="58" y1="20" x2="58" y2="80" />
          <line x1="70" y1="20" x2="70" y2="80" />
          <line x1="20" y1="30" x2="80" y2="30" />
          <line x1="20" y1="42" x2="80" y2="42" />
          <line x1="20" y1="58" x2="80" y2="58" />
          <line x1="20" y1="70" x2="80" y2="70" />
        </g>
        <circle cx="50" cy="50" r="14" fill="url(#loomGradient)" />
        <defs>
          <linearGradient id="loomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
        </defs>
      </svg>
    ),
  }
];

export const VendorSection = () => {
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
    <section className="lazy-scroll-section py-6 md:py-8 relative overflow-hidden section-glass-ambient ambient-bronze border-y border-bronze-500/10">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 sm:mb-4 gap-4">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[8px] sm:text-[9px] font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-1.5"
            >
              <Award size={11} className="text-bronze-500" />
              Verified Heritage Hubs
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading">
              Shop by <span className="gradient-text">Artisan Clusters</span>
            </h2>
          </div>

          {/* View All & Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <Link
              href="/brands"
              className="text-xs sm:text-sm font-semibold text-bronze-600 dark:text-bronze-400 hover:text-bronze-500 inline-flex items-center gap-1"
            >
              Explore All Clusters
              <ArrowRight size={14} />
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-orange-500/20 bg-surface-card hover:bg-surface-hover text-orange-700 dark:text-orange-300 shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
          onTouchMove={handleDragMove}
          onMouseMove={handleDragMove}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 scrollbar-none px-4 -mx-4 sm:px-0 sm:mx-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="shrink-0 w-[82%] sm:w-[280px] bg-gradient-to-br from-surface-card to-bronze-500/[0.02] border border-bronze-500/15 rounded-3xl p-5 sm:p-6 shadow-md hover:border-bronze-500/40 flex flex-col justify-between group cursor-pointer relative overflow-hidden [contain:paint]"
            >


              <div>
                {/* Logo and Brand Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-900/40 p-2.5 shadow-md border border-bronze-500/20 group-hover:border-bronze-500/50 flex items-center justify-center flex-shrink-0">
                    {vendor.logo}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-heading font-display leading-tight group-hover:text-bronze-600 dark:group-hover:text-bronze-400">
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-orange-700 dark:text-bronze-500 font-semibold tracking-wide">
                      {vendor.category}
                    </p>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/[0.05] dark:bg-bronze-500/[0.08] text-[10px] sm:text-xs text-orange-800 dark:text-bronze-300 font-semibold mb-4 border border-orange-500/10">
                  <MapPin size={11} className="text-orange-600 dark:text-bronze-400" />
                  <span>{vendor.location}</span>
                </div>

                {/* Specialty with Gold Border Accent */}
                <p className="text-xs sm:text-sm text-body border-l-2 border-bronze-500/40 bg-bronze-500/[0.02] pl-3.5 py-1.5 rounded-r-lg italic text-muted leading-relaxed line-clamp-2">
                  &ldquo;{vendor.specialty}&rdquo;
                </p>
              </div>

              {/* Action Link & Premium Star Badge */}
              <div className="mt-5 pt-3 border-t border-bronze-500/10 flex items-center justify-between">
                <span className="inline-flex items-center justify-center gap-0.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold shadow-sm shadow-orange-500/10">
                  ★ {vendor.rating}
                </span>
                <Link
                  href={`/brands/${vendor.id}`}
                  onClickCapture={handleLinkClick}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-bronze-400 dark:hover:text-bronze-300 inline-flex items-center gap-0.5 group/btn"
                >
                  View Collection
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
