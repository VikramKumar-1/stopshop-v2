"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Plus, Trash2, Edit, LogOut, CheckCircle, Mail, Phone, MapPin, Package, Award, X, Settings, DollarSign, RefreshCcw, Users, FileText, Download, LayoutDashboard, Search, Info, CheckCircle2, XCircle, AlertTriangle, Store, Loader2 } from "lucide-react";
import { currencyDatabase } from "@/context/RegionContext";
import { jsPDF } from "jspdf";
import { AnimatePresence, motion } from "framer-motion";

export const AdminPanel = () => {
  // Premium Toast Notification State
  interface ToastItem {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Tabs Data
  const [activeTab, _setActiveTab] = useState<string>("orders");

  useEffect(() => {
    const savedTab = localStorage.getItem("adminActiveTab");
    if (savedTab) {
      _setActiveTab(savedTab);
    }
  }, []);

  const setActiveTab = (tab: string) => {
    _setActiveTab(tab);
    localStorage.setItem("adminActiveTab", tab);
  };
  
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [returns, setReturns] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [groupedSettlements, setGroupedSettlements] = useState<any[]>([]);
  const [settlementSummary, setSettlementSummary] = useState<any>(null);
  const [selectedVendorSettlement, setSelectedVendorSettlement] = useState<any>(null);
  const [settlementSearchQuery, setSettlementSearchQuery] = useState("");
  const [excludedVendorIds, setExcludedVendorIds] = useState<number[]>([]);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedInquiryMessage, setSelectedInquiryMessage] = useState<string | null>(null);
  
  // Homepage CMS State
  const [homepageSections, setHomepageSections] = useState<{ slug: string, title?: string, productIds: number[] }[]>([]);
  const [editingSectionSlug, setEditingSectionSlug] = useState<string | null>(null);
  const [cmsProductSearch, setCmsProductSearch] = useState("");
  
  // Product Tab State
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  
  const [globalProductSearch, setGlobalProductSearch] = useState("");
  const [globalProductCategory, setGlobalProductCategory] = useState("");
  const [globalProductMaterial, setGlobalProductMaterial] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);

  // Vendor Tab State
  const [vendorProfileModal, setVendorProfileModal] = useState<any | null>(null);
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  const [loadingVendorProducts, setLoadingVendorProducts] = useState(false);

  const handleOpenVendorModal = async (v: any) => {
    setVendorProfileModal(v);
    setLoadingVendorProducts(true);
    setVendorProducts([]);
    try {
      const res = await fetch(`/api/admin/vendors/${v.id}/products`);
      if (res.ok) {
        const data = await res.json();
        setVendorProducts(data.products || []);
      }
    } catch (e) {
      console.error("Failed to load vendor products");
    } finally {
      setLoadingVendorProducts(false);
    }
  };

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [selectedCountryToAdd, setSelectedCountryToAdd] = useState("");

  // SLA countdown timer state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);
  
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user.role === "admin") {
          setAuthorized(true);
          fetchData();
        } else {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    } catch (e) {
      setAuthorized(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user.role === "admin") {
        setAuthorized(true);
        fetchData();
      } else {
        setLoginError(data.error || "Access Denied. Admin privilege required.");
      }
    } catch (err) {
      setLoginError("Failed to authenticate with server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setAuthorized(false);
  };

  const fetchOrders = async (page: number) => {
    setFetchingOrders(true);
    try {
      const res = await fetch(`/api/orders?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setOrders(prev => page === 1 ? (data.orders || []) : [...prev, ...(data.orders || [])]);
        if (data.pagination) setOrderTotalPages(data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingOrders(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchOrders(orderPage);
    }
  }, [orderPage, authorized]);

  // Infinite Scroll Observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (fetchingOrders) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && orderPage < orderTotalPages) {
        setOrderPage(prev => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [fetchingOrders, orderPage, orderTotalPages]);

  const fetchData = async () => {
    try {
      const [rRes, sRes, setRes, inqRes, prodRes, catRes, vRes] = await Promise.all([
         fetch("/api/returns"),
         fetch("/api/admin/settlements"),
         fetch("/api/admin/settings"),
         fetch("/api/inquiries"),
         fetch("/api/products"),
         fetch("/api/categories"),
         fetch("/api/admin/vendors")
      ]);

      if (rRes.ok) setReturns((await rRes.json()).returns || []);
      if (sRes.ok) {
         const data = await sRes.json();
         setSettlements(data.settlements || []);
         setGroupedSettlements(data.groupedSettlements || []);
         setSettlementSummary(data.summary);
      }
      if (setRes.ok) {
         const settingsData = (await setRes.json()).settings;
         setSettings(settingsData);
         if (settingsData?.homepageSections) {
           setHomepageSections(settingsData.homepageSections);
         }
      }
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) {
         const data = await catRes.json();
         setDbCategories(data);
         if (data.length > 0) setSelectedCategorySlug(data[0].slug);
         setLoadingCategories(false);
      }
      if (vRes.ok) setVendors((await vRes.json()).vendors || []);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleUpdateReturn = async (id: string, action: string, rejectionReason?: string, banUser?: boolean, banVendor?: boolean, adminNotes?: string) => {
     if (action === "REJECTED_PRE_PICKUP" && !rejectionReason) {
        rejectionReason = prompt("Enter a reason for rejecting this return:") || "Rejected by Admin";
     }
     
     try {
        const res = await fetch(`/api/returns/admin/review`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ returnId: id, action, rejectionReason, banUser, banVendor, adminNotes })
        });
         if (res.ok) {
           const actionText = action === "QC_PASS" ? "User Refunded" : action === "QC_FAIL" ? "Vendor Payment Approved" : action === "APPROVED" ? "Approved" : "Rejected";
           showToast(`Return dispute resolved: ${actionText}`, "success");
           fetchData();
        } else {
           const data = await res.json();
           showToast(data.error || "Failed to update return", "error");
        }
     } catch (err) {
        showToast("Error updating return", "error");
     }
  };

  const handleReviewVendor = async (vendorId: number, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch(`/api/admin/vendors/review`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ vendorId, action })
      });
      if (res.ok) {
         showToast(`Vendor profile ${action === 'APPROVE' ? 'APPROVED' : 'REJECTED'}`, "success");
         fetchData();
      } else {
         const data = await res.json();
         showToast(data.error || "Failed to review vendor", "error");
      }
    } catch (err) {
       showToast("Error reviewing vendor", "error");
    }
  };

  const generateInvoice = (s: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("COMMISSION INVOICE", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice ID: INV-SET-${s.id}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Order Number: ${s.order.orderNumber}`, 20, 50);
    
    doc.line(20, 55, 190, 55);
    
    doc.setFont("helvetica", "bold");
    doc.text("Vendor Details", 20, 65);
    doc.setFont("helvetica", "normal");
    // Since we don't have full vendor details populated in the settlement object here easily,
    // we use the vendorId. In a real app we'd populate it.
    doc.text(`Vendor ID: ${s.vendorId}`, 20, 72);
    
    doc.setFont("helvetica", "bold");
    doc.text("Settlement Summary", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Order Amount: Rs. ${(s.orderAmountPaise / 100).toFixed(2)}`, 20, 97);
    doc.text(`Platform Commission: Rs. ${(s.commissionPaise / 100).toFixed(2)}`, 20, 104);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Payout to Vendor: Rs. ${(s.vendorPayoutPaise / 100).toFixed(2)}`, 20, 111);
    
    doc.line(20, 120, 190, 120);
    doc.setFont("helvetica", "italic");
    doc.text("This is an automatically generated document by StopShops Marketplace.", 105, 130, { align: "center" });
    
    doc.save(`Invoice_Settlement_${s.id}.pdf`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
        const res = await fetch("/api/admin/settings", {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(settings)
        });
        if (res.ok) showToast("Settings saved successfully!", "success");
        else showToast("Failed to save settings", "error");
     } catch (e) {
        showToast("Error saving settings", "error");
     }
  };

  const handleToggleHide = async (id: number, name: string, currentActive: boolean) => {
    const action = currentActive ? "hide" : "unhide";
    if (!confirm(`Are you sure you want to ${action} "${name}" from the marketplace?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive })
      });
      if (res.ok) {
        showToast(`Product ${action}d successfully.`, "success");
        fetchData();
      } else {
        showToast(`Failed to ${action} product.`, "error");
      }
    } catch (e) {
      showToast(`Error trying to ${action} product.`, "error");
    }
  };

  const handleAssignToHomepage = async () => {
    if (selectedProducts.length === 0 || !selectedCategorySlug) return;
    try {
      // Validation: Ensure all selected products belong to the selected category
      const invalidProducts = selectedProducts
        .map(id => products.find(p => p.id === id))
        .filter(p => p && p.categoryName !== selectedCategorySlug);

      if (invalidProducts.length > 0) {
        showToast(`Cannot assign! You selected ${invalidProducts.length} product(s) that belong to a different category than the target section. Please only assign products that match the section's category.`, "error");
        return;
      }

      const secIdx = homepageSections.findIndex((s:any) => s.slug === selectedCategorySlug);
      const cat = dbCategories.find(c => c.slug === selectedCategorySlug);
      let newSections = [...homepageSections];
      
      if (secIdx > -1) {
        const currentIds = newSections[secIdx].productIds;
        const newIds = Array.from(new Set([...currentIds, ...selectedProducts]));
        if (newIds.length > 15) {
          showToast(`Cannot add. The "${cat?.name}" section would exceed the maximum of 15 products (would have ${newIds.length}). Please unselect some products.`, "error");
          return;
        }
        newSections[secIdx].productIds = newIds;
      } else {
        if (selectedProducts.length > 15) {
           showToast(`Cannot add. Maximum 15 products allowed per section.`, "error");
           return;
        }
        newSections.push({ slug: selectedCategorySlug, title: cat?.name, productIds: selectedProducts });
      }

      const updateRes = await fetch("/api/admin/settings/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homepageSections: newSections })
      });
      
      if (updateRes.ok) {
        setHomepageSections(newSections);
        showToast("Products successfully assigned to homepage section!", "success");
        setSelectedProducts([]);
        setSelectedCategorySlug("");
      } else {
        const errText = await updateRes.text();
        showToast(`Failed to assign products to homepage. Server says: ${errText}`, "error");
      }
    } catch (e: any) {
      showToast(`Error assigning to homepage: ${e.message}`, "error");
    }
  };

  if (authorized === null || (authorized && isLoadingData)) {
    return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface-card border border-border p-8 rounded-3xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-display font-bold text-heading">Admin Portal</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <div className="p-3 bg-red-500/5 text-red-500 text-xs border border-red-500/20 rounded-xl">{loginError}</div>}
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs outline-none" />
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs outline-none" />
            <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-16">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">StopShops Admin</h1>
            <p className="text-xs text-slate-300 mt-1">Master Dashboard</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-surface-card p-2 rounded-2xl border border-border overflow-x-auto shadow-sm">
          {[
             { id: "orders", label: "Orders", icon: Package },
             { id: "returns", label: "Returns", icon: RefreshCcw },
             { id: "settlements", label: "Settlements", icon: DollarSign },
             { id: "vendors", label: "Vendors KYC", icon: Users },
             { id: "products", label: "Products", icon: Award },
             { id: "homepage", label: "Homepage Control", icon: LayoutDashboard },
             { id: "inquiries", label: "Inquiries", icon: Mail },
             { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
             const Icon = tab.icon;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                   activeTab === tab.id ? "bg-orange-500 text-white shadow-md" : "text-muted hover:bg-surface hover:text-heading"
                 }`}
               >
                 <Icon size={14} /> {tab.label}
               </button>
             );
          })}
        </div>

        <div className="space-y-6">
          {/* ORDERS TAB */}
          {activeTab === "orders" && (() => {
             let totalSales = 0;
             let totalCommission = 0;
             let nonCancelledCount = 0;
             const statusCounts: Record<string, number> = {};
             const paymentCounts: Record<string, number> = {};

             orders.forEach(o => {
                const status = (o.status || "").toUpperCase();
                statusCounts[status] = (statusCounts[status] || 0) + 1;

                const method = (o.paymentMethod || "").toLowerCase();
                paymentCounts[method] = (paymentCounts[method] || 0) + 1;

                if (status !== "CANCELLED") {
                   totalSales += o.totalPaise;
                   totalCommission += o.commissionPaise || 0;
                   nonCancelledCount += 1;
                }
             });

             const aov = nonCancelledCount > 0 ? totalSales / nonCancelledCount : 0;
             const totalOrders = orders.length;

             return (
                <div className="space-y-6">
                   {/* Stats Cards Row */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm hover:border-orange-500/30 transition-all">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Gross Sales</p>
                               <h3 className="text-xl font-black text-heading mt-2">₹{(totalSales / 100).toLocaleString()}</h3>
                            </div>
                            <span className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl">
                               <DollarSign size={18} />
                            </span>
                         </div>
                         <p className="text-[10px] text-muted mt-2">Excludes cancelled orders</p>
                      </div>

                      <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm hover:border-emerald-500/30 transition-all">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Platform Earnings</p>
                               <h3 className="text-xl font-black text-emerald-500 mt-2">₹{(totalCommission / 100).toLocaleString()}</h3>
                            </div>
                            <span className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                               <Award size={18} />
                            </span>
                         </div>
                         <p className="text-[10px] text-muted mt-2">Marketplace commission share</p>
                      </div>

                      <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm hover:border-blue-500/30 transition-all">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Total Orders</p>
                               <h3 className="text-xl font-black text-blue-500 mt-2">{totalOrders}</h3>
                            </div>
                            <span className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                               <Package size={18} />
                            </span>
                         </div>
                         <p className="text-[10px] text-muted mt-2">Placed across all sellers</p>
                      </div>

                      <div className="bg-surface-card border border-border rounded-2xl p-5 shadow-sm hover:border-purple-500/30 transition-all">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Avg Order Value</p>
                               <h3 className="text-xl font-black text-purple-500 mt-2">₹{(aov / 100).toLocaleString()}</h3>
                            </div>
                            <span className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
                               <FileText size={18} />
                            </span>
                         </div>
                         <p className="text-[10px] text-muted mt-2">Mean spend per valid order</p>
                      </div>
                   </div>

                   {/* Visual Charts Section */}
                   {totalOrders > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Order Lifecycle Statuses */}
                         <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-heading flex items-center gap-1.5">
                               <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span> Order Lifecycle Status
                            </h4>
                            <div className="space-y-3">
                               {[
                                  { label: "Delivered", count: statusCounts["DELIVERED"] || 0, color: "bg-emerald-500" },
                                  { label: "Pending & Confirmed", count: (statusCounts["PENDING"] || 0) + (statusCounts["CONFIRMED"] || 0) + (statusCounts["PACKED"] || 0), color: "bg-amber-500" },
                                  { label: "In Transit / Dispatched", count: statusCounts["DISPATCHED"] || 0, color: "bg-blue-500" },
                                  { label: "Cancelled", count: statusCounts["CANCELLED"] || 0, color: "bg-red-500" },
                               ].map((st, i) => {
                                  const pct = totalOrders > 0 ? Math.round((st.count / totalOrders) * 100) : 0;
                                  return (
                                     <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-xs font-semibold">
                                           <span className="text-muted">{st.label} ({st.count})</span>
                                           <span className="text-heading">{pct}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden">
                                           <div className={`h-full ${st.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                                        </div>
                                     </div>
                                  );
                               })}
                            </div>
                         </div>

                         {/* Payment Method Split */}
                         <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-heading flex items-center gap-1.5">
                               <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> Payment Methods Split
                            </h4>
                            <div className="space-y-3">
                               {[
                                  { label: "Razorpay (Online Payment)", count: paymentCounts["razorpay"] || 0, color: "bg-indigo-500" },
                                  { label: "PayU (Online Payment)", count: paymentCounts["payu"] || 0, color: "bg-violet-500" },
                                  { label: "Cash on Delivery (COD)", count: paymentCounts["cod"] || 0, color: "bg-orange-500" },
                               ].map((pm, i) => {
                                  const pct = totalOrders > 0 ? Math.round((pm.count / totalOrders) * 100) : 0;
                                  return (
                                     <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-xs font-semibold">
                                           <span className="text-muted">{pm.label} ({pm.count})</span>
                                           <span className="text-heading">{pct}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-surface border border-border rounded-full overflow-hidden">
                                           <div className={`h-full ${pm.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                                        </div>
                                     </div>
                                  );
                               })}
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Existing Orders Table */}
                   <div className="bg-surface-card border border-border rounded-3xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                         <thead className="bg-surface text-muted">
                            <tr>
                               <th className="p-4 font-bold uppercase tracking-wider">Order ID</th>
                               <th className="p-4 font-bold uppercase tracking-wider">Date</th>
                               <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                               <th className="p-4 font-bold uppercase tracking-wider">Payment</th>
                               <th className="p-4 font-bold uppercase tracking-wider">Total</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-border">
                            {orders.map(o => (
                               <tr key={o.id} className="hover:bg-surface-hover">
                                  <td className="p-4 font-bold text-heading">{o.orderNumber}</td>
                                  <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                                  <td className="p-4">
                                     <span className="px-2 py-1 rounded bg-surface border border-border text-[9px] font-bold uppercase">
                                        {o.status.replace(/_/g, ' ')}
                                     </span>
                                  </td>
                                  <td className="p-4">
                                     <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${o.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {o.paymentMethod}
                                     </span>
                                  </td>
                                  <td className="p-4 font-bold">₹{(o.totalPaise/100).toLocaleString()}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>

                      {/* Infinite Scroll Trigger */}
                      {orderPage < orderTotalPages && (
                        <div ref={loadMoreRef} className="py-8 flex justify-center items-center w-full bg-surface/30 border-t border-border/50">
                          <div className="flex items-center gap-2 text-muted font-bold text-xs">
                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                            Loading more orders...
                          </div>
                        </div>
                      )}
                   </div>
                </div>
             );
          })()}

           {/* VENDORS TAB */}
           {activeTab === "vendors" && (
             <div className="space-y-8">
               {vendors.length === 0 ? <p className="text-center p-8 bg-surface-card rounded-2xl text-muted text-sm">No vendors registered yet.</p> : null}
               
               {/* Pending KYC Requests Box */}
               {vendors.filter(v => v.vendorStatus === "IN_REVIEW").length > 0 && (
                 <div>
                   <h3 className="text-lg font-black text-heading mb-4 flex items-center gap-2">
                     <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span> KYC Requested
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {vendors.filter(v => v.vendorStatus === "IN_REVIEW").map(v => (
                       <div key={v.id} className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 shadow-sm flex justify-between items-center">
                         <div>
                           <p className="font-bold text-heading text-lg">{v.name}</p>
                           <p className="text-xs text-muted font-mono">{v.email} | {v.mobile}</p>
                           <span className="mt-2 inline-block bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">IN REVIEW</span>
                         </div>
                         <button onClick={() => handleOpenVendorModal(v)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors">
                           Review Profile
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* All Registered Vendors */}
               <div>
                 <h3 className="text-lg font-black text-heading mb-4 flex items-center gap-2 mt-8 border-t border-border pt-8">
                   <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span> All Registered Vendors
                 </h3>
                 <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                       <thead>
                          <tr className="bg-surface text-muted">
                             <th className="p-4 font-bold uppercase tracking-wider">Vendor Name</th>
                             <th className="p-4 font-bold uppercase tracking-wider">Contact</th>
                             <th className="p-4 font-bold uppercase tracking-wider">Joined Date</th>
                             <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                             <th className="p-4 font-bold uppercase tracking-wider">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border">
                          {vendors.filter(v => v.vendorStatus !== "IN_REVIEW").map(v => (
                             <tr key={v.id} className="hover:bg-surface-hover transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted font-black text-lg uppercase">
                                      {v.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-heading text-sm flex items-center gap-1.5">
                                        {v.name}
                                        {v.vendorStatus === "APPROVED" && <CheckCircle size={14} className="text-emerald-500" />}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <p className="text-muted">{v.email}</p>
                                  <p className="font-mono text-[10px]">{v.mobile || "N/A"}</p>
                                </td>
                                <td className="p-4 text-muted">{new Date(v.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                                    v.vendorStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                                    v.vendorStatus === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                    'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                  }`}>
                                    {v.vendorStatus}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-2">
                                    <button onClick={() => handleOpenVendorModal(v)} className="px-4 py-1.5 bg-surface border border-border hover:border-orange-500 text-xs font-bold rounded-lg transition-colors">
                                      View Profile
                                    </button>
                                    <a href={`/admin/vendor-shop/${v.id}`} className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                                      Catalog
                                    </a>
                                  </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </div>
            </div>
         )}

         {/* RETURNS TAB */}
          {activeTab === "returns" && (
             <div className="space-y-6">
                {returns.filter(r => r.status === "PENDING" || r.status === "RECEIVED_AT_WAREHOUSE" || (r.status === "APPROVED" && r.vendorDeliveredAt)).length === 0 ? <p className="text-center p-8 bg-surface-card rounded-2xl text-muted text-sm">No return requests.</p> : null}
                
                {/* PRE-PICKUP APPROVALS */}
                {returns.filter(r => r.status === "PENDING").length > 0 && <h3 className="text-sm font-bold text-heading mt-4 border-b border-border pb-2">New Return Requests (Needs Pickup Approval)</h3>}
                {returns.filter(r => r.status === "PENDING").map(r => (
                   <div key={r.id} className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
                      <div className="flex gap-3 items-center mb-4">
                         <span className="font-bold text-heading text-sm">Return #{r.id}</span>
                         <span className="bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-amber-500/20">{r.status}</span>
                         <span className="text-xs text-muted ml-auto">Order: <strong className="text-heading">{r.order.orderNumber}</strong></span>
                      </div>
                      <p className="text-xs text-muted mb-4 bg-surface p-3 rounded-xl border border-border">User Reason: <strong className="text-heading">{r.reason}</strong> - {r.reasonDetail}</p>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                         <div>
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Vendor Dispatch Photos (Genuine)</h4>
                            <div className="flex flex-wrap">
                               {r.order?.items?.flatMap((i:any) => {
                                   const imgs = i.dispatchImages;
                                   if (!imgs) return [];
                                   if (typeof imgs === "string") {
                                      try { return JSON.parse(imgs); } catch(e) { return []; }
                                   }
                                   return Array.isArray(imgs) ? imgs : [];
                                }).slice(0, 4).map((img:string, i:number) => (
                                   <img key={i} src={img} alt="Dispatch Proof" className="w-20 h-20 object-cover rounded-lg border-2 border-emerald-500/30" />
                                ))}
                            </div>
                         </div>
                         <div>
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">User Return Photos (Claimed Issue)</h4>
                            <div className="flex flex-wrap gap-2">
                               {(r.returnImages as string[] || []).map((img, i) => (
                                  <img key={i} src={img} alt="Return Evidence" className="w-20 h-20 object-cover rounded-lg border-2 border-red-500/30" />
                               ))}
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex gap-3 w-full justify-end border-t border-border pt-4">
                         <span className="text-xs font-bold text-emerald-500 px-3 py-2 bg-emerald-500/10 rounded-xl">Auto-Pickup Scheduled</span>
                      </div>
                   </div>
                ))}

                {/* ACTIVE QC SLA TIMER SECTION */}
                {returns.filter(r => r.status === "APPROVED" && r.vendorDeliveredAt).length > 0 && (
                   <div className="space-y-4 mt-6">
                      <h3 className="text-sm font-bold text-heading border-b border-border pb-2">Returns Under Vendor QC Check (SLA Countdown)</h3>
                      {returns.filter(r => r.status === "APPROVED" && r.vendorDeliveredAt).map(r => (
                         <div key={r.id} className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                            <div className="flex gap-3 items-center mb-4">
                               <span className="font-bold text-heading text-sm">Return #{r.id}</span>
                               <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-500/20">QC IN PROGRESS</span>
                               <span className="text-xs text-muted ml-auto">Order: <strong className="text-heading">{r.order.orderNumber}</strong></span>
                            </div>
                            
                            {/* SLA COUNTDOWN TIMER */}
                            <div className="mb-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-pulse">
                               <div className="flex items-center gap-2">
                                  <span className="relative flex h-2 w-2">
                                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                     <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                  </span>
                                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Remaining Vendor SLA:</span>
                               </div>
                               <span className="text-xs font-black text-orange-700 font-mono bg-orange-500/5 px-2.5 py-1 rounded-lg border border-orange-500/10">
                                  {(() => {
                                     const deliveredAt = new Date(r.vendorDeliveredAt);
                                     const deadline = new Date(deliveredAt.getTime() + (settings?.vendorReturnSlaHours || 24) * 60 * 60 * 1000);
                                     const diffMs = deadline.getTime() - currentTime.getTime();
                                     if (diffMs <= 0) {
                                        return "SLA EXPIRED (Auto-refund pending)";
                                     }
                                     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                     const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                     return `${diffHours}h ${diffMins}m remaining`;
                                  })()}
                               </span>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-muted">
                               <span>Delivered to Vendor at: {new Date(r.vendorDeliveredAt).toLocaleString()}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                )}

                {/* DISPUTES (QC FAILED) */}
                {returns.filter(r => r.status === "RECEIVED_AT_WAREHOUSE").length > 0 && <h3 className="text-sm font-bold text-red-500 mt-10 border-b border-border pb-2">Disputes: Vendor Flagged Fake Return</h3>}
                {returns.filter(r => r.status === "RECEIVED_AT_WAREHOUSE").map(r => (
                   <div key={r.id} className="bg-surface-card border-2 border-red-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden mt-6">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -z-10" />
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 pb-4 border-b border-border">
                         <div>
                            <div className="flex gap-3 items-center mb-1">
                               <span className="font-bold text-heading text-lg">Disputed Return #{r.id}</span>
                               <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm animate-pulse">ACTION REQUIRED</span>
                            </div>
                            <span className="text-xs text-muted">Order: <strong className="text-heading">{r.order.orderNumber}</strong></span>
                         </div>
                         <div className="bg-red-500/5 px-4 py-3 rounded-xl border border-red-500/20">
                            <p className="text-xs text-muted mb-1 font-bold uppercase text-red-500">Vendor QC Notes:</p>
                            <p className="text-sm font-medium text-heading">{r.qcNotes}</p>
                         </div>
                      </div>
                      
                      {/* EVIDENCE COMPARISON GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                         {/* 1. Original Product */}
                         <div className="bg-surface p-4 rounded-xl border border-border">
                            <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1"><Package size={14}/> Original Product</h4>
                            {r.order?.items?.slice(0, 1).map((item: any, idx: number) => (
                               <div key={idx} className="flex flex-col gap-2">
                                  <a href={`/product/${item.product?.id}`} target="_blank" rel="noreferrer" className="block w-full aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary transition-colors">
                                     <img src={item.product?.images?.[0] || "/placeholder.jpg"} alt="Original Product" className="w-full h-full object-cover" />
                                  </a>
                                  <div>
                                     <p className="text-xs font-bold text-heading line-clamp-2 leading-tight">{item.product?.name || item.productName}</p>
                                     <p className="text-[10px] text-muted mt-1">₹{(item.unitPaise / 100).toLocaleString()} x {item.quantity}</p>
                                  </div>
                               </div>
                            ))}
                         </div>

                         {/* 2. Vendor Dispatch Evidence */}
                         <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1"><CheckCircle2 size={14}/> Vendor Dispatch</h4>
                            <div className="flex flex-wrap">
                                {(() => {
                                   const allImgs = r.order?.items?.flatMap((i:any) => {
                                      const imgs = i.dispatchImages;
                                      if (!imgs) return [];
                                      if (typeof imgs === "string") {
                                         try { return JSON.parse(imgs); } catch(e) { return []; }
                                      }
                                      return Array.isArray(imgs) ? imgs : [];
                                   }) || [];
                                   
                                   if (allImgs.length > 0) {
                                      return allImgs.slice(0, 4).map((img:string, i:number) => (
                                         <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 block">
                                            <img src={img} alt="Dispatch Proof" className="w-full h-full object-cover rounded-lg border border-emerald-500/30 hover:border-emerald-500 transition-colors" />
                                         </a>
                                      ));
                                   }
                                   return <p className="text-[10px] text-muted italic">No dispatch photos available</p>;
                                })()}
                            </div>
                         </div>

                         {/* 3. User Claim Evidence */}
                         <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20">
                            <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-1"><AlertTriangle size={14}/> User Claim</h4>
                            <p className="text-[10px] font-medium text-heading mb-2 bg-orange-500/10 px-2 py-1 rounded line-clamp-2">"{r.reasonDetail}"</p>
                            <div className="flex flex-wrap gap-2">
                               {(r.returnImages as string[] || []).map((img, i) => (
                                  <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 block">
                                     <img src={img} alt="Return Evidence" className="w-full h-full object-cover rounded-lg border border-orange-500/30 hover:border-orange-500 transition-colors" />
                                  </a>
                               ))}
                            </div>
                         </div>

                         {/* 4. Vendor QC Proof */}
                         <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                            <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-1"><XCircle size={14}/> Vendor QC Proof</h4>
                            <div className="flex flex-wrap gap-2">
                               {(r.qcImages as string[] || []).map((img, i) => (
                                  <a key={i} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 block">
                                     <img src={img} alt="Vendor QC Proof" className="w-full h-full object-cover rounded-lg border border-red-500/50 hover:border-red-500 transition-colors" />
                                  </a>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* RESOLUTION SECTION */}
                      <div className="bg-surface p-5 rounded-xl border border-border">
                         <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-3">Admin Resolution</h4>
                         <textarea 
                            id={`admin_notes_${r.id}`} 
                            placeholder="Write resolution notes to send to the user and vendor explaining your decision..."
                            className="w-full p-3 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-heading mb-4 min-h-[80px]"
                         />

                         <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center">
                            <div className="flex gap-4">
                               <label className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors border border-red-500/10">
                                  <input type="checkbox" id={`ban_user_${r.id}`} className="rounded border-red-500/50 text-red-500 focus:ring-red-500 bg-black/20" />
                                  BAN USER
                               </label>
                               <label className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors border border-red-500/10">
                                  <input type="checkbox" id={`ban_vendor_${r.id}`} className="rounded border-red-500/50 text-red-500 focus:ring-red-500 bg-black/20" />
                                  BAN VENDOR
                               </label>
                            </div>
                            <div className="flex gap-3">
                               <button onClick={() => {
                                  const banUser = (document.getElementById(`ban_user_${r.id}`) as HTMLInputElement)?.checked;
                                  const banVendor = (document.getElementById(`ban_vendor_${r.id}`) as HTMLInputElement)?.checked;
                                  const adminNotes = (document.getElementById(`admin_notes_${r.id}`) as HTMLTextAreaElement)?.value;
                                  if (!adminNotes) return alert("Please add resolution notes before proceeding.");
                                  if(confirm("Refund User? The vendor will NOT be paid.")) handleUpdateReturn(r.id, "QC_PASS", undefined, banUser, banVendor, adminNotes);
                               }} className="px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-500 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm">Side with User (Refund)</button>
                               
                               <button onClick={() => {
                                  const banUser = (document.getElementById(`ban_user_${r.id}`) as HTMLInputElement)?.checked;
                                  const banVendor = (document.getElementById(`ban_vendor_${r.id}`) as HTMLInputElement)?.checked;
                                  const adminNotes = (document.getElementById(`admin_notes_${r.id}`) as HTMLTextAreaElement)?.value;
                                  if (!adminNotes) return alert("Please add resolution notes before proceeding.");
                                  if(confirm("Pay Vendor? The user will NOT be refunded.")) handleUpdateReturn(r.id, "QC_FAIL", undefined, banUser, banVendor, adminNotes);
                               }} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm shadow-red-500/20">Side with Vendor (Reject Refund)</button>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {/* SETTLEMENTS TAB */}
          {activeTab === "settlements" && (() => {
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

             return (
                <div className="space-y-6">
                   {settlementSummary && (
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
                         <div className="text-xs text-muted">
                            {excludedVendorIds.length > 0 && <span className="text-amber-500 font-bold">{excludedVendorIds.length} Excluded</span>}
                         </div>
                         <button
                            onClick={async () => {
                               const eligibleVendors = groupedSettlements.filter((g:any) => g.summary.eligible > 0);
                               const vendorsToPay = eligibleVendors.filter((g:any) => !excludedVendorIds.includes(g.vendor.id)).map((g:any) => g.vendor.id);
                               
                               if (vendorsToPay.length === 0) {
                                  alert("No eligible vendors selected for payout.");
                                  return;
                               }

                               if (confirm(`Are you sure you want to process Razorpay payouts for ${vendorsToPay.length} vendors?`)) {
                                  setIsProcessingPayout(true);
                                  try {
                                     const res = await fetch("/api/admin/settlements/payout", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ vendorIds: vendorsToPay })
                                     });
                                     const data = await res.json();
                                     if (res.ok) {
                                        showToast(data.message || "Bulk payout processed successfully", "success");
                                        fetchData();
                                     } else {
                                        alert(data.error || "Failed to process bulk payout");
                                     }
                                  } catch (e) {
                                     alert("Error processing bulk payout");
                                  } finally {
                                     setIsProcessingPayout(false);
                                  }
                               }
                            }}
                            disabled={isProcessingPayout}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap"
                         >
                            {isProcessingPayout ? <RefreshCcw size={16} className="animate-spin" /> : <DollarSign size={16} />}
                            Payout All (Global)
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
                                                     setExcludedVendorIds(prev => prev.filter(id => id !== group.vendor.id));
                                                  } else {
                                                     setExcludedVendorIds(prev => [...prev, group.vendor.id]);
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
                </div>
             );
          })()}

          {/* MODAL */}
          <AnimatePresence>
             {selectedVendorSettlement && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedVendorSettlement(null)}/>
                   <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="bg-surface-card border border-border rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="p-6 border-b border-border flex justify-between items-center bg-surface shrink-0">
                               <div className="flex gap-4 items-center">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border bg-background flex items-center justify-center">
                                     {selectedVendorSettlement.vendor.logo ? <img src={selectedVendorSettlement.vendor.logo} alt="Logo" className="w-full h-full object-cover"/> : <Store size={20} className="text-muted"/>}
                                  </div>
                                  <div>
                                     <h2 className="text-xl font-bold text-heading">{selectedVendorSettlement.vendor.storeName || selectedVendorSettlement.vendor.companyName || selectedVendorSettlement.vendor.name}</h2>
                                     <p className="text-xs text-muted">Eligible Payout Invoice</p>
                                  </div>
                               </div>
                               <button onClick={() => setSelectedVendorSettlement(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-border transition-colors text-muted">
                                  <X size={16}/>
                               </button>
                            </div>

                            {/* Payout Banner */}
                            <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 flex items-center justify-between shrink-0">
                               <div className="flex flex-col">
                                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Amount to Pay</p>
                                  <p className="text-4xl font-black text-emerald-500">₹{(selectedVendorSettlement.summary.eligible / 100).toLocaleString()}</p>
                               </div>
                               {selectedVendorSettlement.summary.eligible > 0 && (
                                  <button
                                     onClick={async () => {
                                        if (confirm(`Process Razorpay payout of ₹${(selectedVendorSettlement.summary.eligible / 100).toLocaleString()} for ${selectedVendorSettlement.vendor.name}?`)) {
                                           setIsProcessingPayout(true);
                                           try {
                                              const res = await fetch("/api/admin/settlements/payout", {
                                                 method: "POST",
                                                 headers: { "Content-Type": "application/json" },
                                                 body: JSON.stringify({ vendorIds: [selectedVendorSettlement.vendor.id] })
                                              });
                                              const data = await res.json();
                                              if (res.ok) {
                                                 showToast(data.message || "Payout processed successfully", "success");
                                                 fetchData();
                                                 setSelectedVendorSettlement((prev: any) => ({
                                                    ...prev,
                                                    summary: { ...prev.summary, eligible: 0, settled: prev.summary.settled + prev.summary.eligible },
                                                    settlements: prev.settlements.map((st: any) => st.status === 'ELIGIBLE' ? { ...st, status: 'SETTLED' } : st)
                                                 }));
                                              } else {
                                                 alert(data.error || "Failed to process payout");
                                              }
                                           } catch (e) {
                                              alert("Error processing payout");
                                           } finally {
                                              setIsProcessingPayout(false);
                                           }
                                        }
                                     }}
                                     disabled={isProcessingPayout}
                                     className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                  >
                                     {isProcessingPayout ? <RefreshCcw size={18} className="animate-spin" /> : <DollarSign size={18} />}
                                     Payout All for this Vendor
                                  </button>
                               )}
                            </div>

                            {/* List of Products/Orders */}
                            <div className="overflow-y-auto p-6 flex-1">
                               <h3 className="text-sm font-bold text-heading mb-4">Eligible Orders Breakdown</h3>
                               <table className="w-full text-left text-xs">
                                  <thead className="text-muted border-b border-border">
                                     <tr>
                                        <th className="pb-3 font-bold uppercase">Order #</th>
                                        <th className="pb-3 font-bold uppercase">Status</th>
                                        <th className="pb-3 font-bold uppercase text-right">Order Value</th>
                                        <th className="pb-3 font-bold uppercase text-right">Vendor Share</th>
                                        <th className="pb-3 font-bold uppercase text-right">Action</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border">
                                     {selectedVendorSettlement.settlements.filter((s:any) => s.status === 'ELIGIBLE' || s.status === 'HOLD' || s.status === 'SETTLED').map((s:any) => (
                                        <tr key={s.id} className="hover:bg-surface-hover/50 transition-colors">
                                           <td className="py-4 font-bold text-orange-500">{s.order?.orderNumber}</td>
                                           <td className="py-4">
                                              <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${s.status === 'HOLD' ? 'bg-amber-500/10 text-amber-600' : s.status === 'ELIGIBLE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                                 {s.status}
                                              </span>
                                           </td>
                                           <td className="py-4 text-right">₹{(s.orderAmountPaise/100).toLocaleString()}</td>
                                           <td className="py-4 font-bold text-heading text-right">₹{(s.vendorPayoutPaise/100).toLocaleString()}</td>
                                           <td className="py-4 text-right flex justify-end gap-2">
                                              <button onClick={() => generateInvoice(s)} title="Download Commission Invoice" className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-bold transition-colors shadow-sm flex items-center gap-1">
                                                <Download size={12} />
                                                Invoice
                                              </button>
                                              {s.status === 'ELIGIBLE' && (
                                                 <button onClick={async () => {
                                                    const ref = window.prompt("Enter Bank UTR / Payment Reference to mark as Paid:");
                                                    if (ref) {
                                                       const res = await fetch(`/api/admin/settlements/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "SETTLE", vendorPaymentRef: ref, vendorPaymentMode: "bank_transfer" }) });
                                                       if (res.ok) { 
                                                          fetchData(); 
                                                          // Update modal state manually so it updates instantly without closing
                                                          setSelectedVendorSettlement((prev: any) => ({
                                                             ...prev,
                                                             summary: { ...prev.summary, eligible: prev.summary.eligible - s.vendorPayoutPaise, settled: prev.summary.settled + s.vendorPayoutPaise },
                                                             settlements: prev.settlements.map((st: any) => st.id === s.id ? { ...st, status: 'SETTLED' } : st)
                                                          }));
                                                          showToast("Payout recorded successfully", "success");
                                                       } else alert("Failed to settle");
                                                    }
                                                 }} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm">Pay Out</button>
                                              )}
                                              {(s.status === 'ELIGIBLE' || s.status === 'HOLD') && (
                                                <button onClick={async () => {
                                                   const newStatus = s.status === 'ELIGIBLE' ? 'HOLD' : 'ELIGIBLE';
                                                   if (confirm(`Change settlement status to ${newStatus}?`)) {
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
                                                      } else alert("Failed to update status");
                                                   }
                                                }} className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-colors ${s.status === 'ELIGIBLE' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'}`}>
                                                   {s.status === 'ELIGIBLE' ? "Hold" : "Release"}
                                                </button>
                                              )}
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>
                         </motion.div>
                      </div>
                   )}
                </AnimatePresence>

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
             <>
               {!settings ? (
                 <div className="bg-surface-card border border-border rounded-3xl p-8 text-center text-muted">
                    <p>Loading settings or database migration pending.</p>
                    <p className="text-xs mt-2">If this persists, run <code>npx prisma db push</code>.</p>
                 </div>
               ) : (
                 <form onSubmit={handleSaveSettings} className="bg-surface-card border border-border rounded-3xl p-6 md:p-8 max-w-2xl space-y-6">
                <h2 className="text-lg font-bold text-heading">Platform Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Default Commission Rate (%)</label>
                      <input type="number" step="0.1" value={settings.defaultCommissionRate} onChange={e => setSettings({...settings, defaultCommissionRate: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Global Tax Rate (%)</label>
                      <input type="number" step="0.1" value={settings.taxRate || 0} onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Free Shipping Above (₹)</label>
                      <input type="number" value={settings.shippingFreeAbove / 100} onChange={e => setSettings({...settings, shippingFreeAbove: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Standard Shipping Charge (₹)</label>
                      <input type="number" value={settings.shippingChargePaise / 100} onChange={e => setSettings({...settings, shippingChargePaise: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">COD Shipping Charge (₹)</label>
                      <input type="number" value={settings.codShippingChargePaise / 100} onChange={e => setSettings({...settings, codShippingChargePaise: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Max COD Amount (₹)</label>
                      <input type="number" value={settings.codMaxAmountPaise / 100} onChange={e => setSettings({...settings, codMaxAmountPaise: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Return Window (Days)</label>
                      <input type="number" value={settings.returnWindowDays} onChange={e => setSettings({...settings, returnWindowDays: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted text-emerald-500">Auto-Refund SLA (Hours)</label>
                      <input type="number" value={settings.vendorReturnSlaHours || 24} onChange={e => setSettings({...settings, vendorReturnSlaHours: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted text-blue-500">Vendor Payout Schedule</label>
                      <select 
                         value={settings.payoutSchedule || "MANUAL"} 
                         onChange={e => setSettings({...settings, payoutSchedule: e.target.value})}
                         className="w-full px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold appearance-none cursor-pointer"
                      >
                         <option value="MANUAL">Manual (Button Click Only)</option>
                         <option value="DAILY">Daily Automation</option>
                         <option value="WEEKLY_WED">Weekly (Every Wednesday)</option>
                         <option value="WEEKLY_THU">Weekly (Every Thursday)</option>
                         <option value="BIWEEKLY">Bi-Weekly (Every 15 Days)</option>
                         <option value="MONTHLY">Monthly (1st of the Month)</option>
                         <option value="CUSTOM_DAYS">Custom Interval (Every X Days)</option>
                      </select>
                   </div>
                   
                   {settings.payoutSchedule === "CUSTOM_DAYS" && (
                     <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted text-blue-500">Custom Payout Interval (Days)</label>
                        <input 
                          type="number" 
                          min="1"
                          max="365"
                          value={settings.payoutCustomDays || 10} 
                          onChange={e => setSettings({...settings, payoutCustomDays: parseInt(e.target.value) || 1})} 
                          className="w-full px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold" 
                        />
                        <p className="text-[9px] text-muted">Payouts will trigger automatically every {settings.payoutCustomDays || 10} days.</p>
                     </div>
                   )}
                </div>

                <div className="pt-4 space-y-4">
                   <label className="flex items-center gap-2 text-xs font-bold text-heading cursor-pointer">
                      <input type="checkbox" checked={settings.codEnabled} onChange={e => setSettings({...settings, codEnabled: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500" />
                      Enable Cash on Delivery (COD)
                   </label>
                   <label className="flex items-center gap-2 text-xs font-bold text-heading cursor-pointer">
                      <input type="checkbox" checked={settings.returnEnabled} onChange={e => setSettings({...settings, returnEnabled: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500" />
                      Enable Returns
                   </label>
                   <label className="flex items-center gap-2 text-xs font-bold text-heading cursor-pointer">
                      <input type="checkbox" checked={settings.shiprocketAutoAssign} onChange={e => setSettings({...settings, shiprocketAutoAssign: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500" />
                      Auto-Assign Courier via Shiprocket
                   </label>
                </div>

                <button type="submit" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                   Save Settings
                </button>
             </form>
               )}
             </>
          )}


          {/* PRODUCTS TAB */}
          {activeTab === "products" && (() => {
            const filteredProducts = products.filter(p => {
              if (globalProductCategory && p.categoryName !== globalProductCategory) return false;
              if (globalProductMaterial && p.material !== globalProductMaterial) return false;
              if (globalProductSearch && !p.name.toLowerCase().includes(globalProductSearch.toLowerCase())) return false;
              return true;
            });

            const availableMaterials = ["Bronze", "Copper", "Brass", "Steel", "Ceramic", "Glass"];

            return (
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
                  <div className="bg-surface-card border border-border/80 rounded-3xl p-5 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent space-y-6">
                    
                    {/* Search */}
                    <div>
                      <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Search Products</h3>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
                        <input 
                          type="text"
                          placeholder="Search product name..."
                          value={globalProductSearch}
                          onChange={(e) => setGlobalProductSearch(e.target.value)}
                          className="w-full bg-surface border border-border hover:border-border/80 focus:border-orange-500 focus:bg-surface-hover focus:ring-1 focus:ring-orange-500 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none text-heading placeholder-muted transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Categories Filter */}
                    <div>
                      <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Categories</h3>
                      <div className="flex flex-wrap gap-1.5">
                        <button 
                          onClick={() => setGlobalProductCategory("")}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                            globalProductCategory === ""
                              ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                              : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                          }`}
                        >
                          All Categories
                        </button>
                        {dbCategories.map(cat => (
                          <button 
                            key={cat.slug}
                            onClick={() => setGlobalProductCategory(cat.slug)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                              globalProductCategory === cat.slug
                                ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                                : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Materials Filter */}
                    <div>
                      <h3 className="text-xs font-bold text-heading mb-3 uppercase tracking-wider">Materials</h3>
                      <div className="flex flex-wrap gap-1.5">
                        <button 
                          onClick={() => setGlobalProductMaterial("")}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                            globalProductMaterial === ""
                              ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                              : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                          }`}
                        >
                          All Materials
                        </button>
                        {availableMaterials.map(mat => (
                          <button 
                            key={mat}
                            onClick={() => setGlobalProductMaterial(mat)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                              globalProductMaterial === mat
                                ? "bg-orange-500 border-orange-500 text-white font-bold shadow-sm"
                                : "bg-surface border-border text-muted hover:border-orange-500/30 hover:text-heading"
                            }`}
                          >
                            {mat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Product Grid Area */}
                <div className="flex-1 min-w-0">
                  {selectedProducts.length > 0 && (
                    <div className="sticky top-4 z-40 bg-orange-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between mb-6 animate-in fade-in slide-in-from-top-4">
                      <div className="font-bold">
                        {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} Selected
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium">Assign to:</span>
                        <select 
                          value={selectedCategorySlug}
                          onChange={e => setSelectedCategorySlug(e.target.value)}
                          className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg outline-none font-bold"
                        >
                          <option value="" disabled>Select Section...</option>
                          {dbCategories.map(cat => (
                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={handleAssignToHomepage}
                          className="bg-slate-900 hover:bg-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                          disabled={!selectedCategorySlug}
                        >
                          Save to Section
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-heading">Catalog ({filteredProducts.length} items)</h2>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="bg-surface-card border border-border p-12 rounded-3xl text-center text-muted">
                      No products match your filters.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.slice(0, 50).map(p => {
                          const vendor = vendors.find(v => v.id === p.vendorId);
                          const isSelected = selectedProducts.includes(p.id);
                          return (
                          <div key={p.id} className={`bg-surface border ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-border hover:border-orange-500/50'} rounded-xl overflow-hidden group relative flex flex-col transition-all cursor-pointer`}>
                            {/* Checkbox for Selection */}
                            <div className="absolute top-2 left-2 z-20" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedProducts([...selectedProducts, p.id]);
                                  else setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                                }}
                                className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 cursor-pointer shadow-sm border-2 border-white bg-white"
                              />
                            </div>

                            <div onClick={() => setModalProduct(p)} className="flex flex-col flex-grow">
                              <div className="h-40 relative overflow-hidden bg-surface-hover">
                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={p.name} />
                                {!p.active && <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-[2px]">HIDDEN</span>}
                              </div>
                              <div className="p-3 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-1 gap-2">
                                  <p className="text-xs font-bold text-heading truncate group-hover:text-orange-500 transition-colors" title={p.name}>{p.name}</p>
                                </div>
                                
                                <p className="text-[10px] font-bold text-blue-500 truncate mb-1">
                                  Seller: <span className="text-muted">{vendors.find(v => String(v.id) === String(p.vendorId))?.name || "Admin"}</span>
                                </p>

                                <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
                                  <p className="text-xs font-black text-emerald-500">₹{p.price.toLocaleString()}</p>
                                  {p.stock <= 5 ? (
                                    <p className="text-[10px] font-bold text-red-500">Only {p.stock} left</p>
                                  ) : (
                                    <p className="text-[10px] text-muted">{p.stock} in stock</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {filteredProducts.length > 50 && (
                      <div className="mt-6 text-center text-xs text-muted font-bold bg-surface p-3 rounded-lg border border-border">
                        Showing top 50 results. Use the search bar to find specific products out of {filteredProducts.length}.
                      </div>
                    )}
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* HOMEPAGE CMS TAB */}
          {activeTab === "homepage" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-surface-card p-6 rounded-2xl border border-border shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-heading">Homepage Sections Control</h3>
                  <p className="text-xs text-muted mt-1">Select up to 15 products per existing category to highlight on the homepage.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={async () => {
                    try {
                      const res = await fetch("/api/admin/settings/homepage", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ homepageSections })
                      });
                      if (res.ok) {
                        showToast("Homepage configuration saved successfully!", "success");
                      } else {
                        const errText = await res.text();
                        showToast(`Failed to save homepage settings. Server says: ${errText}`, "error");
                      }
                    } catch (e: any) { showToast(`Error saving homepage: ${e.message}`, "error"); }
                  }} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm transition-colors">
                    Save Live Homepage
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {dbCategories.map((cat) => {
                  const section = homepageSections.find(s => s.slug === cat.slug) || { slug: cat.slug, productIds: [] as number[] };
                  return (
                  <div key={cat.slug} className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold text-heading">{cat.name}</h4>
                      <button onClick={() => setEditingSectionSlug(editingSectionSlug === cat.slug ? null : cat.slug)} className="px-3 py-1.5 bg-surface border border-border rounded-lg text-[10px] font-bold text-blue-500 hover:border-blue-500">
                        {editingSectionSlug === cat.slug ? "Close Picker" : "Edit Products"}
                      </button>
                    </div>

                    {/* Visual Product Picker Block */}
                    {editingSectionSlug === cat.slug && (
                      <div className="mb-6 p-4 bg-surface border border-border rounded-xl">
                        <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
                          <p className="text-xs font-bold text-heading">Select up to 15 products (Currently: {section.productIds.length}/15)</p>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                            <input 
                              type="text" 
                              placeholder="Search catalog to add..." 
                              value={cmsProductSearch}
                              onChange={(e) => setCmsProductSearch(e.target.value)}
                              className="pl-8 pr-4 py-2 bg-surface-card border border-border rounded-lg text-xs w-64 focus:border-orange-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                          {products
                            .filter(p => p.categoryName === cat.slug && p.name.toLowerCase().includes(cmsProductSearch.toLowerCase()))
                            .slice(0, 50)
                            .map(p => {
                            const isSelected = section.productIds.includes(p.id);
                            return (
                              <div 
                                key={p.id} 
                                onClick={() => {
                                  const newSecs = [...homepageSections];
                                  const secIdx = newSecs.findIndex(s => s.slug === cat.slug);
                                  
                                  if (isSelected) {
                                    if (secIdx > -1) {
                                      newSecs[secIdx].productIds = newSecs[secIdx].productIds.filter(id => id !== p.id);
                                    }
                                  } else {
                                    if (secIdx > -1) {
                                      if (newSecs[secIdx].productIds.length < 15) newSecs[secIdx].productIds.push(p.id);
                                      else showToast("Maximum 15 products allowed per section.", "error");
                                    } else {
                                      newSecs.push({ slug: cat.slug, title: cat.name, productIds: [p.id] });
                                    }
                                  }
                                  setHomepageSections(newSecs);
                                }}
                                className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-border/50 hover:border-orange-500/50'}`}
                              >
                                <img src={p.image} className="w-full h-24 object-cover" />
                                <div className="p-2 bg-surface">
                                  <p className="text-[9px] font-bold truncate" title={p.name}>{p.name}</p>
                                  <p className="text-[10px] text-muted">₹{p.price}</p>
                                  {isSelected && <div className="mt-1 bg-orange-500 text-white text-[8px] font-bold text-center py-0.5 rounded">SELECTED</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {products.filter(p => p.categoryName === cat.slug && p.name.toLowerCase().includes(cmsProductSearch.toLowerCase())).length > 50 && (
                          <p className="text-[10px] text-center text-muted mt-3 italic">Showing first 50 results. Type in the search box to find specific products.</p>
                        )}
                      </div>
                    )}

                    {/* Display Selected Products */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
                      {section.productIds.length === 0 && <p className="text-xs text-muted italic">No products selected for this section yet.</p>}
                      {section.productIds.map(pid => {
                        const p = products.find(prod => prod.id === pid);
                        if (!p) return null;
                        return (
                          <div key={pid} className="flex-shrink-0 w-32 border border-border/80 rounded-xl overflow-hidden shadow-sm relative group">
                            <button onClick={() => {
                              const newSecs = [...homepageSections];
                              const secIdx = newSecs.findIndex(s => s.slug === cat.slug);
                              if (secIdx > -1) {
                                newSecs[secIdx].productIds = newSecs[secIdx].productIds.filter(id => id !== pid);
                                setHomepageSections(newSecs);
                              }
                            }} className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600">
                              <X size={12} />
                            </button>
                            <img src={p.image} className="w-full h-32 object-cover" />
                            <div className="p-2 bg-surface text-center border-t border-border/50">
                              <p className="text-[10px] font-bold truncate text-heading" title={p.name}>{p.name}</p>
                              <p className="text-[10px] text-orange-500 font-black">₹{p.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )})}
              </div>
            </div>
          )}
          
          {/* INQUIRIES TAB */}
          {activeTab === "inquiries" && (
             <div className="bg-surface-card border border-border rounded-2xl overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                   <thead>
                       <tr className="bg-surface text-muted">
                          <th className="p-4 font-bold uppercase">Name</th>
                          <th className="p-4 font-bold uppercase">Phone</th>
                          <th className="p-4 font-bold uppercase">Email</th>
                          <th className="p-4 font-bold uppercase">Message</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                       {inquiries.map(i => (
                          <tr key={i.id} className="hover:bg-surface-hover">
                             <td className="p-4 font-bold text-heading whitespace-nowrap">{i.name}</td>
                             <td className="p-4 whitespace-nowrap font-mono">{i.phone || "N/A"}</td>
                             <td className="p-4">{i.email}</td>
                             <td 
                               className="p-4 max-w-md truncate cursor-pointer text-blue-500 hover:text-blue-600 hover:underline" 
                               onClick={() => setSelectedInquiryMessage(i.message)}
                               title="Click to read full message"
                             >
                               {i.message}
                             </td>
                          </tr>
                       ))}
                   </tbody>
                </table>
             </div>
          )}

        </div>
      </div>

      {/* INQUIRY MESSAGE MODAL */}
      {selectedInquiryMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedInquiryMessage(null)}
              className="absolute top-4 right-4 p-2 text-muted hover:text-heading bg-surface-hover rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                <Mail size={20} className="text-orange-500" /> Full Inquiry Message
              </h3>
              <div className="bg-surface-card border border-border/60 rounded-2xl p-5 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-heading leading-relaxed whitespace-pre-wrap">
                  {selectedInquiryMessage}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setSelectedInquiryMessage(null)}
                  className="px-6 py-2.5 bg-surface-hover text-heading hover:bg-border rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setModalProduct(null)} className="absolute top-4 right-4 p-2 bg-surface-hover hover:bg-red-500 hover:text-white text-muted rounded-xl transition-colors z-10">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Images */}
                <div className="md:w-1/2 space-y-4">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-surface-hover border border-border">
                    <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-full object-cover" />
                  </div>
                  {modalProduct.images && Array.isArray(modalProduct.images) && modalProduct.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
                      {modalProduct.images.map((img: string, idx: number) => (
                        <img key={idx} src={img} alt="" className="w-20 h-20 rounded-xl object-cover border border-border flex-shrink-0" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="md:w-1/2 flex flex-col">
                  <div className="mb-2">
                    <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-orange-500/20">{modalProduct.categoryName}</span>
                  </div>
                  <h2 className="text-2xl font-black text-heading leading-tight mb-2">{modalProduct.name}</h2>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-blue-500">
                      Seller: <span className="text-muted">{vendors.find(v => String(v.id) === String(modalProduct.vendorId))?.name || "Admin"}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="text-3xl font-black text-emerald-500">₹{modalProduct.price.toLocaleString()}</div>
                    <div className="text-sm text-muted line-through">₹{modalProduct.mrp.toLocaleString()}</div>
                    <div className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-lg">-{modalProduct.discount}%</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-card p-4 rounded-2xl border border-border">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Material</p>
                      <p className="font-bold text-heading">{modalProduct.material}</p>
                    </div>
                    <div className="bg-surface-card p-4 rounded-2xl border border-border">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Stock Level</p>
                      <p className={`font-bold ${modalProduct.stock <= 5 ? 'text-red-500' : 'text-heading'}`}>{modalProduct.stock} Units</p>
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div>
                      <h3 className="text-xs font-bold text-heading mb-2">Description</h3>
                      <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                        {modalProduct.description?.length > 200 && !descExpanded 
                          ? `${modalProduct.description.substring(0, 200)}...` 
                          : modalProduct.description}
                      </p>
                      {modalProduct.description?.length > 200 && (
                        <button 
                          onClick={() => setDescExpanded(!descExpanded)} 
                          className="text-orange-500 hover:text-orange-600 text-xs font-bold mt-2 hover:underline"
                        >
                          {descExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                    {modalProduct.specs && (
                      <div>
                        <h4 className="text-sm font-bold text-heading mb-2 mt-4">Specifications</h4>
                        <div className="bg-surface-hover p-4 rounded-xl border border-border">
                          <p className="text-xs text-muted leading-relaxed">
                            {modalProduct.specs.split(' | ').map((s: string) => <span key={s} className="block mb-1">• {s}</span>)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR PROFILE MODAL */}
      {vendorProfileModal && (() => {
        const v = vendorProfileModal;
        const vProductsCount = products.filter(p => p.vendorId === v.id).length;
        
        return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setVendorProfileModal(null)} className="absolute top-4 right-4 p-2 bg-surface-hover hover:bg-red-500 hover:text-white text-muted rounded-xl transition-colors z-10">
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
            
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-3xl uppercase shadow-inner">
                  {v.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-heading flex items-center gap-2">
                    {v.name}
                    {v.vendorStatus === "APPROVED" && <CheckCircle size={20} className="text-emerald-500" />}
                  </h2>
                  <p className="text-sm text-muted font-mono">{v.email} | {v.mobile || "No Mobile"}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    v.vendorStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                    v.vendorStatus === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {v.vendorStatus.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-widest">Status</p>
                </div>
              </div>

              {/* Redbox KYC Profile */}
              <div className="bg-red-500/5 border-2 border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4">Official KYC Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">GSTIN</p>
                    <p className="font-mono text-sm font-bold text-heading">{v.gstin || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">PAN Number</p>
                    <p className="font-mono text-sm font-bold text-heading">{v.pan || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">Aadhaar</p>
                    <p className="font-mono text-sm font-bold text-heading">{v.aadhaar || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">Registered Location</p>
                    <p className="text-sm font-bold text-heading">{v.location || "Not Provided"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-red-500/10">
                  <div className="bg-surface/50 p-4 rounded-xl border border-red-500/10 flex flex-col justify-between">
                    <div>
                       <p className="text-[10px] text-muted font-bold uppercase mb-2">Bank Details</p>
                       <p className="text-xs font-mono font-bold text-heading mb-1">A/C: {v.bankAccount || "N/A"}</p>
                       <p className="text-xs font-mono font-bold text-heading">IFSC: {v.bankIfsc || "N/A"}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-red-500/10 flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-bold text-heading uppercase tracking-wider">Hold Vendor Payouts</p>
                          <p className="text-[9px] text-muted leading-tight mt-0.5">Pause automated settlement transfers.</p>
                       </div>
                       <button
                         onClick={async () => {
                            const newValue = !v.payoutsPaused;
                            const updatedVendorOptimistic = { ...v, payoutsPaused: newValue };
                            setVendorProfileModal(updatedVendorOptimistic);
                            setVendors(vendors.map(vendor => vendor.id === v.id ? updatedVendorOptimistic : vendor));
                            
                            try {
                               await fetch(`/api/admin/vendors/${v.id}/hold-payouts`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ payoutsPaused: newValue })
                               });
                            } catch (e) {
                               console.error("Failed to hold payouts");
                            }
                         }}
                         className={`relative w-10 h-5 rounded-full transition-colors flex items-center border ${v.payoutsPaused ? 'bg-red-500 border-red-600' : 'bg-surface border-border'}`}
                       >
                         <span className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${v.payoutsPaused ? 'translate-x-5' : 'translate-x-1'}`} />
                       </button>
                    </div>
                  </div>
                  <div className="bg-surface/50 p-4 rounded-xl border border-red-500/10 flex flex-col justify-center gap-2">
                    <p className="text-[10px] text-muted font-bold uppercase">Uploaded Documents</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {v.aadhaarUrl ? <a href={v.aadhaarUrl} target="_blank" className="text-[11px] font-bold text-blue-500 hover:underline">View Aadhaar</a> : <span className="text-[11px] text-muted italic">No Aadhaar</span>}
                      <span className="text-muted text-[10px]">|</span>
                      {v.panUrl ? <a href={v.panUrl} target="_blank" className="text-[11px] font-bold text-blue-500 hover:underline">View PAN</a> : <span className="text-[11px] text-muted italic">No PAN</span>}
                      <span className="text-muted text-[10px]">|</span>
                      {v.docUrl ? <a href={v.docUrl} target="_blank" className="text-[11px] font-bold text-blue-500 hover:underline">Other Doc</a> : <span className="text-[11px] text-muted italic">No Other Doc</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total Products */}
                <div className="bg-surface-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <Award size={32} className="text-orange-500 mb-2 opacity-80" />
                  <p className="text-4xl font-black text-heading">{vProductsCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Total Products</p>
                  <a href={`/admin/vendor-shop/${v.id}`} className="mt-4 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-colors w-full">
                    View Catalog Page
                  </a>
                </div>

                {/* Total Revenue */}
                <div className="bg-surface-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <Award size={32} className="text-emerald-500 mb-2 opacity-80" />
                  <p className="text-4xl font-black text-emerald-500">₹{(vendorProducts.reduce((acc, p) => acc + (p.revenuePaise || 0), 0) / 100).toLocaleString()}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Total Money Generated</p>
                </div>

                {/* Category Permissions */}
                <div className="md:col-span-2 bg-surface-card border border-border rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] uppercase font-bold text-muted">Category Upload Permissions</p>
                    <button 
                      onClick={async () => {
                        const updatedVendorOptimistic = { ...v, allowedCategories: null };
                        setVendorProfileModal(updatedVendorOptimistic);
                        setVendors(vendors.map(vendor => vendor.id === v.id ? updatedVendorOptimistic : vendor));
                        
                        await fetch(`/api/admin/vendors/${v.id}/permissions`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ allowedCategories: null })
                        });
                      }}
                      className="text-[10px] font-bold text-orange-500 hover:text-orange-600 bg-orange-500/10 px-2 py-1 rounded transition-colors"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dbCategories.map(cat => {
                      const allowedList = v.allowedCategories ? v.allowedCategories.split(',').map((c:string) => c.trim()).filter(Boolean) : [];
                      const isAllowed = v.allowedCategories === null || allowedList.includes(cat.slug);
                      return (
                        <label key={cat.id} className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${isAllowed ? 'bg-orange-500/10 border-orange-500/30 text-orange-600' : 'bg-surface border-border text-muted hover:border-orange-500/50'}`}>
                          <input 
                            type="checkbox" 
                            checked={isAllowed}
                            onChange={async (e) => {
                              const checked = e.target.checked;
                              
                              let currentList: string[] = v.allowedCategories ? v.allowedCategories.split(',').map((c:string) => c.trim()).filter(Boolean) : [];
                              if (v.allowedCategories === null) {
                                currentList = dbCategories.map(c => c.slug);
                              }
                              
                              let newList;
                              if (checked) {
                                newList = [...currentList, cat.slug];
                              } else {
                                newList = currentList.filter(slug => slug !== cat.slug);
                              }
                              
                              // If they deselected everything, it should be an empty string, NOT null (null means allow all).
                              // If it's completely empty, we save ""
                              const allowedStr = newList.length === 0 ? "" : newList.join(',');
                              
                              // Optimistic Update
                              const updatedVendorOptimistic = { ...v, allowedCategories: allowedStr };
                              setVendorProfileModal(updatedVendorOptimistic);
                              setVendors(vendors.map(vendor => vendor.id === v.id ? updatedVendorOptimistic : vendor));

                              const res = await fetch(`/api/admin/vendors/${v.id}/permissions`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ allowedCategories: allowedStr })
                              });
                              if (!res.ok) {
                                // Revert on failure
                                setVendorProfileModal(v);
                                setVendors(vendors.map(vendor => vendor.id === v.id ? v : vendor));
                                alert("Failed to update permission");
                              }
                            }}
                            className="w-3 h-3 rounded text-orange-500 focus:ring-orange-500" 
                          />
                          {cat.name}
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Vendor Products List */}
              <div className="mt-8 pt-8 border-t border-border">
                 <h3 className="text-sm font-black text-heading uppercase tracking-widest mb-4 flex items-center justify-between">
                    Vendor Products
                    {loadingVendorProducts && <RefreshCcw size={14} className="animate-spin text-muted" />}
                 </h3>
                 
                 <div className="bg-surface border border-border rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                       <thead className="bg-surface-hover text-muted sticky top-0 z-10 shadow-sm">
                          <tr>
                             <th className="p-3 font-bold uppercase tracking-wider">Product</th>
                             <th className="p-3 font-bold uppercase tracking-wider">Stock</th>
                             <th className="p-3 font-bold uppercase tracking-wider">Revenue</th>
                             <th className="p-3 font-bold uppercase tracking-wider text-right">Visibility</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border">
                          {vendorProducts.length === 0 && !loadingVendorProducts && (
                             <tr><td colSpan={4} className="p-6 text-center text-muted italic">No products found.</td></tr>
                          )}
                          {vendorProducts.map((p) => (
                             <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors">
                                <td className="p-3">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/50 shrink-0">
                                         {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200" />}
                                      </div>
                                      <div>
                                         <p className="font-bold text-heading max-w-[200px] truncate">{p.name}</p>
                                         <p className="text-[10px] text-muted">₹{p.price}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="p-3 font-mono text-muted">{p.stock}</td>
                                <td className="p-3 font-bold text-emerald-500">₹{((p.revenuePaise || 0)/100).toLocaleString()}</td>
                                <td className="p-3 text-right">
                                   <button
                                     onClick={async () => {
                                        const newValue = !p.active;
                                        setVendorProducts(vendorProducts.map(vp => vp.id === p.id ? { ...vp, active: newValue } : vp));
                                        try {
                                           const res = await fetch(`/api/products/${p.id}`, {
                                              method: "PUT",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ active: newValue })
                                           });
                                           if (!res.ok) {
                                              alert("Failed to update product visibility.");
                                              setVendorProducts(vendorProducts.map(vp => vp.id === p.id ? p : vp));
                                           } else {
                                              fetchData();
                                           }
                                        } catch (e) {
                                           alert("Error updating visibility");
                                           setVendorProducts(vendorProducts.map(vp => vp.id === p.id ? p : vp));
                                        }
                                     }}
                                     className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.active ? 'bg-emerald-500' : 'bg-surface border border-border'}`}
                                   >
                                     <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${p.active ? 'translate-x-4' : 'translate-x-1'}`} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Approval Buttons */}
              {v.vendorStatus === "IN_REVIEW" && (
                <div className="flex gap-3 w-full justify-end border-t border-border pt-6 mt-6">
                  <button onClick={() => {
                    if(confirm(`Reject ${v.name}'s profile?`)) {
                      handleReviewVendor(v.id, "REJECT");
                      setVendorProfileModal(null);
                    }
                  }} className="px-6 py-2.5 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-colors">
                    Reject Profile
                  </button>
                  
                  <button onClick={() => {
                    if(confirm(`Approve ${v.name}'s profile? They will instantly be able to add products.`)) {
                      handleReviewVendor(v.id, "APPROVE");
                      setVendorProfileModal(null);
                    }
                  }} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20">
                    Approve & Unlock Vendor
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
        );
      })()}

      {/* Premium Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[250] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === "success";
            const isError = toast.type === "error";
            const isWarning = toast.type === "warning";

            let icon = <Info className="w-5 h-5 text-orange-500" />;
            let borderColor = "border-orange-500/25";
            let bgGlow = "shadow-orange-500/5";
            let accentBar = "bg-orange-500";

            if (isSuccess) {
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
              borderColor = "border-emerald-500/25";
              bgGlow = "shadow-emerald-500/5";
              accentBar = "bg-emerald-500";
            } else if (isError) {
              icon = <XCircle className="w-5 h-5 text-rose-500" />;
              borderColor = "border-rose-500/25";
              bgGlow = "shadow-rose-500/5";
              accentBar = "bg-rose-500";
            } else if (isWarning) {
              icon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
              borderColor = "border-amber-500/25";
              bgGlow = "shadow-amber-500/5";
              accentBar = "bg-amber-500";
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`pointer-events-auto w-full bg-surface/90 backdrop-blur-md border ${borderColor} rounded-2xl p-4 shadow-2xl ${bgGlow} relative overflow-hidden flex gap-3.5 items-start`}
              >
                {/* Accent line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentBar}`} />
                
                {/* Icon wrapper */}
                <div className="pt-0.5">
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-heading leading-tight">
                    {isSuccess ? "Success" : isError ? "Error" : isWarning ? "Warning" : "Notification"}
                  </p>
                  <p className="text-[11px] font-medium text-muted leading-relaxed">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="p-1 hover:bg-surface-hover rounded-lg transition-colors cursor-pointer text-muted/65 hover:text-heading"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
