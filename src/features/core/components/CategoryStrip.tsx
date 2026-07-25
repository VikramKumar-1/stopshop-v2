"use client";
import React, { useState, useEffect, FormEvent, useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import {
  GlassWater,
  Bell,
  Boxes,
  Coffee,
  UtensilsCrossed,
  Grid,
  Soup,
  Search,
  X,
  ShoppingCart
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";

const categories = [
  {
    id: "copper",
    name: "Copper",
    icon: GlassWater,
    href: "/products/material/copper",
    bgColor: "bg-orange-50/70 dark:bg-orange-950/20",
    borderColor: "border-orange-100 dark:border-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    shadowColor: "group-hover:shadow-orange-200/40 dark:group-hover:shadow-orange-950/40",
  },
  {
    id: "brass",
    name: "Brass",
    icon: Bell,
    href: "/products/material/brass",
    bgColor: "bg-amber-50/70 dark:bg-amber-950/20",
    borderColor: "border-amber-100 dark:border-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    shadowColor: "group-hover:shadow-amber-200/40 dark:group-hover:shadow-amber-950/40",
  },
  {
    id: "steel",
    name: "Steel",
    icon: Boxes,
    href: "/products/material/steel",
    bgColor: "bg-slate-50/70 dark:bg-slate-900/20",
    borderColor: "border-slate-100 dark:border-slate-800/30",
    iconColor: "text-slate-600 dark:text-slate-400",
    shadowColor: "group-hover:shadow-slate-200/40 dark:group-hover:shadow-slate-950/40",
  },
  {
    id: "ceramic",
    name: "Ceramic",
    icon: Coffee,
    href: "/products/material/ceramic",
    bgColor: "bg-stone-50/70 dark:bg-stone-900/20",
    borderColor: "border-stone-100 dark:border-stone-850/30",
    iconColor: "text-stone-600 dark:text-stone-400",
    shadowColor: "group-hover:shadow-stone-200/40 dark:group-hover:shadow-stone-950/40",
  },
  {
    id: "kitchen-utility",
    name: "Kitchen Utility",
    icon: UtensilsCrossed,
    href: "/products?category=kitchen-utility",
    bgColor: "bg-emerald-50/70 dark:bg-emerald-950/20",
    borderColor: "border-emerald-100 dark:border-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    shadowColor: "group-hover:shadow-emerald-200/40 dark:group-hover:shadow-emerald-950/40",
  },
  {
    id: "kitchen-racks",
    name: "Kitchen Racks",
    icon: Grid,
    href: "/products?category=kitchen-racks",
    bgColor: "bg-purple-50/70 dark:bg-purple-950/20",
    borderColor: "border-purple-100 dark:border-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    shadowColor: "group-hover:shadow-purple-200/40 dark:group-hover:shadow-purple-950/40",
  },
  {
    id: "dinner-sets",
    name: "Dinner Sets",
    icon: Soup,
    href: "/products?category=dinner-sets",
    bgColor: "bg-rose-50/70 dark:bg-rose-950/20",
    borderColor: "border-rose-100 dark:border-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    shadowColor: "group-hover:shadow-rose-200/40 dark:group-hover:shadow-rose-950/40",
  },
];

import { usePathname } from "next/navigation";

export const CategoryStrip = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/vendor") || pathname.startsWith("/admin") || pathname === "/contact" || pathname.startsWith("/product") || pathname.startsWith("/profile") || pathname === "/cart" || pathname.startsWith("/checkout") || pathname.startsWith("/store") || pathname.startsWith("/worker")) return null;
  const { cartCount } = useCart();
  const { region } = useRegion();

  // Hydration-safe states
  const [scrollingDown, setScrollingDown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTabletLandscape, setIsTabletLandscape] = useState(false);
  const [showMobileStrip, setShowMobileStrip] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
      const isLg = window.matchMedia("(min-width: 1024px) and (max-width: 1279px)").matches;
      const isLand = window.matchMedia("(orientation: landscape)").matches;
      setIsTabletLandscape(isLg && isLand);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const [searchExpanded, setSearchExpandedState] = useState(false);
  const searchExpandedRef = useRef(false);
  const setSearchExpanded = (val: boolean) => {
    searchExpandedRef.current = val;
    setSearchExpandedState(val);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("stopshops_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const addToRecentSearches = (term: string) => {
    if (!term.trim()) return;
    const cleanTerm = term.trim();
    const updated = [
      cleanTerm,
      ...recentSearches.filter((q) => q.toLowerCase() !== cleanTerm.toLowerCase())
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("stopshops_recent_searches", JSON.stringify(updated));
  };

  const removeRecentSearch = (term: string) => {
    const updated = recentSearches.filter((q) => q !== term);
    setRecentSearches(updated);
    localStorage.setItem("stopshops_recent_searches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("stopshops_recent_searches");
  };

  // Fetch search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestionsOpen(true);

    const controller = new AbortController();
    const delayDebounceFn = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&take=5`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error fetching suggestions", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSuggestions(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchQuery]);

  const rafRef = useRef<number>(0);
  const isScrollingRef = useRef(false);
  const dragThreshold = 8;
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  // ─── SOLID SCROLL EFFECT WITH BOUNCE PROTECTION ───────────────────────────
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isHomepage = window.location.pathname === "/";
        const mobileMode = window.matchMedia("(max-width: 1023px)").matches;

        if (mobileMode) {
          const hero = document.getElementById("hero-section");
          const heroHeight = hero ? hero.offsetHeight : 600;
          const threshold = isHomepage ? (heroHeight - 88) : 100;

          // Introduce a 10px buffer to prevent continuous toggle bouncing when hovering at the threshold boundary
          if (currentScrollY > threshold + 10) {
            setShowMobileStrip(true);
          } else if (currentScrollY < threshold - 10) {
            setShowMobileStrip(false);
          }
        } else {
          if (isHomepage) {
            const hero = document.getElementById("hero-section");
            const heroHeight = hero ? hero.offsetHeight : 600;
            
            if (currentScrollY <= 120) {
              setScrollingDown(false);
              setSearchExpanded(false);
            } else {
              const diff = currentScrollY - lastScrollY;
              if (Math.abs(diff) > 10) {
                if (diff > 0) {
                  setScrollingDown(true);
                } else if (currentScrollY <= heroHeight) {
                  setScrollingDown(false);
                  if (!searchExpandedRef.current) setSearchExpanded(false);
                }
              }
            }
          } else {
            // Other pages
            const isStickyPage = window.location.pathname.startsWith("/product") || window.location.pathname.startsWith("/profile") || window.location.pathname === "/cart" || window.location.pathname.startsWith("/checkout");
            if (isStickyPage) {
              setScrollingDown(false);
            } else if (currentScrollY <= 120) {
              setScrollingDown(false);
              if (!searchExpandedRef.current) setSearchExpanded(false);
            } else {
              const diff = currentScrollY - lastScrollY;
              if (Math.abs(diff) > 10) { // 10px threshold to prevent bouncing
                if (diff > 0) {
                  setScrollingDown(true);
                } else {
                  setScrollingDown(false);
                }
              }
            }
          }
        }
        lastScrollY = currentScrollY;
        rafRef.current = 0;
      });
    };

    // Initialize state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // ─── Drag detection for horizontal category scroll ────────────────────────
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
    if (
      Math.abs(clientX - startX.current) > dragThreshold ||
      Math.abs(clientY - startY.current) > dragThreshold
    ) {
      isScrollingRef.current = true;
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isScrollingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div
      className={`fixed lg:sticky z-40 w-full border-b border-orange-500/30 dark:border-orange-500/40 bg-orange-100 dark:bg-orange-950 lg:bg-white/85 lg:dark:bg-[#141414]/85 lg:backdrop-blur-md shadow-sm transition-[transform,opacity] duration-300 ease-out top-[95px] lg:top-[112px] ${
        isMobile
          ? (showMobileStrip ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none")
          : ((scrollingDown || searchExpanded) ? "-translate-y-[80px]" : "translate-y-0")
      }`}
    >

      <div className="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">

        {/* Left Scroll Fade Indicator (only visible on mobile overflow) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--surface)] to-transparent pointer-events-none z-10 md:hidden" />

        {/* Right Scroll Fade Indicator (only visible on mobile overflow) */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--surface)] to-transparent pointer-events-none z-10 md:hidden" />

        <div className={`flex items-center justify-between w-full gap-4 transition-all duration-300 ${scrollingDown && isTabletLandscape ? "py-1" : "py-1 sm:py-2 lg:py-1.5 xl:py-2"}`}>

          {/* Left Side: Logo (Instantaneous toggle with optimized animation) */}
          {(scrollingDown || searchExpanded) && (
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200">
              <Link href="/" className="flex items-center gap-2 group whitespace-nowrap">
                <img
                  src="/logo.webp"
                  alt="StopShop Logo"
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform shrink-0"
                />
                <span className="text-lg sm:text-xl font-display font-bold tracking-tight text-heading">
                  Stop<span className="gradient-text">Shop</span>
                </span>
              </Link>
            </div>
          )}

          {/* Center: Category Scroll Container OR Search Input */}
          <div className="flex-grow flex justify-center items-center overflow-visible min-w-0 min-h-[48px]">
            {searchExpanded ? (
              /* Expandable Search Input */
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 w-full max-w-[500px] mx-auto animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <div className="relative flex-grow h-10 flex items-center bg-bronze-500/[0.04] dark:bg-white/[0.02] border border-bronze-500/20 hover:border-bronze-500/40 focus-within:border-bronze-500/80 focus-within:bg-surface-card focus-within:shadow-[0_4px_20px_rgba(217,119,6,0.08)] rounded-full transition-all duration-300">
                  <button type="submit" aria-label="Search" className="ml-4 text-bronze-500/70 hover:text-bronze-600 transition-colors">
                    <Search size={14} />
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSuggestionsOpen(true);
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Search premium bronze, copper & brass..."
                    autoFocus
                    className="w-full h-full pl-2 pr-12 bg-transparent text-heading placeholder-muted text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchExpanded(false);
                      setSearchQuery("");
                      setSuggestionsOpen(false);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-orange-500/10 text-muted hover:text-heading flex items-center justify-center transition-colors"
                    aria-label="Close search"
                  >
                    <X size={14} />
                  </button>

                  {/* Suggestions Dropdown */}
                  {suggestionsOpen && (
                    <div className="absolute left-0 right-0 mt-2 top-full bg-[var(--surface)] border border-border dark:border-white/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)] z-50 overflow-hidden">
                      
                      {!searchQuery.trim() ? (
                        <div className="p-4 space-y-4">
                          {/* Recent Searches section */}
                          {recentSearches.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-wider">
                                <span>Recent Searches</span>
                                <button 
                                  type="button" 
                                  onClick={clearRecentSearches}
                                  className="hover:text-orange-500 cursor-pointer text-[10px] font-semibold"
                                >
                                  Clear All
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {recentSearches.map((term, idx) => (
                                  <div 
                                    key={idx} 
                                    className="flex items-center gap-1.5 bg-bronze-500/[0.05] hover:bg-bronze-500/10 border border-border rounded-full px-3 py-1 text-[11px] text-heading font-medium shrink-0 cursor-pointer"
                                    onClick={() => {
                                      addToRecentSearches(term);
                                      setSearchQuery(term);
                                      setSuggestionsOpen(true);
                                      window.location.href = `/products?search=${encodeURIComponent(term)}`;
                                    }}
                                  >
                                    <span>{term}</span>
                                    <button 
                                      type="button" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeRecentSearch(term);
                                      }}
                                      className="text-muted hover:text-red-500 text-[12px] font-black cursor-pointer leading-none"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Popular/Trending searches */}
                          <div className="space-y-2">
                            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
                              🔥 Popular Searches
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {[
                                { term: "Copper Bottle", category: "copper-products" },
                                { term: "Bronze Kadai", category: "kitchen-utility" },
                                { term: "Puja Set", category: "pooja-collection" },
                                { term: "Dinner Plate", category: "dinner-sets" }
                              ].map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    addToRecentSearches(item.term);
                                    setSearchQuery(item.term);
                                    window.location.href = `/products?search=${encodeURIComponent(item.term)}&category=${item.category}`;
                                  }}
                                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-surface hover:bg-orange-500/5 hover:border-orange-500/20 text-left cursor-pointer text-body hover:text-orange-500 font-semibold"
                                >
                                  <span className="text-[10px]">🔍</span>
                                  <span className="font-semibold">{item.term}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {loadingSuggestions && suggestions.length === 0 && (
                            <div className="p-4 text-center text-xs text-muted">
                              <span className="inline-block animate-spin mr-2">⏳</span> Searching...
                            </div>
                          )}
                          
                          {!loadingSuggestions && suggestions.length === 0 && (
                            <div className="p-4 text-center text-xs text-muted">
                              No products found for "{searchQuery}"
                            </div>
                          )}

                          {suggestions.length > 0 && (
                            <div className="p-2 space-y-1">
                              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted tracking-wider uppercase border-b border-border/50">
                                Suggested Products
                              </div>
                              {suggestions.map((product: any) => (
                                <button
                                  type="button"
                                  key={product.id}
                                  onClick={() => {
                                    addToRecentSearches(product.name);
                                    window.location.href = `/product/${product.slug || product.id}`;
                                    setSearchExpanded(false);
                                    setSearchQuery("");
                                    setSuggestionsOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-surface-hover rounded-xl cursor-pointer group"
                                >
                                  {product.image || product.images?.[0] ? (
                                    <img
                                      src={product.image || product.images[0]}
                                      alt={product.name}
                                      className="w-10 h-10 object-cover rounded-lg border border-border bg-white shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-bronze-100 dark:bg-bronze-900/40 rounded-lg flex items-center justify-center text-bronze-500 font-bold text-xs shrink-0">
                                      SSP
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-heading truncate group-hover:text-orange-500">
                                      {product.name}
                                    </h4>
                                    <p className="text-[10px] text-muted truncate">
                                      in {product.category?.name || product.categoryName?.replace(/-/g, " ") || "General"}
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-bold text-orange-500 dark:text-orange-400">
                                      {region === "IN" ? "₹" : "$"} {product.price}
                                    </span>
                                  </div>
                                </button>
                              ))}
                              
                              <button
                                type="button"
                                onClick={() => {
                                  addToRecentSearches(searchQuery);
                                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                                  setSearchExpanded(false);
                                  setSuggestionsOpen(false);
                                }}
                                className="w-full text-center py-2.5 text-[11px] font-bold text-orange-500 dark:text-orange-400 hover:bg-orange-500/5 rounded-xl border-t border-border/50 cursor-pointer"
                              >
                                See all results for "{searchQuery}"
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            ) : (
              /* Category Scroll Container */
              <div
                onTouchStart={handleDragStart}
                onMouseDown={handleDragStart}
                onTouchMove={handleDragMove}
                onMouseMove={handleDragMove}
                className="flex overflow-x-auto scrollbar-none items-center gap-3 sm:gap-5 lg:gap-4 xl:gap-5 w-full justify-start lg:justify-center"
              >
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isMini = scrollingDown && isTabletLandscape;
                  return (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClickCapture={handleLinkClick}
                      className={`group flex flex-col items-center shrink-0 transition-all duration-300 text-center ${
                        isMini ? "gap-0.5 w-[50px] lg:w-[64px]" : "gap-1 w-[58px] sm:w-[92px] lg:w-[78px] xl:w-[92px]"
                      }`}
                    >
                      <div className={`rounded-lg lg:rounded-xl flex items-center justify-center border border-orange-500/25 dark:border-orange-500/35 group-hover:border-orange-500/60 transition-all duration-300 shadow-sm group-hover:shadow-md ${cat.bgColor} ${cat.shadowColor} ${
                        isMini ? "w-7 h-7 lg:w-8 lg:h-8" : "w-8 h-8 sm:w-12 sm:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12"
                      }`}>
                        <Icon size={14} strokeWidth={1.8} className={`${cat.iconColor} sm:hidden transition-transform duration-300 group-hover:scale-110`} />
                        <Icon size={16} strokeWidth={1.8} className={`hidden sm:block xl:hidden ${cat.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                        <Icon size={18} strokeWidth={1.8} className={`hidden xl:block ${cat.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                      </div>
                      <span className={`font-semibold text-muted group-hover:text-heading whitespace-nowrap transition-all duration-300 tracking-wide block w-full truncate ${
                        isMini ? "text-[0px] h-0 opacity-0 pointer-events-none" : "text-[8px] sm:text-[10px]"
                      }`}>
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Controls (Instantaneous toggle with optimized animation) */}
          {(scrollingDown || searchExpanded) && (
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
              {/* Search Icon Toggle */}
              {!searchExpanded && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchExpanded(true);
                    setSuggestionsOpen(true);
                  }}
                  className="p-2 hover:bg-orange-500/10 text-muted hover:text-heading rounded-full transition-colors flex-shrink-0"
                  aria-label="Open search"
                >
                  <Search size={18} />
                </button>
              )}

              {/* Cart Button */}
              <Link
                href="/cart"
                className="p-2 hover:bg-orange-500/10 text-muted hover:text-heading rounded-full transition-colors relative flex items-center justify-center flex-shrink-0"
                aria-label="View shopping cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-bold text-[9px] rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Theme Toggle */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>

              {/* Contact Us button */}
              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-[11px] sm:text-xs font-bold transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/25 whitespace-nowrap flex-shrink-0"
              >
                Contact Us
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


