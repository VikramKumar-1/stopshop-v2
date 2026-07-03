"use client";
import React, { useState, useEffect } from "react";
import { Target, Gift, Clock, ShoppingCart, Heart, Send, CheckCircle2, User, X, ChevronLeft, ChevronRight, Layers, Crown, IndianRupee } from "lucide-react";

export const TargetedRetargetingPanel = ({ vendorId }: { vendorId: number }) => {
  const [activeTab, setActiveTab] = useState<"abandoned" | "loyal">("abandoned");

  const [intents, setIntents] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loyalCustomers, setLoyalCustomers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  // Pagination State for Abandoned Carts
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIntents, setTotalIntents] = useState(0);

  // Pagination State for Loyal Customers
  const [loyalPage, setLoyalPage] = useState(1);
  const [loyalTotalPages, setLoyalTotalPages] = useState(1);
  const [loyalTotalCustomers, setLoyalTotalCustomers] = useState(0);

  const [selectedIntent, setSelectedIntent] = useState<any | null>(null); // For targeting abandoned
  const [selectedLoyal, setSelectedLoyal] = useState<any | null>(null);   // For targeting loyal
  const [showBulkModal, setShowBulkModal] = useState<"abandoned" | "loyal" | null>(null);
  
  const [viewProductsModal, setViewProductsModal] = useState<{title: string, products: any[]} | null>(null);

  const [offerData, setOfferData] = useState({ discountPct: "10", discountAmt: "", expiresAtHours: "48" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchData(page, loyalPage);
  }, [vendorId, page, loyalPage]);

  const fetchData = async (currentPage: number, currentLoyalPage: number) => {
    setLoading(true);
    try {
      const [iRes, oRes, lRes] = await Promise.all([
        fetch(`/api/intents?page=${currentPage}&limit=10`),
        fetch("/api/targeted-offers"),
        fetch(`/api/loyal-customers?page=${currentLoyalPage}&limit=10`)
      ]);
      
      if (iRes.ok) {
        const iData = await iRes.json();
        setIntents(iData.intents || []);
        if (iData.pagination) {
          setTotalPages(iData.pagination.totalPages);
          setTotalIntents(iData.pagination.total);
        }
      } else {
        const errText = await iRes.text();
        console.error("Intents API Error:", iRes.status, errText);
        alert(`Intents API Failed: ${iRes.status} - ${errText}`);
      }
      
      if (oRes.ok) {
        setOffers(await oRes.json());
      } else {
        console.error("Offers API Error:", await oRes.text());
      }
      if (lRes.ok) {
        const lData = await lRes.json();
        setLoyalCustomers(lData.customers || []);
        if (lData.pagination) {
          setLoyalTotalPages(lData.pagination.totalPages);
          setLoyalTotalCustomers(lData.pagination.total);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const val = parseFloat(offerData.discountPct || offerData.discountAmt);
      if (isNaN(val) || val <= 0) {
        alert("Please enter a valid positive discount value!");
        setSending(false);
        return;
      }

      let payload: any = {
        discountPct: offerData.discountPct,
        discountAmt: offerData.discountAmt,
        expiresAtHours: offerData.expiresAtHours
      };

      if (selectedIntent) {
        // Grouped Cart logic
        payload.intentIds = selectedIntent.intentIds;
        payload.dismissIntentIds = selectedIntent.intentIds;
      } else if (selectedLoyal) {
        payload.userIds = [selectedLoyal.userId];
      } else {
        return;
      }

      const res = await fetch("/api/targeted-offers/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setSelectedIntent(null);
        setSelectedLoyal(null);
        fetchData(page, loyalPage);
      } else {
        alert("Failed to send offer");
      }
    } catch (err) {
      alert("Error sending offer");
    } finally {
      setSending(false);
    }
  };

  const handleBulkSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const val = parseFloat(offerData.discountPct || offerData.discountAmt);
      if (isNaN(val) || val <= 0) {
        alert("Please enter a valid positive discount value!");
        setSending(false);
        return;
      }

      let payload: any = {
        discountPct: offerData.discountPct,
        discountAmt: offerData.discountAmt,
        expiresAtHours: offerData.expiresAtHours
      };

      if (showBulkModal === "abandoned") {
        if (intents.length === 0) return;
        // Collect all intentIds for the products in abandoned carts
        payload.intentIds = intents.flatMap(group => group.intentIds);
        payload.dismissIntentIds = payload.intentIds;
      } else if (showBulkModal === "loyal") {
        if (loyalCustomers.length === 0) return;
        payload.userIds = loyalCustomers.map(c => c.userId);
      }

      const res = await fetch("/api/targeted-offers/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowBulkModal(null);
        fetchData(1, 1);
      } else {
        alert("Failed to send bulk offers");
      }
    } catch (err) {
      alert("Error sending bulk offers");
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = async (intentId: number, silent = false) => {
    try {
      await fetch("/api/intents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intentId, action: "DISMISS" })
      });
      if (!silent) {
        setIntents(prev => prev.filter(i => i.id !== intentId));
      }
    } catch (err) {
      console.error("Failed to dismiss intent", err);
    }
  };

  // Filter out intents that already have an active offer for the same user + product
  const activeOffers = offers.filter(o => !o.isClaimed && new Date(o.expiresAt) > new Date());
  const pendingIntents = intents; // API already handles expiry/cooling

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 mt-8 pt-8 border-t border-border">
      
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-heading flex items-center gap-2 mb-4">
            <Target className="text-red-500" />
            Targeted Retargeting Engine
          </h2>
          <div className="flex gap-2 p-1 bg-surface-card border border-border rounded-xl inline-flex">
            <button 
              onClick={() => setActiveTab("abandoned")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "abandoned" ? 'bg-red-500 text-white shadow-md' : 'text-muted hover:text-heading hover:bg-surface-hover'}`}
            >
              <ShoppingCart size={16} /> Abandoned Carts ({totalIntents})
            </button>
            <button 
              onClick={() => setActiveTab("loyal")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "loyal" ? 'bg-yellow-500 text-white shadow-md' : 'text-muted hover:text-heading hover:bg-surface-hover'}`}
            >
              <Crown size={16} /> Loyal Customers ({loyalTotalCustomers})
            </button>
          </div>
        </div>

        {activeTab === "abandoned" && totalIntents > 0 && (
          <button 
            onClick={() => setShowBulkModal("abandoned")}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-bold shadow-md hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2"
          >
            <Layers size={16} /> Bulk Target All Leads ({totalIntents})
          </button>
        )}

        {activeTab === "loyal" && loyalTotalCustomers > 1 && (
          <button 
            onClick={() => setShowBulkModal("loyal")}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl text-sm font-bold shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center gap-2"
          >
            <Gift size={16} /> Reward All Loyal Users ({loyalTotalCustomers})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Dynamic Tab Content */}
        <div className="space-y-4">
          
          {/* ABANDONED CARTS TAB */}
          {activeTab === "abandoned" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Opportunities ({totalIntents})
                </h3>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page === 1 || loading}
                      className="p-1 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-bold text-muted">Page {page}/{totalPages}</span>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                      disabled={page === totalPages || loading}
                      className="p-1 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {loading ? (
                <div className="p-8 text-center text-muted animate-pulse border border-border rounded-2xl">Scanning for leads...</div>
              ) : pendingIntents.length === 0 ? (
                <div className="bg-surface-card border border-border border-dashed rounded-2xl p-8 text-center">
                  <span className="text-4xl block mb-2">🎉</span>
                  <h3 className="font-black text-heading text-lg">Targeted Retargeting Engine</h3>
                  <p className="text-xs text-muted">Automatically track abandoned carts and loyal buyers. Apply direct time-limited discounts to their products to convert them instantly.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingIntents.map(group => {
                    const daysIdle = Math.floor((Date.now() - new Date(group.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={group.userId} className="bg-surface-card border border-border hover:border-red-500/50 transition-colors rounded-2xl p-4 shadow-sm relative overflow-hidden">
                        
                        <div className="flex gap-4 items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <User className="text-red-500" size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-muted uppercase">Idle for {daysIdle}d</span>
                            </div>
                            <h4 className="font-bold text-sm text-heading truncate">{group.user?.name || "Customer"}</h4>
                            <p className="text-xs text-muted truncate">{group.user?.email}</p>
                          </div>
                          <button 
                            onClick={() => setSelectedIntent(group)}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-600 transition-transform active:scale-95 shrink-0"
                          >
                            Apply Discount ({group.products.length})
                          </button>
                        </div>
                        
                        {/* View Products Button */}
                        <div className="bg-surface rounded-xl p-3 border border-border/50 flex items-center justify-between">
                          <p className="text-xs text-muted font-medium flex items-center gap-2">
                            <ShoppingCart size={14} className="text-orange-500" />
                            {group.products.length} products abandoned
                          </p>
                          <button
                            onClick={() => setViewProductsModal({ title: `Abandoned by ${group.user?.name}`, products: group.products })}
                            className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors uppercase"
                          >
                            View Products
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* LOYAL CUSTOMERS TAB */}
          {activeTab === "loyal" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  <Crown size={16} className="text-yellow-500" />
                  Top Buyers ({loyalTotalCustomers})
                </h3>
                {loyalTotalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setLoyalPage(p => Math.max(1, p - 1))} 
                      disabled={loyalPage === 1 || loading}
                      className="p-1 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-bold text-muted">Page {loyalPage}/{loyalTotalPages}</span>
                    <button 
                      onClick={() => setLoyalPage(p => Math.min(loyalTotalPages, p + 1))} 
                      disabled={loyalPage === loyalTotalPages || loading}
                      className="p-1 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {loading ? (
                <div className="p-8 text-center text-muted animate-pulse border border-border rounded-2xl">Analyzing sales history...</div>
              ) : loyalCustomers.length === 0 ? (
                <div className="bg-surface-card border border-border border-dashed rounded-2xl p-8 text-center">
                  <span className="text-4xl block mb-2">😢</span>
                  <p className="text-heading font-bold">No loyal customers yet.</p>
                  <p className="text-muted text-xs mt-1">Once customers complete orders with you, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {loyalCustomers.map(customer => (
                    <div key={customer.userId} className="bg-surface-card border border-border hover:border-yellow-500/50 transition-colors rounded-2xl p-4 shadow-sm relative overflow-hidden">
                        <div className="flex gap-4 items-center mb-3">
                          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <Crown className="text-yellow-600" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-heading truncate">{customer.name}</h4>
                            <p className="text-xs text-muted truncate">{customer.email}</p>
                            
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] font-bold text-heading bg-surface px-2 py-1 rounded-md border border-border flex items-center gap-1">
                                <ShoppingCart size={10} /> {customer.totalOrders} Orders
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                                <IndianRupee size={10} /> {customer.totalSpent.toLocaleString()} Spent
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedLoyal(customer)}
                            className="px-6 py-2 bg-yellow-500 text-white rounded-xl text-xs font-bold shadow-md shadow-yellow-500/20 hover:bg-yellow-600 transition-transform active:scale-95 shrink-0"
                          >
                            Reward
                          </button>
                        </div>
                        
                        {/* View Products Button */}
                        {customer.products && customer.products.length > 0 && (
                          <div className="bg-surface rounded-xl p-3 border border-border/50 flex items-center justify-between">
                            <p className="text-xs text-muted font-medium flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-emerald-500" />
                              {customer.products.length} Products
                            </p>
                            <button
                              onClick={() => setViewProductsModal({ title: `Purchased by ${customer.name}`, products: customer.products })}
                              className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors uppercase"
                            >
                              View Products
                            </button>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>

        {/* Right Side: Active Sent Offers */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Active Targeted Offers ({activeOffers.length})
          </h3>
          
          {activeOffers.length === 0 ? (
            <div className="bg-surface-card border border-border border-dashed rounded-2xl p-8 text-center opacity-50">
              <p className="text-muted text-xs">No active targeted offers sent.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              {activeOffers.map(offer => {
                const isExpiringSoon = new Date(offer.expiresAt).getTime() - Date.now() < 12 * 60 * 60 * 1000;
                const isStoreWide = !offer.productId;
                return (
                  <div key={offer.id} className="bg-surface border border-emerald-500/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-emerald-500/10 rounded-bl-2xl">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                        <Gift size={10} /> {isStoreWide ? "Store-Wide" : "Active"}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-border opacity-70 flex items-center justify-center">
                        {isStoreWide ? (
                          <Crown className="text-yellow-500" size={24} />
                        ) : (
                          <img src={offer.product?.image || ""} className="w-full h-full object-contain p-1" alt="Product" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-heading mb-1">To: {offer.user?.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 font-black text-xs rounded-md">
                            {offer.discountPct ? `${offer.discountPct}% OFF` : `₹${offer.discountAmt} OFF`}
                          </span>
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${isExpiringSoon ? 'text-red-500' : 'text-muted'}`}>
                            <Clock size={10} /> Expires in {Math.max(1, Math.floor((new Date(offer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))}h
                          </span>
                        </div>
                        {isStoreWide && (
                          <p className="text-[10px] text-muted mt-1 font-medium">Valid on all items in your store</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Send Single Offer */}
      {(selectedIntent || selectedLoyal) && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-card border border-border rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className={`h-2 w-full ${selectedLoyal ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <button
              onClick={() => { setSelectedIntent(null); setSelectedLoyal(null); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10"
            >✕</button>
            
            <form onSubmit={handleSendOffer} className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-heading flex items-center gap-2 mb-1">
                  <Target className={selectedLoyal ? "text-yellow-500" : "text-red-500"} />
                  {selectedLoyal ? "Reward Top Buyer" : "Target Abandoned Cart"}
                </h2>
                <p className="text-xs text-muted">
                  Apply a time-limited discount directly to <strong className="text-heading">{selectedIntent?.user?.name || selectedLoyal?.name}</strong>'s products. They will see the discounted price immediately.
                </p>
              </div>
              
              <div className="flex gap-4 bg-surface rounded-2xl p-3 border border-border/50">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">Discount Type</label>
                  <select 
                    className="w-full bg-transparent text-sm font-bold focus:outline-none text-heading"
                    onChange={(e) => {
                      if (e.target.value === "PCT") setOfferData({ ...offerData, discountPct: "10", discountAmt: "" });
                      else setOfferData({ ...offerData, discountPct: "", discountAmt: "200" });
                    }}
                  >
                    <option value="PCT">Percentage (%)</option>
                    <option value="AMT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="w-px bg-border" />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">Value</label>
                  <input 
                    type="number" required 
                    value={offerData.discountPct || offerData.discountAmt}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (offerData.discountPct !== "") setOfferData({ ...offerData, discountPct: val });
                      else setOfferData({ ...offerData, discountAmt: val });
                    }}
                    className="w-full bg-transparent text-sm font-bold focus:outline-none text-heading" 
                    min="1" max={offerData.discountPct ? "99" : "99999"} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Expires In</label>
                <select 
                  value={offerData.expiresAtHours} 
                  onChange={e => setOfferData({...offerData, expiresAtHours: e.target.value})}
                  className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-red-500 focus:outline-none"
                >
                  <option value="24">24 Hours (High Urgency)</option>
                  <option value="48">48 Hours (Standard)</option>
                  <option value="72">72 Hours (3 Days)</option>
                  <option value="168">1 Week</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={sending} className={`w-full px-4 py-3 text-white rounded-xl text-sm font-black uppercase tracking-wider transition-colors shadow-lg disabled:opacity-50 ${selectedLoyal ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'}`}>
                  {sending ? "Applying..." : (selectedLoyal ? "Apply Store-Wide Discount" : "Apply Target Discount")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Bulk Send Offer */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-card border border-border rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className={`h-2 w-full ${showBulkModal === "loyal" ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <button
              onClick={() => setShowBulkModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10"
            >✕</button>
            
            <form onSubmit={handleBulkSend} className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-heading flex items-center gap-2 mb-1">
                  <Layers className={showBulkModal === "loyal" ? "text-yellow-500" : "text-red-500"} />
                  {showBulkModal === "loyal" ? "Bulk Reward Loyal Buyers" : "Bulk Target Leads"}
                </h2>
                <p className="text-xs text-muted">
                  Apply this {showBulkModal === "loyal" ? "store-wide " : ""}discount directly to the products of <strong className="text-heading">ALL {showBulkModal === "loyal" ? loyalCustomers.length : totalIntents}</strong> {showBulkModal === "loyal" ? "top buyers" : "leads"} at once!
                </p>
              </div>
              
              <div className="flex gap-4 bg-surface rounded-2xl p-3 border border-border/50">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">Discount Type</label>
                  <select 
                    className="w-full bg-transparent text-sm font-bold focus:outline-none text-heading"
                    onChange={(e) => {
                      if (e.target.value === "PCT") setOfferData({ ...offerData, discountPct: "10", discountAmt: "" });
                      else setOfferData({ ...offerData, discountPct: "", discountAmt: "200" });
                    }}
                  >
                    <option value="PCT">Percentage (%)</option>
                    <option value="AMT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="w-px bg-border" />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">Value</label>
                  <input 
                    type="number" required 
                    value={offerData.discountPct || offerData.discountAmt}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (offerData.discountPct !== "") setOfferData({ ...offerData, discountPct: val });
                      else setOfferData({ ...offerData, discountAmt: val });
                    }}
                    className="w-full bg-transparent text-sm font-bold focus:outline-none text-heading" 
                    min="1" max={offerData.discountPct ? "99" : "99999"} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">Expires In</label>
                <select 
                  value={offerData.expiresAtHours} 
                  onChange={e => setOfferData({...offerData, expiresAtHours: e.target.value})}
                  className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-red-500 focus:outline-none"
                >
                  <option value="24">24 Hours (High Urgency)</option>
                  <option value="48">48 Hours (Standard)</option>
                  <option value="72">72 Hours (3 Days)</option>
                  <option value="168">1 Week</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={sending} className={`w-full px-4 py-3 text-white rounded-xl text-sm font-black uppercase tracking-wider transition-colors shadow-lg disabled:opacity-50 ${showBulkModal === "loyal" ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'}`}>
                  {sending ? "Applying..." : "Apply Bulk Discount"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PRODUCTS MODAL */}
      {viewProductsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface-card">
              <h3 className="font-bold text-heading flex items-center gap-2">
                <Layers size={18} className="text-orange-500" />
                {viewProductsModal.title}
              </h3>
              <button 
                onClick={() => setViewProductsModal(null)} 
                className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-3 bg-surface">
              {viewProductsModal.products.map((p, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-surface-card border border-border rounded-xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-border/50">
                    <img src={p.image || ""} className="w-full h-full object-contain p-1" alt={p.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-heading truncate mb-1">{p.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 text-sm">
                        ₹{p.price ? p.price.toLocaleString() : "N/A"}
                      </span>
                      {p.mrp && p.mrp > p.price && (
                        <span className="text-xs text-muted line-through">₹{p.mrp.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border bg-surface-card flex justify-end">
              <button
                onClick={() => setViewProductsModal(null)}
                className="px-6 py-2 bg-muted-foreground text-surface rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
