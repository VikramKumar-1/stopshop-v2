"use client";
import Link from "next/link";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, Heart, ShoppingCart, ChevronDown, LogOut, Store, PhoneCall, LayoutDashboard, Package, Home, Grid, Loader2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/context/CartContext";

import { usePathname } from "next/navigation";
import { useRegion, currencyDatabase } from "@/context/RegionContext";
import { useWishlist } from "@/context/WishlistContext";
import { countries, getFlagEmoji } from "@/lib/countries";

const navLinks = [
  { href: "/products", label: "Shop Products" },
  { href: "/about", label: "How We Do It" },
  { href: "/contact", label: "Get a Quote" },
];

export const Navbar = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/worker")) return null;
  const isDashboard = (pathname.startsWith("/vendor") && !pathname.startsWith("/vendor-shop")) || pathname.startsWith("/admin");
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { region, isLoaded, setRegion } = useRegion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isProfilePage = pathname.startsWith("/profile") && !user;

  // Industry-level e-commerce smart search states
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Mobile bottom navigation scroll state
  const [bottomVisible, setBottomVisible] = useState(true);
  const rafRef = useRef<number>(0);
  const navRef = useRef<HTMLElement>(null);

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

  // Custom searchable currency dropdown states
  const [desktopCurrencyOpen, setDesktopCurrencyOpen] = useState(false);
  const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");

  // Close currency dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".currency-container-desktop")) {
        setDesktopCurrencyOpen(false);
      }
      if (!target.closest(".currency-container-mobile")) {
        setMobileCurrencyOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Search suggestions states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Fetch search suggestions with 2-char guard and request aborting
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

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

  // Click outside to close search suggestions
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const renderSuggestions = (isMobile: boolean) => {
    if (!suggestionsOpen) return null;

    // Empty query: Show smart Recent searches and Popular keyword badges
    if (!searchQuery.trim()) {
      return (
        <div 
          className="absolute left-0 right-0 mt-2 bg-[var(--surface)] border border-border dark:border-white/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)] z-[110] p-4 space-y-4 top-full overflow-hidden"
          style={{ width: "100%" }}
        >
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
      );
    }

    return (
      <div 
        className={`absolute left-0 right-0 mt-2 bg-[var(--surface)] border border-border dark:border-white/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)] z-[110] overflow-hidden ${isMobile ? "top-full" : "top-full"}`}
        style={{ width: "100%" }}
      >
        {loadingSuggestions && suggestions.length === 0 && (
          <div className="p-4 text-center text-xs text-muted">
            <span className="inline-block animate-spin mr-2">⏳</span> Searching...
          </div>
        )}
        
        {!loadingSuggestions && suggestions.length === 0 && searchQuery.trim() && (
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
                key={product.id}
                onClick={() => {
                  addToRecentSearches(product.name);
                  window.location.href = `/product/${product.slug || product.id}`;
                  setSuggestionsOpen(false);
                  setSearchOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-surface-hover rounded-xl cursor-pointer group"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg border border-border bg-white"
                  />
                ) : (
                  <div className="w-10 h-10 bg-bronze-100 dark:bg-bronze-900/40 rounded-lg flex items-center justify-center text-bronze-500 font-bold text-xs">
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
              onClick={() => {
                addToRecentSearches(searchQuery);
                window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                setSuggestionsOpen(false);
                setSearchOpen(false);
              }}
              className="w-full text-center py-2.5 text-[11px] font-bold text-orange-500 dark:text-orange-400 hover:bg-orange-500/5 rounded-xl border-t border-border/50 cursor-pointer"
            >
              See all results for "{searchQuery}"
            </button>
          </div>
        )}
      </div>
    );
  };

  const checkUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/me", { method: "POST" });
      if (res.ok) {
        setUser(null);
        window.location.href = "/";
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Reset navbar state on route change to prevent flickering
  useEffect(() => {
    setVisible(true);
    setBottomVisible(true);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isDashboard) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    // Track visibility via local vars to avoid calling setState on every frame
    let prevVisible = true;
    let prevBottomVisible = true;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const isHomepage = window.location.pathname === "/";
      const isMobile = window.innerWidth < 1024;
      
      let nextVisible = prevVisible;
      if (isMobile) {
        nextVisible = true;
      } else if (isHomepage) {
        const hero = document.getElementById("hero-section");
        const heroHeight = hero ? hero.offsetHeight : 600;
        
        if (currentScrollY <= 60) {
          nextVisible = true;
        } else {
          const diff = currentScrollY - lastScrollY;
          if (Math.abs(diff) > 10) {
            if (diff > 0) {
              nextVisible = false;
            } else if (currentScrollY <= heroHeight) {
              nextVisible = true;
            }
          }
        }
      } else {
        // Standard page behavior: always keep navbar visible (persistently sticky)
        nextVisible = true;
      }

      // Handle mobile bottom navbar scroll visibility (Blinkit style)
      let nextBottomVisible = prevBottomVisible;
      if (currentScrollY <= 10) {
        nextBottomVisible = true;
      } else {
        const diff = currentScrollY - lastScrollY;
        if (Math.abs(diff) > 15) {
          nextBottomVisible = currentScrollY <= lastScrollY;
        }
      }
      
      // Only call setState when value actually changes — prevents React re-renders during scroll
      if (nextVisible !== prevVisible) {
        prevVisible = nextVisible;
        setVisible(nextVisible);
      }
      if (nextBottomVisible !== prevBottomVisible) {
        prevBottomVisible = nextBottomVisible;
        setBottomVisible(nextBottomVisible);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDashboard, user, pathname]);

  const marqueeItems = [
    "CASH ON DELIVERY AVAILABLE",
    "FREE SHIPPING ON BULK ORDERS",
    "SHIPPING WORLDWIDE"
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {!isDashboard && (
        <div 
          className="fixed top-0 left-0 right-0 h-8 z-[120] bg-[#1a0f08] border-b border-bronze-800/40 flex items-center overflow-hidden"
        >
          <div className="flex whitespace-nowrap w-full">
            <div className="flex animate-marquee text-[9px] sm:text-[10px] font-medium tracking-[0.25em] text-bronze-200/90 uppercase items-center gap-16">
              {[1, 2, 3, 4].map((groupIndex) => (
                <div key={groupIndex} className="flex gap-16 items-center shrink-0 pr-16">
                  {marqueeItems.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-16">
                      <span className="text-bronze-500">✦</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <style jsx global>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-25%); }
            }
            .animate-marquee {
              display: inline-flex;
              animation: marquee 40s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      )}

      {/* Main Navigation bar */}
      <nav
        className={`fixed lg:sticky ${isDashboard ? "top-0" : "top-8"} left-0 right-0 z-[100] w-full border-b border-orange-500/30 dark:border-orange-500/40 bg-white/85 dark:bg-[#141414]/85 backdrop-blur-md transition-[transform,opacity] duration-300 ease-out ${visible || isDashboard ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full pt-1.5 pb-0 lg:py-0">
            
            {/* Top Row (Header Actions) */}
            <div className="flex justify-between items-center h-14 lg:h-20 gap-4">
              
              {/* Menu and Brand Logo */}
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                {!isDashboard && !isProfilePage && (
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden p-1.5 text-muted hover:text-heading -ml-2 block flex-shrink-0"
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                )}

                <Link 
                  href={(pathname.startsWith("/vendor") && !pathname.startsWith("/vendor-shop")) ? "/vendor/dashboard" : pathname.startsWith("/admin") ? "/admin" : "/"} 
                  className={`flex items-center gap-2.5 sm:gap-3 group ${searchOpen ? "hidden" : "flex"}`}
                >
                  <img 
                    src="/logo.webp" 
                    alt="StopShop Logo" 
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl object-contain shadow-sm group-hover:scale-105 transition-transform shrink-0"
                  />
                  <span className="inline-block text-xl sm:text-2xl lg:text-3xl font-display font-bold tracking-tight text-heading">
                    Stop<span className="gradient-text">Shop</span>
                  </span>
                </Link>
              </div>

              {/* Centered Wide Search Bar (Desktop only, permanently visible) */}
              {!isDashboard && !isProfilePage && (
                <div className="hidden lg:flex flex-1 max-w-[340px] xl:max-w-[400px] mx-6 relative search-container">
                  <form onSubmit={handleSearchSubmit} className="relative w-full h-10 flex items-center bg-bronze-500/[0.04] dark:bg-white/[0.02] border border-bronze-500/20 hover:border-bronze-500/40 focus-within:border-bronze-500/80 focus-within:bg-surface-card focus-within:shadow-[0_4px_20px_rgba(217,119,6,0.08)] rounded-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSuggestionsOpen(true);
                      }}
                      onFocus={() => setSuggestionsOpen(true)}
                      placeholder="Search premium bronze, brass & copper..."
                      className="w-full h-full pl-5 pr-20 bg-transparent text-heading placeholder-muted text-[16px] lg:text-xs focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-orange-500/10 text-muted hover:text-heading rounded-full cursor-pointer z-[120]"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="h-full px-4 xl:px-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white flex items-center justify-center border-l border-bronze-500/20 rounded-r-full absolute right-0 top-0 bottom-0"
                      aria-label="Search"
                    >
                      <Search size={14} />
                    </button>
                  </form>
                  {renderSuggestions(false)}
                </div>
              )}
              
              {/* Expandable Search Input (Mobile only, shown when searchOpen is true) */}
              {!isDashboard && !isProfilePage && searchOpen && (
                <div className="lg:hidden flex-grow mx-1 relative search-container animate-in fade-in slide-in-from-top-1 duration-200">
                  <form onSubmit={handleSearchSubmit} className="relative w-full h-10 flex items-center bg-bronze-500/[0.04] dark:bg-white/[0.02] border border-bronze-500/20 hover:border-bronze-500/40 focus-within:border-bronze-500/80 focus-within:bg-surface-card focus-within:shadow-[0_4px_20px_rgba(217,119,6,0.08)] rounded-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSuggestionsOpen(true);
                      }}
                      onFocus={() => setSuggestionsOpen(true)}
                      placeholder="Search..."
                      autoFocus
                      className="w-full h-full pl-4 pr-16 bg-transparent text-heading placeholder-muted text-[16px] lg:text-xs focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-orange-500/10 text-muted hover:text-heading rounded-full cursor-pointer z-[120]"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="h-full px-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white flex items-center justify-center border-l border-bronze-500/20 rounded-r-full absolute right-0 top-0 bottom-0"
                      aria-label="Search"
                    >
                      <Search size={13} />
                    </button>
                  </form>
                  {renderSuggestions(true)}
                </div>
              )}

              {/* Close Search Button (Mobile only, shown when searchOpen is true) */}
              {!isDashboard && !isProfilePage && searchOpen && (
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="lg:hidden p-1.5 hover:bg-orange-500/10 text-muted hover:text-heading rounded-full flex-shrink-0"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              )}

              {/* Desktop Nav Links & Navigation Controls (Always visible on desktop) */}
              {!isProfilePage && (
                <div className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
                  {/* Region / Currency Switcher */}
                  <div className="relative currency-container-desktop">
                    <button
                      onClick={() => isLoaded && setDesktopCurrencyOpen(!desktopCurrencyOpen)}
                      className={`flex items-center gap-1.5 bg-surface hover:bg-surface-hover border border-border px-2.5 py-1.5 rounded-xl text-xs font-bold text-heading shadow-sm cursor-pointer ${!isLoaded ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isLoaded ? (
                        <>
                          <img
                            src={`https://flagcdn.com/w20/${region.toLowerCase()}.png`}
                            alt={region}
                            className="w-4 h-3 object-cover rounded-sm"
                          />
                          <span>{region} ({currencyDatabase[region]?.s || "$"})</span>
                          <span className="text-[8px] text-muted">▼</span>
                        </>
                      ) : (
                        <span className="w-16 h-3 bg-border/40 rounded-sm animate-pulse"></span>
                      )}
                    </button>
                    
                    {desktopCurrencyOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-52 bg-[var(--surface)] border border-border shadow-2xl rounded-xl p-2 z-[999] text-xs">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={currencySearch}
                          onChange={(e) => setCurrencySearch(e.target.value)}
                          className="w-full px-2.5 py-1.5 mb-2 rounded-lg bg-surface-card border border-border text-xs text-heading outline-none focus:border-orange-500"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {!currencySearch && (
                            <>
                              <div className="px-2 py-1 text-[9px] font-bold text-orange-500 uppercase tracking-wider">
                                Popular Regions
                              </div>
                              {countries
                                .filter((c) => ["IN", "US", "GB", "AE", "CA"].includes(c.code))
                                .map((c) => {
                                  const currencyInfo = currencyDatabase[c.code] || { c: "USD", s: "$" };
                                  return (
                                    <button
                                      key={`pop-desktop-${c.code}`}
                                      onClick={() => {
                                        setRegion(c.code);
                                        setDesktopCurrencyOpen(false);
                                        setCurrencySearch("");
                                      }}
                                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-hover flex items-center justify-between text-heading font-semibold cursor-pointer border-l-2 border-orange-500 bg-orange-500/[0.03]"
                                    >
                                      <span className="flex items-center gap-2">
                                        <img
                                          src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                          alt={c.name}
                                          className="w-4 h-3 object-cover rounded-sm"
                                        />
                                        <span className="font-bold">{c.code} - {c.name.substring(0, 12)}</span>
                                      </span>
                                      <span className="text-orange-500 font-bold">{currencyInfo.s}</span>
                                    </button>
                                  );
                                })}
                              <div className="h-px bg-border my-1.5" />
                              <div className="px-2 py-1 text-[9px] font-bold text-muted uppercase tracking-wider">
                                All Regions
                              </div>
                            </>
                          )}
                          {countries
                            .filter((c) => c.name.toLowerCase().includes(currencySearch.toLowerCase()) || c.code.toLowerCase().includes(currencySearch.toLowerCase()))
                            .map((c) => {
                              const currencyInfo = currencyDatabase[c.code] || { c: "USD", s: "$" };
                              return (
                                <button
                                  key={c.code}
                                  onClick={() => {
                                    setRegion(c.code);
                                    setDesktopCurrencyOpen(false);
                                    setCurrencySearch("");
                                  }}
                                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-hover flex items-center justify-between text-heading cursor-pointer"
                                >
                                  <span className="flex items-center gap-2">
                                    <img
                                      src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                      alt={c.name}
                                      className="w-4 h-3 object-cover rounded-sm"
                                    />
                                    <span className="font-semibold">{c.code} - {c.name.substring(0, 12)}{c.name.length > 12 ? ".." : ""}</span>
                                  </span>
                                  <span className="text-muted font-bold">{currencyInfo.s}</span>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>

                  <ThemeToggle />
                  
                  {/* Amazon-style User profile link & Dropdown */}
                  {!pathname.startsWith("/admin") && (
                    <div className="relative group/profile text-left py-2">
                      <button className="flex items-center gap-1.5 text-muted hover:text-heading cursor-pointer focus:outline-none">
                        <div className="w-8 h-8 rounded-full bg-bronze-500/10 dark:bg-bronze-500/25 flex items-center justify-center text-bronze-600 dark:text-bronze-400">
                          <User size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted leading-tight">
                            {authLoading ? "Loading..." : user ? `Hello, ${user.name.split(" ")[0]}` : "Hello, Sign in"}
                          </span>
                          <span className="text-xs font-bold text-heading leading-tight flex items-center gap-0.5">
                            Account & Lists
                            <ChevronDown size={10} className="text-muted" />
                          </span>
                        </div>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-60 bg-[var(--surface)] border border-border dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_45px_rgba(0,0,0,0.4)] rounded-2xl py-2 hidden group-hover/profile:block z-[9999] text-xs">
                        {/* Header: Sign In / Welcome */}
                        {!user ? (
                          <div className="px-4 py-3 border-b border-border dark:border-white/10 flex items-center justify-between gap-3">
                            <span className="text-muted text-xs font-semibold">New customer?</span>
                            <Link
                              href="/profile?mode=login"
                              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-lg text-[11px] shadow-sm"
                            >
                              Login
                            </Link>
                          </div>
                        ) : (
                          <div className="px-4 py-3 border-b border-border dark:border-white/10 flex flex-col gap-0.5">
                            <span className="text-[10px] text-muted font-medium">Welcome back,</span>
                            <span className="font-bold text-heading text-xs truncate">{user.name}</span>
                          </div>
                        )}

                        {/* Menu List Options */}
                        <div className="p-1 space-y-0.5">
                          {!isDashboard && !user?.parentVendorId && (
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl"
                            >
                              <User size={15} className="text-muted" />
                              <span>My Profile</span>
                            </Link>
                          )}

                          {user?.parentVendorId && (
                            <Link
                              href="/worker/studio"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                            >
                              <LayoutDashboard size={15} className="text-muted" />
                              <span>Worker Studio</span>
                            </Link>
                          )}
                          
                          {user?.role === "vendor" && (
                            <Link
                              href="/vendor/profile"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl"
                            >
                              <Store size={15} className="text-muted" />
                              <span>Vendor Profile</span>
                            </Link>
                          )}



                          {!isDashboard && (
                            <>
                              <Link
                                href="/orders"
                                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                              >
                                <Package size={15} className="text-muted" />
                                <span>Orders & Returns</span>
                              </Link>

                              <Link
                                href="/wishlist"
                                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                              >
                                <Heart size={15} className="text-muted" />
                                <span>My Wishlist</span>
                              </Link>
                            </>
                          )}

                          {/* Role Based Portals */}
                          {user && user.role === "admin" && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                            >
                              <LayoutDashboard size={15} className="text-muted" />
                              <span>Admin Panel</span>
                            </Link>
                          )}

                          {user && user.role === "vendor" && !isDashboard && (
                            <Link
                              href="/vendor/dashboard"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                            >
                              <LayoutDashboard size={15} className="text-muted" />
                              <span>Vendor Dashboard</span>
                            </Link>
                          )}
                          {(!user || user.role !== "vendor") && (
                            <Link
                              href="/vendor/register"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                            >
                              <Store size={15} className="text-muted" />
                              <span>Become a Seller</span>
                            </Link>
                          )}

                          <Link
                            href="/contact"
                            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                          >
                            <PhoneCall size={15} className="text-muted" />
                            <span>Help & Support</span>
                          </Link>

                          {isDashboard && user && (
                            <Link
                              href="/"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                            >
                              <LayoutDashboard size={15} className="text-muted" />
                              <span>User Dashboard</span>
                            </Link>
                          )}

                          {/* Log Out */}
                          {user && (
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/5 rounded-xl text-left"
                            >
                              <LogOut size={15} />
                              <span>Sign Out</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wishlist, Cart & Contact Us (Hidden on dashboards) */}
                  {!isDashboard && (
                    <>
                      {/* Wishlist Icon */}
                      <Link 
                        href="/wishlist" 
                        className="relative flex items-center gap-1.5 text-muted hover:text-heading group/wishlist"
                      >
                        <div className="relative">
                          <Heart size={20} />
                          {wishlistCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[var(--surface)] shadow-sm">
                              {wishlistCount}
                            </span>
                          )}
                        </div>
                        <span className="hidden xl:inline text-xs font-bold text-heading">Wishlist</span>
                      </Link>

                      {/* Amazon-style Shopping Cart */}
                      <Link 
                        href="/cart" 
                        className="flex items-end gap-1.5 text-muted hover:text-heading group/cart"
                      >
                        <div className="relative pb-0.5">
                          <span className="absolute -top-2 left-2 text-[10px] font-extrabold text-orange-500 dark:text-orange-400 bg-[var(--surface)] px-0.5 rounded-full">
                            {cartCount}
                          </span>
                          <ShoppingCart size={22} />
                        </div>
                        <span className="text-xs font-bold text-heading">Cart</span>
                      </Link>

                      {/* Sell with us button */}
                      {(!user || user.role !== "vendor") && (
                        <Link
                          href="/vendor/register"
                          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-orange-500/10 whitespace-nowrap ml-2"
                        >
                          Sell with us
                        </Link>
                      )}
                    </>
                  )}
                  {pathname.startsWith("/vendor") && !pathname.startsWith("/vendor-shop") && (
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-500 text-[11px] sm:text-xs font-bold whitespace-nowrap ml-2 cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  )}
                </div>
              )}
              {isProfilePage && (!user || user.role !== "vendor") && (
                <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                  <Link
                    href="/vendor/register"
                    className="px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-orange-500/10 whitespace-nowrap ml-2"
                  >
                    Sell with us
                  </Link>
                </div>
              )}

              {/* Mobile Actions (Icons visible on mobile only) */}
                <div className={`flex items-center gap-1.5 lg:hidden flex-shrink-0 ${searchOpen ? "hidden" : "flex"}`}>
                  <div className={`items-center gap-1.5 ${searchOpen ? "hidden" : "flex"}`}>
                    {/* Click-to-Expand Search Icon */}
                    {!isDashboard && (
                      <button
                        onClick={() => setSearchOpen(true)}
                        className="p-1.5 text-muted hover:text-heading"
                        aria-label="Open search"
                      >
                        <Search size={18} />
                      </button>
                    )}

                    {/* Mobile Region Switcher */}
                    <div className="relative currency-container-mobile">
                      <button
                        onClick={() => isLoaded && setMobileCurrencyOpen(!mobileCurrencyOpen)}
                        className={`flex items-center gap-1 bg-surface hover:bg-surface-hover border border-border px-2 py-1 rounded-xl text-[10px] font-bold text-heading shadow-sm cursor-pointer ${!isLoaded ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {isLoaded ? (
                          <>
                            <img
                              src={`https://flagcdn.com/w20/${region.toLowerCase()}.png`}
                              alt={region}
                              className="w-4 h-3 object-cover rounded-sm"
                            />
                            <span>{region}</span>
                            <span className="text-[6px] text-muted ml-0.5">▼</span>
                          </>
                        ) : (
                          <span className="w-10 h-3 bg-border/40 rounded-sm animate-pulse"></span>
                        )}
                      </button>
                      
                      {mobileCurrencyOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-48 bg-[var(--surface)] border border-border shadow-2xl rounded-xl p-2 z-[999] text-xs">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            className="w-full px-2 py-1 mb-2 rounded-lg bg-surface-card border border-border text-xs text-heading outline-none focus:border-orange-500"
                          />
                          <div className="max-h-40 overflow-y-auto space-y-0.5">
                            {!currencySearch && (
                              <>
                                <div className="px-2 py-1 text-[8px] font-bold text-orange-500 uppercase tracking-wider">
                                  Popular
                                </div>
                                {countries
                                  .filter((c) => ["IN", "US", "GB", "AE", "CA"].includes(c.code))
                                  .map((c) => {
                                    const currencyInfo = currencyDatabase[c.code] || { c: "USD", s: "$" };
                                    return (
                                      <button
                                        key={`pop-mobile-${c.code}`}
                                        onClick={() => {
                                          setRegion(c.code);
                                          setMobileCurrencyOpen(false);
                                          setCurrencySearch("");
                                        }}
                                        className="w-full text-left px-2 py-1 rounded-lg hover:bg-surface-hover flex items-center justify-between text-heading font-semibold cursor-pointer border-l border-orange-500 bg-orange-500/[0.03]"
                                      >
                                        <span className="flex items-center gap-1.5">
                                          <img
                                            src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                            alt={c.name}
                                            className="w-4 h-3 object-cover rounded-sm"
                                          />
                                          <span className="font-bold">{c.code}</span>
                                        </span>
                                        <span className="text-orange-500 font-bold">{currencyInfo.s}</span>
                                      </button>
                                    );
                                  })}
                                <div className="h-px bg-border my-1" />
                                <div className="px-2 py-1 text-[8px] font-bold text-muted uppercase tracking-wider">
                                  All
                                </div>
                              </>
                            )}
                            {countries
                              .filter((c) => c.name.toLowerCase().includes(currencySearch.toLowerCase()) || c.code.toLowerCase().includes(currencySearch.toLowerCase()))
                              .map((c) => {
                                const currencyInfo = currencyDatabase[c.code] || { c: "USD", s: "$" };
                                return (
                                  <button
                                    key={c.code}
                                    onClick={() => {
                                      setRegion(c.code);
                                      setMobileCurrencyOpen(false);
                                      setCurrencySearch("");
                                    }}
                                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-hover flex items-center justify-between text-heading cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <img
                                        src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                        alt={c.name}
                                        className="w-4 h-3 object-cover rounded-sm"
                                      />
                                      <span className="font-semibold">{c.code}</span>
                                    </span>
                                    <span className="text-muted font-bold">{currencyInfo.s}</span>
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>

                    <ThemeToggle />

                  </div>
                </div>

            </div>

          </div>
        </div>

        {/* Mobile Expandable Nav Links */}
          {mobileOpen && (
            <div
              className="lg:hidden border-t border-border bg-[var(--surface)] max-h-[calc(100vh-100px)] overflow-y-auto"
            >
              <div className="px-4 py-5 space-y-2">

                {/* User Welcome Card on Mobile */}
                {user ? (
                  <div className="flex items-center gap-3 px-3 py-2 bg-orange-500/5 dark:bg-orange-500/10 rounded-xl border border-orange-500/10 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-muted leading-tight">Logged in as</span>
                      <span className="text-xs font-bold text-heading truncate">{user.name}</span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/profile?mode=login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-orange-500 font-bold hover:bg-orange-500/5 mb-2"
                  >
                    <User size={16} />
                    Sign In / Register
                  </Link>
                )}

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-bronze-500/10 my-3" />
                {isDashboard && user && (
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium"
                  >
                    <Store size={16} />
                    User website homepage
                  </Link>
                )}
                 {!user?.parentVendorId && (
                   <Link
                    href={user ? "/profile" : "/profile?mode=login&reason=profile&redirect=/profile"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    <User size={16} />
                    My Account / Profile
                  </Link>
                 )}

                 {user?.parentVendorId && (
                   <Link
                    href="/worker/studio"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    <LayoutDashboard size={16} />
                    Worker Studio
                  </Link>
                 )}

                {(!user || user.role !== "vendor") && (
                  <Link
                    href="/vendor/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-orange-500 font-bold hover:bg-orange-500/5"
                  >
                    <Store size={16} />
                    Sell With Us
                  </Link>
                )}

                 {!isDashboard && (
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    <Heart size={16} />
                    My Wishlist {wishlistCount > 0 ? `(${wishlistCount} items)` : ""}
                  </Link>
                )}

                {!isDashboard && (
                  <Link
                    href="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    <ShoppingCart size={16} />
                    My Cart {cartCount > 0 ? `(${cartCount} items)` : ""}
                  </Link>
                )}

                {/* Dashboard shortcuts if authenticated */}
                {user && user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    <LayoutDashboard size={16} />
                    Admin Panel
                  </Link>
                )}

                {user && user.role === "vendor" && !isDashboard && (
                  <Link
                    href="/vendor/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    <LayoutDashboard size={16} />
                    Vendor Dashboard
                  </Link>
                )}

                {user && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-500 font-bold hover:bg-red-500/5 text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                )}

                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold shadow-md shadow-orange-500/15"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
      </nav>

      {/* Mobile Menu Backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-[90] bg-black/60"
          />
        )}

      {/* Sticky Bottom Navigation Bar for Mobile (Blinkit Style - Pitch-Black Liquid Glass) */}
      {!isDashboard && (
        <div 
          className={`lg:hidden fixed bottom-3 left-3 right-3 z-[120] rounded-2xl bg-black/80 dark:bg-black/85 backdrop-blur-2xl border border-white/20 dark:border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out will-change-transform transform-gpu ${
            bottomVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex justify-around items-center px-1.5 py-1.5">
              {/* Home */}
              <Link 
                href="/" 
                prefetch={true}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 mx-0.5 rounded-xl relative active:scale-90 transition-transform duration-100 ease-out touch-manipulation cursor-pointer"
              >
                {pathname === "/" && (
                  <div 
                    className="absolute inset-0 rounded-xl bg-orange-500/15 dark:bg-orange-500/25 border border-orange-500/35 shadow-[0_2px_12px_rgba(249,115,22,0.25)]"
                  />
                )}
                <Home size={20} className={`relative z-10 ${pathname === "/" ? "text-orange-500" : "text-gray-400 dark:text-gray-400"}`} strokeWidth={pathname === "/" ? 2.4 : 1.8} />
                <span className={`relative z-10 text-[10px] font-bold ${pathname === "/" ? "text-orange-500 font-extrabold" : "text-gray-400 dark:text-gray-400"}`}>Home</span>
              </Link>

              {/* Categories */}
              <Link 
                href="/products" 
                prefetch={true}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 mx-0.5 rounded-xl relative active:scale-90 transition-transform duration-100 ease-out touch-manipulation cursor-pointer"
              >
                {pathname === "/products" && (
                  <div 
                    className="absolute inset-0 rounded-xl bg-orange-500/15 dark:bg-orange-500/25 border border-orange-500/35 shadow-[0_2px_12px_rgba(249,115,22,0.25)]"
                  />
                )}
                <Grid size={20} className={`relative z-10 ${pathname === "/products" ? "text-orange-500" : "text-gray-400 dark:text-gray-400"}`} strokeWidth={pathname === "/products" ? 2.4 : 1.8} />
                <span className={`relative z-10 text-[10px] font-bold ${pathname === "/products" ? "text-orange-500 font-extrabold" : "text-gray-400 dark:text-gray-400"}`}>Categories</span>
              </Link>

              {/* Cart */}
              <Link 
                href="/cart" 
                prefetch={true}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 mx-0.5 rounded-xl relative active:scale-90 transition-transform duration-100 ease-out touch-manipulation cursor-pointer"
              >
                {pathname === "/cart" && (
                  <div 
                    className="absolute inset-0 rounded-xl bg-orange-500/15 dark:bg-orange-500/25 border border-orange-500/35 shadow-[0_2px_12px_rgba(249,115,22,0.25)]"
                  />
                )}
                <div className="relative z-10">
                  <ShoppingCart size={20} className={pathname === "/cart" ? "text-orange-500" : "text-gray-400 dark:text-gray-400"} strokeWidth={pathname === "/cart" ? 2.4 : 1.8} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[8px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className={`relative z-10 text-[10px] font-bold ${pathname === "/cart" ? "text-orange-500 font-extrabold" : "text-gray-400 dark:text-gray-400"}`}>Cart</span>
              </Link>

              {/* Profile or Worker Studio */}
              {!user?.parentVendorId ? (
                <Link 
                  href={user ? "/profile" : "/profile?mode=login&reason=profile&redirect=/profile"} 
                  prefetch={true}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 mx-0.5 rounded-xl relative active:scale-90 transition-transform duration-100 ease-out touch-manipulation cursor-pointer"
                >
                  {pathname.startsWith("/profile") && (
                    <div 
                      className="absolute inset-0 rounded-xl bg-orange-500/15 dark:bg-orange-500/25 border border-orange-500/35 shadow-[0_2px_12px_rgba(249,115,22,0.25)]"
                    />
                  )}
                  <User size={20} className={`relative z-10 ${pathname.startsWith("/profile") ? "text-orange-500" : "text-gray-400 dark:text-gray-400"}`} strokeWidth={pathname.startsWith("/profile") ? 2.4 : 1.8} />
                  <span className={`relative z-10 text-[10px] font-bold ${pathname.startsWith("/profile") ? "text-orange-500 font-extrabold" : "text-gray-400 dark:text-gray-400"}`}>Profile</span>
                </Link>
              ) : (
                <Link 
                  href="/worker/studio" 
                  prefetch={true}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 mx-0.5 rounded-xl relative active:scale-90 transition-transform duration-100 ease-out touch-manipulation cursor-pointer"
                >
                  {pathname.startsWith("/worker") && (
                    <div 
                      className="absolute inset-0 rounded-xl bg-orange-500/15 dark:bg-orange-500/25 border border-orange-500/35 shadow-[0_2px_12px_rgba(249,115,22,0.25)]"
                    />
                  )}
                  <LayoutDashboard size={20} className={`relative z-10 ${pathname.startsWith("/worker") ? "text-orange-500" : "text-gray-400 dark:text-gray-400"}`} strokeWidth={pathname.startsWith("/worker") ? 2.4 : 1.8} />
                  <span className={`relative z-10 text-[10px] font-bold ${pathname.startsWith("/worker") ? "text-orange-500 font-extrabold" : "text-gray-400 dark:text-gray-400"}`}>Studio</span>
                </Link>
              )}
          </div>
        </div>
      )}
    </>
  );
};
