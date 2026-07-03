"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, ArrowLeft, Truck, PackageCheck, Award, Store } from "lucide-react";
import ProductClientActions from "./ProductClientActions";
import { useRegion } from "@/context/RegionContext";
import { trackProductView } from "@/lib/analytics";
import ReviewSection from "./ReviewSection";
import { RecommendedSection } from "./RecommendedSection";

interface ProductDetailsProps {
  product: any;
  allImages: string[];
}

export default function ProductDetails({ product, allImages }: ProductDetailsProps) {
  const { convertPrice, convertWeight, getRawPrice } = useRegion();
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [backPath, setBackPath] = useState({
    href: product.categoryName ? `/products?category=${product.categoryName}` : "/products",
    label: `Back to ${product.category?.name || product.categoryName?.replace(/-/g, " ") || "Collections"} Collection`
  });
  const [referrerType, setReferrerType] = useState<"cart" | "admin" | "vendor" | "default">("default");

  useEffect(() => {
    if (typeof window !== "undefined" && document.referrer) {
      const referrer = document.referrer;
      if (referrer.includes("/cart")) {
        setBackPath({
          href: "/cart",
          label: "Back to Cart"
        });
        setReferrerType("cart");
      } else if (referrer.includes("/admin")) {
        setBackPath({
          href: "/admin",
          label: "Back to Admin Panel"
        });
        setReferrerType("admin");
      } else if (referrer.includes("/store") || referrer.includes("/vendor-shop")) {
        setBackPath({
          href: referrer.substring(referrer.indexOf(window.location.host) + window.location.host.length),
          label: "Back to Artisan Store"
        });
        setReferrerType("default");
      } else if (referrer.includes("/vendor") && !referrer.includes("/vendor-shop")) {
        setBackPath({
          href: "/vendor/dashboard",
          label: "Back to Vendor Dashboard"
        });
        setReferrerType("vendor");
      }
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

          {/* Dynamic Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center text-[10px] sm:text-xs font-semibold text-muted flex-wrap">
            <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex items-center gap-1.5 flex-wrap list-none p-0 m-0">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                <Link itemProp="item" href="/" className="hover:text-heading transition-colors">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              
              <span className="mx-1 select-none">/</span>
              
              {referrerType === "cart" ? (
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                  <Link itemProp="item" href="/cart" className="hover:text-heading transition-colors">
                    <span itemProp="name">Cart</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
              ) : referrerType === "admin" ? (
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                  <Link itemProp="item" href="/admin" className="hover:text-heading transition-colors">
                    <span itemProp="name">Admin</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
              ) : referrerType === "vendor" ? (
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                  <Link itemProp="item" href="/vendor" className="hover:text-heading transition-colors">
                    <span itemProp="name">Vendor</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
              ) : (
                <>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                    <Link itemProp="item" href="/products" className="hover:text-heading transition-colors">
                      <span itemProp="name">Collections</span>
                    </Link>
                    <meta itemProp="position" content="2" />
                  </li>
                  
                  <span className="mx-1 select-none">/</span>
                  
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                    <Link 
                      itemProp="item" 
                      href={`/products?category=${product.categoryName || ""}`} 
                      className="hover:text-heading hover:text-bronze-500 transition-colors capitalize"
                    >
                      <span itemProp="name">
                        {product.category?.name || product.categoryName?.replace(/-/g, " ") || "Collection"}
                      </span>
                    </Link>
                    <meta itemProp="position" content="3" />
                  </li>
                </>
              )}

              <span className="mx-1 select-none">/</span>

              <li 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem" 
                className="flex items-center"
              >
                <span itemProp="name" className="text-bronze-600 dark:text-bronze-400 font-black truncate max-w-[150px] sm:max-w-[200px]" title={product.name}>
                  {product.name}
                </span>
                <meta itemProp="position" content={referrerType === "default" ? "4" : "3"} />
              </li>
            </ol>
          </nav>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-surface-card border border-border p-4 sm:p-8 rounded-3xl">
          
          {/* Left Column: Image Gallery (Client Actions Component) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <ProductClientActions product={product} allImages={allImages} />
          </div>

          {/* Right Column: Product Specs & Purchase info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
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

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-display font-black text-heading leading-tight">
                {product.name}
              </h1>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3 flex-wrap border-b border-border pb-4">
                <span className="text-3xl font-black text-heading">{convertPrice(product.price, product, false)}</span>
                {getRawPrice(product.mrp, product, true) > getRawPrice(product.price, product, false) && (
                  <>
                    <span className="text-base text-muted line-through">MRP: {convertPrice(product.mrp, product, true)}</span>
                    <span className="bg-emerald-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
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

              {/* Export details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[10px] sm:text-xs">
                <div className="flex items-center gap-2 p-3 bg-surface border border-border rounded-xl">
                  <Truck size={16} className="text-orange-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-heading">Global Shipping</span>
                    <span className="text-[10px] text-muted">Airtight Packing</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-surface border border-border rounded-xl">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-heading">100% Pure Metal</span>
                    <span className="text-[10px] text-muted">Laboratory Tested</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-surface border border-border rounded-xl">
                  <PackageCheck size={16} className="text-blue-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-heading">Artisanal Craft</span>
                    <span className="text-[10px] text-muted">Traditional clusters</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Sold By Vendor Card (Exact UI as Screenshot) */}
        {product.vendor ? (
          <div className="bg-surface-card p-5 rounded-3xl border border-border/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 my-8">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 shadow-sm">
                <Store size={26} />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-black text-muted uppercase tracking-wider">Sold By</div>
                <h4 className="text-base sm:text-lg font-black text-heading leading-tight">
                  {product.vendor.name || "StopShop Verified Artisan"}
                  {product.vendor.location && (
                    <span className="text-xs font-semibold text-muted block sm:inline sm:ml-2">({product.vendor.location})</span>
                  )}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1.5">
                  <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full font-bold text-xs shadow-2xs">
                    <span>4.8</span>
                    <span className="text-[10px]">★</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-heading">1,275</span>
                    <span className="text-muted text-xs font-medium">Followers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-heading">Verified</span>
                    <span className="text-muted text-xs font-medium">Artisan Partner</span>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href={`/store/${product.vendor.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || product.vendor.id}`}
              className="px-6 py-3 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-black rounded-2xl font-bold text-xs uppercase tracking-wider transition-all text-center shrink-0 shadow-sm active:scale-95"
            >
              View Shop
            </Link>
          </div>
        ) : (
          <div className="bg-surface-card p-5 rounded-3xl border border-border/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 my-8">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400 shadow-sm">
                <Store size={26} />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-black text-muted uppercase tracking-wider">Sold By</div>
                <h4 className="text-base sm:text-lg font-black text-heading leading-tight">StopShop Direct (Official Store)</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1.5">
                  <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full font-bold text-xs shadow-2xs">
                    <span>4.9</span>
                    <span className="text-[10px]">★</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-heading">100%</span>
                    <span className="text-muted text-xs font-medium">Authentic Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Frequently Bought Together / Recommendations */}
        <RecommendedSection productId={product.id} category={product.category} material={product.material} />

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />

      </div>
    </div>
  );
}
