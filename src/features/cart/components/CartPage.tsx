"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, ArrowLeft, Clock, Lock, Zap, Sparkles } from "lucide-react";
import { useRegion } from "@/context/RegionContext";

// Helper component for Countdown
const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null);
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) return <span className="text-red-300 font-bold text-[10px]">Expired</span>;
  return (
    <span className="text-white font-mono font-extrabold text-[11px] flex items-center gap-1">
      <Clock size={11} className="text-yellow-300 animate-pulse" />
      {String(timeLeft.h).padStart(2, '0')}h : {String(timeLeft.m).padStart(2, '0')}m : {String(timeLeft.s).padStart(2, '0')}s
    </span>
  );
};

export const CartPage = () => {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal, bundleDiscount, loaded } = useCart();
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [targetedOffers, setTargetedOffers] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchUserAndOffers = async () => {
      try {
        const [authRes, offersRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/targeted-offers?asBuyer=true")
        ]);
        
        if (authRes.ok) {
          const data = await authRes.json();
          if (data.authenticated && data.user) {
            setFormData((prev) => ({
              ...prev,
              name: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.mobile || "",
              companyName: data.user.companyName || "",
              country: data.user.country || "",
            }));

            // Sync the current cart items to the Intent Queue now that we are authenticated
            if (cart.length > 0) {
              const { intentQueue } = await import("@/lib/analytics/intentQueue");
              cart.forEach(item => {
                intentQueue.track({
                  productId: item.id,
                  vendorId: item.vendorId || 9,
                  type: "CART"
                });
              });
            }
          }
        }
        
        if (offersRes.ok) {
          const offersData = await offersRes.json();
          if (Array.isArray(offersData)) {
            setTargetedOffers(offersData);
          }
        }
      } catch (err) {
        console.error("Failed to prefill user details and offers in cart:", err);
      }
    };
    fetchUserAndOffers();
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

  // Calculate total raw price and targeted offer discount across cart items
  let totalRawPrice = 0;
  let totalTargetedDiscount = 0;

  cart.forEach(item => {
    const rawPrice = getRawPrice(item.price, item, false);
    totalRawPrice += rawPrice * item.quantity;

    const offer = targetedOffers.find(o => 
      (o.productId === item.id || (!o.productId && o.vendorId === item.vendorId)) &&
      new Date(o.expiresAt) > new Date()
    );

    if (offer) {
      let itemDiscount = 0;
      if (offer.discountPct) itemDiscount = rawPrice * (offer.discountPct / 100);
      if (offer.discountAmt) itemDiscount = Math.min(rawPrice, offer.discountAmt * 100); // Caps at item price
      
      const discountQuantity = offer.productId ? 1 : item.quantity;
      totalTargetedDiscount += itemDiscount * discountQuantity;
    }
  });

  const finalEstimatedValue = Math.max(0, totalRawPrice - bundleDiscount - totalTargetedDiscount);

  return (
    <div className="min-h-screen bg-surface py-8 sm:py-16 relative overflow-hidden">
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

              {cart.map((item) => {
                const offer = targetedOffers.find(o => 
                  (o.productId === item.id || (!o.productId && o.vendorId === item.vendorId)) &&
                  new Date(o.expiresAt) > new Date()
                );
                
                let discountedPrice = item.price;
                if (offer) {
                  if (offer.discountPct) discountedPrice = item.price * (1 - offer.discountPct / 100);
                  if (offer.discountAmt) discountedPrice = Math.max(0, item.price - (offer.discountAmt * 100)); // Price is in paise
                }

                return (
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
                    
                    {offer && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full shadow-md text-white mb-2 border border-white/25 transform transition-transform hover:scale-[1.02]">
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-yellow-100">
                          <Zap size={11} className="fill-yellow-300 text-yellow-300 animate-bounce" /> Personalized Offer
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/60" />
                        <div className="flex items-center bg-black/25 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-inner">
                          <CountdownTimer expiresAt={offer.expiresAt} />
                        </div>
                      </div>
                    )}

                    {/* Price and Category */}
                    <div className="flex flex-col w-full">
                      <span className="text-xs font-bold text-orange-500/80 mb-1 tracking-wide">{item.categoryName || "Product"}</span>
                      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start w-full">
                        {offer ? (() => {
                          const regPrice = item.mrp > item.price ? item.mrp : item.price;
                          const savings = regPrice - discountedPrice;
                          return (
                            <div className="mt-1 bg-gradient-to-r from-orange-50/90 to-amber-50/90 dark:from-orange-950/40 dark:to-amber-950/40 p-3 rounded-xl border border-orange-500/30 w-full max-w-md shadow-sm">
                              <div className="flex items-center justify-between gap-2 flex-wrap mb-1 text-xs">
                                <span className="font-semibold text-muted">Regular Store Price:</span>
                                <span className="text-muted line-through font-bold text-sm">{convertPrice(regPrice, item, true)}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2 flex-wrap border-t border-orange-500/20 pt-2 mt-1 text-xs">
                                <span className="font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                  ⚡ Exclusive Offer Price:
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-lg font-black text-heading text-emerald-600 dark:text-emerald-400">{convertPrice(discountedPrice, item, false)}</span>
                                  {savings > 0 && (
                                    <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full shadow-sm animate-pulse-subtle">
                                      Save {convertPrice(savings, item, false)}!
                                    </span>
                                  )}
                                </div>
                              </div>
                              {offer.productId && item.quantity > 1 && (
                                <p className="text-[10px] text-amber-700 dark:text-amber-300 font-bold mt-2 bg-amber-500/15 px-2 py-1 rounded border border-amber-500/20">
                                  ℹ️ Note: Exclusive rate applies to 1st unit only.
                                </p>
                              )}
                            </div>
                          );
                        })() : (
                          <>
                            <span className="text-sm font-black text-heading">{convertPrice(item.price, item, false)}</span>
                            {item.mrp > item.price && (
                              <span className="text-[10px] text-muted line-through opacity-70">{convertPrice(item.mrp, item, true)}</span>
                            )}
                          </>
                        )}
                      </div>
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
                );
              })}
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
                {totalTargetedDiscount > 0 && (
                  <div className="flex justify-between text-xs text-orange-500 font-semibold">
                    <span className="flex items-center gap-1"><Sparkles size={12}/> Personalized Savings:</span>
                    <span>-{formatPrice(totalTargetedDiscount)}</span>
                  </div>
                )}
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>🎁 Bundle Savings:</span>
                    <span>-{formatPrice(bundleDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1 border-t border-border/40">
                  <span className="text-xs text-muted font-medium">Estimated Value:</span>
                  <div className="text-right">
                    {(bundleDiscount > 0 || totalTargetedDiscount > 0) ? (
                      <>
                        <span className="text-sm font-medium text-muted line-through mr-2">
                          {formatPrice(totalRawPrice)}
                        </span>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {formatPrice(finalEstimatedValue)}
                        </span>
                        {bundleDiscount > 0 && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                            🎁 Bundle Combo Discount Applied!
                          </div>
                        )}
                        {totalTargetedDiscount > 0 && (
                          <div className="text-[10px] text-orange-500 font-bold mt-0.5 flex items-center justify-end gap-1">
                            ⚡ Personalized Offer Applied!
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-lg font-black text-heading">
                        {formatPrice(totalRawPrice)}
                      </span>
                    )}
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
                  disabled={isRedirecting}
                  onClick={() => {
                    if (cart.length > 0) {
                      setIsRedirecting(true);
                      setTimeout(() => {
                        router.push(`/checkout`);
                      }, 50);
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <ShoppingBag size={16} />
                  {isRedirecting ? "Redirecting..." : "Buy Now"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

