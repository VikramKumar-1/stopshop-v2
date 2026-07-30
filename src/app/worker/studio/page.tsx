"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Package, RefreshCcw, Plus, ArrowLeft, CheckCircle2, Loader2, Upload, AlertCircle, Sparkles, Image as ImageIcon, ShieldCheck, ShieldAlert, X, Search, ScanLine, LogOut } from "lucide-react";
import BarcodeScanner from "@/features/vendor/components/BarcodeScanner";
import { compressImageToWebP } from "@/lib/imageCompressor";

export default function VendorCameraHubPage() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<"dispatch" | "return-qc">("dispatch");
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [workerVendorId, setWorkerVendorId] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==================== LIVE WEBCAM / MOBILE IN-APP CAMERA STATES ====================
  const [showLiveCameraModal, setShowLiveCameraModal] = useState(false);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; index: number; type: "packing" | "qc" } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startLiveCamera = async (overrideFacing?: "environment" | "user") => {
    const mode = overrideFacing || facingMode;
    setShowLiveCameraModal(true);
    try {
      // Reuse existing active stream if available so mobile browser NEVER prompts permission twice!
      if (liveStream && liveStream.active && !overrideFacing) {
        // Enable video tracks if paused
        liveStream.getVideoTracks().forEach(t => { t.enabled = true; });
        if (videoRef.current) {
          videoRef.current.srcObject = liveStream;
        }
        return;
      }

      if (liveStream) {
        liveStream.getTracks().forEach(t => t.stop());
      }
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
      } catch (e1) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
        } catch (e2) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }
      setLiveStream(stream);
    } catch (err: any) {
      showToast("Camera access denied or unavailable: " + (err.message || err), "error");
      setShowLiveCameraModal(false);
    }
  };

  const stopLiveCamera = () => {
    if (liveStream) {
      // Pause tracks rather than killing them so permission remains active in browser memory
      liveStream.getVideoTracks().forEach(t => { t.enabled = false; });
    }
    setShowLiveCameraModal(false);
  };

  useEffect(() => {
    if (showLiveCameraModal && liveStream && videoRef.current) {
      videoRef.current.srcObject = liveStream;
    }
  }, [showLiveCameraModal, liveStream]);

  const captureLiveFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      if (activeMode === "dispatch") {
        setUploadingPacking(true);
      } else {
        setUploadingQc(true);
      }
      try {
        const file = new File([blob], `snap_${Date.now()}.jpg`, { type: "image/jpeg" });
        const comp = await compressImageToWebP(file);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          if (activeMode === "dispatch") {
            setPackingImages(prev => [...prev, data.url]);
          } else {
            setQcImages(prev => [...prev, data.url]);
          }
          showToast("⚡ Snap captured & uploaded!", "success");
        }
      } catch (e: any) {
        showToast(e.message || "Failed to capture photo", "error");
      } finally {
        setUploadingPacking(false);
        setUploadingQc(false);
      }
    }, "image/jpeg", 0.9);
  };

  // ==================== MODE 2: DISPATCH PACKING STATES ====================
  const [searchOrderId, setSearchOrderId] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [packingImages, setPackingImages] = useState<string[]>([]);
  const [uploadingPacking, setUploadingPacking] = useState(false);
  const [packingPending, setPackingPending] = useState(0);
  const [submittingDispatch, setSubmittingDispatch] = useState(false);

  // ==================== MODE 3: RETURN QC STATES ====================
  const [searchReturnId, setSearchReturnId] = useState("");
  const [returns, setReturns] = useState<any[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
  const [qcImages, setQcImages] = useState<string[]>([]);
  const [qcNotes, setQcNotes] = useState("");
  const [uploadingQc, setUploadingQc] = useState(false);
  const [qcPending, setQcPending] = useState(0);
  const [submittingQc, setSubmittingQc] = useState(false);

  useEffect(() => {
    fetchVendorAuth();
  }, []);

  // Auto-Select Order ID if search matches
  useEffect(() => {
    if (searchOrderId && orders.length > 0) {
      const cleaned = searchOrderId.trim().toLowerCase();
      const match = orders.find(o => 
        o.id.toString() === cleaned || 
        (o.orderNumber && o.orderNumber.toLowerCase() === cleaned) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(cleaned)) ||
        (o.awbCode && o.awbCode.toLowerCase().includes(cleaned))
      );
      if (match) {
        setSelectedOrder(match);
        setPackingImages([]);
      }
    }
  }, [searchOrderId, orders]);

  // Auto-Select Return ID if search matches
  useEffect(() => {
    if (searchReturnId && returns.length > 0) {
      const cleaned = searchReturnId.trim().toLowerCase();
      const match = returns.find(r => 
        r.id.toString() === cleaned || 
        (r.reason && r.reason.toLowerCase().includes(cleaned))
      );
      if (match) {
        setSelectedReturn(match);
        setQcImages([]);
      }
    }
  }, [searchReturnId, returns]);

  const fetchVendorAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setVendor(data.user);
        setLoading(false); // Unblock UI instantly!
        const effectiveVid = data.user.role === "user" && data.user.parentVendorId ? data.user.parentVendorId : data.user.id;
        Promise.all([
          fetchCategories(),
          fetchOrdersAndReturns(effectiveVid)
        ]);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      router.push("/login");
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

  const fetchOrdersAndReturns = async (vid?: number) => {
    try {
      const activeVendorId = vid || (vendor?.role === "user" && vendor?.parentVendorId ? vendor.parentVendorId : vendor?.id);
      if (!activeVendorId) return;
      const [ordRes, retRes] = await Promise.all([
        fetch(`/api/orders?vendorId=${activeVendorId}&limit=500`),
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

  // 📦 Handlers: Dispatch Packing Camera Photos
  const handleSnapPackingPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    if (packingImages.length + fileArray.length > 6) {
      showToast("Max 6 photos allowed", "error");
      return;
    }

    const localUrls = fileArray.map(f => URL.createObjectURL(f));
    setPackingImages(prev => [...prev, ...localUrls]);
    setPackingPending(prev => prev + fileArray.length);

    fileArray.forEach(async (rawFile, index) => {
      try {
        const comp = await compressImageToWebP(rawFile);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        
        if (data.url) {
          setPackingImages(prev => prev.map(url => url === localUrls[index] ? data.url : url));
        }
      } catch (err: any) {
        setPackingImages(prev => prev.filter(url => url !== localUrls[index]));
        showToast("Packing photo upload failed", "error");
      } finally {
        setPackingPending(prev => prev - 1);
      }
    });

    e.target.value = "";
  };

  const handleConfirmDispatch = async () => {
    if (!selectedOrder) return;
    if (packingImages.length < 3) return showToast("Please upload at least 3 clear proof photos (Min 3 required)", "error");

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
        showToast("📦 Order marked as PACKED! Shiprocket pickup requested.", "success");
        const effectiveVid = vendor?.role === "user" && vendor?.parentVendorId ? vendor.parentVendorId : vendor?.id;
        
        // Broadcast Event Push to Vendor Dashboard with 0% DB Load!
        try {
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const bc = new BroadcastChannel(`stopshop_vendor_${effectiveVid}`);
            bc.postMessage({ type: "ORDER_PACKED", orderId: selectedOrder.id });
            bc.close();
          }
        } catch (e) {}

        setSelectedOrder(null);
        setPackingImages([]);
        fetchOrdersAndReturns(effectiveVid);
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to submit packing proof", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Packing submission error", "error");
    } finally {
      setSubmittingDispatch(false);
    }
  };

  // 🔄 Handlers: Return QC Inspection Photos
  const handleSnapQcPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    if (qcImages.length + fileArray.length > 6) {
      showToast("Max 6 photos allowed", "error");
      return;
    }

    const localUrls = fileArray.map(f => URL.createObjectURL(f));
    setQcImages(prev => [...prev, ...localUrls]);
    setQcPending(prev => prev + fileArray.length);

    fileArray.forEach(async (rawFile, index) => {
      try {
        const comp = await compressImageToWebP(rawFile);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        
        if (data.url) {
          setQcImages(prev => prev.map(url => url === localUrls[index] ? data.url : url));
        }
      } catch (err: any) {
        setQcImages(prev => prev.filter(url => url !== localUrls[index]));
        showToast("QC photo upload failed", "error");
      } finally {
        setQcPending(prev => prev - 1);
      }
    });

    e.target.value = "";
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch(e) {
      router.push('/login');
    }
  };

  const handleSubmitQcReport = async (action: "QC_PASS" | "QC_UPLOAD") => {
    if (!selectedReturn) return;
    if (action === "QC_UPLOAD" && qcImages.length < 3) {
      return showToast("Please snap at least 3 proof photos showing the issue", "error");
    }

    setSubmittingQc(true);
    try {
      const res = await fetch(`/api/returns/${selectedReturn.id}`, {
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

      {/* Worker Dedicated Minimal Top Header (Logo + Account Only, No Blinkit/Main Navbar) */}
      <header className="sticky top-0 z-40 bg-[#121214] text-white border-b border-zinc-800 px-4 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/logo4.jpg" alt="StopShop Logo" className="w-8 h-8 rounded-xl object-contain bg-white p-0.5" />
          <div>
            <h1 className="text-xs font-black text-white flex items-center gap-1.5 font-display tracking-wider">
              Worker Studio
              <span className="text-[9px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.2 rounded-md font-sans">LIVE</span>
            </h1>
            <p className="text-[10px] text-zinc-400 truncate max-w-[170px] font-medium">
              {vendor ? (vendor.name || vendor.email) : "Worker Account"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-md mx-auto space-y-6">

        {/* MODE 2: DISPATCH PACKING CAMERA */}
        {activeMode === "dispatch" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Package size={14} className="text-orange-500" />
              Orders Ready for Packing Photos ({orders.filter(o => o.status === "CONFIRMED" || o.status === "PROCESSING" || !["PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "DISPATCHED"].includes(o.status)).length})
            </h2>

            {selectedOrder ? (
              <div className="bg-surface-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                <div className="flex justify-between items-start border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                      Order #{selectedOrder.id}
                    </span>
                    <p className="text-xs font-bold text-heading mt-1.5">{selectedOrder.shippingName || "Customer"}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedOrder(null); setPackingImages([]); }}
                    className="w-8 h-8 flex items-center justify-center bg-surface hover:bg-surface-hover rounded-full border border-border text-muted transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Show Products to Pack */}
                <div className="space-y-2 bg-surface p-3 rounded-2xl border border-border/60">
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Items to Pack ({selectedOrder.items?.length || 0})</label>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-surface-card p-2 rounded-xl border border-border/50">
                        <img src={item.productImage || "/logo4.jpg"} alt={item.productName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-heading truncate">{item.productName}</p>
                          <div className="flex gap-2 items-center mt-1">
                            <span className="text-[9px] font-bold bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded">Qty: {item.quantity}</span>
                            <span className="text-[9px] text-muted truncate">{item.productMaterial}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-heading uppercase">
                      Upload Packing Proof
                    </label>
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">{packingImages.length} / 8 (Min 5 Req)</span>
                  </div>
                  <p className="text-[10px] text-muted leading-tight">Snap raw product from 4 angles (front, sides, bottom for dent proof), plus bubble wrap, box sealing & shipping label.</p>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      id="cam-packing-camera"
                      onChange={handleSnapPackingPhotos}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cam-packing-camera"
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Camera size={18} />
                      <span>Take Photo</span>
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="cam-packing-gallery"
                      onChange={handleSnapPackingPhotos}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cam-packing-gallery"
                      className="w-full py-3 bg-surface hover:bg-surface-hover text-heading border border-border rounded-2xl font-bold text-xs shadow-sm transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <ImageIcon size={18} className="text-blue-500" />
                      <span>Select Gallery</span>
                    </label>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
                    {Array.from({ length: Math.max(6, packingImages.length) }).map((_, idx) => (
                      <div key={idx} className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all ${packingImages[idx] ? 'border-solid border-border' : (idx < 3 ? 'border-dashed border-red-300 bg-red-50 dark:bg-red-500/10 text-red-400' : 'border-dashed border-border bg-surface-hover text-muted')}`}>
                        {packingImages[idx] ? (
                          <>
                            <img src={packingImages[idx]} alt={`Packing ${idx + 1}`} onClick={() => !packingImages[idx].startsWith("blob:") && setPreviewModalImage({ url: packingImages[idx], index: idx, type: "packing" })} className="w-full h-full object-cover cursor-pointer" />
                            {packingImages[idx].startsWith("blob:") ? (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white" size={16} />
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); setPackingImages(prev => prev.filter((_, i) => i !== idx)); }}
                                className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold"
                              >
                                ✕
                              </button>
                            )}
                          </>
                        ) : (
                          <label htmlFor="cam-packing-camera" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                            <Camera size={18} className="mb-0.5 opacity-60" />
                            <span className="text-[10px] font-bold opacity-80">{idx < 3 ? 'Req' : 'Opt'}</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  disabled={submittingDispatch || packingImages.length < 5 || packingPending > 0}
                  onClick={handleConfirmDispatch}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {submittingDispatch ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>Mark as Packed (Request Shiprocket Pickup)</span>
                </button>
              </div>
            ) : (
              /* Order Selector List */
              <div className="space-y-2">
                <div className="mb-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4 rounded-3xl border border-orange-500/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  
                  <label className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ScanLine size={14} className="animate-pulse" /> Find Order to Pack
                  </label>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter Order ID..."
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                        className="w-full bg-surface border-2 border-orange-500/30 rounded-2xl pl-10 pr-4 py-3.5 text-xs focus:outline-none focus:border-orange-500 focus:ring-4 ring-orange-500/10 font-mono shadow-inner transition-all"
                      />
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                    
                    <button
                      onClick={() => setShowScanner(true)}
                      className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                </div>
                {orders.filter(o => o.status === "CONFIRMED" || o.status === "PROCESSING" || !["PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "DISPATCHED"].includes(o.status)).length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted font-bold bg-surface-card rounded-2xl border border-dashed border-border">
                    No pending orders to pack.
                  </div>
                ) : (
                  orders.filter(o => {
                    const isPackingReady = o.status === "CONFIRMED" || o.status === "PROCESSING" || !["PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "DISPATCHED"].includes(o.status);
                    if (!isPackingReady) return false;

                    if (!searchOrderId) return true;
                    const q = searchOrderId.trim().toLowerCase();
                    return (
                      o.id.toString() === q ||
                      (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
                      (o.shippingName && o.shippingName.toLowerCase().includes(q)) ||
                      (o.awbCode && o.awbCode.toLowerCase().includes(q))
                    );
                  }).map(ord => (
                    <div
                      key={ord.id}
                      onClick={() => { setSelectedOrder(ord); setPackingImages([]); }}
                      className="p-4 bg-surface-card border border-border/80 hover:border-orange-500/80 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-12 h-12 rounded-xl border border-border/80 overflow-hidden flex-shrink-0 bg-surface">
                          <img src={(ord.items && ord.items[0]?.productImage) || "/logo4.jpg"} alt="product" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-1">
                            {ord.orderNumber || `Order #${ord.id}`}
                          </span>
                          <h4 className="text-xs font-bold text-heading truncate">{ord.shippingName || "Customer"}</h4>
                          <p className="text-[10px] text-muted">₹{((ord.totalPaise || 0) / 100).toLocaleString("en-IN")} • {ord.items?.length || 1} items</p>
                        </div>
                        <span className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md flex-shrink-0">
                          <Camera size={14} /> Pack
                        </span>
                      </div>
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
              Incoming Return Inspections ({returns.length})
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-heading uppercase">
                      Snap Return QC Inspection Photos *
                    </label>
                    <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">{qcImages.length} / 6 (Min 3 Req)</span>
                  </div>

                  {/* Dashed Box Grid UI */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {Array.from({ length: Math.max(6, qcImages.length) }).map((_, idx) => (
                      <div key={idx} className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all ${qcImages[idx] ? 'border-solid border-border' : (idx < 3 ? 'border-dashed border-red-300 bg-red-50 dark:bg-red-500/10 text-red-400' : 'border-dashed border-border bg-surface-hover text-muted')}`}>
                        {qcImages[idx] ? (
                          <>
                            <img src={qcImages[idx]} alt={`QC ${idx + 1}`} onClick={() => !qcImages[idx].startsWith("blob:") && setPreviewModalImage({ url: qcImages[idx], index: idx, type: "qc" })} className="w-full h-full object-cover cursor-pointer" />
                            {qcImages[idx].startsWith("blob:") ? (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white" size={16} />
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); setQcImages(prev => prev.filter((_, i) => i !== idx)); }}
                                className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold"
                              >
                                ✕
                              </button>
                            )}
                          </>
                        ) : (
                          <label htmlFor="cam-qc-camera" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                            <Camera size={18} className="mb-0.5 opacity-60" />
                            <span className="text-[10px] font-bold opacity-80">{idx < 3 ? 'Req' : 'Opt'}</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Separate Camera and Gallery Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      id="cam-qc-camera"
                      onChange={handleSnapQcPhotos}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cam-qc-camera"
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Camera size={18} />
                      <span>Take Photo</span>
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="cam-qc-gallery"
                      onChange={handleSnapQcPhotos}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cam-qc-gallery"
                      className="w-full py-3 bg-surface hover:bg-surface-hover text-heading border border-border rounded-2xl font-bold text-xs shadow-sm transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <ImageIcon size={18} className="text-blue-500" />
                      <span>Select Gallery</span>
                    </label>
                  </div>
                </div>

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
                <div className="pt-2">
                  <button
                    disabled={submittingQc || qcImages.length < 3 || qcPending > 0}
                    onClick={() => handleSubmitQcReport("QC_UPLOAD")}
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShieldAlert size={16} />
                    Upload & Raise to Admin
                  </button>
                </div>
              </div>
            ) : (
              /* Return Selector List */
              <div className="space-y-2">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Scan or Enter Return ID..."
                    value={searchReturnId}
                    onChange={(e) => setSearchReturnId(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                {(() => {
                  const workerReturns = returns.filter(r => !["REFUND_INITIATED", "REFUNDED", "REJECTED", "REJECTED_PRE_PICKUP", "COMPLETED", "QC_PASS", "QC_FAIL", "QC_FAILED", "REFUND_FAILED"].includes(r.status));
                  const filtered = workerReturns.filter(r => !searchReturnId || r.id.toString() === searchReturnId);
                  
                  if (filtered.length === 0) {
                    return (
                      <div className="p-8 text-center text-xs text-muted font-bold bg-surface-card rounded-2xl border border-dashed border-border">
                        No pending returns to inspect.
                      </div>
                    );
                  }

                  return filtered.map(ret => {
                    const isRaised = ret.status === "RECEIVED_AT_WAREHOUSE";
                    return (
                      <div
                        key={ret.id}
                        onClick={() => { if (!isRaised) { setSelectedReturn(ret); setQcImages([]); } }}
                        className={`p-4 bg-surface-card border border-border/80 rounded-2xl flex items-center justify-between transition-all shadow-sm ${isRaised ? 'opacity-60 cursor-not-allowed' : 'hover:border-red-500/80 cursor-pointer'}`}
                      >
                        <div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isRaised ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                            Return #{ret.id}
                          </span>
                          <h4 className="text-xs font-bold text-heading mt-1">{ret.reason || "Return Inquiry"}</h4>
                          <p className="text-[10px] text-muted">Status: {ret.status}</p>
                        </div>
                        <span className={`px-3 py-1.5 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 ${isRaised ? 'bg-orange-500' : 'bg-red-500'}`}>
                          {isRaised ? <><ShieldAlert size={12} /> Raised to Admin</> : <><Camera size={12} /> QC Snap</>}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onScan={(text: string) => {
            setSearchOrderId(text);
            setShowScanner(false);
            setToast({ type: "success", message: `Scanned: ${text}` });
          }}
        />
      )}

      {/* Live In-App Camera Viewfinder Modal (WebRTC continuous stream) */}
      {showLiveCameraModal && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col justify-between overflow-hidden">
          {/* Top Camera Controls Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider font-display">Live Camera Studio</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full">
                {activeMode === "dispatch" ? packingImages.length : qcImages.length} / 8 Snaps
              </span>
              <button
                onClick={stopLiveCamera}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm backdrop-blur-md cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Live Video Feed */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Viewfinder Guidelines */}
            <div className="absolute inset-12 sm:inset-16 border-2 border-dashed border-orange-500/40 rounded-3xl pointer-events-none flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-l-2 border-orange-500 absolute top-0 left-0"></div>
              <div className="w-5 h-5 border-t-2 border-r-2 border-orange-500 absolute top-0 right-0"></div>
              <div className="w-5 h-5 border-b-2 border-l-2 border-orange-500 absolute bottom-0 left-0"></div>
              <div className="w-5 h-5 border-b-2 border-r-2 border-orange-500 absolute bottom-0 right-0"></div>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 space-y-4 flex flex-col items-center">
            {/* Captured Photos Horizontal Thumbnails Strip */}
            {((activeMode === "dispatch" ? packingImages : qcImages).length > 0) && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 custom-scrollbar">
                {(activeMode === "dispatch" ? packingImages : qcImages).map((img, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-orange-500 flex-shrink-0 shadow-lg animate-in zoom-in-50">
                    <img src={img} alt="snap" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 bg-orange-500 text-white text-[8px] font-black px-1 rounded-tl">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Shutter Button & Controls */}
            <div className="flex items-center justify-around w-full max-w-xs pt-2">
              <button
                onClick={() => {
                  const newMode = facingMode === "environment" ? "user" : "environment";
                  setFacingMode(newMode);
                  startLiveCamera(newMode);
                }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                title="Switch Camera"
              >
                <RefreshCcw size={20} />
              </button>

              {/* Shutter Button */}
              <button
                disabled={uploadingPacking || uploadingQc}
                onClick={captureLiveFrame}
                className="w-20 h-20 rounded-full bg-white p-1 shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center justify-center active:scale-90 transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="w-full h-full rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white">
                  {uploadingPacking || uploadingQc ? (
                    <Loader2 size={28} className="animate-spin text-white" />
                  ) : (
                    <Camera size={32} />
                  )}
                </div>
              </button>

              <button
                onClick={stopLiveCamera}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Photo Inspection Lightbox Modal */}
      {previewModalImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center text-white pt-2 px-2 z-10">
            <div>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wide">Photo Inspector</p>
              <p className="text-[10px] text-zinc-400">Snap #{previewModalImage.index + 1} of {packingImages.length}</p>
            </div>
            <button 
              onClick={() => setPreviewModalImage(null)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {/* High Res Full View */}
          <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden">
            <img 
              src={previewModalImage.url} 
              alt="Inspect Photo" 
              className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-zinc-800 shadow-2xl" 
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-center gap-3 pb-6 z-10">
            <button
              onClick={() => {
                if (previewModalImage.type === "packing") {
                  setPackingImages(prev => prev.filter((_, i) => i !== previewModalImage.index));
                } else {
                  setQcImages(prev => prev.filter((_, i) => i !== previewModalImage.index));
                }
                setPreviewModalImage(null);
                showToast("Photo removed", "info");
              }}
              className="px-5 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>🗑️ Remove Photo</span>
            </button>

            <button
              onClick={() => setPreviewModalImage(null)}
              className="px-6 py-3 bg-white text-black font-extrabold text-xs rounded-2xl shadow active:scale-95 cursor-pointer"
            >
              ✓ Looks Good
            </button>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Switcher */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card/95 backdrop-blur-xl border-t border-border/80 px-4 py-2 flex justify-around items-center">

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
