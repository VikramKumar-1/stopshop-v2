"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Star, ShieldCheck, ArrowLeft, Package, MapPin, CheckCircle2, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useRegion } from "@/context/RegionContext";

export default function PublicVendorShop({ params }: { params: { id: string } }) {
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Filter & Sort States
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeMaterial, setActiveMaterial] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const { convertPrice, formatPrice } = useRegion();

  const materials = [
    { name: "All Materials", value: "" },
    { name: "Bronze", value: "Bronze" },
    { name: "Copper", value: "Copper" },
    { name: "Brass", value: "Brass" },
    { name: "Steel", value: "Steel" },
    { name: "Ceramic", value: "Ceramic" },
    { name: "Glass", value: "Glass" },
  ];

  useEffect(() => {
    fetchVendorAndProducts();
  }, [params.id]);

  const fetchVendorAndProducts = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);

      let allProducts: any[] = [];
      let allCats: any[] = [];

      if (pRes.ok) {
        allProducts = await pRes.json();
      }
      if (cRes.ok) {
        allCats = await cRes.json();
        setCategories(allCats);
      }

      const vendorIdNum = parseInt(params.id);
      const vendorProducts = allProducts.filter((p: any) => p.vendorId === vendorIdNum || p.vendor?.id === vendorIdNum);
      setProducts(vendorProducts);

      if (vendorProducts.length > 0 && vendorProducts[0].vendor) {
        const vData = vendorProducts[0].vendor;
        setVendor(vData);
        if (typeof window !== "undefined" && vData.name) {
          const cleanSlug = vData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          if (cleanSlug) {
            window.history.replaceState(null, "", `/store/${cleanSlug}`);
          }
        }
      } else {
        setVendor({
          id: vendorIdNum,
          name: "StopShop Verified Artisan Store",
          location: "Moradabad, Uttar Pradesh, India",
          allowedCategories: ""
        });
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `/store/${vendorIdNum}`);
        }
      }
    } catch (err) {
      console.error("Error fetching vendor shop:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Determine permitted/allowed categories for this specific vendor
  const allowedCatSlugs = vendor?.allowedCategories
    ? vendor.allowedCategories.split(",").map((c: string) => c.trim()).filter(Boolean)
    : [];

  const permittedCategories = categories.filter((cat) => {
    if (allowedCatSlugs.length > 0) {
      return allowedCatSlugs.includes(cat.slug) || allowedCatSlugs.includes(cat.name);
    }
    // If no explicit allowedCategories, show categories where vendor has products
    return products.some((p) => p.category?.slug === cat.slug || p.categoryName === cat.slug);
  });

  // Filter and Sort logic
  let filteredProducts = products.filter((p) => {
    if (activeCategory && p.category?.slug !== activeCategory && p.categoryName !== activeCategory) {
      return false;
    }
    if (activeMaterial && p.material?.toLowerCase() !== activeMaterial.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  if (sort === "price-low-high") {
    filteredProducts.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
  } else if (sort === "price-high-low") {
    filteredProducts.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
  } else if (sort === "rating") {
    filteredProducts.sort((a, b) => (parseFloat(b.rating) || 4.8) - (parseFloat(a.rating) || 4.8));
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-16 pt-6 sm:pt-10">
      {/* Top Navigation */}
      <div className="bg-surface-card border-b border-border py-4 px-4 sm:px-8 relative z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-heading transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Marketplace</span>
          </Link>
          <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>Verified StopShop Artisan</span>
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Vendor Header Card */}
        <div className="bg-surface-card rounded-3xl p-6 sm:p-8 border border-border shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Store size={36} />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                Official Brand Store
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-heading font-display">
                {vendor?.name || "Verified Artisan Partner"}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted">
                <MapPin size={14} className="text-orange-500 shrink-0" />
                <span>{vendor?.location || "Moradabad, Uttar Pradesh, India"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-surface p-4 rounded-2xl border border-border/80 z-10 w-full md:w-auto justify-around">
            <div className="text-center">
              <span className="font-black text-heading text-sm sm:text-base block">{products.length}</span>
              <span className="text-[10px] text-muted font-bold block mt-0.5">Catalog Products</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-sm sm:text-base">
                <ShieldCheck size={16} />
                <span>Verified</span>
              </div>
              <span className="text-[10px] text-muted font-bold block mt-0.5">Quality Assured</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <span className="font-black text-heading text-sm sm:text-base block">Export</span>
              <span className="text-[10px] text-muted font-bold block mt-0.5">Global Packaging</span>
            </div>
          </div>
        </div>

        {/* Search Bar & Sort Bar Row (Exact UI matching Marketplace Catalog) */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-card p-4 rounded-2xl border border-border">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search in ${vendor?.name || "store"} catalog...`}
              className="w-full bg-surface border border-border hover:border-orange-500/50 focus:border-orange-500 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none text-heading placeholder-muted transition-all shadow-inner"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-full text-xs text-heading">
              <ArrowUpDown size={13} className="text-orange-500 shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-heading font-semibold text-xs pr-2"
              >
                <option value="">Default Sorting</option>
                <option value="best-sellers">Best Sellers</option>
                <option value="rating">Top Rated</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout (Sidebar + Product Grid) matching Product Catalog UI */}
        <div className="flex gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="w-72 shrink-0 hidden lg:block bg-surface-card border border-border rounded-2xl p-6 space-y-6 sticky top-24">
            {/* Vendor Permitted Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-heading uppercase tracking-wider">Permitted Categories</h3>
                {activeCategory && (
                  <button onClick={() => setActiveCategory("")} className="text-[10px] text-orange-500 font-bold hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveCategory("")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                    activeCategory === ""
                      ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                      : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                  }`}
                >
                  All ({products.length})
                </button>
                {permittedCategories.map((cat) => {
                  const count = products.filter(p => p.category?.slug === cat.slug || p.categoryName === cat.slug).length;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                        activeCategory === cat.slug
                          ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                          : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Supported Materials */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-heading uppercase tracking-wider">Materials</h3>
                {activeMaterial && (
                  <button onClick={() => setActiveMaterial("")} className="text-[10px] text-orange-500 font-bold hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {materials.map((mat) => (
                  <button
                    key={mat.value}
                    onClick={() => setActiveMaterial(mat.value)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                      activeMaterial === mat.value
                        ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                        : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                    }`}
                  >
                    {mat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-grow space-y-4">
            {/* Mobile Category & Material Filter Pills */}
            <div className="lg:hidden space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] font-bold text-muted uppercase shrink-0 mr-1">Categories:</span>
                <button
                  onClick={() => setActiveCategory("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    activeCategory === "" ? "bg-orange-500 text-white" : "bg-surface-card border border-border text-heading"
                  }`}
                >
                  All
                </button>
                {permittedCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                      activeCategory === cat.slug ? "bg-orange-500 text-white" : "bg-surface-card border border-border text-heading"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] font-bold text-muted uppercase shrink-0 mr-1">Materials:</span>
                {materials.map((mat) => (
                  <button
                    key={mat.value}
                    onClick={() => setActiveMaterial(mat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                      activeMaterial === mat.value ? "bg-orange-500 text-white" : "bg-surface-card border border-border text-heading"
                    }`}
                  >
                    {mat.name}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-surface-card rounded-3xl p-16 text-center border border-border">
                <Package size={48} className="mx-auto text-muted mb-3 opacity-50" />
                <h3 className="text-base font-bold text-heading">No matching products found</h3>
                <p className="text-xs text-muted mt-1">Try resetting your filters or search keywords.</p>
                {(activeCategory || activeMaterial || searchQuery) && (
                  <button
                    onClick={() => { setActiveCategory(""); setActiveMaterial(""); setSearchInput(""); setSearchQuery(""); }}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product) => {
                  const rawPrice = parseFloat(product.price) || 0;
                  const rawMrp = parseFloat(product.mrp) || 0;
                  const savedAmount = rawMrp - rawPrice;

                  return (
                    <div
                      key={product.id}
                      className="bg-surface-card rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                    >
                      <Link
                        href={`/product/${product.slug || product.id}`}
                        className="relative aspect-square w-full overflow-hidden bg-surface-hover block"
                      >
                        <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded sm:rounded-md capitalize">
                          {product.category?.name || product.categoryName?.replace(/-/g, " ") || "Artisan"}
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
                              <span>{product.rating || "4.8"}</span>
                              <Star size={7} fill="currentColor" className="stroke-none" />
                            </div>
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
                              Artisan Verified
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/product/${product.slug || product.id}`}
                          className="w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
