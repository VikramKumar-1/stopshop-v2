"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Tag, CheckCircle2 } from "lucide-react";
import { TargetedRetargetingPanel } from "./TargetedRetargetingPanel";
import { PremiumDateTimePicker } from "@/components/ui/PremiumDateTimePicker";

export const VendorCouponManager = ({ vendorId }: { vendorId: number }) => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderPaise: "",
    maxDiscountPaise: "",
    maxUses: "",
    maxUsesPerUser: "1",
    expiresAt: "",
    allowDomestic: true,
    allowInternational: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/coupons?limit=50");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      } else if (!silent) {
        setError(data.error);
      }
    } catch (err) {
      if (!silent) setError("Failed to load coupons");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleEdit = (coupon: any) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountType === "FLAT" ? (coupon.discountValue * 100).toString() : coupon.discountValue.toString(),
      minOrderPaise: coupon.minOrderPaise ? (coupon.minOrderPaise / 100).toString() : "",
      maxDiscountPaise: coupon.maxDiscountPaise ? (coupon.maxDiscountPaise / 100).toString() : "",
      maxUses: coupon.maxUses ? coupon.maxUses.toString() : "",
      maxUsesPerUser: coupon.maxUsesPerUser ? coupon.maxUsesPerUser.toString() : "1",
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : "",
      allowDomestic: coupon.allowDomestic !== false,
      allowInternational: coupon.allowInternational !== false
    });
    setEditingId(coupon.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vendor specific UI validation before sending to API
    const val = parseFloat(formData.discountValue);
    if (formData.discountType === "PERCENTAGE" && val > 15) {
      setError("Maximum discount allowed is 15%");
      return;
    }
    if (formData.discountType === "FLAT" && val > 500) {
      setError("Maximum flat discount allowed is ₹500");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      const payload = {
        ...formData,
        minOrderPaise: formData.minOrderPaise ? parseInt(formData.minOrderPaise) * 100 : 0,
        maxDiscountPaise: formData.maxDiscountPaise ? parseInt(formData.maxDiscountPaise) * 100 : null
      };
      
      const res = await fetch(editingId ? `/api/coupons/${editingId}` : "/api/coupons", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditingId(null);
        setFormData({ code: "", description: "", discountType: "PERCENTAGE", discountValue: "", minOrderPaise: "", maxDiscountPaise: "", maxUses: "", maxUsesPerUser: "1", expiresAt: "", allowDomestic: true, allowInternational: true });
        fetchCoupons(true);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    const nextState = !currentStatus;
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: nextState } : c));
    try {
      await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState })
      });
      fetchCoupons(true);
    } catch (e) {
      console.error(e);
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: currentStatus } : c));
    }
  };
  
  const handleOptIn = async (id: number, accept: boolean) => {
    const status = accept ? "ACTIVE" : "REJECTED";
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, vendorStatus: status, isActive: accept } : c));
    try {
      await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorStatus: status })
      });
      fetchCoupons(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      fetchCoupons(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-heading flex items-center gap-2">
            <Tag className="text-orange-500" size={18} />
            Promotions & Offers
          </h2>
          <p className="text-xs text-muted mt-0.5">Create store-specific coupons or join StopShop campaigns.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({ code: "", description: "", discountType: "PERCENTAGE", discountValue: "", minOrderPaise: "", maxDiscountPaise: "", maxUses: "", maxUsesPerUser: "1", expiresAt: "", allowDomestic: true, allowInternational: true });
            }
          }}
          className="px-3.5 py-1.5 bg-heading text-surface rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          {showForm ? "Cancel" : <><Plus size={14} /> Create Promo</>}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm font-bold rounded-xl">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4 text-xs font-medium text-blue-700">
            <strong>Store Policy:</strong> Vendor coupons are capped at a maximum of 15% discount or ₹500 flat to protect platform pricing consistency.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Promo Code</label>
              <input required maxLength={12} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')})} placeholder="e.g. MYSALE10" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-orange-500 focus:outline-none uppercase tracking-widest" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-0.5 uppercase">Description</label>
              <span className="block text-[10px] text-zinc-500 mb-2 normal-case leading-tight">Short description for the coupon card. Max 18 characters. ({formData.description.length}/18)</span>
              <input maxLength={18} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. 10% off my store" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Discount Type</label>
              <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-orange-500 focus:outline-none">
                <option value="PERCENTAGE">Percentage (%) - Max 15</option>
                <option value="FLAT">Flat Amount (₹) - Max 500</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Discount Value</label>
              <input required type="text" inputMode="numeric" value={formData.discountValue} 
              onKeyDown={(e) => {
                if (['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) || e.ctrlKey || e.metaKey) return;
                if (!/^[0-9]$/.test(e.key)) e.preventDefault();
              }}
              onChange={e => {
                let val = e.target.value.replace(/\D/g, '');
                if (val !== '') {
                  const maxLimit = formData.discountType === 'PERCENTAGE' ? 15 : 500;
                  if (parseInt(val, 10) > maxLimit) {
                    val = maxLimit.toString();
                  }
                }
                setFormData({...formData, discountValue: val});
              }} placeholder="e.g. 10" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-0.5 uppercase">Min Order Amount (₹)</label>
              <span className="block text-[10px] text-zinc-500 mb-2 normal-case leading-tight">Customer must spend at least this amount to apply the coupon. Leave empty or 0 for no minimum.</span>
              <input type="text" inputMode="numeric" value={formData.minOrderPaise} 
              onKeyDown={(e) => {
                if (['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) || e.ctrlKey || e.metaKey) return;
                if (!/^[0-9]$/.test(e.key)) e.preventDefault();
              }}
              onChange={e => setFormData({...formData, minOrderPaise: e.target.value.replace(/[-.]/g, '')})} placeholder="e.g. 500" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Expiry Date (Optional)</label>
              <PremiumDateTimePicker 
                value={formData.expiresAt} 
                onChange={val => setFormData({...formData, expiresAt: val})} 
                placeholder="Select Expiry Date"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-muted uppercase">Target Region / Country Applicability</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                  <input type="checkbox" id="vendorAllowDomestic" checked={formData.allowDomestic} onChange={e => setFormData({...formData, allowDomestic: e.target.checked})} className="w-5 h-5 accent-blue-500" />
                  <label htmlFor="vendorAllowDomestic" className="text-xs font-bold text-heading cursor-pointer">
                    🇮🇳 Domestic (India)
                    <span className="block text-[10px] text-muted font-normal mt-0.5">Valid for customers in India</span>
                  </label>
                </div>
                <div className="flex items-center gap-3 bg-purple-500/5 p-3 rounded-xl border border-purple-500/20">
                  <input type="checkbox" id="vendorAllowInternational" checked={formData.allowInternational} onChange={e => setFormData({...formData, allowInternational: e.target.checked})} className="w-5 h-5 accent-purple-500" />
                  <label htmlFor="vendorAllowInternational" className="text-xs font-bold text-heading cursor-pointer">
                    🌍 International (Outside India)
                    <span className="block text-[10px] text-muted font-normal mt-0.5">Valid for International customers</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={submitting} type="submit" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : editingId ? "Update Promo" : "Save Promo"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500" size={20} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {coupons.map(c => (
            <div key={c.id} className={`bg-surface-card border ${c.creatorRole === 'ADMIN' ? 'border-blue-500/30' : 'border-border/80'} rounded-2xl p-4 relative group flex flex-col justify-between shadow-sm max-w-xs sm:max-w-none`}>
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-sm font-bold text-heading uppercase tracking-wider font-mono">{c.code}</h3>
                  <div className="flex gap-1.5">
                    {c.creatorRole === "VENDOR" && (
                      <>
                        <button onClick={() => handleEdit(c)} className="text-muted hover:text-blue-500 transition-colors"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(c.id)} className="text-muted hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-emerald-600 font-bold mb-2">{c.description || `${c.discountValue}${c.discountType === 'PERCENTAGE' ? '%' : '₹'} OFF`}</p>
                
                {c.creatorRole === "ADMIN" && (
                  <div className="mb-2 inline-block px-2 py-0.5 bg-blue-500/10 text-blue-700 text-[9px] font-bold rounded uppercase">Platform Campaign</div>
                )}
                
                <div className="space-y-0.5 text-[11px] text-muted font-medium">
                  <p>Uses: <span className="font-bold text-heading">{c.usedCount}</span> / <span className="font-bold text-heading">{c.maxUses || "∞"}</span></p>
                  <p>Status: <span className="font-bold text-heading">{c.vendorStatus || "ACTIVE"}</span></p>
                  {c.expiresAt && <p>Expires: <span className="font-bold text-orange-500">{new Date(c.expiresAt).toLocaleDateString()}</span></p>}
                  {c.expiresAt && new Date(c.expiresAt) < new Date() && <p className="text-red-500 font-bold">⚠️ EXPIRED</p>}
                  {c.isAutoApply && <p className="text-orange-500 font-bold">★ Auto-Applies to cart</p>}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5">
                {c.creatorRole === "ADMIN" && c.vendorStatus === "PENDING_OPT_IN" ? (
                  <div className="flex gap-1.5">
                    <button onClick={() => handleOptIn(c.id, true)} className="flex-1 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold transition-colors">Join Campaign</button>
                    <button onClick={() => handleOptIn(c.id, false)} className="flex-1 py-1 bg-surface border border-border text-muted hover:text-red-500 rounded-lg text-[10px] font-bold transition-colors">Decline</button>
                  </div>
                ) : c.creatorRole === "ADMIN" && c.vendorStatus === "ACTIVE" ? (
                  <button onClick={() => handleOptIn(c.id, false)} className="w-full py-1 bg-surface border border-border text-red-500 hover:bg-red-500/10 rounded-lg text-[10px] font-bold transition-colors">Opt-Out</button>
                ) : c.creatorRole === "VENDOR" ? (
                  <button 
                    onClick={() => toggleStatus(c.id, c.isActive)}
                    className={`w-full py-1.5 rounded-xl text-[10px] font-bold transition-colors ${c.isActive ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'}`}
                  >
                    {c.isActive ? "Live / Active" : "Paused / Inactive"}
                  </button>
                ) : (
                  <div className="w-full py-1 text-center text-[10px] font-bold text-muted bg-surface rounded-lg">Declined</div>
                )}
              </div>
            </div>
          ))}
          {coupons.length === 0 && (
            <div className="col-span-full p-10 text-center text-muted font-medium bg-surface-card rounded-2xl border border-dashed border-border">
              No promotions running.
            </div>
          )}
        </div>
      )}

      {/* Embedded High-Intent / Abandoned Cart Engine */}
      <TargetedRetargetingPanel vendorId={vendorId} />
    </div>
  );
};
