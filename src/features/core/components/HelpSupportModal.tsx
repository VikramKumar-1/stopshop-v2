"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, LifeBuoy, Phone, Mail, User, FileText, CheckCircle2, Loader2, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { countries, getFlagEmoji } from "@/lib/countries";
import { useRegion } from "@/context/RegionContext";

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
  defaultEmail?: string;
  defaultMobile?: string;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  defaultName = "",
  defaultEmail = "",
  defaultMobile = ""
}) => {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [mobile, setMobile] = useState(defaultMobile);
  const [description, setDescription] = useState("");

  // Detect user's current country / region dynamically
  let detectedRegion = "IN";
  try {
    const regionContext = useRegion();
    if (regionContext && regionContext.region) {
      detectedRegion = regionContext.region.toUpperCase();
    }
  } catch (e) {}

  // Fallback to browser locale detection if needed
  useEffect(() => {
    if (typeof window !== "undefined" && !detectedRegion) {
      try {
        const userLanguage = navigator.language || "";
        if (userLanguage.includes("-")) {
          detectedRegion = userLanguage.split("-")[1].toUpperCase();
        }
      } catch (e) {}
    }
  }, []);

  const defaultCountry = countries.find(c => c.code === detectedRegion) ||
    countries.find(c => c.code === "IN") ||
    { name: "India", code: "IN", dial_code: "+91", flag: "🇮🇳" };

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync selected country with user's detected region whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const matched = countries.find(c => c.code === detectedRegion);
      if (matched) {
        setSelectedCountry(matched as any);
      }
    }
  }, [isOpen, detectedRegion]);

  // Close country dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase().trim()) ||
    c.dial_code.includes(countrySearch.trim()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase().trim())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    if (!mobile.trim()) {
      setError("Mobile number is required");
      return;
    }
    if (!description.trim()) {
      setError("Description / Message box is required");
      return;
    }

    setLoading(true);

    const fullMobile = mobile.startsWith("+") ? mobile.trim() : `${selectedCountry.dial_code} ${mobile.trim()}`;

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile: fullMobile,
          description: description.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(data.message || "Support ticket created successfully!");
        setDescription("");
        setTimeout(() => {
          setSuccess("");
          onClose();
        }, 2200);
      } else {
        setError(data.error || "Failed to submit support ticket");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="relative w-full max-w-lg bg-surface-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface hover:bg-surface-hover border border-border text-muted hover:text-heading transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 shrink-0">
                <LifeBuoy size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-heading font-display">Help & Support</h3>
                <p className="text-xs text-muted">Send your inquiry or issue directly to StopShop Admin.</p>
              </div>
            </div>

            {/* Success Message */}
            {success ? (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-center space-y-2 animate-in fade-in duration-300">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{success}</p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-500">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <User size={12} className="text-orange-500" />
                    <span>Your Full Name <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-surface border border-border/80 focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs text-heading focus:outline-none transition-all placeholder:text-muted/50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Mail size={12} className="text-orange-500" />
                    <span>Email Address <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-surface border border-border/80 focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs text-heading focus:outline-none transition-all placeholder:text-muted/50"
                  />
                </div>

                {/* Mobile Number with Searchable Geo-Auto-Detected Country Code Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Phone size={12} className="text-orange-500" />
                    <span>Mobile Number <span className="text-red-500">*</span></span>
                  </label>

                  <div className="flex gap-2 relative">
                    {/* Country Code Trigger */}
                    <div ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                        className="h-full px-3 py-2.5 bg-surface border border-border/80 hover:border-orange-500/80 rounded-xl flex items-center gap-1.5 text-xs font-bold text-heading shrink-0 transition-colors cursor-pointer"
                      >
                        <span className="text-base leading-none">{getFlagEmoji(selectedCountry.code)}</span>
                        <span className="font-mono">{selectedCountry.dial_code}</span>
                        <ChevronDown size={12} className="text-muted" />
                      </button>

                      {/* Country Search Dropdown */}
                      {countryDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1.5 w-64 max-h-60 bg-surface-card border border-border/80 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-150">
                          {/* Search Box */}
                          <div className="relative mb-2 shrink-0">
                            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                              type="text"
                              autoFocus
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country or code..."
                              className="w-full bg-surface border border-border/60 rounded-xl pl-8 pr-3 py-1.5 text-[11px] text-heading focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          {/* Country List */}
                          <div className="overflow-y-auto flex-1 space-y-0.5 scrollbar-thin">
                            {filteredCountries.length === 0 ? (
                              <div className="p-3 text-[11px] text-muted text-center font-medium">No countries found</div>
                            ) : (
                              filteredCountries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c as any);
                                    setCountryDropdownOpen(false);
                                    setCountrySearch("");
                                  }}
                                  className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                                    selectedCountry.code === c.code ? "bg-orange-500/10 text-orange-500 font-bold" : "hover:bg-surface text-heading"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-base leading-none">{getFlagEmoji(c.code)}</span>
                                    <span className="truncate">{c.name}</span>
                                  </div>
                                  <span className="font-mono text-[11px] text-muted shrink-0">{c.dial_code}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile Input */}
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 bg-surface border border-border/80 focus:border-orange-500 rounded-xl px-4 py-2.5 text-xs text-heading focus:outline-none transition-all placeholder:text-muted/50 font-mono"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <FileText size={12} className="text-orange-500" />
                    <span>Message / Description Box <span className="text-red-500">*</span></span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your query, order issue, or feedback in detail..."
                    className="w-full bg-surface border border-border/80 focus:border-orange-500 rounded-xl p-4 text-xs text-heading focus:outline-none transition-all placeholder:text-muted/50 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Support Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
