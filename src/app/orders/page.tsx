"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, ArrowRight, User as UserIcon, Lock, Package, Truck, CheckCircle2 } from "lucide-react";
import { countries } from "@/lib/countries";

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Auth Forms State (if not logged in)
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [oauthError, setOauthError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("active");

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/oauth/google?redirect=${encodeURIComponent("/orders")}`;
  };

  const fetchProfileAndOrders = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.authenticated) {
          setUser(meData.user);
          // Fetch user's B2B Inquiries/Orders
          const inqRes = await fetch("/api/inquiries");
          if (inqRes.ok) {
            const inqData = await inqRes.json();
            setInquiries(inqData);
          }
        }
      }
    } catch (err) {
      console.error("Error loading orders page profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndOrders();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email, password, rememberMe }
      : { name, email, password, role: "user", rememberMe };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        fetchProfileAndOrders();
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setUser(null);
    setInquiries([]);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Not Logged In - Render Login / Signup Form
  if (!user) {
    return (
      <div className="min-h-screen bg-surface pt-6 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-surface-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-bronze-500/5 rounded-full blur-3xl -z-10" />

          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-heading">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[11px] text-muted mt-1.5 leading-normal">
              Sign in to track your custom B2B orders & quotes
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
            {(authError || oauthError) && (
              <div className="p-3 bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl font-medium">
                {authError || oauthError}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-2.5 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border focus:border-orange-500 rounded-xl text-heading outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border focus:border-orange-500 rounded-xl text-heading outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border focus:border-orange-500 rounded-xl text-heading outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-orange-500 focus:ring-orange-500 bg-surface accent-orange-500"
                />
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-1.5"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? "Sign In" : "Register"}
              {!authLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-muted text-[10px] uppercase font-bold tracking-wider">or</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-surface border border-border hover:bg-surface-hover text-heading font-bold rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.44 3.73 1.64 7.69l3.77 2.92C6.31 7.07 8.92 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.44c-.28 1.48-1.12 2.74-2.38 3.59l3.7 2.87c2.16-2 3.73-4.94 3.73-8.56z" />
                <path fill="#FBBC05" d="M5.41 14.88c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.64 7.38C.6 9.48 0 11.67 0 14s.6 4.52 1.64 6.62l3.77-2.74z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.08 0-5.69-2.03-6.62-5.57L1.61 15.48C3.41 19.44 7.34 23 12 23z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="mt-6 text-center border-t border-border pt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setAuthError("");
              }}
              className="text-xs text-orange-500 hover:text-orange-600 font-bold transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeInquiries = inquiries.map(inq => {
    let items = inq.items;
    if (typeof items === "string") {
      try { items = JSON.parse(items); } catch (e) { items = []; }
    }
    const itemsArr = Array.isArray(items) ? items : [];
    const activeItems = itemsArr.filter(item => !["DELIVERED", "CANCELLED", "RETURNED"].includes(item.status || "PENDING"));
    return { ...inq, items: activeItems };
  }).filter(inq => inq.items.length > 0);

  const archiveInquiries = inquiries.map(inq => {
    let items = inq.items;
    if (typeof items === "string") {
      try { items = JSON.parse(items); } catch (e) { items = []; }
    }
    const itemsArr = Array.isArray(items) ? items : [];
    const archivedItems = itemsArr.filter(item => ["DELIVERED", "CANCELLED", "RETURNED"].includes(item.status || "PENDING"));
    return { ...inq, items: archivedItems };
  }).filter(inq => inq.items.length > 0);

  const activeItemsCount = activeInquiries.reduce((sum, inq) => sum + inq.items.length, 0);
  const archiveItemsCount = archiveInquiries.reduce((sum, inq) => sum + inq.items.length, 0);

  // Logged In - Render Orders tracking
  return (
    <div className="min-h-screen bg-surface pt-10 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 pb-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all border-b-2 outline-none cursor-pointer ${
              activeTab === "active"
                ? "border-orange-500 text-orange-500 font-bold"
                : "border-transparent text-muted hover:text-heading"
            }`}
          >
            Active Orders & Quotes ({activeItemsCount})
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`flex-1 pb-4 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all border-b-2 outline-none cursor-pointer ${
              activeTab === "archived"
                ? "border-orange-500 text-orange-500 font-bold"
                : "border-transparent text-muted hover:text-heading"
            }`}
          >
            Delivered & Archival History ({archiveItemsCount})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {activeTab === "active" ? (
            activeInquiries.length === 0 ? (
              <div className="text-center py-16 bg-surface-card border border-border rounded-3xl">
                <p className="text-sm text-muted">You have no active orders or quotes at the moment.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeInquiries.map((inq) => (
                  <div key={inq.id} className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                    {/* Inquiry Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-border text-xs">
                      <div>
                        <span className="font-bold text-muted uppercase">Inquiry ID:</span>
                        <span className="font-bold text-heading ml-1.5 bg-surface border border-border px-2 py-0.5 rounded-lg">#{inq.id}</span>
                      </div>
                      <div className="text-muted">
                        Requested on: <span className="font-bold text-heading">{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Items list with progressive tracking timelines */}
                    <div className="space-y-6 divide-y divide-border/40">
                      {inq.items.map((item: any, idx: number) => {
                        const status = item.status || "PENDING";
                        const deliveryDate = item.deliveryDate || "";

                        return (
                          <div key={idx} className="pt-6 first:pt-0 space-y-6">
                            {/* Item header */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-white flex-shrink-0 relative">
                                <img src={item.image || "/logo4.jpg"} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-heading text-xs">{item.name}</h4>
                                <span className="text-[9px] font-bold text-muted uppercase bg-surface border border-border px-1.5 py-0.5 rounded">
                                  {item.orderType || "Bulk Order"}
                                </span>
                              </div>
                            </div>

                            {/* Stepper Timeline */}
                            <div className="relative pt-4 pb-2">
                              {/* Horizontal bar */}
                              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-10" />

                              <div className="grid grid-cols-4 text-center text-[10px] font-bold relative">
                                {/* Step 1: Pending */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                                    status === "PENDING"
                                      ? "bg-yellow-500 border-yellow-600 text-white shadow-md shadow-yellow-500/20"
                                      : "bg-emerald-500 border-emerald-600 text-white"
                                  }`}>
                                    {status === "PENDING" ? "●" : "✓"}
                                  </div>
                                  <span className={`mt-2 ${status === "PENDING" ? "text-yellow-600 dark:text-yellow-400" : "text-muted"}`}>Inquiry Sent</span>
                                </div>

                                {/* Step 2: Packed */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                                    status === "PACKED"
                                      ? "bg-blue-500 border-blue-600 text-white shadow-md shadow-blue-500/20 animate-pulse"
                                      : ["DISPATCHED", "DELIVERED"].includes(status)
                                      ? "bg-emerald-500 border-emerald-600 text-white"
                                      : "bg-surface border-border text-muted"
                                  }`}>
                                    {status === "PENDING" ? "2" : status === "PACKED" ? "●" : "✓"}
                                  </div>
                                  <span className={`mt-2 ${status === "PACKED" ? "text-blue-600 dark:text-blue-400" : "text-muted"}`}>Workshop Packed</span>
                                </div>

                                {/* Step 3: Dispatched */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                                    status === "DISPATCHED"
                                      ? "bg-orange-500 border-orange-600 text-white shadow-md shadow-orange-500/20"
                                      : status === "DELIVERED"
                                      ? "bg-emerald-500 border-emerald-600 text-white"
                                      : "bg-surface border-border text-muted"
                                  }`}>
                                    {["PENDING", "PACKED"].includes(status) ? "3" : status === "DISPATCHED" ? "●" : "✓"}
                                  </div>
                                  <span className={`mt-2 ${status === "DISPATCHED" ? "text-orange-600 dark:text-orange-400 font-bold" : "text-muted"}`}>
                                    {status === "DISPATCHED" ? "Delivering Today!" : "Dispatched"}
                                  </span>
                                  {status === "DISPATCHED" && deliveryDate && (
                                    <span className="text-[8px] text-orange-500 mt-0.5">Est: {new Date(deliveryDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                  )}
                                </div>

                                {/* Step 4: Delivered */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                                    status === "DELIVERED"
                                      ? "bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                      : "bg-surface border-border text-muted"
                                  }`}>
                                    {status === "DELIVERED" ? "✓" : "4"}
                                  </div>
                                  <span className={`mt-2 ${status === "DELIVERED" ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted"}`}>Delivered</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            archiveInquiries.length === 0 ? (
              <div className="text-center py-16 bg-surface-card border border-border rounded-3xl">
                <p className="text-sm text-muted">You have no delivered or archived history.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {archiveInquiries.map((inq) => (
                  <div key={inq.id} className="bg-surface-card/60 border border-border rounded-3xl p-6 shadow-sm opacity-95 space-y-4">
                    {/* Inquiry Header */}
                    <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-border text-xs">
                      <div>
                        <span className="font-bold text-muted uppercase">Inquiry ID:</span>
                        <span className="font-bold text-heading ml-1.5 bg-surface border border-border px-2 py-0.5 rounded-lg">#{inq.id}</span>
                      </div>
                      <div className="text-muted">
                        Requested on: <span className="font-bold text-heading">{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Items list */}
                    <div className="space-y-4 divide-y divide-border/40">
                      {inq.items.map((item: any, idx: number) => {
                        const status = item.status || "PENDING";
                        const deliveryDate = item.deliveryDate || "";

                        return (
                          <div key={idx} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            {/* Item details */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-white flex-shrink-0 relative opacity-75">
                                <img src={item.image || "/logo4.jpg"} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-muted text-xs">{item.name}</h4>
                                <div className="flex gap-2 items-center mt-1">
                                  <span className="text-[9px] font-bold text-muted uppercase bg-surface border border-border px-1.5 py-0.5 rounded">
                                    {item.orderType || "Bulk Order"}
                                  </span>
                                  {status === "DELIVERED" && deliveryDate && (
                                    <span className="text-[9px] text-emerald-600 font-semibold">Delivered on: {new Date(deliveryDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status display banner */}
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                                status === "DELIVERED" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                                status === "RETURNED" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                                "bg-red-500/5 text-red-500 border-red-500/20"
                              }`}>
                                {status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
