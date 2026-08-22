"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRegion } from "@/context/RegionContext";
import { useCart } from "@/context/CartContext";
import { 
  CreditCard, ShieldCheck, ArrowLeft, Loader2, Coins, Building2, CheckCircle,
  AlertCircle, Lock, Tag, Truck, MapPin, Plus, Trash2, Check, Edit2, Smartphone, Globe, Sparkles, ChevronRight
} from "lucide-react";
import { countries } from "@/lib/countries";

interface Address {
  id: number | string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormProps {
  initialData?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  onSubmit: (data: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }) => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
}

function AddressForm({ initialData, onSubmit, onCancel, isSaving }: AddressFormProps) {
  const { region } = useRegion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [state, setState] = useState(initialData?.state || "");
  const [pincode, setPincode] = useState(initialData?.pincode || "");
  
  // Auto-detect country based on context region (IN -> India, etc.)
  const [country, setCountry] = useState(() => {
    if (initialData?.country) return initialData.country;
    const matched = countries.find(c => c.code.toUpperCase() === region?.toUpperCase());
    return matched ? matched.name : "India";
  });

  // Searchable Country Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCountryObj = countries.find(c => c.name === country) || countries.find(c => c.name === "India") || countries[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSaving) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ name, phone, address, city, state, pincode, country });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isSaving;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <input 
        type="text" 
        required 
        disabled={isDisabled}
        value={name} 
        onChange={e=>setName(e.target.value)} 
        placeholder="Full Name" 
        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs disabled:opacity-60" 
      />
      <input 
        type="text" 
        required 
        disabled={isDisabled}
        value={phone} 
        onChange={e=>setPhone(e.target.value)} 
        placeholder="Contact Number" 
        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs disabled:opacity-60" 
      />
      <input 
        type="text" 
        required 
        disabled={isDisabled}
        value={address} 
        onChange={e=>setAddress(e.target.value)} 
        placeholder="Street Address" 
        className="sm:col-span-2 w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs disabled:opacity-60" 
      />
      <input 
        type="text" 
        required 
        disabled={isDisabled}
        value={city} 
        onChange={e=>setCity(e.target.value)} 
        placeholder="City" 
        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs disabled:opacity-60" 
      />
      <input 
        type="text" 
        required 
        disabled={isDisabled}
        value={state} 
        onChange={e=>setState(e.target.value)} 
        placeholder="State" 
        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs disabled:opacity-60" 
      />
      <input 
        type="text" 
        required 
        disabled={isDisabled}
        value={pincode} 
        onChange={e=>setPincode(e.target.value)} 
        placeholder="Pincode / Postal Code" 
        className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs disabled:opacity-60" 
      />
      
      {/* Searchable Country Picker Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
            setSearchQuery("");
          }}
          className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs flex items-center justify-between text-left h-[42px] sm:h-[38px] disabled:opacity-60"
        >
          <span className="truncate">
            {selectedCountryObj.flag} &nbsp; {selectedCountryObj.name}
          </span>
          <span className="text-muted text-[8px] ml-2 shrink-0">▼</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mb-0 sm:mt-1 bg-surface-card border border-border rounded-xl shadow-xl z-50 p-2 space-y-1.5 animate-in fade-in duration-100 max-h-56 flex flex-col">
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 focus:border-orange-500 focus:outline-none text-base sm:text-xs shrink-0"
              autoFocus
            />
            <div className="overflow-y-auto space-y-0.5 scrollbar-none flex-1 max-h-40">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountry(c.name);
                      setIsDropdownOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-surface-hover transition-colors flex items-center gap-2 ${
                      c.name === country ? "bg-orange-500/10 text-orange-500 font-bold" : "text-body"
                    }`}
                  >
                    <span className="shrink-0">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-3 text-[10px] text-muted">
                  No country found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isDisabled}
          className="px-4 py-2 text-xs font-bold text-muted hover:text-heading disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isDisabled}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-75 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 min-w-[120px] transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm"
        >
          {isDisabled ? (
            <>
              <Loader2 size={14} className="animate-spin text-white" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Address</span>
          )}
        </button>
      </div>
    </form>
  );
}

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  let extractedProductId = searchParams.get("productId");
  if (!extractedProductId && pathname && pathname.startsWith('/checkout/') && !pathname.includes('/success') && !pathname.includes('/failure')) {
    const slug = pathname.replace('/checkout/', '');
    const lastDash = slug.lastIndexOf('-');
    if (lastDash !== -1) {
      const idStr = slug.substring(lastDash + 1);
      if (!isNaN(parseInt(idStr))) {
        extractedProductId = idStr;
      }
    }
  }

  const buyNowProductId = extractedProductId;
  const buyNowBundleIds = searchParams.get("bundleIds");
  const buyNowQty = parseInt(searchParams.get("qty") || "1");

  const { convertPrice, formatPrice, getRawPrice, region } = useRegion();
  const { cart, cartTotal, cartCount, clearCart, loaded, updateQuantity, removeFromCart } = useCart();

  const [buyNowCart, setBuyNowCart] = useState<any[]>([]);
  const checkoutItems = buyNowCart.length > 0 ? buyNowCart : cart;
  const [fetchingBuyNow, setFetchingBuyNow] = useState(!!buyNowProductId || !!buyNowBundleIds);

  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // "razorpay" | "payu" | "cod"
  const [paying, setPaying] = useState(false);

  // UI Alert Popup Modal State
  const [uiAlert, setUiAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    icon?: "address" | "error" | "payment";
  }>({
    show: false,
    title: "",
    message: "",
    icon: "error"
  });

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | string | null>(null);

  // Address Form fields
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine, setAddrLine] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrCountry, setAddrCountry] = useState("India");
  const [addrDefault, setAddrDefault] = useState(false);

  // Pricing breakdown
  const [pricing, setPricing] = useState({
    subtotal: 0,
    shipping: 0,
    codSurcharge: 0,
    tax: 0,
    discount: 0,
    total: 0
  });

  const [settings, setSettings] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  const [targetedOffers, setTargetedOffers] = useState<any[]>([]);
  const [vendorOfferApplied, setVendorOfferApplied] = useState<boolean>(true);

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{code: string, discountPaise: number, message: string} | null>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const autoApplyAttempted = useRef(false);

  useEffect(() => {
    if (checkoutItems.length === 0) return;
    const fetchCoupons = async () => {
      setLoadingCoupons(true);
      try {
        const res = await fetch("/api/coupons/available", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity }))
          })
        });
        const data = await res.json();
        if (data.success) {
          setAvailableCoupons(data.coupons);
        }
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchCoupons();
  }, [checkoutItems]);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = typeof codeToApply === 'string' ? codeToApply : couponCode;
    if (!code) return;
    if (typeof codeToApply === 'string') setCouponCode(code);
    
    setValidatingCoupon(true);
    setCouponError("");
    
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          cartItems: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity })),
          paymentMethod,
          country: isInternational ? "US" : "IN",
          isBundle: !!buyNowBundleIds
        })
      });
      const data = await res.json();
      if (data.valid) {
        setCouponApplied({ code: data.couponCode, discountPaise: data.discountPaise, message: data.message });
      } else {
        setCouponError(data.error);
        setCouponApplied(null);
      }
    } catch (err) {
      setCouponError("Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponCode("");
    setCouponError("");
    // Allow auto-apply again if they manually remove it? No, usually if they remove it, they don't want it automatically re-applied.
    // So we leave autoApplyAttempted as true.
  };

  useEffect(() => {
    if (couponApplied || availableCoupons.length === 0 || autoApplyAttempted.current) return;
    
    const autoCoupons = availableCoupons.filter(c => c.isAutoApply);
    if (autoCoupons.length > 0) {
      autoApplyAttempted.current = true;
      // Sort by highest discountValue number as a heuristic for "best"
      const bestAuto = autoCoupons.sort((a, b) => b.discountValue - a.discountValue)[0];
      handleApplyCoupon(bestAuto.code);
    }
  }, [availableCoupons, couponApplied]);

useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // If cart is empty and not doing a Buy Now, redirect back
    if (loaded && cart.length === 0 && !buyNowProductId && !buyNowBundleIds) {
      // Do not redirect if we are attempting to fetch a Buy Now item
      const timer = setTimeout(() => router.push("/cart"), 2000);
      return () => clearTimeout(timer);
    } else if (loaded && typeof window !== "undefined") {
      // Save current checkout URL (including buyNow parameters) for failure retries
      sessionStorage.setItem("lastCheckoutUrl", window.location.href);
    }

    const loadData = async () => {
      try {
        const productFetchPromise = (async () => {
          if (buyNowProductId) {
             const pRes = await fetch(`/api/products/${buyNowProductId}`);
             if (pRes.ok) {
                const pData = await pRes.json();
                if (pData && pData.id) {
                   setBuyNowCart([{ ...pData, quantity: buyNowQty }]);
                }
             }
          } else if (buyNowBundleIds) {
             const ids = buyNowBundleIds.split(",").filter(Boolean);
             const pResults = await Promise.all(
               ids.map(id => fetch(`/api/products/${id}`).then(r => r.ok ? r.json() : null).catch(() => null))
             );
             const fetchedItems = pResults.filter((p: any) => p && p.id).map((p: any) => ({ ...p, quantity: buyNowQty }));
             if (fetchedItems.length > 0) {
                setBuyNowCart(fetchedItems);
             }
          }
        })();

        const userPromise = fetch("/api/auth/me", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
        const offersPromise = fetch("/api/targeted-offers?asBuyer=true", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
        const addrPromise = fetch("/api/addresses", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
        const settingsPromise = fetch("/api/settings/public", { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);

        const [_, userData, offersData, addrData, settingsData] = await Promise.all([
          productFetchPromise,
          userPromise,
          offersPromise,
          addrPromise,
          settingsPromise
        ]);

        if (userData && userData.authenticated && userData.user) {
          setUserEmail(userData.user.email);
        } else {
          setIsRedirecting(true);
          // Preserve the current URL path (works for both slug-based and query param URLs)
          const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/checkout";
          const redirectPath = encodeURIComponent(currentPath);
          router.push(`/profile?redirect=${redirectPath}`);
          return;
        }

        if (Array.isArray(offersData)) {
          setTargetedOffers(offersData);
        }

        if (addrData && addrData.addresses?.length > 0) {
          setAddresses(addrData.addresses);
          const def = addrData.addresses.find((a: any) => a.isDefault) || addrData.addresses[0];
          setSelectedAddressId(def.id);
        }

        if (settingsData && settingsData.success) {
          setSettings(settingsData.settings);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setFetchingBuyNow(false);
      }
    };
    loadData();
  }, [cart, router, loaded, buyNowProductId, buyNowBundleIds, buyNowQty]);

  const activeAddress = addresses.find(a => a.id === selectedAddressId);
  const countryName = activeAddress?.country || "India";
  const countryCodeObj = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
  const countryCode = countryCodeObj ? countryCodeObj.code : "IN";
  const isInternational = countryCode !== "IN";

  // Auto-switch payment method based on country of selected address
  useEffect(() => {
    if (isInternational) {
      if (paymentMethod !== "payu") {
        setPaymentMethod("payu");
      }
    } else {
      if (paymentMethod === "payu") {
        setPaymentMethod("razorpay");
      }
    }
  }, [isInternational]);

  // Recalculate Pricing
  useEffect(() => {
    if (!settings || checkoutItems.length === 0) return;

    let subtotal = 0;

    checkoutItems.forEach(item => {
       // Pass countryCode to getRawPrice so it perfectly mirrors the backend shipping country price
       const rawPrice = getRawPrice(item.price, item, false, countryCode);
       subtotal += rawPrice * item.quantity;
    });

    let shipping = 0;
    if (isInternational) {
       shipping = getRawPrice(settings.internationalShippingPaise / 100, undefined, false, countryCode);
    } else {
       if (subtotal < (settings.shippingFreeAbove / 100)) {
          shipping = paymentMethod === "cod" 
             ? settings.codShippingChargePaise / 100 
             : settings.shippingChargePaise / 100;
       }
    }

    let codSurcharge = 0;
    if (paymentMethod === "cod") {
       codSurcharge = settings.codSurchargePaise / 100;
    }

    let tax = 0;
    if (settings.taxRate > 0 && isInternational) {
       tax = subtotal * (settings.taxRate / 100);
    }

    let discount = 0;

    // Apply bundle combo discount if this is a combo checkout
    if (buyNowBundleIds && checkoutItems.length > 1) {
       const mainProduct = checkoutItems[0];
       if (mainProduct && (mainProduct.bundleDiscountType === "PERCENTAGE" || mainProduct.bundleDiscountType === "FLAT")) {
          if (mainProduct.bundleDiscountType === "PERCENTAGE") {
             discount += Math.round(subtotal * (mainProduct.bundleDiscountValue || 0) / 100);
          } else if (mainProduct.bundleDiscountType === "FLAT") {
             discount += (mainProduct.bundleDiscountValue || 0) * mainProduct.quantity;
          }
       }
    }

    if (couponApplied) {
       discount += getRawPrice(couponApplied.discountPaise / 100, undefined, false, countryCode);
       // Ensure total discount doesn't exceed subtotal
       if (discount > subtotal) discount = subtotal;
    }

    setPricing({
       subtotal,
       shipping,
       codSurcharge,
       tax,
       discount,
       total: Math.max(0, subtotal + shipping + codSurcharge + tax - discount)
    });

  }, [checkoutItems, paymentMethod, selectedAddressId, addresses, settings, getRawPrice, isInternational, couponApplied, targetedOffers, buyNowBundleIds, countryCode]);

  // Check if any targeted discounts apply to disable regular coupons
  const hasTargetedDiscounts = checkoutItems.some(item => 
    targetedOffers.some(o => 
      (o.productId === item.id || (!o.productId && o.vendorId === item.vendorId)) &&
      new Date(o.expiresAt) > new Date()
    )
  );

  // Handle Address Submit
  const handleAddressSubmit = async (formData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }) => {
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        isDefault: addrDefault || addresses.length === 0
      };

      let res;
      if (editingAddressId) {
        res = await fetch(`/api/addresses/${editingAddressId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/addresses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
         // Reload addresses
         const addrRes = await fetch("/api/addresses");
         const addrData = await addrRes.json();
         setAddresses(addrData.addresses);
         if (!editingAddressId && addrData.addresses.length > 0) {
            setSelectedAddressId(addrData.addresses[0].id); // Select newly added
         }
         resetAddressForm();
      } else {
         const data = await res.json();
         setUiAlert({
           show: true,
           title: "Address Error",
           message: data.error || "Failed to save address. Please check your details and try again.",
           icon: "error"
         });
      }
    } catch (err) {
       console.error(err);
    }
  };

  const resetAddressForm = () => {
    setAddrName(""); setAddrPhone(""); setAddrLine(""); setAddrCity("");
    setAddrState(""); setAddrPincode(""); setAddrCountry("India"); setAddrDefault(false);
    setShowAddressForm(false); setEditingAddressId(null);
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name); setAddrPhone(addr.phone); setAddrLine(addr.address);
    setAddrCity(addr.city); setAddrState(addr.state); setAddrPincode(addr.pincode);
    setAddrCountry(addr.country); setAddrDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      const filtered = addresses.filter((addr) => addr.id !== id);
      setAddresses(filtered);
      if (selectedAddressId === id) {
        setSelectedAddressId(filtered.length > 0 ? filtered[0].id : "");
      }
    } catch (err) {}
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSubmit = async () => {
    if (!selectedAddressId) {
      setUiAlert({
        show: true,
        title: "Shipping Address Required",
        message: "Please select a shipping address first! We need to know where to deliver your order.",
        icon: "address"
      });
      return;
    }

    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) return;

    setPaying(true);

    const orderPayload = {
      cartItems: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity })),
      couponCode: couponApplied?.code,
      isBundle: !!buyNowBundleIds,
      shippingInfo: {
         name: activeAddress.name,
         phone: activeAddress.phone,
         email: userEmail,
         address: activeAddress.address,
         city: activeAddress.city,
         state: activeAddress.state,
         pincode: activeAddress.pincode,
         country: activeAddress.country
      }
    };

    try {
      sessionStorage.setItem("last_placed_order", JSON.stringify({
        orderNumber: `SS-${Date.now().toString().slice(-8)}`,
        paymentMethod: paymentMethod === "cod" ? "cod" : "ONLINE",
        subtotalPaise: Math.round((pricing.subtotal || 0) * 100),
        discountPaise: Math.round((pricing.discount || 0) * 100),
        couponCode: orderPayload.couponCode || null,
        shippingPaise: Math.round((pricing.shipping || 0) * 100),
        codChargePaise: Math.round((pricing.codSurcharge || 0) * 100),
        totalPaise: Math.round((pricing.total || 0) * 100),
        shippingName: activeAddress?.name || "Customer",
        shippingCity: activeAddress?.city || "India",
        items: checkoutItems.map((i: any) => ({
          productName: i.product.title || i.product.name,
          productImage: i.product.images?.[0] || "/logo4.jpg",
          quantity: i.quantity,
          totalPaise: Math.round((i.product.price || 0) * i.quantity * 100)
        }))
      }));
    } catch (e) {}

    try {
      if (paymentMethod === "razorpay") {
         const resLoaded = await loadRazorpayScript();
         if (!resLoaded) {
           setUiAlert({
             show: true,
             title: "Connection Error",
             message: "Razorpay failed to load. Please check your internet connection and try again.",
             icon: "error"
           });
           setPaying(false);
           return;
         }

         const resOrder = await fetch("/api/razorpay/create-order", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(orderPayload)
         });
         
         const orderData = await resOrder.json();
         if (!resOrder.ok) {
           setUiAlert({
             show: true,
             title: "Payment Initialization Failed",
             message: orderData.error || "Failed to initialize payment. Please try again.",
             icon: "error"
           });
           setPaying(false);
           return;
         }

         const options = {
           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
           amount: orderData.amount,
           currency: orderData.currency,
           name: "StopShops",
           description: "Order Checkout",
           order_id: orderData.orderId,
           handler: async function (response: any) {
             try {
               const verifyRes = await fetch("/api/razorpay/verify", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                   razorpay_order_id: response.razorpay_order_id,
                   razorpay_payment_id: response.razorpay_payment_id,
                   razorpay_signature: response.razorpay_signature,
                 }),
               });

               const verifyData = await verifyRes.json();
               if (verifyData.success) {
                 router.push(`/checkout/success?orderId=${verifyData.orderId}`);
               } else {
                 router.push(`/checkout/failure?reason=${verifyData.error || 'verification_failed'}`);
               }
             } catch (verifyErr) {
               router.push("/checkout/failure?reason=network_error");
             }
           },
           prefill: { name: activeAddress.name, email: userEmail, contact: activeAddress.phone },
           theme: { color: "#f97316" },
           modal: { ondismiss: () => setPaying(false) }
         };

         const rzp = new (window as any).Razorpay(options);
         rzp.on("payment.failed", function (response: any) {
           setPaying(false);
         });
         rzp.open();
      } 
      else if (paymentMethod === "payu") {
         const resOrder = await fetch("/api/payu/create-order", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(orderPayload)
         });
         
         const orderData = await resOrder.json();
         if (!resOrder.ok) {
           setUiAlert({
             show: true,
             title: "Payment Initialization Failed",
             message: orderData.error || "Failed to initialize PayU payment. Please try again.",
             icon: "error"
           });
           setPaying(false);
           return;
         }

         // Create a dynamic form and submit it to PayU
         const form = document.createElement("form");
         form.method = "POST";
         form.action = orderData.payuData.action;

         Object.keys(orderData.payuData).forEach(key => {
            if (key === "action") return;
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = orderData.payuData[key];
            form.appendChild(input);
         });

         document.body.appendChild(form);
         form.submit();
      }
      else if (paymentMethod === "cod") {
         const resOrder = await fetch("/api/cod/create-order", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(orderPayload)
         });
         
         const orderData = await resOrder.json();
         if (!resOrder.ok) {
           setUiAlert({
             show: true,
             title: "Order Failed",
             message: orderData.error || "Failed to create Cash on Delivery order. Please try again.",
             icon: "error"
           });
           setPaying(false);
           return;
         }

         router.push(`/checkout/success?orderId=${orderData.dbOrderId}`);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setUiAlert({
        show: true,
        title: "Network Error",
        message: "A network error occurred while processing your request. Please try again.",
        icon: "error"
      });
      setPaying(false);
    }
  };

  const handleUpdateQty = (id: string | number, newQty: number) => {
    if (buyNowCart.length > 0) {
       setBuyNowCart(prev => prev.map(item => item.id === Number(id) || item.id === id ? { ...item, quantity: newQty } : item));
    } else {
       updateQuantity(Number(id), newQty);
    }
  };

  if (fetchingBuyNow || loading || !loaded || isRedirecting) {
    return (
      <div className="min-h-[75vh] w-full flex flex-col items-center justify-center gap-4 bg-surface text-center">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm font-bold text-heading">Loading Checkout...</p>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-heading">Cart is Empty</h2>
          <p className="text-xs text-muted leading-relaxed">Please add items to your cart to checkout.</p>
        </div>
        <Link href="/products" className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-orange-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Dynamic Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-muted font-medium mb-1.5 overflow-x-auto whitespace-nowrap py-0.5">
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-muted/60 shrink-0" />

              {buyNowProductId && checkoutItems[0] ? (
                <>
                  <Link href="/products" className="hover:text-orange-500 transition-colors">
                    Products
                  </Link>
                  <ChevronRight size={12} className="text-muted/60 shrink-0" />
                  <Link 
                    href={`/product/${checkoutItems[0].slug || checkoutItems[0].id}`} 
                    className="hover:text-orange-500 transition-colors max-w-[150px] sm:max-w-[220px] truncate"
                  >
                    {checkoutItems[0].name || checkoutItems[0].productName || "Product"}
                  </Link>
                  <ChevronRight size={12} className="text-muted/60 shrink-0" />
                </>
              ) : buyNowBundleIds && checkoutItems[0] ? (
                <>
                  <Link href="/products" className="hover:text-orange-500 transition-colors">
                    Products
                  </Link>
                  <ChevronRight size={12} className="text-muted/60 shrink-0" />
                  <span className="text-muted max-w-[150px] sm:max-w-[220px] truncate">
                    Combo Bundle
                  </span>
                  <ChevronRight size={12} className="text-muted/60 shrink-0" />
                </>
              ) : (
                <>
                  <Link href="/cart" className="hover:text-orange-500 transition-colors">
                    Cart
                  </Link>
                  <ChevronRight size={12} className="text-muted/60 shrink-0" />
                </>
              )}

              <span className="text-orange-500 font-bold">Checkout</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-heading">
              Secure <span className="gradient-text">Checkout</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Lock size={13} /> 256-Bit SSL Encrypted
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-5">
            
            {/* Address Section */}
            <div id="address-section" className="bg-surface-card border border-border/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm scroll-mt-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <h2 className="text-sm font-display font-bold text-heading uppercase tracking-wide">Shipping Address</h2>
                </div>
                {!showAddressForm && (
                  <button onClick={() => { resetAddressForm(); setShowAddressForm(true); }} className="px-2.5 py-1.5 bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase rounded-xl flex items-center gap-1">
                    <Plus size={12} /> Add Address
                  </button>
                )}
              </div>

              {!showAddressForm && (
                <div className="space-y-3">
                  {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-h-[90px] ${
                              isSelected ? "border-orange-500 bg-orange-500/[0.03] shadow-sm" : "border-border hover:bg-surface-hover"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-heading truncate">{addr.name}</span>
                                {isSelected && <CheckCircle size={15} className="text-orange-500 shrink-0" />}
                              </div>
                              <p className="text-[11px] text-muted mt-0.5 line-clamp-1">{addr.address}</p>
                              <p className="text-[10px] text-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
                              <p className="text-[11px] font-semibold text-heading mt-0.5">{addr.phone}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-1.5 border-t border-border/60 mt-2 justify-between">
                              <span className="text-[9px] font-bold uppercase text-emerald-600">{addr.isDefault ? "★ Default" : ""}</span>
                              <div className="flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="text-muted hover:text-orange-500 p-0.5"><Edit2 size={12}/></button>
                                <button onClick={(e) => handleDeleteAddress(addr.id, e)} className="text-muted hover:text-red-500 p-0.5"><Trash2 size={12}/></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-center text-muted">No address found. Please add one.</p>
                  )}
                </div>
              )}
              {showAddressForm && (
                <AddressForm
                  initialData={editingAddressId ? {
                    name: addrName,
                    phone: addrPhone,
                    address: addrLine,
                    city: addrCity,
                    state: addrState,
                    pincode: addrPincode,
                    country: addrCountry
                  } : undefined}
                  onSubmit={handleAddressSubmit}
                  onCancel={resetAddressForm}
                />
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-surface-card border border-border/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
                <h2 className="text-sm font-display font-bold text-heading uppercase tracking-wide">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Razorpay (Online Payment for India) */}
                {!isInternational && (
                  <label className={`cursor-pointer p-3 border rounded-xl flex items-center gap-3 transition-all ${paymentMethod === 'razorpay' ? 'border-orange-500 bg-orange-500/5 shadow-sm' : 'border-border hover:border-orange-500/30'}`}>
                     <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="sr-only" />
                     <div className={`p-2 rounded-lg border ${paymentMethod === 'razorpay' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-surface border-border text-muted'}`}>
                       <CreditCard size={18} />
                     </div>
                     <div className="text-left">
                       <span className="block text-xs font-bold text-heading">Online Payment</span>
                       <span className="block text-[10px] text-muted font-medium">UPI, Cards, Netbanking, Wallets</span>
                     </div>
                  </label>
                )}

                {/* PayU (International Cards) */}
                {isInternational && (
                  <label className={`cursor-pointer p-3 border rounded-xl flex items-center gap-3 transition-all ${paymentMethod === 'payu' ? 'border-orange-500 bg-orange-500/5 shadow-sm' : 'border-border hover:border-orange-500/30'}`}>
                     <input type="radio" name="payment" value="payu" checked={paymentMethod === 'payu'} onChange={() => setPaymentMethod('payu')} className="sr-only" />
                     <div className={`p-2 rounded-lg border ${paymentMethod === 'payu' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-surface border-border text-muted'}`}>
                       <Globe size={18} />
                     </div>
                     <div className="text-left">
                       <span className="block text-xs font-bold text-heading">International Payment</span>
                       <span className="block text-[10px] text-muted font-medium">Credit/Debit Cards, Bank Transfer</span>
                     </div>
                  </label>
                )}

                {/* Cash on Delivery (India only) */}
                {!isInternational && (
                  <label className={`cursor-pointer p-3 border rounded-xl flex items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500/5 shadow-sm' : 'border-border hover:border-orange-500/30'}`}>
                     <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                     <div className={`p-2 rounded-lg border ${paymentMethod === 'cod' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-surface border-border text-muted'}`}>
                       <Building2 size={18} />
                     </div>
                     <div className="text-left">
                       <span className="block text-xs font-bold text-heading">Cash on Delivery (COD)</span>
                       <span className="block text-[10px] text-muted font-medium">Pay in cash at your doorstep</span>
                     </div>
                  </label>
                )}
              </div>
            </div>

            {/* Order Items / Products (Moved under Payment Method!) */}
            <div className="bg-surface-card border border-border/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  <h2 className="text-sm font-display font-bold text-heading uppercase tracking-wide">Review Products ({checkoutItems.length})</h2>
                </div>
              </div>

              <div className="space-y-2.5">
                 {checkoutItems.map(item => {
                     const offer = vendorOfferApplied ? targetedOffers.find(o => 
                       (o.productId === item.id || (!o.productId && o.vendorId === item.vendorId)) &&
                       new Date(o.expiresAt) > new Date()
                     ) : undefined;
                     const rawPrice = getRawPrice(item.price, item, false, countryCode);
                     let itemDiscount = 0;
                     if (offer) {
                       if (offer.discountPct) itemDiscount = Math.round(rawPrice * (offer.discountPct / 100));
                       if (offer.discountAmt) itemDiscount = Math.min(rawPrice, offer.discountAmt);
                     }
                     const discountQuantity = offer ? (offer.productId ? 1 : item.quantity) : 0;
                     const totalDiscount = itemDiscount * discountQuantity;
                     const finalItemTotal = (rawPrice * item.quantity) - totalDiscount;

                     return (
                     <div key={item.id} className="flex gap-3 p-3 border border-border/80 bg-surface rounded-xl relative group hover:shadow-sm transition-all items-center">
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => {
                            if (buyNowCart.length > 0) {
                              const updated = buyNowCart.filter(i => i.id !== item.id);
                              if (updated.length === 0) router.push("/cart");
                              else setBuyNowCart(updated);
                            } else {
                              removeFromCart(item.id);
                            }
                          }}
                          className="absolute top-2 right-2 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-surface-card rounded-md shadow-sm"
                          title="Remove Item"
                        >
                          <Trash2 size={13} />
                        </button>

                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0 bg-surface-card flex items-center justify-center">
                           <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform" />
                        </div>
                        
                        {/* Details & Actions */}
                        <div className="flex-1 flex flex-col justify-between self-stretch py-0.5">
                           <div className="pr-6">
                              <h4 className="text-xs font-bold text-heading leading-tight line-clamp-1">{item.name}</h4>
                              <p className="text-[10px] text-muted mt-0.5 line-clamp-1">
                                 {item.material && <span className="font-semibold text-heading">{item.material} • </span>}
                                 {item.specs || "Premium artisanal craftsmanship"}
                              </p>
                           </div>
                           
                           <div className="flex items-center justify-between mt-2">
                              {/* Quantity Editor */}
                              <div className="flex items-center border border-border rounded-md bg-surface-card overflow-hidden h-6">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                                  className="w-6 h-full flex items-center justify-center font-bold text-heading hover:bg-orange-500/10 hover:text-orange-600 transition-colors text-xs"
                                >
                                  -
                                </button>
                                <span className="w-7 text-center text-[11px] font-bold text-heading border-x border-border/50">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                                  className="w-6 h-full flex items-center justify-center font-bold text-heading hover:bg-orange-500/10 hover:text-orange-600 transition-colors text-xs"
                                  disabled={item.quantity >= item.stock}
                                >
                                  +
                                </button>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                 {offer && totalDiscount > 0 ? (
                                   <div>
                                     <span className="text-[10px] text-muted line-through mr-1 font-medium">{formatPrice(rawPrice * item.quantity, countryCode)}</span>
                                     <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{formatPrice(finalItemTotal, countryCode)}</span>
                                     <span className="text-[8px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold px-1 py-0.5 rounded ml-1">Save {formatPrice(totalDiscount, countryCode)}</span>
                                   </div>
                                 ) : (
                                   <div className="text-xs font-black text-heading">
                                      {formatPrice(rawPrice * item.quantity, countryCode)}
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                     );
                 })}
              </div>
            </div>

          </div>

          {/* Right Column: Industry-Standard Order Summary */}
          <div className="lg:col-span-4 space-y-4 sm:sticky sm:top-24">
            
            <div className="bg-surface-card border border-border/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
               <h2 className="text-sm font-display font-bold text-heading uppercase tracking-wide border-b border-border pb-3 flex items-center justify-between">
                 <span>Order Summary</span>
                 <span className="text-[11px] font-semibold text-muted lowercase">({checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'})</span>
               </h2>
               
               {/* Item Price & Breakdown */}
               <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-muted">
                     <span>Item Total (Subtotal)</span>
                     <span className="text-heading font-medium">{formatPrice(pricing.subtotal, countryCode)}</span>
                  </div>
                   {pricing.discount > 0 && (
                      <div className="flex justify-between text-emerald-500 font-medium">
                         <span className="flex items-center gap-1">
                           <Tag size={12} /> Discount {couponApplied?.code ? `(${couponApplied.code})` : ""}
                         </span>
                         <span>-{formatPrice(pricing.discount, countryCode)}</span>
                      </div>
                   )}
                  <div className="flex justify-between text-muted">
                     <span>Delivery Charges</span>
                     <span className="text-emerald-500 font-medium">
                       {pricing.shipping === 0 ? "FREE" : formatPrice(pricing.shipping, countryCode)}
                     </span>
                  </div>
                  {pricing.codSurcharge > 0 && (
                     <div className="flex justify-between text-muted">
                        <span>COD Surcharge</span>
                        <span className="text-heading font-medium">{formatPrice(pricing.codSurcharge, countryCode)}</span>
                     </div>
                  )}
                  {pricing.tax > 0 && (
                     <div className="flex justify-between text-muted">
                        <span>Estimated Taxes ({settings.taxRate}%)</span>
                        <span className="text-heading font-medium">{formatPrice(pricing.tax, countryCode)}</span>
                     </div>
                  )}
               </div>

               {/* Compact Offers & Coupons (Below Item Price inside the same card!) */}
               <div className="pt-2 border-t border-dashed border-border/80 space-y-2.5">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-heading flex items-center gap-1.5">
                     <Tag size={13} className="text-orange-500" /> Offers & Coupons
                   </span>
                   {loadingCoupons ? (
                     <span className="text-[10px] text-muted flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" /> Checking...
                     </span>
                   ) : !couponApplied && availableCoupons.length > 0 ? (
                     <span className="text-[10px] text-orange-600 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full">
                       {availableCoupons.length} available
                     </span>
                   ) : null}
                 </div>

                 {/* Compact Available Coupons Carousel */}
                 {!loadingCoupons && !couponApplied && availableCoupons.length > 0 && (
                   <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
                     {availableCoupons.map((c, i) => (
                       <button
                         key={i}
                         type="button"
                         onClick={() => !validatingCoupon && handleApplyCoupon(c.code)}
                         className="shrink-0 text-left p-2 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 hover:border-orange-500 rounded-xl transition-all flex flex-col justify-between w-[160px] group snap-center shadow-xs"
                       >
                         <div className="flex items-center justify-between mb-0.5">
                           <span className="text-[11px] font-black text-orange-600 uppercase tracking-wider">{c.code}</span>
                           <span className="text-[9px] font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                             {validatingCoupon && couponCode === c.code ? (
                               <>
                                 <Loader2 size={10} className="animate-spin" />
                                 <span>Applying...</span>
                               </>
                             ) : "Apply →"}
                           </span>
                         </div>
                         <span className="text-[10px] text-emerald-600 font-semibold line-clamp-1">{c.description}</span>
                       </button>
                     ))}
                   </div>
                 )}

                 {/* Coupon Input Box */}
                 {!couponApplied ? (
                   <div className="flex gap-1.5">
                     <input 
                       type="text" 
                       value={couponCode} 
                       onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                       placeholder="Enter coupon code" 
                       className="flex-1 bg-surface border border-border rounded-xl px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none uppercase font-medium"
                     />
                     <button 
                       type="button"
                       onClick={() => handleApplyCoupon()}
                       disabled={validatingCoupon || !couponCode}
                       className="px-3.5 py-1.5 bg-heading text-surface rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-orange-500 transition-colors"
                     >
                       {validatingCoupon ? "..." : "Apply"}
                     </button>
                   </div>
                 ) : (
                   <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                     <span className="text-[11px] font-bold text-emerald-600 truncate mr-2">✓ {couponApplied.message}</span>
                     <button type="button" onClick={handleRemoveCoupon} className="text-xs text-red-500 font-bold hover:text-red-600 shrink-0">
                       Remove
                     </button>
                   </div>
                 )}
                 {couponError && <p className="text-[10px] text-red-500 font-medium px-1">{couponError}</p>}
               </div>

               {/* Total Amount Payable */}
               <div className="border-t border-border pt-3.5 space-y-1">
                  <div className="flex justify-between items-baseline">
                     <span className="font-bold text-heading text-sm">Total Payable</span>
                     <span className="font-black text-heading text-lg gradient-text">{formatPrice(pricing.total, countryCode)}</span>
                  </div>
                  {pricing.discount > 0 && (
                    <p className="text-[11px] text-emerald-600 font-bold text-right">
                      You will save {formatPrice(pricing.discount, countryCode)} on this order!
                    </p>
                  )}
               </div>

               {/* Industry Standard Order Place Button */}
               <button
                 type="button"
                 onClick={handlePaymentSubmit}
                 disabled={paying}
                 className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] mt-2"
               >
                 {paying ? (
                   <>
                     <Loader2 size={16} className="animate-spin" />
                     <span>Processing Order...</span>
                   </>
                 ) : paymentMethod === "cod" ? (
                   <>
                     <CheckCircle size={16} />
                     <span>Place Order</span>
                   </>
                 ) : (
                   <>
                     <Lock size={16} />
                     <span>Pay {formatPrice(pricing.total, countryCode)} & Place Order</span>
                   </>
                 )}
               </button>

               {/* Trust Badges */}
               <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted text-center pt-1 border-t border-border/50">
                 <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                 <span>
                   {paymentMethod === "cod" 
                     ? "100% Genuine Products • Pay at your doorstep" 
                     : "100% Safe & Secure Payments • 256-bit SSL"}
                 </span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* UI Alert Modal Popup */}
      {uiAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card border border-border/80 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-sm w-full mx-auto relative text-center transform animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/10 animate-bounce">
              {uiAlert.icon === "address" ? <MapPin size={26} /> : <AlertCircle size={26} />}
            </div>
            
            <h3 className="text-lg font-display font-bold text-heading mb-2">
              {uiAlert.title}
            </h3>
            
            <p className="text-xs text-muted leading-relaxed mb-6">
              {uiAlert.message}
            </p>
            
            <button
              onClick={() => {
                setUiAlert(prev => ({ ...prev, show: false }));
                if (uiAlert.icon === "address") {
                  if (addresses.length === 0) {
                    resetAddressForm();
                    setShowAddressForm(true);
                  }
                  const el = document.getElementById("address-section");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all transform active:scale-[0.98]"
            >
              {uiAlert.icon === "address" ? (addresses.length === 0 ? "Add Shipping Address" : "Select Address") : "Got It"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[75vh] w-full flex flex-col items-center justify-center gap-4 bg-surface text-center">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm font-bold text-heading">Loading Checkout...</p>
      </div>
    }>
      <CheckoutPageInner />
    </Suspense>
  );
}
