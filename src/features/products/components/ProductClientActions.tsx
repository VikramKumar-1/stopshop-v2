"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Check, ShieldAlert, ChevronLeft, ChevronRight, MessageSquare, Zap, Store, Plus, Gift, X, Maximize2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductClientActionsProps {
  product: any;
  allImages: string[];
  bundleProducts?: any[];
}

/**
 * Helper to ensure Cloudinary images deliver 100% crisp HD quality with automatic WebP conversion
 * directly from Cloudinary CDN, bypassing Next.js Vercel downscaling/compression blur.
 */
function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url || typeof url !== "string") return url || "/logo4.jpg";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const transform = width ? `f_auto,q_auto:best,w_${width}` : `f_auto,q_auto:best`;
    return url.replace("/upload/", `/upload/${transform}/`);
  }
  return url;
}

export default function ProductClientActions({ product, allImages, bundleProducts = [] }: ProductClientActionsProps) {
  const router = useRouter();
  const { convertPrice } = useRegion();
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showComboPopup, setShowComboPopup] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  
  const wishlisted = isInWishlist(product.id);

  useEffect(() => {
    if (allImages && allImages.length > 0) {
      setSelectedImage(allImages[0]);
    }
  }, [allImages]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setShowComboPopup(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
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
      router.push(product.slug ? `/checkout/${product.slug}-${product.id}?qty=${quantity}` : `/checkout?productId=${product.id}&qty=${quantity}`);
    }, 50);
  };

  const handleQtyChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setQuantity((prev) => Math.min(prev + 1, product.stock || 99));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const currentIdx = allImages.indexOf(selectedImage);
  const activeIndex = currentIdx !== -1 ? currentIdx : 0;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIdx = (activeIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIdx]);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIdx = (activeIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIdx]);
  };

  return (
    <>
      {/* Main Container - Compact Desktop Image Viewer */}
      <div className="flex flex-col gap-3 w-full">
        {/* Main Image Stage */}
        <div className="relative aspect-square w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[360px] xl:max-w-[380px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-orange-50/50 via-amber-50/30 to-surface dark:from-white/5 dark:to-white/[0.02] border border-border/80 shadow-sm group/viewer">
          
          <Image
            src={getOptimizedImageUrl(selectedImage, 1000) || "/logo4.jpg"}
            alt={product.name}
            fill
            priority
            unoptimized={selectedImage?.includes("cloudinary")}
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-500 group-hover/viewer:scale-105 cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />

          {/* Lightbox / Zoom Prompt Overlay */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-3 right-3 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl text-[10px] sm:text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 z-10 shadow-md opacity-90 hover:opacity-100 cursor-pointer"
            title="Click to view full size"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Click to Zoom</span>
          </button>

          {allImages.length > 1 && (
            <>
              {/* Image Counter Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs font-bold tracking-wider z-10 select-none">
                {activeIndex + 1} / {allImages.length}
              </div>

              {/* Left navigation arrow */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover/viewer:opacity-100 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 z-10 cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Right navigation arrow */}
              <button
                onClick={handleNextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover/viewer:opacity-100 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 z-10 cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Compact Thumbnail Carousel */}
        {allImages.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 max-w-[420px] sm:max-w-[460px] lg:max-w-[440px] xl:max-w-[460px] mx-auto w-full scrollbar-none">
            {allImages.map((img, idx) => {
              const isSelected = selectedImage === img;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 bg-surface-card shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "border-orange-500 ring-2 ring-orange-500/30 scale-95 shadow-sm"
                      : "border-border/60 opacity-60 hover:opacity-100 hover:border-orange-300"
                  }`}
                >
                  <Image src={getOptimizedImageUrl(img, 200)} alt={`thumbnail-${idx}`} fill unoptimized={img?.includes("cloudinary")} className="object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Stock Status & Purchase Actions Container */}
      <div className="border-t border-border/80 pt-5 mt-2 space-y-4">
        {/* Stock Status Indicator */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          {product.stock <= 0 ? (
            <span className="flex items-center gap-1.5 font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-800/40">
              <ShieldAlert size={14} />
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/40 animate-pulse">
              <ShieldAlert size={14} />
              Only {product.stock} left in stock — Order Soon!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              In Stock (Dispatching within 24 Hrs)
            </span>
          )}
        </div>

        {product.stock > 0 && (
          <div className="flex flex-col gap-4">
            {/* Quantity Selector & Main CTAs Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              
              {/* Quantity Counter */}
              <div className="flex items-center justify-between border border-border rounded-xl bg-surface p-1 self-start sm:self-auto shrink-0 min-w-[120px]">
                <button
                  type="button"
                  onClick={() => handleQtyChange("dec")}
                  className="w-9 h-9 flex items-center justify-center font-bold text-heading hover:bg-surface-hover rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-black text-heading">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQtyChange("inc")}
                  className="w-9 h-9 flex items-center justify-center font-bold text-heading hover:bg-surface-hover rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                  disabled={quantity >= (product.stock || 99)}
                >
                  +
                </button>
              </div>

              {/* Action Buttons: Add to Cart, Buy Now, Wishlist */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 sm:py-3.5 rounded-xl border-2 border-amber-600 dark:border-amber-500 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-extrabold transition-all duration-200 text-xs sm:text-sm active:scale-[0.98] disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  {added ? (
                    <>
                      <Check size={16} className="text-emerald-500 stroke-[3]" />
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
                  disabled={product.stock <= 0 || isRedirecting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-black shadow-md shadow-orange-500/20 hover:shadow-lg transition-all duration-200 text-xs sm:text-sm active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <Zap size={16} className="fill-white shrink-0" />
                  <span>{isRedirecting ? "Redirecting..." : "Buy Now"}</span>
                </button>

                <button 
                  onClick={() => addToWishlist(product)}
                  className={`p-3 sm:p-3.5 border rounded-xl transition-all duration-200 shrink-0 flex items-center justify-center cursor-pointer ${
                    wishlisted 
                      ? "border-red-500 text-red-500 bg-red-500/10 shadow-inner" 
                      : "border-border hover:border-red-500 hover:text-red-500 text-muted hover:bg-red-500/5 bg-surface-card shadow-sm"
                  }`}
                  title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Quick Inquiry Bar */}
            <div className="pt-0.5">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}&productId=${product.id}`}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface border border-border/80 hover:border-orange-500/40 text-muted hover:text-heading font-bold text-xs transition-colors shadow-2xs group"
              >
                <MessageSquare size={14} className="text-orange-500 group-hover:scale-110 transition-transform" />
                <span>Need custom sizing or bulk order assistance? <strong className="text-orange-600 dark:text-orange-400 underline ml-0.5">Quick Inquiry</strong></span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Fullscreen Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-4 sm:p-6 bg-black/95 backdrop-blur-xl select-none animate-fadeIn overflow-hidden"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all z-[10000] cursor-pointer shadow-lg hover:scale-105"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          {/* Lightbox Main Image Stage */}
          <div 
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto p-2 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] sm:h-[80vh] flex items-center justify-center">
              <Image
                src={getOptimizedImageUrl(selectedImage, 1800) || "/logo4.jpg"}
                alt={product.name}
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Lightbox Navigation Controls */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all backdrop-blur-md z-[10000] cursor-pointer hover:scale-110 shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft size={26} />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all backdrop-blur-md z-[10000] cursor-pointer hover:scale-110 shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight size={26} />
              </button>

              {/* Lightbox Thumbnails Bottom Bar */}
              <div 
                className="relative bottom-2 flex items-center gap-2.5 max-w-[90vw] overflow-x-auto px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-2xl z-[10000] border border-white/10 scrollbar-none shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? "border-orange-500 scale-105 ring-2 ring-orange-500/50" : "border-white/20 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`thumb-${idx}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* BUNDLE COMBO WIDGET */}
      {bundleProducts.length > 0 && (
        <div className="mt-5 bg-emerald-50/60 dark:bg-stone-900/60 border border-emerald-300/40 dark:border-emerald-500/20 rounded-3xl p-3.5 sm:p-5 space-y-3.5">
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
                  Instant {product.bundleDiscountType === "PERCENTAGE" ? `${product.bundleDiscountValue}%` : convertPrice((product.bundleDiscountValue || 0) * quantity, product, false)} Combo Savings!
                </span>
              </div>
            </div>
            <button
              onClick={handleAddBundleToCart}
              disabled={isRedirecting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all duration-200 shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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
                  className="flex items-center gap-3 p-2.5 sm:p-3 bg-white dark:bg-surface-card rounded-2xl border border-amber-200/40 dark:border-amber-500/15 hover:border-orange-400/50 transition-colors duration-200 block"
                >
                  <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 border-amber-400/30 shrink-0 bg-white group-hover:scale-105 transition-transform duration-200">
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
                <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-orange-50/50 dark:bg-surface-card rounded-2xl border border-orange-200/40 dark:border-orange-500/15 hover:border-orange-400/50 transition-colors duration-200 h-full">
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
               <button onClick={() => setShowComboPopup(false)} className="w-8 h-8 rounded-full bg-surface-card border border-border flex items-center justify-center hover:bg-orange-50 transition-colors cursor-pointer">
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
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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

