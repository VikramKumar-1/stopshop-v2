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

    setToastMessage(`"${product.name}" added to wishlist!`);
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  };

  const removeFromWishlist = (productId: number) => {
    const item = wishlist.find((i) => i.id === productId);
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    saveWishlist(newWishlist);
    if (item) {
      setToastMessage(`"${item.name}" removed from wishlist.`);
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
        <div className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-orange-500 to-orange-600 dark:from-bronze-600 dark:to-bronze-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 size={12} className="text-white" />
          </div>
          <span>{toastMessage}</span>
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
