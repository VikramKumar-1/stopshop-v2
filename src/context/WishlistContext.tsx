"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { intentQueue } from "@/lib/analytics/intentQueue";

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  specs: string;
  material: string;
  categoryName: string;
  rating: number;
  reviews: number;
  stock: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
  loaded: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("stopshops-wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to load wishlist");
      }
    }
    setLoaded(true);
  }, []);

  const saveWishlist = (newWishlist: WishlistItem[]) => {
    setWishlist(newWishlist);
    localStorage.setItem("stopshops-wishlist", JSON.stringify(newWishlist));
  };

  const addToWishlist = (product: any) => {
    const existingIndex = wishlist.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      // Toggle: remove if already exists
      removeFromWishlist(product.id);
      return;
    }

    const price = product.price || Math.round(product.id * 100 + 299);
    const mrp = product.mrp || Math.round(product.id * 150 + 499);
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newWishlist = [
      ...wishlist,
      {
        id: product.id,
        slug,
        name: product.name,
        price,
        mrp,
        image: product.image,
        specs: product.specs || "",
        material: product.material || "Bronze",
        categoryName: product.categoryName || "kitchen-utility",
        rating: product.rating || 5.0,
        reviews: product.reviews || 0,
        stock: product.stock !== undefined ? product.stock : 10,
      },
    ];

    saveWishlist(newWishlist);
    
    // Background sync wishlist intent for targeted vendor retargeting via queue
    const vendorId = product.vendorId || product.vendor?.id;
    if (vendorId) {
      intentQueue.track({ productId: product.id, vendorId, type: "WISHLIST" });
    }

    setToastMessage("Saved to wishlist");
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  };

  const removeFromWishlist = (productId: number) => {
    const item = wishlist.find((i) => i.id === productId);
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    saveWishlist(newWishlist);
    if (item) {
      setToastMessage("Removed from wishlist");
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        loaded,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed z-[9999] bottom-24 lg:bottom-6 left-1/2 lg:left-auto lg:right-6 -translate-x-1/2 lg:translate-x-0 bg-zinc-900/95 dark:bg-zinc-800/95 backdrop-blur-md text-white font-semibold text-[11px] px-4 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={11} strokeWidth={3} />
          </div>
          <span className="whitespace-nowrap">{toastMessage}</span>
        </div>
      )}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
