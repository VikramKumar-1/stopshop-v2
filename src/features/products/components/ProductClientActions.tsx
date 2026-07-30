"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Check, ShieldAlert, ChevronLeft, ChevronRight, MessageSquare, Zap, Store, Plus, Gift, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";

import { useWishlist } from "@/context/WishlistContext";

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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showComboPopup, setShowComboPopup] = useState(false);
  
  const { addToCart, addBundleToCart } = useCart();
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

  const handleAddBundleToCart = () => {
    setIsRedirecting(true);
    const ids = [product.id, ...bundleProducts.map((p: any) => p.id)].join(",");
    setTimeout(() => {
      router.push(`/checkout?bundleIds=${ids}&qty=${quantity}`);
    }, 50);
  };

  const handleBuyNow = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      router.push(`/checkout?productId=${product.id}&qty=${quantity}`);
    }, 50);
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
              <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2.5 w-full">
                
                {/* Left side: Add to Cart & Buy Now */}
                <div className="flex items-center gap-2.5 flex-1">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 group/btn inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-3.5 rounded-xl border-2 border-bronze-500 hover:bg-bronze-500/10 text-bronze-600 dark:text-bronze-400 font-bold transition-all duration-300 text-[11px] sm:text-xs active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
                  >
                    {added ? (
                      <>
                        <Check size={14} className="text-emerald-500" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0 || isRedirecting}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-black shadow-md shadow-orange-500/20 hover:shadow-lg transition-all duration-300 text-[11px] sm:text-xs active:scale-[0.98] whitespace-nowrap"
                  >
                    <Zap size={14} className="fill-white shrink-0" />
                    <span>{isRedirecting ? "Redirecting..." : "Buy Now"}</span>
                  </button>
                </div>

                {/* Right side: Heart */}
                <div className="flex items-center gap-2.5 w-full xl:w-auto">
                  <button 
                    onClick={() => addToWishlist(product)}
                    className={`p-3.5 border rounded-xl transition-all duration-300 shrink-0 flex-1 xl:flex-none flex justify-center items-center ${
                      wishlisted 
                        ? "border-red-500 text-red-500 bg-red-500/5 shadow-inner" 
                        : "border-border hover:border-red-500 hover:text-red-500 text-muted hover:bg-red-500/5 bg-surface-card shadow-sm"
                    }`}
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

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

      {/* BUNDLE COMBO WIDGET — Lightweight Premium */}
      {bundleProducts.length > 0 && (
        <div className="mt-5 bg-emerald-50 dark:bg-stone-900 border-2 border-emerald-300/40 dark:border-emerald-500/20 rounded-3xl p-3.5 sm:p-5 space-y-3.5">

            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-emerald-300/25 dark:border-emerald-500/15 pb-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
                    <Gift size={15} className="text-white sm:w-[17px] sm:h-[17px]" />
                  </div>
                <h3 className="font-display font-black text-xs sm:text-sm text-heading tracking-tight">
                  Complete Your Set & Save
                </h3>
              </div>
            </div>

            {/* Top Price Summary & CTA UI */}
            <div className="bg-white dark:bg-surface-card border border-orange-300/30 dark:border-orange-500/15 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="space-y-0.5 text-center sm:text-left w-full sm:w-auto">
                <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">Total Combo Price ({quantity} Set{quantity > 1 ? 's' : ''})</span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {(() => {
                      const mainPrice = product.price * quantity;
                      const bundleItemsPrice = bundleProducts.reduce((sum: number, p: any) => sum + p.price * quantity, 0);
                      const total = mainPrice + bundleItemsPrice;
                      let discounted = total;
                      if (product.bundleDiscountType === "PERCENTAGE") {
                        discounted = total - (total * (product.bundleDiscountValue || 0) / 100);
                      } else if (product.bundleDiscountType === "FLAT") {
                        discounted = Math.max(0, total - ((product.bundleDiscountValue || 0) * quantity));
                      }
                      return convertPrice(discounted, product, false);
                    })()}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-muted line-through">
                    {convertPrice((product.price + bundleProducts.reduce((sum: number, p: any) => sum + p.price, 0)) * quantity, product, false)}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md mt-1">
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                    🎉 Instant {product.bundleDiscountType === "PERCENTAGE" ? `${product.bundleDiscountValue}%` : convertPrice((product.bundleDiscountValue || 0) * quantity, product, false)} Combo Savings!
                  </span>
                </div>
              </div>
              <button
                onClick={handleAddBundleToCart}
                disabled={isRedirecting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all duration-300 shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isRedirecting ? (
                  <>
                    <Check size={15} className="text-white" />
                    <span>Redirecting...</span>
                  </>
                ) : (
                  <>
                    <Zap size={15} className="fill-white" />
                    <span>Buy Combo Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Main Product Card */}
              <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white dark:bg-surface-card rounded-2xl border border-orange-200/40 dark:border-orange-500/15">
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 border-orange-400/30 shrink-0 bg-white">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <span className="text-[8px] sm:text-[9px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-[0.08em] block">This Item ({quantity}x)</span>
                  <h4 className="text-[11px] sm:text-xs font-bold text-heading truncate mt-0.5">{product.name}</h4>
                  <span className="text-[11px] sm:text-xs font-black text-heading block mt-0.5">{convertPrice(product.price * quantity, product, false)}</span>
                </div>
              </div>

              {/* Bundle Items */}
              {bundleProducts.slice(0, bundleProducts.length > 3 ? 2 : 3).map((bp) => (
                <div key={bp.id} className="relative group">
                  <PlusConnector />
                  <Link
                    href={`/product/${bp.slug || bp.id}?prev=${product.slug || product.id}&prevName=${encodeURIComponent(product.name)}`}
                    className="flex items-center gap-3 p-2.5 sm:p-3 bg-white dark:bg-surface-card rounded-2xl border border-amber-200/40 dark:border-amber-500/15 hover:border-orange-400/50 transition-colors duration-300 block"
                  >
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 border-amber-400/30 shrink-0 bg-white group-hover:scale-105 transition-transform duration-300">
                      <Image src={bp.image} alt={bp.name} fill className="object-cover" />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                      <span className="text-[8px] sm:text-[9px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-[0.08em] block flex items-center gap-1">
                        <span>Add-on ({quantity}x)</span>
                        <span className="text-[7px] bg-amber-500/15 px-1.5 py-0.5 rounded-md text-amber-600 dark:text-amber-400 font-black">VIEW ↗</span>
                      </span>
                      <h4 className="text-[11px] sm:text-xs font-bold text-heading truncate group-hover:text-orange-600 transition-colors mt-0.5">{bp.name}</h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-[11px] sm:text-xs font-black text-heading">{convertPrice(bp.price * quantity, bp, false)}</span>
                        {bp.mrp && bp.mrp > bp.price && (
                          <span className="text-[9px] text-muted line-through">{convertPrice(bp.mrp * quantity, bp, true)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* View More Button if > 3 Bundle Products */}
              {bundleProducts.length > 3 && (
                <div className="relative group cursor-pointer" onClick={() => setShowComboPopup(true)}>
                  <PlusConnector />
                  <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-orange-50/50 dark:bg-surface-card rounded-2xl border border-orange-200/40 dark:border-orange-500/15 hover:border-orange-400/50 transition-colors duration-300 h-full">
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shrink-0 shadow-sm">
                       <span className="text-white font-black text-sm">+{bundleProducts.length - 2}</span>
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400 mt-0.5 group-hover:underline">View Full Combo</h4>
                      <span className="text-[10px] text-muted block mt-0.5">Click to see all items</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}

      {/* Combo Full Popup Modal */}
      {showComboPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowComboPopup(false)}>
          <div className="bg-white dark:bg-surface w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 sticky top-0 bg-white dark:bg-surface pb-2 z-10 border-b border-border/50">
               <div>
                 <h3 className="font-black text-lg text-heading flex items-center gap-2">
                   <Gift className="text-orange-500" size={20} />
                   Full Combo Details
                 </h3>
                 <p className="text-[11px] text-muted font-medium mt-1">Complete set of {bundleProducts.length + 1} items</p>
               </div>
               <button onClick={() => setShowComboPopup(false)} className="w-8 h-8 rounded-full bg-surface-card border border-border flex items-center justify-center hover:bg-orange-50 transition-colors">
                 <X size={16} className="text-heading" />
               </button>
            </div>
            
            <div className="space-y-3">
              {/* Main Product */}
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-surface-card rounded-2xl border border-orange-200/60 dark:border-orange-500/20">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-orange-400/30 shrink-0 bg-white">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-[0.08em] block">Main Item ({quantity}x)</span>
                  <h4 className="text-sm font-bold text-heading truncate mt-0.5">{product.name}</h4>
                  <span className="text-sm font-black text-heading block mt-0.5">{convertPrice(product.price * quantity, product, false)}</span>
                </div>
              </div>

              {/* Bundle Products */}
              {bundleProducts.map((bp) => (
                <div key={bp.id} className="relative flex items-center gap-3 p-3 bg-white dark:bg-surface-card rounded-2xl border border-amber-200/40 dark:border-amber-500/15">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400/30 shrink-0 bg-white">
                    <Image src={bp.image} alt={bp.name} fill className="object-cover" />
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-[0.08em] block">Add-on ({quantity}x)</span>
                    <h4 className="text-sm font-bold text-heading truncate mt-0.5">{bp.name}</h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-sm font-black text-heading">{convertPrice(bp.price * quantity, bp, false)}</span>
                      {bp.mrp && bp.mrp > bp.price && (
                        <span className="text-xs text-muted line-through">{convertPrice(bp.mrp * quantity, bp, true)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowComboPopup(false);
                  handleAddBundleToCart();
                }}
                disabled={isRedirecting}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isRedirecting ? (
                  <>
                    <Check size={18} className="text-white" />
                    <span>Redirecting to Checkout...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} className="fill-white" />
                    <span>Add All to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reusable Plus Connector Component
const PlusConnector = () => (
  <div className="absolute -top-1.5 -left-1.5 z-10 w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black flex items-center justify-center text-[10px] shadow-sm border-2 border-white dark:border-stone-900">
    <Plus size={11} />
  </div>
);
