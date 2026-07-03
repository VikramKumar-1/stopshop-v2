"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Copy, CheckCircle2, Sparkles, Clock, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";

export const GlobalOfferPopup = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Prevent fetching on auth pages, checkout, vendor dashboard, admin panel, or cart
    if (
      pathname?.includes("/login") || 
      pathname?.includes("/checkout") ||
      pathname?.includes("/vendor") ||
      pathname?.includes("/admin") ||
      pathname?.includes("/cart")
    ) return;

    // Check if the user has already seen the popup in this session
    if (sessionStorage.getItem("hasSeenGlobalOffer")) return;

    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/targeted-offers");
        if (res.ok) {
          const data = await res.json();
          // Filter out inactive/expired offers
          const validOffers = Array.isArray(data) ? data.filter(o => o.isActive && new Date(o.expiresAt) > new Date()) : [];
          if (validOffers.length > 0) {
            setOffers(validOffers);
            // Delay the popup slightly so it feels more natural
            setTimeout(() => setIsVisible(true), 1500);
          }
        }
      } catch (err) {
        console.error("Failed to fetch targeted offers", err);
      }
    };

    fetchOffers();
  }, [pathname]);

  if (!isVisible || offers.length === 0) return null;

  // For the global popup, we just show the most recent/best offer
  const activeOffer = offers[0];
  const isStoreWide = activeOffer.productId === null;
  const hoursLeft = Math.max(1, Math.floor((new Date(activeOffer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)));

  const handleGoToCart = () => {
    sessionStorage.setItem("hasSeenGlobalOffer", "true");
    setIsVisible(false);
    window.location.href = "/cart";
  };

  const handleClose = () => {
    sessionStorage.setItem("hasSeenGlobalOffer", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-30 animate-pulse"></div>

            {/* Main Modal Card (Glassmorphism) */}
            <div className="relative bg-surface border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Premium Decorative Header */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-orange-500 to-amber-600"></div>
              
              {/* Abstract decorative shapes in header */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-10 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl transform -translate-x-1/2"></div>

              <button 
                onClick={handleClose}
                className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-md transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="relative pt-12 px-8 pb-8 text-center flex flex-col items-center">
                {/* 3D-like Icon Box */}
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center mb-6 transform rotate-3">
                  <Gift size={40} className="text-white drop-shadow-lg" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                  <Clock size={12} />
                  Expires in {hoursLeft} Hours
                </div>

                <h2 className="text-2xl font-black text-heading mb-2">
                  Exclusive VIP Offer
                </h2>
                
                <p className="text-sm text-muted mb-6 leading-relaxed">
                  {isStoreWide ? (
                    <>You left some items behind! Complete your purchase now and get an exclusive discount on your <strong>entire cart</strong>.</>
                  ) : (
                    <>Still thinking about <strong>{activeOffer.product?.name}</strong>? Here is a special discount just for you!</>
                  )}
                </p>

                {/* The Discount Value */}
                <div className="w-full bg-surface-card border border-border/50 rounded-2xl p-5 relative overflow-hidden mb-6 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-muted uppercase tracking-widest mb-1">Get</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                      {activeOffer.discountPct ? `${activeOffer.discountPct}% OFF` : `₹${activeOffer.discountAmt} OFF`}
                    </span>
                  </div>
                </div>

                {/* Call to Action */}
                <button
                  onClick={handleGoToCart}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 shadow-lg bg-gradient-to-r from-heading to-muted-foreground text-surface hover:scale-[1.02] active:scale-95 shadow-black/10 dark:shadow-white/10`}
                >
                  <ShoppingCart size={18} />
                  View Discounted Cart
                </button>
                
                <p className="text-[10px] text-muted font-medium mt-4 uppercase tracking-widest flex items-center gap-1 justify-center">
                  <Sparkles size={10} className="text-orange-500" />
                  Discount automatically applied
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
