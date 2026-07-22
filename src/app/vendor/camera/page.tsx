"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Package, RefreshCcw, Plus, ArrowLeft, CheckCircle2, Loader2, Upload, AlertCircle, Sparkles, Image as ImageIcon, ShieldCheck, X } from "lucide-react";
import { compressImageToWebP } from "@/lib/imageCompressor";

export default function VendorCameraHubPage() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<"add-product" | "dispatch" | "return-qc">("add-product");
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==================== MODE 1: ADD PRODUCT FORM STATES ====================
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodMrp, setProdMrp] = useState("");
  const [prodStock, setProdStock] = useState("10");
  const [prodCategory, setProdCategory] = useState("");
  const [prodMaterial, setProdMaterial] = useState("Brass");
  const [prodImage, setProdImage] = useState("");
  const [prodGallery, setProdGallery] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [lastCompressedStats, setLastCompressedStats] = useState<string | null>(null);

  // ==================== MODE 2: DISPATCH PACKING STATES ====================
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [packingImages, setPackingImages] = useState<string[]>([]);
  const [uploadingPacking, setUploadingPacking] = useState(false);
  const [submittingDispatch, setSubmittingDispatch] = useState(false);

  // ==================== MODE 3: RETURN QC STATES ====================
  const [returns, setReturns] = useState<any[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
  const [qcImages, setQcImages] = useState<string[]>([]);
  const [qcNotes, setQcNotes] = useState("");
  const [uploadingQc, setUploadingQc] = useState(false);
  const [submittingQc, setSubmittingQc] = useState(false);

  useEffect(() => {
    fetchVendorAuth();
  }, []);

  const fetchVendorAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/me");
      const data = await res.json();
      if (res.ok && data.vendor) {
        setVendor(data.vendor);
        fetchCategories();
        fetchOrdersAndReturns();
      } else {
        router.push("/vendor/login");
      }
    } catch (err) {
      console.error(err);
      router.push("/vendor/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {}
  };

  const fetchOrdersAndReturns = async () => {
    try {
      const [ordRes, retRes] = await Promise.all([
        fetch("/api/vendor/orders"),
        fetch("/api/vendor/returns")
      ]);
      if (ordRes.ok) {
        const oData = await ordRes.json();
        setOrders(oData.orders || []);
      }
      if (retRes.ok) {
        const rData = await retRes.json();
        setReturns(rData.returns || []);
      }
    } catch (e) {}
  };

  // 📸 Handlers: Add Product Camera Uploads
  const handleSnapMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingMain(true);
    showToast(`⚡ Compressing photo to WebP...`, "info");

    try {
      const comp = await compressImageToWebP(rawFile);
      setLastCompressedStats(`${comp.originalSizeFormatted} ➔ ${comp.compressedSizeFormatted} (${comp.savedPercentage}% saved)`);

      const formData = new FormData();
      formData.append("file", comp.file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        setProdImage(data.url);
        showToast(`✨ WebP Photo ready! Saved ${comp.savedPercentage}%`, "success");
      } else {
        showToast("Upload failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Camera upload error", "error");
    } finally {
      setUploadingMain(false);
    }
  };

  const handleSnapGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (rawFile) => {
        const comp = await compressImageToWebP(rawFile);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setProdGallery(prev => [...prev, ...urls]);
      showToast("⚡ Gallery photos snapped & compressed!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload gallery photo", "error");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return showToast("Product name is required", "error");
    if (!prodPrice || parseFloat(prodPrice) <= 0) return showToast("Valid price is required", "error");
    if (!prodImage) return showToast("Please snap or select a main product photo", "error");

    setSubmittingProduct(true);
    try {
      const payload = {
        name: prodName.trim(),
        price: parseFloat(prodPrice),
        mrp: prodMrp ? parseFloat(prodMrp) : parseFloat(prodPrice) * 1.25,
        stock: parseInt(prodStock) || 10,
        categoryId: prodCategory ? parseInt(prodCategory) : categories[0]?.id || 1,
        material: prodMaterial,
        image: prodImage,
        images: prodGallery,
        vendorId: vendor.id,
        specs: JSON.stringify({ Material: prodMaterial, Origin: "Moradabad, India" })
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("🎉 Product published successfully!", "success");
        setProdName("");
        setProdPrice("");
        setProdMrp("");
        setProdImage("");
        setProdGallery([]);
        setLastCompressedStats(null);
      } else {
        showToast(data.error || "Failed to publish product", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Product creation error", "error");
    } finally {
      setSubmittingProduct(false);
    }
  };

  // 📦 Handlers: Dispatch Packing Camera Photos
  const handleSnapPackingPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPacking(true);
    try {
      if (packingImages.length + files.length > 8) throw new Error("Max 8 photos allowed");

      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (rawFile) => {
        const comp = await compressImageToWebP(rawFile);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setPackingImages(prev => [...prev, ...urls]);
      showToast("⚡ Packing photo compressed & added!", "success");
    } catch (err: any) {
      showToast(err.message || "Photo snap failed", "error");
    } finally {
      setUploadingPacking(false);
    }
  };

  const handleConfirmDispatch = async () => {
    if (!selectedOrder) return;
    if (packingImages.length < 5) return showToast("Please snap at least 5 packing photos", "error");

    setSubmittingDispatch(true);
    try {
      const res = await fetch("/api/vendor/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          dispatchImages: packingImages
        })
      });

      if (res.ok) {
        showToast("📦 Dispatch photos submitted & Order Dispatched!", "success");
        setSelectedOrder(null);
        setPackingImages([]);
        fetchOrdersAndReturns();
      } else {
        showToast("Failed to submit dispatch", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Dispatch error", "error");
    } finally {
      setSubmittingDispatch(false);
    }
  };

  // 🔄 Handlers: Return QC Inspection Photos
  const handleSnapQcPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingQc(true);
    try {
      if (qcImages.length + files.length > 8) throw new Error("Max 8 photos allowed");

      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (rawFile) => {
        const comp = await compressImageToWebP(rawFile);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setQcImages(prev => [...prev, ...urls]);
      showToast("⚡ Inspection photo compressed & added!", "success");
    } catch (err: any) {
      showToast(err.message || "QC photo snap failed", "error");
    } finally {
      setUploadingQc(false);
    }
  };

  const handleSubmitQcReport = async (action: "QC_PASS" | "QC_UPLOAD") => {
    if (!selectedReturn || !selectedReturn.returnRequest) return;
    if (action === "QC_UPLOAD" && qcImages.length < 5) {
      return showToast("Please snap at least 5 proof photos showing the issue", "error");
    }

    setSubmittingQc(true);
    try {
      const res = await fetch(`/api/returns/${selectedReturn.returnRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, qcImages, qcNotes })
      });

      if (res.ok) {
        showToast("🔄 QC Inspection submitted successfully!", "success");
        setSelectedReturn(null);
        setQcImages([]);
        setQcNotes("");
        fetchOrdersAndReturns();
      } else {
        showToast("Failed to submit QC report", "error");
      }
    } catch (e: any) {
      showToast(e.message || "QC error", "error");
    } finally {
      setSubmittingQc(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-orange-500 mb-3" size={32} />
        <p className="text-xs font-bold text-heading">Opening Vendor Mobile Camera Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-24 font-sans text-body">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 left-4 right-4 z-[9999] p-3.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-200 ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-heading text-surface"
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 font-bold text-sm">✕</button>
        </div>
      )}

      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-surface-card/90 backdrop-blur-md border-b border-border/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/vendor/dashboard")}
            className="p-2 rounded-xl bg-surface border border-border text-muted hover:text-heading cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-heading flex items-center gap-1.5 font-display">
              <Camera size={16} className="text-orange-500" />
              Camera Studio
            </h1>
            <p className="text-[10px] text-muted truncate max-w-[160px]">{vendor?.storeName || vendor?.name}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">
          ⚡ Mobile Cam
        </span>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-md mx-auto space-y-6">

        {/* MODE 1: ADD PRODUCT VIA CAMERA */}
        {activeMode === "add-product" && (
          <form onSubmit={handleCreateProductSubmit} className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-surface-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="text-sm font-bold text-heading flex items-center gap-2">
                  <Plus size={16} className="text-orange-500" />
                  Snap & Add New Product
                </h2>
                <span className="text-[10px] text-muted font-bold">Auto-WebP ⚡</span>
              </div>

              {/* Main Photo Camera Trigger */}
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                  1. Main Product Photo *
                </label>

                {prodImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-border h-48 bg-white flex items-center justify-center">
                    <img src={prodImage} alt="Product" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setProdImage("")}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-red-500 text-white font-bold text-xs shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-orange-500/40 rounded-2xl p-5 bg-orange-500/5 text-center space-y-2.5">
                    {/* Live Camera Button */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      id="cam-main-photo"
                      onChange={handleSnapMainImage}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cam-main-photo"
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {uploadingMain ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Compressing WebP...</span>
                        </>
                      ) : (
                        <>
                          <Camera size={18} />
                          <span>Snap Live Photo (Camera)</span>
                        </>
                      )}
                    </label>

                    {/* Phone Gallery Select Button */}
                    <input
                      type="file"
                      accept="image/*"
                      id="gallery-main-photo"
                      onChange={handleSnapMainImage}
                      className="sr-only"
                    />
                    <label
                      htmlFor="gallery-main-photo"
                      className="w-full py-2.5 bg-surface border border-border hover:border-orange-500 text-heading rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ImageIcon size={16} className="text-orange-500" />
                      <span>Choose from Phone Gallery</span>
                    </label>

                    <p className="text-[10px] text-muted">WebP Auto-Convert & Size Reduction</p>
                  </div>
                )}

                {/* Compression Status Stats Banner */}
                {lastCompressedStats && (
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 text-center bg-emerald-500/10 py-1 rounded-lg">
                    ✨ WebP Saved: {lastCompressedStats}
                  </p>
                )}
              </div>

              {/* Gallery Photos Camera & Phone Gallery Triggers */}
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                  2. Additional Gallery Photos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Camera Snap */}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    id="cam-gallery-photos"
                    onChange={handleSnapGalleryImage}
                    className="sr-only"
                  />
                  <label
                    htmlFor="cam-gallery-photos"
                    className="py-2.5 bg-surface border border-border hover:border-orange-500 rounded-xl font-bold text-xs text-heading flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {uploadingGallery ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} className="text-orange-500" />}
                    <span>Snap Camera</span>
                  </label>

                  {/* Gallery Select */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="phone-gallery-photos"
                    onChange={handleSnapGalleryImage}
                    className="sr-only"
                  />
                  <label
                    htmlFor="phone-gallery-photos"
                    className="py-2.5 bg-surface border border-border hover:border-orange-500 rounded-xl font-bold text-xs text-heading flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ImageIcon size={14} className="text-orange-500" />
                    <span>From Phone Gallery</span>
                  </label>
                </div>

                {/* Gallery Previews */}
                {prodGallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pt-3">
                    {prodGallery.map((img, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
                        <img src={img} alt="gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProdGallery(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    placeholder="e.g. Pure Brass Royal Kadai 2L"
                    className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={e => setProdPrice(e.target.value)}
                      placeholder="1299"
                      className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:border-orange-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">MRP Price (₹)</label>
                    <input
                      type="number"
                      value={prodMrp}
                      onChange={e => setProdMrp(e.target.value)}
                      placeholder="1999"
                      className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">Stock Units</label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={e => setProdStock(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">Category</label>
                    <select
                      value={prodCategory}
                      onChange={e => setProdCategory(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-heading focus:outline-none focus:border-orange-500"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Publish Button */}
              <button
                type="submit"
                disabled={submittingProduct}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submittingProduct ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>Publish Product to Store</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: DISPATCH PACKING CAMERA */}
        {activeMode === "dispatch" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Package size={14} className="text-orange-500" />
              Orders Ready for Packing Photos ({orders.filter(o => o.status === "PAID" || o.status === "PENDING").length})
            </h2>

            {selectedOrder ? (
              <div className="bg-surface-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                      Order #{selectedOrder.id}
                    </span>
                    <p className="text-xs font-bold text-heading mt-1">{selectedOrder.customerName || "Customer"}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedOrder(null); setPackingImages([]); }}
                    className="text-xs font-bold text-muted hover:text-heading"
                  >
                    Cancel
                  </button>
                </div>

                {/* Snap Camera Section */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-muted uppercase">
                    Snap 5 to 8 Mandatory Packing Photos *
                  </label>
                  <p className="text-[10px] text-muted">Take clear photos of item, bubble wrap, box, and shipping label.</p>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    id="cam-packing-photos"
                    onChange={handleSnapPackingPhotos}
                    className="sr-only"
                  />
                  <label
                    htmlFor="cam-packing-photos"
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {uploadingPacking ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                    <span>Snap Photo with Camera ({packingImages.length}/8)</span>
                  </label>
                </div>

                {/* Photos Grid */}
                {packingImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {packingImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                        <img src={img} alt="packing" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setPackingImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  disabled={submittingDispatch || packingImages.length < 5}
                  onClick={handleConfirmDispatch}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {submittingDispatch ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>Confirm & Mark Dispatched ({packingImages.length} Photos)</span>
                </button>
              </div>
            ) : (
              /* Order Selector List */
              <div className="space-y-2">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted font-bold bg-surface-card rounded-2xl border border-dashed border-border">
                    No pending orders to pack.
                  </div>
                ) : (
                  orders.map(ord => (
                    <div
                      key={ord.id}
                      onClick={() => { setSelectedOrder(ord); setPackingImages([]); }}
                      className="p-4 bg-surface-card border border-border/80 hover:border-orange-500/80 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                          Order #{ord.id}
                        </span>
                        <h4 className="text-xs font-bold text-heading mt-1">{ord.customerName || "Customer"}</h4>
                        <p className="text-[10px] text-muted">₹{ord.totalAmount} • {ord.items?.length || 1} items</p>
                      </div>
                      <span className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1">
                        <Camera size={12} /> Snap Photos
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 3: RETURN QC INSPECTION CAMERA */}
        {activeMode === "return-qc" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <RefreshCcw size={14} className="text-red-500" />
              Incoming Return Inspections ({returns.filter(r => r.status === "RETURN_RECEIVED" || r.status === "RETURN_APPROVED").length})
            </h2>

            {selectedReturn ? (
              <div className="bg-surface-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                      Return #{selectedReturn.id}
                    </span>
                    <p className="text-xs font-bold text-heading mt-1">{selectedReturn.reason || "Return Requested"}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedReturn(null); setQcImages([]); }}
                    className="text-xs font-bold text-muted hover:text-heading"
                  >
                    Cancel
                  </button>
                </div>

                {/* Snap Proof Photos */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-muted uppercase">
                    Snap Return QC Inspection Photos *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    id="cam-qc-photos"
                    onChange={handleSnapQcPhotos}
                    className="sr-only"
                  />
                  <label
                    htmlFor="cam-qc-photos"
                    className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {uploadingQc ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                    <span>Snap QC Inspection Photo ({qcImages.length}/8)</span>
                  </label>
                </div>

                {/* QC Photos Grid */}
                {qcImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {qcImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                        <img src={img} alt="qc" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setQcImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes Input */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">Inspection Notes</label>
                  <textarea
                    rows={2}
                    value={qcNotes}
                    onChange={e => setQcNotes(e.target.value)}
                    placeholder="Describe condition of received item..."
                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={submittingQc}
                    onClick={() => handleSubmitQcReport("QC_PASS")}
                    className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    Pass QC (Restock)
                  </button>
                  <button
                    disabled={submittingQc || qcImages.length < 5}
                    onClick={() => handleSubmitQcReport("QC_UPLOAD")}
                    className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-40"
                  >
                    Reject Return (Fake/Damaged)
                  </button>
                </div>
              </div>
            ) : (
              /* Return Selector List */
              <div className="space-y-2">
                {returns.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted font-bold bg-surface-card rounded-2xl border border-dashed border-border">
                    No pending returns to inspect.
                  </div>
                ) : (
                  returns.map(ret => (
                    <div
                      key={ret.id}
                      onClick={() => { setSelectedReturn(ret); setQcImages([]); }}
                      className="p-4 bg-surface-card border border-border/80 hover:border-red-500/80 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                          Return #{ret.id}
                        </span>
                        <h4 className="text-xs font-bold text-heading mt-1">{ret.reason || "Return Inquiry"}</h4>
                        <p className="text-[10px] text-muted">Status: {ret.status}</p>
                      </div>
                      <span className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1">
                        <Camera size={12} /> QC Snap
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Sticky Mobile Bottom Navigation Switcher */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card/95 backdrop-blur-xl border-t border-border/80 px-4 py-2 flex justify-around items-center">
        <button
          onClick={() => setActiveMode("add-product")}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeMode === "add-product" ? "text-orange-500 font-bold bg-orange-500/10" : "text-muted hover:text-heading"
          }`}
        >
          <Plus size={18} />
          <span className="text-[10px]">Add Product</span>
        </button>

        <button
          onClick={() => setActiveMode("dispatch")}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeMode === "dispatch" ? "text-orange-500 font-bold bg-orange-500/10" : "text-muted hover:text-heading"
          }`}
        >
          <Package size={18} />
          <span className="text-[10px]">Packing Cam</span>
        </button>

        <button
          onClick={() => setActiveMode("return-qc")}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeMode === "return-qc" ? "text-red-500 font-bold bg-red-500/10" : "text-muted hover:text-heading"
          }`}
        >
          <RefreshCcw size={18} />
          <span className="text-[10px]">Return QC</span>
        </button>
      </nav>
    </div>
  );
}
