"use client";

import React from "react";
import { Trash2 } from "lucide-react";

interface ProductsTabProps {
  productSearch: string;
  setProductSearch: (val: string) => void;
  products: any[];
  getUnitsSold: (id: number) => number;
  showToast: (msg: string, type?: any) => void;
  router: any;
  vendor: any;
  fetchData: (id: number) => void;
  openProductModal: (prod: any) => void;
  openEditModal: (prod: any) => void;
  handleDeleteProduct: (id: number) => void;
}

export default function ProductsTab({
  productSearch,
  setProductSearch,
  products,
  getUnitsSold,
  showToast,
  router,
  vendor,
  fetchData,
  openProductModal,
  openEditModal,
  handleDeleteProduct,
}: ProductsTabProps) {
  return (
    <div className="space-y-4">
      {/* Catalog Search Bar */}
      <div className="bg-surface-card border border-border/80 p-5 rounded-3xl flex justify-between items-center shadow-md">
        <input
          type="text"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder="Search catalog by ID (e.g. 12) or name..."
          className="w-full max-w-md bg-surface border border-border/60 focus:border-orange-500 rounded-2xl px-5 py-3 text-heading text-xs focus:outline-none transition-all duration-200 focus:shadow-sm focus:shadow-orange-500/5 placeholder:text-muted/60"
        />
      </div>

      <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
              <th className="p-4">ID</th>
              <th className="p-4">Craft Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Material</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Units Sold</th>
              <th className="p-4 text-center">Your Stock</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products
              .filter((prod) => {
                if (!productSearch) return true;
                const searchStr = productSearch.toLowerCase().trim();
                return (
                  prod.id.toString() === searchStr ||
                  prod.name.toLowerCase().includes(searchStr)
                );
              })
              .map((prod) => (
                <tr key={prod.id} className="hover:bg-orange-500/[0.03] transition-all duration-200 text-body group/row">
                  <td className="p-4">
                    <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold px-2.5 py-1 rounded-xl text-[10px] border border-orange-500/10">
                      #{prod.id}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-heading">{prod.name}</td>
                  <td className="p-4 uppercase">{prod.categoryName}</td>
                  <td className="p-4 font-semibold">{prod.material}</td>
                  <td className="p-4">₹{prod.price.toLocaleString()}</td>
                  <td className="p-4 text-center font-bold text-heading">
                    {getUnitsSold(prod.id)} units
                  </td>
                  <td className={`p-4 text-center font-bold ${prod.stock <= 5 ? "text-red-500" : "text-emerald-600"}`}>
                    {prod.stock}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={async () => {
                        const newActive = !prod.active;
                        try {
                          const res = await fetch(`/api/products/${prod.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ active: newActive }),
                          });
                          if (res.ok) {
                            showToast("Status updated successfully!", "success");
                            router.refresh();
                            if (vendor) fetchData(vendor.id);
                          } else {
                            showToast("Failed to update status", "error");
                          }
                        } catch (e) {
                          showToast("Error updating status", "error");
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-bold cursor-pointer border ${
                        prod.active !== false
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/25 hover:bg-red-500/20"
                      }`}
                      title="Click to toggle status"
                    >
                      {prod.active !== false ? "Live" : "Disabled"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openProductModal(prod)}
                        className="px-3 py-1.5 text-[10px] font-bold text-orange-500 border border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/5 rounded-xl transition-all duration-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(prod)}
                        className="px-3 py-1.5 text-[10px] font-bold text-blue-500 border border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/5 rounded-xl transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg"
                        aria-label="Remove product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
