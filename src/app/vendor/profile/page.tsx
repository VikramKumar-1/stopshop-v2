"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User as UserIcon, Mail, Store, Loader2, Award, ShieldCheck, MapPin, Phone, FileText, CheckCircle, Upload, Eye, Edit3 } from "lucide-react";
import { resolvePincodeOffline, parseLocation } from "@/lib/pincodeResolver";

export default function VendorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [workshopName, setWorkshopName] = useState("");
  const [mobile, setMobile] = useState("");
  const [artisanId, setArtisanId] = useState("");
  const [gstin, setGstin] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  
  // Split Location States
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("India");
  const [pincode, setPincode] = useState("");
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeSuccess, setPincodeSuccess] = useState("");
  const [workshopAddress, setWorkshopAddress] = useState("");

  // Document Upload States
  const [aadhaarUrl, setAadhaarUrl] = useState("");
  const [panUrl, setPanUrl] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  
  // Edit & Toast States
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.authenticated && meData.user.role === "vendor") {
          setUser(meData.user);
          setWorkshopName(meData.user.name || "");
          setMobile(meData.user.mobile || "");
          
          const savedLoc = meData.user.location || "";
          const loc = parseLocation(savedLoc);
          setCity(loc.city);
          setStateName(loc.state);
          setCountry(loc.country);
          setPincode(loc.pincode);
          setWorkshopAddress(loc.address);

          setArtisanId(meData.user.artisanId || "");
          setGstin(meData.user.gstin || "");
          setAadhaar(meData.user.aadhaar || "");
          setPan(meData.user.pan || "");
          setAadhaarUrl(meData.user.aadhaarUrl || "");
          setPanUrl(meData.user.panUrl || "");
          setDocUrl(meData.user.docUrl || "");
        } else {
          window.location.href = "/profile";
        }
      } else {
        window.location.href = "/profile";
      }
    } catch (err) {
      console.error("Error loading vendor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (val: string) => {
    let clean = val;
    const digits = val.replace(/\D/g, "");
    if (digits.length === 10 && !val.includes("+")) {
      clean = `+91 ${digits}`;
    } else if (digits.length === 12 && digits.startsWith("91") && !val.includes("+")) {
      clean = `+91 ${digits.slice(2)}`;
    }
    setMobile(clean);
  };

  const handleMobileBlur = () => {
    const digits = mobile.replace(/\D/g, "");
    if (digits.length === 10) {
      setMobile(`+91 ${digits}`);
    } else if (digits.length === 12 && digits.startsWith("91")) {
      setMobile(`+91 ${digits.slice(2)}`);
    }
  };

  const handlePincodeChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, "").slice(0, 6);
    setPincode(cleanVal);
    setPincodeError(""); // Clear previous error
    setPincodeSuccess(""); // Clear previous success
    
    if (cleanVal.length === 6) {
      if (cleanVal.startsWith("0")) {
        setPincodeError("Pincode does not exist in India.");
        return;
      }
      
      const offlineResult = resolvePincodeOffline(cleanVal);
      if (!offlineResult) {
        setPincodeError("Pincode does not exist in India.");
      }
    }
  };

  const triggerPincodeLookup = async () => {
    setPincodeSuccess("");
    if (pincode.length !== 6) {
      setPincodeError("Please enter a 6-digit pincode.");
      return;
    }

    if (pincode.startsWith("0")) {
      setPincodeError("Pincode does not exist in India.");
      return;
    }

    // 1. Instant local offline lookup
    const offlineResult = resolvePincodeOffline(pincode);
    if (offlineResult) {
      setCity(offlineResult.city);
      setStateName(offlineResult.state);
      setCountry(offlineResult.country);
      if (offlineResult.city) {
        // If city/district is resolved locally, skip calling APIs
        setPincodeSuccess("Pincode verified successfully.");
        return;
      }
    } else {
      setPincodeError("Pincode does not exist in India.");
      return;
    }

    setLoadingPincode(true);
    try {
      const res = await fetch(`/api/pincode?code=${pincode}`);
      if (res.ok) {
        const data = await res.json();
        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const office = data[0].PostOffice[0];
          setCity(office.District || office.Division || "");
          setStateName(office.State || "");
          setCountry(office.Country || "India");
          setPincodeSuccess("Pincode verified successfully.");
        } else {
          setCity("");
          setStateName("");
          setPincodeError("Pincode does not exist in India.");
        }
      } else {
        setCity("");
        setStateName("");
        setPincodeError("Pincode does not exist in India.");
      }
    } catch (err) {
      console.error("Error fetching pincode data:", err);
      setPincodeError("Pincode verification offline. Please enter details manually.");
    } finally {
      setLoadingPincode(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "aadhaar" | "pan" | "doc") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "aadhaar") setUploadingAadhaar(true);
    if (type === "pan") setUploadingPan(true);
    if (type === "doc") setUploadingDoc(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (type === "aadhaar") {
          setAadhaarUrl(data.url);
        }
        if (type === "pan") {
          setPanUrl(data.url);
        }
        if (type === "doc") {
          setDocUrl(data.url);
        }
      } else {
        alert("Failed to upload document image");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading document");
    } finally {
      if (type === "aadhaar") setUploadingAadhaar(false);
      if (type === "pan") setUploadingPan(false);
      if (type === "doc") setUploadingDoc(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const combinedLocation = `${city} | ${stateName} | ${country} | ${pincode} | ${workshopAddress}`;
      // Update details in Database
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workshopName,
          mobile,
          location: combinedLocation,
          artisanId,
          gstin,
          aadhaar,
          pan,
          aadhaarUrl,
          panUrl,
          docUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false); // Lock fields back
        setToastMessage("Vendor profile updated successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update profile details");
      }
    } catch (err) {
      console.error("Error saving profile details:", err);
      alert("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    window.location.href = "/vendor/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pt-6 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface pt-6 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Form & Detailed Hub Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Premium Summary Status card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-premium-maroon border border-orange-500/25 rounded-3xl p-6 shadow-sm relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -z-10" />
              <h3 className="font-display font-bold text-lg text-zinc-100 flex items-center gap-2 mb-4">
                <Store size={20} className="text-orange-400" />
                Artisan Verification
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-0.5">Workshop / Business Name</span>
                  <span className="font-bold text-sm text-zinc-100">{user.name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Mobile Number</span>
                  <span className="font-bold text-zinc-100">{mobile || "Not Provided"}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Location</span>
                  <span className="font-bold text-zinc-100 flex items-center gap-1">
                    <MapPin size={12} className="text-orange-400" />
                    {city ? `${workshopAddress ? workshopAddress + ", " : ""}${city}, ${stateName}, ${country}` : "Not Provided"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Pincode</span>
                  <span className="font-bold text-zinc-100">{pincode || "Not Provided"}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Documents & Images</span>
                  <div className="space-y-2 mt-2 text-[11px] font-semibold">
                    <div className="flex items-center justify-between">
                      <span className={artisanId ? "text-emerald-400" : "text-zinc-500"}>
                        {artisanId ? `✔ Artisan ID: ${artisanId}` : "✘ Artisan ID Missing"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={gstin ? "text-emerald-400" : "text-zinc-500"}>
                        {gstin ? `✔ GSTIN: ${gstin}` : "✘ GSTIN Missing"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800/60">
                      <span className={aadhaar ? "text-emerald-400" : "text-zinc-500"}>
                        {aadhaar ? "✔ Aadhaar Card Number" : "✘ Aadhaar Card Number"}
                      </span>
                      {aadhaarUrl && (
                        <a href={aadhaarUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 flex items-center gap-0.5 font-bold">
                          <Eye size={10} /> View File
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800/60">
                      <span className={pan ? "text-emerald-400" : "text-zinc-500"}>
                        {pan ? "✔ PAN Card Number" : "✘ PAN Card Number"}
                      </span>
                      {panUrl && (
                        <a href={panUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 flex items-center gap-0.5 font-bold">
                          <Eye size={10} /> View File
                        </a>
                      )}
                    </div>

                    {docUrl && (
                      <div className="flex items-center justify-between bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800/60">
                        <span className="text-emerald-400">✔ Important Doc</span>
                        <a href={docUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 flex items-center gap-0.5 font-bold">
                          <Eye size={10} /> View File
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-800/60">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold uppercase tracking-wider text-[9px]">
                    Verified Artisan Exporter
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-sm text-heading">Quick Actions</h4>
              <div className="flex flex-col gap-3.5">
                <Link
                  href={user?.role === "vendor" ? "/vendor/dashboard" : "/profile"}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  {user?.role === "vendor" ? "Go to Vendor Dashboard" : "Go to User Dashboard"}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="font-display font-bold text-lg text-heading">
                  Update Vendor Profile Details
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 border ${
                    isEditing
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/30"
                      : "bg-surface-card hover:bg-surface border-border text-muted hover:text-heading"
                  }`}
                >
                  <Edit3 size={14} />
                  {isEditing ? "Editing Mode" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Workshop Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Workshop / Business Name</label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      required
                      value={workshopName}
                      readOnly={!isEditing}
                      onClick={() => setIsEditing(true)}
                      onFocus={() => setIsEditing(true)}
                      onChange={(e) => setWorkshopName(e.target.value)}
                      placeholder="e.g. Moradabad Handicrafts Hub"
                      className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                        isEditing 
                          ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                          : "border-border/50 cursor-pointer hover:border-orange-500/30"
                      }`}
                    />
                  </div>
                </div>

                {/* Mobile Number & Pincode Lookup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                      <input
                        type="tel"
                        required
                        value={mobile}
                        readOnly={!isEditing}
                        onClick={() => setIsEditing(true)}
                        onFocus={() => setIsEditing(true)}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        onBlur={handleMobileBlur}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                          isEditing 
                            ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                            : "border-border/50 cursor-pointer hover:border-orange-500/30"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">India Pincode</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        readOnly={!isEditing}
                        onClick={() => setIsEditing(true)}
                        onFocus={() => setIsEditing(true)}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="e.g. 244001"
                        className={`w-full pl-10 pr-24 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                          isEditing 
                            ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                            : "border-border/50 cursor-pointer hover:border-orange-500/30"
                        }`}
                      />
                      <button
                        type="button"
                        disabled={pincode.length !== 6 || loadingPincode || !isEditing}
                        onClick={triggerPincodeLookup}
                        className="absolute right-2 top-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold text-[10px] uppercase rounded-lg transition-colors flex items-center gap-1"
                      >
                        {loadingPincode ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                    {pincodeError && (
                      <span className="text-[10px] text-rose-500 font-bold block mt-1 animate-in fade-in duration-200">
                        ⚠️ {pincodeError}
                      </span>
                    )}
                    {pincodeSuccess && (
                      <span className="text-[10px] text-emerald-500 font-bold block mt-1 animate-in fade-in duration-200">
                        ✓ {pincodeSuccess}
                      </span>
                    )}
                  </div>
                </div>

                {/* City, State, Country Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/30 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">City / District</label>
                    <input
                      type="text"
                      required
                      value={city}
                      readOnly={!isEditing}
                      onClick={() => setIsEditing(true)}
                      onFocus={() => setIsEditing(true)}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Moradabad"
                      className={`w-full px-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                        isEditing 
                          ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                          : "border-border/50 cursor-pointer hover:border-orange-500/30"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      readOnly={!isEditing}
                      onClick={() => setIsEditing(true)}
                      onFocus={() => setIsEditing(true)}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Uttar Pradesh"
                      className={`w-full px-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                        isEditing 
                          ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                          : "border-border/50 cursor-pointer hover:border-orange-500/30"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      readOnly={!isEditing}
                      onClick={() => setIsEditing(true)}
                      onFocus={() => setIsEditing(true)}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. India"
                      className={`w-full px-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                        isEditing 
                          ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                          : "border-border/50 cursor-pointer hover:border-orange-500/30"
                      }`}
                    />
                  </div>
                </div>

                {/* Specific Workshop Address / Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Workshop Address / Landmark</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      required
                      value={workshopAddress}
                      readOnly={!isEditing}
                      onClick={() => setIsEditing(true)}
                      onFocus={() => setIsEditing(true)}
                      onChange={(e) => setWorkshopAddress(e.target.value)}
                      placeholder="e.g. Near Brass Bazar, Sector 4, Building 12"
                      className={`w-full pl-10 pr-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                        isEditing 
                          ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                          : "border-border/50 cursor-pointer hover:border-orange-500/30"
                      }`}
                    />
                  </div>
                </div>

                {/* Verification Documents & File Uploads */}
                <div className="border-t border-border pt-4 mt-6">
                  <h4 className="font-display font-bold text-xs text-heading mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} className="text-orange-500" />
                    Required Documents & Image Uploads
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Artisan ID */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Government Artisan ID</label>
                      <input
                        type="text"
                        required
                        value={artisanId}
                        readOnly={!isEditing}
                        onClick={() => setIsEditing(true)}
                        onFocus={() => setIsEditing(true)}
                        onChange={(e) => setArtisanId(e.target.value)}
                        placeholder="Enter Artisan Identity Card Number"
                        className={`w-full px-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                          isEditing 
                            ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                            : "border-border/50 cursor-pointer hover:border-orange-500/30"
                        }`}
                      />
                    </div>

                    {/* GSTIN */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">GSTIN (GST Identification Number)</label>
                      <input
                        type="text"
                        required
                        value={gstin}
                        readOnly={!isEditing}
                        onClick={() => setIsEditing(true)}
                        onFocus={() => setIsEditing(true)}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="Enter 15-digit GSTIN"
                        className={`w-full px-4 py-3 bg-surface border rounded-xl text-heading outline-none transition-all duration-300 ${
                          isEditing 
                            ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                            : "border-border/50 cursor-pointer hover:border-orange-500/30"
                        }`}
                      />
                    </div>

                    {/* Aadhaar Number & Upload */}
                    <div className="space-y-2 bg-surface p-4 rounded-2xl border border-border">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Aadhaar Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={12}
                          value={aadhaar}
                          readOnly={!isEditing}
                          onClick={() => setIsEditing(true)}
                          onFocus={() => setIsEditing(true)}
                          onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                          placeholder="Enter 12-digit Aadhaar"
                          className={`w-full px-3 py-2 bg-surface-card border rounded-lg text-heading outline-none text-xs transition-all duration-300 ${
                            isEditing 
                              ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                              : "border-border/50 cursor-pointer hover:border-orange-500/30"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Aadhaar Card Image</span>
                        <div className="flex items-center gap-3">
                          <label 
                            onClick={() => setIsEditing(true)}
                            className={`flex-1 cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed rounded-lg text-muted transition-all font-bold text-xs bg-surface-card ${
                              isEditing
                                ? "border-orange-500/40 hover:border-orange-500 hover:bg-orange-500/[0.02] hover:text-orange-500"
                                : "border-border/50 opacity-75"
                            }`}
                          >
                            {uploadingAadhaar ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload size={13} />
                            )}
                            {uploadingAadhaar ? "Uploading..." : "Upload File"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={!isEditing}
                              onChange={(e) => handleFileUpload(e, "aadhaar")}
                              className="hidden"
                            />
                          </label>
                          {aadhaarUrl && (
                            <a href={aadhaarUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/15 rounded-lg transition-colors font-bold flex items-center gap-1 text-xs">
                              <Eye size={12} /> View
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PAN Number & Upload */}
                    <div className="space-y-2 bg-surface p-4 rounded-2xl border border-border">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">PAN Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          value={pan}
                          readOnly={!isEditing}
                          onClick={() => setIsEditing(true)}
                          onFocus={() => setIsEditing(true)}
                          onChange={(e) => setPan(e.target.value.toUpperCase())}
                          placeholder="Enter 10-digit PAN"
                          className={`w-full px-3 py-2 bg-surface-card border rounded-lg text-heading outline-none text-xs transition-all duration-300 ${
                            isEditing 
                              ? "border-orange-500/50 focus:border-orange-500 shadow-sm" 
                              : "border-border/50 cursor-pointer hover:border-orange-500/30"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">PAN Card Image</span>
                        <div className="flex items-center gap-3">
                          <label 
                            onClick={() => setIsEditing(true)}
                            className={`flex-1 cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed rounded-lg text-muted transition-all font-bold text-xs bg-surface-card ${
                              isEditing
                                ? "border-orange-500/40 hover:border-orange-500 hover:bg-orange-500/[0.02] hover:text-orange-500"
                                : "border-border/50 opacity-75"
                            }`}
                          >
                            {uploadingPan ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload size={13} />
                            )}
                            {uploadingPan ? "Uploading..." : "Upload File"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={!isEditing}
                              onChange={(e) => handleFileUpload(e, "pan")}
                              className="hidden"
                            />
                          </label>
                          {panUrl && (
                            <a href={panUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/15 rounded-lg transition-colors font-bold flex items-center gap-1 text-xs">
                              <Eye size={12} /> View
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Other Important Document Upload */}
                    <div className="space-y-2 bg-surface p-4 rounded-2xl border border-border sm:col-span-2">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Other Important Business Document (GST certificate, Udyam, etc.)</span>
                      <div className="flex items-center gap-3">
                        <label 
                          onClick={() => setIsEditing(true)}
                          className={`flex-1 cursor-pointer flex items-center justify-center gap-1.5 px-4 py-3 border border-dashed rounded-lg text-muted transition-all font-bold text-xs bg-surface-card ${
                            isEditing
                              ? "border-orange-500/40 hover:border-orange-500 hover:bg-orange-500/[0.02] hover:text-orange-500"
                              : "border-border/50 opacity-75"
                          }`}
                        >
                          {uploadingDoc ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload size={13} />
                          )}
                          {uploadingDoc ? "Uploading Document..." : "Choose Document File"}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            disabled={!isEditing}
                            onChange={(e) => handleFileUpload(e, "doc")}
                            className="hidden"
                          />
                        </label>
                        {docUrl && (
                          <a href={docUrl} target="_blank" rel="noreferrer" className="px-4 py-3 bg-orange-500/10 text-orange-500 hover:bg-orange-500/15 rounded-lg transition-colors font-bold flex items-center gap-1 text-xs">
                            <Eye size={12} /> View Document
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={!isEditing || saving}
                    className={`px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-md transition-all duration-300 flex items-center gap-1.5 ${
                      !isEditing ? "opacity-50 cursor-not-allowed scale-[0.98]" : "hover:scale-[1.02]"
                    }`}
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? "Saving Details..." : "Save Profile Details"}
                  </button>
                </div>

              </form>
            </div>
          </div>
          
        </div>
        
      </div>

      {/* Premium Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-emerald-500/30 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg">
            <CheckCircle size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-white">Success</span>
            <span className="text-[10px] text-zinc-400">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
