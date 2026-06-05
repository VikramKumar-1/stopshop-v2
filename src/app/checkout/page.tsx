"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRegion } from "@/context/RegionContext";
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Coins, 
  Building2, 
  CheckCircle,
  AlertCircle,
  Lock,
  Tag,
  Truck,
  MapPin,
  Plus,
  Trash2,
  Check,
  Edit2,
  Smartphone
} from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { convertPrice, formatPrice, getRawPrice } = useRegion();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const initialQty = searchParams.get("qty") ? parseInt(searchParams.get("qty") as string, 10) : 1;
  const [quantity, setQuantity] = useState(initialQty);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "upi" | "netbanking"
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paying, setPaying] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form fields
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine, setAddrLine] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrCountry, setAddrCountry] = useState("India");
  const [addrDefault, setAddrDefault] = useState(false);

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardFocused, setCardFocused] = useState(false);
  const [cardType, setCardType] = useState("generic"); // visa, mastercard, amex, rupay, generic

  // UPI fields
  const [upiId, setUpiId] = useState("");
  const [userEmail, setUserEmail] = useState("guest@stopshop.com");

  // Scroll to top consistently on mount and payment success
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      setTimeout(() => window.scrollTo(0, 0), 50); // slight delay ensures DOM updated
    }
  }, [paymentSuccess]);

  // Load product and addresses
  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUserEmail(data.user.email);
            // Autofill card name and address name if available
            setCardName(data.user.name || "");
          }
        }
      } catch (e) {}
    };
    fetchUser();

    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setProduct({
            id: parseInt(productId),
            name: "Heritage Handcrafted Utensil",
            price: 2499,
            mrp: 3199,
            image: "/bronze-kadai.png",
            material: "Bronze",
            stock: 10,
          });
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    const saved = localStorage.getItem("stopshops_saved_addresses");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddresses(parsed);
        const def = parsed.find((a: Address) => a.isDefault) || parsed[0];
        if (def) setSelectedAddressId(def.id);
      } catch (e) {
        console.error("Error parsing saved addresses", e);
      }
    } else {
      const initialAddresses: Address[] = [
        {
          id: "1",
          name: "Vijay Sharma",
          phone: "+91 98765 43210",
          addressLine: "Sector 15, Block C, House 244",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201301",
          country: "India",
          isDefault: true
        }
      ];
      setAddresses(initialAddresses);
      setSelectedAddressId("1");
      localStorage.setItem("stopshops_saved_addresses", JSON.stringify(initialAddresses));
    }
  }, [productId]);

  // Auto-detect card type whenever card number changes
  useEffect(() => {
    const clean = cardNumber.replace(/\D/g, "");
    if (clean.startsWith("4")) {
      setCardType("visa");
    } else if (/^(5[1-5]|2[2-7])/.test(clean)) {
      setCardType("mastercard");
    } else if (/^(34|37)/.test(clean)) {
      setCardType("amex");
    } else if (/^(60|65|81|82|508)/.test(clean)) {
      setCardType("rupay");
    } else {
      setCardType("generic");
    }
  }, [cardNumber]);

  // Format Card Number (with spacing)
  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, "");
    const isAmex = /^(34|37)/.test(clean);

    if (isAmex) {
      const matches = clean.slice(0, 15).match(/(\d{1,4})(\d{1,6})?(\d{1,5})?/);
      if (matches) {
        return [matches[1], matches[2], matches[3]].filter(Boolean).join(" ");
      }
      return clean;
    } else {
      const matches = clean.slice(0, 16).match(/.{1,4}/g);
      return matches ? matches.join(" ") : clean;
    }
  };

  // Handle Address Submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList: Address[];

    if (editingAddressId) {
      updatedList = addresses.map((addr) => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            name: addrName,
            phone: addrPhone,
            addressLine: addrLine,
            city: addrCity,
            state: addrState,
            pincode: addrPincode,
            country: addrCountry,
            isDefault: addrDefault || addr.isDefault
          };
        }
        return addr;
      });
    } else {
      const newAddr: Address = {
        id: Date.now().toString(),
        name: addrName,
        phone: addrPhone,
        addressLine: addrLine,
        city: addrCity,
        state: addrState,
        pincode: addrPincode,
        country: addrCountry,
        isDefault: addrDefault || addresses.length === 0
      };
      updatedList = [...addresses, newAddr];
      setSelectedAddressId(newAddr.id);
    }

    if (addrDefault || updatedList.length === 1) {
      const activeId = editingAddressId || updatedList[updatedList.length - 1].id;
      updatedList = updatedList.map((addr) => ({
        ...addr,
        isDefault: addr.id === activeId
      }));
    }

    setAddresses(updatedList);
    localStorage.setItem("stopshops_saved_addresses", JSON.stringify(updatedList));
    resetAddressForm();
  };

  const resetAddressForm = () => {
    setAddrName("");
    setAddrPhone("");
    setAddrLine("");
    setAddrCity("");
    setAddrState("");
    setAddrPincode("");
    setAddrCountry("India");
    setAddrDefault(false);
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrLine(addr.addressLine);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setAddrCountry(addr.country);
    setAddrDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = addresses.filter((addr) => addr.id !== id);
    setAddresses(filtered);
    localStorage.setItem("stopshops_saved_addresses", JSON.stringify(filtered));
    if (selectedAddressId === id) {
      if (filtered.length > 0) {
        setSelectedAddressId(filtered[0].id);
      } else {
        setSelectedAddressId("");
      }
    }
  };

  const handleQtyChange = (type: "inc" | "dec") => {
    const stockLimit = product?.stock || 10;
    if (type === "inc") {
      setQuantity((prev) => Math.min(prev + 1, stockLimit));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      alert("Please select or add a shipping address first!");
      return;
    }
    const addr = addresses.find((a) => a.id === selectedAddressId);
    if (!addr) {
      alert("Selected address details not found.");
      return;
    }

    setPaying(true);

    try {
      // 1. Load Razorpay Script
      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setPaying(false);
        return;
      }

      // 2. Create Order on Backend
      const resOrder = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, currency: "INR" })
      });
      
      const orderData = await resOrder.json();
      if (!resOrder.ok) {
        alert(orderData.error || "Failed to initialize payment");
        setPaying(false);
        return;
      }

      // 3. Open Razorpay Modal
      const options = {
        key: orderData.key_id, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StopShop Export",
        description: `Order for ${product.name}`,
        image: "/logo4.jpg",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 4. Verify Payment on Backend
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
              // 5. Save the verified order to the database
              const payload = {
                productId: product.id,
                quantity,
                totalAmount,
                paymentId: response.razorpay_payment_id,
                paymentStatus: "PAID",
                shippingName: addr.name,
                shippingPhone: addr.phone,
                shippingAddress: addr.addressLine,
                shippingCity: addr.city,
                shippingState: addr.state,
                shippingPincode: addr.pincode,
                shippingCountry: addr.country,
                userEmail: userEmail
              };

              const dbRes = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              if (dbRes.ok) {
                setPaymentSuccess(true);
              } else {
                alert("Payment captured, but failed to save order to dashboard.");
              }
            } else {
              alert("Payment verification failed!");
            }
          } catch (verifyErr) {
            alert("Error verifying payment.");
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: addr.name,
          email: userEmail || "",
          contact: addr.phone,
        },
        theme: {
          color: "#f97316", // Orange-500
        },
        modal: {
          ondismiss: function() {
            setPaying(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Razorpay initiation error:", err);
      alert("Network error initiating payment. Please try again.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] w-full flex flex-col items-center justify-center gap-4 bg-surface text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
          <Lock size={20} className="absolute inset-0 m-auto text-orange-500 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold text-heading uppercase tracking-widest">Securing Checkout</h3>
          <p className="text-[10px] text-muted mt-1">Establishing 256-bit bank-grade encryption...</p>
        </div>
      </div>
    );
  }

  if (!productId || !product) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-heading">No Product Selected</h2>
          <p className="text-xs text-muted leading-relaxed">
            Please browse our collections and add handcrafted items to your cart to initiate checkout.
          </p>
        </div>
        <Link 
          href="/products"
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-orange-500/10"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const productPrice = product.price || 1999;
  const rawUnitPrice = getRawPrice(productPrice, product, false);
  const totalAmount = rawUnitPrice * quantity;
  const activeAddress = addresses.find((a) => a.id === selectedAddressId);

  // Premium Card Logo rendering using visible text pills
  const renderCardLogo = () => {
    switch (cardType) {
      case "visa":
        return (
          <span className="bg-blue-600 border border-blue-400 px-2 py-0.5 rounded text-[9px] font-mono font-black text-white tracking-wider">
            VISA
          </span>
        );
      case "mastercard":
        return (
          <span className="bg-gradient-to-r from-red-500 to-amber-500 px-2 py-0.5 rounded text-[9px] font-mono font-black text-white tracking-wider">
            MASTER
          </span>
        );
      case "amex":
        return (
          <span className="bg-cyan-600 border border-cyan-400 px-2 py-0.5 rounded text-[9px] font-mono font-black text-white tracking-widest">
            AMEX
          </span>
        );
      case "rupay":
        return (
          <span className="bg-orange-600 border border-orange-400 px-2 py-0.5 rounded text-[9px] font-mono font-black text-white tracking-wider">
            RUPAY
          </span>
        );
      default:
        return (
          <div className="flex items-center gap-1 opacity-50">
            <CreditCard size={14} className="text-zinc-400" />
            <span className="text-[7px] text-zinc-400 font-bold tracking-widest uppercase">Card</span>
          </div>
        );
    }
  };

  if (paymentSuccess) {
    return (
      <div 
        ref={(el) => { if (el) window.scrollTo(0, 0); }}
        className="min-h-[85vh] bg-surface flex items-center justify-center px-4 relative overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-surface-card border border-emerald-500/20 p-8 sm:p-10 rounded-3xl text-center shadow-[0_30px_60px_rgba(16,185,129,0.08)] relative backdrop-blur-xl space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-display font-bold text-heading tracking-tight">Order Confirmed!</h1>
            <p className="text-xs text-muted leading-relaxed">
              Your payment of <strong className="text-heading font-black">{formatPrice(totalAmount)}</strong> has been captured. A receipt and shipment tracking ID will be dispatched shortly.
            </p>
          </div>
          
          {activeAddress && (
            <div className="bg-surface/50 border border-border/80 rounded-2xl p-4 text-left text-xs">
              <div className="font-bold text-heading mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-orange-500" />
                Shipping To:
              </div>
              <p className="font-semibold text-heading">{activeAddress.name}</p>
              <p className="text-muted text-[11px] mt-0.5">{activeAddress.addressLine}, {activeAddress.city}, {activeAddress.state} - {activeAddress.pincode}</p>
              <p className="text-muted text-[11px]">{activeAddress.phone}</p>
            </div>
          )}

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
            <Truck size={14} className="animate-bounce" />
            Estimated Delivery: 5 - 7 Business Days
          </div>
          <div className="border-t border-border/80 pt-6">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl text-center shadow-lg transition-all duration-300 active:scale-[0.98]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-orange-500/[0.03] dark:bg-orange-500/[0.02] rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-orange-500 font-semibold mb-1 transition-colors cursor-pointer group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Catalog
            </button>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-heading">
              Secure <span className="gradient-text">Checkout</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-sm shrink-0 self-start sm:self-auto">
            <Lock size={13} className="text-emerald-500" />
            256-Bit SSL Encrypted
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. SECURE PAYMENT DETAILS SECTION (FIRST) */}
            <div className="bg-surface-card border border-border/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <h2 className="text-sm font-display font-bold text-heading uppercase tracking-wide">Secure Payment</h2>
                </div>
              </div>
              <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl text-xs text-muted flex flex-col gap-2 items-center text-center">
                <ShieldCheck className="w-8 h-8 text-orange-500 mb-1" />
                <p className="font-semibold text-heading">Payment Handled by Razorpay</p>
                <p>Your transaction will be processed securely via the official Razorpay Gateway in the next step.</p>
              </div>
            </div>

            {/* 2. SHIPPING ADDRESS SECTION (SECOND) */}
            <div className="bg-surface-card border border-border/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <h2 className="text-sm font-display font-bold text-heading uppercase tracking-wide">Shipping Address</h2>
                </div>
                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => {
                      resetAddressForm();
                      setShowAddressForm(true);
                    }}
                    className="px-2.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/15 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1"
                  >
                    <Plus size={12} />
                    Add Address
                  </button>
                )}
              </div>

              {/* Saved Address list card view */}
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
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer relative transition-all select-none flex flex-col justify-between min-h-[120px] hover:border-orange-500/50 ${
                              isSelected 
                                ? "border-orange-500 bg-orange-500/[0.02] shadow-sm"
                                : "border-border hover:bg-surface-hover"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-heading truncate pr-4">{addr.name}</span>
                                {isSelected && (
                                  <span className="w-4.5 h-4.5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                                    <Check size={10} strokeWidth={3} />
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted leading-relaxed line-clamp-2">{addr.addressLine}</p>
                              <p className="text-[10px] text-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
                              <p className="text-[10px] font-bold text-heading mt-0.5">{addr.phone}</p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-border/60 mt-2 justify-between">
                              <span className={`text-[8px] font-bold uppercase tracking-wider ${addr.isDefault ? "text-emerald-600 dark:text-emerald-400" : "text-muted"}`}>
                                {addr.isDefault ? "★ Default" : ""}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAddress(addr);
                                  }}
                                  className="text-muted hover:text-orange-500 p-0.5 transition-colors"
                                  title="Edit Address"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteAddress(addr.id, e)}
                                  className="text-muted hover:text-red-500 p-0.5 transition-colors"
                                  title="Delete Address"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-border rounded-xl">
                      <MapPin size={24} className="mx-auto text-muted/60 mb-1.5" />
                      <p className="text-[10px] text-muted">Please add a shipping address to place order.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Inline form to edit or create address */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="space-y-3.5 animate-in fade-in duration-200 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-muted uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        placeholder="Vijay Sharma"
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-heading placeholder-muted/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-muted uppercase tracking-wider">Contact Number *</label>
                      <input
                        type="text"
                        required
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-heading placeholder-muted/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-0.5">
                      <label className="text-[8px] font-bold text-muted uppercase tracking-wider">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={addrLine}
                        onChange={(e) => setAddrLine(e.target.value)}
                        placeholder="Flat/House no., Building, Street name"
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-heading placeholder-muted/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-muted uppercase tracking-wider">City *</label>
                      <input
                        type="text"
                        required
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        placeholder="Noida"
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-heading placeholder-muted/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-muted uppercase tracking-wider">State / Region *</label>
                      <input
                        type="text"
                        required
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        placeholder="Uttar Pradesh"
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-heading placeholder-muted/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-muted uppercase tracking-wider">PIN / ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        placeholder="201301"
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-heading placeholder-muted/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-bold text-muted uppercase tracking-wider">Country *</label>
                      <input
                        type="text"
                        required
                        value={addrCountry}
                        onChange={(e) => setAddrCountry(e.target.value)}
                        placeholder="India"
                        className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-heading placeholder-muted/50 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="py-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={addrDefault}
                        onChange={(e) => setAddrDefault(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-border text-orange-500 bg-surface accent-orange-500 cursor-pointer"
                      />
                      <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Set as default delivery address</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2.5 border-t border-border/80">
                    <button
                      type="button"
                      onClick={resetAddressForm}
                      className="px-4 py-2 rounded-xl border border-border hover:bg-surface-hover text-muted hover:text-heading font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-md transition-all duration-300"
                    >
                      {editingAddressId ? "Save Changes" : "Save & Use Address"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order summary & final action CTA button */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-card border border-border/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative overflow-hidden backdrop-blur-sm sticky top-24">
              <h2 className="text-[10px] font-bold text-heading uppercase tracking-widest border-b border-border pb-2.5 flex items-center gap-2">
                <Tag size={13} className="text-orange-500" />
                Order Review
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-orange-500/10 border border-border shrink-0 shadow-inner">
                  <Image 
                    src={product.image || "/logo4.jpg"} 
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-bronze-500/10 text-bronze-600 dark:text-bronze-400 text-[7px] font-bold uppercase tracking-wider">
                    {product.material || "Premium"}
                  </span>
                  <h3 className="text-xs font-bold text-heading leading-snug truncate">
                    {product.name}
                  </h3>
                  <p className="text-[9px] font-black text-heading mt-0.5">
                    {convertPrice(productPrice, product, false)}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between border-t border-b border-border/80 py-2.5">
                <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-border rounded-xl bg-surface p-0.5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => handleQtyChange("dec")}
                    className="w-6 h-6 flex items-center justify-center font-bold text-muted hover:text-heading hover:bg-surface-hover rounded-lg transition-colors cursor-pointer select-none"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-[11px] font-bold text-heading">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange("inc")}
                    className="w-6 h-6 flex items-center justify-center font-bold text-muted hover:text-heading hover:bg-surface-hover rounded-lg transition-colors cursor-pointer select-none"
                    disabled={quantity >= (product.stock || 10)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal:</span>
                  <span className="font-semibold text-heading">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Delivery:</span>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/10 uppercase tracking-wider">Free Shipping</span>
                </div>
                <div className="border-t border-border pt-3.5 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-heading uppercase tracking-wider">Total:</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-orange-500 dark:text-orange-400">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Submit Action Button on checkout */}
              <button
                onClick={handlePaymentSubmit}
                disabled={paying || !selectedAddressId}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] mt-2"
              >
                {paying ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Authorizing Secure Transaction...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    Place Order ({formatPrice(totalAmount)})
                  </>
                )}
              </button>
              
              {!selectedAddressId && (
                <p className="text-[9px] text-red-500 text-center font-bold uppercase tracking-wider">⚠️ Please select a shipping address first</p>
              )}
            </div>

            {/* Quality Seals */}
            <div className="bg-orange-500/[0.02] border border-border/80 rounded-2xl p-3.5 flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-orange-500/80 shrink-0" />
              <div>
                <h4 className="text-[9px] font-bold text-heading uppercase tracking-wider">Heritage Quality Seal</h4>
                <p className="text-[9px] text-muted leading-relaxed">This commercial export utensil is double-tested and custom hallmarked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="text-xs text-muted font-bold uppercase tracking-wider">Loading Checkout...</span>
      </div>
    }>
      <CheckoutPageInner />
    </Suspense>
  );
}
