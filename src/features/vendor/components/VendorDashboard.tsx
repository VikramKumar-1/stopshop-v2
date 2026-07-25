"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Plus, Trash2, Store, LogOut, CheckCircle, Mail, Phone, MapPin, Package, Award, CheckCircle2, XCircle, AlertTriangle, Info, X, FileText, Clock, Camera, Loader2, RefreshCcw, Tag, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "qrcode";


import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { currencyDatabase } from "@/context/RegionContext";
import VendorProfilePage from "@/app/vendor/profile/page";
import { VendorCouponManager } from "@/features/coupons/components/VendorCouponManager";
import InquiriesTab from "./tabs/InquiriesTab";
import HistoryTab from "./tabs/HistoryTab";
import ProductsTab from "./tabs/ProductsTab";
import SettlementsTab from "./tabs/SettlementsTab";
import DirectOrdersAndReturnsTab from "./tabs/DirectOrdersAndReturnsTab";
import AddProductTab from "./tabs/AddProductTab";
import { compressImageToWebP } from "@/lib/imageCompressor";
import WorkersTab from "./tabs/WorkersTab";

export const VendorDashboard = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [vendor, setVendor] = useState<any>(null);

  // Premium Toast Notification State
  interface ToastItem {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sequential queue: dismiss the active toast (first in queue) after 4 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const activeId = toasts[0].id;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== activeId));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts[0]?.id]);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const simulateShiprocketWebhook = async (awb: string, status: string) => {
    try {
      const res = await fetch("/api/webhooks/shiprocket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ awb, current_status: status })
      });
      if (res.ok) {
        showToast(`Simulated Shiprocket Webhook: ${status}`, "success");
        if (vendor) await fetchData(vendor.id);
      } else {
        showToast("Webhook simulation failed", "error");
      }
    } catch (err) {
      showToast("Network error simulating webhook", "error");
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleTabRefresh = async () => {
    if (vendor && vendor.id) {
      setIsRefreshing(true);
      await fetchData(vendor.id, vendor);
      setIsRefreshing(false);
    }
  };

  // Dashboard Data
  const [inquiries, setInquiries] = useState<any[]>([]);
  const swrConfig = { revalidateOnFocus: false, revalidateOnReconnect: false };

  const { data: productsData, mutate: mutateProducts } = useSWR(vendor?.id ? `/api/products?vendorId=${vendor.id}` : null, fetcher, swrConfig);
  const products = productsData || [];
  const [productSearch, setProductSearch] = useState("");
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  const [modalMainImage, setModalMainImage] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<any | null>(null);
  const [modalShipping, setModalShipping] = useState<any | null>(null);
  const [modalTransaction, setModalTransaction] = useState<any | null>(null);
  const [editStockValue, setEditStockValue] = useState("");
  const [updatingStock, setUpdatingStock] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState<number | null>(null);
  const [approveReturnModal, setApproveReturnModal] = useState<any | null>(null);
  const [activeTab, _setActiveTab] = useState<"inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers">("inquiries");

  useEffect(() => {
    const savedTab = localStorage.getItem("vendorActiveTab");
    if (savedTab) {
      _setActiveTab(savedTab as any);
    }
  }, []);

  const setActiveTab = (tab: "inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders" | "settlements" | "returns-pending" | "returns-action" | "profile" | "promotions" | "workers") => {
    _setActiveTab(tab);
    localStorage.setItem("vendorActiveTab", tab);
  };

  const { data: returnsData, mutate: mutateReturns } = useSWR(vendor?.id ? `/api/vendor/returns` : null, fetcher, swrConfig);
  const returns = returnsData?.success ? returnsData.returns : [];
  const slaHours = returnsData?.success && returnsData.slaHours ? returnsData.slaHours : 24;

  const { data: settlementsData, mutate: mutateSettlements } = useSWR(vendor?.id ? `/api/admin/settlements` : null, fetcher, swrConfig);
  const settlements = settlementsData?.success ? settlementsData.settlements : [];
  const settlementSummary = settlementsData?.success ? settlementsData.summary : null;
  const settlementSettings = settlementsData?.success ? settlementsData.settings : null;

  const [settlementTab, setSettlementTab] = useState<"ALL" | "HOLD" | "ELIGIBLE" | "SETTLED" | "DISPUTED">("ALL");
  const [allInquiries, setAllInquiries] = useState<any[]>([]);
  const [editingDelivery, setEditingDelivery] = useState<{ inquiryId: number, productId: number, value: string } | null>(null);
  const [editingDirectDelivery, setEditingDirectDelivery] = useState<{ orderId: string, value: string } | null>(null);
  const [directOrders, setDirectOrders] = useState<any[]>([]);
  
  const { data: statsData, mutate: mutateStats } = useSWR(vendor?.id ? `/api/vendor/stats?vendorId=${vendor.id}` : null, fetcher, swrConfig);
  const dashboardStats = (statsData?.success ? statsData.stats : null) || {
    todayOrders: 0,
    todayRevenue: 0,
    pendingReturns: 0,
    pendingInquiries: 0
  };

  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);

  const { data: ordData, isValidating: fetchingOrders, mutate: mutateOrders } = useSWR(
    vendor?.id ? `/api/orders?vendorId=${vendor.id}&page=${orderPage}&limit=10` : null,
    fetcher,
    swrConfig
  );

  useEffect(() => {
    if (ordData?.orders) {
      setDirectOrders(prev => orderPage === 1 ? ordData.orders : [...prev, ...ordData.orders]);
      if (ordData.pagination) {
        setOrderTotalPages(ordData.pagination.totalPages || 1);
      }
    }
  }, [ordData, orderPage]);

  const { data: catData, isLoading: loadingCategories, mutate: mutateCategories } = useSWR("/api/categories", fetcher);
  const dbCategories = catData || [];

  // Packing Modal State
  const [showPackingModal, setShowPackingModal] = useState<any | null>(null);
  const [packingImages, setPackingImages] = useState<Record<number, string[]>>({}); // orderItemId -> string[]
  const [uploadingPacking, setUploadingPacking] = useState<{ [itemId: number]: boolean }>({});
  const [activeCameraItem, setActiveCameraItem] = useState<number | null>(null);
  const [activeCameraStream, setActiveCameraStream] = useState<MediaStream | null>(null);

  // Return QC State
  const [reviewReturnOrder, setReviewReturnOrder] = useState<any | null>(null);
  const [qcImages, setQcImages] = useState<string[]>([]);
  const [qcNotes, setQcNotes] = useState("");
  const [isDisputing, setIsDisputing] = useState(false);
  const [uploadingQc, setUploadingQc] = useState(false);
  const [qcCameraActive, setQcCameraActive] = useState(false);
  const [qcCameraStream, setQcCameraStream] = useState<MediaStream | null>(null);
  const [submittingQc, setSubmittingQc] = useState(false);
  const [submittingPacking, setSubmittingPacking] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const [qcCameraError, setQcCameraError] = useState(false);
  const [liveCameraError, setLiveCameraError] = useState(false);

  // Mobile Studio QR State
  const [showMobileQR, setShowMobileQR] = useState(false);
  const [mobileQRUrl, setMobileQRUrl] = useState("");

  const handleOpenMobileQR = async () => {
    try {
      const url = window.location.origin + "/vendor/camera";
      const qr = await QRCode.toDataURL(url, { width: 250, margin: 2 });
      setMobileQRUrl(qr);
      setShowMobileQR(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!qcCameraActive) {
      setQcCameraError(false);
      return;
    }
    if (qcCameraStream) {
      const videoNode = document.getElementById("qc-camera-video") as HTMLVideoElement;
      if (videoNode) {
        videoNode.srcObject = qcCameraStream;
        videoNode.play().catch(() => {});
      }
    }
  }, [qcCameraActive, qcCameraStream]);

  useEffect(() => {
    if (activeCameraItem === null) {
      setLiveCameraError(false);
      return;
    }
    if (activeCameraStream) {
      const videoNode = document.getElementById("live-camera-video") as HTMLVideoElement;
      if (videoNode) {
        videoNode.srcObject = activeCameraStream;
        videoNode.play().catch(() => {});
      }
    }
  }, [activeCameraItem, activeCameraStream]);

  useEffect(() => {
    if (modalShipping) {
      QRCode.toDataURL(modalShipping.orderNumber || modalShipping.id, { width: 150, margin: 1 })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Error generating QR code", err));
    } else {
      setQrDataUrl("");
    }
  }, [modalShipping]);

  // SLA Countdown States
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Tick every 30 seconds
    return () => clearInterval(timer);
  }, []);



  // Edit Product Modal states & handlers
  const [modalEditProduct, setModalEditProduct] = useState<any | null>(null);

  // AI Generation State
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiSeoData, setAiSeoData] = useState<any | null>(null);

  const handleAiGenerate = async (isEdit: boolean = false) => {
    const currentName = isEdit ? editForm.name : productForm.name;
    const currentCat = isEdit ? editForm.categoryName : productForm.categoryName;
    const currentMat = isEdit ? editForm.material : productForm.material;
    const currentPrice = isEdit ? editForm.price : productForm.price;
    const currentFinish = isEdit ? editForm.finish : productForm.finish;
    const currentCapacity = isEdit ? editForm.capacity : productForm.capacity;
    const currentSpecs = isEdit ? editForm.customSpecs : productForm.customSpecs;

    if (!currentName || currentName.trim().length < 2) {
      showToast("Please enter Item Name first to generate AI Description & SEO!", "warning");
      return;
    }

    setGeneratingAi(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: currentName,
          category: currentCat,
          material: currentMat,
          price: currentPrice,
          finish: currentFinish,
          capacity: currentCapacity,
          specs: currentSpecs,
          promptType: "description"
        })
      });

      const data = await res.json();
      if (data.success && data.text) {
        if (isEdit) {
          setEditForm(prev => ({
            ...prev,
            description: data.text,
            seoTitle: data.seoTitle || prev.name,
            seoDescription: data.seoDescription || data.text?.slice(0, 155),
            seoKeywords: data.seoKeywords || ""
          }));
        } else {
          setProductForm(prev => ({
            ...prev,
            description: data.text,
            seoTitle: data.seoTitle || prev.name,
            seoDescription: data.seoDescription || data.text?.slice(0, 155),
            seoKeywords: data.seoKeywords || ""
          }));
        }
        setAiSeoData({
          suggestedTitle: data.suggestedTitle,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          seoKeywords: data.seoKeywords
        });
        showToast("✨ Premium SEO Description & Google Preview generated!", "success");
      } else {
        showToast(data.error || "Could not generate description.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to connect to AI service.", "error");
    } finally {
      setGeneratingAi(false);
    }
  };

  // KYC / Vendor Profile State
  const [kycForm, setKycForm] = useState({
    mobile: "",
    gstin: "",
    aadhaar: "",
    pan: "",
  });
  const [submittingKyc, setSubmittingKyc] = useState(false);

  // Auto-fill KYC form if data exists
  useEffect(() => {
    if (vendor) {
      setKycForm({
        mobile: vendor.mobile || "",
        gstin: vendor.gstin || "",
        aadhaar: vendor.aadhaar || "",
        pan: vendor.pan || "",
      });
    }
  }, [vendor]);

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

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingKyc(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kycForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Profile submitted for review!", "success");
        if (vendor) fetchData(vendor.id); // Re-fetch to get updated status
        setActiveTab("inquiries");
      } else {
        showToast(data.error || "Submission failed", "error");
      }
    } catch (err) {
      showToast("Error submitting profile", "error");
    } finally {
      setSubmittingKyc(false);
    }
  };
  const [editForm, setEditForm] = useState<{
    id: number;
    name: string;
    description: string;
    specs: string;
    weightValue: string;
    weightUnit: string;
    customSpecs: { label: string; value: string }[];
    piecesValue: string;
    combo: string;
    capacity: string;
    thickness: string;
    finish: string;
    image: string;
    images: string[];
    price: string;
    mrp: string;
    discount: string;
    prices: Record<string, { mrp: string; discount?: string }>;
    categoryName: string;
    material: string;
    stock: string;
    featured: boolean;
    newLaunch: boolean;
    active: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    crossSellIds: number[];
    bundleDiscountType: string;
    bundleDiscountValue: string;
  }>({
    id: 0,
    name: "",
    description: "",
    specs: "",
    weightValue: "",
    weightUnit: "Kg",
    customSpecs: [{ label: "", value: "" }],
    piecesValue: "",
    combo: "",
    capacity: "",
    thickness: "",
    finish: "",
    image: "",
    images: [],
    price: "",
    mrp: "",
    discount: "0",
    prices: {
      US: { mrp: "" },
      EU: { mrp: "" },
      GB: { mrp: "" },
      AE: { mrp: "" },
      JP: { mrp: "" },
      CN: { mrp: "" }
    },
    categoryName: "kitchen-utility",
    material: "Bronze",
    stock: "10",
    featured: false,
    newLaunch: false,
    active: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    crossSellIds: [],
    bundleDiscountType: "NONE",
    bundleDiscountValue: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [listingProduct, setListingProduct] = useState(false);
  const [selectedCountryToAdd, setSelectedCountryToAdd] = useState("");
  const [selectedCountryToEdit, setSelectedCountryToEdit] = useState("");

  const addCustomSpecRow = (isEdit: boolean) => {
    if (isEdit) {
      setEditForm(prev => ({
        ...prev,
        customSpecs: [...prev.customSpecs, { label: "", value: "" }]
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        customSpecs: [...prev.customSpecs, { label: "", value: "" }]
      }));
    }
  };

  const removeCustomSpecRow = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditForm(prev => {
        const filtered = prev.customSpecs.filter((_, idx) => idx !== index);
        return {
          ...prev,
          customSpecs: filtered.length === 0 ? [{ label: "", value: "" }] : filtered
        };
      });
    } else {
      setProductForm(prev => {
        const filtered = prev.customSpecs.filter((_, idx) => idx !== index);
        return {
          ...prev,
          customSpecs: filtered.length === 0 ? [{ label: "", value: "" }] : filtered
        };
      });
    }
  };

  const updateCustomSpecRow = (index: number, field: "label" | "value", val: string, isEdit: boolean) => {
    const cleanedVal = val.replace(/,/g, "");
    if (isEdit) {
      setEditForm(prev => {
        const updated = prev.customSpecs.map((spec, idx) => {
          if (idx === index) {
            return { ...spec, [field]: cleanedVal };
          }
          return spec;
        });
        return { ...prev, customSpecs: updated };
      });
    } else {
      setProductForm(prev => {
        const updated = prev.customSpecs.map((spec, idx) => {
          if (idx === index) {
            return { ...spec, [field]: cleanedVal };
          }
          return spec;
        });
        return { ...prev, customSpecs: updated };
      });
    }
  };

  const openEditModal = (prod: any) => {
    let weightVal = "";
    let weightUnitVal = "Kg";
    let piecesVal = "";
    let comboVal = "";
    let capacityVal = "";
    let thicknessVal = "";
    let finishVal = "";
    const parsedCustomSpecs: { label: string; value: string }[] = [];

    if (prod.specs) {
      const parts = prod.specs.split(" | ");
      parts.forEach((p: string) => {
        if (p.includes("Pieces:")) {
          piecesVal = p.replace("Pieces:", "").trim();
        } else if (p.includes("Combo")) {
          comboVal = p.replace("Combo", "").trim();
        } else if (p.includes("Capacity:")) {
          capacityVal = p.replace("Capacity:", "").trim();
        } else if (p.includes("Thickness:")) {
          thicknessVal = p.replace("Thickness:", "").trim();
        } else if (p.includes("Finish:")) {
          finishVal = p.replace("Finish:", "").trim();
        } else if (p.toLowerCase().includes("kg") || p.toLowerCase().includes("gm") || p.toLowerCase().includes("lbs") || p.toLowerCase().includes("ton")) {
          const m = p.trim().split(" ");
          if (m.length >= 2) {
            weightVal = m[0];
            weightUnitVal = m[1];
          } else {
            weightVal = p;
          }
        } else if (p.includes(":")) {
          const specParts = p.split(":");
          parsedCustomSpecs.push({
            label: specParts[0].trim(),
            value: specParts[1].trim()
          });
        }
      });
    }

    if (parsedCustomSpecs.length === 0) {
      parsedCustomSpecs.push({ label: "", value: "" });
    }

    let additionalImages: string[] = [];
    if (prod.images) {
      if (Array.isArray(prod.images)) {
        additionalImages = prod.images as string[];
      } else if (typeof prod.images === "string") {
        try {
          additionalImages = JSON.parse(prod.images);
        } catch (e) {
          additionalImages = [];
        }
      }
    }

    let pricesVal: Record<string, { mrp: string; discount?: string }> = {
      US: { mrp: "", discount: "" },
      EU: { mrp: "", discount: "" },
      GB: { mrp: "", discount: "" },
      AE: { mrp: "", discount: "" },
      JP: { mrp: "", discount: "" },
      CN: { mrp: "", discount: "" }
    };
    if (prod.prices) {
      try {
        const parsed = typeof prod.prices === "string" ? JSON.parse(prod.prices) : prod.prices;
        for (const code in parsed) {
          pricesVal[code] = {
            mrp: parsed[code]?.mrp?.toString() || "",
            discount: parsed[code]?.discount?.toString() || ""
          };
        }
      } catch (e) {
        console.error("Error parsing product regional prices:", e);
      }
    }

    setEditForm({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      specs: prod.specs || "",
      image: prod.image,
      images: prod.images || [],
      price: prod.price?.toString() || "",
      mrp: prod.mrp?.toString() || "",
      discount: prod.discount?.toString() || "",
      prices: pricesVal,
      categoryName: prod.categoryName || "",
      material: prod.material || "",
      stock: prod.stock?.toString() || "",
      featured: prod.featured || false,
      newLaunch: prod.newLaunch || false,
      active: prod.active !== false,
      weightValue: weightVal,
      weightUnit: weightUnitVal,
      customSpecs: parsedCustomSpecs,
      piecesValue: piecesVal,
      combo: comboVal,
      capacity: capacityVal,
      thickness: thicknessVal,
      finish: finishVal,
      crossSellIds: prod.crossSellIds || [],
      bundleDiscountType: prod.bundleDiscountType || "NONE",
      bundleDiscountValue: prod.bundleDiscountValue?.toString() || "",
    });
    setModalEditProduct(prod);
  };

  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    try {
      const comp = await compressImageToWebP(rawFile);
      setCompressionLogs(prev => [{
        name: rawFile.name,
        original: comp.originalSizeFormatted,
        compressed: comp.compressedSizeFormatted,
        saved: comp.savedPercentage
      }, ...prev.slice(0, 4)]);

      const formData = new FormData();
      formData.append("file", comp.file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditForm((prev) => ({ ...prev, image: data.url }));
        showToast(`✨ Image compressed to WebP: ${comp.compressedSizeFormatted} (${comp.savedPercentage}% saved)`, "success");
      } else {
        showToast("Failed to upload image", "error");
      }
    } catch (err) {
      showToast("Error uploading image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const specParts = [];
      if (editForm.weightValue) {
        specParts.push(`${editForm.weightValue} ${editForm.weightUnit}`);
      }
      if (editForm.piecesValue) {
        specParts.push(`Pieces: ${editForm.piecesValue}`);
      }
      if (editForm.combo) {
        const cVal = /^\d+$/.test(editForm.combo.trim())
          ? `${editForm.combo.trim()} Combo`
          : editForm.combo;
        specParts.push(cVal);
      }
      if (editForm.capacity.trim()) {
        specParts.push(`Capacity: ${editForm.capacity.trim()}`);
      }
      if (editForm.thickness.trim()) {
        specParts.push(`Thickness: ${editForm.thickness.trim()}`);
      }
      if (editForm.finish) {
        specParts.push(`Finish: ${editForm.finish}`);
      }
      editForm.customSpecs.forEach((spec) => {
        if (spec.label.trim() && spec.value.trim()) {
          specParts.push(`${spec.label.trim()}: ${spec.value.trim()}`);
        }
      });
      const finalSpecs = specParts.join(" | ");

      const payload = {
        name: editForm.name,
        description: editForm.description,
        specs: finalSpecs || "Standard",
        image: editForm.image,
        images: editForm.images,
        price: editForm.price,
        mrp: editForm.mrp,
        discount: editForm.discount,
        prices: editForm.prices,
        categoryName: editForm.categoryName,
        material: editForm.material,
        stock: editForm.stock,
        featured: editForm.featured,
        active: editForm.active,
        crossSellIds: editForm.crossSellIds,
        bundleDiscountType: editForm.bundleDiscountType,
        bundleDiscountValue: parseFloat(editForm.bundleDiscountValue) || null,
      };

      const res = await fetch(`/api/products/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Crafted product updated successfully!", "success");
        setModalEditProduct(null);
        if (vendor) fetchData(vendor.id);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update product", "error");
      }
    } catch (err) {
      showToast("Error updating product", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const formatDateTime = (dtStr: string) => {
    if (!dtStr) return "";
    try {
      return new Date(dtStr).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    } catch (e) {
      return dtStr;
    }
  };

  // Create Product Form
  const [productForm, setProductForm] = useState<{
    name: string;
    description: string;
    specs: string;
    weightValue: string;
    weightUnit: string;
    customSpecs: { label: string; value: string }[];
    piecesValue: string;
    combo: string;
    capacity: string;
    thickness: string;
    finish: string;
    image: string;
    images: string[];
    price: string;
    mrp: string;
    discount: string;
    prices: Record<string, { mrp: string; discount?: string }>;
    categoryName: string;
    material: string;
    stock: string;
    featured: boolean;
    newLaunch: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    crossSellIds: number[];
    bundleDiscountType: string;
    bundleDiscountValue: string;
  }>({
    name: "",
    description: "",
    specs: "",
    weightValue: "",
    weightUnit: "Kg",
    customSpecs: [{ label: "", value: "" }],
    piecesValue: "",
    combo: "",
    capacity: "",
    thickness: "",
    finish: "Tin Coated (Kalai)",
    image: "",
    images: [],
    price: "",
    mrp: "",
    discount: "0",
    prices: {
      US: { mrp: "" },
      EU: { mrp: "" },
      GB: { mrp: "" },
      AE: { mrp: "" },
      JP: { mrp: "" },
      CN: { mrp: "" }
    },
    categoryName: "kitchen-utility",
    material: "Bronze",
    stock: "10",
    featured: false,
    newLaunch: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    crossSellIds: [],
    bundleDiscountType: "NONE",
    bundleDiscountValue: "",
  });
  const [editBundleSearch, setEditBundleSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [compressionLogs, setCompressionLogs] = useState<Array<{ name: string; original: string; compressed: string; saved: number }>>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    showToast(`⚡ Compressing ${rawFile.name} to WebP...`, "info");
    
    try {
      // 1. Browser client-side compression to WebP
      const comp = await compressImageToWebP(rawFile);

      // Log stats for UI display
      const logItem = {
        name: rawFile.name,
        original: comp.originalSizeFormatted,
        compressed: comp.compressedSizeFormatted,
        saved: comp.savedPercentage
      };
      setCompressionLogs(prev => [logItem, ...prev.slice(0, 4)]);

      if (comp.savedPercentage > 0) {
        showToast(`✨ Compressed WebP: ${comp.originalSizeFormatted} ➔ ${comp.compressedSizeFormatted} (${comp.savedPercentage}% saved)`, "success");
      }

      const formData = new FormData();
      formData.append("file", comp.file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProductForm((prev) => ({ ...prev, image: data.url }));
      } else {
        showToast("Failed to upload image", "error");
      }
    } catch (err) {
      showToast("Error uploading image", "error");
    } finally {
      setUploading(false);
    }
  };

  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const fileArray = Array.from(files);

    try {
      const uploadPromises = fileArray.map(async (rawFile, idx) => {
        // Compress each file to WebP
        const comp = await compressImageToWebP(rawFile);

        setCompressionLogs(prev => [{
          name: rawFile.name,
          original: comp.originalSizeFormatted,
          compressed: comp.compressedSizeFormatted,
          saved: comp.savedPercentage
        }, ...prev.slice(0, 4)]);

        const formData = new FormData();
        formData.append("file", comp.file);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Image ${idx + 1} failed`);
        }

        const data = await res.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      if (isEdit) {
        setEditForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
        }));
      } else {
        setProductForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
        }));
      }
      showToast("⚡ WebP Gallery images compressed & uploaded!", "success");
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      showToast(err.message || "Error uploading gallery images", "error");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleUploadPackingImage = async (files: FileList | File[] | null, itemId: number) => {
    if (!files || files.length === 0) return;

    setUploadingPacking(prev => ({ ...prev, [itemId]: true }));
    try {
      const currentImgs = packingImages[itemId] || [];
      if (currentImgs.length + files.length > 8) {
        throw new Error("Maximum 8 photos allowed per item.");
      }

      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (rawFile) => {
        const comp = await compressImageToWebP(rawFile);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setPackingImages(prev => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), ...uploadedUrls]
      }));
      showToast("⚡ WebP Dispatch photos uploaded successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to upload photo", "error");
    } finally {
      setUploadingPacking(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleUploadQcImage = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setUploadingQc(true);
    try {
      if (qcImages.length + files.length > 8) throw new Error("Max 8 photos");
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (rawFile) => {
        const comp = await compressImageToWebP(rawFile);
        const formData = new FormData();
        formData.append("file", comp.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        return data.url;
      });
      const urls = await Promise.all(uploadPromises);
      setQcImages(prev => [...prev, ...urls]);
      showToast("⚡ WebP QC photos uploaded successfully!", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUploadingQc(false);
    }
  };

  const handleQcSubmit = async (action: "QC_PASS" | "QC_UPLOAD") => {
    if (!reviewReturnOrder?.returnRequest) return;
    if (action === "QC_UPLOAD" && qcImages.length < 5) {
      showToast("Please upload at least 5 photos showing the wrong/damaged product.", "error");
      return;
    }
    
    setSubmittingQc(true);
    try {
      const res = await fetch(`/api/returns/${reviewReturnOrder.returnRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, qcImages, qcNotes })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(action === "QC_PASS" ? "Return Accepted & Refunded!" : "Dispute Raised! Admin will review.", "success");
        setReviewReturnOrder(null);
        if (vendor) fetchData(vendor.id);
      } else {
        showToast(data.error || "Failed to submit QC", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setSubmittingQc(false);
    }
  };

  const handleReturnAction = async (returnId: string, action: string) => {
    try {
      const mappedAction = action === "RETURN_APPROVED" ? "QC_PASS" : action;
      const res = await fetch(`/api/returns/${returnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mappedAction })
      });
      if (res.ok) {
        showToast("QC Approved successfully!", "success");
        if (vendor) fetchData(vendor.id);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update return", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    }
  };

  const removeGalleryImage = (idx: number, isEdit: boolean) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== idx),
      }));
    } else {
      setProductForm((prev) => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== idx),
      }));
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          if (data.user.role === "vendor" || data.user.role === "admin") {
            setAuthorized(true);
            setVendor(data.user);
            fetchData(data.user.id, data.user);
          } else {
            router.push("/profile");
          }
        } else {
          setAuthorized(false);
          router.push("/vendor/login");
        }
      } else {
        setAuthorized(false);
        router.push("/vendor/login");
      }
    } catch (e) {
      setAuthorized(false);
      router.push("/vendor/login");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    window.location.href = "/vendor/login";
  };

  const handleUpdateVendorName = async (newName: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        const data = await res.json();
        setVendor(data.user);
        showToast("Workshop name updated successfully!", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update workshop name", "error");
      }
    } catch (err) {
      showToast("Error updating workshop name", "error");
    }
  };

  const fetchOrders = async (vId: number, page: number) => {
    mutateOrders();
  };

  const fetchData = async (vendorId: number, vendorData?: any) => {
    try {
      mutateCategories();
      mutateProducts();
      mutateStats();
      mutateSettlements();
      mutateReturns();
      mutateOrders();
      setOrderPage(1);

      // Fetch B2B inquiries and filter to show only those containing this vendor's products
      const resInq = await fetch("/api/inquiries", { cache: "no-store" });
      if (resInq.ok) {
        const allInqs = await resInq.json();
        setAllInquiries(allInqs);
      }
    } catch (e) {
      console.error("Failed to load vendor dashboard details:", e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (allInquiries.length > 0 && products.length > 0) {
      const filteredInq = allInquiries.filter((inq: any) => {
        if (!inq.items) return false;
        try {
          const itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
          return itemsList.some((item: any) => 
            products.some((p: any) => String(p.id) === String(item.id))
          );
        } catch (e) {
          return false;
        }
      });
      setInquiries(filteredInq);
    } else if (allInquiries.length > 0 && products.length === 0) {
      setInquiries([]);
    }
  }, [allInquiries, products]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setListingProduct(true);
    try {
      // Build final specs string (e.g. "1.8 Kg | Pieces: 3 | Combo Pack")
      const specParts = [];
      if (productForm.weightValue) {
        specParts.push(`${productForm.weightValue} ${productForm.weightUnit}`);
      }
      if (productForm.piecesValue) {
        specParts.push(`Pieces: ${productForm.piecesValue}`);
      }
      if (productForm.combo) {
        const cVal = /^\d+$/.test(productForm.combo.trim())
          ? `${productForm.combo.trim()} Combo`
          : productForm.combo;
        specParts.push(cVal);
      }
      if (productForm.capacity.trim()) {
        specParts.push(`Capacity: ${productForm.capacity.trim()}`);
      }
      if (productForm.thickness.trim()) {
        specParts.push(`Thickness: ${productForm.thickness.trim()}`);
      }
      if (productForm.finish) {
        specParts.push(`Finish: ${productForm.finish}`);
      }
      productForm.customSpecs.forEach((spec) => {
        if (spec.label.trim() && spec.value.trim()) {
          specParts.push(`${spec.label.trim()}: ${spec.value.trim()}`);
        }
      });
      const finalSpecs = specParts.join(" | ");

      const payload = {
        name: productForm.name,
        description: productForm.description,
        specs: finalSpecs || "Standard",
        image: productForm.image,
        images: productForm.images,
        price: productForm.price,
        mrp: productForm.mrp,
        discount: productForm.discount,
        prices: productForm.prices,
        categoryName: productForm.categoryName,
        material: productForm.material,
        stock: productForm.stock,
        newLaunch: productForm.newLaunch,
        crossSellIds: productForm.crossSellIds,
        bundleDiscountType: productForm.bundleDiscountType,
        bundleDiscountValue: parseFloat(productForm.bundleDiscountValue) || null,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Crafted product listed successfully!", "success");
        setProductForm({
          name: "",
          description: "",
          specs: "",
          weightValue: "",
          weightUnit: "Kg",
          customSpecs: [{ label: "", value: "" }],
          piecesValue: "",
          combo: "",
          capacity: "",
          thickness: "",
          finish: "Tin Coated (Kalai)",
          image: "",
          images: [],
          price: "",
          mrp: "",
          discount: "0",
          prices: {
            US: { mrp: "" },
            EU: { mrp: "" },
            GB: { mrp: "" },
            AE: { mrp: "" },
            JP: { mrp: "" },
            CN: { mrp: "" }
          },
          categoryName: "kitchen-utility",
          material: "Bronze",
          stock: "10",
          featured: false,
          newLaunch: false,
          crossSellIds: [],
          bundleDiscountType: "NONE",
          bundleDiscountValue: "",
        });
        if (vendor) fetchData(vendor.id);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to list product", "error");
      }
    } catch (err) {
      showToast("Error listing product", "error");
    } finally {
      setListingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      mutateProducts((prev: any[] | undefined) => prev ? prev.filter(p => p.id !== id) : [], false);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Listing removed!", "success");
        if (vendor) fetchData(vendor.id);
      } else {
        mutateProducts(); // revert on failure
        showToast("Failed to remove product listing", "error");
      }
    } catch (err) {
      mutateProducts(); // revert on failure
      showToast("Error removing listing", "error");
    }
  };

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  const handleUpdateItemStatus = async (inquiryId: number, productId: number, status: string, deliveryDate?: string) => {
    if (updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, productId, status, deliveryDate }),
      });

      if (res.ok) {
        if (vendor) fetchData(vendor.id);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update status", "error");
      }
    } catch (err) {
      showToast("Error updating status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateDirectOrderStatus = async (orderId: string, status: string, deliveryDate?: string) => {
    if (savingOrderId) return;
    setSavingOrderId(orderId);
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, deliveryDate }),
      });

      if (res.ok) {
        showToast("Order status updated successfully!", "success");
        if (vendor) await fetchData(vendor.id);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update order status", "error");
      }
    } catch (err) {
      showToast("Error updating order status", "error");
    } finally {
      setSavingOrderId(null);
      setUpdatingStatus(false);
    }
  };

  const getUnitsSold = (productId: number) => {
    let count = 0;
    const targetId = Number(productId);

    // 1. Calculate from inquiries
    (inquiries || []).forEach((inq) => {
      if (inq.items) {
        try {
          const list = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
          list.forEach((item: any) => {
            const pId = Number(item.productId || item.id || item.product?.id);
            const itemStatus = (item.status || inq.status || "").toUpperCase();
            const validStatus = !["CANCELLED", "REJECTED", "RETURNED", "QC_FAIL"].includes(itemStatus);
            if (pId === targetId && validStatus) {
              const qty = Number(item.quantity || item.qty || 1);
              count += qty > 0 ? qty : 1;
            }
          });
        } catch (e) {}
      }
    });

    // 2. Calculate from directOrders
    (directOrders || []).forEach((ord) => {
      const orderStatus = (ord.status || "").toUpperCase();
      const validStatus = !["CANCELLED", "RETURNED", "RETURN_REJECTED", "RETURN_APPROVED", "RETURN_RECEIVED", "QC_FAIL"].includes(orderStatus);
      
      if (validStatus) {
        if (ord.items) {
          try {
            const list = typeof ord.items === "string" ? JSON.parse(ord.items) : (ord.items as any[]) || [];
            list.forEach((item: any) => {
              const pId = Number(item.productId || item.id || item.product?.id);
              if (pId === targetId) {
                const qty = Number(item.quantity || item.qty || 1);
                count += qty > 0 ? qty : 1;
              }
            });
          } catch (e) {}
        } else if (ord.productId && Number(ord.productId) === targetId) {
          const qty = Number(ord.quantity || ord.qty || 1);
          count += qty > 0 ? qty : 1;
        }
      }
    });

    return count;
  };

  const openProductModal = (prod: any) => {
    setModalProduct(prod);
    setModalMainImage(prod.image || "/logo4.jpg");
    setEditStockValue(prod.stock.toString());
  };

  const handleUpdateStock = async () => {
    if (!modalProduct) return;
    setUpdatingStock(true);
    try {
      const res = await fetch(`/api/products/${modalProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: parseInt(editStockValue) || 0 }),
      });

      if (res.ok) {
        showToast("Product stock updated successfully!", "success");
        setModalProduct(null);
        if (vendor) fetchData(vendor.id);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update stock", "error");
      }
    } catch (err) {
      showToast("Error updating stock", "error");
    } finally {
      setUpdatingStock(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (authorized === null || (authorized && isLoadingData)) {
    return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>;
  }

  // Pre-calculate tab inquiry counts
  const activeInquiriesCount = inquiries.flatMap((inq) => {
    try {
      const itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any) || [];
      return itemsList.filter((item: any) =>
        products.some((p: any) => String(p.id) === String(item.id)) && !["DELIVERED", "CANCELLED", "RETURNED"].includes(item.status || "PENDING")
      );
    } catch (e) {
      return [];
    }
  }).length;

  const historyInquiriesCount = inquiries.flatMap((inq) => {
    try {
      const itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any) || [];
      return itemsList.filter((item: any) =>
        products.some((p: any) => String(p.id) === String(item.id)) && ["DELIVERED", "CANCELLED", "RETURNED"].includes(item.status || "PENDING")
      );
    } catch (e) {
      return [];
    }
  }).length;

  // Stats Calculations
  const stats = (() => {
    let todayOrders = 0;
    let activeQuotes = 0;
    let totalReceived = 0;
    let deliveredCount = 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayTime = startOfToday.getTime();

    inquiries.forEach((inq) => {
      const isToday = new Date(inq.createdAt).getTime() >= startOfTodayTime;
      let itemsList: any[] = [];
      try {
        itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any) || [];
      } catch (e) {}

      itemsList.forEach((item: any) => {
        const belongsToVendor = products.some((p: any) => String(p.id) === String(item.id));
        if (!belongsToVendor) return;

        totalReceived++;

        if (isToday) {
          todayOrders++;
        }

        if (item.status === "PENDING" || !item.status) {
          activeQuotes++;
        }

        if (item.status === "DELIVERED") {
          deliveredCount++;
        }
      });
    });

    return { todayOrders, activeQuotes, totalReceived, deliveredCount };
  })();

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* Vendor Header Banner (Flows naturally under the navbar) */}
      {vendor && (
        <div className="max-w-[95%] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <div className="bg-premium-maroon border border-orange-500/20 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/[0.07] rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/[0.04] rounded-full blur-[60px] -z-10" />
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/25 to-orange-600/10 text-orange-400 flex items-center justify-center flex-shrink-0 border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <Store size={26} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold font-display text-zinc-50 tracking-tight">{vendor.name}</h2>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-zinc-400">{vendor.email}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold text-orange-400 uppercase tracking-wider">✦ Artisan Vendor</span>
                </div>
              </div>
            </div>

            {/* Mobile Camera Studio Quick Button */}
            <div className="flex items-center gap-2">
              
            </div>
          </div>
        </div>
      )}

      {/* Sticky Navigation Tabs Wrapper */}
      <div className="sticky top-[56px] lg:top-[80px] z-30 bg-surface/95 supports-[backdrop-filter]:bg-surface/80 supports-[backdrop-filter]:backdrop-blur-xl shadow-sm border-b border-border/60 mt-4">
        {/* Navigation Tabs */}
        <div className="max-w-[95%] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex gap-6 py-3 overflow-x-auto whitespace-nowrap scrollbar-none flex-1">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "inquiries" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Active Quotes ({activeInquiriesCount})
              {activeTab === "inquiries" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("direct-orders")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "direct-orders" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Orders ({directOrders.filter(o => !["DELIVERED", "CANCELLED", "RETURNED", "RETURN_REJECTED", "RETURN_APPROVED", "RETURN_RECEIVED", "RETURN_REQUESTED"].includes(o.status || "PENDING")).length})
              {activeTab === "direct-orders" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === "history" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Order History ({historyInquiriesCount + directOrders.filter(o => ["DELIVERED", "CANCELLED", "RETURNED", "RETURN_REJECTED"].includes(o.status || "PENDING")).length})
              {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("returns-pending")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === "returns-pending" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Incoming Returns ({directOrders.filter(o => o.status === "RETURN_APPROVED" && !o.returnRequest?.vendorDeliveredAt).length})
              {activeTab === "returns-pending" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("returns-action")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === "returns-action" ? "text-red-500" : "text-muted hover:text-heading"
              }`}
            >
              QC Required ({directOrders.filter(o => o.status === "RETURN_RECEIVED" || (o.status === "RETURN_APPROVED" && o.returnRequest?.vendorDeliveredAt)).length})
              {activeTab === "returns-action" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "products" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              My Products ({products.length})
              {activeTab === "products" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("add-product")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "add-product" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Add Product
              {activeTab === "add-product" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("workers")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === "workers" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Team & Workers
              {activeTab === "workers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "profile" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              My Profile
              {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            {/* Promotions Tab */}
            <button
              onClick={() => setActiveTab("promotions")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === "promotions" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Promotions
              {activeTab === "promotions" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>

            {/* Settlements Tab */}
            <button
              onClick={() => setActiveTab("settlements")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === "settlements" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Settlements
              {activeTab === "settlements" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>

            {/* Admin Panel Redirect (Only if admin role) */}
            {vendor?.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="relative px-4 py-4 text-sm font-bold uppercase tracking-wider transition-colors text-orange-500 hover:text-orange-600 flex items-center gap-1"
                title="Go to Admin Master Dashboard"
              >
                <span>Admin Panel</span>
                <span className="text-xs">↗</span>
              </button>
            )}
          </div>

          <button
            onClick={handleTabRefresh}
            disabled={isRefreshing}
            className="hidden lg:flex items-center justify-center gap-2 px-5 py-3 ml-4 bg-surface border border-border hover:border-orange-500 rounded-2xl text-xs font-bold transition-all shadow-sm shrink-0 disabled:opacity-50"
            title="Refresh current tab data"
          >
            <RefreshCcw size={16} className={isRefreshing ? "animate-spin text-orange-500" : "text-muted"} />
            <span className="text-heading">Refresh</span>
          </button>
        </div>
      </div>

      <div className="max-w-[95%] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">  {/* Tab Contents */}
        {activeTab === "workers" && (
          <div className="animate-in fade-in duration-300">
            <WorkersTab />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="animate-in fade-in duration-300">
            <VendorProfilePage />
          </div>
        )}

        {["direct-orders", "returns-pending", "returns-action"].includes(activeTab) && (
          <DirectOrdersAndReturnsTab
            activeTab={activeTab}
            dashboardStats={dashboardStats}
            directOrders={directOrders}
            vendor={vendor}
            products={products}
            savingOrderId={savingOrderId}
            editingDirectDelivery={editingDirectDelivery}
            setEditingDirectDelivery={setEditingDirectDelivery}
            handleUpdateDirectOrderStatus={handleUpdateDirectOrderStatus}
            formatDateTime={formatDateTime}
            setModalShipping={setModalShipping}
            setModalTransaction={setModalTransaction}
            openProductModal={openProductModal}
            setShowPackingModal={setShowPackingModal}
            simulateShiprocketWebhook={simulateShiprocketWebhook}
            setIsDisputing={setIsDisputing}
            setQcImages={setQcImages}
            setQcNotes={setQcNotes}
            setReviewReturnOrder={setReviewReturnOrder}
            orderPage={orderPage}
            orderTotalPages={orderTotalPages}
            loadMoreRef={loadMoreRef}
            currentTime={currentTime}
            slaHours={slaHours}
          />
        )}

        {activeTab === "inquiries" && (
          <InquiriesTab
            stats={dashboardStats}
            inquiries={inquiries}
            products={products}
            editingDelivery={editingDelivery}
            setEditingDelivery={setEditingDelivery}
            handleUpdateItemStatus={handleUpdateItemStatus}
            formatDateTime={formatDateTime}
            setModalMessage={setModalMessage}
            openProductModal={openProductModal}
          />
        )}

        {activeTab === "history" && (
          <HistoryTab
            dashboardStats={dashboardStats}
            inquiries={inquiries}
            products={products}
            directOrders={directOrders}
            orderPage={orderPage}
            orderTotalPages={orderTotalPages}
            loadMoreRef={loadMoreRef}
            setModalMessage={setModalMessage}
            openProductModal={openProductModal}
            setModalShipping={setModalShipping}
            setModalTransaction={setModalTransaction}
          />
        )}

        {activeTab === "products" && (
          <ProductsTab
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            products={products}
            getUnitsSold={getUnitsSold}
            showToast={showToast}
            router={router}
            vendor={vendor}
            fetchData={fetchData}
            openProductModal={openProductModal}
            openEditModal={openEditModal}
            handleDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === "add-product" && (
          <AddProductTab
            vendor={vendor}
            router={router}
            handleCreateProduct={handleCreateProduct}
            productForm={productForm}
            setProductForm={setProductForm}
            addCustomSpecRow={addCustomSpecRow}
            updateCustomSpecRow={updateCustomSpecRow}
            removeCustomSpecRow={removeCustomSpecRow}
            handleFileUpload={handleFileUpload}
            uploading={uploading}
            handleGalleryUpload={handleGalleryUpload}
            uploadingGallery={uploadingGallery}
            removeGalleryImage={removeGalleryImage}
            handleAiGenerate={handleAiGenerate}
            generatingAi={generatingAi}
            selectedCountryToAdd={selectedCountryToAdd}
            setSelectedCountryToAdd={setSelectedCountryToAdd}
            currencyDatabase={currencyDatabase}
            loadingCategories={loadingCategories}
            dbCategories={dbCategories}
            listingProduct={listingProduct}
            aiSeoData={aiSeoData}
            products={products}
            compressionLogs={compressionLogs}
          />
        )}

        {activeTab === "settlements" && (
          <div className="animate-in fade-in duration-300">
            <SettlementsTab
              settlementSettings={settlementSettings}
              settlementSummary={settlementSummary}
              settlementTab={settlementTab}
              setSettlementTab={setSettlementTab}
              settlements={settlements}
            />
          </div>
        )}

        {activeTab === "promotions" && vendor?.id && (
          <VendorCouponManager vendorId={vendor.id} />
        )}
      </div>
      
      {/* Product Details Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200 scrollbar-none">
            {/* Close button */}
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10 font-bold"
            >
              ✕
            </button>
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Image & Gallery */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden border border-border bg-white flex items-center justify-center h-64 sm:h-auto">
                  <img
                    src={modalMainImage}
                    alt={modalProduct.name}
                    className="w-full h-full object-contain max-h-64 sm:max-h-full transition-all duration-300"
                  />
                </div>
                {modalProduct.images && modalProduct.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {/* Thumbnail of Main Image */}
                    {modalProduct.image && (
                      <button 
                        type="button"
                        onClick={() => setModalMainImage(modalProduct.image)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0 bg-white cursor-pointer transition-all ${modalMainImage === modalProduct.image ? "border-orange-500 ring-2 ring-orange-500/50" : "border-border hover:border-orange-500/50"}`}
                      >
                        <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-full object-cover" />
                      </button>
                    )}
                    {/* Gallery Images */}
                    {modalProduct.images.map((img: string, idx: number) => (
                      <button 
                        key={idx} 
                        type="button"
                        onClick={() => setModalMainImage(img)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0 bg-white cursor-pointer transition-all ${modalMainImage === img ? "border-orange-500 ring-2 ring-orange-500/50" : "border-border hover:border-orange-500/50"}`}
                      >
                        <img src={img} alt={`${modalProduct.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded-full">
                    ID: #{modalProduct.id}
                  </span>
                  <h2 className="text-xl font-bold text-heading mt-2 font-display">{modalProduct.name}</h2>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="bg-surface border border-border text-body px-2 py-1 rounded text-[10px] font-bold uppercase">
                    Category: {modalProduct.categoryName || modalProduct.category?.name || "N/A"}
                  </span>
                  <span className="bg-surface border border-border text-body px-2 py-1 rounded text-[10px] font-bold uppercase">
                    Material: {modalProduct.material}
                  </span>
                </div>

                <div className="border-t border-b border-border py-3 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-heading">₹{parseFloat(modalProduct.price).toLocaleString()}</span>
                  {parseFloat(modalProduct.mrp) > parseFloat(modalProduct.price) && (
                    <>
                      <span className="text-sm text-muted line-through">MRP: ₹{parseFloat(modalProduct.mrp).toLocaleString()}</span>
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                        {modalProduct.discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-2 border border-border p-3 rounded-2xl bg-surface">
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Stock Status</h4>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className={`text-xs font-bold ${modalProduct.stock <= 5 ? "text-red-500" : "text-emerald-600"}`}>
                      {modalProduct.stock} units available
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={editStockValue}
                        onChange={(e) => setEditStockValue(e.target.value)}
                        className="w-14 bg-surface-card border border-border focus:border-orange-500 rounded-lg px-2 py-1 text-xs text-heading text-center focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleUpdateStock}
                        disabled={updatingStock}
                        className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all text-[9px] disabled:opacity-50"
                      >
                        {updatingStock ? "Saving..." : "Update Stock"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Description</h4>
                  <p className="text-xs text-body leading-relaxed max-h-24 overflow-y-auto pr-1">
                    {modalProduct.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider">Specifications</h4>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs bg-surface p-3 rounded-xl border border-border max-h-32 overflow-y-auto">
                    {modalProduct.specs ? (
                      modalProduct.specs.split(" | ").map((spec: string, i: number) => {
                        const parts = spec.split(": ");
                        if (parts.length === 2) {
                          return (
                            <React.Fragment key={i}>
                              <span className="text-muted">{parts[0]}:</span>
                              <span className="text-heading font-semibold text-right">{parts[1]}</span>
                            </React.Fragment>
                          );
                        }
                        if (
                          spec.toLowerCase().includes("kg") ||
                          spec.toLowerCase().includes("gm") ||
                          spec.toLowerCase().includes("lbs") ||
                          spec.toLowerCase().includes("ton")
                        ) {
                          return (
                            <React.Fragment key={i}>
                              <span className="text-muted">Weight:</span>
                              <span className="text-heading font-semibold text-right">{spec}</span>
                            </React.Fragment>
                          );
                        }
                        return (
                          <React.Fragment key={i}>
                            <span className="text-muted">Detail:</span>
                            <span className="text-heading font-semibold text-right">{spec}</span>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <>
                        <span className="text-muted">Details:</span>
                        <span className="text-heading font-semibold text-right">Standard</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Message Modal */}
      {modalMessage && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 p-6 sm:p-8">
            {/* Close button */}
            <button
              onClick={() => setModalMessage(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10 font-bold"
            >
              ✕
            </button>
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Inquiry Notes From</span>
                <h3 className="text-lg font-bold text-heading font-display mt-0.5">{modalMessage.name}</h3>
                <p className="text-[10px] text-muted mt-0.5">
                  Received on {new Date(modalMessage.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })} | {modalMessage.country || "Domestic"}
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Message</p>
                <div className="bg-surface p-4 rounded-2xl border border-border text-xs text-body leading-relaxed max-h-60 overflow-y-auto italic">
                  "{modalMessage.message}"
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setModalMessage(null)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-300"
                >
                  Close Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Packing Modal (Dispatch Photos) */}
      {showPackingModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface-card border border-border rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
               <h2 className="text-lg font-bold text-heading">Pack Order {showPackingModal.orderNumber}</h2>
               <p className="text-xs text-muted">You must upload 5 to 8 photos for each item in the order to prove it was packed correctly.</p>
               
               <div className="space-y-6">
                  {showPackingModal.items?.filter((item: any) => item.vendorId === vendor?.id).map((item: any) => (
                     <div key={item.id} className="border border-border rounded-2xl p-4 bg-surface/50">
                        <div className="flex items-center gap-3 mb-3">
                           <img src={item.productImage} className="w-10 h-10 rounded-lg object-cover" />
                           <div>
                              <p className="text-xs font-bold text-heading">{item.productName}</p>
                              <p className="text-[10px] text-muted">Qty: {item.quantity}</p>
                           </div>
                        </div>
                        
                        <div className="border border-dashed border-orange-500/30 bg-orange-500/5 rounded-xl p-4 text-center">
                           <div className="flex flex-col gap-3">
                             <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-2">
                                {Array.from({ length: 8 }).map((_, i) => {
                                  const url = packingImages[item.id]?.[i];
                                  if (url) {
                                    return (
                                      <div key={i} className="aspect-square rounded-md overflow-hidden relative group border border-border">
                                        <img src={url} alt="Packing" className="w-full h-full object-cover" />
                                        <button 
                                          onClick={() => {
                                            setPackingImages(prev => ({
                                              ...prev,
                                              [item.id]: prev[item.id].filter((_, idx) => idx !== i)
                                            }));
                                          }}
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
                                      type="button"
                                      onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveCameraItem(item.id);
                                        try {
                                          let stream: MediaStream;
                                          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                                            setLiveCameraError(true);
                                            return;
                                          }
                                          try {
                                            stream = await navigator.mediaDevices.getUserMedia({
                                              video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                                            });
                                          } catch (e1) {
                                            try {
                                              stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                                            } catch (e2) {
                                              stream = await navigator.mediaDevices.getUserMedia({ video: true });
                                            }
                                          }
                                          setActiveCameraStream(stream);
                                        } catch (err) {
                                          console.error("Live Camera Error:", err);
                                          setLiveCameraError(true);
                                        }
                                      }}
                                      className={`aspect-square rounded-md border border-dashed flex flex-col items-center justify-center text-[8px] font-bold text-muted transition-all hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-500 ${i < 5 ? 'border-orange-500/30 bg-orange-500/5' : 'border-border bg-surface'}`}
                                    >
                                      <Camera size={12} className="mb-0.5" />
                                      {i < 5 ? "Req" : "Opt"}
                                    </button>
                                  );
                                })}
                             </div>
                             
                             <div className="flex items-center justify-between mt-2 pt-2 border-t border-orange-500/10">
                                <p className={`text-[10px] font-bold ${(packingImages[item.id]?.length || 0) >= 5 ? 'text-emerald-500' : 'text-red-500'}`}>
                                  {packingImages[item.id]?.length || 0}/8 Photos
                                </p>
                                <label className={`flex items-center gap-1.5 text-orange-500 text-[10px] font-bold transition-all ${uploadingPacking[item.id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline'}`}>
                                   {uploadingPacking[item.id] ? "Uploading..." : "Or Upload Files"}
                                   <input 
                                     type="file" 
                                     id={`file-input-${item.id}`}
                                     accept="image/*" 
                                     multiple
                                     disabled={uploadingPacking[item.id]}
                                     onChange={(e) => {
                                       handleUploadPackingImage(e.target.files, item.id);
                                       e.target.value = "";
                                     }}
                                     className="hidden" 
                                   />
                                </label>
                             </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="flex justify-end gap-2 pt-4">
                  <button onClick={() => setShowPackingModal(null)} className="px-4 py-2 text-xs font-bold text-muted hover:text-heading">Cancel</button>
                  <button 
                     onClick={async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (submittingPacking) return;
                        // Check if all items have 5-8 photos
                        const items = (showPackingModal.items || []).filter((item: any) => item.vendorId === vendor?.id);
                        let valid = true;
                        for (const item of items) {
                           const imgs = packingImages[item.id] || [];
                           if (imgs.length < 5 || imgs.length > 8) {
                              valid = false;
                              break;
                           }
                        }
                        if (!valid) {
                           showToast("Every item must have exactly 5 to 8 photos.", "error");
                           return;
                        }
                        
                        setSubmittingPacking(true);
                        setSavingOrderId(showPackingModal.id);
                        try {
                           for (const item of items) {
                              const res = await fetch("/api/vendor/dispatch", {
                                 method: "POST",
                                 headers: { "Content-Type": "application/json" },
                                 body: JSON.stringify({ orderItemId: item.id, dispatchImages: packingImages[item.id] })
                              });
                              if (!res.ok) {
                                 const errData = await res.json().catch(() => ({}));
                                 throw new Error(errData.error || "Failed to pack item " + item.id);
                              }
                           }
                           showToast("Order packed successfully!", "success");
                           setShowPackingModal(null);
                           if (vendor) await fetchData(vendor.id);
                        } catch (err: any) {
                           showToast(err.message || "Failed to pack order", "error");
                        } finally {
                           setSubmittingPacking(false);
                           setSavingOrderId(null);
                        }
                     }} 
                     disabled={submittingPacking || savingOrderId === showPackingModal.id} 
                     className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {(submittingPacking || savingOrderId === showPackingModal.id) && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />} 
                     {(submittingPacking || savingOrderId === showPackingModal.id) ? "Packing..." : "Confirm Packing"}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Product Edit Modal */}
      {modalEditProduct && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setModalEditProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10 font-bold"
            >
              ✕
            </button>
            <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-heading mb-4">Edit Product Listing</h2>
              <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="e.g. Copper Water Bottle"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Weight Field */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Weight (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.weightValue}
                        onChange={(e) => setEditForm({ ...editForm, weightValue: e.target.value })}
                        placeholder="e.g. 1.5"
                        className="flex-1 bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                      />
                      <select
                        value={editForm.weightUnit}
                        onChange={(e) => setEditForm({ ...editForm, weightUnit: e.target.value })}
                        className="w-20 bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 rounded-xl px-2 py-2 text-heading font-semibold focus:outline-none cursor-pointer appearance-none pr-6 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.4rem_center] bg-no-repeat"
                      >
                        <option value="Kg">Kg</option>
                        <option value="Gm">Gm</option>
                        <option value="Ton">Ton</option>
                        <option value="Lbs">Lbs</option>
                      </select>
                    </div>
                  </div>

                  {/* Pieces Count */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Pieces Count</label>
                    <input
                      type="number"
                      value={editForm.piecesValue}
                      onChange={(e) => setEditForm({ ...editForm, piecesValue: e.target.value })}
                      placeholder="e.g. 3"
                      className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                    />
                  </div>

                  {/* Combo Details */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Combo Details</label>
                    <input
                      type="text"
                      value={editForm.combo}
                      onChange={(e) => setEditForm({ ...editForm, combo: e.target.value })}
                      placeholder="e.g. Gift Set"
                      className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Capacity */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Capacity</label>
                    <input
                      type="text"
                      value={editForm.capacity}
                      onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                      placeholder="e.g. 2 Litres"
                      className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                    />
                  </div>

                  {/* Thickness */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Thickness</label>
                    <input
                      type="text"
                      value={editForm.thickness}
                      onChange={(e) => setEditForm({ ...editForm, thickness: e.target.value })}
                      placeholder="e.g. 3mm"
                      className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                    />
                  </div>

                  {/* Finish */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Finish / Coating</label>
                    <select
                      value={editForm.finish}
                      onChange={(e) => setEditForm({ ...editForm, finish: e.target.value })}
                      className="w-full bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 rounded-xl px-4 py-2 text-heading font-semibold focus:outline-none cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="">No Coating / Natural</option>
                      <option value="Tin Coated (Kalai)">Tin Coated (Kalai)</option>
                      <option value="Mirror Polished">Mirror Polished</option>
                      <option value="Hammered Matte">Hammered Matte</option>
                      <option value="Brass Polish">Brass Polish</option>
                    </select>
                  </div>
                </div>

                {/* Separate Custom Specification Section */}
                <div className="p-4 bg-surface border border-border rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Custom Specifications (Optional)</span>
                    <button
                      type="button"
                      onClick={() => addCustomSpecRow(true)}
                      className="text-[10px] text-orange-500 hover:text-orange-600 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      + Add More
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editForm.customSpecs.map((spec, index) => (
                      <div key={index} className="flex gap-3 items-end bg-surface-card border border-border p-3 rounded-xl relative group">
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="font-bold text-muted/80 uppercase tracking-wider text-[9px]">Spec Name / Label</label>
                            <span className="text-[8px] text-muted">{spec.label.length}/15</span>
                          </div>
                          <input
                            type="text"
                            value={spec.label}
                            onChange={(e) => updateCustomSpecRow(index, "label", e.target.value, true)}
                            placeholder="e.g. Capacity"
                            maxLength={15}
                            className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-3 py-1.5 text-heading focus:outline-none"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="font-bold text-muted/80 uppercase tracking-wider text-[9px]">Spec Value</label>
                            <span className="text-[8px] text-muted">{spec.value.length}/15</span>
                          </div>
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => updateCustomSpecRow(index, "value", e.target.value, true)}
                            placeholder="e.g. 2 Ltr"
                            maxLength={15}
                            className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-3 py-1.5 text-heading focus:outline-none"
                          />
                        </div>
                        {editForm.customSpecs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCustomSpecRow(index, true)}
                            className="p-2 text-muted hover:text-red-500 bg-surface hover:bg-red-500/5 rounded-lg border border-border transition-colors cursor-pointer"
                            title="Remove this specification"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Image */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Product Image *</label>
                  <div className="flex items-center gap-4 border border-dashed border-border p-4 rounded-xl bg-surface">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditFileUpload}
                        className="sr-only"
                        id="edit-product-image-upload"
                      />
                      <label
                        htmlFor="edit-product-image-upload"
                        className="inline-flex items-center justify-center px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl cursor-pointer font-semibold transition-all"
                      >
                        Change Image File
                      </label>
                    </div>
                    {editForm.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-border relative">
                        <img
                          src={editForm.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Gallery Images */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Product Gallery / Additional Images (Thumbnails)</label>
                  <div className="border border-dashed border-border p-4 rounded-xl bg-surface">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleGalleryUpload(e, true)}
                        className="sr-only"
                        id="edit-product-gallery-upload"
                      />
                      <label
                        htmlFor="edit-product-gallery-upload"
                        className="inline-flex items-center justify-center px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl cursor-pointer font-semibold transition-all text-xs"
                      >
                        {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
                      </label>
                      <p className="text-[10px] text-muted">Upload multiple images for thumbnails.</p>
                    </div>
                    {editForm.images && editForm.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-4">
                        {editForm.images.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                            <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx, true)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bundle / Cross-Sell Configuration */}
                <div className="p-4 bg-surface border border-bronze-500/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <div>
                      <h3 className="font-bold text-heading">Bundle Configuration (Optional)</h3>
                      <p className="text-[10px] text-muted">Select products to bundle with this item to offer a discount.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <label className="font-bold text-muted uppercase tracking-wider text-[10px]">Select Bundle Items</label>
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={editBundleSearch}
                        onChange={(e) => setEditBundleSearch(e.target.value)}
                        className="text-xs bg-surface border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500 w-48"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                      {products.length === 0 && <span className="text-xs text-muted">No other products available.</span>}
                      {products
                        .filter((p: any) => p.name !== editForm.name && p.name.toLowerCase().includes(editBundleSearch.toLowerCase()))
                        .map((p: any) => {
                        const isSelected = editForm.crossSellIds.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setEditForm((prev: any) => {
                                const newIds = isSelected
                                  ? prev.crossSellIds.filter((id: number) => id !== p.id)
                                  : [...prev.crossSellIds, p.id];
                                return { ...prev, crossSellIds: newIds };
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                              isSelected
                                ? "bg-bronze-500/10 border-bronze-500 text-bronze-700 dark:text-bronze-300"
                                : "bg-surface-card border-border hover:border-bronze-500/40 text-muted hover:text-heading"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}{p.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {editForm.crossSellIds.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="font-bold text-muted uppercase tracking-wider text-[10px]">Discount Type</label>
                        <select
                          value={editForm.bundleDiscountType}
                          onChange={(e) => setEditForm({ ...editForm, bundleDiscountType: e.target.value })}
                          className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                        >
                          <option value="NONE">None</option>
                          <option value="PERCENTAGE">Percentage (%)</option>
                          <option value="FLAT">Flat Amount (₹)</option>
                        </select>
                      </div>
                      {editForm.bundleDiscountType !== "NONE" && (
                        <div className="space-y-1">
                          <label className="font-bold text-muted uppercase tracking-wider text-[10px]">Discount Value</label>
                          <input
                            type="number"
                            value={editForm.bundleDiscountValue}
                            onChange={(e) => setEditForm({ ...editForm, bundleDiscountValue: e.target.value })}
                            placeholder={editForm.bundleDiscountType === "PERCENTAGE" ? "e.g. 10 (for 10%)" : "e.g. 500 (for ₹500 off)"}
                            className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-muted uppercase tracking-wider">Product Description *</label>
                    <button
                      type="button"
                      onClick={() => handleAiGenerate(true)}
                      disabled={generatingAi}
                      className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
                    >
                      {generatingAi ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                      <span>{generatingAi ? "Generating AI Copy..." : "✨ AI Generate"}</span>
                    </button>
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Product descriptions... or click ✨ AI Generate"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none resize-none"
                  />
                </div>

                {/* Editable SEO Metadata Fields for Edit Modal */}
                <div className="space-y-4 pt-3 border-t border-orange-500/20 animate-in fade-in duration-300">
                  {/* Concise Suggested Title Box */}
                  {aiSeoData?.suggestedTitle && (
                    <div className="p-3.5 bg-surface rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">💡 AI Recommended Title (Concise for Shop Cards)</span>
                        <span className="text-xs font-bold text-heading mt-0.5 block">{aiSeoData.suggestedTitle}</span>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setQcCameraActive(true);
                          try {
                            let stream: MediaStream;
                            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                              setQcCameraError(true);
                              return;
                            }
                            try {
                              stream = await navigator.mediaDevices.getUserMedia({
                                video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                              });
                            } catch (e1) {
                              try {
                                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                              } catch (e2) {
                                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                              }
                            }
                            setQcCameraStream(stream);
                          } catch (err) {
                            console.error("QC Camera Error:", err);
                            setQcCameraError(true);
                          }
                        }}
                        className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                      >
                        ✨ Apply to Item Name
                      </button>
                    </div>
                  )}

                  {/* Editable SEO Metadata Fields */}
                  <div className="p-4 bg-surface rounded-2xl border border-border space-y-3">
                    <h4 className="text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔍 Editable SEO Metadata Fields</span>
                      <span className="text-[10px] text-muted font-normal">(Can be auto-filled by AI)</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">SEO Meta Title Tag (Max 60 chars)</label>
                        <input
                          type="text"
                          value={editForm.seoTitle ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                          placeholder="e.g. Pure Copper Hammered Bottle | 1L Ayurvedic | StopShop"
                          className="w-full bg-surface-card border border-border focus:border-orange-500 rounded-xl px-3 py-2 text-heading text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">SEO Meta Description (Max 160 chars)</label>
                        <textarea
                          rows={2}
                          value={editForm.seoDescription ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, seoDescription: e.target.value })}
                          placeholder="Brief summary optimized for search clicks..."
                          className="w-full bg-surface-card border border-border focus:border-orange-500 rounded-xl px-3 py-2 text-heading text-xs focus:outline-none resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">Target Keywords (Comma separated)</label>
                        <input
                          type="text"
                          value={editForm.seoKeywords ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, seoKeywords: e.target.value })}
                          placeholder="e.g. copper bottle, ayurvedic vessel, hammered water dispenser"
                          className="w-full bg-surface-card border border-border focus:border-orange-500 rounded-xl px-3 py-2 text-heading text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Google Search Result Live Preview Card */}
                  <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-border/80 shadow-sm space-y-1.5">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Live Google Search Preview</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">stopshops.com</span>
                      <span>›</span>
                      <span>product</span>
                      <span>›</span>
                      <span className="truncate max-w-[150px]">{editForm.name?.toLowerCase().replace(/\s+/g, "-") || "item-slug"}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                      {editForm.seoTitle || editForm.name || "StopShop Product Title"}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                      {editForm.seoDescription || editForm.description || "Product description preview on search engine results."}
                    </p>
                    {editForm.seoKeywords && (
                      <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold text-muted">🏷️ Target Keywords:</span>
                        {editForm.seoKeywords.split(",").map((kw: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded text-[10px]">
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">MRP / Retail Price *</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                      required
                      value={editForm.mrp}
                      onChange={(e) => {
                        const rawVal = Math.max(0, parseFloat(e.target.value) || 0);
                        const newMrp = e.target.value === "" ? "" : rawVal.toString();
                        const mrpVal = parseFloat(newMrp);
                        const discountVal = parseFloat(editForm.discount) || 0;
                        let newPrice = editForm.price;
                        if (!isNaN(mrpVal)) {
                          newPrice = Math.round(mrpVal - (mrpVal * discountVal) / 100).toString();
                        }
                        setEditForm({ ...editForm, mrp: newMrp, price: newPrice });
                      }}
                      className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                      value={editForm.discount}
                      onChange={(e) => {
                        const rawVal = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                        const newDiscount = e.target.value === "" ? "" : rawVal.toString();
                        const discountVal = parseFloat(newDiscount) || 0;
                        const mrpVal = parseFloat(editForm.mrp);
                        let newPrice = editForm.price;
                        if (!isNaN(mrpVal)) {
                          newPrice = Math.round(mrpVal - (mrpVal * discountVal) / 100).toString();
                        }
                        setEditForm({ ...editForm, discount: newDiscount, price: newPrice });
                      }}
                      className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Calculated Price (INR)</label>
                    <input
                      type="number"
                      readOnly
                      value={editForm.price}
                      className="w-full bg-surface-hover cursor-not-allowed opacity-80 border border-border rounded-xl px-4 py-2 text-heading font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Custom Regional Pricing Grid for Edit Modal */}
                <div className="p-4 bg-surface border border-border rounded-xl space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-heading uppercase tracking-wider block">Custom Regional Retail Prices & Discounts</span>
                      <p className="text-[9px] text-muted mt-0.5">Customize MRP and discount % per country (falls back to global discount if empty).</p>
                    </div>
                    
                    {/* Selector to add custom country price in edit mode */}
                    <div className="flex gap-2 items-center">
                      <select
                        value={selectedCountryToEdit}
                        onChange={(e) => setSelectedCountryToEdit(e.target.value)}
                        className="bg-surface border border-border rounded-lg px-2 py-1 text-xs font-semibold text-heading focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Add Country --</option>
                        {Object.keys(currencyDatabase)
                          .filter(code => code !== "IN" && !editForm.prices?.[code])
                          .map(code => {
                            let countryName = code;
                            try { countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; } catch(e){}
                            return (
                              <option key={code} value={code}>
                                {countryName} ({code}) - {currencyDatabase[code].c} ({currencyDatabase[code].s})
                              </option>
                            );
                          })
                        }
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedCountryToEdit) {
                            setEditForm({
                              ...editForm,
                              prices: {
                                ...editForm.prices,
                                [selectedCountryToEdit]: { mrp: "", discount: "" }
                              }
                            });
                            setSelectedCountryToEdit("");
                          }
                        }}
                        className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {!editForm.prices || Object.keys(editForm.prices).length === 0 ? (
                    <p className="text-[9px] text-muted text-center py-2">No custom country prices added yet. Using standard INR exchange rates.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.keys(editForm.prices).map((code) => {
                        const config = currencyDatabase[code] || { c: "USD", s: "$" };
                        return (
                          <div key={code} className="bg-surface-card p-3 rounded-lg border border-border space-y-2 relative">
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...editForm.prices };
                                delete updated[code];
                                setEditForm({ ...editForm, prices: updated });
                              }}
                              className="absolute top-1.5 right-1.5 text-muted hover:text-red-500 transition-colors p-1"
                              title="Remove country pricing"
                            >
                              <X size={12} />
                            </button>

                            <div className="font-bold text-[10px] text-heading uppercase tracking-wider border-b border-border/50 pb-1">
                              <span>📍 {(()=>{try{return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;}catch(e){return code;}})()} - {config.c} ({config.s})</span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-bold text-muted uppercase tracking-wider block">MRP ({config.s})</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                  placeholder="Retail MRP"
                                  value={editForm.prices?.[code]?.mrp || ""}
                                  onChange={(e) => {
                                    const rawVal = Math.max(0, parseFloat(e.target.value) || 0);
                                    const cleanVal = e.target.value === "" ? "" : rawVal.toString();
                                    setEditForm({
                                      ...editForm,
                                      prices: {
                                        ...editForm.prices,
                                        [code]: { ...editForm.prices?.[code], mrp: cleanVal }
                                      }
                                    });
                                  }}
                                  className="w-full bg-surface border border-border focus:border-orange-500 rounded px-2 py-1 text-xs text-heading focus:outline-none"
                                />
                                {editForm.prices?.[code]?.mrp && !isNaN(parseFloat(editForm.prices[code].mrp)) && (
                                  <span className="text-[9px] text-orange-500 block font-bold mt-1">
                                    {new Intl.NumberFormat(code === 'IN' ? 'en-IN' : 'en-US', { style: 'currency', currency: config.c }).format(parseFloat(editForm.prices[code].mrp))}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-bold text-muted uppercase tracking-wider block">Discount (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="any"
                                  onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
                                  placeholder="Optional"
                                  value={editForm.prices?.[code]?.discount || ""}
                                  onChange={(e) => {
                                    const rawVal = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                                    const cleanVal = e.target.value === "" ? "" : rawVal.toString();
                                    setEditForm({
                                      ...editForm,
                                      prices: {
                                        ...editForm.prices,
                                        [code]: { ...editForm.prices?.[code], discount: cleanVal }
                                      }
                                    });
                                  }}
                                  className="w-full bg-surface border border-border focus:border-orange-500 rounded px-2 py-1 text-xs text-heading focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="font-bold text-muted uppercase tracking-wider">Store Category *</label>
                    {loadingCategories ? (
                      <div className="flex items-center gap-2 h-10 px-4 bg-surface border border-border rounded-xl">
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-orange-500" />
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Loading...</span>
                      </div>
                    ) : (
                      <select
                        value={editForm.categoryName}
                        onChange={(e) => setEditForm({ ...editForm, categoryName: e.target.value })}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-heading font-semibold focus:outline-none cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                      >
                        {dbCategories.filter((cat: any) => !vendor?.allowedCategories || vendor.allowedCategories.split(',').map((c:string)=>c.trim()).includes(cat.slug)).map((cat: any) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Material *</label>
                    <select
                      value={editForm.material}
                      onChange={(e) => setEditForm({ ...editForm, material: e.target.value })}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-heading font-semibold focus:outline-none cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Copper">Copper</option>
                      <option value="Brass">Brass</option>
                      <option value="Steel">Steel</option>
                      <option value="Ceramic">Ceramic</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      onKeyDown={(e) => ["-", "+", "e", "E", "."].includes(e.key) && e.preventDefault()}
                      required
                      value={editForm.stock}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setEditForm({ ...editForm, stock: e.target.value === "" ? "" : val.toString() });
                      }}
                      className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none"
                    />
                  </div>
                </div>

                {/* Status: Live and Disable toggle */}
                <div className="flex items-center gap-2 p-3 bg-surface border border-border rounded-xl">
                  <input
                    type="checkbox"
                    id="edit-product-active"
                    checked={editForm.active}
                    onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                    className="w-4 h-4 text-orange-500 border-border rounded focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="edit-product-active" className="font-bold text-heading cursor-pointer select-none">
                    Make this product listing Live (visible to public search and catalog)
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setModalEditProduct(null)}
                    className="px-4 py-2 text-muted hover:text-heading bg-surface hover:bg-surface-hover border border-border rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
                  >
                    {savingEdit ? "Saving Changes..." : "Save Product Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {modalTransaction && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-transparent border-b border-border/70 px-6 py-4">
              <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider">Transaction Details</h3>
            </div>
            <button
              onClick={() => setModalTransaction(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10 font-bold"
            >
              ✕
            </button>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Payment ID</span>
                <p className="font-mono text-sm bg-surface p-2 rounded-lg border border-border break-all">{modalTransaction.razorpayPaymentId || modalTransaction.paymentOrderId || modalTransaction.id || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Payment Method</span>
                  <p className="font-bold text-heading text-sm uppercase">{modalTransaction.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Payment Status</span>
                  <p className={`font-bold text-sm uppercase ${modalTransaction.paymentStatus === 'failed' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {modalTransaction.paymentStatus || 'PAID'}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Amount Paid</span>
                <p className="font-bold text-heading text-lg">₹{((modalTransaction.totalPaise || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Details Modal */}
      {modalShipping && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border-b border-border/70 px-6 py-4 flex justify-between items-center">
              <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider">Shipping Details</h3>
            </div>
            <button
              onClick={() => setModalShipping(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10 font-bold"
            >
              ✕
            </button>
            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
                  ) : (
                    <div className="w-full h-full bg-surface animate-pulse" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-heading text-lg">{modalShipping.shippingName}</h4>
                  <p className="text-xs text-muted">Order ID: {modalShipping.orderNumber || modalShipping.id}</p>
                </div>
              </div>
              
              <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Delivery Address</span>
                  <p className="text-sm font-semibold text-heading leading-relaxed">{modalShipping.shippingAddress}</p>
                  <p className="text-sm font-semibold text-heading">{modalShipping.shippingCity}, {modalShipping.shippingState} - {modalShipping.shippingPincode}</p>
                  <p className="text-sm font-semibold text-heading">{modalShipping.shippingCountry}</p>
                </div>
                <div className="w-full h-px bg-border my-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Phone</span>
                    <p className="text-sm font-semibold text-heading">{modalShipping.shippingPhone}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Email</span>
                    <p className="text-sm font-semibold text-heading truncate" title={modalShipping.userEmail}>{modalShipping.userEmail}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open("", "_blank", "width=800,height=600");
                    if (!printWindow) {
                      showToast("Please allow popups to print labels.", "error");
                      return;
                    }

                    const qrUrl = qrDataUrl;

                    const htmlContent = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>Shipping Label - ${modalShipping.orderNumber || modalShipping.id}</title>
                        <style>
                          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; margin: 0; color: #000; }
                          .label-container { border: 2px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
                          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 15px; }
                          .qr-code { width: 100px; height: 100px; }
                          .title { font-size: 24px; font-weight: bold; margin: 0; }
                          .order-id { font-size: 14px; color: #444; margin-top: 5px; }
                          .section { margin-bottom: 20px; }
                          .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
                          .address { font-size: 16px; line-height: 1.5; font-weight: bold; text-transform: uppercase; }
                          .address-details { font-size: 14px; line-height: 1.4; margin-top: 5px; }
                          .footer { font-size: 10px; text-align: center; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 10px; }
                        </style>
                      </head>
                      <body>
                        <div class="label-container">
                          <div class="header">
                            <div>
                              <h1 class="title">SHIPPING LABEL</h1>
                              <div class="order-id">Order ID: ${modalShipping.orderNumber || modalShipping.id}</div>
                              <div class="order-id">Date: ${new Date(modalShipping.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</div>
                            </div>
                            <img src="${qrUrl}" class="qr-code" alt="QR Code" />
                          </div>
                          
                          <div class="section">
                            <div class="section-title">SHIP TO</div>
                            <div class="address">${modalShipping.shippingName}</div>
                            <div class="address-details">
                              ${modalShipping.shippingAddress}<br/>
                              ${modalShipping.shippingCity}, ${modalShipping.shippingState} - ${modalShipping.shippingPincode}<br/>
                              ${modalShipping.shippingCountry}<br/><br/>
                              Phone: ${modalShipping.shippingPhone}<br/>
                              Email: ${modalShipping.userEmail}
                            </div>
                          </div>

                          <div class="section">
                            <div class="section-title">ITEMS</div>
                            <div class="address-details">
                              ${modalShipping.items && modalShipping.items.length > 0 ? modalShipping.items.map((i:any) => `<div>${i.quantity}x ${i.productName}</div>`).join("") : "Order Items"}
                            </div>
                          </div>

                          <div class="footer">
                            Generated via StopShop Vendor Portal
                          </div>
                        </div>
                        <script>
                          window.onload = function() { window.print(); }
                        </script>
                      </body>
                      </html>
                    `;

                    printWindow.document.open();
                    printWindow.document.write(htmlContent);
                    printWindow.document.close();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  Generate PDF & Print Label
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Return Modal */}
      {reviewReturnOrder && reviewReturnOrder.returnRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto py-6 sm:py-10">
          <div className="bg-surface-card border border-border rounded-3xl w-full max-w-2xl p-5 sm:p-6 space-y-5 shadow-2xl relative my-auto max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start">
               <div>
                  <h2 className="text-lg font-bold text-heading">Incoming Return Request</h2>
                  <p className="text-xs text-muted">Order #{reviewReturnOrder.orderNumber} • AWB: {reviewReturnOrder.awbCode}</p>
               </div>
               <button onClick={() => setReviewReturnOrder(null)} className="text-muted hover:text-heading bg-surface p-1.5 rounded-full border border-border">
                 <X size={16} />
               </button>
            </div>

            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl space-y-2">
               <div><span className="text-[10px] text-muted font-bold uppercase tracking-wider">Reason for Return</span></div>
               <div className="text-sm font-bold text-orange-500">{reviewReturnOrder.returnRequest.reason.replace(/_/g, " ")}</div>
               {reviewReturnOrder.returnRequest.reasonDetail && (
                  <div className="text-xs text-muted mt-2 p-3 bg-surface rounded-xl border border-border font-medium italic">"{reviewReturnOrder.returnRequest.reasonDetail}"</div>
               )}
            </div>

            {/* Returned Items */}
            <div className="space-y-3">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Items Being Returned</span>
              <div className="space-y-2">
                {(reviewReturnOrder.returnRequest?.returnItems || []).map((retItem: any, idx: number) => {
                  const orderItem = (reviewReturnOrder.items || []).find((i: any) => i.id === retItem.orderItemId);
                  if (!orderItem) return null;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
                      <div className="w-12 h-12 rounded-lg bg-white border border-border overflow-hidden shrink-0">
                        <img src={orderItem.productImage || "/logo4.jpg"} alt={orderItem.productName} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-heading text-xs truncate">{orderItem.productName}</h4>
                        <p className="text-[10px] text-muted mt-0.5">Returning: <span className="font-bold text-orange-500">{retItem.quantity} unit(s)</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {reviewReturnOrder.returnRequest.status === "RECEIVED_AT_WAREHOUSE" ? (
                <div className="pt-4 border-t border-border p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-center">
                   <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Dispute Raised Successfully</p>
                   <p className="text-[10px] text-muted mt-1 leading-relaxed">Our admin team is currently reviewing your dispute. No further action is required from your end.</p>
                </div>
             ) : (() => {
               const deliveredTime = reviewReturnOrder.returnRequest?.vendorDeliveredAt 
                 ? new Date(reviewReturnOrder.returnRequest.vendorDeliveredAt).getTime() 
                 : new Date(reviewReturnOrder.updatedAt || reviewReturnOrder.createdAt).getTime();
               const deadline = deliveredTime + (slaHours || 24) * 60 * 60 * 1000;
               const isExpired = deadline - (currentTime ? currentTime.getTime() : Date.now()) <= 0;
               if (isExpired) {
                 return (
                   <div className="pt-4 border-t border-border p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wider">⏰ SLA Window Expired</p>
                      <p className="text-[10px] text-muted mt-1 leading-relaxed">The {slaHours || 24}-hour SLA window for raising a QC dispute has expired. The system will process the refund automatically.</p>
                   </div>
                 );
               }
               return (
               <div className="pt-4 border-t border-border space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center">
                     <h3 className="text-sm font-bold text-red-500">Raise Dispute / Report Issue</h3>
                     <span className="text-[10px] text-muted font-semibold">Min 5 Photos Required</span>
                  </div>
                  <p className="text-xs text-muted">If the returned product is fake, wrong, or damaged, upload photos below and submit to admin. <strong className="text-heading">If the product is fine, close this window (auto-refund will process after SLA expires).</strong></p>
                  
                  <textarea 
                     placeholder="Describe what is wrong with the returned product..."
                     value={qcNotes} onChange={e=>setQcNotes(e.target.value)}
                     className="w-full p-3 text-xs bg-surface border border-border rounded-xl focus:border-red-500 outline-none transition-colors min-h-[80px]"
                  />

                  <div className="border border-dashed border-red-500/30 bg-red-500/5 rounded-xl p-4">
                     <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                           {Array.from({ length: 8 }).map((_, i) => {
                             const url = qcImages[i];
                             if (url) {
                               return (
                                 <div key={i} className="aspect-square rounded-md overflow-hidden relative group border border-border">
                                   <img src={url} alt="QC" className="w-full h-full object-cover" />
                                   <button 
                                     onClick={() => setQcImages(prev => prev.filter((_, idx) => idx !== i))}
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
                                 type="button"
                                 onClick={async () => {
                                   setQcCameraActive(true);
                                   try {
                                     let stream: MediaStream;
                                     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                                       setQcCameraError(true);
                                       return;
                                     }
                                     try {
                                       stream = await navigator.mediaDevices.getUserMedia({
                                         video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                                       });
                                     } catch (e1) {
                                       try {
                                         stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                                       } catch (e2) {
                                         stream = await navigator.mediaDevices.getUserMedia({ video: true });
                                       }
                                     }
                                     setQcCameraStream(stream);
                                   } catch (err) {
                                     console.error("QC Camera Error:", err);
                                     setQcCameraError(true);
                                   }
                                 }}
                                 className={`aspect-square rounded-md border border-dashed flex flex-col items-center justify-center text-[8px] font-bold text-muted transition-all hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 ${i < 5 ? 'border-red-500/30 bg-red-500/5 text-red-400' : 'border-border bg-surface'}`}
                               >
                                 <Camera size={12} className="mb-0.5" />
                                 {i < 5 ? "Req" : "Opt"}
                               </button>
                             );
                           })}
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-red-500/10">
                           <span className={`text-[10px] font-bold ${qcImages.length >= 5 ? 'text-emerald-500' : 'text-red-500'}`}>{qcImages.length}/8 Photos</span>
                           <label className={`text-[10px] font-bold text-red-500 cursor-pointer hover:underline flex items-center gap-1 ${uploadingQc ? 'opacity-50' : ''}`}>
                              {uploadingQc ? 'Uploading...' : 'Or Upload Files'}
                              <input type="file" multiple accept="image/*" onChange={(e) => { handleUploadQcImage(e.target.files); e.target.value = ""; }} className="hidden" disabled={uploadingQc} />
                           </label>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => handleQcSubmit("QC_UPLOAD")}
                     disabled={submittingQc || qcImages.length < 5}
                     className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                     {submittingQc && <Loader2 size={16} className="animate-spin" />} Submit Dispute to Admin
                  </button>
               </div>
               );
            })()}
          </div>
        </div>
      )}

      {/* QC Camera Modal */}
      {qcCameraActive && (
        <div className="fixed inset-0 z-[250] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 w-full z-10">
            <button onClick={() => {
              if (qcCameraStream) {
                qcCameraStream.getTracks().forEach(t => t.stop());
                setQcCameraStream(null);
              }
              setQcCameraActive(false);
            }} className="text-white bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
              <X size={24} />
            </button>
             <div className="flex items-center gap-2">
               <label className="text-white bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5 hover:bg-white/30 transition-colors cursor-pointer">
                 <Camera size={14} /> Native Camera
                 <input 
                   type="file" 
                   accept="image/*" 
                   capture="environment" 
                   onChange={(e) => {
                     if (e.target.files && e.target.files[0]) {
                       handleUploadQcImage([e.target.files[0]]);
                       if (qcCameraStream) {
                         qcCameraStream.getTracks().forEach(t => t.stop());
                         setQcCameraStream(null);
                       }
                       setQcCameraActive(false);
                     }
                     e.target.value = "";
                   }} 
                   className="hidden" 
                 />
               </label>
               <button 
                 onClick={() => {
                   const video = document.getElementById("qc-camera-video") as HTMLVideoElement;
                   if (video && video.srcObject) {
                     const stream = video.srcObject as MediaStream;
                     const track = stream.getVideoTracks()[0];
                     const currentFacing = track.getSettings().facingMode;
                     stream.getTracks().forEach(t => t.stop());
                     navigator.mediaDevices.getUserMedia({ 
                       video: { facingMode: currentFacing === "environment" ? "user" : "environment" } 
                     }).then(newStream => {
                       setQcCameraStream(newStream);
                       video.srcObject = newStream;
                       video.play().catch(() => {});
                     }).catch(console.error);
                   }
                 }} 
                 className="text-white bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5 hover:bg-white/30 transition-colors"
               >
                 <Camera size={14} /> Switch
               </button>
             </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
            {qcCameraError ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Camera size={32} />
                </div>
                <h4 className="text-base font-bold">Camera Stream Unavailable</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  WebRTC stream blocked or browser permission denied. You can snap a photo directly using your phone's camera app below!
                </p>
                <label className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95">
                  <Camera size={16} />
                  <span>Snap Photo with Phone Camera</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadQcImage([e.target.files[0]]);
                        if (qcCameraStream) {
                          qcCameraStream.getTracks().forEach(t => t.stop());
                          setQcCameraStream(null);
                        }
                        setQcCameraActive(false);
                      }
                      e.target.value = "";
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <video 
                id="qc-camera-video"
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover" 
              />
            )}
            <canvas id="qc-camera-canvas" className="hidden" />
          </div>
          <div className="p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 w-full flex justify-center z-10">
            <button 
              onClick={() => {
                const video = document.getElementById("qc-camera-video") as HTMLVideoElement;
                const canvas = document.getElementById("qc-camera-canvas") as HTMLCanvasElement;
                if (!video || !canvas || !video.videoWidth) return;
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob((blob) => {
                  if (!blob) return;
                  const file = new File([blob], `qc-${Date.now()}.jpg`, { type: "image/jpeg" });
                  
                  // Stop camera
                  if (qcCameraStream) {
                    qcCameraStream.getTracks().forEach(t => t.stop());
                    setQcCameraStream(null);
                  }
                  
                  // Upload
                  handleUploadQcImage([file]);
                  setQcCameraActive(false);
                }, "image/jpeg", 0.7);
              }} 
              className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/50 hover:bg-white/50 hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
            </button>
          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      {activeCameraItem !== null && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 w-full z-10">
            <button onClick={() => {
              if (activeCameraStream) {
                activeCameraStream.getTracks().forEach(t => t.stop());
                setActiveCameraStream(null);
              }
              setActiveCameraItem(null);
            }} className="text-white bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors">
              <X size={24} />
            </button>
             <div className="flex items-center gap-2">
               <label className="text-white bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5 hover:bg-white/30 transition-colors cursor-pointer">
                 <Camera size={14} /> Native Camera
                 <input 
                   type="file" 
                   accept="image/*" 
                   capture="environment" 
                   onChange={(e) => {
                     if (e.target.files && e.target.files[0]) {
                        handleUploadPackingImage([e.target.files[0]], activeCameraItem);
                       if (activeCameraStream) {
                         activeCameraStream.getTracks().forEach(t => t.stop());
                         setActiveCameraStream(null);
                       }
                       setActiveCameraItem(null);
                     }
                     e.target.value = "";
                   }} 
                   className="hidden" 
                 />
               </label>
               <button 
                 onClick={() => {
                   const video = document.getElementById("live-camera-video") as HTMLVideoElement;
                   if (video && video.srcObject) {
                     const stream = video.srcObject as MediaStream;
                     const track = stream.getVideoTracks()[0];
                     const currentFacing = track.getSettings().facingMode;
                     stream.getTracks().forEach(t => t.stop());
                     navigator.mediaDevices.getUserMedia({ 
                       video: { facingMode: currentFacing === "environment" ? "user" : "environment" } 
                     }).then(newStream => {
                       setActiveCameraStream(newStream);
                       video.srcObject = newStream;
                       video.play().catch(() => {});
                     }).catch(console.error);
                   }
                 }} 
                 className="text-white bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5 hover:bg-white/30 transition-colors"
               >
                 <Camera size={14} /> Switch
               </button>
             </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
            {liveCameraError ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Camera size={32} />
                </div>
                <h4 className="text-base font-bold">Camera Stream Unavailable</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  WebRTC stream blocked or browser permission denied. You can snap a photo directly using your phone's camera app below!
                </p>
                <label className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95">
                  <Camera size={16} />
                  <span>Snap Photo with Phone Camera</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadPackingImage([e.target.files[0]], activeCameraItem);
                        if (activeCameraStream) {
                          activeCameraStream.getTracks().forEach(t => t.stop());
                          setActiveCameraStream(null);
                        }
                        setActiveCameraItem(null);
                      }
                      e.target.value = "";
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <video 
                id="live-camera-video"
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover" 
              />
            )}
            <canvas id="live-camera-canvas" className="hidden" />
          </div>
          <div className="p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 w-full flex justify-center z-10">
            <button 
              onClick={(e) => {
                const btn = e.currentTarget;
                if (btn.disabled) return;
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.style.transform = "scale(0.95)";

                const video = document.getElementById("live-camera-video") as HTMLVideoElement;
                const canvas = document.getElementById("live-camera-canvas") as HTMLCanvasElement;
                if (!video || !canvas || !video.videoWidth) {
                  btn.disabled = false;
                  btn.style.opacity = "1";
                  btn.style.transform = "";
                  return;
                }
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                  btn.disabled = false;
                  btn.style.opacity = "1";
                  btn.style.transform = "";
                  return;
                }
                
                // Draw current frame
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convert to compressed JPEG (0.7 quality)
                canvas.toBlob((blob) => {
                  btn.disabled = false;
                  btn.style.opacity = "1";
                  btn.style.transform = "";
                  
                  if (!blob) return;
                  const file = new File([blob], `dispatch-${Date.now()}.jpg`, { type: "image/jpeg" });
                  
                  // Stop camera
                  if (activeCameraStream) {
                    activeCameraStream.getTracks().forEach(t => t.stop());
                    setActiveCameraStream(null);
                  }
                  
                  // Upload
                  handleUploadPackingImage([file], activeCameraItem);
                  setActiveCameraItem(null);
                }, "image/jpeg", 0.7);
              }} 
              className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/50 hover:bg-white/50 hover:scale-105 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
            </button>
          </div>
        </div>
      )}

      {/* Premium Toast Notification Container */}
      <div className="fixed bottom-6 left-4 right-4 md:bottom-auto md:top-6 md:right-6 md:left-auto z-[250] flex flex-col gap-3 pointer-events-none max-w-sm mx-auto md:mx-0 w-[calc(100%-32px)] sm:w-full">
        <AnimatePresence>
          {toasts.slice(0, 1).map((toast) => {
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
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
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

      {/* Delete Product Modal */}
      <AnimatePresence>
        {deleteProductModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface-card border border-border w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Delete Product</h3>
              <p className="text-sm text-muted mb-6">Are you sure you want to remove this product listing from StopShop? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteProductModal(null)} className="px-5 py-2.5 bg-surface border border-border hover:border-muted text-heading text-sm font-bold rounded-xl transition-all">Cancel</button>
                <button onClick={() => { handleDeleteProduct(deleteProductModal); setDeleteProductModal(null); }} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Return QC Modal */}
      <AnimatePresence>
        {approveReturnModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface-card border border-border w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Pass Return QC</h3>
              <p className="text-sm text-muted mb-6">Are you sure the item is intact and you want to pass Quality Check for Order #{approveReturnModal.orderNumber}?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setApproveReturnModal(null)} className="px-5 py-2.5 bg-surface border border-border hover:border-muted text-heading text-sm font-bold rounded-xl transition-all">Cancel</button>
                <button onClick={() => { handleReturnAction(approveReturnModal.id, "RETURN_APPROVED"); setApproveReturnModal(null); }} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all">Approve QC</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Studio QR Modal */}
      {showMobileQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border/80 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative animate-in zoom-in-95">
            <button
              onClick={() => setShowMobileQR(false)}
              className="absolute top-4 right-4 p-2 text-muted hover:text-heading bg-surface-card rounded-full cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold font-display text-heading mb-2">Scan to Open on Mobile</h3>
            <p className="text-sm text-muted mb-6">Point your phone's camera at this QR code to open the Mobile Camera Studio directly.</p>
            {mobileQRUrl && (
              <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-4 border border-border shadow-inner">
                <img src={mobileQRUrl} alt="Mobile Studio QR" className="w-48 h-48 mx-auto" />
              </div>
            )}
            <p className="text-xs text-orange-500 font-bold bg-orange-500/10 py-2 px-4 rounded-xl inline-block">Make sure phone & laptop are on same Wi-Fi</p>
          </div>
        </div>
      )}
    </div>
  );
};
