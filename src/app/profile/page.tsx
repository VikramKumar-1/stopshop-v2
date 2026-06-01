"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, User as UserIcon, Lock, Loader2, ArrowRight, Edit3 } from "lucide-react";
import { parseLocation } from "@/lib/pincodeResolver";
import { countries, getPhoneRule } from "@/lib/countries";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);


  // Auth Forms State
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [oauthError, setOauthError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // User Profile Form States
  const [profileName, setProfileName] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [phoneCodeSearch, setPhoneCodeSearch] = useState("");

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCodes = countries.filter(
    (item) =>
      item.name.toLowerCase().includes(phoneCodeSearch.toLowerCase()) ||
      item.dial_code.includes(phoneCodeSearch)
  );

  const selectedCode = countries.find((item) => item.dial_code === phoneCode);
  const phoneRule = getPhoneRule(phoneCode);

  const handleGoogleLogin = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get("redirect") || "/profile";
    window.location.href = `/api/auth/oauth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const fetchProfileAndOrders = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.authenticated) {
          const searchParams = new URLSearchParams(window.location.search);
          const redirectUrl = searchParams.get("redirect") || "";
          
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
          setUser(meData.user);
          setProfileName(meData.user.name || "");
          
          const fullMobile = meData.user.mobile || "";
          if (fullMobile.startsWith("+")) {
            const parts = fullMobile.split(" ");
            if (parts.length >= 2) {
              setPhoneCode(parts[0]);
              setMobile(parts.slice(1).join(" "));
            } else {
              const matched = countries.find(item => fullMobile.startsWith(item.dial_code));
              if (matched) {
                setPhoneCode(matched.dial_code);
                setMobile(fullMobile.slice(matched.dial_code.length).trim());
              } else {
                setPhoneCode("");
                setMobile(fullMobile);
              }
            }
          } else {
            setPhoneCode("");
            setMobile(fullMobile);
          }

          if (meData.user.location) {
            const loc = parseLocation(meData.user.location);
            setCompanyName(loc.city || "");
            setCountry(loc.country || "");
            setShippingAddress(loc.address || "");
          }

        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndOrders();
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      setOauthError(err);
    }
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
        // Successful login/registration
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get("redirect") || "";

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          setUser(data.user);
          fetchProfileAndOrders();
          window.location.reload(); // Refresh page to update the Navbar state
        }
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

  };

  const handleUpdateName = async (newName: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error updating name:", err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const rule = getPhoneRule(phoneCode);
      const digitCount = mobile.replace(/\D/g, "").length;
      if (phoneCode && (digitCount < rule.minLength || digitCount > rule.maxLength)) {
        alert(`Please enter a valid phone number for the selected country (must be between ${rule.minLength} and ${rule.maxLength} digits).`);
        setSaving(false);
        return;
      }
      // Format B2B location details into compatible parts[0], parts[2], parts[4]
      // parts[0] (city) -> companyName, parts[1] (state) -> "", parts[2] (country) -> country, parts[3] (pincode) -> "", parts[4] (address) -> shippingAddress
      const combinedLocation = `${companyName} |  | ${country} |  | ${shippingAddress}`;
      const combinedMobile = phoneCode ? `${phoneCode} ${mobile}`.trim() : mobile.trim();
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          mobile: combinedMobile,
          location: combinedLocation,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert("Failed to update profile details");
      }
    } catch (err) {
      console.error("Error saving profile details:", err);
      alert("Error saving profile details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pt-6 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Not Logged In - Render Login / Signup Form
  if (!user) {
    return (
      <div className="min-h-screen bg-surface pt-6 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-surface-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle gradient highlights */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-bronze-500/5 rounded-full blur-3xl -z-10" />

          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-heading">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[11px] text-muted mt-1.5 leading-normal">
              {isLogin ? "Sign in to track your custom B2B orders & quotes" : "Register to start ordering premium handcrafts"}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOauthError("");
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setOauthError("");
                  }}
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

  // Logged In - Render Dashboard & Orders tracking
  return (
    <div className="min-h-screen bg-surface pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card Header */}
        <div className="bg-[#800000] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative overflow-hidden border border-orange-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
              <UserIcon size={32} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-orange-400">{user.name}</h2>
              <p className="text-xs text-orange-300/80 flex items-center gap-1.5 mt-1">
                <Mail size={12} className="text-orange-400" />
                {user.email} | <span className="font-bold text-orange-400 uppercase tracking-wider text-[10px] bg-orange-500/15 px-2 py-0.5 rounded-md">{user.role} Account</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-orange-500/20 hover:bg-orange-500/10 text-orange-400 rounded-xl text-xs font-semibold transition-all hover:border-orange-500/50"
          >
            Sign Out Account
          </button>
        </div>

        {/* Become a Vendor Invite Banner */}
        {user && user.role === "user" && (
          <div className="bg-gradient-to-r from-orange-500/10 via-orange-600/5 to-transparent border border-orange-500/25 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-4xl mx-auto shadow-sm">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-heading font-display">Want to sell your handcrafted products?</h4>
              <p className="text-[11px] text-muted mt-1">Upgrade your account to a Vendor account to list and sell copper, brass, and bronze handicrafts globally.</p>
            </div>
            <button
              onClick={() => window.location.href = "/vendor/register"}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all whitespace-nowrap active:scale-[0.97]"
            >
              Become a Seller
            </button>
          </div>
        )}

        {/* Centered Account Profile Details Card */}
        <div className="bg-surface-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 mb-8 relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="font-display font-bold text-sm text-heading uppercase tracking-wider">
              Account Profile Details
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border cursor-pointer ${
                isEditing
                  ? "bg-orange-500/10 text-orange-500 border-orange-500/30"
                  : "bg-surface hover:bg-surface-hover border-border text-muted hover:text-heading"
              }`}
            >
              <Edit3 size={14} />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email Address - Read Only */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    readOnly
                    value={user?.email || ""}
                    className="w-full pl-10 pr-4 py-3 bg-surface/30 border border-border/40 rounded-xl text-muted outline-none cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    required
                    value={profileName}
                    readOnly={!isEditing}
                    onClick={() => setIsEditing(true)}
                    onFocus={() => setIsEditing(true)}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all ${
                      isEditing ? "border-orange-500/50 focus:border-orange-500 focus:bg-surface-card" : "border-border/50 bg-surface/40 animate-pulse-subtle"
                    }`}
                  />
                </div>
              </div>

              {/* Mobile / Phone Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Phone / WhatsApp Number</label>
                <div className="flex gap-2 relative">
                  {/* Searchable Dropdown Button */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() => {
                        setIsEditing(true);
                        setPhoneDropdownOpen(!phoneDropdownOpen);
                      }}
                      className="h-full px-2.5 rounded-xl bg-surface border border-border text-heading text-xs flex items-center gap-1.5 min-w-[85px] justify-between focus:border-orange-500 transition-all py-3"
                    >
                      <span className="flex items-center gap-1">
                        {selectedCode ? (
                          <>
                            <img
                              src={`https://flagcdn.com/w20/${selectedCode.code.toLowerCase()}.png`}
                              alt={selectedCode.name}
                              className="w-5 h-3.5 object-cover rounded-sm"
                            />
                            <span>{selectedCode.dial_code}</span>
                          </>
                        ) : (
                          "Code"
                        )}
                      </span>
                      <span className="text-[8px] text-muted">▼</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {phoneDropdownOpen && isEditing && (
                      <div className="absolute top-full left-0 mt-1.5 w-60 bg-[var(--surface)] border border-border shadow-2xl rounded-xl p-2 z-50">
                        <input
                          type="text"
                          placeholder="Search code..."
                          value={phoneCodeSearch}
                          onChange={(e) => setPhoneCodeSearch(e.target.value)}
                          className="w-full px-3 py-1.5 mb-2 rounded-lg bg-surface-card border border-border text-xs text-heading outline-none focus:border-orange-500"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-0.5 text-xs">
                          {filteredCodes.length > 0 ? (
                            filteredCodes.map((item) => (
                              <button
                                key={item.name}
                                type="button"
                                onClick={() => {
                                  setPhoneCode(item.dial_code);
                                  setPhoneDropdownOpen(false);
                                  setPhoneCodeSearch("");
                                }}
                                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-hover flex items-center justify-between text-heading transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <img
                                    src={`https://flagcdn.com/w20/${item.code.toLowerCase()}.png`}
                                    alt={item.name}
                                    className="w-5 h-3.5 object-cover rounded-sm"
                                  />
                                  <span>{item.name}</span>
                                </span>
                                <span className="font-semibold text-muted">{item.dial_code}</span>
                              </button>
                            ))
                          ) : (
                            <div className="text-center py-2 text-muted text-[10px]">No matches found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    required
                    disabled={isEditing && !phoneCode}
                    readOnly={!isEditing}
                    value={mobile}
                    maxLength={phoneRule.maxLength}
                    placeholder={phoneCode ? `e.g. ${phoneRule.placeholder}` : "Select country code first"}
                    onClick={() => setIsEditing(true)}
                    onFocus={() => setIsEditing(true)}
                    onChange={(e) => {
                      const cleanDigits = e.target.value.replace(/\D/g, "");
                      setMobile(cleanDigits.slice(0, phoneRule.maxLength));
                    }}
                    className={`flex-grow pl-4 pr-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all ${
                      isEditing ? "border-orange-500/50 focus:border-orange-500 focus:bg-surface-card" : "border-border/50 bg-surface/40"
                    } ${isEditing && !phoneCode ? "cursor-not-allowed opacity-50 bg-surface/20" : ""}`}
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Country</label>
                {isEditing ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      className="w-full px-4 py-3 bg-surface border border-orange-500/50 focus:border-orange-500 rounded-xl text-left text-heading outline-none transition-all flex justify-between items-center"
                    >
                      <span>{country || "Select Country"}</span>
                      <span className="text-[8px] text-muted">▼</span>
                    </button>
                    {countryDropdownOpen && (
                      <div className="absolute bottom-full left-0 mb-1.5 w-full bg-[var(--surface)] border border-border shadow-2xl rounded-xl p-2 z-[99] text-xs">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-3 py-1.5 mb-2 rounded-lg bg-surface-card border border-border text-xs text-heading outline-none focus:border-orange-500"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => {
                                  setCountry(c.name);
                                  setCountryDropdownOpen(false);
                                  setCountrySearch("");
                                }}
                                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-hover text-heading transition-colors"
                              >
                                {c.name}
                              </button>
                            ))
                          ) : (
                            <div className="text-center py-2 text-muted text-[10px]">No countries found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={country}
                    placeholder="Not specified"
                    onClick={() => setIsEditing(true)}
                    onFocus={() => setIsEditing(true)}
                    className="w-full px-4 py-3 bg-surface/40 border border-border/50 rounded-xl text-heading outline-none cursor-pointer"
                  />
                )}
              </div>

              {/* Company / Business Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  readOnly={!isEditing}
                  placeholder="e.g. Global Trade LLC (Optional)"
                  onClick={() => setIsEditing(true)}
                  onFocus={() => setIsEditing(true)}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={`w-full px-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all ${
                    isEditing ? "border-orange-500/50 focus:border-orange-500 focus:bg-surface-card" : "border-border/50 bg-surface/40"
                  }`}
                />
              </div>
            </div>

            {/* Default Shipping Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Default B2B Shipping Address</label>
              <textarea
                rows={3}
                value={shippingAddress}
                readOnly={!isEditing}
                placeholder="Enter your complete international delivery address including city, state/province, postal/zip code..."
                onClick={() => setIsEditing(true)}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => setShippingAddress(e.target.value)}
                className={`w-full px-4 py-3 bg-surface border rounded-xl text-heading outline-none resize-none transition-all ${
                  isEditing ? "border-orange-500/50 focus:border-orange-500 focus:bg-surface-card" : "border-border/50 bg-surface/40"
                }`}
              />
            </div>

            {/* Save Buttons & Toast */}
            {isEditing && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-md transition-all duration-300 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer animate-in fade-in zoom-in duration-200"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  {saving ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-center font-bold text-xs uppercase tracking-wider animate-in fade-in duration-300">
                ✓ B2B Profile Details Updated Successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
