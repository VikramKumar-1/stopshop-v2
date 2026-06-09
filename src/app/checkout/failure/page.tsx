"use client";
import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCcw, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

function CheckoutFailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason") || "An unknown error occurred during payment processing.";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-red-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-surface-card border border-border rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_60px_rgba(239,68,68,0.1)] relative backdrop-blur-xl flex flex-col overflow-hidden"
      >
        {/* Top Full Red Div */}
        <div className="bg-gradient-to-b from-red-500 to-red-600 px-4 py-5 sm:py-6 text-center relative z-10 shrink-0">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-red-500 flex items-center justify-center mx-auto shadow-xl shadow-black/10 mb-3 sm:mb-4"
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AlertCircle size={28} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
          
          <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight mb-1">
            Payment Failed
          </h1>
          <p className="text-[10px] sm:text-xs text-red-50 max-w-sm mx-auto leading-relaxed">
            We couldn't process your payment. Don't worry, no charges were made.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="p-4 sm:p-5 relative z-10 flex-grow bg-surface-card flex flex-col justify-between">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Reason Box */}
            <div className="flex gap-2 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
              <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={14} />
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-heading">Error Reason</p>
                <p className="text-[9px] sm:text-[10px] text-red-600 dark:text-red-400 mt-0.5 leading-snug capitalize">
                  {reason.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[9px] sm:text-[10px] text-muted">
                Please try again with a different payment method, or contact your bank if the issue persists.
              </p>
            </div>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 pt-4 mt-auto border-t border-border/60 shrink-0"
          >
            <Link
              href="/cart"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 sm:py-3 bg-surface border-2 border-border hover:border-red-500 hover:text-red-600 text-heading font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg transition-all"
            >
              <ArrowLeft size={14} />
              Return
            </Link>
            <Link
              href="/checkout"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-lg shadow-sm shadow-red-500/20 transition-all group"
            >
              <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Try Again
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutFailureContent />
    </Suspense>
  );
}
