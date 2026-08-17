"use client";

import React from "react";
import { Clock, XCircle, FileText, Loader2, Sparkles, X } from "lucide-react";

interface AddProductTabProps {
  vendor: any;
  router: any;
  handleCreateProduct: (e: React.FormEvent) => void;
  productForm: any;
  setProductForm: React.Dispatch<React.SetStateAction<any>>;
  addCustomSpecRow: (isEdit: boolean) => void;
  updateCustomSpecRow: (index: number, field: "label" | "value", val: string, isEdit: boolean) => void;
  removeCustomSpecRow: (index: number, isEdit: boolean) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  handleGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => void;
  uploadingGallery: boolean;
  removeGalleryImage: (index: number, isEdit: boolean) => void;
  handleAiGenerate: (isEdit: boolean) => void;
  generatingAi: boolean;
  selectedCountryToAdd: string;
  setSelectedCountryToAdd: (val: string) => void;
  currencyDatabase: Record<string, { c: string; s: string }>;
  loadingCategories: boolean;
  dbCategories: any[];
  listingProduct: boolean;
  aiSeoData?: any;
  products: any[];
  compressionLogs?: Array<{ name: string; original: string; compressed: string; saved: number }>;
}

export default function AddProductTab({
  vendor,
  router,
  handleCreateProduct,
  productForm,
  setProductForm,
  addCustomSpecRow,
  updateCustomSpecRow,
  removeCustomSpecRow,
  handleFileUpload,
  uploading,
  handleGalleryUpload,
  uploadingGallery,
  removeGalleryImage,
  handleAiGenerate,
  generatingAi,
  selectedCountryToAdd,
  setSelectedCountryToAdd,
  currencyDatabase,
  loadingCategories,
  dbCategories,
  listingProduct,
  aiSeoData,
  products,
  compressionLogs = []
}: AddProductTabProps) {
  const [bundleSearch, setBundleSearch] = React.useState("");

  return (
    <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md animate-in fade-in duration-300 relative">
      {vendor?.vendorStatus !== "APPROVED" ? (
        <div className="p-12 max-w-2xl mx-auto text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
            vendor?.vendorStatus === "IN_REVIEW" ? "bg-blue-500/10 text-blue-500" :
            vendor?.vendorStatus === "REJECTED" ? "bg-red-500/10 text-red-500" :
            "bg-orange-500/10 text-orange-500"
          }`}>
            {vendor?.vendorStatus === "IN_REVIEW" ? <Clock size={40} /> : 
             vendor?.vendorStatus === "REJECTED" ? <XCircle size={40} /> : 
             <FileText size={40} />}
          </div>
          <h2 className="text-2xl font-bold text-heading mb-3">
            {vendor?.vendorStatus === "IN_REVIEW" ? "Profile Under Review" : 
             vendor?.vendorStatus === "REJECTED" ? "Profile Rejected" : 
             "Profile Completion Required"}
          </h2>
          <p className="text-muted mb-8">
            {vendor?.vendorStatus === "IN_REVIEW" 
              ? "Your KYC documents are currently being reviewed by the admin team. You will be able to add products once approved." 
              : "You must complete your vendor KYC verification and get approved by the admin before you can add products to the marketplace."}
          </p>
          {vendor?.vendorStatus === "REJECTED" && vendor?.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-left inline-block">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Reason for Rejection</p>
              <p className="text-sm text-red-400">{vendor.rejectionReason}</p>
            </div>
          )}
          <button 
            onClick={() => router.push("/vendor/profile")} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
          >
            Go to Vendor Profile
          </button>
        </div>
      ) : (
        <>
          <div className="w-full bg-surface-card border border-border/80 rounded-3xl p-8 md:p-10 shadow-md animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold font-display text-heading tracking-tight">Add New Product</h2>
              <p className="text-xs text-muted mt-1">Fill in the details below to list your handcrafted product on StopShop</p>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted uppercase tracking-wider">Item Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Pure Copper Hammered Water Dispenser"
                  className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Weight Field with Value Input + Unit Selector */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Weight (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productForm.weightValue}
                      onChange={(e) => setProductForm({ ...productForm, weightValue: e.target.value })}
                      placeholder="e.g. 1.5 or 500"
                      className="flex-1 bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                    />
                    <select
                      value={productForm.weightUnit}
                      onChange={(e) => setProductForm({ ...productForm, weightUnit: e.target.value })}
                      className="w-20 bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-2 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-6 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.4rem_center] bg-no-repeat"
                    >
                      <option value="Kg">Kg</option>
                      <option value="Gm">Gm</option>
                      <option value="Ton">Ton</option>
                      <option value="Lbs">Lbs</option>
                    </select>
                  </div>
                </div>

                {/* Pieces Count Input Box */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Pieces Count (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    onKeyDown={(e) => ["-", "+", "e", "E", "."].includes(e.key) && e.preventDefault()}
                    value={productForm.piecesValue}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setProductForm({ ...productForm, piecesValue: e.target.value === "" ? "" : val.toString() });
                    }}
                    placeholder="e.g. 3"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>

                {/* Combo Details Input Box */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Combo Details (Optional)</label>
                  <input
                    type="text"
                    value={productForm.combo}
                    onChange={(e) => setProductForm({ ...productForm, combo: e.target.value })}
                    placeholder="e.g. Combo Pack or Gift Set"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Capacity Field */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Capacity (Optional)</label>
                  <input
                    type="text"
                    value={productForm.capacity}
                    onChange={(e) => setProductForm({ ...productForm, capacity: e.target.value })}
                    placeholder="e.g. 2 Litres, 500 ml"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>

                {/* Thickness / Gauge Field */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Thickness / Gauge (Optional)</label>
                  <input
                    type="text"
                    value={productForm.thickness}
                    onChange={(e) => setProductForm({ ...productForm, thickness: e.target.value })}
                    placeholder="e.g. 12 Gauge, 3mm"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>

                {/* Finish / Coating Field */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Finish / Coating (Optional)</label>
                  <select
                    value={productForm.finish}
                    onChange={(e) => setProductForm({ ...productForm, finish: e.target.value })}
                    className="w-full bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                  >
                    <option value="">No Coating / Natural</option>
                    <option value="Tin Coated (Kalai)">Tin Coated (Kalai)</option>
                    <option value="Mirror Polished">Mirror Polished</option>
                    <option value="Hammered Matte">Hammered Matte</option>
                    <option value="Brass Polish">Brass Polish</option>
                  </select>
                </div>
              </div>

              {/* Separate Custom Specification Section */}
              <div className="p-4 bg-surface border border-border rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Custom Specifications (Optional)</span>
                  <button
                    type="button"
                    onClick={() => addCustomSpecRow(false)}
                    className="text-[10px] text-orange-500 hover:text-orange-600 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + Add More
                  </button>
                </div>
                <div className="space-y-3">
                  {productForm.customSpecs.map((spec: any, index: number) => (
                    <div key={index} className="flex gap-3 items-end bg-surface-card border border-border p-3 rounded-xl relative group">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-muted/80 uppercase tracking-wider text-[9px]">Spec Name / Label</label>
                          <span className="text-[8px] text-muted">{spec.label.length}/15</span>
                        </div>
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => updateCustomSpecRow(index, "label", e.target.value, false)}
                          placeholder="e.g. Weight"
                          maxLength={15}
                          className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-3 py-1.5 text-heading focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-muted/80 uppercase tracking-wider text-[9px]">Spec Value</label>
                          <span className="text-[8px] text-muted">{spec.value.length}/15</span>
                        </div>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateCustomSpecRow(index, "value", e.target.value, false)}
                          placeholder="e.g. 1.5 Kg"
                          maxLength={15}
                          className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-3 py-1.5 text-heading focus:outline-none"
                        />
                      </div>
                      {productForm.customSpecs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCustomSpecRow(index, false)}
                          className="p-2 text-muted hover:text-red-500 bg-surface hover:bg-red-500/5 rounded-lg border border-border transition-colors cursor-pointer"
                          title="Remove this specification"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="font-bold text-muted uppercase tracking-wider">Product Image *</label>
                <div className="flex items-center gap-4 border border-dashed border-border p-4 rounded-xl bg-surface">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="inline-flex items-center justify-center px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl cursor-pointer font-semibold transition-all"
                    >
                      {uploading ? "Uploading..." : "Choose Image File"}
                    </label>
                    <p className="text-[10px] text-muted mt-1">PNG, JPG, or WEBP. Max size 5MB.</p>
                  </div>
                  {productForm.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border relative">
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Gallery Images */}
              <div className="space-y-1">
                <label className="font-bold text-muted uppercase tracking-wider">Product Gallery / Additional Images (Thumbnails)</label>
                <div className="border border-dashed border-border p-4 rounded-xl bg-surface">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleGalleryUpload(e, false)}
                      className="sr-only"
                      id="product-gallery-upload"
                    />
                    <label
                      htmlFor="product-gallery-upload"
                      className="inline-flex items-center justify-center px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl cursor-pointer font-semibold transition-all text-xs"
                    >
                      {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
                    </label>
                    <p className="text-[10px] text-muted">Upload multiple images for thumbnails. Max size 5MB each.</p>
                  </div>
                  {productForm.images && productForm.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-4">
                      {productForm.images.map((img: string, idx: number) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                          <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx, false)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Live WebP Compression Stats UI Banner */}
              {compressionLogs.length > 0 && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      ⚡ Browser WebP Compressor (Auto Convert & Zero Quality Loss)
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono uppercase">
                      Active
                    </span>
                  </div>
                  <div className="space-y-1">
                    {compressionLogs.map((log, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] font-mono text-muted bg-surface/80 px-3 py-1.5 rounded-xl border border-border/60">
                        <span className="truncate max-w-[140px] sm:max-w-[200px] font-medium text-heading">{log.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-red-400 line-through text-[10px]">{log.original}</span>
                          <span className="text-muted">➔</span>
                          <span className="text-emerald-500 font-bold">{log.compressed}</span>
                          <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            -{log.saved}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-muted uppercase tracking-wider">Product Description *</label>
                  <button
                    type="button"
                    onClick={() => handleAiGenerate(false)}
                    disabled={generatingAi || !productForm.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {generatingAi ? "✨ Generating..." : "✨ AI Generate"}
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe your metal item, how it was hand-beaten, health values, etc... or click ✨ AI Generate"
                  className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Standard Price (INR) *</label>
                  <input
                    type="number"
                    required
                    readOnly
                    value={productForm.price}
                    placeholder="Auto-calculated"
                    className="w-full bg-surface-hover cursor-not-allowed opacity-80 border border-border rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none"
                  />
                  <span className="text-[10px] text-orange-500/90 mt-1 block font-bold">
                    Final Price: {productForm.price ? `₹${parseFloat(productForm.price).toLocaleString()} INR` : "₹0 INR"}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">MRP / Retail Price</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                    required
                    value={productForm.mrp}
                    onChange={(e) => {
                      const rawVal = Math.max(0, parseFloat(e.target.value) || 0);
                      const newMrp = e.target.value === "" ? "" : rawVal.toString();
                      const mrpVal = parseFloat(newMrp);
                      const discountVal = parseFloat(productForm.discount) || 0;
                      let newPrice = newMrp;
                      if (!isNaN(mrpVal)) {
                        newPrice = Math.round(mrpVal - (mrpVal * discountVal) / 100).toString();
                      }
                      setProductForm({ ...productForm, mrp: newMrp, price: newPrice });
                    }}
                    placeholder="3000"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                  <span className="text-[10px] text-muted mt-1 block">Maximum printed retail price (before discounts).</span>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                    value={productForm.discount}
                    onChange={(e) => {
                      const rawVal = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                      const newDiscount = e.target.value === "" ? "" : rawVal.toString();
                      const discountVal = parseFloat(newDiscount) || 0;
                      const mrpVal = parseFloat(productForm.mrp);
                      let newPrice = productForm.price;
                      if (!isNaN(mrpVal)) {
                        newPrice = Math.round(mrpVal - (mrpVal * discountVal) / 100).toString();
                      }
                      setProductForm({ ...productForm, discount: newDiscount, price: newPrice });
                    }}
                    placeholder="0"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                  <span className="text-[10px] text-muted mt-1 block">Percentage cut off from the printed MRP.</span>
                </div>
              </div>

              {/* Custom Regional Pricing Grid */}
              <div className="p-5 bg-surface border border-border rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
                  <div>
                    <span className="text-xs font-bold text-heading uppercase tracking-wider block">Custom Regional Retail Prices & Discounts</span>
                    <p className="text-[10px] text-muted mt-0.5">Define unique country MRPs and regional discounts (falls back to global discount if empty).</p>
                  </div>
                  
                  {/* Dropdown to dynamically add countries */}
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectedCountryToAdd}
                      onChange={(e) => setSelectedCountryToAdd(e.target.value)}
                      className="bg-surface border border-border hover:border-orange-500/40 rounded-xl px-3 py-1.5 text-xs font-semibold text-heading focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Add Country --</option>
                      {Object.keys(currencyDatabase)
                        .filter(code => code !== "IN" && !productForm.prices[code])
                        .map(code => {
                          let countryName = code;
                          try { countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; } catch(e){}
                          return (
                            <option key={code} value={code}>
                              {countryName} ({code}) - {currencyDatabase[code]?.c} ({currencyDatabase[code]?.s})
                            </option>
                          );
                        })
                      }
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCountryToAdd) {
                          setProductForm({
                            ...productForm,
                            prices: {
                              ...productForm.prices,
                              [selectedCountryToAdd]: { mrp: "", discount: "" }
                            }
                          });
                          setSelectedCountryToAdd("");
                        }
                      }}
                      className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {Object.keys(productForm.prices).length === 0 ? (
                  <p className="text-[10px] text-muted text-center py-4">No custom country prices added yet. Using standard INR exchange rates.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(productForm.prices).map((code) => {
                      const config = currencyDatabase[code] || { c: "USD", s: "$" };
                      return (
                        <div key={code} className="bg-surface-card p-4 rounded-xl border border-border space-y-3 relative group">
                          {/* Close / Remove button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...productForm.prices };
                              delete updated[code];
                              setProductForm({ ...productForm, prices: updated });
                            }}
                            className="absolute top-2.5 right-2.5 text-muted hover:text-red-500 transition-colors p-1"
                            title="Remove country pricing"
                          >
                            <X size={14} />
                          </button>

                          <div className="font-bold text-[11px] text-heading uppercase tracking-wider border-b border-border/60 pb-1.5">
                            <span>📍 {(()=>{try{return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;}catch(e){return code;}})()} - {config.c} ({config.s})</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-wider">MRP ({config.s})</label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                placeholder="Retail MRP"
                                value={productForm.prices[code]?.mrp || ""}
                                onChange={(e) => {
                                  const rawVal = Math.max(0, parseFloat(e.target.value) || 0);
                                  const cleanVal = e.target.value === "" ? "" : rawVal.toString();
                                  setProductForm({
                                    ...productForm,
                                    prices: {
                                      ...productForm.prices,
                                      [code]: { ...productForm.prices[code], mrp: cleanVal }
                                    }
                                  });
                                }}
                                className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-2.5 py-1.5 text-xs text-heading focus:outline-none"
                              />
                              {productForm.prices[code]?.mrp && !isNaN(parseFloat(productForm.prices[code]?.mrp)) && (
                                <span className="text-[9px] text-orange-500 block font-bold mt-1">
                                  {new Intl.NumberFormat(code === 'IN' ? 'en-IN' : 'en-US', { style: 'currency', currency: config.c }).format(parseFloat(productForm.prices[code].mrp))}
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Discount (%)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="any"
                                onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                placeholder="Optional"
                                value={productForm.prices[code]?.discount || ""}
                                onChange={(e) => {
                                  const rawVal = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                                  const cleanVal = e.target.value === "" ? "" : rawVal.toString();
                                  setProductForm({
                                    ...productForm,
                                    prices: {
                                      ...productForm.prices,
                                      [code]: { ...productForm.prices[code], discount: cleanVal }
                                    }
                                  });
                                }}
                                className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-2.5 py-1.5 text-xs text-heading focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Store Category *</label>
                  {loadingCategories ? (
                    <div className="flex items-center gap-2 h-10 px-4 bg-surface border border-border rounded-xl">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-orange-500" />
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Loading...</span>
                    </div>
                  ) : (
                    <select
                      value={productForm.categoryName}
                      onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value })}
                      className="w-full bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      {dbCategories.filter((cat: any) => !vendor?.allowedCategories || vendor.allowedCategories.split(',').map((c:string)=>c.trim()).includes(cat.slug)).map((cat: any) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Base Material *</label>
                  <select
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Copper">Copper</option>
                    <option value="Brass">Brass</option>
                    <option value="Steel">Steel</option>
                    <option value="Ceramic">Ceramic</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Stock Available *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    onKeyDown={(e) => ["-", "+", "e", "E", "."].includes(e.key) && e.preventDefault()}
                    required
                    value={productForm.stock}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setProductForm({ ...productForm, stock: e.target.value === "" ? "" : val.toString() });
                    }}
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>

              </div>

              {/* Bundle / Cross-Sell Configuration */}
              <div className="p-4 bg-surface border border-bronze-500/20 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎁</span>
                  <div>
                    <h3 className="font-bold text-heading">Bundle Configuration (Optional)</h3>
                    <p className="text-[10px] text-muted">Select products to bundle with this item to offer a discount.</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <label className="font-bold text-muted uppercase tracking-wider text-[10px]">Select Bundle Items</label>
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      value={bundleSearch}
                      onChange={(e) => setBundleSearch(e.target.value)}
                      className="text-xs bg-surface border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500 w-48"
                    />
                  </div>
                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                    {products.length === 0 && <span className="text-xs text-muted">No other products available.</span>}
                    {products
                      .filter((p: any) => p.name !== productForm.name && p.name.toLowerCase().includes(bundleSearch.toLowerCase()))
                      .map((p: any) => {
                      const isSelected = productForm.crossSellIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setProductForm((prev: any) => {
                              const newIds = isSelected
                                ? prev.crossSellIds.filter((id: number) => id !== p.id)
                                : [...prev.crossSellIds, p.id];
                              return { ...prev, crossSellIds: newIds };
                            });
                          }}
                          className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/50"
                              : "bg-surface-card border-border hover:border-bronze-500/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface shrink-0 relative">
                              {p.image ? (
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-bronze-500/20 flex items-center justify-center">
                                  <span className="text-xs text-bronze-500">No Img</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-heading line-clamp-1">{p.name}</span>
                              <span className="text-[10px] text-muted font-medium">₹{p.price}</span>
                            </div>
                          </div>
                          
                          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                            isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "bg-surface border-border text-transparent"
                          }`}>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {productForm.crossSellIds.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="font-bold text-muted uppercase tracking-wider text-[10px]">Discount Type</label>
                      <select
                        value={productForm.bundleDiscountType}
                        onChange={(e) => setProductForm({ ...productForm, bundleDiscountType: e.target.value })}
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                      >
                        <option value="NONE">None</option>
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FLAT">Flat Amount (₹)</option>
                      </select>
                    </div>
                    {productForm.bundleDiscountType !== "NONE" && (
                      <div className="space-y-1">
                        <label className="font-bold text-muted uppercase tracking-wider text-[10px]">Discount Value</label>
                        <input
                          type="number"
                          min="0"
                          value={productForm.bundleDiscountValue}
                          onKeyDown={(e) => { if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault(); }}
                          onChange={(e) => {
                             let val = e.target.value;
                             if (val && Number(val) < 0) val = "0";
                             setProductForm({ ...productForm, bundleDiscountValue: val })
                          }}
                          placeholder={productForm.bundleDiscountType === "PERCENTAGE" ? "e.g. 10 (for 10%)" : "e.g. 500 (for ₹500 off)"}
                          className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ✨ Step 2: AI Assistant — Generate Copy & Google SEO Package */}
              <div className="p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-orange-500/30 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
                      <Sparkles size={16} />
                      <span>✨ AI Marketplace & SEO Copywriter</span>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      After filling Name, Specs, Price, and Material above, click below to auto-generate a high-converting description and Google Search preview!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAiGenerate(false)}
                    disabled={generatingAi}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 shrink-0 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {generatingAi ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    <span>{generatingAi ? "Analyzing Market & Writing..." : "✨ Optimize Title, Copy & SEO"}</span>
                  </button>
                </div>

                {aiSeoData && (
                  <div className="space-y-4 pt-3 border-t border-orange-500/20 animate-in fade-in duration-300">
                    {/* Concise Suggested Title Box */}
                    {aiSeoData.suggestedTitle && (
                      <div className="p-3.5 bg-surface rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">💡 AI Recommended Title (Concise for Shop Cards)</span>
                          <span className="text-xs font-bold text-heading mt-0.5 block">{aiSeoData.suggestedTitle}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProductForm({ ...productForm, name: aiSeoData.suggestedTitle })}
                          className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                        >
                          ✨ Apply to Item Name
                        </button>
                      </div>
                    )}

                    {/* Editable SEO Metadata Fields */}
                    <div className="p-4 bg-surface rounded-2xl border border-border space-y-3">
                      <h4 className="text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                        <span>🔍 Editable SEO Metadata Fields</span>
                        <span className="text-[10px] text-muted font-normal">(Auto-filled by AI, can be edited)</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">SEO Meta Title Tag (Max 60 chars)</label>
                          <input
                            type="text"
                            value={productForm.seoTitle ?? ""}
                            onChange={(e) => setProductForm({ ...productForm, seoTitle: e.target.value })}
                            placeholder="e.g. Pure Copper Hammered Bottle | 1L Ayurvedic | StopShop"
                            className="w-full bg-surface-card border border-border focus:border-orange-500 rounded-xl px-3 py-2 text-heading text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">SEO Meta Description (Max 160 chars)</label>
                          <textarea
                            rows={2}
                            value={productForm.seoDescription ?? ""}
                            onChange={(e) => setProductForm({ ...productForm, seoDescription: e.target.value })}
                            placeholder="Brief summary optimized for search clicks..."
                            className="w-full bg-surface-card border border-border focus:border-orange-500 rounded-xl px-3 py-2 text-heading text-xs focus:outline-none resize-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">Target Keywords (Comma separated)</label>
                          <input
                            type="text"
                            value={productForm.seoKeywords ?? ""}
                            onChange={(e) => setProductForm({ ...productForm, seoKeywords: e.target.value })}
                            placeholder="e.g. copper bottle, ayurvedic vessel, hammered water dispenser"
                            className="w-full bg-surface-card border border-border focus:border-orange-500 rounded-xl px-3 py-2 text-heading text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Google Search Result Live Preview Card */}
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-border/80 shadow-sm space-y-1.5">
                      <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Live Google Search Preview</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">stopshops.com</span>
                        <span>›</span>
                        <span>product</span>
                        <span>›</span>
                        <span className="truncate max-w-[150px]">{productForm.name?.toLowerCase().replace(/\s+/g, "-") || "item-slug"}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                        {productForm.seoTitle || productForm.name || "StopShop Product Title"}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                        {productForm.seoDescription || productForm.description || "Product description preview on search engine results."}
                      </p>
                      {productForm.seoKeywords && (
                        <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] font-bold text-muted">🏷️ Target Keywords:</span>
                          {productForm.seoKeywords.split(",").map((kw: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded text-[10px]">
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={listingProduct}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {listingProduct ? "Publishing..." : "List Crafted Item"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
