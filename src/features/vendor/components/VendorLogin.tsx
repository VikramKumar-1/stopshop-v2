"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Store, Mail, Lock, ArrowRight } from "lucide-react";

export const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user.role === "vendor") {
          const params = new URLSearchParams(window.location.search);
          const redirectUrl = params.get("redirect") || "/vendor/dashboard";
          window.location.href = redirectUrl;
        } else {
          setError("Access denied. This portal is strictly for registered artisans and vendors.");
        }
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("An unexpected server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-card border border-border p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-2">
            <Store size={24} />
          </div>
          <h1 className="text-2xl font-display font-bold text-heading">Artisan Vendor Login</h1>
          <p className="text-xs text-muted">Access your StopShop craftsman inventory and store dashboard.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-500/5 text-red-500 text-xs border border-red-500/20 rounded-xl">{error}</div>}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="artisan@stopshop.com"
                className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-heading focus:outline-none"
              />
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-border focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-heading focus:outline-none"
              />
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-orange-500/10"
          >
            {loading ? "Signing In..." : "Sign In to Vendor Dashboard"}
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted text-[10px] uppercase font-bold tracking-wider">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "/api/auth/oauth/google?role=vendor&redirect=/vendor/dashboard"}
            className="w-full py-3.5 bg-surface border border-border hover:bg-surface-hover text-heading font-bold rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2 text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.44 3.73 1.64 7.69l3.77 2.92C6.31 7.07 8.92 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.44c-.28 1.48-1.12 2.74-2.38 3.59l3.7 2.87c2.16-2 3.73-4.94 3.73-8.56z"
              />
              <path
                fill="#FBBC05"
                d="M5.41 14.88c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.64 7.38C.6 9.48 0 11.67 0 14s.6 4.52 1.64 6.62l3.77-2.74z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.08 0-5.69-2.03-6.62-5.57L1.61 15.48C3.41 19.44 7.34 23 12 23z"
              />
            </svg>
            Sign In with Google
          </button>
        </form>

        <div className="border-t border-border pt-4 text-center">
          <p className="text-xs text-muted">
            New craftsman?{" "}
            <Link href="/vendor/register" className="text-orange-500 font-bold hover:underline inline-flex items-center gap-0.5">
              Create Vendor Account
              <ArrowRight size={12} />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
