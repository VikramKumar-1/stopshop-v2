"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Check, ShieldAlert, ChevronLeft, ChevronRight, MessageSquare, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

import { useWishlist } from "@/context/WishlistContext";

interface ProductClientActionsProps {
  product: any;
  allImages: string[];
}

export default function ProductClientActions({ product, allImages }: ProductClientActionsProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  
  const wishlisted = isInWishlist(product.id);

  React.useEffect(() => {
    setSelectedImage(allImages[0]);
  }, [allImages.join(",")]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${product.id}&qty=${quantity}`);
  };

  const handleQtyChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setQuantity((prev) => Math.min(prev + 1, product.stock));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  return (
    <>
      {/* Product Image Viewer */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-orange-50/50 dark:bg-white/5 border border-border group/viewer">
        <Image
          src={selectedImage || "/logo4.jpg"}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />

        {allImages.length > 1 && (
          <>
            {/* Image Counter Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs font-bold tracking-wider z-10 select-none">
              {(() => {
                const curIdx = allImages.indexOf(selectedImage);
                return curIdx !== -1 ? curIdx + 1 : 1;
              })()} / {allImages.length}
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={() => {
                const curIdx = allImages.indexOf(selectedImage);
                const prevIdx = (curIdx - 1 + allImages.length) % allImages.length;
                setSelectedImage(allImages[prevIdx]);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover/viewer:opacity-100 backdrop-blur-sm shadow-md hover:scale-105 active:scale-95 z-10 cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={() => {
                const curIdx = allImages.indexOf(selectedImage);
                const nextIdx = (curIdx + 1) % allImages.length;
                setSelectedImage(allImages[nextIdx]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover/viewer:opacity-100 backdrop-blur-sm shadow-md hover:scale-105 active:scale-95 z-10 cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail List */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-surface-card flex-shrink-0 transition-all ${
                selectedImage === img ? "border-bronze-500 scale-95" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`thumbnail-${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Quantity & Cart Submission Actions */}
      <div className="border-t border-border pt-6 mt-4 space-y-4">
        {/* Stock Status Indicator */}
        <div className="flex items-center gap-2">
          {product.stock <= 0 ? (
            <span className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
              <ShieldAlert size={14} />
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="flex items-center gap-1.5 text-xs text-orange-600 font-bold animate-pulse">
              <ShieldAlert size={14} />
              Only {product.stock} left in stock - Order Soon!
            </span>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              ✔ In Stock (Ready for Dispatch)
            </span>
          )}
        </div>

        {product.stock > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Quantity Selector */}
            <div className="flex items-center border border-border rounded-xl bg-surface p-1">
              <button
                type="button"
                onClick={() => handleQtyChange("dec")}
                className="w-10 h-10 flex items-center justify-center font-bold text-heading hover:bg-surface-hover rounded-lg transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-bold text-heading">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQtyChange("inc")}
                className="w-10 h-10 flex items-center justify-center font-bold text-heading hover:bg-surface-hover rounded-lg transition-colors"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            {/* Actions Buttons Container */}
            <div className="flex flex-col gap-3 w-full sm:flex-1">
              <div className="flex items-center gap-2.5 w-full">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 group/btn inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-bronze-500 hover:bg-bronze-500/10 text-bronze-600 dark:text-bronze-400 font-bold transition-all duration-300 text-xs sm:text-sm active:scale-[0.98] disabled:opacity-50"
                >
                  {added ? (
                    <>
                      <Check size={16} className="text-emerald-500" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-black shadow-md shadow-orange-500/20 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm active:scale-[0.98]"
                >
                  <Zap size={16} className="fill-white shrink-0" />
                  <span>Buy Now</span>
                </button>

                <button 
                  onClick={() => addToWishlist(product)}
                  className={`p-3.5 border rounded-xl bg-surface-card transition-all duration-300 shrink-0 ${
                    wishlisted 
                      ? "border-red-500 text-red-500 bg-red-500/5 shadow-inner" 
                      : "border-border hover:border-red-500 hover:text-red-500 text-muted hover:bg-red-500/5 shadow-sm"
                  }`}
                  title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Compact Sleek Quick Inquiry Bar */}
              <div className="flex items-center justify-between pt-1">
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}&productId=${product.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-card border border-border/80 hover:border-orange-500/40 text-muted hover:text-heading font-bold text-xs transition-colors shadow-2xs"
                >
                  <MessageSquare size={14} className="text-orange-500" />
                  <span>Have questions about craft or bulk order? <strong className="text-orange-500 underline ml-0.5">Quick Inquiry</strong></span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
