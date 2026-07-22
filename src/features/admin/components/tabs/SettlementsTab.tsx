"use client";
import React from "react";
import { DollarSign, Search, RefreshCcw, Store, Phone, MapPin, X, Eye, Download, History, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const SettlementsTab = ({
  settlementSummary,
  groupedSettlements,
  settlementSearchQuery,
  setSettlementSearchQuery,
  customPayoutForm,
  setCustomPayoutForm,
  showCustomPayoutModal,
  setShowCustomPayoutModal,
  excludedVendorIds,
  setExcludedVendorIds,
  isProcessingPayout,
  setIsProcessingPayout,
  isSubmittingCustomPayout,
  setIsSubmittingCustomPayout,
  selectedVendorSettlement,
  setSelectedVendorSettlement,
  showHistoryModal,
  setShowHistoryModal,
  visibleHistoryLimit,
  setVisibleHistoryLimit,
  isDeletingHistory,
  setIsDeletingHistory,
  historyActiveTab,
  setHistoryActiveTab,
  visibleCustomLimit,
  setVisibleCustomLimit,
  vendors,
  products,
  fetchData,
  showToast,
  setModalProduct,
  generateInvoice
}: any) => {
  const holdVal = settlementSummary?.hold || 0;
  const eligibleVal = settlementSummary?.eligible || 0;
  const settledVal = settlementSummary?.settled || 0;
  const disputedVal = settlementSummary?.disputed || 0;
  const totalVal = holdVal + eligibleVal + settledVal + disputedVal;

  const getSettlementPct = (val: number) => {
    return totalVal > 0 ? Math.round((val / totalVal) * 100) : 0;
  };

  const holdPct = getSettlementPct(holdVal);
  const eligiblePct = getSettlementPct(eligibleVal);
  const settledPct = getSettlementPct(settledVal);
  const disputedPct = getSettlementPct(disputedVal);

  const maxEligible = groupedSettlements.length > 0
    ? Math.max(...groupedSettlements.map((g: any) => g.summary.eligible || 0))
    : 0;

  const totalEligiblePaise = settlementSummary?.eligible ?? (groupedSettlements.reduce((sum: number, g: any) => sum + (g.summary?.eligible || 0), 0));
  const totalHoldPaise = settlementSummary?.hold ?? (groupedSettlements.reduce((sum: number, g: any) => sum + (g.summary?.hold || 0), 0));

  return (
    <div className="space-y-6">
       {settlementSummary && (
          <>
             <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 shadow-xl text-white mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-emerald-400/30 relative overflow-hidden">
                <div className="space-y-1 z-10">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-100 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                      This Cycle Payout Total to Pay
                   </h3>
                   <div className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm flex items-baseline gap-3">
                      <span>₹{(totalEligiblePaise / 100).toLocaleString()}</span>
                      {totalEligiblePaise > 0 ? (
                         <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full border border-white/30 uppercase tracking-wider">
                           Ready for Transfer
                         </span>
                      ) : (
                         <span className="text-xs font-bold bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-wider">
                           0 Pending Transfer
                         </span>
                      )}
                   </div>
                   <p className="text-xs text-emerald-100/90 font-medium pt-1">
                      📦 Total Pool on Hold (7-Day Return Window): <strong className="text-white font-black">₹{(totalHoldPaise / 100).toLocaleString()}</strong>
                   </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0 z-10">
                   <DollarSign size={28} className="text-white" />
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-card border border-border rounded-2xl p-4">
                   <p className="text-[10px] uppercase font-bold text-muted">Total on Hold</p>
                   <p className="text-lg font-bold text-orange-500 mt-1">₹{(settlementSummary.hold / 100).toLocaleString()}</p>
                </div>
                <div className="bg-surface-card border border-border rounded-2xl p-4">
                   <p className="text-[10px] uppercase font-bold text-muted">Eligible for Payout</p>
                   <p className="text-lg font-bold text-emerald-500 mt-1">₹{(settlementSummary.eligible / 100).toLocaleString()}</p>
                </div>
                <div className="bg-surface-card border border-border rounded-2xl p-4">
                   <p className="text-[10px] uppercase font-bold text-muted">Total Settled</p>
                   <p className="text-lg font-bold text-blue-500 mt-1">₹{(settlementSummary.settled / 100).toLocaleString()}</p>
                </div>
                <div className="bg-surface-card border border-border rounded-2xl p-4">
                   <p className="text-[10px] uppercase font-bold text-muted">Disputed</p>
                   <p className="text-lg font-bold text-red-500 mt-1">₹{(settlementSummary.disputed / 100).toLocaleString()}</p>
                </div>
             </div>
          </>
       )}

       {/* Settlements Analytics Section */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payout Pool Distribution */}
          <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
             <h4 className="font-bold text-xs uppercase tracking-wider text-heading flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span> Payout Pool Distribution
             </h4>
             <div className="space-y-3">
                {[
                   { label: "Eligible Payouts", amount: eligibleVal, pct: eligiblePct, color: "bg-emerald-500" },
                   { label: "On Hold", amount: holdVal, pct: holdPct, color: "bg-orange-500" },
                   { label: "Total Settled", amount: settledVal, pct: settledPct, color: "bg-blue-500" },
                   { label: "Disputed", amount: disputedVal, pct: disputedPct, color: "bg-red-500" },
                ].map((item, i) => (
                   <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                         <span className="text-muted">{item.label} (₹{(item.amount / 100).toLocaleString()})</span>
                         <span className="text-heading">{item.pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden">
                         <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Top Vendor Payout Share */}
          <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
             <h4 className="font-bold text-xs uppercase tracking-wider text-heading flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span> Top Vendor Payout Shares (Eligible)
             </h4>
             <div className="space-y-3">
                {groupedSettlements.length === 0 ? (
                   <div className="text-center py-8 text-xs text-muted italic">
                      No active payouts available.
                   </div>
                ) : (
                   groupedSettlements.slice(0, 4).map((g: any, idx: number) => {
                      const vendorName = g.vendor.storeName || g.vendor.companyName || g.vendor.name;
                      const eligibleAmount = g.summary.eligible || 0;
                      const vendorPct = maxEligible > 0 ? Math.round((eligibleAmount / maxEligible) * 100) : 0;
                      return (
                         <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                               <span className="text-muted truncate max-w-[180px]">{vendorName}</span>
                               <span className="text-heading">₹{(eligibleAmount / 100).toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vendorPct}%` }}></div>
                            </div>
                         </div>
                      );
                    })
                )}
             </div>
          </div>
       </div>

       {/* Settlements Actions & Search */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface p-4 rounded-2xl border border-border">
          <div className="relative w-full md:w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
             <input
                type="text"
                placeholder="Search vendors by name, email, or company..."
                value={settlementSearchQuery}
                onChange={(e) => setSettlementSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
             />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <button
                onClick={() => {
                   setCustomPayoutForm({vendorId: "", productId: "", amount: "", notes: "", testMode: false, isDirect: false});
                   setShowCustomPayoutModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors whitespace-nowrap"
             >
                <DollarSign size={16} />
                Custom Payout
             </button>
             <div className="text-xs text-muted">
                {excludedVendorIds.length > 0 && <span className="text-amber-500 font-bold">{excludedVendorIds.length} Excluded</span>}
             </div>
             <button
                onClick={async () => {
                   const eligibleVendors = groupedSettlements.filter((g:any) => g.summary.eligible > 0);
                   const vendorsToPay = eligibleVendors.filter((g:any) => !excludedVendorIds.includes(g.vendor.id)).map((g:any) => g.vendor.id);
                   
                   if (vendorsToPay.length === 0) {
                      showToast("No eligible vendors selected for payout.", "error");
                      return;
                   }

                   setIsProcessingPayout("global");
                   try {
                      const res = await fetch("/api/admin/settlements/payout", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ vendorIds: vendorsToPay, payoutType: "prepaid" })
                      });
                      const data = await res.json();
                      if (res.ok) {
                         showToast(data.message || "Bulk payout processed successfully", "success");
                         fetchData();
                      } else {
                         showToast(data.error || "Failed to process bulk payout", "error");
                      }
                   } catch (e) {
                      showToast("Error processing bulk payout", "error");
                   } finally {
                      setIsProcessingPayout(null);
                   }
                }}
                disabled={!!isProcessingPayout}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap"
             >
                {isProcessingPayout === "global" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                Global Prepaid Payout (Razorpay)
             </button>
             <button
                 onClick={async () => {
                    setIsProcessingPayout("global_cod");
                    try {
                       const res = await fetch("/api/admin/settlements/payout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ payoutType: "cod" })
                       });
                       const data = await res.json();
                       if (res.ok) {
                          showToast(data.message || "Bulk COD payout processed successfully", "success");
                          fetchData();
                       } else {
                          showToast(data.error || "Failed to process bulk COD payout", "error");
                       }
                    } catch (e) {
                       showToast("Error processing bulk COD payout", "error");
                    } finally {
                       setIsProcessingPayout(null);
                    }
                 }}
                 disabled={!!isProcessingPayout}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                 {isProcessingPayout === "global_cod" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                 Global COD Payout (Razorpay)
              </button>

              <button
                 onClick={async () => {
                    const eligibleVendors = groupedSettlements.filter((g:any) => g.summary.eligible > 0);
                    const vendorsToPay = eligibleVendors.filter((g:any) => !excludedVendorIds.includes(g.vendor.id)).map((g:any) => g.vendor.id);
                    
                    if (vendorsToPay.length === 0) {
                       showToast("No eligible vendors selected for payout.", "error");
                       return;
                    }

                    setIsProcessingPayout("test_prepaid");
                    try {
                       const res = await fetch("/api/admin/settlements/payout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ vendorIds: vendorsToPay, payoutType: "prepaid", testMode: true })
                       });
                       const data = await res.json();
                       if (res.ok) {
                          showToast(data.message || "Mock Prepaid payout processed successfully", "success");
                          fetchData();
                       } else {
                          showToast(data.error || "Failed to process mock Prepaid payout", "error");
                       }
                    } catch (e) {
                       showToast("Error processing mock Prepaid payout", "error");
                    } finally {
                       setIsProcessingPayout(null);
                    }
                 }}
                 disabled={!!isProcessingPayout}
                 className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                 {isProcessingPayout === "test_prepaid" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                 Test Payout (Prepaid Mock)
              </button>

              <button
                 onClick={async () => {
                    setIsProcessingPayout("test_cod");
                    try {
                       const res = await fetch("/api/admin/settlements/payout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ payoutType: "cod", testMode: true })
                       });
                       const data = await res.json();
                       if (res.ok) {
                          showToast(data.message || "Mock COD payout processed successfully", "success");
                          fetchData();
                       } else {
                          showToast(data.error || "Failed to process mock COD payout", "error");
                       }
                    } catch (e) {
                       showToast("Error processing mock COD payout", "error");
                    } finally {
                       setIsProcessingPayout(null);
                    }
                 }}
                 disabled={!!isProcessingPayout}
                 className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                 {isProcessingPayout === "test_cod" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                 Test Payout (COD Mock)
              </button>
          </div>
       </div>

       {/* Existing Vendors List Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedSettlements.filter((g: any) => {
             if (!settlementSearchQuery.trim()) return true;
             const q = settlementSearchQuery.toLowerCase();
             return (
                g.vendor.name?.toLowerCase().includes(q) ||
                g.vendor.email?.toLowerCase().includes(q) ||
                g.vendor.companyName?.toLowerCase().includes(q) ||
                g.vendor.storeName?.toLowerCase().includes(q)
             );
          }).map((group: any) => (
             <div key={group.vendor.id} className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div className="flex gap-4 items-start mb-6">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-border bg-surface flex items-center justify-center">
                      {group.vendor.logo ? <img src={group.vendor.logo} alt="Logo" className="w-full h-full object-cover"/> : <Store size={24} className="text-muted"/>}
                   </div>
                   <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <h3 className="font-bold text-heading">{group.vendor.storeName || group.vendor.companyName || group.vendor.name}</h3>
                          {group.summary.eligible > 0 && (
                             <label className="flex items-center gap-1.5 cursor-pointer" title="Include in Global Payout">
                                <input 
                                   type="checkbox" 
                                   checked={!excludedVendorIds.includes(group.vendor.id)}
                                   onChange={(e) => {
                                      if (e.target.checked) {
                                         setExcludedVendorIds((prev: any) => prev.filter((id: any) => id !== group.vendor.id));
                                      } else {
                                         setExcludedVendorIds((prev: any) => [...prev, group.vendor.id]);
                                      }
                                   }}
                                   className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-border"
                                />
                             </label>
                          )}
                       </div>
                       <p className="text-xs text-muted mb-1">{group.vendor.email}</p>
                       <p className="text-[10px] text-muted flex items-center gap-1"><Phone size={10}/> {group.vendor.phone}</p>
                       {(group.vendor.city || group.vendor.state) && <p className="text-[10px] text-muted flex items-center gap-1 mt-1"><MapPin size={10}/> {group.vendor.city}, {group.vendor.state}</p>}
                    </div>
                </div>
                
                <div className="bg-surface rounded-2xl p-4 border border-border mb-4">
                   <p className="text-[10px] uppercase font-bold text-muted mb-1 text-center tracking-widest">Total Eligible Payout</p>
                   <p className="text-3xl font-black text-center text-emerald-500">₹{(group.summary.eligible / 100).toLocaleString()}</p>
                   <div className="flex justify-between mt-3 text-[10px] font-bold border-t border-border/50 pt-2">
                      <span className="text-amber-500">On Hold: ₹{(group.summary.hold / 100).toLocaleString()}</span>
                      <span className="text-blue-500">Settled: ₹{(group.summary.settled / 100).toLocaleString()}</span>
                   </div>
                </div>

                <button 
                   onClick={() => setSelectedVendorSettlement(group)}
                   className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-colors"
                >
                   View All Eligible Orders
                </button>
             </div>
          ))}
       </div>

       {/* CUSTOM PAYOUT MODAL */}
       <AnimatePresence>
          {showCustomPayoutModal && (
             <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomPayoutModal(false)}/>
                <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="bg-surface-card border border-border rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col relative z-10 overflow-hidden shadow-2xl">
                   <div className="p-6 border-b border-border flex justify-between items-center bg-surface shrink-0">
                      <div>
                         <h2 className="text-xl font-bold text-heading">Custom Vendor Payout</h2>
                         <p className="text-xs text-muted">Process a custom Razorpay payment</p>
                      </div>
                      <button onClick={() => setShowCustomPayoutModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-border transition-colors text-muted">
                         <X size={16}/>
                      </button>
                   </div>
                   <div className="p-6 overflow-y-auto space-y-4">
                      {!customPayoutForm.isDirect && (
                         <>
                            <div>
                               <label className="text-xs font-bold uppercase text-muted mb-1 block">Select Vendor</label>
                               <select 
                                  value={customPayoutForm.vendorId}
                                  onChange={(e) => setCustomPayoutForm({...customPayoutForm, vendorId: e.target.value, productId: ""})}
                                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm"
                               >
                                  <option value="">-- Choose Vendor --</option>
                                  {vendors.map((v: any) => (
                                     <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
                                  ))}
                               </select>
                            </div>
                            {customPayoutForm.vendorId && (
                               <div>
                                  <label className="text-xs font-bold uppercase text-muted mb-1 block">Related Product (Optional)</label>
                                  <select 
                                     value={customPayoutForm.productId}
                                     onChange={(e) => setCustomPayoutForm({...customPayoutForm, productId: e.target.value})}
                                     className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm"
                                  >
                                     <option value="">-- No Specific Product --</option>
                                     {products.filter((p: any) => p.vendorId === parseInt(customPayoutForm.vendorId)).map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                     ))}
                                  </select>
                               </div>
                            )}
                         </>
                      )}
                      <div>
                         <label className="text-xs font-bold uppercase text-muted mb-1 block">Amount (INR)</label>
                         <input 
                            type="number" 
                            value={customPayoutForm.amount}
                            onChange={(e) => setCustomPayoutForm({...customPayoutForm, amount: e.target.value})}
                            placeholder="e.g. 5000"
                            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm"
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold uppercase text-muted mb-1 block">Admin Notes</label>
                         <textarea 
                            value={customPayoutForm.notes}
                            onChange={(e) => setCustomPayoutForm({...customPayoutForm, notes: e.target.value})}
                            placeholder="Reason for custom payout..."
                            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm"
                            rows={3}
                         />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer mt-2">
                         <input 
                            type="checkbox"
                            checked={customPayoutForm.testMode}
                            onChange={(e) => setCustomPayoutForm({...customPayoutForm, testMode: e.target.checked})}
                            className="w-4 h-4 text-orange-500 rounded border-border"
                         />
                         <span className="text-sm font-bold text-heading">Test Mode (Mock Payout)</span>
                      </label>
                   </div>
                   <div className="p-6 border-t border-border bg-surface flex justify-end gap-3 shrink-0">
                      <button onClick={() => setShowCustomPayoutModal(false)} className="px-5 py-2.5 text-muted hover:text-heading font-bold text-sm">Cancel</button>
                      <button 
                         disabled={isSubmittingCustomPayout || !customPayoutForm.vendorId || !customPayoutForm.amount}
                         onClick={async () => {
                            setIsSubmittingCustomPayout(true);
                            try {
                               const res = await fetch("/api/admin/settlements/custom-payout", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                     vendorId: customPayoutForm.vendorId,
                                     productId: customPayoutForm.productId || null,
                                     amountPaise: Math.round(parseFloat(customPayoutForm.amount) * 100),
                                     notes: customPayoutForm.notes,
                                     testMode: customPayoutForm.testMode,
                                     settlementId: customPayoutForm.settlementId || null
                                  })
                               });
                               const data = await res.json();
                               if (res.ok) {
                                  showToast(data.message || "Custom payout processed", "success");
                                  setShowCustomPayoutModal(false);
                                  setCustomPayoutForm({vendorId: "", productId: "", amount: "", notes: "", testMode: false, isDirect: false, settlementId: ""});
                                  fetchData();
                               } else {
                                  showToast(data.error || "Failed to process custom payout", "error");
                               }
                            } catch (e) {
                               showToast("Network error", "error");
                            } finally {
                               setIsSubmittingCustomPayout(false);
                            }
                         }}
                         className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center gap-2"
                      >
                         {isSubmittingCustomPayout ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                         Process Payout
                      </button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
       {/* VENDOR SETTLEMENT MODAL */}
       <AnimatePresence mode="wait">
          {selectedVendorSettlement && (
             <div key="vendor-settlement-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedVendorSettlement(null)}/>
                <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="bg-surface-card border border-border rounded-3xl w-full max-w-6xl relative z-10 shadow-2xl" style={{display:'flex', flexDirection:'column', maxHeight:'90vh', overflow:'hidden'}}>
                         {/* Header */}
                         <div className="p-6 border-b border-border flex justify-between items-center bg-surface" style={{flexShrink:0}}>
                            <div className="flex gap-4 items-center">
                               <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border bg-background flex items-center justify-center">
                                  {selectedVendorSettlement.vendor.logo ? <img src={selectedVendorSettlement.vendor.logo} alt="Logo" className="w-full h-full object-cover"/> : <Store size={20} className="text-muted"/>}
                               </div>
                               <div>
                                  <h2 className="text-xl font-bold text-heading">{selectedVendorSettlement.vendor.storeName || selectedVendorSettlement.vendor.companyName || selectedVendorSettlement.vendor.name}</h2>
                                  <p className="text-xs text-muted">Eligible Payout Invoice</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <button 
                                  type="button"
                                  onClick={(e) => {
                                     e.preventDefault();
                                     e.stopPropagation();
                                     setShowHistoryModal(true);
                                     setVisibleHistoryLimit(10);
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer z-50 pointer-events-auto active:scale-95"
                               >
                                  <History size={14} />
                                  <span>Settlement History</span>
                               </button>
                               <button 
                                   type="button"
                                   onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSelectedVendorSettlement(null);
                                      setShowHistoryModal(false);
                                   }} 
                                   className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-card hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-muted hover:text-heading cursor-pointer z-50 border border-border"
                                   title="Close Modal"
                                >
                                   <X size={18}/>
                                </button>
                            </div>
                         </div>

                         {/* Payout Banner */}
                         <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{flexShrink:0}}>
                            <div className="flex flex-col">
                               <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Amount to Pay</p>
                               <p className="text-4xl font-black text-emerald-500">₹{(selectedVendorSettlement.summary.eligible / 100).toLocaleString()}</p>
                               <div className="flex gap-4 mt-2">
                                  <p className="text-xs font-bold text-emerald-700 bg-emerald-500/20 px-2 py-1 rounded">
                                     Prepaid: ₹{(selectedVendorSettlement.settlements.filter((s:any) => s.status === 'ELIGIBLE' && (s.order?.paymentMethod === 'razorpay' || s.order?.paymentMethod === 'payu')).reduce((acc: number, s: any) => acc + s.vendorPayoutPaise, 0) / 100).toLocaleString()}
                                  </p>
                                  <p className="text-xs font-bold text-amber-700 bg-amber-500/20 px-2 py-1 rounded">
                                     COD: ₹{(selectedVendorSettlement.settlements.filter((s:any) => s.status === 'ELIGIBLE' && s.order?.paymentMethod === 'cod').reduce((acc: number, s: any) => acc + s.vendorPayoutPaise, 0) / 100).toLocaleString()}
                                  </p>
                               </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                               {selectedVendorSettlement.settlements.some((s:any) => s.status === 'ELIGIBLE' && (s.order?.paymentMethod === 'razorpay' || s.order?.paymentMethod === 'payu')) && (
                                  <button
                                     onClick={async () => {
                                        setIsProcessingPayout("razorpay");
                                        try {
                                           const res = await fetch("/api/admin/settlements/payout", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ vendorIds: [selectedVendorSettlement.vendor.id], payoutType: "prepaid" })
                                           });
                                           const data = await res.json();
                                           if (res.ok) {
                                              showToast(data.message || "Payout processed successfully", "success");
                                              fetchData();
                                              setSelectedVendorSettlement(null);
                                           } else {
                                              showToast(data.error || "Failed to process payout", "error");
                                           }
                                        } catch (e) {
                                           showToast("Error processing payout", "error");
                                        } finally {
                                           setIsProcessingPayout(null);
                                        }
                                     }}
                                     disabled={!!isProcessingPayout}
                                     className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                  >
                                     {isProcessingPayout === "razorpay" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                                     Razorpay Payout
                                  </button>
                               )}

                               {selectedVendorSettlement.settlements.some((s:any) => s.status === 'ELIGIBLE' && (s.order?.paymentMethod === 'razorpay' || s.order?.paymentMethod === 'payu')) && (
                                  <button
                                     onClick={async () => {
                                        setIsProcessingPayout("test_razorpay");
                                        try {
                                           const res = await fetch("/api/admin/settlements/payout", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ vendorIds: [selectedVendorSettlement.vendor.id], payoutType: "prepaid", testMode: true })
                                           });
                                           const data = await res.json();
                                           if (res.ok) {
                                              showToast(data.message || "Mock Prepaid Payout processed successfully", "success");
                                              fetchData();
                                              setSelectedVendorSettlement(null);
                                           } else {
                                              showToast(data.error || "Failed to process mock payout", "error");
                                           }
                                        } catch (e) {
                                           showToast("Error processing mock payout", "error");
                                        } finally {
                                           setIsProcessingPayout(null);
                                        }
                                     }}
                                     disabled={!!isProcessingPayout}
                                     className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                  >
                                     {isProcessingPayout === "test_razorpay" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                                     Test Prepaid (Mock)
                                  </button>
                               )}

                               {selectedVendorSettlement.settlements.some((s:any) => s.status === 'ELIGIBLE' && s.order?.paymentMethod === 'cod') && (
                                  <button
                                     onClick={async () => {
                                        setIsProcessingPayout("cod");
                                        try {
                                           const res = await fetch("/api/admin/settlements/payout", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ vendorIds: [selectedVendorSettlement.vendor.id], payoutType: "cod" })
                                           });
                                           const data = await res.json();
                                           if (res.ok) {
                                              showToast(data.message || "Payout processed successfully", "success");
                                              fetchData();
                                              setSelectedVendorSettlement(null);
                                           } else {
                                              showToast(data.error || "Failed to process payout", "error");
                                           }
                                        } catch (e) {
                                           showToast("Error processing payout", "error");
                                        } finally {
                                           setIsProcessingPayout(null);
                                        }
                                     }}
                                     disabled={!!isProcessingPayout}
                                     className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                  >
                                     {isProcessingPayout === "cod" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                                     Automated COD Payout (Razorpay)
                                  </button>
                               )}

                               {selectedVendorSettlement.settlements.some((s:any) => s.status === 'ELIGIBLE' && s.order?.paymentMethod === 'cod') && (
                                  <button
                                     onClick={async () => {
                                        setIsProcessingPayout("test_cod_vendor");
                                        try {
                                           const res = await fetch("/api/admin/settlements/payout", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ vendorIds: [selectedVendorSettlement.vendor.id], payoutType: "cod", testMode: true })
                                           });
                                           const data = await res.json();
                                           if (res.ok) {
                                              showToast(data.message || "Mock COD Payout processed successfully", "success");
                                              fetchData();
                                              setSelectedVendorSettlement(null);
                                           } else {
                                              showToast(data.error || "Failed to process mock payout", "error");
                                           }
                                        } catch (e) {
                                           showToast("Error processing mock payout", "error");
                                        } finally {
                                           setIsProcessingPayout(null);
                                        }
                                     }}
                                     disabled={!!isProcessingPayout}
                                     className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                  >
                                     {isProcessingPayout === "test_cod_vendor" ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                                     Test COD (Mock)
                                  </button>
                               )}
                               
                               <button
                                  onClick={() => {
                                     setCustomPayoutForm({vendorId: String(selectedVendorSettlement.vendor.id), productId: "", amount: "", notes: "", testMode: false, isDirect: true, settlementId: ""});
                                     setShowCustomPayoutModal(true);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                               >
                                  <DollarSign size={16} />
                                  Custom Payout
                               </button>
                            </div>
                         </div>

                         {/* List of Products/Orders */}
                         <div style={{flex:1, minHeight:0, overflowY:'auto', overscrollBehavior:'contain'}}>
                            <div className="p-6">
                            <h3 className="text-sm font-bold text-heading mb-4">Eligible Orders Breakdown</h3>
                            <table className="w-full text-left text-xs">
                               <thead className="text-muted border-b border-border">
                                  <tr>
                                     <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Order #</th>
                                     <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                                     <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right pr-6">Order Value</th>
                                     <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right pr-6">Vendor Share</th>
                                     <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-border">
                                  {selectedVendorSettlement.settlements.filter((s:any) => s.status === 'ELIGIBLE' || s.status === 'HOLD').map((s:any) => (
                                     <tr key={s.id} className="hover:bg-surface-hover/50 transition-colors">
                                        <td className="py-4 font-bold text-orange-500">
                                           {s.order?.orderNumber}
                                           {s.order?.paymentMethod && (
                                              <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] bg-surface-card border border-border text-muted uppercase">
                                                 {s.order.paymentMethod === 'cod' ? 'COD' : 'PREPAID'}
                                              </span>
                                           )}
                                           {s.order?.items?.length > 0 && (
                                              <div className="mt-2 space-y-1">
                                                 {s.order.items.map((item: any) => (
                                                    <button 
                                                       key={item.id} 
                                                       onClick={() => setModalProduct(item.product)}
                                                       className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-600 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded w-fit"
                                                    >
                                                       <Eye size={10} /> View {item.product?.name ? item.product.name.substring(0, 20) + '...' : 'Product'}
                                                    </button>
                                                 ))}
                                              </div>
                                           )}
                                        </td>
                                        <td className="py-4">
                                           <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${s.status === 'HOLD' ? 'bg-amber-500/10 text-amber-600' : s.status === 'ELIGIBLE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                              {s.status}
                                           </span>
                                           {s.status === 'SETTLED' && s.vendorPaymentRef && (
                                             <div className="text-[10px] text-muted mt-1 font-mono break-all">
                                                UTR: {s.vendorPaymentRef}
                                             </div>
                                           )}
                                        </td>
                                        <td className="py-4 text-right font-medium text-slate-500 font-mono pr-6">₹{(s.orderAmountPaise/100).toLocaleString()}</td>
                                        <td className="py-4 text-right pr-6">
                                           <span className="inline-flex items-center bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                                              ₹{(s.vendorPayoutPaise/100).toLocaleString()}
                                           </span>
                                        </td>
                                        <td className="py-4 text-right flex justify-end gap-2">
                                           {s.status !== 'SETTLED' && (
                                              <button 
                                                 onClick={() => {
                                                    setCustomPayoutForm({vendorId: String(selectedVendorSettlement.vendor.id), productId: s.order?.items?.[0]?.product?.id ? String(s.order.items[0].product.id) : "", amount: String(s.vendorPayoutPaise / 100), notes: `Custom payout for Order #${s.order?.orderNumber || s.orderId}`, testMode: false, isDirect: true, settlementId: String(s.id)});
                                                    setShowCustomPayoutModal(true);
                                                 }}
                                                 title="Custom Payout for this Order"
                                                 className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg text-[10px] font-bold transition-colors shadow-sm flex items-center gap-1"
                                              >
                                                 <DollarSign size={12} />
                                                 Custom Pay
                                              </button>
                                           )}
                                           <button onClick={() => generateInvoice(s)} title="Download Commission Invoice" className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-bold transition-colors shadow-sm flex items-center gap-1">
                                             <Download size={12} />
                                             Invoice
                                           </button>
                                           {s.status === 'ELIGIBLE' && (s.order?.paymentMethod === 'razorpay' || s.order?.paymentMethod === 'payu') && (
                                              <>
                                                 <button 
                                                    disabled={!!isProcessingPayout}
                                                    onClick={async () => {
                                                       setIsProcessingPayout(`item_${s.id}`);
                                                       try {
                                                          const res = await fetch(`/api/admin/settlements/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "SETTLE_RAZORPAY" }) });
                                                          const data = await res.json();
                                                          if (res.ok) { 
                                                             fetchData(); 
                                                             setSelectedVendorSettlement((prev: any) => ({
                                                                ...prev,
                                                                summary: { ...prev.summary, eligible: prev.summary.eligible - s.vendorPayoutPaise },
                                                                settlements: prev.settlements.map((st: any) => st.id === s.id ? { ...st, status: 'PROCESSING', vendorPaymentRef: data.data?.vendorPaymentRef } : st)
                                                             }));
                                                             showToast("Razorpay Payout Processing", "success");
                                                          } else showToast(data.error || "Failed to settle", "error");
                                                       } catch (e) {
                                                          showToast("Error processing payout", "error");
                                                       } finally {
                                                          setIsProcessingPayout(null);
                                                       }
                                                    }} 
                                                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm whitespace-nowrap"
                                                 >
                                                    {isProcessingPayout === `item_${s.id}` ? <RefreshCcw size={12} className="animate-spin inline mr-1" /> : null}
                                                    Razorpay Payout
                                                 </button>
                                                 
                                                 <button 
                                                    disabled={!!isProcessingPayout}
                                                    onClick={async () => {
                                                       setIsProcessingPayout(`item_test_${s.id}`);
                                                       try {
                                                          const res = await fetch(`/api/admin/settlements/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "SETTLE_RAZORPAY", testMode: true }) });
                                                          const data = await res.json();
                                                          if (res.ok) { 
                                                             fetchData(); 
                                                             setSelectedVendorSettlement((prev: any) => ({
                                                                ...prev,
                                                                summary: { ...prev.summary, eligible: prev.summary.eligible - s.vendorPayoutPaise },
                                                                settlements: prev.settlements.map((st: any) => st.id === s.id ? { ...st, status: 'SETTLED', vendorPaymentRef: data.data?.vendorPaymentRef } : st)
                                                             }));
                                                             showToast("Mock Payout Successful", "success");
                                                          } else showToast(data.error || "Failed to settle", "error");
                                                       } catch (e) {
                                                          showToast("Error processing mock payout", "error");
                                                       } finally {
                                                          setIsProcessingPayout(null);
                                                       }
                                                    }} 
                                                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm whitespace-nowrap"
                                                 >
                                                    {isProcessingPayout === `item_test_${s.id}` ? <RefreshCcw size={12} className="animate-spin inline mr-1" /> : null}
                                                    Test Pay (Mock)
                                                 </button>
                                              </>
                                           )}
                                           {s.status === 'ELIGIBLE' && s.order?.paymentMethod === 'cod' && (
                                              <>
                                                 <button 
                                                    disabled={!!isProcessingPayout}
                                                    onClick={async () => {
                                                       setIsProcessingPayout(`item_${s.id}`);
                                                       try {
                                                          const res = await fetch(`/api/admin/settlements/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "SETTLE_RAZORPAY" }) });
                                                          const data = await res.json();
                                                          if (res.ok) { 
                                                             fetchData(); 
                                                             setSelectedVendorSettlement((prev: any) => ({
                                                                ...prev,
                                                                summary: { ...prev.summary, eligible: prev.summary.eligible - s.vendorPayoutPaise },
                                                                settlements: prev.settlements.map((st: any) => st.id === s.id ? { ...st, status: 'PROCESSING', vendorPaymentRef: data.data?.vendorPaymentRef } : st)
                                                             }));
                                                             showToast("Automated Payout Processing", "success");
                                                          } else showToast(data.error || "Failed to settle", "error");
                                                       } catch (e) {
                                                          showToast("Error processing payout", "error");
                                                       } finally {
                                                          setIsProcessingPayout(null);
                                                       }
                                                    }} 
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm whitespace-nowrap"
                                                 >
                                                    {isProcessingPayout === `item_${s.id}` ? <RefreshCcw size={12} className="animate-spin inline mr-1" /> : null}
                                                    Automated Payout
                                                 </button>
                                                 
                                                 <button 
                                                    disabled={!!isProcessingPayout}
                                                    onClick={async () => {
                                                       setIsProcessingPayout(`item_test_${s.id}`);
                                                       try {
                                                          const res = await fetch(`/api/admin/settlements/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "SETTLE_RAZORPAY", testMode: true }) });
                                                          const data = await res.json();
                                                          if (res.ok) { 
                                                             fetchData(); 
                                                             setSelectedVendorSettlement((prev: any) => ({
                                                                ...prev,
                                                                summary: { ...prev.summary, eligible: prev.summary.eligible - s.vendorPayoutPaise },
                                                                settlements: prev.settlements.map((st: any) => st.id === s.id ? { ...st, status: 'SETTLED', vendorPaymentRef: data.data?.vendorPaymentRef } : st)
                                                             }));
                                                             showToast("Mock COD Payout Successful", "success");
                                                          } else showToast(data.error || "Failed to settle", "error");
                                                       } catch (e) {
                                                          showToast("Error processing mock payout", "error");
                                                       } finally {
                                                          setIsProcessingPayout(null);
                                                       }
                                                    }} 
                                                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm whitespace-nowrap"
                                                 >
                                                    {isProcessingPayout === `item_test_${s.id}` ? <RefreshCcw size={12} className="animate-spin inline mr-1" /> : null}
                                                    Test Pay (Mock)
                                                 </button>
                                              </>
                                           )}
                                           {(s.status === 'ELIGIBLE' || s.status === 'HOLD') && (
                                              <button 
                                                 disabled={!!isProcessingPayout}
                                                 onClick={async () => {
                                                    const newStatus = s.status === 'ELIGIBLE' ? 'HOLD' : 'ELIGIBLE';
                                                    setIsProcessingPayout(`item_hold_${s.id}`);
                                                    try {
                                                       const res = await fetch(`/api/admin/settlements/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_STATUS", status: newStatus }) });
                                                       if (res.ok) { 
                                                          fetchData();
                                                          setSelectedVendorSettlement((prev: any) => ({
                                                             ...prev,
                                                             summary: { 
                                                                ...prev.summary, 
                                                                eligible: newStatus === 'ELIGIBLE' ? prev.summary.eligible + s.vendorPayoutPaise : prev.summary.eligible - s.vendorPayoutPaise, 
                                                                hold: newStatus === 'HOLD' ? prev.summary.hold + s.vendorPayoutPaise : prev.summary.hold - s.vendorPayoutPaise 
                                                             },
                                                             settlements: prev.settlements.map((st: any) => st.id === s.id ? { ...st, status: newStatus } : st)
                                                          }));
                                                          showToast(`Order marked as ${newStatus}`, "info");
                                                       } else showToast("Failed to update status", "error");
                                                    } catch (e) {
                                                       showToast("Error updating status", "error");
                                                    } finally {
                                                       setIsProcessingPayout(null);
                                                    }
                                                 }} 
                                                 className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50 ${s.status === 'ELIGIBLE' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'}`}
                                              >
                                                 {isProcessingPayout === `item_hold_${s.id}` ? <RefreshCcw size={12} className="animate-spin inline mr-1" /> : null}
                                                 {s.status === 'ELIGIBLE' ? "Hold" : "Release"}
                                              </button>
                                           )}
                                        </td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                          </div>
                         </div>
                      </motion.div>
                   </div>
                )}
             </AnimatePresence>

              {/* VENDOR SETTLEMENT HISTORY MODAL */}
              <AnimatePresence mode="wait">
                 {showHistoryModal && selectedVendorSettlement && (
                    <div key="history-settlement-modal" className="fixed inset-0 z-[150] flex items-center justify-center p-4 pointer-events-auto">
                       <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowHistoryModal(false)}/>
                       <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="bg-surface-card border border-border rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl" style={{display:'flex', flexDirection:'column', maxHeight:'80vh', overflow:'hidden'}}>
                          {/* Header */}
                          <div className="p-6 border-b border-border flex justify-between items-center bg-surface shrink-0">
                             <div>
                                <h2 className="text-xl font-bold text-heading">Settlement History</h2>
                                <p className="text-xs text-muted">
                                   History of settled payouts for {selectedVendorSettlement.vendor.storeName || selectedVendorSettlement.vendor.name}
                                </p>
                             </div>
                             <div className="flex items-center gap-3">
                                <button 
                                   disabled={isDeletingHistory}
                                   onClick={async () => {
                                      if (!confirm("Are you sure you want to delete ALL settled records older than 1 month? This cannot be undone.")) return;
                                      setIsDeletingHistory(true);
                                      try {
                                         const res = await fetch("/api/admin/settlements", { method: "DELETE" });
                                         const data = await res.json();
                                         if (res.ok) {
                                            showToast(data.message || "History cleared successfully", "success");
                                            fetchData();
                                         } else {
                                            showToast(data.error || "Failed to delete history", "error");
                                         }
                                      } catch (e) {
                                         showToast("Network error", "error");
                                      } finally {
                                         setIsDeletingHistory(false);
                                      }
                                   }}
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                                >
                                   {isDeletingHistory ? <RefreshCcw size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                   Clear Old History (&gt; 1 Month)
                                </button>
                                <button 
                                   type="button"
                                   onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowHistoryModal(false);
                                   }} 
                                   className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-card hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-muted hover:text-heading cursor-pointer z-50 border border-border"
                                   title="Close History"
                                >
                                   <X size={18}/>
                                </button>
                             </div>
                          </div>

                          {/* Tabs */}
                          <div className="flex border-b border-border bg-surface px-6 shrink-0 gap-6">
                             <button
                                onClick={() => setHistoryActiveTab("orders")}
                                className={`py-3.5 text-xs font-bold uppercase tracking-wider relative transition-colors ${historyActiveTab === "orders" ? "text-indigo-600" : "text-muted hover:text-heading"}`}
                             >
                                Order Payouts ({selectedVendorSettlement.settlements.filter((s: any) => s.status === 'SETTLED').length})
                                {historyActiveTab === "orders" && (
                                   <motion.div layoutId="historyActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                                )}
                             </button>
                             <button
                                onClick={() => setHistoryActiveTab("custom")}
                                className={`py-3.5 text-xs font-bold uppercase tracking-wider relative transition-colors ${historyActiveTab === "custom" ? "text-indigo-600" : "text-muted hover:text-heading"}`}
                             >
                                Custom Payouts ({selectedVendorSettlement.customPayouts?.length || 0})
                                {historyActiveTab === "custom" && (
                                   <motion.div layoutId="historyActiveTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                                )}
                             </button>
                          </div>

                          {/* Content */}
                          <div style={{flex:1, minHeight:0, overflowY:'auto', overscrollBehavior:'contain'}} className="p-6">
                             {historyActiveTab === "orders" ? (() => {
                                const settledList = selectedVendorSettlement.settlements.filter((s: any) => s.status === 'SETTLED');
                                
                                if (settledList.length === 0) {
                                   return (
                                      <div className="py-12 text-center text-muted">
                                         <History size={40} className="mx-auto text-muted/40 mb-3" />
                                         <p className="font-bold">No settled history found</p>
                                         <p className="text-xs mt-1">Processed payouts will appear here.</p>
                                      </div>
                                   );
                                }

                                const displayedList = settledList.slice(0, visibleHistoryLimit);

                                return (
                                   <div className="space-y-4">
                                      <div className="overflow-x-auto">
                                         <table className="w-full text-left text-xs">
                                            <thead className="text-muted border-b border-border">
                                               <tr>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Order #</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Settled At</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">UTR/Reference</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right pr-6">Order Value</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right pr-6">Vendor Share</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Invoice</th>
                                               </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                               {displayedList.map((s: any) => (
                                                  <tr key={s.id} className="hover:bg-surface-hover/50 transition-colors">
                                                     <td className="py-4 font-bold text-orange-500">{s.order?.orderNumber || s.orderId}</td>
                                                     <td className="py-4 text-muted">{s.settledAt ? new Date(s.settledAt).toLocaleDateString() : 'N/A'}</td>
                                                     <td className="py-4 font-mono text-heading text-[10px] break-all">{s.vendorPaymentRef || '-'}</td>
                                                     <td className="py-4 text-right font-medium text-slate-500 font-mono pr-6">₹{(s.orderAmountPaise/100).toLocaleString()}</td>
                                                     <td className="py-4 text-right pr-6">
                                                        <span className="inline-flex items-center bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                                                           ₹{(s.vendorPayoutPaise/100).toLocaleString()}
                                                        </span>
                                                     </td>
                                                     <td className="py-4 text-right">
                                                        <button onClick={() => generateInvoice(s)} title="Download Commission Invoice" className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-bold transition-colors shadow-sm inline-flex items-center gap-1">
                                                           <Download size={10} /> Invoice
                                                        </button>
                                                     </td>
                                                  </tr>
                                               ))}
                                            </tbody>
                                         </table>
                                      </div>
                                      
                                      {settledList.length > visibleHistoryLimit && (
                                         <div className="flex justify-center pt-4 border-t border-border">
                                            <button 
                                               onClick={() => setVisibleHistoryLimit((prev: number) => prev + 10)}
                                               className="px-5 py-2 bg-surface hover:bg-border text-heading border border-border rounded-xl text-xs font-bold transition-colors shadow-sm"
                                            >
                                               Load More Settled Orders
                                            </button>
                                         </div>
                                      )}
                                   </div>
                                );
                             })() : (() => {
                                const customPayouts = selectedVendorSettlement.customPayouts || [];
                                
                                if (customPayouts.length === 0) {
                                   return (
                                      <div className="py-12 text-center text-muted">
                                         <DollarSign size={40} className="mx-auto text-muted/40 mb-3" />
                                         <p className="font-bold">No custom payouts found</p>
                                         <p className="text-xs mt-1">Processed custom payouts will appear here.</p>
                                      </div>
                                   );
                                }

                                const displayedCustom = customPayouts.slice(0, visibleCustomLimit);

                                return (
                                   <div className="space-y-4">
                                      <div className="overflow-x-auto">
                                         <table className="w-full text-left text-xs">
                                            <thead className="text-muted border-b border-border">
                                               <tr>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Date</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Product</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right pr-6">Amount</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Status/Ref</th>
                                                  <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Notes</th>
                                               </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                               {displayedCustom.map((cp: any) => (
                                                  <tr key={cp.id} className="hover:bg-surface-hover/50 transition-colors">
                                                     <td className="py-4">{new Date(cp.createdAt).toLocaleDateString()}</td>
                                                     <td className="py-4 text-muted">{cp.product?.name || "N/A"}</td>
                                                     <td className="py-4 text-right pr-6 font-bold text-indigo-500 font-mono">₹{(cp.amountPaise/100).toLocaleString()}</td>
                                                     <td className="py-4">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600">
                                                           {cp.status}
                                                        </span>
                                                        <div className="text-[10px] text-muted mt-1 font-mono break-all">{cp.paymentRef}</div>
                                                     </td>
                                                     <td className="py-4 text-right text-muted max-w-[150px] truncate" title={cp.notes}>{cp.notes || "-"}</td>
                                                  </tr>
                                               ))}
                                            </tbody>
                                         </table>
                                      </div>
                                      
                                      {customPayouts.length > visibleCustomLimit && (
                                         <div className="flex justify-center pt-4 border-t border-border">
                                            <button 
                                               onClick={() => setVisibleCustomLimit((prev: number) => prev + 10)}
                                               className="px-5 py-2 bg-surface hover:bg-border text-heading border border-border rounded-xl text-xs font-bold transition-colors shadow-sm"
                                            >
                                               Load More Custom Payouts
                                            </button>
                                         </div>
                                      )}
                                   </div>
                                );
                             })()}
                          </div>
                       </motion.div>
                    </div>
                 )}
              </AnimatePresence>
    </div>
  );
};
