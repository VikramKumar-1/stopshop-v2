"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, ArrowLeft, Truck, PackageCheck, Award, Store, Copy, Check, Tag, Zap, CreditCard, Gift } from "lucide-react";
import ProductClientActions from "./ProductClientActions";
import { useRegion } from "@/context/RegionContext";
import { useCart } from "@/context/CartContext";
import { trackProductView } from "@/lib/analytics";
import ReviewSection from "./ReviewSection";
import { RecommendedSection } from "./RecommendedSection";

interface ProductDetailsProps {
  product: any;
  allImages: string[];
  bundleProducts?: any[];
}

export default function ProductDetails({ product, allImages, bundleProducts = [] }: ProductDetailsProps) {
  const { convertPrice, convertWeight, getRawPrice } = useRegion();
  const { addBundleToCart } = useCart();
  const [bundleAdded, setBundleAdded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [shippingSettings, setShippingSettings] = useState({ shippingFreeAbove: 99900, shippingChargePaise: 4900 });
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  // 100% Dynamic Vendor & Category details for ANY store
  const currentVendorName = product?.vendor?.name || product?.vendorName || (product?.vendorId ? `Artisan Store #${product.vendorId}` : null);
  const currentVendorSlug = currentVendorName
    ? currentVendorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : (product?.vendorId ? `${product.vendorId}` : "");
  const currentCategoryName = product?.category?.name || (product?.categoryName ? product.categoryName.replace(/-/g, " ") : "");
  const currentCategorySlug = product?.category?.slug || product?.categoryName || "";

  const [referrerType, setReferrerType] = useState<"cart" | "admin" | "vendor" | "store" | "default">("default");
  const [storePath, setStorePath] = useState<string>("");

  const dynamicStoreHref = storePath || (currentVendorSlug ? `/store/${currentVendorSlug}` : "");

  const defaultBackHref = dynamicStoreHref || (currentCategorySlug ? `/products?category=${currentCategorySlug}` : "/products");
  const defaultBackLabel = currentVendorName
    ? `Back to ${currentVendorName}`
    : (currentCategoryName ? `Back to ${currentCategoryName}` : "Back to Marketplace");

  const [backPath, setBackPath] = useState({
    href: defaultBackHref,
    label: defaultBackLabel
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const prevSlug = params.get("prev");
      const prevName = params.get("prevName");
      
      if (prevSlug) {
        setBackPath({
          href: `/product/${prevSlug}`,
          label: prevName ? `Back to ${prevName}` : "Back to Previous Product"
        });
        setReferrerType("default");
        return;
      }

      if (document.referrer) {
        const referrer = document.referrer;
        if (referrer.includes("/admin")) {
          setBackPath({
            href: "/admin",
            label: "Back to Admin Panel"
          });
          setReferrerType("admin");
        } else if (referrer.includes("/store") || referrer.includes("/vendor-shop")) {
          const path = referrer.substring(referrer.indexOf(window.location.host) + window.location.host.length);
          const storeName = currentVendorName || "Store";
          setBackPath({
            href: path,
            label: `Back to ${storeName}`
          });
          setStorePath(path);
          setReferrerType("store");
        } else if (referrer.includes("/vendor") && !referrer.includes("/vendor-shop")) {
          setBackPath({
            href: "/vendor/dashboard",
            label: "Back to Vendor Dashboard"
          });
          setReferrerType("vendor");
        } else if (referrer.includes("/product/") && !referrer.endsWith(`/product/${product.slug}`) && !referrer.endsWith(`/product/${product.id}`)) {
          const prevPath = referrer.substring(referrer.indexOf(window.location.host) + window.location.host.length);
          setBackPath({
            href: prevPath,
            label: "Back to Previous Product"
          });
          setReferrerType("default");
        } else if (currentVendorName) {
          setBackPath({
            href: dynamicStoreHref,
            label: `Back to ${currentVendorName}`
          });
        }
      } else if (currentVendorName) {
        setBackPath({
          href: dynamicStoreHref,
          label: `Back to ${currentVendorName}`
        });
      }
    }
  }, [product, currentVendorName, dynamicStoreHref]);

  useEffect(() => {
    if (product?.id) {
      fetch("/api/coupons/available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: [{ productId: product.id, quantity: 1, price: product.price }] })
      })
      .then(res => res.json())
      .then(data => {
        if (data.shippingSettings) {
          setShippingSettings(data.shippingSettings);
        }
        if (data.success && data.coupons) {
          setAvailableCoupons(data.coupons);
        } else {
          setAvailableCoupons([]);
        }
      })
      .catch(err => console.error("Error fetching coupons:", err));
    }
  }, [product]);

  const descriptionMaxLen = 240;
  const newlineCount = (product.description || "").split("\n").length;
  const isLongDescription = product.description && (product.description.length > descriptionMaxLen || newlineCount > 5);

  return (
    <div className="min-h-screen bg-surface pb-16 pt-6 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Breadcrumbs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          {/* Back Link */}
          <Link 
            href={backPath.href} 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-heading transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            {backPath.label}
          </Link>

          {/* Product Breadcrumb Trail (100% Consistent & No Flashing) */}
          <nav aria-label="Breadcrumb" className="flex items-center text-[10px] sm:text-xs font-semibold text-muted flex-wrap">
            <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex items-center gap-1.5 flex-wrap list-none p-0 m-0">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                <Link itemProp="item" href="/" className="hover:text-heading transition-colors">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              
              <span className="mx-1 select-none">/</span>
              
              {currentVendorName ? (
                <>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                    <Link
                      itemProp="item"
                      href={dynamicStoreHref || "/products"}
                      className="hover:text-heading hover:text-orange-500 transition-colors"
                    >
                      <span itemProp="name" className="truncate max-w-[100px] sm:max-w-[180px] inline-block align-bottom" title={currentVendorName}>
                        {currentVendorName}
                      </span>
                    </Link>
                    <meta itemProp="position" content="2" />
                  </li>
                  
                  {currentCategoryName && (
                    <>
                      <span className="mx-1 select-none">/</span>
                      <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                        <Link 
                          itemProp="item" 
                          href={dynamicStoreHref ? `${dynamicStoreHref}?category=${currentCategorySlug}` : `/products?category=${currentCategorySlug}`} 
                          className="hover:text-heading hover:text-orange-500 transition-colors capitalize"
                        >
                          <span itemProp="name" className="truncate max-w-[100px] sm:max-w-[180px] inline-block align-bottom" title={currentCategoryName}>
                            {currentCategoryName}
                          </span>
                        </Link>
                        <meta itemProp="position" content="3" />
                      </li>
                    </>
                  )}
                </>
              ) : (
                <>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                    <Link itemProp="item" href="/products" className="hover:text-heading transition-colors">
                      <span itemProp="name">Marketplace</span>
                    </Link>
                    <meta itemProp="position" content="2" />
                  </li>
                  
                  {currentCategoryName && (
                    <>
                      <span className="mx-1 select-none">/</span>
                      <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                        <Link 
                          itemProp="item" 
                          href={`/products?category=${currentCategorySlug}`} 
                          className="hover:text-heading hover:text-orange-500 transition-colors capitalize"
                        >
                          <span itemProp="name" className="truncate max-w-[100px] sm:max-w-[180px] inline-block align-bottom" title={currentCategoryName}>
                            {currentCategoryName}
                          </span>
                        </Link>
                        <meta itemProp="position" content="3" />
                      </li>
                    </>
                  )}
                </>
              )}

              <span className="mx-1 select-none">/</span>

              <li 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem" 
                className="flex items-center"
              >
                <span itemProp="name" className="text-orange-600 dark:text-orange-400 font-bold truncate max-w-[120px] sm:max-w-[240px] inline-block align-bottom" title={product.name}>
                  {product.name}
                </span>
                <meta itemProp="position" content="4" />
              </li>
            </ol>
          </nav>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-surface-card border border-border p-4 sm:p-8 rounded-3xl">
          
          {/* Left Column: Image Gallery (Client Actions Component) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <ProductClientActions product={product} allImages={allImages} bundleProducts={bundleProducts} />
          </div>

          {/* Right Column: Product Specs & Purchase info */}
          <div className="lg:col-span-6 flex flex-col space-y-5">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-bronze-500/10 text-bronze-700 dark:text-bronze-300 text-[10px] font-bold uppercase tracking-wider">
                  {product.category?.name || "Premium Collection"}
                </span>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                  Material: <span className="text-heading font-black">{product.material}</span>
                </span>
                
                {product.reviews && product.reviews > 0 ? (
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className="stroke-orange-500" />
                      ))}
                    </div>
                    <span className="font-bold text-heading ml-1">{product.rating}</span>
                    <span className="text-muted">({product.reviews} reviews)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted font-bold">
                    <Star size={13} className="text-muted" />
                    <span>New Arrival (No reviews yet)</span>
                  </div>
                )}
              </div>

              {/* Title Section with Myntra-Style Border Bottom */}
              <div className="border-b border-border/80 pb-3.5 sm:pb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading leading-snug tracking-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Section (Clean Myntra-Style UI) */}
              <div className="pt-0.5 space-y-1">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-heading">
                    {convertPrice(product.price, product, false)}
                  </span>
                  {getRawPrice(product.mrp, product, true) > getRawPrice(product.price, product, false) && (
                    <>
                      <span className="text-sm sm:text-base text-muted line-through font-medium">
                        MRP {convertPrice(product.mrp, product, true)}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-orange-600 dark:text-orange-400 font-display">
                        ({product.discount}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
                  inclusive of all taxes
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-heading uppercase tracking-wider">Description</h3>
                <div className={`text-xs sm:text-sm text-body leading-relaxed whitespace-pre-line break-words overflow-hidden transition-all duration-300 relative ${!isDescExpanded ? 'max-h-[140px]' : ''}`}>
                  <div className={`${!isDescExpanded ? 'line-clamp-6' : ''}`}>
                    {product.description}
                  </div>
                  {isLongDescription && (
                    <div className={`${!isDescExpanded ? 'absolute bottom-0 right-0 bg-surface pl-4 pt-1' : 'mt-2'}`}>
                      <button
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="text-xs font-black text-bronze-600 dark:text-bronze-400 hover:underline cursor-pointer focus:outline-none bg-surface"
                      >
                        {isDescExpanded ? "Read Less" : "Read More..."}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical specs info */}
              <div className="bg-surface p-4 rounded-2xl border border-border space-y-2">
                <h3 className="text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={14} className="text-bronze-500" />
                  Product Specifications
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-xs pt-1">
                  {product.specs ? (
                    product.specs.split(" | ").map((spec: string, i: number) => {
                      const parts = spec.split(": ");
                      if (parts.length === 2) {
                        return (
                          <React.Fragment key={i}>
                            <span className="text-muted">{parts[0]}:</span>
                            <span className="text-heading font-semibold text-right">
                              {parts[0].toLowerCase().includes("weight") ? convertWeight(parts[1]) : parts[1]}
                            </span>
                          </React.Fragment>
                        );
                      }
                      
                      // If it is raw weight like "1.5 Kg"
                      if (
                        spec.toLowerCase().includes("kg") ||
                        spec.toLowerCase().includes("gm") ||
                        spec.toLowerCase().includes("lbs") ||
                        spec.toLowerCase().includes("ton")
                      ) {
                        return (
                          <React.Fragment key={i}>
                            <span className="text-muted">Weight:</span>
                            <span className="text-heading font-semibold text-right">{convertWeight(spec)}</span>
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={i}>
                          <span className="text-muted">Detail:</span>
                          <span className="text-heading font-semibold text-right">{spec}</span>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <>
                      <span className="text-muted">Item Details:</span>
                      <span className="text-heading font-semibold text-right">Standard</span>
                    </>
                  )}
                  <span className="text-muted">Composition:</span>
                  <span className="text-heading font-semibold text-right">Pure Bell Metal / {product.material}</span>
                  <span className="text-muted">Standard:</span>
                  <span className="text-heading font-semibold text-right">Food Grade Export Quality</span>
                </div>
              </div>

              {/* Premium Trust Badges — Lightweight */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4">
                
                {/* Badge 1: Global Shipping */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-2.5 sm:p-3.5 rounded-2xl border border-blue-200/60 dark:border-blue-500/20 hover:border-blue-400/60 transition-colors duration-300 group">
                  <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <Truck size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col overflow-hidden min-w-0">
                      <span className="text-[10px] sm:text-xs font-extrabold text-heading leading-tight truncate">
                        Global Shipping
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-muted font-semibold leading-tight truncate">
                        Airtight Packing
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badge 2: Pure Metal */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2.5 sm:p-3.5 rounded-2xl border border-emerald-200/60 dark:border-emerald-500/20 hover:border-emerald-400/60 transition-colors duration-300 group">
                  <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <ShieldCheck size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col overflow-hidden min-w-0">
                      <span className="text-[10px] sm:text-xs font-extrabold text-heading leading-tight truncate">
                        100% Pure Metal
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-muted font-semibold leading-tight truncate">
                        Lab Tested
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badge 3: Artisanal Craft */}
                <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 sm:p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 hover:border-amber-400/60 transition-colors duration-300 group">
                  <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <Award size={16} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col overflow-hidden min-w-0">
                      <span className="text-[10px] sm:text-xs font-extrabold text-heading leading-tight truncate">
                        Artisanal Craft
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-muted font-semibold leading-tight truncate">
                        Handcrafted
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* OFFERS & COUPONS WIDGET — Lightweight Premium */}
            <div className="bg-amber-50 dark:bg-stone-900 border-2 border-orange-300/40 dark:border-orange-500/20 rounded-3xl p-4 sm:p-5 space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-orange-300/30 dark:border-orange-500/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
                      <Tag size={15} className="text-white sm:w-[17px] sm:h-[17px]" />
                    </div>
                    <h3 className="font-display font-black text-xs sm:text-sm text-heading uppercase tracking-wide">
                      {availableCoupons.length > 0 ? "⚡ Available Offers & Coupons" : "🛡️ StopShop Buyer Guarantees"}
                    </h3>
                  </div>
                  <span className="hidden sm:inline-flex text-[9px] sm:text-[10px] font-extrabold text-orange-700 dark:text-orange-300 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-400/25 dark:border-orange-500/20">
                    {availableCoupons.length > 0 ? "Instant Savings" : "100% Protected"}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Dynamic Coupon Cards */}
                  {availableCoupons.map((coupon, index) => (
                    <div key={coupon.code || index} className="p-3 sm:p-4 bg-white dark:bg-surface-card rounded-2xl border border-amber-200/50 dark:border-amber-500/15 hover:border-orange-400/50 transition-colors duration-300 flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-start gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 border border-amber-300/30 dark:border-amber-500/15">
                          <Gift size={16} className="text-amber-600 dark:text-amber-400 sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <span className="text-[8px] sm:text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.08em] block">
                            {coupon.isFallback ? "Welcome Bonus" : (product.vendor ? `${product.vendor.name?.substring(0, 15)} Special` : "Store Offer")}
                          </span>
                          <h4 className="text-[11px] sm:text-xs font-bold text-heading truncate leading-snug mt-0.5">
                            {coupon.description}
                          </h4>
                          <p className="text-[9px] sm:text-[10px] text-muted mt-0.5">
                            {coupon.minOrderPaise ? `Min order: ${convertPrice(coupon.minOrderPaise / 100, product, false)}` : "Applicable at final checkout bill"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          setCopiedCode(coupon.code);
                          setTimeout(() => setCopiedCode(null), 2000);
                        }}
                        className={`px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-wider transition-all duration-300 shrink-0 flex items-center gap-1 sm:gap-1.5 active:scale-95 cursor-pointer border-2 border-dashed ${
                          copiedCode === coupon.code 
                            ? "bg-emerald-500 text-white border-emerald-500 border-solid" 
                            : "bg-orange-500/10 hover:bg-orange-500 text-orange-600 hover:text-white dark:text-orange-400 dark:hover:text-white border-orange-400/40 hover:border-solid"
                        }`}
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check size={11} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>{coupon.code}</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}

                  {/* Delivery Guarantee Card */}
                  {(() => {
                    const freeAboveINR = shippingSettings.shippingFreeAbove / 100;
                    const isFreeShipping = product.price >= freeAboveINR || shippingSettings.shippingFreeAbove === 0;
                    return (
                      <div className="p-3 sm:p-4 bg-white dark:bg-surface-card rounded-2xl border border-emerald-200/50 dark:border-emerald-500/15 hover:border-emerald-400/50 transition-colors duration-300 flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-start gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0 border border-emerald-300/30 dark:border-emerald-500/15">
                            <Truck size={16} className="text-emerald-600 dark:text-emerald-400 sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <div className="overflow-hidden min-w-0">
                            <span className="text-[8px] sm:text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.08em] block">
                              StopShop Guarantee
                            </span>
                            <h4 className="text-[11px] sm:text-xs font-bold text-heading truncate leading-snug mt-0.5">
                              {isFreeShipping ? "Free Insured Global Delivery" : "Insured Global Delivery"}
                            </h4>
                            <p className="text-[9px] sm:text-[10px] text-muted mt-0.5 line-clamp-2">
                              {isFreeShipping
                                ? `Order qualifies for 100% Free Shipping (Orders above ${convertPrice(freeAboveINR, product, false)})!`
                                : `Free shipping on orders above ${convertPrice(freeAboveINR, product, false)}! Standard shipping: ${convertPrice(shippingSettings.shippingChargePaise / 100, product, false)}.`}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 sm:px-3 py-1.5 text-[9px] sm:text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 rounded-xl border border-emerald-400/25 dark:border-emerald-500/20 shrink-0 whitespace-nowrap">
                          {isFreeShipping ? "Free Delivery" : "Fast Delivery"}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Smart Stacking Pill */}
                  <div className="p-3 sm:p-3.5 bg-purple-50 dark:bg-purple-950/20 rounded-2xl border border-purple-300/30 dark:border-purple-500/20 flex items-center gap-2 sm:gap-3 text-xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shrink-0">
                      <Zap size={13} className="text-white sm:w-[14px] sm:h-[14px]" />
                    </div>
                    <span className="text-muted font-medium text-[10px] sm:text-[11px] leading-relaxed">
                      <strong className="text-purple-600 dark:text-purple-400 font-extrabold">Smart Stacking:</strong> {availableCoupons.length > 0 ? "Personalized discount & Combo savings auto-stack with these coupons!" : "Personalized discount & Bundle combo savings will be automatically applied at checkout!"}
                    </span>
                  </div>
                </div>
            </div>

            {/* Sold By Vendor Card (Moved to Right Column) */}
            {product.vendor ? (
              <div className="bg-surface-card p-4 sm:p-5 rounded-3xl border border-border/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 shadow-sm">
                    <Store size={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-muted uppercase tracking-wider">Sold By</div>
                    <h4 className="text-sm sm:text-base font-black text-heading leading-tight">
                      {product.vendor.name || "StopShop Verified Artisan"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] pt-1">
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-heading">Verified</span>
                        <span className="text-muted font-medium">Artisan</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/store/${product.vendor.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || product.vendor.id}`}
                  className="px-5 py-2.5 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-black rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all text-center shrink-0 shadow-sm active:scale-95"
                >
                  View Shop
                </Link>
              </div>
            ) : (
              <div className="bg-surface-card p-4 sm:p-5 rounded-3xl border border-border/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400 shadow-sm">
                    <Store size={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-muted uppercase tracking-wider">Sold By</div>
                    <h4 className="text-sm sm:text-base font-black text-heading leading-tight">StopShop Direct (Official Store)</h4>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] pt-1">
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-heading">100%</span>
                        <span className="text-muted font-medium">Authentic Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Frequently Bought Together / Recommendations */}
        <RecommendedSection 
          productId={product.id} 
          category={product.categoryName} 
          material={product.material}
          productSlug={product.slug || product.id.toString()}
          productName={product.name}
        />

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />

      </div>
    </div>
  );
}
