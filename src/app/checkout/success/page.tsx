"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight, Loader2, MapPin, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { motion } from "framer-motion";

// Custom lightweight Framer Motion Confetti
const Confetti = () => {
  const pieces = Array.from({ length: 50 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem] z-0">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            y: -20,
            x: "50%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            opacity: 0,
            y: typeof window !== 'undefined' ? window.innerHeight : 800,
            x: `${Math.random() * 100}%`,
            rotate: Math.random() * 360 * 5,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
          className={`absolute top-0 w-2 h-4 sm:w-3 sm:h-6 ${
            ["bg-emerald-500", "bg-teal-400", "bg-green-300", "bg-yellow-400", "bg-orange-500"][Math.floor(Math.random() * 5)]
          }`}
          style={{ left: `${Math.random() * 100}%`, borderRadius: "2px" }}
        />
      ))}
    </div>
  );
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  const { clearCart } = useCart();
  const { formatPrice } = useRegion();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
    clearCart();

    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.order);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load order details", err);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-screen relative bg-surface flex items-center justify-center p-4 pt-24 pb-16">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-surface-card border border-border rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_60px_rgba(16,185,129,0.1)] relative backdrop-blur-xl flex flex-col overflow-hidden"
      >
        <Confetti />

        {/* Top Full Green Div */}
        <div className="bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-5 sm:py-6 text-center relative z-10 shrink-0">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-black/10 mb-3 sm:mb-4"
          >
            <CheckCircle size={28} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
          </motion.div>
          
          <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight mb-1">
            Order Confirmed!
          </h1>
          <p className="text-[10px] sm:text-xs text-emerald-50 max-w-sm mx-auto leading-relaxed">
            Your order has been confirmed. We'll start preparing it right away.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 sm:p-5 relative z-10 flex-grow bg-surface-card flex flex-col justify-between">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          ) : order ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {/* Order Meta */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <p className="text-[9px] uppercase font-bold text-muted tracking-wider mb-0.5">Order Number</p>
                  <p className="text-xs sm:text-sm font-black text-heading">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-muted tracking-wider mb-0.5">Total Paid</p>
                  <p className="text-base sm:text-lg font-black text-emerald-600">{formatPrice(order.totalPaise / 100)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 max-h-[100px] sm:max-h-[140px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 overflow-hidden relative">
                      {item.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={16} className="text-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-heading truncate">{item.productName}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-heading whitespace-nowrap pl-2">
                      {formatPrice(item.totalPaise / 100)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="flex gap-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                <MapPin className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-heading truncate">{order.shippingName}</p>
                  <p className="text-[9px] sm:text-[10px] text-muted mt-0.5 leading-snug line-clamp-1">
                    {order.shippingAddress}, {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted">Order details could not be loaded.</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-2 pt-4 mt-auto border-t border-border/60 shrink-0"
          >
            <Link
              href="/products"
              className="flex-1 inline-flex items-center justify-center py-2.5 sm:py-3 bg-surface border-2 border-border hover:border-emerald-500 hover:text-emerald-600 text-heading font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg transition-all"
            >
              Shop More
            </Link>
            <Link
              href="/orders"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg shadow-sm shadow-emerald-500/20 transition-all group"
            >
              Track Order
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
