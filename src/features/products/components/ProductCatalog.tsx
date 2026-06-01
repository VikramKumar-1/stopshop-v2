"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ShoppingCart, SlidersHorizontal, ArrowUpDown, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";

// Meaningful messages tailored for each product category
const categoryEndMessages: Record<string, string> = {
  "kitchen-utility": "You have viewed all traditional kitchen cookware.",
  "brass-cookware": "You have viewed all premium brass cookware items.",
  "copper-products": "You have viewed all therapeutic wellness copperware.",
  "steel-essentials": "You have viewed all modern steel tableware essentials.",
  "pooja-collection": "You have viewed all sacred pooja essentials.",
  "dinner-sets": "You have viewed all traditional dinner sets.",
  "home-living": "You have viewed all home living decor & collections.",
  "handicrafts": "You have viewed all metal handicrafts.",
  default: "You have viewed all products in this collection."
};

// Dynamic header titles and descriptions for catalog page
const categoryHeaderContents: Record<string, { title: string; description: string }> = {
  "kitchen-utility": {
    title: "Kitchen Utility",
    description: "Explore our range of premium and durable kitchen utensils."
  },
  "brass-cookware": {
    title: "Brass Cookware",
    description: "Traditional brass cookware designed for healthy, authentic cooking."
  },
  "copper-products": {
    title: "Copper Products",
    description: "Wellness copperware bottles, jugs, and drinking vessels."
  },
  "steel-essentials": {
    title: "Steel Essentials",
    description: "High-quality, durable stainless steel dinnerware and organizer racks."
  },
  "pooja-collection": {
    title: "Pooja Collection",
    description: "Sacred brass idols, lamps, and devotional accessories."
  },
  "dinner-sets": {
    title: "Dinner Sets",
    description: "Premium handcrafted bronze, brass, and steel dinner sets."
  },
  "home-living": {
    title: "Home Living",
    description: "Decorative metal art and aesthetic essentials for your home."
  },
  "handicrafts": {
    title: "Handicrafts",
    description: "Exquisite handcrafted metal items, brass showpieces, and decor."
  },
  "kitchen-racks": {
    title: "Kitchen Racks",
    description: "Organize your utensils with heavy-duty steel and brass racks."
  },
  "bedroom-essentials": {
    title: "Bedroom Essentials",
    description: "Elegant metal accessories and organizers for your bedroom."
  },
  "living-room": {
    title: "Living Room",
    description: "Premium decorative brass objects and centerpieces for your living room."
  },
  default: {
    title: "Explore Our Collections",
    description: "Discover our premium range of utensils, cookware, and brass artifacts."
  }
};

interface ProductCatalogProps {
  initialMaterialOverride?: string;
}

export const ProductCatalog = ({ initialMaterialOverride }: ProductCatalogProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialMaterial = initialMaterialOverride || searchParams.get("material") || "";
  const initialSort = searchParams.get("sort") || "";
  
  const { addToCart } = useCart();
  const { convertPrice, convertWeight } = useRegion();
 
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [material, setMaterial] = useState(initialMaterial);
  const [sort, setSort] = useState(initialSort);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
 
  const activeHeader = categoryHeaderContents[category] || categoryHeaderContents.default;
 
  // Sync URL search query parameters when they change
  useEffect(() => {
    const querySearch = searchParams.get("search") || "";
    setSearchInput(querySearch);
    setSearch(querySearch);
    setCategory(searchParams.get("category") || "");
    setMaterial(initialMaterialOverride || searchParams.get("material") || "");
    setSort(searchParams.get("sort") || "");
  }, [searchParams, initialMaterialOverride]);
 
  // Sync state changes back to the URL
  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (sort) query.append("sort", sort);

    const currentPath = window.location.pathname;
    let targetPath = "/products";
    
    if (material) {
      targetPath = `/products/material/${material.toLowerCase()}`;
    }

    const newQueryString = query.toString();
    const hasPathChanged = currentPath !== targetPath;
    
    const currentQueryParams = new URLSearchParams(window.location.search);
    currentQueryParams.delete("material");
    const hasQueryChanged = newQueryString !== currentQueryParams.toString();

    if (hasPathChanged || hasQueryChanged) {
      const suffix = newQueryString ? `?${newQueryString}` : "";
      router.push(`${targetPath}${suffix}`, { scroll: false });
    }
  }, [search, category, material, sort, router, initialMaterialOverride]);

  // Debounce search input changes by 400ms to avoid database query flooding on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Dynamic categories list
  const [categories, setCategories] = useState<any[]>([
    { name: "All Categories", slug: "" },
    { name: "Kitchen Utility", slug: "kitchen-utility" },
    { name: "Brass Cookware", slug: "brass-cookware" },
    { name: "Pooja Collection", slug: "pooja-collection" },
    { name: "Copper Products", slug: "copper-products" },
  ]);

  // Fetch categories dynamically from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          // Map to match the { name, slug } structure of filters
          const formatted = data.map((cat: any) => ({
            name: cat.name,
            slug: cat.slug
          }));
          setCategories([
            { name: "All Categories", slug: "" },
            ...formatted
          ]);
        }
      } catch (err) {
        console.error("Failed to load categories dynamically:", err);
      }
    };
    fetchCategories();
  }, []);

  // Materials list
  const materials = [
    { name: "All Materials", value: "" },
    { name: "Bronze", value: "Bronze" },
    { name: "Copper", value: "Copper" },
    { name: "Brass", value: "Brass" },
    { name: "Steel", value: "Steel" },
    { name: "Ceramic", value: "Ceramic" },
    { name: "Glass", value: "Glass" },
  ];

  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const BATCH_SIZE = 12;

  const fetchProducts = async (isInitial = true) => {
    // Cancel the previous fetch request if it exists and is still in progress
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new AbortController for this fetch request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isInitial) {
      setLoading(true);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category) query.append("category", category);
      if (material) query.append("material", material);
      if (sort) query.append("sort", sort);
      
      // Calculate skip based on currently loaded product count
      const skip = isInitial ? 0 : products.length;
      query.append("skip", skip.toString());
      query.append("take", BATCH_SIZE.toString());

      const res = await fetch(`/api/products?${query.toString()}`, { 
        cache: "no-store",
        signal: controller.signal
      });
      
      if (res.ok) {
        const data = await res.json();
        if (isInitial) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }
        
        if (data.length < BATCH_SIZE) {
          setHasMore(false);
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        // Ignored since it was cancelled intentionally by a newer request
        return;
      }
      console.error("Failed to fetch products:", error);
    } finally {
      // Only reset loading indicators if this controller is the active one
      if (abortControllerRef.current === controller) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts(true);
  }, [search, category, material, sort]);

  // Auto-refresh when tab gains focus (e.g. returning from vendor dashboard tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts(true);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [search, category, material, sort]);

  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchProducts(false);
        }
      },
      { threshold: 0.1, rootMargin: "150px" }
    );

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [products.length, hasMore, loading, loadingMore]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-surface pt-0 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-bronze-950 via-bronze-900 to-bronze-950 text-white py-5 px-4 sm:px-6 lg:px-8 border-b border-bronze-800">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side: Context */}
          <div className="text-left flex-grow">
            {/* Breadcrumb Trail */}
            <nav aria-label="Breadcrumb" className="flex items-center text-[11px] text-bronze-300/80 mb-2 font-medium tracking-wide">
              <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex items-center gap-1.5 flex-wrap list-none p-0 m-0">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                  <Link itemProp="item" href="/" className="hover:text-white transition-colors">
                    <span itemProp="name">Home</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </li>
                
                <span className="mx-1 text-bronze-500/50 select-none">/</span>
                
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                  <Link itemProp="item" href="/products" className="hover:text-white transition-colors">
                    <span itemProp="name">Products</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
                
                {category && (
                  <>
                    <span className="mx-1 text-bronze-500/50 select-none">/</span>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                      {material ? (
                        <Link itemProp="item" href={`/products?category=${category}`} className="hover:text-white transition-colors capitalize font-medium">
                          <span itemProp="name">{category.replace("-", " ")}</span>
                        </Link>
                      ) : (
                        <span itemProp="name" className="text-bronze-200 capitalize font-semibold">{category.replace("-", " ")}</span>
                      )}
                      <meta itemProp="position" content="3" />
                    </li>
                  </>
                )}
                
                {material && (
                  <>
                    <span className="mx-1 text-bronze-500/50 select-none">/</span>
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
                      <span itemProp="name" className="text-bronze-200 capitalize font-semibold">{material}</span>
                      <meta itemProp="position" content={category ? "4" : "3"} />
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-1">
              {activeHeader.title}
            </h1>
            <p className="text-xs sm:text-sm text-bronze-200/70 max-w-xl">
              {activeHeader.description}
            </p>
          </div>

          {/* Right Side: Search and Sort on Title Banner */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center shrink-0 mt-4 lg:mt-0">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search premium bronze, brass & copper..."
                className="w-full bg-white/10 border border-white/10 hover:border-white/20 focus:border-bronze-400 focus:bg-white/15 focus:ring-1 focus:ring-bronze-400 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none text-white placeholder-bronze-300/50 transition-all shadow-inner"
              />
              <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bronze-300/60" />
            </form>

            {/* Sorting */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 hover:border-white/20 px-3 py-2 rounded-full text-xs text-bronze-200 w-full sm:w-auto shrink-0 transition-all shadow-inner">
              <ArrowUpDown size={12} className="text-bronze-300/60" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-white text-xs pr-2"
              >
                <option value="" className="bg-bronze-950 text-white">Default Sorting</option>
                <option value="best-sellers" className="bg-bronze-950 text-white">Best Sellers</option>
                <option value="rating" className="bg-bronze-950 text-white">Top Rated</option>
                <option value="price-low-high" className="bg-bronze-950 text-white">Price: Low to High</option>
                <option value="price-high-low" className="bg-bronze-950 text-white">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-80 shrink-0 sticky top-[132px] self-start z-10">
            <div className="bg-surface-card border border-border rounded-2xl p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Categories</h3>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                        category === cat.slug
                          ? "bg-bronze-500 border-bronze-500 text-white font-bold shadow-sm"
                          : "bg-surface border-border text-muted hover:border-bronze-500/30 hover:text-heading"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div>
                <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Materials</h3>
                <div className="flex flex-wrap gap-1.5">
                  {materials.map((mat) => (
                    <button
                      key={mat.value}
                      onClick={() => setMaterial(mat.value)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                        material === mat.value
                          ? "bg-bronze-500 border-bronze-500 text-white font-bold shadow-sm"
                          : "bg-surface border-border text-muted hover:border-bronze-500/30 hover:text-heading"
                      }`}
                    >
                      {mat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-[420px] bg-surface-card border border-border animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-surface-card border border-border rounded-2xl">
                <h3 className="text-lg font-bold text-heading mb-2">No Products Found</h3>
                <p className="text-muted text-xs mb-4">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setMaterial("");
                    setSort("");
                  }}
                  className="px-5 py-2.5 rounded-full bg-bronze-500 text-white text-xs font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const savedAmount = product.mrp - product.price;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => router.push(`/product/${product.slug || product.id}`)}
                      className="group bg-surface-card border border-bronze-500/[0.12] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <Link href={`/product/${product.slug || product.id}`} className="relative aspect-square block bg-orange-50/50 dark:bg-white/5 overflow-hidden">
                        {product.discount > 0 && (
                          <span className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                            {product.discount}% OFF
                          </span>
                        )}
                        
                        <span className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md text-white text-[9px] font-medium px-2 py-0.5 rounded-md">
                          {product.material}
                        </span>

                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted mb-1.5">
                            <div className="flex items-center gap-0.5 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                              <span>{product.rating}</span>
                              <Star size={8} fill="currentColor" className="stroke-none" />
                            </div>
                            <span>({product.reviews} reviews)</span>
                          </div>

                          <Link href={`/product/${product.slug || product.id}`}>
                            <h3 className="text-sm sm:text-base font-bold text-heading hover:text-bronze-500 transition-colors line-clamp-1 mb-1">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-baseline gap-1.5 mb-2.5 flex-wrap">
                            <span className="text-base font-bold text-heading">{convertPrice(product.price)}</span>
                            {product.mrp > product.price && (
                              <>
                                <span className="text-xs text-muted line-through">{convertPrice(product.mrp)}</span>
                                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                                  Save {convertPrice(savedAmount)}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-medium border-t border-border pt-2.5 mb-4">
                            <span className="flex items-center gap-1 text-bronze-800 dark:text-bronze-400">
                              <ShieldCheck size={12} />
                              100% Export Quality
                            </span>
                            
                            {product.stock <= 5 ? (
                              <span className="text-red-500 font-bold animate-pulse">
                                Only {product.stock} left in stock
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                In Stock
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center w-full">
                          {/* Add to Inquiry Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, 1);
                            }}
                            className="w-full group/btn inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-bold shadow-md shadow-bronze-500/10 hover:shadow-lg hover:shadow-bronze-500/25 transition-all duration-300 text-xs active:scale-[0.97]"
                          >
                            <ShoppingCart size={14} />
                            Add to Inquiry
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Scroll Sentinel / Loading More indicator */}
            {products.length > 0 && (
              <div ref={observerRef} className="py-10 text-center flex flex-col items-center justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-xs font-bold text-muted animate-pulse">
                    <div className="w-4 h-4 border-2 border-bronze-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading more items...</span>
                  </div>
                )}
                {!hasMore && (
                  <div className="text-xs font-black text-bronze-650 dark:text-bronze-400 select-none py-4 border-t border-border/40 w-full mt-4">
                    ✦ {categoryEndMessages[category] || categoryEndMessages.default} ✦
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Sidebar for Mobile Filters */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-surface-card z-50 p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h2 className="text-base font-bold text-heading">Filter Options</h2>
                  <button onClick={() => setSidebarOpen(false)} className="text-xs font-semibold text-muted hover:text-heading">
                    Close
                  </button>
                </div>

                {/* Mobile Sort Option */}
                <div>
                  <h3 className="text-xs font-bold text-heading mb-2.5 uppercase tracking-wider">Sort By</h3>
                  <div className="flex items-center gap-2 bg-surface border border-border px-3 py-2 rounded-xl text-xs text-body w-full">
                    <ArrowUpDown size={14} className="text-muted" />
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setSidebarOpen(false);
                      }}
                      className="bg-transparent focus:outline-none cursor-pointer text-heading w-full text-xs"
                    >
                      <option value="">Default Sorting</option>
                      <option value="best-sellers">Best Sellers</option>
                      <option value="rating">Top Rated</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-heading mb-2.5 uppercase tracking-wider">Categories</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          setCategory(cat.slug);
                          setSidebarOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          category === cat.slug
                            ? "bg-bronze-500 text-white"
                            : "bg-surface border border-border text-muted hover:text-heading"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-heading mb-2.5 uppercase tracking-wider">Materials</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {materials.map((mat) => (
                      <button
                        key={mat.value}
                        onClick={() => {
                          setMaterial(mat.value);
                          setSidebarOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          material === mat.value
                            ? "bg-bronze-500 text-white"
                            : "bg-surface border border-border text-muted hover:text-heading"
                        }`}
                      >
                        {mat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setMaterial("");
                  setSort("");
                  setSidebarOpen(false);
                }}
                className="w-full py-2.5 bg-surface border border-border text-xs font-bold text-heading rounded-xl text-center"
              >
                Reset All Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Filter Button (Mobile Only) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-1.5 bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white px-5 py-3 rounded-full text-xs font-bold shadow-lg shadow-bronze-500/30 transition-all duration-300 active:scale-95 border border-bronze-400/20"
      >
        <SlidersHorizontal size={14} />
        Filters
      </button>
    </div>
  );
};
