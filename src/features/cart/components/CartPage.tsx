"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Mail, Phone, Globe, Building, ArrowLeft, Lock, FileText, CheckCircle2 } from "lucide-react";
import { useRegion } from "@/context/RegionContext";

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal, loaded } = useCart();
  const { convertPrice, convertWeight, getRawPrice, formatPrice } = useRegion();

  // Wait for cart to hydrate from localStorage before rendering
  if (!loaded) return <div className="min-h-screen bg-surface" />;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    country: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setFormData((prev) => ({
              ...prev,
              name: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.mobile || "",
              companyName: data.user.companyName || "",
              country: data.user.country || "",
            }));
          }
        }
      } catch (err) {
        console.error("Failed to prefill user details in cart:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setLoading(true);
    setError("");

  try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            material: item.material,
          })),
          message: formData.message || `Requesting a quote for ${cartCount} premium items.`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        setError(data.error || "Failed to submit quote request.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] bg-surface flex items-center justify-center px-4 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-surface-card border border-orange-500/20 p-10 rounded-3xl text-center shadow-[0_20px_50px_rgba(217,119,6,0.05)] relative backdrop-blur-sm space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold text-heading tracking-tight">Inquiry Received</h1>
            <p className="text-xs text-muted leading-relaxed">
              Your inquiry has been assigned to a dedicated StopShop Relationship Manager. We will compile a custom quote (including shipping & bulk discounts) and email you within 12–24 hours.
            </p>
          </div>
          
          <div className="border-t border-border/80 pt-6">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-bronze-600 to-bronze-700 hover:from-bronze-500 hover:to-bronze-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-lg shadow-bronze-900/10 transition-all duration-300"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-16 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] dark:bg-orange-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.03] dark:bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-border/80 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-orange-500 font-semibold mb-3 transition-colors">
              <ArrowLeft size={12} />
              Back to Homepage
            </Link>
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-heading">
              Your Inquiry <span className="gradient-text">Cart</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            Request pricing and customized logistics for commercial B2B exports.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-surface-card/60 backdrop-blur-sm border border-border/60 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-bronze-500/[0.06] text-bronze-500 flex items-center justify-center mx-auto border border-bronze-500/10">
              <ShoppingBag size={32} strokeWidth={1.5} />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-heading">Your inquiry cart is empty</h2>
              <p className="text-xs text-muted leading-relaxed">
                Explore our curated collections of pure brass, copper, and bronze heritage utensils to build your custom export inquiry.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-bronze-600 to-bronze-700 hover:from-bronze-500 hover:to-bronze-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-bronze-500/10 transition-all"
            >
              Explore Products
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center px-2 mb-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{cart.length} {cart.length === 1 ? "Product" : "Products"} Selected</span>
                <button 
                  onClick={clearCart} 
                  className="text-xs text-muted hover:text-red-500 transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row items-center gap-6 p-5 bg-surface-card border border-border/70 hover:border-orange-500/20 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-300 relative overflow-hidden"
                >
                  {/* Decorative Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/[0.02] to-transparent pointer-events-none rounded-bl-full" />

                  {/* Thumbnail */}
                  <Link 
                    href={`/product/${item.slug || item.id}`}
                    className="relative w-24 h-24 rounded-xl overflow-hidden bg-orange-50/20 dark:bg-white/5 border border-border/60 shrink-0 shadow-inner hover:opacity-90 active:scale-95 group-hover:scale-[1.02] transition-all duration-300 block"
                  >
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-bronze-500/[0.06] text-bronze-600 dark:text-bronze-400 text-[10px] font-bold uppercase tracking-wider">
                      {item.material}
                    </span>
                    <Link href={`/product/${item.slug || item.id}`} className="block hover:underline">
                      <h3 className="text-base font-bold text-heading leading-snug group-hover:text-orange-500 transition-colors duration-200">{item.name}</h3>
                    </Link>
                    <p className="text-xs text-muted font-medium">Specs: {convertWeight(item.specs)}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <span className="text-sm font-bold text-heading">{convertPrice(item.price, item, false)}</span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-muted/70 line-through">{convertPrice(item.mrp, item, true)}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-border/60 pt-4 sm:pt-0">
                    <div className="flex items-center border border-border/80 rounded-xl bg-surface p-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-muted hover:text-heading hover:bg-surface-hover rounded-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-heading">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-muted hover:text-heading hover:bg-surface-hover rounded-lg transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2.5 text-muted/60 hover:text-red-500 hover:bg-red-500/[0.04] border border-transparent hover:border-red-500/10 rounded-xl transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Inquiry Form Card */}
            <div className="lg:col-span-4 bg-surface-card border border-orange-500/15 rounded-3xl p-6 lg:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] space-y-6 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
              
              <div>
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <h2 className="text-base font-display font-bold text-heading">Cart Summary</h2>
                </div>
                <p className="text-xs text-muted leading-relaxed">Review your items before proceeding to secure checkout.</p>
              </div>

              {/* Aggregates */}
              <div className="border-t border-b border-border/85 py-5 space-y-3.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted font-medium">Total Quantity:</span>
                  <span className="font-bold text-heading">{cartCount} items</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted font-medium">Estimated Value:</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-heading">
                      {formatPrice(cart.reduce((sum, i) => sum + getRawPrice(i.price, i, false) * i.quantity, 0))}
                    </span>
                    <p className="text-[10px] text-muted/70 mt-0.5">* Excluding shipping & export duties</p>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-4">
                <div className="flex items-center gap-2 text-[10px] text-muted/80 pb-4">
                  <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Secure checkout processing guaranteed.</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (cart.length > 0) {
                      window.location.href = `/checkout`;
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  Buy Now
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

