"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Search, User, Heart, ShoppingCart, ChevronDown, LogOut, Store, PhoneCall, LayoutDashboard, Package } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/context/CartContext";

import { usePathname } from "next/navigation";
import { useRegion } from "@/context/RegionContext";
import { useWishlist } from "@/context/WishlistContext";

const navLinks = [
  { href: "/contact", label: "Get a Quote" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/vendor") || pathname.startsWith("/admin");
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { region, setRegion } = useRegion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState<any>(null);
  const isProfilePage = pathname.startsWith("/profile") && !user;

  const checkUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
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
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isDashboard) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isHomepage = window.location.pathname === "/";
      
      if (isHomepage) {
        const hero = document.getElementById("hero-section");
        const heroHeight = hero ? hero.offsetHeight : 600;
        
        if (currentScrollY > lastScrollY) {
          // Scrolling down: hide navbar immediately past 120px
          if (currentScrollY > 120) {
            setVisible(false);
          }
        } else {
          // Scrolling up: only show navbar when back inside/above the hero section
          if (currentScrollY <= heroHeight) {
            setVisible(true);
          }
        }
      } else {
        // Standard page behavior: hide when scrolling down, show when scrolling up (except on product pages)
        const isStickyPage = window.location.pathname.startsWith("/product") || (window.location.pathname.startsWith("/profile") && !user) || window.location.pathname === "/cart";
        if (isStickyPage) {
          setVisible(true);
        } else if (currentScrollY > 120 && currentScrollY > lastScrollY) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDashboard, user, pathname]);

  const marqueeItems = [
    "CASH ON DELIVERY AVAILABLE",
    "FREE SHIPPING ON BULK ORDERS",
    "SHIPPING WORLDWIDE"
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {!isDashboard && (
        <div 
          className="relative lg:fixed lg:top-0 lg:left-0 lg:right-0 h-8 z-[120] bg-gradient-to-r from-bronze-950 via-bronze-900 to-bronze-950 border-b border-bronze-800/40 flex items-center overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26, 15, 8, 0.96), rgba(26, 15, 8, 0.96)), 
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='20' viewBox='0 0 60 20'%3E%3Cpath d='M0 10 C 15 0, 15 20, 30 10 C 45 0, 45 20, 60 10 L 60 20 L 0 20 Z' fill='%23fb923c' fill-opacity='0.1'/%3E%3C/svg%3E")
            `,
            backgroundSize: "auto, 60px 20px"
          }}
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
        className={`fixed ${isDashboard ? "top-0" : "top-8"} left-0 right-0 z-[100] w-full border-b border-orange-500/30 dark:border-orange-500/40 bg-[var(--surface)] supports-[backdrop-filter]:bg-[var(--glass-bg)] supports-[backdrop-filter]:backdrop-blur-xl ${isDashboard ? "" : "lg:transition-transform lg:duration-300"} ${visible || isDashboard ? "translate-y-0" : "lg:-translate-y-full"}`}
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
                    className={`lg:hidden p-1.5 text-muted hover:text-heading -ml-2 ${searchOpen ? "hidden" : "block"}`}
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                )}

                <Link href="/" className="flex items-center gap-2 group">
                  <img 
                    src="/logo4.jpg" 
                    alt="StopShop Logo" 
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-xl sm:rounded-2xl p-1 object-contain shadow-sm border border-border group-hover:border-bronze-500/30 transition-all duration-200"
                  />
                  <span className="text-sm sm:text-base lg:text-2xl xl:text-2xl font-display font-bold tracking-tight text-heading">
                    Stop<span className="gradient-text">Shop</span>
                  </span>
                </Link>
              </div>

              {/* Centered Wide Search Bar (Desktop only, permanently visible) */}
              {!isDashboard && !isProfilePage && (
                <div className="hidden lg:flex flex-1 max-w-[340px] xl:max-w-[400px] mx-6">
                  <form onSubmit={handleSearchSubmit} className="relative overflow-hidden w-full h-10 flex items-center bg-bronze-500/[0.04] dark:bg-white/[0.02] border border-bronze-500/20 hover:border-bronze-500/40 focus-within:border-bronze-500/80 focus-within:bg-surface-card focus-within:shadow-[0_4px_20px_rgba(217,119,6,0.08)] rounded-full transition-all duration-300">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search premium bronze, copper & brass..."
                      className="w-full h-full pl-5 pr-12 bg-transparent text-heading placeholder-muted text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-full px-4 xl:px-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white flex items-center justify-center transition-all border-l border-bronze-500/20 rounded-r-full"
                      aria-label="Search"
                    >
                      <Search size={14} />
                    </button>
                  </form>
                </div>
              )}

              {/* Expandable Search Input (Mobile only, shown when searchOpen is true) */}
              {!isDashboard && !isProfilePage && searchOpen && (
                <div className="lg:hidden flex-grow max-w-[270px] mx-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <form onSubmit={handleSearchSubmit} className="relative overflow-hidden w-full h-10 flex items-center bg-bronze-500/[0.04] dark:bg-white/[0.02] border border-bronze-500/20 hover:border-bronze-500/40 focus-within:border-bronze-500/80 focus-within:bg-surface-card focus-within:shadow-[0_4px_20px_rgba(217,119,6,0.08)] rounded-full transition-all duration-300">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      autoFocus
                      className="w-full h-full pl-4 pr-10 bg-transparent text-heading placeholder-muted text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-full px-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white flex items-center justify-center transition-all border-l border-bronze-500/20 rounded-r-full"
                      aria-label="Search"
                    >
                      <Search size={13} />
                    </button>
                  </form>
                </div>
              )}

              {/* Close Search Button (Mobile only, shown when searchOpen is true) */}
              {!isDashboard && !isProfilePage && searchOpen && (
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="lg:hidden p-1.5 hover:bg-orange-500/10 text-muted hover:text-heading rounded-full transition-colors flex-shrink-0"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              )}

              {/* Desktop Nav Links & Navigation Controls (Always visible on desktop) */}
              {!isProfilePage && (
                <div className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
                  {/* Region / Currency Switcher */}
                  <div className="flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1.5 rounded-xl text-xs font-semibold text-heading focus-within:border-orange-500 transition-colors shadow-sm">
                    <span className="text-sm">
                      {region === "US" ? "🇺🇸" : region === "IN" ? "🇮🇳" : region === "AE" ? "🇦🇪" : region === "EU" ? "🇪🇺" : "🇯🇵"}
                    </span>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value as any)}
                      className="bg-transparent border-none text-heading text-xs font-bold focus:outline-none cursor-pointer p-0 pr-1"
                    >
                      <option value="IN">IN (₹)</option>
                      <option value="US">US ($)</option>
                      <option value="AE">AE (د.إ)</option>
                      <option value="EU">EU (€)</option>
                      <option value="JP">JP (¥)</option>
                    </select>
                  </div>

                  <ThemeToggle />
                  
                  {/* Amazon-style User profile link & Dropdown */}
                  <div className="relative group/profile text-left py-2">
                    <button className="flex items-center gap-1.5 text-muted hover:text-heading transition-colors cursor-pointer focus:outline-none">
                      <div className="w-8 h-8 rounded-full bg-bronze-500/10 dark:bg-bronze-500/25 flex items-center justify-center text-bronze-600 dark:text-bronze-400">
                        <User size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted leading-tight">
                          {user ? `Hello, ${user.name.split(" ")[0]}` : "Hello, Sign in"}
                        </span>
                        <span className="text-xs font-bold text-heading leading-tight flex items-center gap-0.5">
                          Account & Lists
                          <ChevronDown size={10} className="text-muted" />
                        </span>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full right-0 mt-0 w-60 bg-[var(--surface)] border border-border dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_45px_rgba(0,0,0,0.4)] rounded-2xl py-2 hidden group-hover/profile:block z-[9999] text-xs">
                      {/* Header: Sign In / Welcome */}
                      {!user ? (
                        <div className="px-4 py-3 border-b border-border dark:border-white/10 flex items-center justify-between gap-3">
                          <span className="text-muted text-xs font-semibold">New customer?</span>
                          <Link
                            href="/profile?mode=login"
                            className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-lg text-[11px] shadow-sm transition-all duration-200"
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
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                        >
                          <User size={15} className="text-muted" />
                          <span>My Profile</span>
                        </Link>



                        {!isDashboard && (
                          <>
                            <Link
                              href="/orders"
                              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                            >
                              <Package size={15} className="text-muted" />
                              <span>Orders & Quotes</span>
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
                        {user && user.role === "user" && (
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-body hover:bg-surface-hover hover:text-orange-600 dark:hover:text-bronze-300 rounded-xl transition-all"
                          >
                            <LayoutDashboard size={15} className="text-muted" />
                            <span>User Dashboard</span>
                          </Link>
                        )}
                        {(!user || user.role === "user") && (
                          <Link
                            href="/vendor/login"
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
                            <Store size={15} className="text-muted" />
                            <span>User website homepage</span>
                          </Link>
                        )}

                        {/* Log Out */}
                        {user && (
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/5 rounded-xl transition-all text-left"
                          >
                            <LogOut size={15} />
                            <span>Sign Out</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Wishlist, Cart & Contact Us (Hidden on dashboards) */}
                  {!isDashboard && (
                    <>
                      {/* Wishlist Icon */}
                      <Link 
                        href="/wishlist" 
                        className="relative flex items-center gap-1.5 text-muted hover:text-heading transition-colors group/wishlist"
                      >
                        <div className="relative">
                          <Heart size={20} className="group-hover/wishlist:scale-105 transition-transform" />
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
                        className="flex items-end gap-1.5 text-muted hover:text-heading transition-colors group/cart"
                      >
                        <div className="relative pb-0.5">
                          <span className="absolute -top-2 left-2 text-[10px] font-extrabold text-orange-500 dark:text-orange-400 bg-[var(--surface)] px-0.5 rounded-full">
                            {cartCount}
                          </span>
                          <ShoppingCart size={22} className="group-hover/cart:scale-105 transition-transform" />
                        </div>
                        <span className="text-xs font-bold text-heading">Cart</span>
                      </Link>

                      {/* Contact Us button */}
                      <Link
                        href="/contact"
                        className="px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-[11px] sm:text-xs font-bold transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/25 whitespace-nowrap ml-2"
                      >
                        Contact Us
                      </Link>
                    </>
                  )}
                  {pathname.startsWith("/vendor") && (
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-500 text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ml-2 cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  )}
                </div>
              )}
              {isProfilePage && (
                <div className="flex items-center gap-5 flex-shrink-0">
                  <Link
                    href="/contact"
                    className="px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-[11px] sm:text-xs font-bold transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/25 whitespace-nowrap ml-2"
                  >
                    Contact Us
                  </Link>
                </div>
              )}

              {/* Mobile Actions (Icons visible on mobile only, hidden when search is active) */}
              {!isProfilePage && (
                <div className={`flex items-center gap-1.5 lg:hidden flex-shrink-0 ${searchOpen ? "hidden" : "flex"}`}>
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
                  <div className="flex items-center gap-1 bg-surface border border-border px-2 py-1 rounded-xl text-xs font-semibold text-heading focus-within:border-orange-500 shadow-sm">
                    <span className="text-xs">
                      {region === "US" ? "🇺🇸" : region === "IN" ? "🇮🇳" : region === "AE" ? "🇦🇪" : region === "EU" ? "🇪🇺" : "🇯🇵"}
                    </span>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value as any)}
                      className="bg-transparent border-none text-heading text-[10px] font-bold focus:outline-none cursor-pointer p-0"
                    >
                      <option value="IN">IN</option>
                      <option value="US">US</option>
                      <option value="AE">AE</option>
                      <option value="EU">EU</option>
                      <option value="JP">JP</option>
                    </select>
                  </div>

                  <ThemeToggle />

                  {/* Mobile Account Profile */}
                  {isDashboard ? (
                    user && user.role === "user" ? (
                      <Link 
                        href="/" 
                        className="p-1.5 text-muted hover:text-heading"
                        aria-label="Homepage"
                      >
                        <User size={18} />
                      </Link>
                    ) : null
                  ) : (
                    <Link 
                      href="/profile" 
                      className="p-1.5 text-muted hover:text-heading"
                      aria-label="Profile"
                    >
                      <User size={18} />
                    </Link>
                  )}

                  {!isDashboard && (
                    <>
                      {/* Mobile Wishlist */}
                      <Link 
                        href="/wishlist" 
                        className="p-1.5 relative text-muted hover:text-heading"
                        aria-label="Wishlist"
                      >
                        <Heart size={18} />
                        {wishlistCount > 0 && (
                          <span className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[var(--surface)] shadow-sm">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>

                      {/* Mobile Shopping Cart */}
                      <Link 
                        href="/cart" 
                        className="p-1.5 relative text-muted hover:text-heading"
                        aria-label="Cart"
                      >
                        <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[var(--surface)] shadow-sm">
                          {cartCount}
                        </span>
                        <ShoppingCart size={18} />
                      </Link>
                    </>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Mobile Expandable Nav Links */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-[var(--surface)]"
            >
              <div className="px-4 py-5 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-bronze-500/10 my-3" />
                {isDashboard && user && (
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                  >
                    <Store size={16} />
                    User website homepage
                  </Link>
                )}
                 <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-body hover:text-heading hover:bg-surface-hover font-medium transition-all"
                >
                  <User size={16} />
                  My Account / Profile
                </Link>

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

                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 text-white font-semibold shadow-md shadow-bronze-500/15"
                >
                  Request Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
