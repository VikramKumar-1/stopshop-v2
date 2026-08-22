"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Heart, Check, ShieldAlert, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";

interface ProductClientActionsProps {
  product: any;
  allImages: string[];
  bundleProducts?: any[];
}

export default function ProductClientActions({ product, allImages, bundleProducts = [] }: ProductClientActionsProps) {
  const router = useRouter();
  const { convertPrice } = useRegion();
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart, addBundleToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddBundleToCart = () => {
    addBundleToCart([product, ...bundleProducts], quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
            <div className="flex flex-col xl:flex-row items-stretch gap-2 w-full sm:flex-1">
              <div className="flex flex-row gap-2 w-full xl:w-auto xl:flex-1">
                <button
                  onClick={() => {
                    router.push(product.slug ? `/checkout/${product.slug}-${product.id}?qty=${quantity}` : `/checkout?productId=${product.id}&qty=${quantity}`);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black shadow-md hover:shadow-lg transition-all duration-300 text-[11px] sm:text-xs active:scale-[0.98] whitespace-nowrap"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 group/btn inline-flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 text-[11px] sm:text-xs active:scale-[0.98] whitespace-nowrap"
                >
                  {added ? (
                    <>
                      <Check size={14} />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={14} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-row gap-2 w-full xl:w-auto">
                {product.vendor && (
                  <button
                    onClick={() => {
                      window.location.href = `/store/${product.vendor.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || product.vendor.id}`;
                    }}
                    className="flex-1 xl:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-black font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] whitespace-nowrap"
                  >
                    Shop by Vendor
                  </button>
                )}

                <button className="p-3.5 border border-border hover:border-red-500 hover:text-red-500 text-muted rounded-xl bg-surface-card hover:bg-red-500/5 transition-all duration-300 flex items-center justify-center shrink-0">
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
