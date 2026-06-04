"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Store, LogOut, CheckCircle, Mail, Phone, MapPin, Package, Award, CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { currencyDatabase } from "@/context/RegionContext";

export const VendorDashboard = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [vendor, setVendor] = useState<any>(null);

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

  // Dashboard Data
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  const [modalMessage, setModalMessage] = useState<any | null>(null);
  const [editStockValue, setEditStockValue] = useState("");
  const [updatingStock, setUpdatingStock] = useState(false);
  const [activeTab, setActiveTab] = useState<"inquiries" | "history" | "products" | "add-product" | "admin-panel" | "direct-orders">("inquiries");
  const [allInquiries, setAllInquiries] = useState<any[]>([]);
  const [editingDelivery, setEditingDelivery] = useState<{ inquiryId: number, productId: number, value: string } | null>(null);
  const [editingDirectDelivery, setEditingDirectDelivery] = useState<{ orderId: string, value: string } | null>(null);
  const [directOrders, setDirectOrders] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Edit Product Modal states & handlers
  const [modalEditProduct, setModalEditProduct] = useState<any | null>(null);
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
      weightValue: weightVal,
      weightUnit: weightUnitVal,
      customSpecs: parsedCustomSpecs,
      piecesValue: piecesVal,
      combo: comboVal,
      capacity: capacityVal,
      thickness: thicknessVal,
      finish: finishVal,
      image: prod.image,
      images: additionalImages,
      price: prod.price.toString(),
      mrp: prod.mrp.toString(),
      discount: prod.discount.toString(),
      prices: pricesVal,
      categoryName: prod.categoryName,
      material: prod.material,
      stock: prod.stock.toString(),
      featured: !!prod.featured,
      newLaunch: !!prod.newLaunch,
      active: prod.active !== false,
    });
    setModalEditProduct(prod);
  };

  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditForm((prev) => ({ ...prev, image: data.url }));
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
        newLaunch: editForm.newLaunch,
        active: editForm.active,
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
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
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
      const uploadPromises = fileArray.map(async (file, idx) => {
        const formData = new FormData();
        formData.append("file", file);
        
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
      showToast("Gallery images uploaded successfully!", "success");
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      showToast(err.message || "Error uploading gallery images", "error");
    } finally {
      setUploadingGallery(false);
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
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          if (data.user.role === "vendor") {
            setAuthorized(true);
            setVendor(data.user);
            fetchData(data.user.id);
          } else {
            window.location.href = "/profile";
          }
        } else {
          setAuthorized(false);
          window.location.href = "/vendor/login";
        }
      } else {
        setAuthorized(false);
        window.location.href = "/vendor/login";
      }
    } catch (e) {
      setAuthorized(false);
      window.location.href = "/vendor/login";
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

  const fetchData = async (vendorId: number) => {
    try {
      // Fetch categories
      setLoadingCategories(true);
      const resCat = await fetch("/api/categories");
      if (resCat.ok) {
        const dataCat = await resCat.json();
        setDbCategories(dataCat);
        if (dataCat.length > 0) {
          setProductForm(prev => ({ ...prev, categoryName: dataCat[0].slug }));
          setEditForm(prev => ({ ...prev, categoryName: dataCat[0].slug }));
        }
      }
      setLoadingCategories(false);

      // Fetch vendor's own products
      const resProd = await fetch(`/api/products?vendorId=${vendorId}`);
      if (resProd.ok) {
        const dataProd = await resProd.json();
        setProducts(dataProd);

        // Fetch B2B inquiries and filter to show only those containing this vendor's products
        const resInq = await fetch("/api/inquiries");
        if (resInq.ok) {
          const allInqs = await resInq.json();
          setAllInquiries(allInqs);
          
          // Filter inquiries: show if it contains any product belonging to the vendor
          const filteredInq = allInqs.filter((inq: any) => {
            if (!inq.items) return false;
            try {
              const itemsList = inq.items as any[];
              return itemsList.some((item: any) => 
                dataProd.some((p: any) => String(p.id) === String(item.id))
              );
            } catch (e) {
              return false;
            }
          });
          setInquiries(filteredInq);
        }

        // Fetch direct orders
        const resOrders = await fetch(`/api/orders?vendorId=${vendorId}`);
        if (resOrders.ok) {
          const dataOrders = await resOrders.json();
          setDirectOrders(dataOrders);
        }
      }
    } catch (e) {
      console.error("Failed to load vendor dashboard details:", e);
      setLoadingCategories(false);
    }
  };

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
        featured: productForm.featured,
        newLaunch: productForm.newLaunch,
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
    if (!confirm("Remove this product listing from StopShop?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Listing removed!", "success");
        if (vendor) fetchData(vendor.id);
      } else {
        showToast("Failed to remove product listing", "error");
      }
    } catch (err) {
      showToast("Error removing listing", "error");
    }
  };

  const handleUpdateItemStatus = async (inquiryId: number, productId: number, status: string, deliveryDate?: string) => {
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
    }
  };

  const handleUpdateDirectOrderStatus = async (orderId: string, status: string, deliveryDate?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, deliveryDate }),
      });

      if (res.ok) {
        showToast("Order status updated successfully!", "success");
        if (vendor) fetchData(vendor.id);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update order status", "error");
      }
    } catch (err) {
      showToast("Error updating order status", "error");
    }
  };

  const getUnitsSold = (productId: number) => {
    let count = 0;
    inquiries.forEach((inq) => {
      if (inq.items) {
        try {
          const list = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
          list.forEach((item: any) => {
            if (item.id === productId && item.status === "DELIVERED") {
              count += 1;
            }
          });
        } catch (e) {}
      }
    });
    return count;
  };

  const openProductModal = (prod: any) => {
    setModalProduct(prod);
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

  if (authorized === null) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Pre-calculate tab inquiry counts
  const activeInquiriesCount = inquiries.flatMap((inq) => {
    try {
      const itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
      return itemsList.filter((item: any) =>
        products.some((p) => String(p.id) === String(item.id)) && !["DELIVERED", "CANCELLED", "RETURNED"].includes(item.status || "PENDING")
      );
    } catch (e) {
      return [];
    }
  }).length;

  const historyInquiriesCount = inquiries.flatMap((inq) => {
    try {
      const itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
      return itemsList.filter((item: any) =>
        products.some((p) => String(p.id) === String(item.id)) && ["DELIVERED", "CANCELLED", "RETURNED"].includes(item.status || "PENDING")
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
        itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
      } catch (e) {}

      itemsList.forEach((item: any) => {
        const belongsToVendor = products.some((p) => String(p.id) === String(item.id));
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

  const generalInquiries = allInquiries.filter((inq) => {
    try {
      const itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
      return itemsList.length === 0;
    } catch (e) {
      return true;
    }
  });

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
                  <button 
                    onClick={() => {
                      const newName = prompt("Enter your Workshop / Business Name:", vendor.name);
                      if (newName && newName.trim() !== "" && newName !== vendor.name) {
                        handleUpdateVendorName(newName);
                      }
                    }}
                    className="text-[10px] text-orange-400 hover:text-orange-300 font-bold border border-orange-500/25 hover:border-orange-500/50 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-orange-500/10"
                  >
                    Edit Name
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-zinc-400">{vendor.email}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold text-orange-400 uppercase tracking-wider">✦ Artisan Vendor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Navigation Tabs Wrapper */}
      <div className="sticky top-[56px] lg:top-[80px] z-30 bg-surface/95 supports-[backdrop-filter]:bg-surface/80 supports-[backdrop-filter]:backdrop-blur-xl shadow-sm border-b border-border/60 mt-4">
        {/* Navigation Tabs */}
        <div className="max-w-[95%] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 py-3 overflow-x-auto whitespace-nowrap scrollbar-none">
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
              Orders ({directOrders.filter(o => !["DELIVERED", "CANCELLED", "RETURNED"].includes(o.status || "PENDING")).length})
              {activeTab === "direct-orders" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "history" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Order History ({historyInquiriesCount + directOrders.filter(o => ["DELIVERED", "CANCELLED", "RETURNED"].includes(o.status || "PENDING")).length})
              {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
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
              onClick={() => setActiveTab("admin-panel")}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "admin-panel" ? "text-orange-500" : "text-muted hover:text-heading"
              }`}
            >
              Admin Panel ({generalInquiries.length})
              {activeTab === "admin-panel" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[95%] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">  {/* Tab Contents */}
        {activeTab === "direct-orders" && (
          <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md animate-in fade-in duration-300 relative">
            <div className="bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border-b border-border/70 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  Direct Orders & Transactions
                </h3>
                <p className="text-[10px] text-muted mt-0.5">Manage automated checkout orders, payments, and dispatch dates</p>
              </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-surface/50 border-b border-border/80 text-xs">
              <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Today's Orders</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold font-display text-heading tracking-tight">
                    {(() => {
                      const startOfToday = new Date();
                      startOfToday.setHours(0, 0, 0, 0);
                      return directOrders.filter(o => new Date(o.createdAt).getTime() >= startOfToday.getTime()).length;
                    })()}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 text-orange-500 rounded-md font-bold uppercase">Today</span>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Today Packed</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold font-display text-heading tracking-tight">
                    {directOrders.filter(o => o.status === "PACKED").length}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] bg-blue-500/10 text-blue-500 rounded-md font-bold uppercase">Packed</span>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Delivered</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold font-display text-heading tracking-tight">
                    {directOrders.filter(o => o.status === "DELIVERED").length}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-600 rounded-md font-bold uppercase">Delivered</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
                    <th className="px-5 py-4 font-bold">Order Date</th>
                    <th className="px-5 py-4 font-bold min-w-[200px]">Buyer & Transaction</th>
                    <th className="px-5 py-4 font-bold min-w-[220px]">Product details</th>
                    <th className="px-5 py-4 font-bold text-center">Amount Paid</th>
                    <th className="px-5 py-4 font-bold text-center min-w-[210px]">Shipping Stage</th>
                    <th className="px-5 py-4 font-bold text-right min-w-[280px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {(() => {
                    const activeDirects = directOrders.filter((o) => 
                      !["DELIVERED", "CANCELLED", "RETURNED"].includes(o.status || "PENDING")
                    );

                    if (activeDirects.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-muted text-sm">
                            No active "Buy Now" orders found.
                          </td>
                        </tr>
                      );
                    }

                    return activeDirects.map((order) => {
                      const currentStatus = order.status || "PENDING";
                      return (
                        <tr key={order.id} className="hover:bg-orange-500/[0.03] transition-all duration-200 text-body align-middle group/row">
                          {/* Order Date */}
                          <td className="px-5 py-4 whitespace-nowrap text-muted font-semibold text-[11px]">
                            {new Date(order.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                          </td>

                          {/* Buyer & Transaction */}
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5 max-w-[260px] min-w-[160px]">
                              <span className="font-bold text-heading text-xs tracking-tight">{order.shippingName}</span>
                              <span className="text-[10px] text-muted font-medium flex flex-wrap gap-1">
                                📍 {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                              </span>
                              <span className="text-[10px] text-muted/80 truncate">✉️ {order.userEmail}</span>
                              <span className="text-[10px] text-muted/80">📞 {order.shippingPhone}</span>
                              <span className="mt-1 inline-flex self-start items-center gap-1 bg-surface border border-border px-1.5 py-0.5 rounded text-[8px] font-mono text-muted/95 uppercase">
                                ID: {order.paymentId}
                              </span>
                            </div>
                          </td>

                          {/* Product Details */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/60 bg-white flex-shrink-0 relative shadow-sm">
                                <img src={order.productImage || "/logo4.jpg"} alt={order.productName} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                                <span className="font-bold text-heading text-xs truncate" title={order.productName}>
                                  {order.productName}
                                </span>
                                <div className="flex gap-1.5 items-center mt-0.5">
                                  <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded text-[9px]">
                                    Qty: {order.quantity}
                                  </span>
                                  <span className="text-[10px] text-muted font-medium">{order.productMaterial || "Bronze"}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Amount Paid */}
                          <td className="p-4 text-center whitespace-nowrap">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-heading text-xs">₹{order.totalAmount.toLocaleString()}</span>
                              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase mt-0.5">
                                {order.paymentStatus || "PAID"}
                              </span>
                            </div>
                          </td>

                          {/* Shipping Stage */}
                          <td className="p-4 text-center min-w-[210px]">
                            <div className="flex flex-col items-center gap-2">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                                currentStatus === "PENDING" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/25" :
                                currentStatus === "PACKED" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25" :
                                "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25"
                              }`}>
                                {currentStatus === "PENDING" ? "Ordered / Paid" : currentStatus}
                              </span>

                              {["PACKED", "DISPATCHED"].includes(currentStatus) && (
                                <div className="w-full max-w-[190px] flex flex-col items-center gap-1.5">
                                  {editingDirectDelivery && editingDirectDelivery.orderId === order.id ? (
                                    <div className="flex flex-col gap-1.5 w-full bg-surface-card border border-border p-2.5 rounded-2xl shadow-xl z-15 relative">
                                      <span className="text-[8px] text-muted font-bold uppercase tracking-wider block text-left">Set Est. Delivery:</span>
                                      <input
                                        type="datetime-local"
                                        min={(() => {
                                          const now = new Date();
                                          const tzOffset = now.getTimezoneOffset() * 60000;
                                          return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
                                        })()}
                                        value={editingDirectDelivery.value}
                                        onChange={(e) => setEditingDirectDelivery(editingDirectDelivery ? { ...editingDirectDelivery, value: e.target.value } : null)}
                                        className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-[10px] text-heading font-medium outline-none focus:border-orange-500 transition-colors"
                                      />
                                      <div className="flex gap-1.5 justify-end mt-1">
                                        <button
                                          type="button"
                                          onClick={() => setEditingDirectDelivery(null)}
                                          className="px-2 py-1 text-[9px] text-muted hover:text-heading bg-surface hover:bg-surface-hover border border-border rounded-lg font-semibold transition-all"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (editingDirectDelivery) {
                                              handleUpdateDirectOrderStatus(order.id, currentStatus, editingDirectDelivery.value);
                                              setEditingDirectDelivery(null);
                                            }
                                          }}
                                          className="px-2.5 py-1 text-[9px] text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition-all shadow-sm shadow-orange-500/10"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-1 w-full">
                                      {order.deliveryDate ? (
                                        <div className="flex flex-col items-center gap-0.5">
                                          <span className="text-[8px] text-muted font-bold uppercase tracking-wider">Est. Delivery:</span>
                                          <span className="text-[10px] text-heading font-semibold bg-surface border border-border px-2 py-0.5 rounded-lg whitespace-nowrap">
                                            {formatDateTime(order.deliveryDate)}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => setEditingDirectDelivery({ orderId: order.id, value: order.deliveryDate || "" })}
                                            className="mt-1 text-[9px] text-orange-500 hover:text-orange-600 font-bold transition-colors underline"
                                          >
                                            Change Date
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setEditingDirectDelivery({ orderId: order.id, value: "" })}
                                          className="w-full py-1.5 px-3 text-[10px] font-bold text-orange-500 border border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/5 rounded-lg transition-all shadow-sm"
                                        >
                                          Set Delivery Date
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right whitespace-nowrap space-x-2">
                            {currentStatus === "PENDING" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateDirectOrderStatus(order.id, "PACKED")}
                                className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-bold shadow-sm shadow-blue-500/10 transition-all duration-200"
                              >
                                Start Packing
                              </button>
                            )}
                            {currentStatus === "PACKED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateDirectOrderStatus(order.id, "DISPATCHED")}
                                className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl font-bold shadow-sm shadow-orange-500/10 transition-all duration-200"
                              >
                                Dispatch Order
                              </button>
                            )}
                            {currentStatus === "DISPATCHED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateDirectOrderStatus(order.id, "DELIVERED")}
                                className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl font-bold shadow-sm shadow-emerald-500/10 transition-all duration-200"
                              >
                                Mark Delivered
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleUpdateDirectOrderStatus(order.id, "CANCELLED")}
                              className="px-3 py-1.5 text-[10px] text-red-500 hover:text-white border border-red-500/20 hover:bg-red-500 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-red-500/10"
                            >
                              Cancel Order
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md animate-in fade-in duration-300 relative">
            <div className="bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border-b border-border/70 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  Active Orders & Production Pipeline
                </h3>
                <p className="text-[10px] text-muted mt-0.5">Real-time status updates and order tracking</p>
              </div>
            </div>
            
            {/* Stats Cards Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-surface/50 border-b border-border/80">
              {/* Today's Orders */}
              <div className="bg-gradient-to-br from-orange-500/[0.04] to-transparent dark:from-orange-500/[0.08] border border-orange-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-orange-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Received Today</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.todayOrders}</span>
                  <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 text-orange-500 rounded-md font-bold uppercase tracking-wider">Today</span>
                </div>
              </div>

              {/* Active Quote Requests */}
              <div className="bg-gradient-to-br from-blue-500/[0.04] to-transparent dark:from-blue-500/[0.08] border border-blue-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-blue-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Pending Quotes</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.activeQuotes}</span>
                  <span className="px-2 py-0.5 text-[9px] bg-blue-500/10 text-blue-500 rounded-md font-bold uppercase tracking-wider">Inquiries</span>
                </div>
              </div>

              {/* Total Orders Received */}
              <div className="bg-gradient-to-br from-purple-500/[0.04] to-transparent dark:from-purple-500/[0.08] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-purple-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Orders</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.totalReceived}</span>
                  <span className="px-2 py-0.5 text-[9px] bg-purple-500/10 text-purple-500 rounded-md font-bold uppercase tracking-wider">All-Time</span>
                </div>
              </div>

              {/* Completed / Delivered */}
              <div className="bg-gradient-to-br from-emerald-500/[0.04] to-transparent dark:from-emerald-500/[0.08] border border-emerald-500/15 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Delivered</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold font-display text-heading tracking-tight">{stats.deliveredCount}</span>
                  <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-500 rounded-md font-bold uppercase tracking-wider">Shipped</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
                    <th className="px-5 py-4 font-bold">Date</th>
                    <th className="px-5 py-4 font-bold min-w-[180px]">Buyer Details</th>
                    <th className="px-5 py-4 font-bold min-w-[200px]">Product Requested</th>
                    <th className="px-5 py-4 font-bold text-center">Order Type</th>
                    <th className="px-5 py-4 font-bold text-center min-w-[210px]">Current Stage</th>
                    <th className="px-5 py-4 font-bold text-center">Buyer Message</th>
                    <th className="px-5 py-4 font-bold text-right min-w-[280px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {(() => {
                    let activeCount = 0;
                    const rows = inquiries.flatMap((inq) => {
                      const itemsList = (inq.items as any[]).filter((item: any) =>
                        products.some((p) => String(p.id) === String(item.id))
                      );
                      
                      return itemsList.map((item: any, idx: number) => {
                        const originalProduct = products.find((p) => String(p.id) === String(item.id));
                        const imgUrl = originalProduct?.image || item.image || "/logo4.jpg";
                        const currentStatus = item.status || "PENDING";
                        
                        // Filter out archive states
                        if (["DELIVERED", "CANCELLED", "RETURNED"].includes(currentStatus)) {
                          return null;
                        }
                        
                        activeCount++;
                        return (
                          <tr key={`${inq.id}-${item.id}-${idx}`} className="hover:bg-orange-500/[0.03] transition-all duration-200 text-body align-middle group/row">
                            {/* Date */}
                            <td className="px-5 py-4 whitespace-nowrap text-muted font-semibold text-[11px]">
                              {new Date(inq.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                            </td>
                            
                            {/* Buyer Details */}
                            <td className="p-4">
                              <div className="flex flex-col gap-0.5 max-w-[260px] min-w-[160px]">
                                <span className="font-bold text-heading text-xs tracking-tight">{inq.name}</span>
                                <span className="text-[10px] text-muted font-medium flex items-center gap-1">
                                  📍 {inq.country || "Domestic"} {inq.companyName ? `| ${inq.companyName}` : ""}
                                </span>
                                <span className="text-[10px] text-muted/80 truncate">✉️ {inq.email}</span>
                                <span className="text-[10px] text-muted/80">📞 {inq.phone}</span>
                              </div>
                            </td>
                            
                            {/* Product Requested */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/60 bg-white flex-shrink-0 relative shadow-sm">
                                  <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                                  <span className="font-bold text-heading text-xs truncate" title={originalProduct?.name || item.name}>
                                    {originalProduct?.name || item.name}
                                  </span>
                                  <div className="flex gap-1.5 items-center mt-0.5">
                                    <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold px-1.5 py-0.5 rounded text-[9px]">#{item.id}</span>
                                    <span className="text-[10px] text-muted font-medium">{originalProduct?.material || item.material || "Bronze"}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Order Type */}
                            <td className="p-4 text-center whitespace-nowrap">
                              <span className={`inline-block whitespace-nowrap text-[10px] font-bold px-2.5 py-1 rounded-full ${(item.orderType || "Bulk Order") === "Single Item" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"}`}>
                                {item.orderType || "Bulk Order"}
                              </span>
                            </td>
                            
                            {/* Current Stage */}
                            <td className="p-4 text-center min-w-[210px]">
                              <div className="flex flex-col items-center gap-2">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                                  currentStatus === "PENDING" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/25" :
                                  currentStatus === "PACKED" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25" :
                                  "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25"
                                }`}>
                                  {currentStatus === "PENDING" ? "Inquiry / Pending" : currentStatus}
                                </span>
                                
                                {["PACKED", "DISPATCHED"].includes(currentStatus) && (
                                  <div className="w-full max-w-[190px] flex flex-col items-center gap-1.5 animate-in fade-in duration-200">
                                    {editingDelivery && editingDelivery.inquiryId === inq.id && editingDelivery.productId === item.id ? (
                                      <div className="flex flex-col gap-1.5 w-full bg-surface-card border border-border p-2.5 rounded-2xl shadow-xl z-15 relative">
                                        <span className="text-[8px] text-muted font-bold uppercase tracking-wider block text-left">Set Est. Delivery:</span>
                                        <input
                                          type="datetime-local"
                                          min={(() => {
                                            const now = new Date();
                                            const tzOffset = now.getTimezoneOffset() * 60000;
                                            return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
                                          })()}
                                          value={editingDelivery.value}
                                          onChange={(e) => setEditingDelivery(editingDelivery ? { ...editingDelivery, value: e.target.value } : null)}
                                          className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-[10px] text-heading font-medium outline-none focus:border-orange-500 transition-colors"
                                        />
                                        <div className="flex gap-1.5 justify-end mt-1">
                                          <button
                                            type="button"
                                            onClick={() => setEditingDelivery(null)}
                                            className="px-2 py-1 text-[9px] text-muted hover:text-heading bg-surface hover:bg-surface-hover border border-border rounded-lg font-semibold transition-all"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (editingDelivery) {
                                                handleUpdateItemStatus(inq.id, item.id, currentStatus, editingDelivery.value);
                                                setEditingDelivery(null);
                                              }
                                            }}
                                            className="px-2.5 py-1 text-[9px] text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition-all shadow-sm shadow-orange-500/10"
                                          >
                                            Done
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center gap-1 w-full">
                                        {item.deliveryDate ? (
                                          <div className="flex flex-col items-center gap-0.5">
                                            <span className="text-[8px] text-muted font-bold uppercase tracking-wider">Est. Delivery:</span>
                                            <span className="text-[10px] text-heading font-semibold bg-surface border border-border px-2 py-0.5 rounded-lg whitespace-nowrap">
                                              {formatDateTime(item.deliveryDate)}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => setEditingDelivery({ inquiryId: inq.id, productId: item.id, value: item.deliveryDate || "" })}
                                              className="mt-1 text-[9px] text-orange-500 hover:text-orange-600 font-bold transition-colors underline"
                                            >
                                              Change Date
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => setEditingDelivery({ inquiryId: inq.id, productId: item.id, value: "" })}
                                            className="w-full py-1.5 px-3 text-[10px] font-bold text-orange-500 border border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/5 rounded-lg transition-all shadow-sm"
                                          >
                                            Set Delivery Date
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            
                            {/* Message */}
                            <td className="p-4 text-center">
                              <button type="button" onClick={() => setModalMessage(inq)} className="px-3 py-1.5 text-xs bg-surface hover:bg-surface-hover text-heading border border-border rounded-xl font-bold transition-all shadow-sm">
                                Read
                              </button>
                            </td>
                            
                            {/* Action Pipeline */}
                            <td className="p-4 text-right whitespace-nowrap space-x-2">
                              {originalProduct && (
                                <>
                                  <button type="button" onClick={() => openProductModal(originalProduct)} className="px-3 py-1.5 text-[10px] text-orange-500 hover:text-white border border-orange-500/20 hover:bg-orange-500 rounded-xl transition-all duration-200 font-bold shadow-sm hover:shadow-md hover:shadow-orange-500/10">
                                    Details
                                  </button>
                                  {currentStatus === "PENDING" && (
                                    <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "PACKED")} className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-bold shadow-sm shadow-blue-500/10 transition-all duration-200">
                                      Start Packing
                                    </button>
                                  )}
                                  {currentStatus === "PACKED" && (
                                    <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "DISPATCHED")} className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl font-bold shadow-sm shadow-orange-500/10 transition-all duration-200">
                                      Dispatch
                                    </button>
                                  )}
                                  {currentStatus === "DISPATCHED" && (
                                    <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "DELIVERED")} className="px-3 py-1.5 text-[10px] text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl font-bold shadow-sm shadow-emerald-500/10 transition-all duration-200">
                                      Mark Delivered
                                    </button>
                                  )}
                                  <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "CANCELLED")} className="px-3 py-1.5 text-[10px] text-red-500 hover:text-white border border-red-500/20 hover:bg-red-500 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-red-500/10">
                                    Cancel
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    });
                    
                    if (activeCount === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-muted text-sm">No active orders found.</td>
                        </tr>
                      );
                    }
                    return rows;
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-zinc-500/5 via-transparent to-transparent border-b border-border/70 px-6 py-4">
              <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider">Order History</h3>
              <p className="text-[10px] text-muted mt-0.5">Completed, returned, and cancelled order records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold min-w-[180px]">Buyer Details</th>
                    <th className="p-4 font-bold min-w-[200px]">Product Requested</th>
                    <th className="p-4 font-bold text-center">Order Type</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold">Notes</th>
                    <th className="p-4 font-bold text-right min-w-[200px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted">
                  {(() => {
                    let historyCount = 0;
                    const rows = inquiries.flatMap((inq) => {
                      const itemsList = (inq.items as any[]).filter((item: any) =>
                        products.some((p) => String(p.id) === String(item.id))
                      );
                      
                      return itemsList.map((item: any, idx: number) => {
                        const originalProduct = products.find((p) => String(p.id) === String(item.id));
                        const imgUrl = originalProduct?.image || item.image || "/logo4.jpg";
                        const currentStatus = item.status || "PENDING";
                        
                        // Show only history states
                        if (!["DELIVERED", "CANCELLED", "RETURNED"].includes(currentStatus)) {
                          return null;
                        }
                        
                        historyCount++;
                        return (
                          <tr key={`${inq.id}-${item.id}-${idx}`} className="hover:bg-surface-hover/40 transition-all duration-200 align-middle">
                             {/* Date */}
                             <td className="p-4 whitespace-nowrap font-medium">
                               {new Date(inq.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                             </td>
                                                 {/* Buyer Details */}
                             <td className="p-4">
                               <div className="flex flex-col gap-0.5 max-w-[260px] min-w-[160px] text-muted/80">
                                 <span className="font-bold text-muted text-xs">{inq.name}</span>
                                 <span className="text-[10px] flex items-center gap-1">📍 {inq.country || "Domestic"}</span>
                                 <span className="text-[10px] truncate">✉️ {inq.email}</span>
                               </div>
                             </td>
                             
                             {/* Product Requested */}
                             <td className="p-4">
                               <div className="flex items-center gap-3 opacity-70">
                                 <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-white flex-shrink-0 relative">
                                   <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                                   <span className="font-bold text-muted text-xs truncate" title={originalProduct?.name || item.name}>
                                     {originalProduct?.name || item.name}
                                   </span>
                                   <span className="text-[9px] font-mono">#{item.id}</span>
                                 </div>
                               </div>
                             </td>
                             
                             {/* Order Type */}
                             <td className="p-4 text-center opacity-70 whitespace-nowrap">
                               <span className="inline-block whitespace-nowrap text-[10px] font-medium border border-border px-2.5 py-1 rounded-full">
                                 {item.orderType || "Bulk Order"}
                               </span>
                             </td>
                             
                             {/* Status */}
                             <td className="p-4 text-center">
                               <div className="flex flex-col items-center gap-0.5">
                                 <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                                   currentStatus === "DELIVERED" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                                   currentStatus === "RETURNED" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                                   "bg-red-500/5 text-red-500 border-red-500/20"
                                 }`}>
                                   {currentStatus}
                                 </span>
                                 {currentStatus === "DELIVERED" && item.deliveryDate && (
                                   <span className="text-[8px] text-muted font-semibold mt-0.5">
                                     Delivered: {new Date(item.deliveryDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                                   </span>
                                 )}
                               </div>
                             </td>
                             
                             {/* Notes */}
                             <td className="p-4 text-center">
                               <button type="button" onClick={() => setModalMessage(inq)} className="px-3 py-1.5 text-xs bg-surface hover:bg-surface-hover text-heading border border-border rounded-xl font-bold transition-all shadow-sm">
                                 Read
                               </button>
                             </td>
                            
                            {/* Action */}
                            <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                              {originalProduct && (
                                <>
                                  <button type="button" onClick={() => openProductModal(originalProduct)} className="px-2 py-1 text-[10px] text-muted hover:text-heading border border-border hover:bg-surface rounded-lg font-bold">
                                    View Product
                                  </button>
                                  {currentStatus === "DELIVERED" && (
                                    <button type="button" onClick={() => handleUpdateItemStatus(inq.id, item.id, "RETURNED")} className="px-2 py-1 text-[10px] text-amber-600 hover:text-white border border-amber-500/20 hover:bg-amber-600 rounded-lg font-bold">
                                      Mark Returned
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    });
                    
                    const directRows = directOrders.map((order) => {
                      const currentStatus = order.status || "PENDING";
                      if (!["DELIVERED", "CANCELLED", "RETURNED"].includes(currentStatus)) {
                        return null;
                      }
                      
                      historyCount++;
                      return (
                        <tr key={order.id} className="hover:bg-surface-hover/40 transition-all duration-200 align-middle">
                          <td className="p-4 whitespace-nowrap font-medium text-muted font-semibold text-[11px]">
                            {new Date(order.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5 max-w-[260px] min-w-[160px] text-muted/80">
                              <span className="font-bold text-muted text-xs">{order.shippingName}</span>
                              <span className="text-[10px] flex items-center gap-1">📍 {order.shippingCity}, {order.shippingState}</span>
                              <span className="text-[10px] truncate">✉️ {order.userEmail}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3 opacity-70">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-white flex-shrink-0 relative">
                                <img src={order.productImage || "/logo4.jpg"} alt={order.productName} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col max-w-[240px] overflow-hidden min-w-[150px]">
                                <span className="font-bold text-muted text-xs truncate" title={order.productName}>
                                  {order.productName}
                                </span>
                                <span className="text-[9px] font-mono">Qty: {order.quantity}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center opacity-70 whitespace-nowrap">
                            <span className="inline-block whitespace-nowrap text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full">
                              Buy Now
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                                currentStatus === "DELIVERED" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                                currentStatus === "RETURNED" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                                "bg-red-500/5 text-red-500 border-red-500/20"
                              }`}>
                                {currentStatus}
                              </span>
                              {currentStatus === "DELIVERED" && order.deliveryDate && (
                                <span className="text-[8px] text-muted font-semibold mt-0.5">
                                  Delivered: {new Date(order.deliveryDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center font-bold text-heading">
                            ₹{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                            {currentStatus === "DELIVERED" && (
                              <button type="button" onClick={() => handleUpdateDirectOrderStatus(order.id, "RETURNED")} className="px-2 py-1 text-[10px] text-amber-600 hover:text-white border border-amber-500/20 hover:bg-amber-600 rounded-lg font-bold">
                                Mark Returned
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    });

                    const allRows = [...rows.filter(Boolean), ...directRows.filter(Boolean)];
                    
                    if (allRows.length === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-muted/60 text-sm">No archive records found.</td>
                        </tr>
                      );
                    }
                    return allRows;
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Catalog Search Bar */}
            <div className="bg-surface-card border border-border/80 p-5 rounded-3xl flex justify-between items-center shadow-md">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog by ID (e.g. 12) or name..."
                className="w-full max-w-md bg-surface border border-border/60 focus:border-orange-500 rounded-2xl px-5 py-3 text-heading text-xs focus:outline-none transition-all duration-200 focus:shadow-sm focus:shadow-orange-500/5 placeholder:text-muted/60"
              />
            </div>

            <div className="bg-surface-card border border-border/80 rounded-3xl overflow-hidden shadow-md">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-surface via-surface-card to-surface border-b border-border/60 text-muted font-bold uppercase tracking-[0.15em] text-[10px]">
                    <th className="p-4">ID</th>
                    <th className="p-4">Craft Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Material</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Units Sold</th>
                    <th className="p-4 text-center">Your Stock</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products
                    .filter((prod) => {
                      if (!productSearch) return true;
                      const searchStr = productSearch.toLowerCase().trim();
                      return (
                        prod.id.toString() === searchStr ||
                        prod.name.toLowerCase().includes(searchStr)
                      );
                    })
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-orange-500/[0.03] transition-all duration-200 text-body group/row">
                        <td className="p-4">
                          <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold px-2.5 py-1 rounded-xl text-[10px] border border-orange-500/10">
                            #{prod.id}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-heading">{prod.name}</td>
                        <td className="p-4 uppercase">{prod.categoryName}</td>
                        <td className="p-4 font-semibold">{prod.material}</td>
                        <td className="p-4">₹{prod.price.toLocaleString()}</td>
                        <td className="p-4 text-center font-bold text-heading">
                          {getUnitsSold(prod.id)} units
                        </td>
                        <td className={`p-4 text-center font-bold ${prod.stock <= 5 ? "text-red-500" : "text-emerald-600"}`}>
                          {prod.stock}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={async () => {
                              const newActive = !prod.active;
                              try {
                                const res = await fetch(`/api/products/${prod.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ active: newActive }),
                                });
                                if (res.ok) {
                                  showToast("Status updated successfully!", "success");
                                  router.refresh();
                                  if (vendor) fetchData(vendor.id);
                                } else {
                                  showToast("Failed to update status", "error");
                                }
                              } catch (e) {
                                showToast("Error updating status", "error");
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-bold cursor-pointer border ${
                              prod.active !== false
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/25 hover:bg-red-500/20"
                            }`}
                            title="Click to toggle status"
                          >
                            {prod.active !== false ? "Live" : "Disabled"}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openProductModal(prod)}
                              className="px-3 py-1.5 text-[10px] font-bold text-orange-500 border border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/5 rounded-xl transition-all duration-200"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditModal(prod)}
                              className="px-3 py-1.5 text-[10px] font-bold text-blue-500 border border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/5 rounded-xl transition-all duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg"
                              aria-label="Remove product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "add-product" && (
          <div className="w-full bg-surface-card border border-border/80 rounded-3xl p-8 md:p-10 shadow-md animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold font-display text-heading tracking-tight">Add New Product</h2>
              <p className="text-xs text-muted mt-1">Fill in the details below to list your handcrafted product on StopShop</p>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted uppercase tracking-wider">Item Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Pure Copper Hammered Water Dispenser"
                  className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Weight Field with Value Input + Unit Selector */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Weight (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productForm.weightValue}
                      onChange={(e) => setProductForm({ ...productForm, weightValue: e.target.value })}
                      placeholder="e.g. 1.5 or 500"
                      className="flex-1 bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                    />
                    <select
                      value={productForm.weightUnit}
                      onChange={(e) => setProductForm({ ...productForm, weightUnit: e.target.value })}
                      className="w-20 bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-2 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-6 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.4rem_center] bg-no-repeat"
                    >
                      <option value="Kg">Kg</option>
                      <option value="Gm">Gm</option>
                      <option value="Ton">Ton</option>
                      <option value="Lbs">Lbs</option>
                    </select>
                  </div>
                </div>

                {/* Pieces Count Input Box */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Pieces Count (Optional)</label>
                  <input
                    type="number"
                    value={productForm.piecesValue}
                    onChange={(e) => setProductForm({ ...productForm, piecesValue: e.target.value })}
                    placeholder="e.g. 3"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>

                {/* Combo Details Input Box */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Combo Details (Optional)</label>
                  <input
                    type="text"
                    value={productForm.combo}
                    onChange={(e) => setProductForm({ ...productForm, combo: e.target.value })}
                    placeholder="e.g. Combo Pack or Gift Set"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Capacity Field */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Capacity (Optional)</label>
                  <input
                    type="text"
                    value={productForm.capacity}
                    onChange={(e) => setProductForm({ ...productForm, capacity: e.target.value })}
                    placeholder="e.g. 2 Litres, 500 ml"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>

                {/* Thickness / Gauge Field */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Thickness / Gauge (Optional)</label>
                  <input
                    type="text"
                    value={productForm.thickness}
                    onChange={(e) => setProductForm({ ...productForm, thickness: e.target.value })}
                    placeholder="e.g. 12 Gauge, 3mm"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>

                {/* Finish / Coating Field */}
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Finish / Coating (Optional)</label>
                  <select
                    value={productForm.finish}
                    onChange={(e) => setProductForm({ ...productForm, finish: e.target.value })}
                    className="w-full bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
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
                    onClick={() => addCustomSpecRow(false)}
                    className="text-[10px] text-orange-500 hover:text-orange-600 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + Add More
                  </button>
                </div>
                <div className="space-y-3">
                  {productForm.customSpecs.map((spec, index) => (
                    <div key={index} className="flex gap-3 items-end bg-surface-card border border-border p-3 rounded-xl relative group">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-muted/80 uppercase tracking-wider text-[9px]">Spec Name / Label</label>
                          <span className="text-[8px] text-muted">{spec.label.length}/15</span>
                        </div>
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => updateCustomSpecRow(index, "label", e.target.value, false)}
                          placeholder="e.g. Weight"
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
                          onChange={(e) => updateCustomSpecRow(index, "value", e.target.value, false)}
                          placeholder="e.g. 1.5 Kg"
                          maxLength={15}
                          className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-3 py-1.5 text-heading focus:outline-none"
                        />
                      </div>
                      {productForm.customSpecs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCustomSpecRow(index, false)}
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
              
              <div className="space-y-1">
                <label className="font-bold text-muted uppercase tracking-wider">Product Image *</label>
                <div className="flex items-center gap-4 border border-dashed border-border p-4 rounded-xl bg-surface">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="inline-flex items-center justify-center px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl cursor-pointer font-semibold transition-all"
                    >
                      {uploading ? "Uploading..." : "Choose Image File"}
                    </label>
                    <p className="text-[10px] text-muted mt-1">PNG, JPG, or WEBP. Max size 5MB.</p>
                  </div>
                  {productForm.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border relative">
                      <img
                        src={productForm.image}
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
                      onChange={(e) => handleGalleryUpload(e, false)}
                      className="sr-only"
                      id="product-gallery-upload"
                    />
                    <label
                      htmlFor="product-gallery-upload"
                      className="inline-flex items-center justify-center px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl cursor-pointer font-semibold transition-all text-xs"
                    >
                      {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
                    </label>
                    <p className="text-[10px] text-muted">Upload multiple images for thumbnails. Max size 5MB each.</p>
                  </div>
                  {productForm.images && productForm.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-4">
                      {productForm.images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                          <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx, false)}
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

              <div className="space-y-1">
                <label className="font-bold text-muted uppercase tracking-wider">Product Description *</label>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe your metal item, how it was hand-beaten, health values, etc..."
                  className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Standard Price (INR) *</label>
                  <input
                    type="number"
                    required
                    readOnly
                    value={productForm.price}
                    placeholder="Auto-calculated"
                    className="w-full bg-surface-hover cursor-not-allowed opacity-80 border border-border rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none"
                  />
                  <span className="text-[10px] text-orange-500/90 mt-1 block font-bold">
                    Final Price: {productForm.price ? `₹${parseFloat(productForm.price).toLocaleString()} INR` : "₹0 INR"}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">MRP / Retail Price</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => {
                      const newMrp = e.target.value;
                      const mrpVal = parseFloat(newMrp);
                      const discountVal = parseFloat(productForm.discount) || 0;
                      let newPrice = newMrp;
                      if (!isNaN(mrpVal)) {
                        newPrice = Math.round(mrpVal - (mrpVal * discountVal) / 100).toString();
                      }
                      setProductForm({ ...productForm, mrp: newMrp, price: newPrice });
                    }}
                    placeholder="3000"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                  <span className="text-[10px] text-muted mt-1 block">Maximum printed retail price (before discounts).</span>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Discount (%)</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) => {
                      const newDiscount = e.target.value;
                      const discountVal = parseFloat(newDiscount) || 0;
                      const mrpVal = parseFloat(productForm.mrp);
                      let newPrice = productForm.price;
                      if (!isNaN(mrpVal)) {
                        newPrice = Math.round(mrpVal - (mrpVal * discountVal) / 100).toString();
                      }
                      setProductForm({ ...productForm, discount: newDiscount, price: newPrice });
                    }}
                    placeholder="0"
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                  <span className="text-[10px] text-muted mt-1 block">Percentage cut off from the printed MRP.</span>
                </div>
              </div>

              {/* Custom Regional Pricing Grid */}
              <div className="p-5 bg-surface border border-border rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
                  <div>
                    <span className="text-xs font-bold text-heading uppercase tracking-wider block">Custom Regional Retail Prices & Discounts</span>
                    <p className="text-[10px] text-muted mt-0.5">Define unique country MRPs and regional discounts (falls back to global discount if empty).</p>
                  </div>
                  
                  {/* Dropdown to dynamically add countries */}
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectedCountryToAdd}
                      onChange={(e) => setSelectedCountryToAdd(e.target.value)}
                      className="bg-surface border border-border hover:border-orange-500/40 rounded-xl px-3 py-1.5 text-xs font-semibold text-heading focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Add Country --</option>
                      {Object.keys(currencyDatabase)
                        .filter(code => code !== "IN" && !productForm.prices[code])
                        .map(code => (
                          <option key={code} value={code}>
                            {code} - {currencyDatabase[code].c} ({currencyDatabase[code].s})
                          </option>
                        ))
                      }
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCountryToAdd) {
                          setProductForm({
                            ...productForm,
                            prices: {
                              ...productForm.prices,
                              [selectedCountryToAdd]: { mrp: "", discount: "" }
                            }
                          });
                          setSelectedCountryToAdd("");
                        }
                      }}
                      className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {Object.keys(productForm.prices).length === 0 ? (
                  <p className="text-[10px] text-muted text-center py-4">No custom country prices added yet. Using standard INR exchange rates.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(productForm.prices).map((code) => {
                      const config = currencyDatabase[code] || { c: "USD", s: "$" };
                      return (
                        <div key={code} className="bg-surface-card p-4 rounded-xl border border-border space-y-3 relative group">
                          {/* Close / Remove button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...productForm.prices };
                              delete updated[code];
                              setProductForm({ ...productForm, prices: updated });
                            }}
                            className="absolute top-2.5 right-2.5 text-muted hover:text-red-500 transition-colors p-1"
                            title="Remove country pricing"
                          >
                            <X size={14} />
                          </button>

                          <div className="font-bold text-[11px] text-heading uppercase tracking-wider border-b border-border/60 pb-1.5">
                            <span>📍 {code} - {config.c} ({config.s})</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-wider">MRP ({config.s})</label>
                              <input
                                type="number"
                                placeholder="Retail MRP"
                                value={productForm.prices[code]?.mrp || ""}
                                onChange={(e) => {
                                  setProductForm({
                                    ...productForm,
                                    prices: {
                                      ...productForm.prices,
                                      [code]: { ...productForm.prices[code], mrp: e.target.value }
                                    }
                                  });
                                }}
                                className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-2.5 py-1.5 text-xs text-heading focus:outline-none"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Discount (%)</label>
                              <input
                                type="number"
                                placeholder="Optional"
                                value={productForm.prices[code]?.discount || ""}
                                onChange={(e) => {
                                  setProductForm({
                                    ...productForm,
                                    prices: {
                                      ...productForm.prices,
                                      [code]: { ...productForm.prices[code], discount: e.target.value }
                                    }
                                  });
                                }}
                                className="w-full bg-surface border border-border focus:border-orange-500 rounded-lg px-2.5 py-1.5 text-xs text-heading focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Store Category *</label>
                  {loadingCategories ? (
                    <div className="flex items-center gap-2 h-10 px-4 bg-surface border border-border rounded-xl">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-orange-500" />
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Loading...</span>
                    </div>
                  ) : (
                    <select
                      value={productForm.categoryName}
                      onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value })}
                      className="w-full bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                    >
                      {dbCategories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Base Material *</label>
                  <select
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full bg-surface border border-border hover:border-orange-500/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 text-heading font-semibold focus:outline-none cursor-pointer shadow-sm transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ea580c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.75rem_center] bg-no-repeat"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Copper">Copper</option>
                    <option value="Brass">Brass</option>
                    <option value="Steel">Steel</option>
                    <option value="Ceramic">Ceramic</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Stock Available *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={listingProduct}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {listingProduct ? "Publishing..." : "List Crafted Item"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "admin-panel" && (
          <div className="space-y-6 animate-in fade-in duration-300 text-xs">
            <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-heading uppercase tracking-wider">Global B2B & Contact Inquiries</h3>
              <p className="text-[10px] text-muted mt-0.5">Master view of all general quotes and client message submissions.</p>
            </div>
            
            <div className="space-y-6">
              {generalInquiries.length === 0 ? (
                <div className="text-center py-12 bg-surface-card border border-border rounded-2xl">
                  <p className="text-sm text-muted">No general inquiries or contact requests received yet.</p>
                </div>
              ) : (
                generalInquiries.map((inq) => {
                  let itemsList: any[] = [];
                  try {
                    itemsList = typeof inq.items === "string" ? JSON.parse(inq.items) : (inq.items as any[]) || [];
                  } catch (e) {
                    itemsList = (inq.items as any[]) || [];
                  }
                  return (
                    <div key={inq.id} className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                      {/* Inquiry Header */}
                      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-border">
                        <div>
                          <h3 className="font-bold text-base text-heading font-display">{inq.name}</h3>
                          <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
                            📍 {inq.country || "Domestic Sales"} {inq.companyName ? `(${inq.companyName})` : ""}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-muted bg-surface border border-border px-3 py-1 rounded-full">
                          Received: {new Date(inq.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Inquiry Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="flex items-center gap-2 text-body">
                            ✉️ <span className="font-bold text-heading">Email:</span> {inq.email}
                          </p>
                          <p className="flex items-center gap-2 text-body">
                            📞 <span className="font-bold text-heading">Phone:</span> {inq.phone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-heading mb-1">Message / Requirements:</h4>
                          <div className="bg-surface p-3 rounded-lg border border-border italic text-muted text-xs">
                            {inq.message && inq.message.length > 180 ? (
                              <div className="space-y-1.5">
                                <p>"{inq.message.slice(0, 180)}..."</p>
                                <button
                                  type="button"
                                  onClick={() => setModalMessage(inq)}
                                  className="text-[10px] text-orange-500 hover:text-orange-600 font-bold transition-colors underline cursor-pointer"
                                >
                                  Read Full Message
                                </button>
                              </div>
                            ) : (
                              <p>"{inq.message}"</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cart Items if present */}
                      {itemsList.length > 0 && (
                        <div className="bg-surface border border-border rounded-2xl p-4">
                          <h4 className="font-bold text-xs text-heading mb-2">Requested Items:</h4>
                          <div className="space-y-2">
                            {itemsList.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                                <span className="text-body font-semibold">
                                  {item.name} <span className="text-[10px] text-muted">({item.orderType || "Bulk Order"})</span>
                                </span>
                                <span className="font-bold text-heading">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Product Details Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-heading transition-colors z-10 font-bold"
            >
              ✕
            </button>
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="rounded-2xl overflow-hidden border border-border bg-white flex items-center justify-center h-64 sm:h-auto">
                <img
                  src={modalProduct.image || "/logo4.jpg"}
                  alt={modalProduct.name}
                  className="w-full h-full object-contain max-h-64 sm:max-h-full"
                />
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
                  Received on {new Date(modalMessage.createdAt).toLocaleDateString()} | {modalMessage.country || "Domestic"}
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

                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Product Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Product descriptions..."
                    className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-4 py-2 text-heading focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted uppercase tracking-wider">MRP / Retail Price *</label>
                    <input
                      type="number"
                      required
                      value={editForm.mrp}
                      onChange={(e) => {
                        const newMrp = e.target.value;
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
                      value={editForm.discount}
                      onChange={(e) => {
                        const newDiscount = e.target.value;
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
                          .map(code => (
                            <option key={code} value={code}>
                              {code} - {currencyDatabase[code].c} ({currencyDatabase[code].s})
                            </option>
                          ))
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
                              <span>📍 {code} - {config.c} ({config.s})</span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-bold text-muted uppercase tracking-wider block">MRP ({config.s})</label>
                                <input
                                  type="number"
                                  placeholder="Retail MRP"
                                  value={editForm.prices?.[code]?.mrp || ""}
                                  onChange={(e) => {
                                    setEditForm({
                                      ...editForm,
                                      prices: {
                                        ...editForm.prices,
                                        [code]: { ...editForm.prices?.[code], mrp: e.target.value }
                                      }
                                    });
                                  }}
                                  className="w-full bg-surface border border-border focus:border-orange-500 rounded px-2 py-1 text-xs text-heading focus:outline-none"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-bold text-muted uppercase tracking-wider block">Discount (%)</label>
                                <input
                                  type="number"
                                  placeholder="Optional"
                                  value={editForm.prices?.[code]?.discount || ""}
                                  onChange={(e) => {
                                    setEditForm({
                                      ...editForm,
                                      prices: {
                                        ...editForm.prices,
                                        [code]: { ...editForm.prices?.[code], discount: e.target.value }
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
                        {dbCategories.map((cat) => (
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
                      required
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
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
