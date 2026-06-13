"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRegion } from "@/context/RegionContext";
import { useCart } from "@/context/CartContext";
import { 
  CreditCard, ShieldCheck, ArrowLeft, Loader2, Coins, Building2, CheckCircle,
  AlertCircle, Lock, Tag, Truck, MapPin, Plus, Trash2, Check, Edit2, Smartphone, Globe
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

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowProductId = searchParams.get("productId");
  const buyNowQty = parseInt(searchParams.get("qty") || "1");

  const { convertPrice, formatPrice, getRawPrice, region } = useRegion();
  const { cart, cartTotal, cartCount, clearCart, loaded, updateQuantity, removeFromCart } = useCart();

  const [buyNowCart, setBuyNowCart] = useState<any[]>([]);
  const [fetchingBuyNow, setFetchingBuyNow] = useState(!!buyNowProductId);

  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // "razorpay" | "payu" | "cod"
  const [paying, setPaying] = useState(false);

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
    total: 0
  });

  const [settings, setSettings] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // If cart is empty and not doing a Buy Now, redirect back
    if (loaded && cart.length === 0 && !buyNowProductId) {
      // Do not redirect if we are attempting to fetch a Buy Now item
      const timer = setTimeout(() => router.push("/cart"), 2000);
      return () => clearTimeout(timer);
    }

    const loadData = async () => {
      try {
        // Fetch Buy Now Product if exists
        if (buyNowProductId) {
           const pRes = await fetch(`/api/products/${buyNowProductId}`);
           if (pRes.ok) {
              const pData = await pRes.json();
              if (pData && pData.id) {
                 setBuyNowCart([{ ...pData, quantity: buyNowQty }]);
              }
           }
        }

        // Fetch User Info
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
           const userData = await userRes.json();
           if (userData.user) setUserEmail(userData.user.email);
        }

        // Fetch Addresses
        const addrRes = await fetch("/api/addresses");
        if (addrRes.ok) {
           const addrData = await addrRes.json();
           if (addrData.addresses?.length > 0) {
              setAddresses(addrData.addresses);
              const def = addrData.addresses.find((a: any) => a.isDefault) || addrData.addresses[0];
              setSelectedAddressId(def.id);
           }
        }
        // Fetch Shipping Settings
        const settingsRes = await fetch("/api/settings/public");
        if (settingsRes.ok) {
           const settingsData = await settingsRes.json();
           if (settingsData.success) {
              setSettings(settingsData.settings);
           }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setFetchingBuyNow(false);
      }
    };
    loadData();
  }, [cart, router, loaded, buyNowProductId, buyNowQty]);

  const checkoutItems = buyNowCart.length > 0 ? buyNowCart : cart;
  const activeAddress = addresses.find(a => a.id === selectedAddressId);
  const country = activeAddress?.country || "India";
  const isInternational = country.toLowerCase() !== "india" && country.toLowerCase() !== "in";

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
  }, [isInternational, paymentMethod]);

  // Recalculate Pricing
  useEffect(() => {
    if (!settings || checkoutItems.length === 0) return;

    let subtotal = 0;
    checkoutItems.forEach(item => {
       subtotal += getRawPrice(item.price, item, false) * item.quantity;
    });

    let shipping = 0;
    if (isInternational) {
       shipping = settings.internationalShippingPaise / 100;
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
    if (settings.taxRate > 0) {
       tax = subtotal * (settings.taxRate / 100);
    }

    setPricing({
       subtotal,
       shipping,
       codSurcharge,
       tax,
       total: subtotal + shipping + codSurcharge + tax
    });

  }, [checkoutItems, paymentMethod, selectedAddressId, addresses, settings, getRawPrice, isInternational]);

  // Handle Address Submit
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: addrName,
        phone: addrPhone,
        address: addrLine,
        city: addrCity,
        state: addrState,
        pincode: addrPincode,
        country: addrCountry,
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
         alert(data.error || "Failed to save address");
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
      alert("Please select a shipping address first!");
      return;
    }

    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) return;

    setPaying(true);

    const orderPayload = {
      cartItems: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity })),
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
      if (paymentMethod === "razorpay") {
         const resLoaded = await loadRazorpayScript();
         if (!resLoaded) {
           alert("Razorpay failed to load. Please check your connection.");
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
           alert(orderData.error || "Failed to initialize payment");
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
           alert(orderData.error || "Failed to initialize PayU payment");
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
           alert(orderData.error || "Failed to create COD order");
           setPaying(false);
           return;
         }

         router.push(`/checkout/success?orderId=${orderData.dbOrderId}`);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Network error. Please try again.");
      setPaying(false);
    }
  };

  const handleUpdateQty = (id: string | number, newQty: number) => {
    if (buyNowCart.length > 0) {
       setBuyNowCart([{ ...buyNowCart[0], quantity: newQty }]);
    } else {
       updateQuantity(Number(id), newQty);
    }
  };

  if (fetchingBuyNow || loading || !loaded) {
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
            <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-orange-500 font-semibold mb-1 transition-colors">
              <ArrowLeft size={14} /> Back to Cart
            </button>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-heading">
              Secure <span className="gradient-text">Checkout</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Lock size={13} /> 256-Bit SSL Encrypted
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            
            {/* Address Section */}
            <div className="bg-surface-card border border-border/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3.5">
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
                <div className="space-y-4">
                  {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[120px] ${
                              isSelected ? "border-orange-500 bg-orange-500/[0.02]" : "border-border hover:bg-surface-hover"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-heading truncate pr-4">{addr.name}</span>
                                {isSelected && <CheckCircle size={16} className="text-orange-500" />}
                              </div>
                              <p className="text-[10px] text-muted mt-1">{addr.address}</p>
                              <p className="text-[10px] text-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
                              <p className="text-[10px] font-bold text-heading mt-0.5">{addr.phone}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border/60 mt-2 justify-between">
                              <span className="text-[8px] font-bold uppercase text-emerald-600">{addr.isDefault ? "★ Default" : ""}</span>
                              <div className="flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="text-muted hover:text-orange-500"><Edit2 size={12}/></button>
                                <button onClick={(e) => handleDeleteAddress(addr.id, e)} className="text-muted hover:text-red-500"><Trash2 size={12}/></button>
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
                <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input type="text" required value={addrName} onChange={e=>setAddrName(e.target.value)} placeholder="Full Name" className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none" />
                  <input type="text" required value={addrPhone} onChange={e=>setAddrPhone(e.target.value)} placeholder="Contact Number" className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none" />
                  <input type="text" required value={addrLine} onChange={e=>setAddrLine(e.target.value)} placeholder="Street Address" className="sm:col-span-2 w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none" />
                  <input type="text" required value={addrCity} onChange={e=>setAddrCity(e.target.value)} placeholder="City" className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none" />
                  <input type="text" required value={addrState} onChange={e=>setAddrState(e.target.value)} placeholder="State" className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none" />
                  <input type="text" required value={addrPincode} onChange={e=>setAddrPincode(e.target.value)} placeholder="Pincode" className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none" />
                   <select 
                     required 
                     value={addrCountry} 
                     onChange={e=>setAddrCountry(e.target.value)} 
                     className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none"
                   >
                     {countries.map((c) => (
                       <option key={c.code} value={c.name}>
                         {c.flag} {c.name}
                       </option>
                     ))}
                   </select>
                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
                    <button type="button" onClick={resetAddressForm} className="px-4 py-2 text-xs font-bold text-muted hover:text-heading">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl">Save Address</button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-surface-card border border-border/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-3.5">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
                <h2 className="text-sm font-display font-bold text-heading uppercase tracking-wide">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay (Online Payment for India) */}
                {!isInternational && (
                  <label className={`cursor-pointer p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${paymentMethod === 'razorpay' ? 'border-orange-500 bg-orange-500/5 shadow-sm' : 'border-border hover:border-orange-500/30'}`}>
                     <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="sr-only" />
                     <div className={`p-2.5 rounded-xl border ${paymentMethod === 'razorpay' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-surface border-border text-muted'}`}>
                       <CreditCard size={20} />
                     </div>
                     <div className="text-left">
                       <span className="block text-xs font-bold text-heading">Online Payment</span>
                       <span className="block text-[10px] text-muted font-medium mt-0.5">UPI, Cards, Netbanking, Wallets</span>
                     </div>
                  </label>
                )}

                {/* PayU (International Cards) */}
                {isInternational && (
                  <label className={`cursor-pointer p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${paymentMethod === 'payu' ? 'border-orange-500 bg-orange-500/5 shadow-sm' : 'border-border hover:border-orange-500/30'}`}>
                     <input type="radio" name="payment" value="payu" checked={paymentMethod === 'payu'} onChange={() => setPaymentMethod('payu')} className="sr-only" />
                     <div className={`p-2.5 rounded-xl border ${paymentMethod === 'payu' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-surface border-border text-muted'}`}>
                       <Globe size={20} />
                     </div>
                     <div className="text-left">
                       <span className="block text-xs font-bold text-heading">International Payment</span>
                       <span className="block text-[10px] text-muted font-medium mt-0.5">Credit/Debit Cards, Bank Transfer</span>
                     </div>
                  </label>
                )}

                {/* Cash on Delivery (India only) */}
                {!isInternational && (
                  <label className={`cursor-pointer p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500/5 shadow-sm' : 'border-border hover:border-orange-500/30'}`}>
                     <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                     <div className={`p-2.5 rounded-xl border ${paymentMethod === 'cod' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-surface border-border text-muted'}`}>
                       <Building2 size={20} />
                     </div>
                     <div className="text-left">
                       <span className="block text-xs font-bold text-heading">Cash on Delivery (COD)</span>
                       <span className="block text-[10px] text-muted font-medium mt-0.5">Pay in cash at your doorstep</span>
                     </div>
                  </label>
                )}
              </div>
            </div>

          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 bg-surface-card border border-border/90 rounded-3xl p-5 shadow-sm space-y-4">
             <h2 className="text-base font-display font-bold text-heading border-b border-border pb-3">Order Summary</h2>
             
             <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                {checkoutItems.map(item => (
                   <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-3 border border-border/60 bg-surface rounded-2xl relative group">
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => {
                          if (buyNowCart.length > 0) router.push("/cart");
                          else removeFromCart(item.id);
                        }}
                        className="absolute top-2 right-2 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-surface-card rounded-md shadow-sm"
                        title="Remove Item"
                      >
                        <Trash2 size={12} />
                      </button>

                      {/* Image / Gallery Thumbnail */}
                      <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden border border-border shrink-0 bg-surface-card flex items-center justify-center">
                         <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform" />
                      </div>
                      
                      {/* Details & Actions */}
                      <div className="flex-1 flex flex-col justify-between">
                         <div className="pr-6">
                            <h4 className="text-sm font-bold text-heading leading-tight">{item.name}</h4>
                            <p className="text-[10px] text-muted mt-1 line-clamp-2">
                               {item.material && <span className="font-semibold text-heading">{item.material} • </span>}
                               {item.specs || "Premium artisanal craftsmanship"}
                            </p>
                         </div>
                         
                         <div className="flex items-end justify-between mt-3">
                            {/* Quantity Editor */}
                            <div className="flex items-center border border-border rounded-lg bg-surface-card overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center font-bold text-heading hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-heading border-x border-border/50">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center font-bold text-heading hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                                disabled={item.quantity >= item.stock}
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="text-sm font-black text-heading text-right">
                               {formatPrice(getRawPrice(item.price, item, false) * item.quantity)}
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>

             <div className="border-t border-border pt-4 space-y-3 text-xs">
                <div className="flex justify-between text-muted">
                   <span>Subtotal</span>
                   <span className="text-heading font-medium">{formatPrice(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                   <span>Shipping</span>
                   <span className="text-emerald-500 font-medium">
                     {pricing.shipping === 0 ? "FREE" : formatPrice(pricing.shipping)}
                   </span>
                </div>
                {pricing.codSurcharge > 0 && (
                   <div className="flex justify-between text-muted">
                      <span>COD Surcharge</span>
                      <span className="text-heading font-medium">{formatPrice(pricing.codSurcharge)}</span>
                   </div>
                )}
                {pricing.tax > 0 && (
                   <div className="flex justify-between text-muted">
                      <span>Taxes ({settings.taxRate}%)</span>
                      <span className="text-heading font-medium">{formatPrice(pricing.tax)}</span>
                   </div>
                )}
                <div className="flex justify-between border-t border-border pt-3">
                   <span className="font-bold text-heading">Total Amount</span>
                   <span className="font-bold text-heading text-lg gradient-text">{formatPrice(pricing.total)}</span>
                </div>
             </div>

             <button
               onClick={handlePaymentSubmit}
               disabled={paying}
               className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
             >
               {paying ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
               {paying ? "Processing..." : `Pay Securely via ${paymentMethod.toUpperCase()}`}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <CheckoutPageInner />
    </Suspense>
  );
}
