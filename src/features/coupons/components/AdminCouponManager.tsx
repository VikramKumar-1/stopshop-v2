"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Tag, CheckCircle2, Clock, AlertCircle, Calendar, Store, Search, Check, ChevronDown } from "lucide-react";

export const AdminCouponManager = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const [vendorSearch, setVendorSearch] = useState("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  // Edit modal state for expired / existing coupons
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    startsAt: "",
    expiresAt: "",
    isActive: true,
    description: "",
    applicableCategories: "",
    applicableMaterials: "",
    allowDomestic: true,
    allowInternational: true
  });
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderPaise: "",
    maxDiscountPaise: "",
    maxUses: "",
    maxUsesPerUser: "1",
    vendorId: "",
    startsAt: "",
    expiresAt: "",
    applicableCategories: "",
    applicableMaterials: "",
    isAutoApply: false,
    isFirstOrderOnly: false,
    allowDomestic: true,
    allowInternational: true
  });
  const [submitting, setSubmitting] = useState(false);

  const [materials, setMaterials] = useState<string[]>(["Bronze", "Copper", "Brass", "Steel", "Ceramic", "Glass"]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [couponsRes, vendorsRes, categoriesRes, materialsRes] = await Promise.all([
        fetch("/api/coupons?limit=50", { cache: "no-store" }),
        fetch("/api/admin/vendors"),
        fetch("/api/categories"),
        fetch("/api/materials")
      ]);
      const [couponsData, vendorsData, categoriesData, materialsData] = await Promise.all([
        couponsRes.json(),
        vendorsRes.json(),
        categoriesRes.json(),
        materialsRes.json()
      ]);

      if (couponsData.success) {
        setCoupons(couponsData.coupons || []);
      } else if (!silent) {
        setError(couponsData.error || "Failed to load coupons");
      }

      if (vendorsData.success) {
        setVendors(vendorsData.vendors || []);
      }
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      }
      if (materialsData.success && Array.isArray(materialsData.materials)) {
        setMaterials(materialsData.materials);
      }
    } catch (err) {
      if (!silent) setError("Failed to load dashboard data");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const isCouponExpired = (coupon: any) => {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt).getTime() < new Date().getTime();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    try {
      const payload = {
        ...formData,
        vendorId: formData.vendorId || null,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        applicableCategories: formData.applicableCategories || null,
        applicableMaterials: formData.applicableMaterials || null,
        isAutoApply: formData.isAutoApply,
        isFirstOrderOnly: formData.isFirstOrderOnly,
        minOrderPaise: formData.minOrderPaise ? parseInt(formData.minOrderPaise) * 100 : 0,
        maxDiscountPaise: formData.maxDiscountPaise ? parseInt(formData.maxDiscountPaise) * 100 : null
      };
      
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setFormData({
          code: "", description: "", discountType: "PERCENTAGE", discountValue: "",
          minOrderPaise: "", maxDiscountPaise: "", maxUses: "", maxUsesPerUser: "1",
          vendorId: "", startsAt: "", expiresAt: "", applicableCategories: "", applicableMaterials: "", isAutoApply: false, isFirstOrderOnly: false,
          allowDomestic: true, allowInternational: true
        });
        fetchAllData(true);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (coupon: any) => {
    const formatDateTimeLocal = (dateStr: string | null) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const pad = (num: number) => num.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    setEditingCoupon(coupon);
    setEditFormData({
      startsAt: formatDateTimeLocal(coupon.startsAt),
      expiresAt: formatDateTimeLocal(coupon.expiresAt),
      isActive: coupon.isActive,
      description: coupon.description || "",
      applicableCategories: coupon.applicableCategories || "",
      applicableMaterials: coupon.applicableMaterials || "",
      allowDomestic: coupon.allowDomestic !== false,
      allowInternational: coupon.allowInternational !== false
    });
  };

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    setUpdating(true);
    setError("");

    try {
      // If reactivating an expired coupon, ensure new expiry date is in the future
      if (editFormData.expiresAt && new Date(editFormData.expiresAt).getTime() < new Date().getTime()) {
        setError("New expiry date must be in the future to reactivate this coupon.");
        setUpdating(false);
        return;
      }

      const res = await fetch(`/api/coupons/${editingCoupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: editFormData.startsAt ? new Date(editFormData.startsAt).toISOString() : null,
          expiresAt: editFormData.expiresAt ? new Date(editFormData.expiresAt).toISOString() : null,
          isActive: editFormData.isActive,
          description: editFormData.description,
          applicableCategories: editFormData.applicableCategories || null,
          applicableMaterials: editFormData.applicableMaterials || null,
          allowDomestic: editFormData.allowDomestic,
          allowInternational: editFormData.allowInternational
        })
      });

      const data = await res.json();
      if (data.success) {
        setEditingCoupon(null);
        fetchAllData(true);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update coupon");
    } finally {
      setUpdating(false);
    }
  };

  const toggleStatus = async (coupon: any) => {
    // If expired and admin clicks activate, force open edit modal to set new expiry date
    if (!coupon.isActive && isCouponExpired(coupon)) {
      handleEditClick(coupon);
      return;
    }

    const nextState = !coupon.isActive;
    // Optimistic local state update (prevents page re-render/spinner)
    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: nextState } : c));

    try {
      await fetch(`/api/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState })
      });
      fetchAllData(true);
    } catch (e) {
      console.error(e);
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: !nextState } : c));
    }
  };
  
  const toggleAutoApply = async (id: number, currentStatus: boolean) => {
    const nextState = !currentStatus;
    // Optimistic local state update (prevents page re-render/spinner)
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isAutoApply: nextState } : c));

    try {
      await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAutoApply: nextState })
      });
      fetchAllData(true);
    } catch (e) {
      console.error(e);
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, isAutoApply: currentStatus } : c));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      fetchAllData(true);
    } catch (e) {
      console.error(e);
    }
  };

  const adminCoupons = coupons.filter(c => c.creatorRole !== "VENDOR" && !isCouponExpired(c));
  const vendorCoupons = coupons.filter(c => c.creatorRole === "VENDOR" && !isCouponExpired(c));
  const expiredCoupons = coupons.filter(c => isCouponExpired(c));
  const selectedVendor = vendors.find(v => v.id.toString() === formData.vendorId.toString());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-heading flex items-center gap-2">
            <Tag className="text-orange-500" />
            Coupons & Offers
          </h2>
          <p className="text-sm text-muted mt-1">Manage vendor assignments, validity dates, category filtering, and auto-apply offers.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-heading text-surface rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors flex items-center gap-2"
        >
          {showForm ? "Cancel" : <><Plus size={16} /> Create Coupon</>}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm font-bold rounded-xl">{error}</div>}

      {/* CREATE FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Coupon Code *</label>
              <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. FESTIVE50" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-orange-500 focus:outline-none uppercase" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Description</label>
              <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. 50% off on brass artifacts" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-muted mb-1 uppercase flex items-center gap-1.5">
                <Store size={14} className="text-orange-500" />
                Assign Specific Vendor
              </label>
              <div 
                onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold flex items-center justify-between cursor-pointer hover:border-orange-500 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {selectedVendor ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="truncate text-heading font-black">{selectedVendor.name || selectedVendor.email}</span>
                      <span className="text-[10px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full font-extrabold shrink-0">ID #{selectedVendor.id}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                      <span className="text-heading font-bold">🌐 Global Campaign (All Vendors)</span>
                    </>
                  )}
                </div>
                <ChevronDown size={16} className={`text-muted transition-transform ${showVendorDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showVendorDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-surface border border-border rounded-2xl shadow-2xl p-3 max-h-72 overflow-y-auto space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="sticky top-0 bg-surface pb-2 border-b border-border z-10 flex items-center gap-2 px-2">
                    <Search size={14} className="text-muted shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search vendor by name, email, or ID..." 
                      value={vendorSearch}
                      onChange={e => setVendorSearch(e.target.value)}
                      className="w-full bg-transparent text-xs font-medium focus:outline-none py-1 text-heading"
                      onClick={e => e.stopPropagation()}
                    />
                  </div>

                  <div 
                    onClick={() => { setFormData({...formData, vendorId: ""}); setShowVendorDropdown(false); }}
                    className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${!formData.vendorId ? 'bg-orange-500/10 text-orange-600 font-bold border border-orange-500/30' : 'hover:bg-surface-card text-muted hover:text-heading'}`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-base">🌐</span>
                      <div>
                        <p className="font-bold">Global Promotion (All Vendors)</p>
                        <p className="text-[10px] opacity-75">Coupon applies across the entire catalog</p>
                      </div>
                    </div>
                    {!formData.vendorId && <Check size={14} className="text-orange-500 shrink-0" />}
                  </div>

                  {vendors
                    .filter(v => 
                      (v.name || "").toLowerCase().includes(vendorSearch.toLowerCase()) || 
                      (v.email || "").toLowerCase().includes(vendorSearch.toLowerCase()) || 
                      v.id.toString().includes(vendorSearch)
                    )
                    .map(v => (
                      <div 
                        key={v.id}
                        onClick={() => { setFormData({...formData, vendorId: v.id.toString()}); setShowVendorDropdown(false); }}
                        className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${formData.vendorId === v.id.toString() ? 'bg-orange-500/10 text-orange-600 font-bold border border-orange-500/30' : 'hover:bg-surface-card text-heading'}`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-xs shrink-0">
                            {(v.name || v.email || "V")[0].toUpperCase()}
                          </div>
                          <div className="truncate text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold truncate">{v.name || "Unnamed Vendor"}</span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-surface-card border border-border rounded font-bold text-muted">#{v.id}</span>
                            </div>
                            <p className="text-[11px] text-muted truncate">{v.email} {v.location ? `• 📍 ${v.location}` : ''}</p>
                          </div>
                        </div>
                        {formData.vendorId === v.id.toString() && <Check size={14} className="text-orange-500 shrink-0 ml-2" />}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Discount Type</label>
              <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-orange-500 focus:outline-none">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Discount Value *</label>
              <input 
                required 
                type="number" 
                step="0.01" 
                min="0"
                value={formData.discountValue} 
                onKeyDown={(e) => { if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault(); }}
                onChange={e => {
                   let val = e.target.value;
                   if (val && Number(val) < 0) val = "0";
                   setFormData({...formData, discountValue: val})
                }} 
                placeholder="e.g. 15" 
                className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Min Order Amount (₹)</label>
              <input type="number" value={formData.minOrderPaise} onChange={e => setFormData({...formData, minOrderPaise: e.target.value})} placeholder="0 for no minimum" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Max Discount Cap (₹) (For %)</label>
              <input type="number" value={formData.maxDiscountPaise} onChange={e => setFormData({...formData, maxDiscountPaise: e.target.value})} placeholder="Leave blank for no cap" className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Start Date & Time</label>
              <input type="datetime-local" value={formData.startsAt} onChange={e => setFormData({...formData, startsAt: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">End Date & Time (Expiry)</label>
              <input type="datetime-local" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Specific Category Filter</label>
              <select value={formData.applicableCategories} onChange={e => setFormData({...formData, applicableCategories: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-orange-500 focus:outline-none">
                <option value="">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat.id || cat.slug} value={cat.slug}>{cat.name || cat.slug}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1 uppercase">Specific Material Filter</label>
              <select value={formData.applicableMaterials} onChange={e => setFormData({...formData, applicableMaterials: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-orange-500 focus:outline-none">
                <option value="">All Materials</option>
                {materials.map((mat: string) => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="block text-xs font-bold text-muted uppercase">Target Region / Country Applicability</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                  <input type="checkbox" id="allowDomestic" checked={formData.allowDomestic} onChange={e => setFormData({...formData, allowDomestic: e.target.checked})} className="w-5 h-5 accent-blue-500" />
                  <label htmlFor="allowDomestic" className="text-xs font-bold text-heading cursor-pointer">
                    🇮🇳 Domestic (India)
                    <span className="block text-[10px] text-muted font-normal mt-0.5">Valid for customers in India</span>
                  </label>
                </div>
                <div className="flex items-center gap-3 bg-purple-500/5 p-3 rounded-xl border border-purple-500/20">
                  <input type="checkbox" id="allowInternational" checked={formData.allowInternational} onChange={e => setFormData({...formData, allowInternational: e.target.checked})} className="w-5 h-5 accent-purple-500" />
                  <label htmlFor="allowInternational" className="text-xs font-bold text-heading cursor-pointer">
                    🌍 International (Outside India)
                    <span className="block text-[10px] text-muted font-normal mt-0.5">Valid for International customers</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 flex items-center gap-3 bg-orange-500/5 p-4 rounded-xl border border-orange-500/20">
                <input type="checkbox" id="autoApply" checked={formData.isAutoApply} onChange={e => setFormData({...formData, isAutoApply: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                <label htmlFor="autoApply" className="text-sm font-bold text-heading cursor-pointer">
                  Auto-Apply this coupon at checkout
                  <span className="block text-xs text-muted font-medium mt-0.5">If checked, this coupon will automatically apply at checkout without the user needing to click it.</span>
                </label>
              </div>
              <div className="flex-1 flex items-center gap-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                <input type="checkbox" id="firstOrderOnly" checked={formData.isFirstOrderOnly} onChange={e => setFormData({...formData, isFirstOrderOnly: e.target.checked})} className="w-5 h-5 accent-emerald-500" />
                <label htmlFor="firstOrderOnly" className="text-sm font-bold text-heading cursor-pointer">
                  First Order Only
                  <span className="block text-xs text-muted font-medium mt-0.5">If checked, this coupon can only be used by users making their very first successful order on the platform.</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={submitting} type="submit" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : "Save Coupon"}
            </button>
          </div>
        </form>
      )}

      {/* EDIT MODAL FOR EXPIRED / EXISTING COUPON */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdateCoupon} className="bg-surface border border-border rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-lg font-black text-heading uppercase tracking-wider flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" />
                Edit / Renew Coupon: {editingCoupon.code}
              </h3>
              <button type="button" onClick={() => setEditingCoupon(null)} className="text-muted hover:text-heading font-bold text-sm">✕</button>
            </div>

            {isCouponExpired(editingCoupon) && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-amber-500" />
                <span>This coupon has expired. Set a new future End Date & Time to reactivate it!</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-muted mb-1 uppercase">Description</label>
                <input value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-4 py-2 text-sm focus:border-orange-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1 uppercase">Start Date & Time</label>
                  <input type="datetime-local" value={editFormData.startsAt} onChange={e => setEditFormData({...editFormData, startsAt: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-3 py-2 text-xs focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1 uppercase">End Date & Time</label>
                  <input type="datetime-local" value={editFormData.expiresAt} onChange={e => setEditFormData({...editFormData, expiresAt: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-3 py-2 text-xs focus:border-orange-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1 uppercase">Category Filter</label>
                  <select value={editFormData.applicableCategories} onChange={e => setEditFormData({...editFormData, applicableCategories: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-orange-500 focus:outline-none">
                    <option value="">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id || cat.slug} value={cat.slug}>{cat.name || cat.slug}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1 uppercase">Material Filter</label>
                  <select value={editFormData.applicableMaterials} onChange={e => setEditFormData({...editFormData, applicableMaterials: e.target.value})} className="w-full bg-surface-card border border-border rounded-xl px-3 py-2 text-xs font-bold focus:border-orange-500 focus:outline-none">
                    <option value="">All Materials</option>
                    {materials.map((mat: string) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="editActive" checked={editFormData.isActive} onChange={e => setEditFormData({...editFormData, isActive: e.target.checked})} className="w-4 h-4 accent-orange-500" />
                <label htmlFor="editActive" className="text-xs font-bold text-heading cursor-pointer">Set Coupon Status to Live / Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button type="button" onClick={() => setEditingCoupon(null)} className="px-4 py-2 bg-surface-card border border-border rounded-xl text-xs font-bold text-muted hover:text-heading">Cancel</button>
              <button disabled={updating} type="submit" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                {updating ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-orange-500" /></div>
      ) : (
        <div className="space-y-8">
          {/* ADMIN & PLATFORM CAMPAIGNS */}
          <div>
            <h3 className="text-sm font-black text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Platform Campaigns & Offers ({adminCoupons.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminCoupons.map(c => (
                <div key={c.id} className="bg-surface border border-border rounded-2xl p-5 relative group flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black text-heading uppercase tracking-widest">{c.code}</h3>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEditClick(c)} title="Edit validity or details" className="p-1 text-muted hover:text-orange-500 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(c.id)} title="Delete coupon" className="p-1 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-emerald-600 font-bold mb-3">{c.description || `${c.discountValue}${c.discountType === 'PERCENTAGE' ? '%' : '₹'} OFF`}</p>
                    
                    <div className="space-y-1 text-xs text-muted font-medium bg-surface-card p-3 rounded-xl border border-border/50">
                      <p>Uses: {c.usedCount} / {c.maxUses || "∞"}</p>
                      <p>Assigned Vendor: <span className="font-bold text-heading">{c.vendorId ? `Vendor #${c.vendorId}` : "Global (All)"}</span></p>
                      {c.applicableCategories && <p>Category: <span className="font-bold text-heading">{c.applicableCategories}</span></p>}
                      {c.applicableMaterials && <p>Material: <span className="font-bold text-heading">{c.applicableMaterials}</span></p>}
                      <p className="flex items-center gap-1 mt-1 text-[11px] text-muted">
                        <Clock size={12} />
                        Expires: {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                      </p>
                      {c.isFirstOrderOnly && <p className="text-emerald-500 font-bold mt-1 text-[11px]">★ FIRST ORDER ONLY</p>}
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-border flex flex-col gap-2">
                    <button 
                      onClick={() => toggleStatus(c)}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${c.isActive ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                    >
                      {c.isActive ? "Live / Active" : "Paused / Inactive"}
                    </button>
                    <button 
                      onClick={() => toggleAutoApply(c.id, c.isAutoApply)}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${c.isAutoApply ? 'bg-orange-500 text-white shadow' : 'bg-surface-card border border-border text-muted hover:text-heading'}`}
                    >
                      {c.isAutoApply && <CheckCircle2 size={12} />}
                      {c.isAutoApply ? "Auto-Apply: ON" : "Auto-Apply: OFF"}
                    </button>
                  </div>
                </div>
              ))}
              {adminCoupons.length === 0 && (
                <div className="col-span-full p-8 text-center text-muted text-xs font-medium bg-surface-card rounded-2xl border border-dashed border-border">
                  No admin platform campaigns running right now.
                </div>
              )}
            </div>
          </div>

          {/* VENDOR-CREATED STORE PROMOTIONS */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Store size={16} className="text-orange-500" />
                  Vendor-Created Self Promos ({vendorCoupons.length})
                </h3>
                <p className="text-xs text-muted mt-0.5">Coupons created independently by store sellers. Admins can monitor performance or block/deactivate them.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorCoupons.map(c => {
                const v = vendors.find(ven => ven.id.toString() === c.vendorId?.toString());
                const displayVendorName = v?.name || v?.email || (c.vendorId ? `Vendor Store #${c.vendorId}` : "Registered Store Vendor");
                const displayEmail = v?.email || (c.vendorId ? `ID: #${c.vendorId}` : "Independent Seller");
                return (
                  <div key={c.id} className="bg-surface border border-orange-500/30 rounded-2xl p-5 relative group flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] bg-orange-500/10 text-orange-600 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Vendor Self-Promo</span>
                          <h3 className="text-xl font-black text-heading uppercase tracking-widest mt-1">{c.code}</h3>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => handleDelete(c.id)} title="Delete coupon" className="p-1 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      <p className="text-sm text-emerald-600 font-extrabold mb-3">{c.description || `${c.discountValue}${c.discountType === 'PERCENTAGE' ? '%' : '₹'} OFF`}</p>

                      {/* VENDOR DETAILS CARD */}
                      <div className="flex items-center gap-2.5 bg-orange-500/5 p-3 rounded-xl border border-orange-500/20 mb-3">
                        <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                          {displayVendorName[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-heading truncate">{displayVendorName}</p>
                          <p className="text-[11px] text-muted truncate">{displayEmail}</p>
                        </div>
                        <span className="ml-auto text-[10px] bg-surface px-2 py-1 rounded-lg font-extrabold text-orange-600 border border-orange-500/20 shrink-0">#{c.vendorId || "V"}</span>
                      </div>
                      
                      {/* APPLICABLE RULES / USAGE DETAILS */}
                      <div className="space-y-1.5 text-xs text-muted font-medium bg-surface-card p-3 rounded-xl border border-border/60">
                        <p className="flex justify-between"><span>🎯 Target Category:</span> <span className="font-bold text-heading">{c.applicableCategories || "Entire Store Catalog"}</span></p>
                        <p className="flex justify-between"><span>🛠️ Target Material:</span> <span className="font-bold text-heading">{c.applicableMaterials || "All Materials"}</span></p>
                        <p className="flex justify-between"><span>💰 Min Order Req:</span> <span className="font-bold text-heading">{c.minOrderPaise ? `₹${c.minOrderPaise / 100}` : "No Minimum"}</span></p>
                        <p className="flex justify-between border-t border-border pt-1 mt-1">
                          <span>⚡ Total Usage:</span> 
                          <span className="font-extrabold text-emerald-600">{c.usedCount || 0} / {c.maxUses || "∞"} used</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-border">
                      <button 
                        onClick={() => toggleStatus(c)}
                        className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-sm ${c.isActive ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/30'}`}
                      >
                        {c.isActive ? "🛑 Deactivate (Admin Emergency Block)" : "✅ Reactivate Vendor Promo"}
                      </button>
                    </div>
                  </div>
                );
              })}
              {vendorCoupons.length === 0 && (
                <div className="col-span-full p-8 text-center text-muted text-xs font-medium bg-surface-card rounded-2xl border border-dashed border-border">
                  No independent vendor promos created yet.
                </div>
              )}
            </div>
          </div>

          {/* EXPIRED COUPONS (GREYED OUT) */}
          {expiredCoupons.length > 0 && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                Expired / Inactive History ({expiredCoupons.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expiredCoupons.map(c => (
                  <div key={c.id} className="bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 relative group flex flex-col justify-between opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-slate-600 dark:text-slate-400 line-through uppercase tracking-widest">{c.code}</h3>
                          <span className="px-2 py-0.5 bg-slate-500 text-white text-[10px] font-bold rounded">EXPIRED</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEditClick(c)} title="Renew coupon" className="p-1 text-slate-500 hover:text-orange-500 transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(c.id)} title="Delete coupon" className="p-1 text-slate-500 hover:text-red-500 transition-opacity"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-bold mb-3">{c.description || `${c.discountValue}${c.discountType === 'PERCENTAGE' ? '%' : '₹'} OFF`}</p>
                      
                      <div className="space-y-1 text-xs text-slate-500 font-medium bg-white/50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p>Uses: {c.usedCount} / {c.maxUses || "∞"}</p>
                        <p>Assigned Vendor: <span className="font-bold">{c.vendorId ? `Vendor #${c.vendorId}` : "Global (All)"}</span></p>
                        {c.applicableCategories && <p>Category: <span className="font-bold">{c.applicableCategories}</span></p>}
                        {c.applicableMaterials && <p>Material: <span className="font-bold">{c.applicableMaterials}</span></p>}
                        <p className="flex items-center gap-1 mt-1 text-[11px] text-red-500 font-bold">
                          Expired on: {new Date(c.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                      <button 
                        onClick={() => handleEditClick(c)}
                        className="w-full py-2 bg-orange-500/10 hover:bg-orange-500 text-orange-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Calendar size={14} />
                        Renew & Set New Expiry Date
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
