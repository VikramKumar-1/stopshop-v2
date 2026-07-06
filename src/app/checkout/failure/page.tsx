"use client";
import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function CheckoutFailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason") || "An unknown error occurred during payment processing.";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#101012] flex items-center justify-center p-4 pt-28 sm:pt-32 pb-12 overflow-x-hidden relative font-sans">
      {/* Subtle ambient luxury glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-[#1c1c1e] border border-zinc-800/80 rounded-[28px] p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden transform-gpu"
      >
        {/* Top Alert Icon */}
        <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center z-10 shrink-0">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-[#3a1018] border border-rose-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.25)] relative z-10 transform-gpu"
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AlertCircle size={32} strokeWidth={3} className="text-[#f43f5e]" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Title & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center relative z-10 shrink-0"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Payment failed
          </h1>
          <p className="text-sm text-zinc-400 font-medium mt-1.5 mb-6">
            Don&apos;t worry, no charges were made
          </p>
        </motion.div>

        {/* Error Details Body */}
        <div className="relative z-10 flex-grow flex flex-col justify-between">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-5"
          >
            {/* Dark Error Summary Box */}
            <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-zinc-400 font-medium">Status</span>
                <span className="font-bold text-rose-500 tracking-wide uppercase">
                  Declined / Failed
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-zinc-400 font-medium">Error reason</span>
                <span className="font-bold text-white capitalize text-right">
                  {reason.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-zinc-400 font-medium">Refund guarantee</span>
                <span className="font-bold text-emerald-400 text-right">
                  100% Auto-Refund if debited
                </span>
              </div>
            </div>

            {/* Subtle Divider Line */}
            <div className="h-px bg-zinc-800/80 w-full" />

            <p className="text-xs text-center text-zinc-500 font-medium leading-relaxed px-2">
              Please try again using a different payment method or check your UPI app / bank balance.
            </p>
          </motion.div>
          
          {/* Stacked Apple/Shopify Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-6 shrink-0 space-y-2.5"
          >
            <Link
              href="/checkout"
              className="w-full py-3.5 bg-white hover:bg-zinc-100 text-black font-bold text-sm rounded-2xl shadow-sm transition-all text-center block active:scale-[0.99] transform-gpu"
            >
              Try again
            </Link>
            <Link
              href="/cart"
              className="w-full py-3.5 bg-[#121214]/80 hover:bg-[#121214] border border-zinc-800 text-white font-bold text-sm rounded-2xl transition-all text-center block active:scale-[0.99] transform-gpu"
            >
              Return to cart
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#101012] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutFailureContent />
    </Suspense>
  );
}
