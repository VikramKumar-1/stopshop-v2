"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ShoppingCart, SlidersHorizontal, ArrowUpDown, ShieldCheck, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { useWishlist } from "@/context/WishlistContext";

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

const generateMock = (base: any[], categorySlug: string) => {
  let mat = "Bronze";
  if (categorySlug === "copper-products") mat = "Copper";
  else if (categorySlug === "steel-essentials") mat = "Steel";
  else if (categorySlug === "brass-cookware") mat = "Brass";

  return Array.from({ length: 12 }).map((_, i) => ({
    ...base[i % base.length],
    id: base[i % base.length].id * 100 + i,
    discount: 0,
    stock: 10,
    material: mat,
    categoryName: categorySlug,
    category: { name: categorySlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) }
  }));
};

const mockDataMap: Record<string, any[]> = {
  "kitchen-utility": generateMock([
    { id: 1, name: "Heritage Bronze Kadai", description: "Heavy-duty pure bronze cooking kadai.", specs: "Weight: 2.4 kg | Hand-Hammered", image: "/bronze-kadai.png", rating: 4.9, reviews: 124, price: 2499, mrp: 3199 },
    { id: 2, name: "Handcrafted Bronze Handi", description: "Elegant deep-cooking pot with lid.", specs: "Capacity: 3 Litres", image: "/bronze-hero.png", rating: 4.7, reviews: 67, price: 3299, mrp: 4499 }
  ], "kitchen-utility"),
  "pooja-collection": generateMock([
    { id: 101, name: "Premium Brass Puja Thali Set", description: "Complete handcrafted puja thali with components.", specs: "Material: Brass | 7 Pieces", image: "/collection-pooja.png", rating: 4.8, reviews: 89, price: 1899, mrp: 2499 },
    { id: 102, name: "Hand-Hammered Copper Lota", description: "Traditional copper vessel for prayer water.", specs: "Material: Copper | 500ml", image: "/bronze-lota.png", rating: 4.9, reviews: 210, price: 899, mrp: 1299 }
  ], "pooja-collection"),
  "brass-cookware": generateMock([
    { id: 201, name: "Royal Brass Cookware Kadai", description: "Traditional solid brass cooking vessel.", specs: "Material: Brass | 2.5 Litre", image: "/bronze-kadai.png", rating: 4.8, reviews: 54, price: 2899, mrp: 3599 },
    { id: 202, name: "Artisan Brass Patila Pot", description: "Deep-bottom brass pot for milk and curries.", specs: "Capacity: 2 Litres", image: "/bronze-hero.png", rating: 4.6, reviews: 32, price: 3599, mrp: 4299 }
  ], "brass-cookware"),
  "copper-products": generateMock([
    { id: 301, name: "Ayurvedic Pure Copper Water Bottle", description: "Joint-less pure copper leakproof water bottle.", specs: "Capacity: 1 Litre", image: "/bronze-lota.png", rating: 4.9, reviews: 342, price: 999, mrp: 1399 },
    { id: 302, name: "Traditional Copper Hammered Jug Set", description: "Elegant copper jug with matching glasses.", specs: "1 Jug + 2 Glasses", image: "/collection-tableware.png", rating: 4.7, reviews: 118, price: 1899, mrp: 2499 }
  ], "copper-products"),
  "steel-essentials": generateMock([
    { id: 401, name: "Premium Tri-Ply Stainless Steel Frypan", description: "High-grade tri-ply stainless steel skillet.", specs: "Diameter: 24cm", image: "/collection-tableware.png", rating: 4.8, reviews: 93, price: 1499, mrp: 1999 },
    { id: 402, name: "Durable Steel Storage Containers", description: "Airtight modular kitchen container set.", specs: "Set of 3 Containers", image: "/bronze-kadai.png", rating: 4.6, reviews: 45, price: 799, mrp: 1099 }
  ], "steel-essentials"),
  "dinner-sets": generateMock([
    { id: 501, name: "Vedic Bronze Thali Dinner Set", description: "Traditional pure bronze dinner set.", specs: "Kansa / Bronze | 6 Pieces", image: "/collection-tableware.png", rating: 4.9, reviews: 156, price: 4999, mrp: 5999 },
    { id: 502, name: "Royal Brass Dinner Set", description: "Exquisite solid brass design dinner set.", specs: "Brass | 5 Pieces", image: "/collection-tableware.png", rating: 4.8, reviews: 78, price: 3899, mrp: 4599 }
  ], "dinner-sets")
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
  const { convertPrice, convertWeight, getRawPrice, formatPrice } = useRegion();
  const { addToWishlist, isInWishlist } = useWishlist();
 
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [material, setMaterial] = useState(initialMaterial);
  const [sort, setSort] = useState(initialSort);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
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
          if (data && data.length > 0) {
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
        
        let finalData = data;
        
        // Inject mock data if database is empty, but only on the first page
        if (data.length === 0 && isInitial) {
          if (category && mockDataMap[category]) {
            finalData = mockDataMap[category];
          } else if (!category) {
            finalData = Object.values(mockDataMap).flat().slice(0, BATCH_SIZE);
          }

          // Filter mock data by material to match active filters
          if (material) {
            finalData = finalData.filter((p: any) => p.material?.toLowerCase() === material.toLowerCase());
          }

          // Filter mock data by search query to match active filters
          if (search) {
            finalData = finalData.filter((p: any) => 
              p.name.toLowerCase().includes(search.toLowerCase()) || 
              p.description.toLowerCase().includes(search.toLowerCase())
            );
          }
        }

        if (isInitial) {
          setProducts(finalData);
        } else {
          setProducts((prev) => [...prev, ...finalData]);
        }
        
        if (finalData.length < BATCH_SIZE) {
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
                          <span itemProp="name">{category.replace(/-/g, " ")}</span>
                        </Link>
                      ) : (
                        <span itemProp="name" className="text-bronze-200 capitalize font-semibold">{category.replace(/-/g, " ")}</span>
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
            <p className="hidden sm:block text-xs sm:text-sm text-bronze-200/70 max-w-xl">
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

            {/* Mobile Filters and Sorting Row */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Filters Button (Visible on mobile/tablet only) */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-inner active:scale-95 cursor-pointer h-10"
              >
                <SlidersHorizontal size={12} className="text-bronze-300/60" />
                Filters
              </button>

              {/* Mobile Sort Trigger (Only visible on lg:hidden) */}
              <button
                type="button"
                onClick={() => setSortOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-inner active:scale-95 cursor-pointer h-10"
              >
                <ArrowUpDown size={12} className="text-bronze-300/60 shrink-0" />
                {sort === "best-sellers" && "Best Sellers"}
                {sort === "rating" && "Top Rated"}
                {sort === "price-low-high" && "Price: Low-High"}
                {sort === "price-high-low" && "Price: High-Low"}
                {sort === "" && "Sort By"}
              </button>

              {/* Desktop Sorting Select (Only visible on lg:flex) */}
              <div className="hidden lg:flex flex-initial items-center gap-2 bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-full text-xs text-bronze-200 transition-all shadow-inner h-10 justify-center">
                <ArrowUpDown size={12} className="text-bronze-300/60 shrink-0" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer text-white text-xs appearance-none pr-4 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.5rem_auto] bg-[right_0.1rem_center] bg-no-repeat w-full text-center"
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
              <div className="flex flex-col items-center justify-center py-20 w-full min-h-[300px] bg-surface-card border border-border/60 rounded-3xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bronze-500 mb-3" />
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Fetching Crafted Items...</span>
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6">
                {products.map((product) => {
                  const rawMrp = getRawPrice(product.mrp, product, true);
                  const rawPrice = getRawPrice(product.price, product, false);
                  const savedAmount = Math.max(0, rawMrp - rawPrice);

                  return (
                    <div
                      key={product.id}
                      onClick={() => router.push(`/product/${product.slug || product.id}`)}
                      className="group bg-surface-card border border-bronze-500/[0.12] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col justify-between cursor-pointer will-change-transform transform-gpu"
                    >
                      <Link href={`/product/${product.slug || product.id}`} className="relative aspect-square block bg-orange-50/50 dark:bg-white/5 overflow-hidden">
                        {product.discount > 0 && (
                          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-emerald-500 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded sm:rounded-md">
                            {product.discount}% OFF
                          </span>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToWishlist(product);
                          }}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-border/60 hover:text-red-500 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                          title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart size={12} fill={isInWishlist(product.id) ? "currentColor" : "none"} className={isInWishlist(product.id) ? "text-red-500" : "text-muted"} />
                        </button>
                        
                        <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded sm:rounded-md capitalize">
                          {product.category?.name || product.categoryName?.replace(/-/g, " ") || "Premium"}
                        </span>

                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="eager"
                        />
                      </Link>

                      <div className="p-2.5 sm:p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-[8px] sm:text-xs text-muted mb-1 flex-wrap">
                            <div className="flex items-center gap-0.5 bg-emerald-600 text-white px-1 py-0.5 rounded text-[8px] sm:text-[9px] font-bold shrink-0">
                              <span>{product.rating}</span>
                              <Star size={7} fill="currentColor" className="stroke-none" />
                            </div>
                            <span className="shrink-0">({product.reviews})</span>
                            {product.material && (
                              <>
                                <span className="text-bronze-500 font-semibold">•</span>
                                <span className="font-semibold text-bronze-700 dark:text-bronze-300 truncate max-w-[50px]">{product.material}</span>
                              </>
                            )}
                          </div>

                          <Link href={`/product/${product.slug || product.id}`}>
                            <h3 className="text-xs sm:text-base font-bold text-heading hover:text-bronze-500 transition-colors line-clamp-2 min-h-[2.4em] sm:min-h-0 mb-1">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-baseline gap-1 sm:gap-1.5 mb-1.5 flex-wrap">
                            <span className="text-sm sm:text-base font-bold text-heading">{convertPrice(product.price, product, false)}</span>
                            {rawMrp > rawPrice && (
                              <>
                                <span className="text-[10px] sm:text-xs text-muted line-through">{convertPrice(product.mrp, product, true)}</span>
                                <span className="text-[8px] sm:text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block sm:inline">
                                  Save {formatPrice(savedAmount)}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-medium border-t border-border pt-2 mb-3">
                            <span className="flex items-center gap-0.5 sm:gap-1 text-bronze-800 dark:text-bronze-400">
                              <ShieldCheck size={10} />
                              100% Export
                            </span>
                            
                            {product.stock <= 5 ? (
                              <span className="text-red-500 font-bold animate-pulse">
                                Only {product.stock} left
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                In Stock
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 w-full mt-auto">
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, 1);
                            }}
                            className="p-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl border border-bronze-500 text-bronze-500 dark:text-bronze-400 hover:bg-bronze-500/10 transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0"
                            title="Add to Cart"
                          >
                            <ShoppingCart size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              try {
                                const res = await fetch("/api/auth/me");
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.authenticated) {
                                    window.location.href = `/checkout?productId=${product.id}`;
                                  } else {
                                    window.location.href = `/profile?redirect=${encodeURIComponent(window.location.pathname)}&reason=inquiry`;
                                  }
                                } else {
                                  window.location.href = `/checkout?productId=${product.id}`;
                                }
                              } catch (err) {
                                window.location.href = `/checkout?productId=${product.id}`;
                              }
                            }}
                            className="flex-grow inline-flex items-center justify-center gap-1 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-bold transition-all duration-300 text-[10px] sm:text-xs active:scale-[0.97] cursor-pointer text-center"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
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
              className="fixed inset-0 bg-black z-[200]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-surface-card z-[200] p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h2 className="text-base font-bold text-heading">Filter Options</h2>
                  <button onClick={() => setSidebarOpen(false)} className="text-xs font-semibold text-muted hover:text-heading">
                    Close
                  </button>
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

      {/* Slide-up Bottom Sheet for Mobile Sorting */}
      <AnimatePresence>
        {sortOpen && (
          <>
            {/* Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSortOpen(false)}
              className="fixed inset-0 bg-black z-[9999]"
            />
            {/* Bottom Sheet Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border rounded-t-3xl z-[10000] px-6 pt-5 pb-8 shadow-2xl space-y-4"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1 bg-muted/45 rounded-full mx-auto mb-2" />

              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <h3 className="text-sm font-bold text-heading">Sort Products By</h3>
                <button 
                  onClick={() => setSortOpen(false)} 
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 cursor-pointer"
                >
                  Done
                </button>
              </div>

              {/* Sorting List Rows */}
              <div className="space-y-1">
                {[
                  { value: "", label: "Default / Featured" },
                  { value: "best-sellers", label: "Best Sellers" },
                  { value: "rating", label: "Top Rated" },
                  { value: "price-low-high", label: "Price: Low to High" },
                  { value: "price-high-low", label: "Price: High to Low" },
                ].map((option) => {
                  const isActive = sort === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between py-3.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold"
                          : "text-body hover:bg-surface border border-transparent"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isActive && <span className="text-orange-500 text-xs font-black">✔</span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </div>
  );
};
