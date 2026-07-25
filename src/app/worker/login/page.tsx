"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Camera, Loader2, KeyRound } from "lucide-react";

export default function WorkerLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/worker/studio";
  const inviteParam = searchParams.get("invite") || "";

  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: inviteParam,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await res.json();
        if (res.ok) {
          router.push(redirect);
        } else {
          setError(data.error || "Login failed");
        }
      } else {
        const reqBody = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
          inviteCode: formData.inviteCode,
        };
        
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        });
        const data = await res.json();
        
        if (res.ok) {
          router.push(redirect);
        } else {
          setError(data.error || "Registration failed");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 shadow-xl shadow-orange-500/20 mb-4">
            <Camera size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-black text-heading tracking-tight">Worker Portal</h1>
          <p className="text-muted mt-2">Login to access the packing studio</p>
        </div>

        <div className="bg-surface-card border border-border/80 rounded-[2rem] p-6 shadow-2xl shadow-black/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase ml-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-orange-500 text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase ml-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-orange-500 text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-bold text-orange-500 uppercase ml-1 flex items-center gap-1">
                  <KeyRound size={10} /> Vendor Invite Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
                  readOnly={!!inviteParam}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none text-sm font-mono transition-colors ${inviteParam ? "bg-orange-500/10 border-orange-500/50 text-orange-700 cursor-not-allowed" : "bg-orange-500/5 border-orange-500/30 text-orange-600 focus:border-orange-500"}`}
                  placeholder="e.g. VEND-1234"
                />
                <p className="text-[9px] text-muted ml-1 mt-1">Ask your vendor for this code to link your account.</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {isLogin ? "Sign In" : "Register as Worker"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} type="button" className="text-orange-500 hover:underline">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
