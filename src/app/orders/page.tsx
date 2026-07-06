"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, ArrowRight, User as UserIcon, Lock, Package, Truck, Download, RefreshCcw, Camera, X, AlertTriangle, ShieldCheck, CheckCircle } from "lucide-react";
import InlineReviewStars from "./InlineReviewStars";

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // Auth Forms State (if not logged in)
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("active");

  // Premium Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isErrorToast, setIsErrorToast] = useState(false);

  const displayToast = (msg: string, isError: boolean = false) => {
    setToastMessage(msg);
    setIsErrorToast(isError);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Return Modal State
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [returnReason, setReturnReason] = useState("DEFECTIVE");
  const [returnNotes, setReturnNotes] = useState("");
  // Mock image upload state for simplicity
  const [returnImages, setReturnImages] = useState<string[]>([]); 
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const handleUploadReturnImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      if (returnImages.length + files.length > 8) {
        throw new Error("Maximum 8 photos allowed.");
      }

      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setReturnImages(prev => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      console.error(err);
      displayToast(err.message || "Failed to upload photo", true);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const fetchProfileAndOrders = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.authenticated) {
          setUser(meData.user);
          const ordersRes = await fetch(`/api/orders?limit=50`);
          if (ordersRes.ok) {
            const data = await ordersRes.json();
            setOrders(data.orders || []);
          }
        }
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndOrders();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email, password, rememberMe: true }
      : { name, email, password, role: "user", rememberMe: true };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user.role === "vendor") {
          window.location.href = "/vendor/dashboard";
        } else {
          setUser(data.user);
          fetchProfileAndOrders();
        }
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDownloadInvoice = (orderId: string, orderNumber: string) => {
     window.location.href = `/api/orders/${orderId}/invoice`;
  };

  const openReturnModal = (order: any) => {
     setReturnOrderId(order.id);
     setReturnItems(order.items.map((i: any) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitPaise: i.unitPaise
     })));
     setReturnImages([]);
     setReturnNotes("");
     setShowReturnModal(true);
  };

  const submitReturn = async () => {
     if (returnImages.length < 6 || returnImages.length > 8) {
        displayToast(`You must upload between 6 and 8 photos. You currently have ${returnImages.length}.`, true);
        return;
     }

     setSubmittingReturn(true);
     try {
        const res = await fetch("/api/returns/request", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              orderId: returnOrderId,
              reason: returnReason,
              reasonDetail: returnNotes,
              returnImages,
              returnItems
           })
        });

        const data = await res.json();
        if (res.ok) {
           displayToast("Return request submitted successfully. We will review it shortly.", false);
           setShowReturnModal(false);
           fetchProfileAndOrders();
        } else {
           displayToast(data.error || "Failed to submit return request", true);
        }
     } catch (err) {
        displayToast("Network error", true);
     } finally {
        setSubmittingReturn(false);
     }
  };

  if (loading) {
    return <div className="min-h-[60vh] w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface pt-6 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-surface-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-xl font-display font-bold text-heading">{isLogin ? "Sign In" : "Create Account"}</h1>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
            {authError && <div className="p-3 bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl font-medium">{authError}</div>}
            {!isLogin && (
              <input type="text" required value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 bg-surface border border-border focus:border-orange-500 rounded-xl outline-none" />
            )}
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-2.5 bg-surface border border-border focus:border-orange-500 rounded-xl outline-none" />
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2.5 bg-surface border border-border focus:border-orange-500 rounded-xl outline-none" />
            
            <button type="submit" disabled={authLoading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5">
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? "Sign In" : "Register")}
            </button>
          </form>
          <div className="mt-6 text-center border-t border-border pt-4">
            <button onClick={() => { setIsLogin(!isLogin); setAuthError(""); }} className="text-xs text-orange-500 font-bold">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => !["DELIVERED", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_RECEIVED", "RETURNED", "RETURN_REJECTED", "RTO", "RTO_DELIVERED"].includes(o.status));
  const archiveOrders = orders.filter(o => ["DELIVERED", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_RECEIVED", "RETURNED", "RETURN_REJECTED", "RTO", "RTO_DELIVERED"].includes(o.status));

  return (
    <div className="min-h-screen bg-surface pt-10 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex border-b border-border mb-8">
          <button onClick={() => setActiveTab("active")} className={`flex-1 pb-4 text-center text-xs font-semibold uppercase ${activeTab === "active" ? "border-b-2 border-orange-500 text-orange-500" : "text-muted"}`}>
            Active Orders ({activeOrders.length})
          </button>
          <button onClick={() => setActiveTab("archived")} className={`flex-1 pb-4 text-center text-xs font-semibold uppercase ${activeTab === "archived" ? "border-b-2 border-orange-500 text-orange-500" : "text-muted"}`}>
            Past & Returns ({archiveOrders.length})
          </button>
        </div>

        <div className="space-y-6">
          {(activeTab === "active" ? activeOrders : archiveOrders).length === 0 ? (
             <div className="text-center py-16 bg-surface-card border border-border rounded-3xl"><p className="text-sm text-muted">No orders found.</p></div>
          ) : (
            (activeTab === "active" ? activeOrders : archiveOrders).map((order) => (
              <div key={order.id} className="bg-white dark:bg-[#18181b] border-2 border-zinc-200/90 dark:border-zinc-800 rounded-[28px] p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] space-y-6 transition-all overflow-hidden">
                 {/* Tinted Premium Header Box */}
                 <div className="bg-zinc-100/90 dark:bg-zinc-900/90 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex justify-between items-center flex-wrap gap-3 text-xs">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-extrabold text-zinc-500 uppercase tracking-wider text-[11px]">ORDER ID:</span>
                      <span className="font-black text-zinc-900 dark:text-white text-sm sm:text-base">{order.orderNumber}</span>
                      <span className={`px-2.5 py-1 rounded-lg font-black uppercase text-[10px] border ${order.paymentMethod === 'cod' ? 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'}`}>
                         {order.paymentMethod || 'ONLINE'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-zinc-500 font-medium">Date: <strong className="text-zinc-900 dark:text-white font-bold">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong></span>
                       <button onClick={() => handleDownloadInvoice(order.id, order.orderNumber)} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all active:scale-[0.98]">
                          <Download size={14} /> Invoice
                       </button>
                    </div>
                 </div>

                 {/* Shipping Status Stepper & Delivery Date (High Contrast Orange Gradient Box) */}
                 {(() => {
                    const isCancelled = order.status === "CANCELLED";
                    const isRto = order.status.startsWith("RTO");
                    const isReturn = order.status.startsWith("RETURN");
                    
                    if (isCancelled || isRto) {
                      return (
                         <div className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-extrabold text-red-600 dark:text-red-400">
                            <AlertTriangle size={18} className="shrink-0" />
                            <span>Order Cancelled or Returned to Origin</span>
                         </div>
                      );
                    }
                    
                    const stages = [
                      { label: "Ordered", statusKeys: ["PENDING", "CONFIRMED"] },
                      { label: "Packed", statusKeys: ["PACKED"] },
                      { label: "Dispatched", statusKeys: ["DISPATCHED"] },
                      { label: "Delivered", statusKeys: ["DELIVERED", "RETURNED", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_RECEIVED", "RETURN_REJECTED"] }
                    ];

                    let currentIndex = 0;
                    const status = order.status.toUpperCase();
                    const hasPackedItems = order.items?.some((i: any) => {
                       let imgs = i.dispatchImages;
                       if (typeof imgs === 'string') {
                          try { imgs = JSON.parse(imgs as string); } catch(e) {}
                       }
                       return imgs && (Array.isArray(imgs) ? imgs.length > 0 : true);
                    });
                    
                    if (status === "PACKED" || hasPackedItems) currentIndex = 1;
                    if (status === "DISPATCHED") currentIndex = 2;
                    else if (["DELIVERED", "RETURNED", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_RECEIVED", "RETURN_REJECTED"].includes(status)) currentIndex = 3;

                    return (
                       <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-2 border-orange-500/20 dark:border-orange-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
                          {/* Delivery info banner */}
                          {isReturn ? (
                             <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                                <RefreshCcw size={16} />
                                <span>Return Status: {order.status.replace(/_/g, ' ')}</span>
                             </div>
                          ) : status === "DELIVERED" && order.deliveredAt ? (
                             <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                <Package size={16} />
                                <span>Delivered on {new Date(order.deliveredAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                             </div>
                          ) : status === "DELIVERED" && !order.deliveredAt ? (
                             <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                <Package size={16} />
                                <span>Delivered successfully</span>
                             </div>
                          ) : order.deliveryDate ? (
                             <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                                <Truck size={16} />
                                <span>⚡ Estimated Delivery: {new Date(order.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} {(status === "PACKED" || hasPackedItems) ? "• Order Packed" : ""}</span>
                             </div>
                          ) : status === "PACKED" || hasPackedItems ? (
                             <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                                <Truck size={16} />
                                <span>⚡ Status: Order Packed - Ready for Dispatch</span>
                             </div>
                          ) : (
                             <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                                <Truck size={16} />
                                <span>⚡ Estimated Delivery: Preparing shipment</span>
                             </div>
                          )}

                          {/* Progress Stepper Line */}
                          {!isReturn && (
                             <div className="w-full pt-2 px-2 sm:px-6">
                                <div className="flex items-center">
                                   {stages.map((stage, idx) => {
                                      const isCompleted = idx <= currentIndex;
                                      const isActive = idx === currentIndex;
                                      
                                      return (
                                         <React.Fragment key={stage.label}>
                                            <div className="flex flex-col items-center relative z-10">
                                               <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                                                  isCompleted 
                                                     ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
                                                     : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400"
                                               }`}>
                                                  {idx + 1}
                                               </div>
                                               <span className={`text-[10px] font-extrabold mt-2 transition-colors duration-300 ${
                                                  isActive ? "text-orange-600 dark:text-orange-400" : isCompleted ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                                               }`}>
                                                  {stage.label}
                                               </span>
                                            </div>
                                            
                                            {idx < stages.length - 1 && (
                                               <div className="flex-1 h-[3px] bg-zinc-200 dark:bg-zinc-800 mx-2 -mt-5">
                                                  <div className={`h-full transition-all duration-500 ${
                                                     idx < currentIndex ? "bg-orange-500" : "bg-transparent"
                                                  }`} />
                                               </div>
                                            )}
                                         </React.Fragment>
                                      );
                                   })}
                                </div>
                             </div>
                          )}
                       </div>
                    );
                 })()}

                 {/* Items List inside Crisp Box */}
                 <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider pb-1 border-b border-zinc-200 dark:border-zinc-800">Order Items</h4>
                    {order.items.map((item: any) => (
                       <div key={item.id} className="flex items-center gap-3.5 pt-1">
                          <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                             <img src={item.productImage || "/logo4.jpg"} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-extrabold text-zinc-900 dark:text-white text-sm sm:text-base truncate">{item.productName}</h4>
                             <p className="text-xs text-zinc-500 font-medium mt-0.5">Quantity: <strong className="text-zinc-700 dark:text-zinc-300">{item.quantity}</strong></p>
                             {order.status === "DELIVERED" && (
                               <InlineReviewStars productId={item.productId} orderId={order.id} />
                             )}
                          </div>
                          <div className="font-black text-zinc-900 dark:text-white text-sm sm:text-base whitespace-nowrap">
                             ₹{(item.totalPaise / 100).toLocaleString("en-IN")}
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Dark Luxury Financial Receipt Breakdown Box (Stops everything from blending into white!) */}
                 <div className="bg-[#121214] text-white p-4 sm:p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                       <span>Item Subtotal</span>
                       <span className="font-medium text-white">₹{((order.subtotalPaise || order.totalPaise) / 100).toLocaleString("en-IN")}</span>
                    </div>

                    {order.discountPaise > 0 && (
                       <div className="flex justify-between items-center font-bold text-[#22c55e] bg-[#0a2e1a]/80 px-3 py-1.5 rounded-xl border border-[#22c55e]/30">
                          <span>🎉 Coupon Saved {order.couponCode ? `(${order.couponCode})` : ""}</span>
                          <span>-₹{(order.discountPaise / 100).toLocaleString("en-IN")}</span>
                       </div>
                    )}

                    {order.shippingPaise > 0 && (
                       <div className="flex justify-between items-center text-zinc-400">
                          <span>Delivery Charges</span>
                          <span className="font-medium text-white">+₹{(order.shippingPaise / 100).toLocaleString("en-IN")}</span>
                       </div>
                    )}
                    {order.codChargePaise > 0 && (
                       <div className="flex justify-between items-center text-zinc-400">
                          <span>COD Surcharge</span>
                          <span className="font-medium text-white">+₹{(order.codChargePaise / 100).toLocaleString("en-IN")}</span>
                       </div>
                    )}

                    <div className="h-px bg-zinc-800/80 my-2" />

                    <div className="flex justify-between items-baseline pt-1">
                       <span className="text-zinc-200 font-extrabold text-sm">Total Paid / Payable</span>
                       <span className="font-black text-[#22c55e] text-base sm:text-lg">
                          ₹{(order.totalPaise / 100).toLocaleString("en-IN")}
                       </span>
                    </div>
                 </div>

                 {/* Status Footer */}
                 <div className="flex justify-between items-center pt-2 border-t border-zinc-200/80 dark:border-zinc-800 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                       <span className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase border shadow-sm ${
                          ['DELIVERED', 'RETURNED'].includes(order.status) ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
                          order.status.includes('RETURN') ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400' :
                          'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400'
                       }`}>
                          {order.status.replace(/_/g, ' ')}
                       </span>
                       {order.awbCode && (
                          <span className="text-xs text-zinc-500">Tracking: <strong className="text-zinc-900 dark:text-white">{order.awbCode}</strong> ({order.courierName})</span>
                       )}
                    </div>

                     {order.status === "DELIVERED" && !order.returnRequest && (() => {
                        const returnWindowMs = 7 * 24 * 60 * 60 * 1000;
                        const deliveredTimestamp = new Date(order.updatedAt || order.createdAt).getTime();
                        const isWithinReturnWindow = (Date.now() - deliveredTimestamp) <= returnWindowMs;

                        return isWithinReturnWindow ? (
                           <button onClick={() => openReturnModal(order)} className="text-xs font-bold text-red-600 hover:text-red-700 border-2 border-red-500/30 bg-red-500/10 px-4 py-2 rounded-xl transition-all shadow-sm">
                              Return Product
                           </button>
                        ) : (
                           <span className="text-xs font-semibold text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                              Return window closed (7 Days)
                           </span>
                        );
                     })()}
                 </div>

                 {/* Return Notes/Dispute Details */}
                 {order.returnRequest && (order.returnRequest.rejectionReason || order.returnRequest.adminNotes) && (
                    <div className="p-3.5 bg-red-500/10 border-2 border-red-500/20 rounded-2xl space-y-1 text-xs">
                       <h5 className="font-extrabold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                          <AlertTriangle size={14} />
                          Support Notes
                       </h5>
                       {order.returnRequest.rejectionReason && (
                          <p className="text-zinc-600 dark:text-zinc-300"><span className="font-bold text-zinc-900 dark:text-white">Update:</span> {order.returnRequest.rejectionReason}</p>
                       )}
                       {order.returnRequest.adminNotes && (
                          <p className="text-zinc-600 dark:text-zinc-300"><span className="font-bold text-zinc-900 dark:text-white">Notes:</span> {order.returnRequest.adminNotes}</p>
                       )}
                    </div>
                 )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface-card border border-border rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
               <h2 className="text-lg font-bold text-heading">Request Return</h2>
               <p className="text-xs text-muted">Please provide details and photos of the product to initiate a return. Our team will review the request.</p>
               
               <select value={returnReason} onChange={e=>setReturnReason(e.target.value)} className="w-full p-2.5 bg-surface border border-border rounded-xl text-xs outline-none focus:border-orange-500">
                  <option value="DEFECTIVE">Product is defective/damaged</option>
                  <option value="WRONG_ITEM">Received wrong item</option>
                  <option value="POOR_QUALITY">Quality is not as expected</option>
                  <option value="OTHER">Other</option>
               </select>

               <textarea 
                  placeholder="Additional notes about the issue..." 
                  value={returnNotes} onChange={e=>setReturnNotes(e.target.value)}
                  className="w-full p-2.5 bg-surface border border-border rounded-xl text-xs outline-none focus:border-orange-500 min-h-[80px]" 
               />

               <div className="border border-dashed border-orange-500/30 bg-orange-500/5 rounded-xl p-4 text-center">
                  <div className="flex flex-col gap-3">
                     <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-2">
                        {Array.from({ length: 8 }).map((_, i) => {
                          const url = returnImages[i];
                          if (url) {
                            return (
                              <div key={i} className="aspect-square rounded-md overflow-hidden relative group border border-border">
                                <img src={url} alt="Return" className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => setReturnImages(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            );
                          }
                          return (
                            <button
                              key={i}
                              onClick={() => setCameraActive(true)}
                              className={`aspect-square rounded-md border border-dashed flex flex-col items-center justify-center text-[8px] font-bold text-muted transition-all hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-500 ${i < 6 ? 'border-orange-500/30 bg-orange-500/5' : 'border-border bg-surface'}`}
                            >
                              <Camera size={12} className="mb-0.5" />
                              {i < 6 ? "Req" : "Opt"}
                            </button>
                          );
                        })}
                     </div>
                     
                     <div className="flex items-center justify-between mt-2 pt-2 border-t border-orange-500/10">
                        <p className={`text-[10px] font-bold ${returnImages.length >= 6 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {returnImages.length}/8 Photos
                        </p>
                        <label className={`flex items-center gap-1.5 text-orange-500 text-[10px] font-bold transition-all ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline'}`}>
                           {uploadingImage ? "Uploading..." : "Or Upload Files"}
                           <input 
                             type="file" 
                             id="return-file-input"
                             accept="image/*" 
                             multiple
                             disabled={uploadingImage}
                             onChange={handleUploadReturnImage}
                             className="hidden" 
                           />
                        </label>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 text-xs font-bold text-muted hover:text-heading">Cancel</button>
                  <button onClick={submitReturn} disabled={submittingReturn} className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl flex items-center gap-2">
                     {submittingReturn && <Loader2 size={14} className="animate-spin"/>} Submit Return
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Live Camera Modal */}
      {cameraActive && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 w-full z-10">
            <button onClick={() => {
              const video = document.getElementById("return-camera-video") as HTMLVideoElement;
              if (video && video.srcObject) {
                (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
              }
              setCameraActive(false);
            }} className="text-white bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
              <X size={24} />
            </button>
            <button 
              onClick={() => {
                const video = document.getElementById("return-camera-video") as HTMLVideoElement;
                if (video && video.srcObject) {
                  const stream = video.srcObject as MediaStream;
                  const track = stream.getVideoTracks()[0];
                  const currentFacing = track.getSettings().facingMode;
                  stream.getTracks().forEach(t => t.stop());
                  navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: currentFacing === "environment" ? "user" : "environment" } 
                  }).then(newStream => {
                    video.srcObject = newStream;
                  }).catch(console.error);
                }
              }} 
              className="text-white bg-white/20 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-2 hover:bg-white/30 transition-colors"
            >
              <Camera size={16} /> Switch Camera
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
            <video 
              id="return-camera-video"
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
              ref={(node) => {
                if (node && !node.srcObject && !node.dataset.requesting) {
                  node.dataset.requesting = "true";
                  if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    displayToast("Camera access requires HTTPS or localhost", true);
                    setCameraActive(false);
                    return;
                  }
                  navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } })
                    .then(stream => { 
                      node.srcObject = stream; 
                      delete node.dataset.requesting;
                    })
                    .catch(err => {
                      delete node.dataset.requesting;
                      console.error("Camera error:", err);
                      displayToast(`Camera error: ${err.name} - ${err.message}`, true);
                      setCameraActive(false);
                    });
                }
              }}
            />
            <canvas id="return-camera-canvas" className="hidden" />
          </div>
          <div className="p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 w-full flex justify-center z-10">
            <button 
              onClick={() => {
                const video = document.getElementById("return-camera-video") as HTMLVideoElement;
                const canvas = document.getElementById("return-camera-canvas") as HTMLCanvasElement;
                if (!video || !canvas || !video.videoWidth) return;
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob((blob) => {
                  if (!blob) return;
                  const file = new File([blob], `return-${Date.now()}.jpg`, { type: "image/jpeg" });
                  
                  if (video.srcObject) {
                    (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                  }
                  
                  handleUploadReturnImage({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
                  setCameraActive(false);
                }, "image/jpeg", 0.7);
              }} 
              className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/50 hover:bg-white/50 hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
            </button>
          </div>
        </div>
      )}

      {/* Premium Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 bg-zinc-900 border ${isErrorToast ? "border-red-500/30" : "border-emerald-500/30"} text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-[90vw] sm:max-w-md`}>
          <div className={`${isErrorToast ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"} p-1.5 rounded-lg shrink-0`}>
            {isErrorToast ? <ShieldCheck size={18} className="rotate-180" /> : <CheckCircle size={18} />}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-white">{isErrorToast ? "Error" : "Success"}</span>
            <span className="text-[10px] text-zinc-400 leading-tight">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
