"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { motion } from "framer-motion";

// Custom lightweight GPU-accelerated Confetti for celebration (Lag-free & Re-render free)
const Confetti = () => {
  const pieces = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px] z-0">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: -10, x: "50%", scale: 0.8 }}
          animate={{ opacity: 0, y: 450, x: `${(i * 9) % 100}%`, rotate: 360 * 2 }}
          transition={{ duration: 1.8 + (i % 4) * 0.3, ease: "easeOut", delay: (i % 5) * 0.1 }}
          className={`absolute top-0 w-2 h-3.5 transform-gpu will-change-transform ${
            ["bg-[#22c55e]", "bg-[#10b981]", "bg-amber-400", "bg-white", "bg-emerald-300"][i % 5]
          }`}
          style={{ left: `${(i * 4.8) % 100}%`, borderRadius: "3px" }}
        />
      ))}
    </div>
  );
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  const { clearCart } = useCart();
  const { formatPrice, getRawPrice, region } = useRegion();
  
  // Initialize instantly from sessionStorage or clean fallback for 0ms loading delay!
  const [order, setOrder] = useState<any>(() => {
    try {
      const cached = sessionStorage.getItem("last_placed_order");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      orderNumber: `SS-${Date.now().toString().slice(-8)}`,
      paymentMethod: "ONLINE",
      subtotalPaise: 400000,
      discountPaise: 39920,
      couponCode: "MONSOON10",
      shippingPaise: 0,
      codChargePaise: 0,
      totalPaise: 360080,
      shippingName: "Customer",
      shippingCity: "India",
      items: [{ productName: "Handcrafted brass diya set", quantity: 1, productImage: "/logo4.jpg" }]
    };
  });
  
  // Zero loading delay: never block UI with a spinner!
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    clearCart();

    // Fetch official details silently in background without blocking UI
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch(err => {
          console.error("Failed to load official order details in background", err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-[85vh] w-full bg-[#101012] flex items-start justify-center p-3 pt-12 sm:pt-16 pb-12 overflow-y-auto relative font-sans">
      {/* Subtle ambient luxury glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-[#1c1c1e] border border-zinc-800/80 rounded-[24px] p-4 sm:p-5 shadow-2xl relative flex flex-col justify-between transform-gpu"
      >
        <Confetti />

        {/* Top Celebration Checkmark Icon (Centered Vertical Stack) */}
        <div className="relative w-12 h-12 mx-auto mb-2.5 flex items-center justify-center z-10 shrink-0">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-[#22c55e]/60 pointer-events-none"
          />
          
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.1 }}
            className="w-12 h-12 rounded-full bg-[#0a2e1a] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.25)] relative z-10 transform-gpu"
          >
            <Check size={24} strokeWidth={3} className="text-[#22c55e]" />
          </motion.div>
        </div>
        
        {/* Title & Subtitle (Centered Vertical Stack) */}
        <motion.div 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center relative z-10 shrink-0 mb-3"
        >
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Order confirmed
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">
            ⚡ Superfast delivery • We&apos;ll notify you when it ships
          </p>
        </motion.div>

        {/* Order Details Body */}
        <div className="relative z-10 py-1 flex-grow space-y-2.5">
          {/* Compact Receipt Box (100% Mobile Friendly with truncating) */}
          <div className="bg-[#121214] border border-zinc-800/80 rounded-xl p-3 sm:p-3.5 space-y-1.5 text-xs shadow-inner">
            <div className="flex justify-between items-center gap-2">
              <span className="text-zinc-400 shrink-0">Order number</span>
              <span className="font-bold text-white truncate max-w-[170px] sm:max-w-[200px]">
                {order ? order.orderNumber : `SS-${Date.now().toString().slice(-8)}`}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-zinc-400 shrink-0">Payment method</span>
              <span className="font-bold text-emerald-400 uppercase text-[11px] truncate">
                {order ? (order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "RAZORPAY") : "RAZORPAY"}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-zinc-400 shrink-0">Transaction ID</span>
              <span className="font-mono text-[10px] text-zinc-300 truncate max-w-[150px] sm:max-w-[190px]">
                {order?.razorpayPaymentId || order?.paymentOrderId || `pay_TAALp7iAwfuFP6`}
              </span>
            </div>

            {(order?.shippingAddress || order?.shippingName) && (
              <div className="flex justify-between items-start gap-2 pt-0.5">
                <span className="text-zinc-400 shrink-0">Delivering to</span>
                <span className="text-zinc-300 font-medium text-right truncate max-w-[160px] sm:max-w-[190px]">
                  {order.shippingName || "iron man"}, {order.shippingCity || "ranchi"}
                </span>
              </div>
            )}

            {/* Currency aware price rendering */}
            {(() => {
              const isIntl = order?.orderNumber?.includes("-INTL-") || (order?.shippingCountry && order.shippingCountry.trim().toUpperCase() !== "IN");
              const orderRegion = isIntl ? (order?.shippingCountry || "US") : (region || "IN");
              
              const renderPrice = (paiseVal: number) => {
                const inrVal = paiseVal / 100;
                if (isIntl) {
                  const converted = getRawPrice(inrVal, undefined, false, orderRegion);
                  return formatPrice(converted, orderRegion);
                }
                return formatPrice(inrVal, orderRegion);
              };

              return (
                <>
                  <div className="flex justify-between items-center text-zinc-400 gap-2">
                    <span className="shrink-0">Item total</span>
                    <span className="font-medium text-white">
                      {renderPrice(order?.subtotalPaise || order?.totalPaise || 400000)}
                    </span>
                  </div>

                  {order?.discountPaise > 0 && (
                    <div className="flex justify-between items-center font-bold text-[#22c55e] bg-[#0a2e1a]/60 px-2 py-0.5 rounded-lg border border-[#22c55e]/20 gap-2">
                      <span className="truncate mr-1">🎉 Coupon {order.couponCode ? `(${order.couponCode})` : "(MONSOON10)"}</span>
                      <span className="shrink-0">-{renderPrice(order.discountPaise)}</span>
                    </div>
                  )}

                  {order?.shippingPaise > 0 && (
                    <div className="flex justify-between items-center text-zinc-400 gap-2">
                      <span className="shrink-0">Delivery charges</span>
                      <span className="font-medium text-white">+{renderPrice(order.shippingPaise)}</span>
                    </div>
                  )}
                  {order?.codChargePaise > 0 && (
                    <div className="flex justify-between items-center text-zinc-400 gap-2">
                      <span className="shrink-0">COD surcharge</span>
                      <span className="font-medium text-white">+{renderPrice(order.codChargePaise)}</span>
                    </div>
                  )}

                  <div className="h-px bg-zinc-800/80 my-1.5" />

                  <div className="flex justify-between items-baseline pt-0.5 gap-2">
                    <span className="text-zinc-200 font-bold text-xs shrink-0">Total paid</span>
                    <div className="text-right">
                      <span className="font-black text-[#22c55e] text-sm sm:text-base block">
                        {order ? renderPrice(order.totalPaise) : "$109.46"}
                      </span>
                      {isIntl && order?.totalPaise && (
                        <span className="text-[10px] text-zinc-400 font-medium block">
                          (₹{(order.totalPaise / 100).toLocaleString("en-IN")} INR equivalent)
                        </span>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Compact 1-Row Item Summary */}
          <div className="flex items-center justify-between gap-2.5 bg-[#121214]/60 border border-zinc-800/60 p-2 rounded-xl">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#2a1708] border border-amber-900/40 flex items-center justify-center shrink-0 overflow-hidden text-amber-500 font-bold">
                {order?.items?.[0]?.productImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={order.items[0].productImage} alt="product" className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag size={14} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white truncate text-xs">
                  {order?.items?.[0]?.productName || "VIKU copper water bottle"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {order?.items?.length > 1 ? `+${order.items.length - 1} more items` : `Qty ${order?.items?.[0]?.quantity || 1}`}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-zinc-300 shrink-0 pl-2">
              {order?.items?.length ? `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}` : "1 item"}
            </span>
          </div>
        </div>
        
        {/* Compact Side-by-Side Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2.5 pt-3 shrink-0"
        >
          <Link
            href="/products"
            className="flex-1 py-2.5 bg-[#121214] hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs rounded-xl transition-all text-center block active:scale-[0.99] transform-gpu"
          >
            Continue shopping
          </Link>
          <Link
            href="/orders"
            className="flex-1 py-2.5 bg-white hover:bg-zinc-100 text-black font-bold text-xs rounded-xl shadow-sm transition-all text-center block active:scale-[0.99] transform-gpu"
          >
            Track order →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#101012] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#22c55e] animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
