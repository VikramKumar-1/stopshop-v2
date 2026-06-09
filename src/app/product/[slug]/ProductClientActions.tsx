"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Check, ShieldAlert } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductClientActionsProps {
  product: any;
  allImages: string[];
}

export default function ProductClientActions({ product, allImages }: ProductClientActionsProps) {
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          addToCart(product, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        } else {
          window.location.href = `/profile?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      } else {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (e) {
      console.error("Auth check failed during add to cart:", e);
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
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
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-orange-50/50 dark:bg-white/5 border border-border">
        <Image
          src={selectedImage}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
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

            {/* Actions Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:flex-1">
              <button
                onClick={() => {
                  window.location.href = `/checkout?productId=${product.id}&qty=${quantity}`;
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black shadow-md hover:shadow-lg transition-all duration-300 text-sm active:scale-[0.98]"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 group/btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-md shadow-bronze-500/10 hover:shadow-lg hover:shadow-bronze-500/25 transition-all duration-300 text-sm active:scale-[0.98]"
              >
                {added ? (
                  <>
                    <Check size={16} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </>
                )}
              </button>

              <button className="p-3.5 border border-border hover:border-red-500 hover:text-red-500 text-muted rounded-xl bg-surface-card hover:bg-red-500/5 transition-all duration-300 flex items-center justify-center shrink-0">
                <Heart size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
