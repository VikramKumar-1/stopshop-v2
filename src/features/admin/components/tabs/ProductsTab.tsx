"use client";
import React from "react";
import { Search } from "lucide-react";

export const ProductsTab = ({
  products,
  vendors,
  dbCategories,
  globalProductCategory,
  setGlobalProductCategory,
  globalProductMaterial,
  setGlobalProductMaterial,
  globalProductSearch,
  setGlobalProductSearch,
  selectedProducts,
  setSelectedProducts,
  selectedCategorySlug,
  setSelectedCategorySlug,
  handleAssignToHomepage,
  setModalProduct
}: any) => {
  const filteredProducts = products.filter((p: any) => {
    if (globalProductCategory && p.categoryName !== globalProductCategory) return false;
    if (globalProductMaterial && p.material !== globalProductMaterial) return false;
    if (globalProductSearch && !p.name.toLowerCase().includes(globalProductSearch.toLowerCase())) return false;
    return true;
  });

  const availableMaterials = ["Bronze", "Copper", "Brass", "Steel", "Ceramic", "Glass"];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
        <div className="bg-surface-card border border-border/80 rounded-3xl p-5 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent space-y-6">
          {/* Search */}
          <div>
            <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Search Products</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
              <input 
                type="text"
                placeholder="Search product name..."
                value={globalProductSearch}
                onChange={(e) => setGlobalProductSearch(e.target.value)}
                className="w-full bg-surface border border-border hover:border-border/80 focus:border-orange-500 focus:bg-surface-hover focus:ring-1 focus:ring-orange-500 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none text-heading placeholder-muted transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Categories</h3>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => setGlobalProductCategory("")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                  globalProductCategory === ""
                    ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                    : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                }`}
              >
                All Categories
              </button>
              {dbCategories.map((cat: any) => (
                <button 
                  key={cat.slug}
                  onClick={() => setGlobalProductCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                    globalProductCategory === cat.slug
                      ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                      : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Materials Filter */}
          <div>
            <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Materials</h3>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => setGlobalProductMaterial("")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                  globalProductMaterial === ""
                    ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                    : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                }`}
              >
                All Materials
              </button>
              {availableMaterials.map((mat: string) => (
                <button 
                  key={mat}
                  onClick={() => setGlobalProductMaterial(mat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                    globalProductMaterial === mat
                      ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                      : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Product Grid Area */}
      <div className="flex-1 min-w-0">
        {selectedProducts.length > 0 && (
          <div className="sticky top-4 z-40 bg-orange-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between mb-6 animate-in fade-in slide-in-from-top-4">
            <div className="font-bold">
              {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} Selected
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium">Assign to:</span>
              <select 
                value={selectedCategorySlug}
                onChange={e => setSelectedCategorySlug(e.target.value)}
                className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg outline-none font-bold"
              >
                <option value="" disabled>Select Section...</option>
                <option value="best-sellers">🔥 Best Sellers / Top Rated</option>
                {dbCategories.map((cat: any) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <button 
                onClick={handleAssignToHomepage}
                className="bg-slate-900 hover:bg-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                disabled={!selectedCategorySlug}
              >
                Save to Section
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-heading">Catalog ({filteredProducts.length} items)</h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-surface-card border border-border p-12 rounded-3xl text-center text-muted">
            No products match your filters.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.slice(0, 50).map((p: any) => {
                const vendor = vendors.find((v: any) => v.id === p.vendorId);
                const isSelected = selectedProducts.includes(p.id);
                return (
                  <div key={p.id} className={`bg-surface border ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-border hover:border-orange-500/50'} rounded-xl overflow-hidden group relative flex flex-col transition-all cursor-pointer`}>
                    {/* Checkbox for Selection */}
                    <div className="absolute top-2 left-2 z-20" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedProducts([...selectedProducts, p.id]);
                          else setSelectedProducts(selectedProducts.filter((id: any) => id !== p.id));
                        }}
                        className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 cursor-pointer shadow-sm border-2 border-white bg-white"
                      />
                    </div>

                    <div onClick={() => setModalProduct(p)} className="flex flex-col flex-grow">
                      <div className="h-40 relative overflow-hidden bg-surface-hover">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={p.name} />
                        {!p.active && <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-[2px]">HIDDEN</span>}
                      </div>
                      <div className="p-3 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <p className="text-xs font-bold text-heading truncate group-hover:text-orange-500 transition-colors" title={p.name}>{p.name}</p>
                        </div>
                        
                        <p className="text-[10px] font-bold text-blue-500 truncate mb-1">
                          Seller: <span className="text-muted">{vendors.find((v: any) => String(v.id) === String(p.vendorId))?.name || "Admin"}</span>
                        </p>

                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
                          <p className="text-xs font-black text-emerald-500">₹{p.price.toLocaleString()}</p>
                          {p.stock <= 5 ? (
                            <p className="text-[10px] font-bold text-red-500">Only {p.stock} left</p>
                          ) : (
                            <p className="text-[10px] text-muted">{p.stock} in stock</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredProducts.length > 50 && (
              <div className="mt-6 text-center text-xs text-muted font-bold bg-surface p-3 rounded-lg border border-border">
                Showing top 50 results. Use the search bar to find specific products out of {filteredProducts.length}.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
