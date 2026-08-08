"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Plus, Trash2, Edit, LogOut, CheckCircle, Mail, Phone, MapPin, Package, Award, X, Settings, DollarSign, RefreshCcw, Users, FileText, Download, LayoutDashboard, Search, Info, CheckCircle2, XCircle, AlertTriangle, Store, Loader2, Globe, Eye, History, Tag, Activity, LifeBuoy } from "lucide-react";
import { currencyDatabase } from "@/context/RegionContext";
import { jsPDF } from "jspdf";
import { AnimatePresence, motion } from "framer-motion";
import { AdminCouponManager } from "@/features/coupons/components/AdminCouponManager";
import { OrdersTab } from "./tabs/OrdersTab";
import { VendorsTab } from "./tabs/VendorsTab";
import { ReturnsTab } from "./tabs/ReturnsTab";
import { SettlementsTab } from "./tabs/SettlementsTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { HomepageTab } from "./tabs/HomepageTab";
import { InquiriesTab } from "./tabs/InquiriesTab";
import SystemHealthTab from "./tabs/SystemHealthTab";
import { HelpSupportTab } from "./tabs/HelpSupportTab";
const numberToIndianWords = (num: number): string => {
  if (num === 0) return "Zero Rupees Only";
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const inWords = (n: number): string => {
    let str = '';
    if (n > 9999999) {
      str += inWords(Math.floor(n / 10000000)) + 'Crore ';
      n %= 10000000;
    }
    if (n > 99999) {
      str += inWords(Math.floor(n / 100000)) + 'Lakh ';
      n %= 100000;
    }
    if (n > 999) {
      str += inWords(Math.floor(n / 1000)) + 'Thousand ';
      n %= 1000;
    }
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (n < 20) str += a[n];
      else {
        str += b[Math.floor(n / 10)] + ' ';
        if (n % 10 > 0) str += a[n % 10];
      }
    }
    return str;
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let res = inWords(integerPart) + 'Rupees';
  if (decimalPart > 0) {
    res += ' and ' + inWords(decimalPart) + 'Paise';
  }
  return res.trim() + ' Only';
};

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
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const autoRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_AUTO_RETRIES = 5;
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
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/INR")
      .then(r => r.json())
      .then(d => {
        if (d && d.rates) setExchangeRates(d.rates);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    checkAuth();
    // Safety: if checkAuth is stuck (server very slow), force login screen after 10s
    const safetyTimer = setTimeout(() => {
      setAuthorized(prev => {
        if (prev === null) return false;
        return prev;
      });
    }, 10000);
    return () => clearTimeout(safetyTimer);
  }, []);

  // Auto-retry when server fails — counts down 5s then retries automatically (up to 5 times)
  useEffect(() => {
    if (!fetchError || isLoadingData) return;
    if (autoRetryCount >= MAX_AUTO_RETRIES) return;

    let secondsLeft = 3; // faster retry — 3s instead of 5s
    setRetryCountdown(secondsLeft);

    const tick = setInterval(() => {
      secondsLeft -= 1;
      setRetryCountdown(secondsLeft);
      if (secondsLeft <= 0) clearInterval(tick);
    }, 1000);

    autoRetryRef.current = setTimeout(async () => {
      clearInterval(tick);
      setAutoRetryCount(prev => prev + 1);
      setFetchError(false);
      setIsLoadingData(true);
      try {
        await Promise.all([fetchData(true), fetchOrders(1)]);
      } finally {
        setIsLoadingData(false);
      }
    }, 3000);

    return () => {
      clearInterval(tick);
      if (autoRetryRef.current) clearTimeout(autoRetryRef.current);
    };
  }, [fetchError, isLoadingData, autoRetryCount]);
  const [orderPage, setOrderPage] = useState(1);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const { data: ordersData, mutate: mutateOrders, isLoading: isLoadingOrders } = useSWR(authorized && (activeTab === "orders" || activeTab === "overview") ? `/api/orders?page=${orderPage}&limit=20&getStats=true` : null, fetcher);
  const orders = ordersData?.orders || [];
  const orderStats = ordersData?.stats || [];
  const orderTotalPages = ordersData?.pagination?.totalPages || 1;

  const { data: returnsData, mutate: mutateReturns } = useSWR(authorized && (activeTab === "returns" || activeTab === "overview") ? '/api/returns' : null, fetcher);
  const returns = returnsData?.returns || [];

  const { data: settlementsData, mutate: mutateSettlements } = useSWR(authorized && (activeTab === "settlements" || activeTab === "overview") ? '/api/admin/settlements' : null, fetcher);
  const settlements = settlementsData?.settlements || [];
  const apiGroupedSettlements = settlementsData?.groupedSettlements || [];
  const apiSettlementSummary = settlementsData?.summary || null;

  const { data: statsData, mutate: mutateStats } = useSWR(null, fetcher);

  const { groupedSettlements, settlementSummary } = useMemo(() => {
     if (!apiGroupedSettlements || apiGroupedSettlements.length === 0) return { groupedSettlements: [], settlementSummary: null };
     
     const newGrouped = JSON.parse(JSON.stringify(apiGroupedSettlements));
     let globalSummary = { hold: 0, eligible: 0, settled: 0, disputed: 0 };

     newGrouped.forEach((g: any) => {
        let vSummary = { hold: 0, eligible: 0, settled: 0, disputed: 0 };
        g.settlements.forEach((s: any) => {
           let amount = s.vendorPayoutPaise || 0;
           const currency = s.order?.currency || "INR";
           
           if (currency !== "INR") {
              if (exchangeRates && exchangeRates[currency]) {
                 amount = amount / exchangeRates[currency];
              } else {
                 amount = amount / (currency === "USD" ? 0.012 : 1);
              }
           }
           
           if (s.status === "HOLD") vSummary.hold += amount;
           if (s.status === "ELIGIBLE") vSummary.eligible += amount;
           if (s.status === "SETTLED") vSummary.settled += amount;
           if (s.status === "DISPUTED") vSummary.disputed += amount;
        });
        g.summary = vSummary;
        globalSummary.hold += vSummary.hold;
        globalSummary.eligible += vSummary.eligible;
        globalSummary.settled += vSummary.settled;
        globalSummary.disputed += vSummary.disputed;
     });

     newGrouped.sort((a: any, b: any) => b.summary.eligible - a.summary.eligible);

     return { groupedSettlements: newGrouped, settlementSummary: globalSummary };
  }, [apiGroupedSettlements, exchangeRates]);

  const [selectedVendorSettlement, setSelectedVendorSettlement] = useState<any>(null);
  const [settlementSearchQuery, setSettlementSearchQuery] = useState("");
  const [excludedVendorIds, setExcludedVendorIds] = useState<number[]>([]);
  const [isProcessingPayout, setIsProcessingPayout] = useState<string | null>(null);
  
  // Custom Payout State
  const [showCustomPayoutModal, setShowCustomPayoutModal] = useState(false);
  const [customPayoutForm, setCustomPayoutForm] = useState<{vendorId: string, productId: string, amount: string, notes: string, testMode: boolean, isDirect: boolean, settlementId?: string}>({vendorId: "", productId: "", amount: "", notes: "", testMode: false, isDirect: false, settlementId: ""});
  const [isSubmittingCustomPayout, setIsSubmittingCustomPayout] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [visibleHistoryLimit, setVisibleHistoryLimit] = useState(10);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  const [historyActiveTab, setHistoryActiveTab] = useState<"orders" | "custom">("orders");
  const [visibleCustomLimit, setVisibleCustomLimit] = useState(10);
  
  const [settings, setSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const { data: productsData, mutate: mutateProducts } = useSWR(authorized && (activeTab === "products" || activeTab === "homepage") ? '/api/products' : null, fetcher);
  const products = productsData || [];
  
  const { data: categoriesData, mutate: mutateCategories } = useSWR(authorized && (activeTab === "categories" || activeTab === "homepage" || activeTab === "products") ? '/api/categories' : null, fetcher);
  const dbCategories = categoriesData || [];
  
  const { data: vendorsData, mutate: mutateVendors } = useSWR(authorized && (activeTab === "vendors" || activeTab === "overview") ? '/api/admin/vendors' : null, fetcher);
  const vendors = vendorsData?.vendors || [];
  const [selectedInquiryMessage, setSelectedInquiryMessage] = useState<string | null>(null);
  
  // Homepage CMS State
  const [homepageSections, setHomepageSections] = useState<{ slug: string, title?: string, productIds: number[] }[]>([]);
  const [mobileBanners, setMobileBanners] = useState<any[]>([]);
  const [editingSectionSlug, setEditingSectionSlug] = useState<string | null>(null);
  const [cmsProductSearch, setCmsProductSearch] = useState("");
  const [savingHomepage, setSavingHomepage] = useState(false);
  
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
  
  // Custom Prompts State
  const [rejectPromptModal, setRejectPromptModal] = useState<{ id: string, name: string, type: "VENDOR_KYC" | "VENDOR_PROFILE" | "RETURN" | "PAYMENT" } | null>(null);
  const [promptText, setPromptText] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmText: string;
    action: () => void;
  } | null>(null);
  const [processingReturns, setProcessingReturns] = useState<Record<string, boolean>>({});

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
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyModalOpen = !!selectedVendorSettlement || showCustomPayoutModal || !!modalProduct;
    if (anyModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [selectedVendorSettlement, showCustomPayoutModal, modalProduct]);
  
  const checkAuth = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      const res = await fetch(`/api/auth/me?t=${Date.now()}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user.role === "admin") {
          setAuthorized(true);
          fetchData(); // always fetch data after confirming auth
        } else {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    } catch (e) {
      console.error("[AdminPanel] Auth check failed:", e);
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
    setOrderPage(page);
    mutateOrders();
  };

  useEffect(() => {
    if (authorized) {
      mutateOrders();
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

  // Targeted refresh functions — only reload what changed
  const fetchVendors = async () => mutateVendors();
  const fetchProducts = async () => mutateProducts();
  const fetchSettlements = async () => mutateSettlements();
  const fetchReturns = async () => mutateReturns();

  const fetchData = async (silent = false) => {
    if (!silent) setIsLoadingData(true);
    const controller = new AbortController();
    const signal = controller.signal;
    const abortTimer = setTimeout(() => controller.abort(), 60000);
    try {
      const fetchWithSignal = (url: string) => {
         const symbol = url.includes('?') ? '&' : '?';
         return fetch(`${url}${symbol}t=${Date.now()}`, { signal });
      };

      const results = await Promise.allSettled([
         fetchWithSignal("/api/admin/settings"),
         fetchWithSignal("/api/inquiries")
      ]);

      const getRes = (i: number) => results[i].status === "fulfilled" ? (results[i] as PromiseFulfilledResult<Response>).value : null;
      const setRes = getRes(0);
      const inqRes = getRes(1);

      const anySuccess = results.some(r => r.status === "fulfilled" && (r as PromiseFulfilledResult<Response>).value?.ok);

      if (setRes?.ok) {
         const settingsData = (await setRes.json()).settings;
         setSettings(settingsData);
         if (settingsData?.homepageSections) {
           setHomepageSections(settingsData.homepageSections);
         }
         if (settingsData?.mobileBanners) {
           setMobileBanners(settingsData.mobileBanners);
         }
      }
      if (inqRes?.ok) setInquiries(await inqRes.json());

      if (anySuccess) {
        setFetchError(false);
        setAutoRetryCount(0);
      } else {
        setFetchError(true);
      }

      mutateOrders();
      mutateReturns();
      mutateSettlements();
      mutateProducts();
      mutateCategories();
      mutateVendors();
      mutateStats();
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setFetchError(true);
      } else {
        console.error("Failed to load admin data", e);
        setFetchError(true);
      }
    } finally {
      clearTimeout(abortTimer);
      if (!silent) setIsLoadingData(false);
    }
  };




  const handleUpdateReturn = async (id: string, action: string, rejectionReason?: string, banUser?: boolean, banVendor?: boolean, adminNotes?: string) => {
     if (processingReturns[id]) return;
     
     if (action === "REJECTED_PRE_PICKUP" && !rejectionReason) {
        setRejectPromptModal({ id, name: "", type: "RETURN" });
        setPromptText("");
        return;
     }
     
     setProcessingReturns(prev => ({ ...prev, [id]: true }));
     try {
        const res = await fetch(`/api/returns/admin/review`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ returnId: id, action, rejectionReason, banUser, banVendor, adminNotes })
        });
         if (res.ok) {
           const actionText = action === "QC_PASS" ? "User Refunded" : action === "QC_FAIL" ? "Vendor Payment Approved" : action === "APPROVED" ? "Approved" : "Rejected";
           showToast(`Return dispute resolved: ${actionText}`, "success");
           fetchReturns();
        } else {
           const data = await res.json();
           showToast(data.error || "Failed to update return", "error");
         }
     } catch (err) {
         showToast("Network error", "error");
     } finally {
         setProcessingReturns(prev => ({ ...prev, [id]: false }));
     }
  };

  const handleReviewVendor = async (vendorId: number, action: "APPROVE" | "REJECT", rejectionReason?: string) => {
    try {
      const res = await fetch(`/api/admin/vendors/review`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ vendorId, action, rejectionReason })
      });
      if (res.ok) {
         showToast(`Vendor profile ${action === 'APPROVE' ? 'APPROVED ✓' : 'REJECTED'}`, "success");
         fetchVendors();
      } else {
         const data = await res.json();
         showToast(data.error || "Failed to review vendor", "error");
      }
    } catch (err) {
       showToast("Error reviewing vendor", "error");
    }
  };

  const generateInvoice = (s: any) => {
    const vendorObj = vendors.find((v: any) => v.id === s.vendorId);
    const doc = new jsPDF();
    
    // Header Style - Brand Banner
    doc.setFillColor(249, 115, 22); // Orange Accent
    doc.rect(15, 15, 180, 8, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("STOPSHOP B2B MARKETPLACE", 20, 20);
    
    // Title & Invoice Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text("TAX INVOICE - COMMISSION", 15, 38);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: INV-SEC-${s.id}`, 130, 32);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" })}`, 130, 37);
    doc.text(`Order Reference: ${s.order.orderNumber}`, 130, 42);
    
    doc.line(15, 46, 195, 46);
    
    // B2B Details Grid
    // Column 1: Provider (StopShop)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Service Provider Details (StopShop):", 15, 54);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const cName = settings?.companyName || "StopShop Private Limited";
    const cAddress = settings?.companyAddress || "Sector 62, Noida, Uttar Pradesh, India - 201301";
    const cGstin = settings?.companyGstin || "09AAECS8721M1Z5";
    const cPan = settings?.companyPan || "AAECS8721M";

    doc.text(cName, 15, 60);
    const splitProviderAddress = doc.splitTextToSize(cAddress, 85);
    doc.text(splitProviderAddress, 15, 65);
    const providerNextY = 65 + (splitProviderAddress.length * 5);

    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${cGstin} (Marketplace)`, 15, providerNextY);
    doc.text(`PAN: ${cPan}`, 15, providerNextY + 5);
    doc.text(`SAC Code: ${settings?.commissionSacCode || "996111"} (E-commerce Operator)`, 15, providerNextY + 10);
    const providerFinalY = providerNextY + 15;
    
    // Column 2: Recipient (Vendor)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Service Recipient Details (Vendor):", 110, 54);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    const vName = vendorObj ? (vendorObj.name || `Vendor ID: ${s.vendorId}`) : `Vendor ID: ${s.vendorId}`;
    const vAddress = vendorObj?.location || "Not Provided";
    const splitVendorAddress = doc.splitTextToSize(vAddress, 85);
    
    doc.text(vName, 110, 60);
    doc.text(splitVendorAddress, 110, 65);
    const vendorNextY = 65 + (splitVendorAddress.length * 5);

    doc.setFont("helvetica", "bold");
    if (vendorObj) {
      doc.text(`GSTIN: ${vendorObj.gstin || "Unregistered"}`, 110, vendorNextY);
      doc.text(`PAN: ${vendorObj.pan || "N/A"}`, 110, vendorNextY + 5);
      doc.text(`Artisan ID: ${vendorObj.artisanId || "N/A"}`, 110, vendorNextY + 10);
      doc.setFont("helvetica", "normal");
      doc.text(`Email: ${vendorObj.email || "N/A"}`, 110, vendorNextY + 15);
    } else {
      doc.text("GSTIN: Unregistered", 110, vendorNextY);
    }
    const vendorFinalY = vendorObj ? (vendorNextY + 20) : (vendorNextY + 5);
    
    // Draw dynamic divider line based on the taller column
    const dividerY = Math.max(providerFinalY, vendorFinalY, 92) + 4;
    doc.line(15, dividerY, 195, dividerY);
    
    // Invoice Summary Table relative to dividerY
    const contentStartY = dividerY + 6;
    
    doc.setFillColor(244, 244, 245); // Light Gray Background for Table Header
    doc.rect(15, contentStartY, 180, 8, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Description of Service", 18, contentStartY + 5);
    doc.text("Taxable Value", 110, contentStartY + 5, { align: "right" });
    doc.text("GST Rate", 140, contentStartY + 5, { align: "right" });
    doc.text("Total Amount (INR)", 190, contentStartY + 5, { align: "right" });
    
    doc.setFont("helvetica", "normal");
    const commissionVal = s.commissionPaise / 100;
    const gstRate = settings?.commissionGstRate || 18; // Dynamic Commission GST
    const baseValue = commissionVal / (1 + gstRate / 100);
    const gstAmount = commissionVal - baseValue;
    
    doc.text("Marketplace Platform Commission Fee", 18, contentStartY + 16);
    doc.text(`Rs. ${baseValue.toFixed(2)}`, 110, contentStartY + 16, { align: "right" });
    doc.text(`${gstRate}%`, 140, contentStartY + 16, { align: "right" });
    doc.text(`Rs. ${commissionVal.toFixed(2)}`, 190, contentStartY + 16, { align: "right" });
    
    doc.line(15, contentStartY + 22, 195, contentStartY + 22);
    
    // Tax Breakup details
    doc.setFontSize(8.5);
    doc.text("GST Tax Breakup Detail:", 18, contentStartY + 29);
    doc.text(`CGST (9%): Rs. ${(gstAmount / 2).toFixed(2)}`, 22, contentStartY + 35);
    doc.text(`SGST (9%): Rs. ${(gstAmount / 2).toFixed(2)}`, 22, contentStartY + 40);
    
    // Calculation Summary Card on the right
    doc.setFillColor(250, 250, 250);
    doc.rect(115, contentStartY + 27, 80, 35);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Gross Order Value:`, 118, contentStartY + 33);
    doc.text(`Rs. ${(s.orderAmountPaise / 100).toFixed(2)}`, 190, contentStartY + 33, { align: "right" });
    
    doc.text(`(-) Commission & GST:`, 118, contentStartY + 39);
    doc.text(`Rs. ${commissionVal.toFixed(2)}`, 190, contentStartY + 39, { align: "right" });
    
    doc.line(115, contentStartY + 44, 195, contentStartY + 44);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Vendor Payout:`, 118, contentStartY + 51);
    doc.setTextColor(22, 163, 74); // Emerald color
    doc.text(`Rs. ${(s.vendorPayoutPaise / 100).toFixed(2)}`, 190, contentStartY + 51, { align: "right" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Note: Under Section 52 of CGST Act, e-commerce operator has deducted TCS of 1% (if applicable).", 15, contentStartY + 77);
    doc.text("This is a digitally generated Tax Invoice and does not require a physical signature.", 15, contentStartY + 82);
    
    // Footer line
    doc.line(15, contentStartY + 92, 195, contentStartY + 92);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("Thank you for partnering with StopShop Marketplace.", 105, contentStartY + 98, { align: "center" });
    
    doc.save(`Commission_Invoice_${s.order.orderNumber}.pdf`);
  };

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
     e.preventDefault();
     setSavingSettings(true);
     try {
        const { defaultCommissionRate, taxRate, commissionGstRate, commissionSacCode, shippingFreeAbove, shippingChargePaise, codShippingChargePaise, internationalShippingPaise, codMaxAmountPaise, returnWindowDays, vendorReturnSlaHours, payoutSchedule, payoutCustomDays, codEnabled, returnEnabled, shiprocketAutoAssign, invoiceTemplate, shippingPolicy, refundPolicy, privacyPolicy, termsPolicy } = settings;
        const res = await fetch("/api/admin/settings", {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ defaultCommissionRate, taxRate, commissionGstRate, commissionSacCode, shippingFreeAbove, shippingChargePaise, codShippingChargePaise, internationalShippingPaise, codMaxAmountPaise, returnWindowDays, vendorReturnSlaHours, payoutSchedule, payoutCustomDays, codEnabled, returnEnabled, shiprocketAutoAssign, invoiceTemplate, shippingPolicy, refundPolicy, privacyPolicy, termsPolicy })
        });
        if (res.ok) showToast("Platform Settings saved successfully!", "success");
        else showToast("Failed to save settings", "error");
     } catch (e) {
        showToast("Error saving settings", "error");
     } finally {
        setSavingSettings(false);
     }
  };

  const handleSaveCompanyProfile = async (e: React.FormEvent) => {
     e.preventDefault();
     setSavingSettings(true);
     try {
        const { companyName, companyAddress, companyGstin, companyPan, companyCity, companyState, companyCountry, companyPincode } = settings;
        const res = await fetch("/api/admin/settings", {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ companyName, companyAddress, companyGstin, companyPan, companyCity, companyState, companyCountry, companyPincode })
        });
        if (res.ok) showToast("Company Profile saved successfully!", "success");
        else showToast("Failed to save profile", "error");
     } catch (e) {
        showToast("Error saving profile", "error");
     } finally {
        setSavingSettings(false);
     }
  };

  const handleSaveCMSContent = async (e: React.FormEvent) => {
     e.preventDefault();
     setSavingSettings(true);
     try {
        const { exportProgramContent, footerAboutText, footerContacts, footerSocialLinks } = settings;
        const res = await fetch("/api/admin/settings", {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ exportProgramContent, footerAboutText, footerContacts, footerSocialLinks })
        });
        if (res.ok) showToast("CMS Content saved successfully!", "success");
        else showToast("Failed to save CMS Content", "error");
     } catch (e) {
        showToast("Error saving CMS Content", "error");
     } finally {
        setSavingSettings(false);
     }
  };

  const handleToggleHide = async (id: number, name: string, currentActive: boolean) => {
    const action = currentActive ? "hide" : "unhide";
    if (!confirm(`Are you sure you want to ${action} "${name}" from the marketplace?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive })
      });
      if (res.ok) {
        // Optimistic update locally first, then sync from server
        mutateProducts(products.map((p: any) => p.id === id ? { ...p, active: !currentActive } : p), false);
        showToast(`Product ${action}d successfully.`, "success");
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
      // Validation: Ensure all selected products belong to the selected category (skip for Best Sellers)
      if (selectedCategorySlug !== "best-sellers") {
        const invalidProducts = selectedProducts
          .map((id: number) => products.find((p: any) => p.id === id))
          .filter((p: any) => p && p.categoryName !== selectedCategorySlug);

        if (invalidProducts.length > 0) {
          showToast(`Cannot assign! You selected ${invalidProducts.length} product(s) that belong to a different category than the target section. Please only assign products that match the section's category.`, "error");
          return;
        }
      }

      const secIdx = homepageSections.findIndex((s:any) => s.slug === selectedCategorySlug);
      const cat = dbCategories.find((c: any) => c.slug === selectedCategorySlug);
      const sectionTitle = selectedCategorySlug === "best-sellers" ? "🔥 Best Sellers / Top Rated" : cat?.name;
      let newSections = [...homepageSections];
      
      if (secIdx > -1) {
        const currentIds = newSections[secIdx].productIds;
        const newIds = Array.from(new Set([...currentIds, ...selectedProducts]));
        if (newIds.length > 15) {
          showToast(`Cannot add. The "${sectionTitle}" section would exceed the maximum of 15 products (would have ${newIds.length}). Please unselect some products.`, "error");
          return;
        }
        newSections[secIdx].productIds = newIds;
      } else {
        if (selectedProducts.length > 15) {
           showToast(`Cannot add. Maximum 15 products allowed per section.`, "error");
           return;
        }
        newSections.push({ slug: selectedCategorySlug, title: sectionTitle, productIds: selectedProducts });
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

  const handleTabRefresh = async () => {
    setIsLoadingData(true);
    setFetchError(false); // clear error banner immediately when retrying
    setAutoRetryCount(0); // reset auto-retry counter so it can retry again if this also fails
    showToast(`Refreshing ${activeTab}...`, "success");
    try {
      if (activeTab === "orders") await mutateOrders();
      else if (activeTab === "returns") await mutateReturns();
      else if (activeTab === "settlements") await mutateSettlements();
      else if (activeTab === "vendors") await mutateVendors();
      else if (activeTab === "products") await mutateProducts();
      else await fetchData(); // Fallback for settings, homepage, inquiries
    } finally {
      setIsLoadingData(false);
    }
  };

  // Only block render during initial auth check
  if (authorized === null) {
    return (
      <div className="min-h-screen bg-surface pb-16">
        {/* Skeleton Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-white/20 rounded-xl animate-pulse" />
              <div className="h-4 w-32 bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-24 bg-white/20 rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Skeleton Tabs */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-900/50 p-2 rounded-2xl border border-gray-200 dark:border-gray-800 w-full h-[60px] animate-pulse">
              <div className="w-24 h-full bg-gray-300 dark:bg-gray-700 rounded-xl" />
              <div className="w-24 h-full bg-gray-300 dark:bg-gray-700 rounded-xl" />
              <div className="w-32 h-full bg-gray-300 dark:bg-gray-700 rounded-xl hidden sm:block" />
              <div className="w-32 h-full bg-gray-300 dark:bg-gray-700 rounded-xl hidden md:block" />
              <div className="w-28 h-full bg-gray-300 dark:bg-gray-700 rounded-xl hidden lg:block" />
            </div>
            <div className="w-32 h-[60px] bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl animate-pulse shrink-0" />
          </div>

          {/* Skeleton Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl animate-pulse" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl animate-pulse" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl animate-pulse" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl animate-pulse" />
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
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
            <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const getReturnThumb = (r: any) => {
    try {
      const imgs = r.order?.items?.[0]?.product?.images;
      if (!imgs) return "/placeholder.png";
      const parsed = typeof imgs === 'string' ? JSON.parse(imgs) : imgs;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "/placeholder.png";
    } catch (err) { return "/placeholder.png"; }
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">StopShop Admin</h1>
            <p className="text-xs text-slate-300 mt-1">Master Dashboard</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
      {/* Thin orange progress bar — shows while background data is loading */}
      {isLoadingData && (
        <div className="h-0.5 w-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-orange-500 w-1/2" style={{ marginLeft: isLoadingData ? "0%" : "100%", transition: "margin-left 1.5s ease-in-out" }} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex flex-wrap gap-2 bg-surface-card p-2 rounded-2xl border border-border overflow-x-auto shadow-sm flex-1">
            {[
               { id: "orders", label: "Orders", icon: Package },
               { id: "returns", label: "Returns", icon: RefreshCcw },
               { id: "settlements", label: "Settlements", icon: DollarSign },
               { id: "vendors", label: "Vendors KYC", icon: Users },
               { id: "products", label: "Products", icon: Award },
               { id: "coupons", label: "Coupons & Offers", icon: Tag },
               { id: "homepage", label: "Homepage Control", icon: LayoutDashboard },
               { id: "inquiries", label: "Inquiries", icon: Mail },
               { id: "support", label: "Help & Support", icon: LifeBuoy },
               { id: "health", label: "System Health", icon: Activity },
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
          <button
            onClick={handleTabRefresh}
            disabled={isLoadingData}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 border border-gray-700 hover:bg-gray-800 hover:border-gray-500 rounded-2xl text-xs font-bold text-white transition-all shadow-md shrink-0 disabled:opacity-50"
            title="Refresh current tab data"
          >
            <RefreshCcw size={16} className={isLoadingData ? "animate-spin text-orange-400" : "text-gray-300"} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* Server warming up banner — shown during dev cold start, not an actual error */}
        {fetchError && !isLoadingData && (
          <div className={`mb-6 flex items-center gap-4 rounded-2xl px-5 py-4 border ${autoRetryCount >= MAX_AUTO_RETRIES ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${autoRetryCount >= MAX_AUTO_RETRIES ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
              {autoRetryCount < MAX_AUTO_RETRIES
                ? <Loader2 size={20} className="text-amber-400 animate-spin" />
                : <AlertTriangle size={20} className="text-red-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${autoRetryCount >= MAX_AUTO_RETRIES ? 'text-red-400' : 'text-amber-400'}`}>
                {autoRetryCount < MAX_AUTO_RETRIES ? 'Server warming up…' : 'Could not load data'}
              </p>
              <p className={`text-xs mt-0.5 ${autoRetryCount >= MAX_AUTO_RETRIES ? 'text-red-400/70' : 'text-amber-400/70'}`}>
                {autoRetryCount < MAX_AUTO_RETRIES
                  ? `API routes are compiling after server restart. Auto-retrying in ${retryCountdown}s… (${autoRetryCount + 1}/${MAX_AUTO_RETRIES})`
                  : 'Server failed to respond after multiple attempts. Check if the server is running.'}
              </p>
            </div>
            <button
              onClick={handleTabRefresh}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all ${autoRetryCount >= MAX_AUTO_RETRIES ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              <RefreshCcw size={13} /> Retry Now
            </button>
          </div>
        )}

        <div className="space-y-6">
          
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              orderStats={orderStats}
              orderPage={orderPage}
              orderTotalPages={orderTotalPages}
              exchangeRates={exchangeRates}
              loadMoreRef={loadMoreRef}
              isLoadingData={isLoadingData || isLoadingOrders || (!ordersData && authorized === true)}
            />
          )}

          {/* VENDORS TAB */}
          {activeTab === "vendors" && (
            <VendorsTab
              vendors={vendors}
              handleReviewVendor={handleReviewVendor}
              handleOpenVendorModal={handleOpenVendorModal}
              setRejectPromptModal={setRejectPromptModal}
              setPromptText={setPromptText}
            />
          )}

          {/* RETURNS TAB */}
          {activeTab === "returns" && (
            <ReturnsTab
              returns={returns}
              settings={settings}
              currentTime={currentTime}
              processingReturns={processingReturns}
              getReturnThumb={getReturnThumb}
              handleUpdateReturn={handleUpdateReturn}
              showToast={showToast}
              setConfirmModal={setConfirmModal}
            />
          )}

          {/* SETTLEMENTS TAB */}
          {activeTab === "settlements" && (
            <SettlementsTab
              settlementSummary={settlementSummary}
              groupedSettlements={groupedSettlements}
              settlementSearchQuery={settlementSearchQuery}
              setSettlementSearchQuery={setSettlementSearchQuery}
              customPayoutForm={customPayoutForm}
              setCustomPayoutForm={setCustomPayoutForm}
              showCustomPayoutModal={showCustomPayoutModal}
              setShowCustomPayoutModal={setShowCustomPayoutModal}
              excludedVendorIds={excludedVendorIds}
              setExcludedVendorIds={setExcludedVendorIds}
              isProcessingPayout={isProcessingPayout}
              setIsProcessingPayout={setIsProcessingPayout}
              isSubmittingCustomPayout={isSubmittingCustomPayout}
              setIsSubmittingCustomPayout={setIsSubmittingCustomPayout}
              selectedVendorSettlement={selectedVendorSettlement}
              setSelectedVendorSettlement={setSelectedVendorSettlement}
              showHistoryModal={showHistoryModal}
              setShowHistoryModal={setShowHistoryModal}
              visibleHistoryLimit={visibleHistoryLimit}
              setVisibleHistoryLimit={setVisibleHistoryLimit}
              isDeletingHistory={isDeletingHistory}
              setIsDeletingHistory={setIsDeletingHistory}
              historyActiveTab={historyActiveTab}
              setHistoryActiveTab={setHistoryActiveTab}
              visibleCustomLimit={visibleCustomLimit}
              setVisibleCustomLimit={setVisibleCustomLimit}
              vendors={vendors}
              products={products}
              fetchData={fetchData}
              showToast={showToast}
              setModalProduct={setModalProduct}
              generateInvoice={generateInvoice}
            />
          )}

          {/* COUPONS TAB */}
          {activeTab === "coupons" && (
             <AdminCouponManager />
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <SettingsTab
              settings={settings}
              setSettings={setSettings}
              savingSettings={savingSettings}
              handleSavePlatformSettings={handleSavePlatformSettings}
              handleSaveCompanyProfile={handleSaveCompanyProfile}
              handleSaveCMSContent={handleSaveCMSContent}
            />
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <ProductsTab
              products={products}
              vendors={vendors}
              dbCategories={dbCategories}
              globalProductCategory={globalProductCategory}
              setGlobalProductCategory={setGlobalProductCategory}
              globalProductMaterial={globalProductMaterial}
              setGlobalProductMaterial={setGlobalProductMaterial}
              globalProductSearch={globalProductSearch}
              setGlobalProductSearch={setGlobalProductSearch}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              selectedCategorySlug={selectedCategorySlug}
              setSelectedCategorySlug={setSelectedCategorySlug}
              handleAssignToHomepage={handleAssignToHomepage}
              setModalProduct={setModalProduct}
              mutateProducts={mutateProducts}
            />
          )}

          {/* HOMEPAGE CMS TAB */}
          {activeTab === "homepage" && (
            <HomepageTab
              homepageSections={homepageSections}
              setHomepageSections={setHomepageSections}
              mobileBanners={mobileBanners}
              setMobileBanners={setMobileBanners}
              dbCategories={dbCategories}
              products={products}
              editingSectionSlug={editingSectionSlug}
              setEditingSectionSlug={setEditingSectionSlug}
              cmsProductSearch={cmsProductSearch}
              setCmsProductSearch={setCmsProductSearch}
              savingHomepage={savingHomepage}
              setSavingHomepage={setSavingHomepage}
              showToast={showToast}
            />
          )}

          {/* INQUIRIES TAB */}
          {activeTab === "inquiries" && (
            <InquiriesTab
              inquiries={inquiries}
              setSelectedInquiryMessage={setSelectedInquiryMessage}
            />
          )}

          {/* HEALTH TAB */}
          {activeTab === "health" && (
            <SystemHealthTab showToast={showToast} />
          )}

          {/* HELP & SUPPORT TAB */}
          {activeTab === "support" && (
            <HelpSupportTab />
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
                      Seller: <span className="text-muted">{vendors.find((v: any) => String(v.id) === String(modalProduct.vendorId))?.name || "Admin"}</span>
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
        const vProductsCount = products.filter((p: any) => p.vendorId === v.id).length;
        
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-surface/50 p-3 rounded-xl border border-red-500/10">
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">GSTIN</p>
                    <p className="font-mono text-sm font-bold text-heading break-all">{v.gstin || "Not Provided"}</p>
                  </div>
                  <div className="bg-surface/50 p-3 rounded-xl border border-red-500/10">
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">PAN Number</p>
                    <p className="font-mono text-sm font-bold text-heading break-all">{v.pan || "Not Provided"}</p>
                  </div>
                  <div className="bg-surface/50 p-3 rounded-xl border border-red-500/10">
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">Aadhaar</p>
                    <p className="font-mono text-sm font-bold text-heading break-all">{v.aadhaar || "Not Provided"}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-3 bg-surface/50 p-3 rounded-xl border border-red-500/10">
                    <p className="text-[10px] text-muted font-bold uppercase mb-1">Registered Location / Address</p>
                    <p className="text-sm font-bold text-heading break-words">{v.location || "Not Provided"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-red-500/10">
                  <div className="bg-surface/50 p-4 rounded-xl border border-red-500/10 flex flex-col justify-between">
                    <div>
                       <p className="text-[10px] text-muted font-bold uppercase mb-2">Bank Details (Vendor Payouts)</p>
                       <p className="text-xs font-mono font-bold text-heading mb-0.5">Name: {v.bankName || "N/A"}</p>
                       <p className="text-xs font-mono font-bold text-heading mb-0.5">A/C: {v.bankAccount || "N/A"}</p>
                       <p className="text-xs font-mono font-bold text-heading mb-1">IFSC: {v.bankIfsc || "N/A"}</p>
                       <p className="text-[10px] font-mono font-bold text-muted mb-1">
                          {v.razorpayAccountId ? (
                            <span className="text-emerald-500 flex items-center gap-1">
                               ✓ Razorpay: {v.razorpayAccountId}
                            </span>
                          ) : (
                            <span className="text-red-500">Not Linked to Razorpay</span>
                          )}
                       </p>
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
                            mutateVendors({ ...vendorsData, vendors: vendors.map((vendor: any) => vendor.id === v.id ? updatedVendorOptimistic : vendor) }, false);
                            
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
                  <p className="text-4xl font-black text-emerald-500">
                    ₹{(vendorProducts.reduce((acc, p) => acc + (p.revenuePaise || 0), 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Total Money Generated</p>
                  <p className="text-[9px] font-mono text-emerald-600/80 mt-1 italic opacity-75">
                    {numberToIndianWords(vendorProducts.reduce((acc, p) => acc + (p.revenuePaise || 0), 0) / 100)}
                  </p>
                </div>

                {/* Category Permissions */}
                <div className="md:col-span-2 bg-surface-card border border-border rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] uppercase font-bold text-muted">Category Upload Permissions</p>
                    <button 
                      onClick={async () => {
                        const updatedVendorOptimistic = { ...v, allowedCategories: null };
                        setVendorProfileModal(updatedVendorOptimistic);
                        mutateVendors({ ...vendorsData, vendors: vendors.map((vendor: any) => vendor.id === v.id ? updatedVendorOptimistic : vendor) }, false);
                        
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
                    {dbCategories.map((cat: any) => {
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
                                currentList = dbCategories.map((c: any) => c.slug);
                              }
                              
                              let newList;
                              if (checked) {
                                newList = [...currentList, cat.slug];
                              } else {
                                newList = currentList.filter((c: string) => c !== cat.slug);
                              }
                              
                              // If they deselected everything, it should be an empty string, NOT null (null means allow all).
                              // If it's completely empty, we save ""
                              const allowedStr = newList.length === 0 ? "" : newList.join(',');
                              
                              // Optimistic Update
                              const updatedVendorOptimistic = { ...v, allowedCategories: allowedStr };
                              setVendorProfileModal(updatedVendorOptimistic);
                              mutateVendors({ ...vendorsData, vendors: vendors.map((vendor: any) => vendor.id === v.id ? updatedVendorOptimistic : vendor) }, false);

                              const res = await fetch(`/api/admin/vendors/${v.id}/permissions`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ allowedCategories: allowedStr })
                              });
                              if (!res.ok) {
                                // Revert on failure
                                setVendorProfileModal(v);
                                mutateVendors({ ...vendorsData, vendors: vendors.map((vendor: any) => vendor.id === v.id ? v : vendor) }, false);
                                showToast("Failed to update permission", "error");
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
                                              showToast("Failed to update product visibility.", "error");
                                              setVendorProducts(vendorProducts.map(vp => vp.id === p.id ? p : vp));
                                           } else {
                                              fetchData();
                                           }
                                        } catch (e) {
                                           showToast("Error updating visibility", "error");
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
              {v.vendorStatus !== "APPROVED" && (
                <div className="flex gap-3 w-full justify-end border-t border-border pt-6 mt-6">
                  <button onClick={() => {
                    setPromptText("");
                    setRejectPromptModal({ id: v.id, name: v.name, type: "VENDOR_PROFILE" });
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
                className={`pointer-events-auto w-full bg-surface-card border ${borderColor} rounded-2xl p-4 shadow-2xl ${bgGlow} relative overflow-hidden flex gap-3.5 items-start`}
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

      {/* Reject / Action Prompt Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface-card border border-border w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-muted mb-6">{confirmModal.message}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmModal(null)} className="px-5 py-2.5 bg-surface border border-border hover:border-muted text-heading text-sm font-bold rounded-xl transition-all">Cancel</button>
                <button onClick={() => { confirmModal.action(); setConfirmModal(null); }} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all">{confirmModal.confirmText}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectPromptModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-heading mb-2">
                  {rejectPromptModal.type === "VENDOR_KYC" && `Reject KYC for ${rejectPromptModal.name}`}
                  {rejectPromptModal.type === "VENDOR_PROFILE" && `Reject Profile for ${rejectPromptModal.name}`}
                  {rejectPromptModal.type === "RETURN" && `Reject Return`}
                  {rejectPromptModal.type === "PAYMENT" && `Enter Payment Details`}
                </h3>
                <p className="text-sm text-muted mb-4">
                  {(rejectPromptModal.type === "VENDOR_KYC" || rejectPromptModal.type === "VENDOR_PROFILE" || rejectPromptModal.type === "RETURN") 
                    ? "Please provide a reason for rejection. This will be visible to the user." 
                    : "Enter Bank UTR or Payment Reference."}
                </p>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder={rejectPromptModal.type === "PAYMENT" ? "UTR / Ref No..." : "Enter reason..."}
                  className="w-full bg-surface border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 min-h-[100px] resize-none"
                  autoFocus
                />
                <div className="flex gap-3 justify-end mt-6">
                  <button onClick={() => setRejectPromptModal(null)} className="px-4 py-2 hover:bg-surface-hover text-muted hover:text-heading font-bold text-sm rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (rejectPromptModal.type === "VENDOR_KYC" || rejectPromptModal.type === "VENDOR_PROFILE") {
                        handleReviewVendor(Number(rejectPromptModal.id), "REJECT", promptText || "Rejected by Admin");
                        if (rejectPromptModal.type === "VENDOR_PROFILE") setVendorProfileModal(null);
                      } else if (rejectPromptModal.type === "RETURN") {
                        handleUpdateReturn(rejectPromptModal.id, "REJECTED", promptText || "Rejected by Admin");
                      }
                      setRejectPromptModal(null);
                    }}
                    className={`px-6 py-2 ${rejectPromptModal.type === "PAYMENT" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"} text-white font-bold text-sm rounded-xl transition-colors shadow-lg`}
                  >
                    Confirm {rejectPromptModal.type === "PAYMENT" ? "Payment" : "Rejection"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
