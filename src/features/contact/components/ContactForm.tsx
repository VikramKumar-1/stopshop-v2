"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle2, Store, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { parseLocation } from "@/lib/pincodeResolver";
import { countries, getPhoneRule } from "@/lib/countries";
import Link from "next/link";

export const ContactForm = () => {
  const searchParams = useSearchParams();
  const prepopulatedProduct = searchParams.get("product");

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phoneCode: "+91",
    phone: "",
    country: "",
    orderType: "Bulk Order",
    quantity: "10",
    message: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCodes = countries.filter(
    (item) =>
      item.name.toLowerCase().includes(codeSearch.toLowerCase()) ||
      item.dial_code.includes(codeSearch)
  );

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const selectedCode = countries.find((item) => item.dial_code === formData.phoneCode) || countries[0];
  const phoneRule = getPhoneRule(formData.phoneCode);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            const user = data.user;
            
            // Extract phone code and clean number
            let pCode = "+91";
            let pNum = user.mobile || "";
            if (pNum.startsWith("+")) {
              const parts = pNum.split(" ");
              if (parts.length >= 2) {
                pCode = parts[0];
                pNum = parts.slice(1).join(" ");
              }
            } else if (pNum && !pNum.includes("+")) {
              pNum = pNum.replace(/\D/g, "");
            }

            // Extract country from location
            let countryVal = "";
            if (user.location) {
              const parsedLoc = parseLocation(user.location);
              countryVal = parsedLoc.country;
            }

            setFormData((prev) => ({
              ...prev,
              fullName: prev.fullName || user.name || "",
              email: prev.email || user.email || "",
              phoneCode: pCode || prev.phoneCode,
              phone: pNum || prev.phone,
              country: countryVal || prev.country || "",
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching user for contact form prefill:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (prepopulatedProduct) {
      setFormData((prev) => ({
        ...prev,
        message: `Hello, I would like to inquire about bulk ordering the "${prepopulatedProduct}". Please provide pricing, MOQ (Minimum Order Quantity), and export shipping details to my country.`
      }));
    }
  }, [prepopulatedProduct]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const rule = getPhoneRule(formData.phoneCode);
      const digitCount = formData.phone.replace(/\D/g, "").length;
      if (formData.phoneCode && (digitCount < rule.minLength || digitCount > rule.maxLength)) {
        setError(`Please enter a valid phone number for the selected country (must be between ${rule.minLength} and ${rule.maxLength} digits).`);
        setLoading(false);
        return;
      }

      const prodIdParam = searchParams.get("productId");
      const finalQuantity = formData.orderType === "Single Item" ? 1 : parseInt(formData.quantity) || 10;
      const itemsPayload = prepopulatedProduct && prodIdParam
        ? [{ id: parseInt(prodIdParam), name: prepopulatedProduct, orderType: formData.orderType, quantity: finalQuantity }]
        : [];

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email,
          phone: `${formData.phoneCode} ${formData.phone}`.trim(),
          companyName: formData.companyName,
          country: formData.country,
          items: itemsPayload,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData({
          fullName: "",
          companyName: "",
          email: "",
          phoneCode: "+91",
          phone: "",
          country: "",
          orderType: "Bulk Order",
          quantity: "10",
          message: "",
        });
      } else {
        setError(data.error || "Failed to send inquiry.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-6 pb-20 lg:pt-10 relative min-h-screen">
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-bronze-500/5 rounded-full blur-[160px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 space-y-3">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs uppercase tracking-[0.2em] text-orange-600 dark:text-bronze-400 font-medium">
            Get in Touch
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl sm:text-5xl font-display font-bold text-heading">
            B2B <span className="gradient-text">Inquiry</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-body max-w-xl mx-auto text-sm">
            Interested in bulk orders or international distribution? Send us your requirements and we will get back within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email Us", value: "export@stopshop.com" },
              { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
              { icon: MapPin, label: "Headquarters", value: "Moradabad, Uttar Pradesh, India" },
            ].map((item, index) => (
              <div key={index} className="glass rounded-2xl p-5 gradient-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bronze-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-bronze-500 dark:text-bronze-400" />
                </div>
                <div>
                  <p className="text-[10px] text-muted mb-0.5">{item.label}</p>
                  <p className="text-xs font-semibold text-heading">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Sell With Us Section */}
            <div className="glass rounded-3xl p-6 bg-gradient-to-br from-orange-500/[0.08] via-orange-500/[0.03] to-transparent border border-orange-500/25 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center flex-shrink-0">
                  <Store size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-heading font-display">Are you an artisan?</h3>
                  <p className="text-[10px] text-muted font-medium">Sell your handmade crafts globally.</p>
                </div>
              </div>
              <p className="text-[11px] text-body leading-relaxed">
                Join StopShop's craftsman network. Register as an artisan vendor to list and sell your copper, brass, and bronze utensils.
              </p>
              <Link
                href="/vendor/register"
                className="inline-flex w-full items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-orange-500/10 active:scale-[0.98] cursor-pointer"
              >
                Become a Seller
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3">
            <div className="glass rounded-3xl p-6 sm:p-8 gradient-border">
              {success ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                  <h3 className="text-lg font-bold text-heading">Inquiry Sent Successfully</h3>
                  <p className="text-xs text-muted">
                    We have received your requirements. Our export department will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2 rounded-full bg-bronze-500 text-white font-semibold text-xs"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {error && <div className="p-3 bg-red-500/5 text-red-500 text-xs border border-red-500/20 rounded-xl">{error}</div>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 sm:gap-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border focus:border-bronze-500/50 focus:ring-1 focus:ring-bronze-500/20 outline-none text-heading placeholder-subtle text-xs transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Company / Business Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border focus:border-bronze-500/50 focus:ring-1 focus:ring-bronze-500/20 outline-none text-heading placeholder-subtle text-xs transition-all"
                        placeholder="Acme Exports Ltd."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 sm:gap-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Phone / WhatsApp *</label>
                      <div className="flex gap-2 items-stretch">
                        {/* Searchable Dropdown Button */}
                        <div className="relative flex items-stretch">
                          <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="py-2.5 px-2.5 rounded-xl bg-surface-card border border-border text-heading text-xs flex items-center gap-1.5 min-w-[85px] justify-between focus:border-bronze-500/50 transition-all"
                          >
                            <span className="flex items-center gap-1">
                              <img
                                src={`https://flagcdn.com/w20/${selectedCode.code.toLowerCase()}.png`}
                                alt={selectedCode.name}
                                className="w-5 h-3.5 object-cover rounded-sm"
                              />
                              <span>{selectedCode.dial_code}</span>
                            </span>
                            <span className="text-[8px] text-muted">▼</span>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {dropdownOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-60 bg-[var(--surface)] border border-border shadow-2xl rounded-xl p-2 z-50">
                              <input
                                type="text"
                                placeholder="Search by code or country..."
                                value={codeSearch}
                                onChange={(e) => setCodeSearch(e.target.value)}
                                className="w-full px-3 py-1.5 mb-2 rounded-lg bg-surface-card border border-border text-xs text-heading outline-none focus:border-orange-500"
                              />
                              <div className="max-h-48 overflow-y-auto space-y-0.5 text-xs">
                                {filteredCodes.length > 0 ? (
                                  filteredCodes.map((item) => (
                                    <button
                                      key={item.name}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, phoneCode: item.dial_code }));
                                        setDropdownOpen(false);
                                        setCodeSearch("");
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
                          name="phone"
                          required
                          disabled={!formData.phoneCode}
                          value={formData.phone}
                          maxLength={phoneRule.maxLength}
                          onChange={(e) => {
                            const cleanDigits = e.target.value.replace(/\D/g, "");
                            setFormData((prev) => ({
                              ...prev,
                              phone: cleanDigits.slice(0, phoneRule.maxLength),
                            }));
                          }}
                          className={`flex-1 w-full min-w-0 px-3 py-2.5 rounded-xl bg-surface-card border border-border focus:border-bronze-500/50 focus:ring-1 focus:ring-bronze-500/20 outline-none text-heading placeholder-subtle text-xs transition-all ${
                            !formData.phoneCode ? "cursor-not-allowed opacity-50 bg-surface/20" : ""
                          }`}
                          placeholder={formData.phoneCode ? `e.g. ${phoneRule.placeholder}` : "Select country code first"}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border focus:border-bronze-500/50 focus:ring-1 focus:ring-bronze-500/20 outline-none text-heading placeholder-subtle text-xs transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 sm:gap-y-6">
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Country *</label>
                      <button
                        type="button"
                        onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border text-left text-heading text-xs flex justify-between items-center transition-all focus:border-bronze-500/50"
                      >
                        <span>{formData.country || "Select Country"}</span>
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
                                    setFormData((prev) => ({ ...prev, country: c.name }));
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
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Order Type *</label>
                      <div className="flex gap-4 pt-2.5">
                        <label className="flex items-center gap-2 text-heading text-xs cursor-pointer select-none">
                          <input
                            type="radio"
                            name="orderType"
                            value="Bulk Order"
                            checked={formData.orderType === "Bulk Order"}
                            onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                            className="w-3.5 h-3.5 accent-orange-500 text-orange-500 border-border focus:ring-orange-500/20"
                          />
                          <span>Bulk Order</span>
                        </label>
                        <label className="flex items-center gap-2 text-heading text-xs cursor-pointer select-none">
                          <input
                            type="radio"
                            name="orderType"
                            value="Single Item"
                            checked={formData.orderType === "Single Item"}
                            onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                            className="w-3.5 h-3.5 accent-orange-500 text-orange-500 border-border focus:ring-orange-500/20"
                          />
                          <span>Single Item</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-muted uppercase tracking-wider">Message / Inquiry Details *</label>
                    <textarea
                      rows={3}
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-card border border-border focus:border-bronze-500/50 focus:ring-1 focus:ring-bronze-500/20 outline-none text-heading placeholder-subtle text-xs resize-none transition-all"
                      placeholder="Tell us about the products you need, quantities, and destination country..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 text-white font-semibold hover:from-bronze-400 hover:to-bronze-500 transition-all duration-300 shadow-lg shadow-bronze-500/20 hover:shadow-bronze-500/40 text-xs"
                  >
                    {loading ? "Sending..." : "Send Inquiry"}
                    <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
