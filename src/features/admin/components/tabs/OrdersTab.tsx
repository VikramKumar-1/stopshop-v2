"use client";
import React, { useState, useMemo } from "react";
import { 
  DollarSign, Award, Package, FileText, Globe, Loader2, Search, 
  User, Phone, Mail, Store, ShieldCheck, Calendar, Clock, ExternalLink, 
  CreditCard, MapPin, Truck, AlertCircle, ArrowUpRight, CheckCircle2, Copy, X, Tag
} from "lucide-react";

export function OrdersTab({
  orders,
  orderStats,
  orderPage,
  orderTotalPages,
  exchangeRates,
  loadMoreRef,
  isLoadingData = false,
}: {
  orders: any[];
  orderStats: any[];
  orderPage: number;
  orderTotalPages: number;
  exchangeRates: Record<string, number> | null;
  loadMoreRef: (node: HTMLDivElement | null) => void;
  isLoadingData?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  let totalSalesINR = 0;
  let totalSalesUSD = 0;
  let totalCommissionINR = 0;
  let totalCommissionUSD = 0;
  let nonCancelledCountINR = 0;
  let nonCancelledCountUSD = 0;
  let globalConvertedRevenueINR = 0;
  const statusCounts: Record<string, number> = {};
  const paymentCounts: Record<string, number> = {};

  const statsSource = orderStats && orderStats.length > 0 ? orderStats : orders;
  let abandonedPendingCount = 0;
  let paidOrConfirmedPendingCount = 0;

  statsSource.forEach(o => {
     const status = (o.status || "").toUpperCase();
     statusCounts[status] = (statusCounts[status] || 0) + 1;

     if (status === "PENDING" && o.paymentStatus !== "PAID") {
        abandonedPendingCount += 1;
     } else if (["CONFIRMED", "PACKED"].includes(status) || (status === "PENDING" && o.paymentStatus === "PAID")) {
        paidOrConfirmedPendingCount += 1;
     }

     const isValidSale = o.paymentStatus === "PAID" || ["CONFIRMED", "PACKED", "DISPATCHED", "DELIVERED"].includes(status);
     const excludedStatuses = ["CANCELLED", "RETURN_APPROVED", "RETURN_PICKED", "RETURN_RECEIVED", "RETURNED", "REFUNDED", "FAILED"];
     
     if (isValidSale && !excludedStatuses.includes(status)) {
        const method = (o.paymentMethod || "").toLowerCase();
        if (method) {
          paymentCounts[method] = (paymentCounts[method] || 0) + 1;
        }

        const currency = o.currency || "INR";
        const rawPaise = o.totalPaise || 0;
        
        if (currency === "USD") {
           totalSalesUSD += rawPaise;
           totalCommissionUSD += o.commissionPaise || 0;
           nonCancelledCountUSD += 1;
        } else {
           totalSalesINR += rawPaise;
           totalCommissionINR += o.commissionPaise || 0;
           nonCancelledCountINR += 1;
        }

        if (currency === "INR") {
           globalConvertedRevenueINR += rawPaise;
        } else {
           if (exchangeRates && exchangeRates[currency]) {
              globalConvertedRevenueINR += rawPaise / exchangeRates[currency];
           } else {
              globalConvertedRevenueINR += rawPaise / (currency === "USD" ? 0.012 : 1);
           }
        }
     }
  });

  const aovINR = nonCancelledCountINR > 0 ? totalSalesINR / nonCancelledCountINR : 0;
  const aovUSD = nonCancelledCountUSD > 0 ? totalSalesUSD / nonCancelledCountUSD : 0;
  const totalOrders = orderStats && orderStats.length > 0 ? orderStats.length : orders.length;

  // Filtered orders for Customer Support Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return (orders || []).filter(o => 
      (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.shippingName && o.shippingName.toLowerCase().includes(q)) ||
      (o.shippingEmail && o.shippingEmail.toLowerCase().includes(q)) ||
      (o.shippingPhone && o.shippingPhone.toLowerCase().includes(q)) ||
      (o.awbCode && o.awbCode.toLowerCase().includes(q)) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(q)) ||
      (o.items && o.items.some((i: any) => 
        i.productName?.toLowerCase().includes(q) || 
        i.product?.vendor?.name?.toLowerCase().includes(q) ||
        i.product?.vendor?.location?.toLowerCase().includes(q) ||
        i.product?.vendor?.artisanId?.toLowerCase().includes(q)
      ))
    );
  }, [searchQuery, orders]);

  // Active selected order object for Support Drawer
  const activeOrder = useMemo(() => {
    if (selectedOrderId) {
      return (orders || []).find(o => o.id === selectedOrderId || o.orderNumber === selectedOrderId);
    }
    if (searchResults.length > 0) {
      return searchResults[0];
    }
    return null;
  }, [selectedOrderId, searchResults, orders]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "DELIVERED") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (s === "DISPATCHED" || s === "IN_TRANSIT") return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    if (s === "PACKED" || s === "CONFIRMED") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    if (s === "CANCELLED" || s === "FAILED") return "bg-red-500/10 text-red-400 border-red-500/30";
    return "bg-slate-500/10 text-slate-300 border-slate-500/30";
  };

  return (
    <div className="space-y-6">

      {/* 🔍 CUSTOMER SUPPORT QUERY & ORDER LOOKUP INTEL */}
      <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="text-blue-400 shrink-0" size={20} />
              <span>Raise Customer Query & Support Lookup</span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-500/30">
                LIVE SEARCH
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Instant search by Order Number (e.g. <code className="text-amber-400 bg-slate-800 px-1 py-0.5 rounded">SS-260722-492015</code>), Customer Name, Email, Phone, Vendor, or AWB Code.
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedOrderId(null);
              }}
              placeholder="Search Order Number (e.g. SS-260722-492015), Customer Name, Phone, Vendor, AWB..."
              className="w-full bg-[#1e293b] border border-slate-700 hover:border-blue-500/50 focus:border-blue-500 text-white placeholder-slate-400 rounded-xl pl-11 pr-10 py-3 text-xs sm:text-sm outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedOrderId(null);
                }}
                className="absolute right-3 p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Search Match Pills */}
          {searchQuery.trim() && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">Found {searchResults.length} matching order(s):</span>
              {searchResults.slice(0, 5).map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                    activeOrder?.id === o.id 
                      ? "bg-blue-500 text-white border-blue-400 shadow-sm" 
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:border-blue-500/50"
                  }`}
                >
                  <span>{o.orderNumber || o.id}</span>
                  <span className="text-[10px] opacity-75">({o.shippingName || "Customer"})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Order Detailed Intelligence Sheet */}
        {activeOrder ? (
          <div className="bg-[#1e293b]/90 border border-slate-700/80 rounded-xl p-4 sm:p-6 space-y-6 animate-in fade-in duration-200 shadow-2xl">
            
            {/* Top Bar: Order Number, Timeline Status, Invoice */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                    {activeOrder.orderNumber || activeOrder.id}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(activeOrder.orderNumber || activeOrder.id)} 
                    className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-colors"
                    title="Copy Order Number"
                  >
                    {copiedId ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(activeOrder.status)}`}>
                    {activeOrder.status || "PENDING"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-blue-400" />
                    <span>Ordered: {new Date(activeOrder.createdAt).toLocaleString()}</span>
                  </span>
                  {activeOrder.deliveredAt && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 size={13} />
                      <span>Delivered: {new Date(activeOrder.deliveredAt).toLocaleString()}</span>
                    </span>
                  )}
                  {!activeOrder.deliveredAt && activeOrder.deliveryDate && (
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock size={13} />
                      <span>Est. Delivery: {new Date(activeOrder.deliveryDate).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Invoice & Shiprocket */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/api/orders/${activeOrder.id}/invoice`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FileText size={14} />
                  <span>Tax Invoice</span>
                  <ExternalLink size={12} className="opacity-80" />
                </a>
              </div>
            </div>

            {/* Cancellation Remark */}
            {activeOrder.status === "CANCELLED" && activeOrder.cancellationReason && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Cancellation Remark</h4>
                  <p className="text-sm text-red-200 mt-1">{activeOrder.cancellationReason}</p>
                </div>
              </div>
            )}

            {/* Grid 1: Customer & Shipping Details + Payment Gateway Audit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Customer & Address Details */}
              <div className="bg-[#0f172a] border border-slate-700/60 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <User size={14} />
                  <span>Customer & Shipping Details</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400">Customer Name:</span>
                    <span className="text-white font-semibold">{activeOrder.shippingName || activeOrder.user?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Mobile Phone:</span>
                    <a href={`tel:${activeOrder.shippingPhone}`} className="text-blue-400 hover:underline font-mono flex items-center gap-1">
                      <Phone size={12} />
                      {activeOrder.shippingPhone || activeOrder.user?.mobile || "N/A"}
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Email Address:</span>
                    <a href={`mailto:${activeOrder.shippingEmail}`} className="text-blue-400 hover:underline font-mono flex items-center gap-1">
                      <Mail size={12} />
                      {activeOrder.shippingEmail || activeOrder.user?.email || "N/A"}
                    </a>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block mb-1 flex items-center gap-1">
                      <MapPin size={12} className="text-amber-400" />
                      Delivery Address:
                    </span>
                    <p className="text-slate-200 bg-slate-900/60 p-2 rounded-lg leading-relaxed text-[11px]">
                      {activeOrder.shippingAddress}, {activeOrder.shippingCity}, {activeOrder.shippingState} - {activeOrder.shippingPincode}, {activeOrder.shippingCountry}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Gateway & Audit Details */}
              <div className="bg-[#0f172a] border border-slate-700/60 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <CreditCard size={14} />
                  <span>Payment Gateway Receipt & Audit</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Method:</span>
                    <span className="font-bold text-white uppercase bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {activeOrder.paymentMethod || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      activeOrder.paymentStatus === "COMPLETED" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {activeOrder.paymentStatus || "PENDING"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Gateway Txn ID:</span>
                    <span className="text-slate-200 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[180px]">
                      {activeOrder.razorpayPaymentId || activeOrder.paymentOrderId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Order Amount:</span>
                    <span className="text-white font-extrabold text-sm text-emerald-400">
                      {activeOrder.currency === "USD" ? "$" : "₹"}
                      {((activeOrder.totalPaise || 0) / 100).toLocaleString()}
                    </span>
                  </div>

                  {/* Vendor Settlement & Custom Payout Audit Breakdown */}
                  {activeOrder.settlements && activeOrder.settlements.length > 0 && (() => {
                    const st = activeOrder.settlements[0];
                    const customPayoutAmtPaise = st.vendorPayoutPaise;
                    const orderAmtPaise = activeOrder.totalPaise || st.orderAmountPaise;
                    const isCustomPayout = st.vendorPaymentMode?.includes("custom") || st.vendorPayoutPaise < (orderAmtPaise * 0.85);

                    return (
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-bold flex items-center gap-1">
                            <DollarSign size={13} className="text-orange-400" />
                            Vendor Settlement Status:
                          </span>
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                            st.status === "SETTLED" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            {st.status} {isCustomPayout ? "(Custom Payout)" : ""}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Net Paid to Vendor:</span>
                          <span className="font-black text-amber-400">
                            ₹{(customPayoutAmtPaise / 100).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-400">
                          <span>Platform Commission / Retained:</span>
                          <span className="font-semibold text-slate-200">
                            ₹{((orderAmtPaise - customPayoutAmtPaise) / 100).toLocaleString()}
                          </span>
                        </div>
                        {isCustomPayout && (
                          <div className="text-[10px] text-orange-300 bg-orange-500/10 p-2 rounded-lg border border-orange-500/20 font-medium">
                            ⚡ Custom Payout Adjustment: Admin paid ₹{(customPayoutAmtPaise / 100).toLocaleString()} to vendor (out of ₹{(orderAmtPaise / 100).toLocaleString()} order total).
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {activeOrder.courierName || activeOrder.awbCode ? (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Truck size={12} className="text-blue-400" />
                        Courier / Tracking:
                      </span>
                      <span className="text-blue-300 font-mono font-bold">
                        {activeOrder.courierName || "Shiprocket"} (AWB: {activeOrder.awbCode || "N/A"})
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

            </div>

            {/* Grid 2: Ordered Items & Vendor Contact Details */}
            <div className="bg-[#0f172a] border border-slate-700/60 rounded-xl p-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <Package size={14} />
                <span>Ordered Items & Vendor Details ({activeOrder.items?.length || 0})</span>
              </h4>

              <div className="space-y-3">
                {(activeOrder.items || []).map((item: any, idx: number) => {
                  const vendorInfo = item.product?.vendor;
                  const itemPrice = (item.unitPaise || item.totalPaise || 0) / 100;
                  return (
                    <div key={idx} className="bg-[#1e293b]/70 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.productImage || item.product?.image || "/logo4.jpg"} 
                          alt={item.productName} 
                          className="w-14 h-14 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 space-y-1">
                          <h5 className="text-xs font-bold text-white truncate max-w-[280px]">
                            {item.productName}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                            <span>Qty: <strong className="text-white">{item.quantity}</strong></span>
                            <span>•</span>
                            <span>Unit Price: <strong className="text-white">₹{itemPrice.toLocaleString()}</strong></span>
                            {item.productMaterial && (
                              <>
                                <span>•</span>
                                <span className="text-amber-400 font-semibold">{item.productMaterial}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Vendor Contact Box */}
                      <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 sm:min-w-[240px] w-full sm:w-auto space-y-1.5 shrink-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Store size={12} className="text-orange-400" />
                            Vendor
                          </span>
                          {(vendorInfo?.location || vendorInfo?.artisanId) && (
                            <span className="text-[10px] text-amber-300 font-semibold truncate max-w-[130px]">
                              {vendorInfo.location || vendorInfo.artisanId}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {vendorInfo?.name || "Direct Marketplace Vendor"}
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[10px]">
                          {vendorInfo?.mobile ? (
                            <a href={`tel:${vendorInfo.mobile}`} className="text-blue-400 hover:underline flex items-center gap-1 font-mono font-semibold">
                              <Phone size={10} />
                              {vendorInfo.mobile}
                            </a>
                          ) : (
                            <span className="text-slate-500">No Mobile</span>
                          )}
                          {vendorInfo?.email ? (
                            <a href={`mailto:${vendorInfo.email}`} className="text-blue-400 hover:underline flex items-center gap-1 font-mono font-semibold truncate max-w-[120px]">
                              <Mail size={10} />
                              {vendorInfo.email}
                            </a>
                          ) : (
                            <span className="text-slate-500">No Email</span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : searchQuery.trim() ? (
          <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-8 text-center text-slate-400 space-y-2">
            <AlertCircle size={28} className="mx-auto text-amber-400" />
            <p className="text-xs font-semibold text-white">No Order Found matching &quot;{searchQuery}&quot;</p>
            <p className="text-[11px] text-slate-500">Check the Order Number or customer phone/email and try again.</p>
          </div>
        ) : null}
      </div>

      {/* Hero Revenue Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-lg">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-blue-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Estimated Global Revenue
          </h3>
          {isLoadingData ? (
            <div className="h-10 w-44 bg-white/20 animate-pulse rounded-lg my-1" />
          ) : (
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ₹{(globalConvertedRevenueINR / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-sm font-semibold text-blue-200 ml-1.5">INR</span>
            </div>
          )}
          <p className="text-[11px] text-blue-200/80">Live exchange rates · auto-converted from all currencies.</p>
        </div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shrink-0">
          <Globe size={24} className="text-white/90" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Gross Sales - Amber Theme */}
        <div className="bg-[#18140c] rounded-2xl p-5 flex flex-col justify-between gap-4 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 shadow-md group">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Gross Sales</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            {isLoadingData ? (
              <div className="h-8 w-28 bg-amber-500/20 animate-pulse rounded-lg my-1" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  ₹{(totalSalesINR / 100).toLocaleString()}
                </h3>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
                  INR
                </span>
              </div>
            )}
            {(totalSalesUSD > 0 || nonCancelledCountUSD > 0) && (
              <p className="text-xs font-semibold text-slate-400 mt-1">
                ${(totalSalesUSD / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[10px] text-amber-400/80">USD</span>
              </p>
            )}
          </div>
          <p className="text-[11px] text-slate-400 border-t border-amber-500/10 pt-2.5">
            Revenue from valid purchases
          </p>
        </div>

        {/* Platform Earnings - Emerald Theme */}
        <div className="bg-[#0c1a15] rounded-2xl p-5 flex flex-col justify-between gap-4 border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 shadow-md group">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Platform Earnings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award size={18} />
            </div>
          </div>
          <div>
            {isLoadingData ? (
              <div className="h-8 w-28 bg-emerald-500/20 animate-pulse rounded-lg my-1" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  ₹{(totalCommissionINR / 100).toLocaleString()}
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                  INR
                </span>
              </div>
            )}
            {(totalCommissionUSD > 0 || nonCancelledCountUSD > 0) && (
              <p className="text-xs font-semibold text-slate-400 mt-1">
                ${(totalCommissionUSD / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[10px] text-emerald-400/80">USD</span>
              </p>
            )}
          </div>
          <p className="text-[11px] text-slate-400 border-t border-emerald-500/10 pt-2.5">
            Commission from vendor sales
          </p>
        </div>

        {/* Total Orders - Blue Theme */}
        <div className="bg-[#0f172a] rounded-2xl p-5 flex flex-col justify-between gap-4 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 shadow-md group">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Package size={18} />
            </div>
          </div>
          <div>
            {isLoadingData ? (
              <div className="h-8 w-20 bg-blue-500/20 animate-pulse rounded-lg my-1" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{totalOrders}</h3>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                  Orders
                </span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 border-t border-blue-500/10 pt-2.5">
            All orders across vendors
          </p>
        </div>

        {/* Avg Order Value - Purple Theme */}
        <div className="bg-[#181124] rounded-2xl p-5 flex flex-col justify-between gap-4 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 shadow-md group">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Avg Order Value</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <FileText size={18} />
            </div>
          </div>
          <div>
            {isLoadingData ? (
              <div className="h-8 w-28 bg-purple-500/20 animate-pulse rounded-lg my-1" />
            ) : (
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  ₹{(aovINR / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </h3>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase">
                  INR
                </span>
              </div>
            )}
            {(aovUSD > 0 || nonCancelledCountUSD > 0) && (
              <p className="text-xs font-semibold text-slate-400 mt-1">
                ${(aovUSD / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[10px] text-purple-400/80">USD</span>
              </p>
            )}
          </div>
          <p className="text-[11px] text-slate-400 border-t border-purple-500/10 pt-2.5">
            Average spend per order
          </p>
        </div>

      </div>

      {/* Breakdown Charts */}
      {totalOrders > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Order Lifecycle */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Order Lifecycle
            </h4>
            <div className="space-y-3">
              {[
                { label: "Active Orders (Confirmed/Packing)", count: paidOrConfirmedPendingCount, color: "bg-amber-500" },
                { label: "Delivered", count: statusCounts["DELIVERED"] || 0, color: "bg-emerald-500" },
                { label: "In Transit", count: statusCounts["DISPATCHED"] || 0, color: "bg-blue-500" },
                { label: "Abandoned Checkouts (Unpaid)", count: abandonedPendingCount, color: "bg-zinc-600" },
                { label: "Cancelled", count: statusCounts["CANCELLED"] || 0, color: "bg-red-500" },
              ].map((st, i) => {
                const pct = totalOrders > 0 ? Math.round((st.count / totalOrders) * 100) : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{st.label} <span className="text-slate-500">({st.count})</span></span>
                      <span className="text-white font-semibold">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${st.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Payment Methods
            </h4>
            <div className="space-y-3">
              {[
                { label: "Razorpay", count: paymentCounts["razorpay"] || 0, color: "bg-indigo-500" },
                { label: "PayU", count: paymentCounts["payu"] || 0, color: "bg-violet-500" },
                { label: "Cash on Delivery", count: paymentCounts["cod"] || 0, color: "bg-amber-500" },
              ].map((pm, i) => {
                const pct = totalOrders > 0 ? Math.round((pm.count / totalOrders) * 100) : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{pm.label} <span className="text-slate-500">({pm.count})</span></span>
                      <span className="text-white font-semibold">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${pm.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
