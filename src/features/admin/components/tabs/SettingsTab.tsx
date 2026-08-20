"use client";
import React, { useState, useEffect } from "react";
import { MarkdownHelpGuide } from "./MarkdownHelpGuide";
import { CMSContentSettings } from "./CMSContentSettings";

const PREVIEW_COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "USA", currency: "USD", symbol: "$" },
  { code: "GB", flag: "🇬🇧", name: "UK", currency: "GBP", symbol: "£" },
  { code: "CA", flag: "🇨🇦", name: "Canada", currency: "CAD", symbol: "C$" },
  { code: "AE", flag: "🇦🇪", name: "UAE", currency: "AED", symbol: "د.إ" },
  { code: "TH", flag: "🇹🇭", name: "Thailand", currency: "THB", symbol: "฿" },
  { code: "BD", flag: "🇧🇩", name: "Bangladesh", currency: "BDT", symbol: "৳" },
  { code: "NP", flag: "🇳🇵", name: "Nepal", currency: "NPR", symbol: "Rs" },
  { code: "LK", flag: "🇱🇰", name: "Sri Lanka", currency: "LKR", symbol: "Rs" },
];

function InternationalShippingField({ settings, setSettings }: { settings: any; setSettings: (val: any) => void }) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        if (res.ok) {
          const data = await res.json();
          if (data?.rates) setRates(data.rates);
        }
      } catch (e) {
        console.error("Failed to fetch exchange rates:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const inrValue = settings.internationalShippingPaise === "" ? "" : (settings.internationalShippingPaise !== undefined ? settings.internationalShippingPaise / 100 : 499);

  return (
    <div className="space-y-2 md:col-span-2">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-blue-500">International Shipping (₹)</label>
        <input
          type="number"
          min="0"
          value={inrValue}
          onChange={e => {
            const v = e.target.value;
            if (v === "") {
               setSettings({ ...settings, internationalShippingPaise: "" });
            } else {
               const val = parseInt(v);
               setSettings({ ...settings, internationalShippingPaise: isNaN(val) ? "" : Math.max(0, val * 100) });
            }
          }}
          className="w-full px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold"
        />
      </div>
      <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/15 rounded-xl p-3">
        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mb-2">
          🌍 Live Preview — What users will see
        </p>
        {loading ? (
          <p className="text-[10px] text-muted animate-pulse">Fetching live rates...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {PREVIEW_COUNTRIES.map(c => {
              const rate = rates[c.currency];
              const numericInrValue = typeof inrValue === 'number' ? inrValue : 0;
              const converted = rate ? (numericInrValue * rate) : null;
              return (
                <div key={c.code} className="flex items-center gap-1.5 bg-surface border border-border/60 rounded-lg px-2 py-1.5">
                  <span className="text-sm leading-none">{c.flag}</span>
                  <div className="min-w-0">
                    <p className="text-[9px] text-muted leading-none truncate">{c.name}</p>
                    <p className="text-[11px] font-bold text-heading leading-tight">
                      {converted !== null
                        ? `${c.symbol}${converted < 10 ? converted.toFixed(2) : Math.round(converted).toLocaleString()}`
                        : "—"
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-[8px] text-muted mt-2">Rates are live from Open Exchange Rates API. Actual charge is always ₹{inrValue} converted at checkout.</p>
      </div>
    </div>
  );
}
export function SettingsTab({
  settings,
  setSettings,
  savingSettings,
  handleSavePlatformSettings,
  handleSaveCompanyProfile,
  handleSaveCMSContent,
}: {
  settings: any;
  setSettings: (val: any) => void;
  savingSettings: boolean;
  handleSavePlatformSettings: (e: React.FormEvent) => void;
  handleSaveCompanyProfile: (e: React.FormEvent) => void;
  handleSaveCMSContent: (e: React.FormEvent) => void;
}) {
  return (
              <>
                {!settings ? (
                   <div className="bg-surface-card border border-border rounded-3xl p-8 text-center text-muted">
                      <p>Loading settings or database migration pending.</p>
                      <p className="text-xs mt-2">If this persists, run <code>npx prisma db push</code>.</p>
                   </div>
                ) : (
                   <div className="space-y-8 max-w-4xl">
                      {/* Section 1: Platform Settings */}
                      <form onSubmit={handleSavePlatformSettings} className="bg-surface-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
                         <div className="flex items-center gap-2 border-b border-border pb-4">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                            <h2 className="text-lg font-bold text-heading">Platform Settings</h2>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Default Commission Rate (%)</label>
                               <input type="number" step="0.1" value={settings.defaultCommissionRate} onChange={e => setSettings({...settings, defaultCommissionRate: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Commission GST Rate (%)</label>
                               <input type="number" step="0.1" value={settings.commissionGstRate} onChange={e => setSettings({...settings, commissionGstRate: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Commission SAC Code</label>
                               <input type="text" value={settings.commissionSacCode} onChange={e => setSettings({...settings, commissionSacCode: e.target.value})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">International Tax Rate (%)</label>
                               <div className="relative">
                                 <input type="number" min="0" step="1" value={settings.taxRate === "" ? "" : (settings.taxRate ?? 0)} onChange={e => {
                                    const v = e.target.value;
                                    if (v === "") {
                                       setSettings({...settings, taxRate: ""});
                                    } else {
                                       const val = parseInt(v);
                                       setSettings({...settings, taxRate: isNaN(val) ? "" : Math.max(0, val)});
                                    }
                                 }} className="w-full px-3 py-2 pr-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold" />
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs">%</span>
                               </div>
                               <p className="text-[9px] text-muted">Applied only to non-India orders (e.g. Customs/VAT). 0% for no tax.</p>
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Free Shipping Above (₹)</label>
                               <input type="number" value={settings.shippingFreeAbove / 100} onChange={e => setSettings({...settings, shippingFreeAbove: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Standard Shipping Charge (₹)</label>
                               <input type="number" value={settings.shippingChargePaise / 100} onChange={e => setSettings({...settings, shippingChargePaise: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">COD Shipping Charge (₹)</label>
                               <input type="number" value={settings.codShippingChargePaise / 100} onChange={e => setSettings({...settings, codShippingChargePaise: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <InternationalShippingField settings={settings} setSettings={setSettings} />
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Max COD Amount (₹)</label>
                               <input type="number" value={settings.codMaxAmountPaise / 100} onChange={e => setSettings({...settings, codMaxAmountPaise: parseInt(e.target.value)*100})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Return Window (Days)</label>
                               <input type="number" value={settings.returnWindowDays} onChange={e => setSettings({...settings, returnWindowDays: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted text-emerald-500">Auto-Refund SLA (Hours)</label>
                               <input type="number" value={settings.vendorReturnSlaHours || 24} onChange={e => setSettings({...settings, vendorReturnSlaHours: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted text-orange-500">PDF Invoice Template</label>
                               <select 
                                  value={settings.invoiceTemplate || "CLASSIC"} 
                                  onChange={e => setSettings({...settings, invoiceTemplate: e.target.value})}
                                  className="w-full px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-bold appearance-none cursor-pointer"
                               >
                                  <option value="CLASSIC">Classic B2C GST</option>
                                  <option value="MODERN_MINIMAL">Modern Minimalist</option>
                                  <option value="BRAND_PREMIUM">Brand Premium (Orange)</option>
                               </select>
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted text-blue-500">Vendor Payout Schedule</label>
                               <select 
                                  value={settings.payoutSchedule || "MANUAL"} 
                                  onChange={e => setSettings({...settings, payoutSchedule: e.target.value})}
                                  className="w-full px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold appearance-none cursor-pointer"
                               >
                                  <option value="MANUAL">Manual (Button Click Only)</option>
                                  <option value="DAILY">Daily Automation</option>
                                  <option value="WEEKLY_WED">Weekly (Every Wednesday)</option>
                                  <option value="WEEKLY_THU">Weekly (Every Thursday)</option>
                                  <option value="BIWEEKLY">Bi-Weekly (Every 15 Days)</option>
                                  <option value="MONTHLY">Monthly (1st of the Month)</option>
                                  <option value="CUSTOM_DAYS">Custom Interval (Every X Days)</option>
                               </select>
                            </div>
                            
                            {settings.payoutSchedule === "CUSTOM_DAYS" ? (
                              <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                                 <label className="text-[10px] font-bold uppercase tracking-wider text-muted text-blue-500">Custom Payout Interval (Days)</label>
                                 <input 
                                   type="number" 
                                   min="1"
                                   max="365"
                                   value={settings.payoutCustomDays || 10} 
                                   onChange={e => setSettings({...settings, payoutCustomDays: parseInt(e.target.value) || 1})}
                                   className="w-full px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold"
                                 />
                              </div>
                            ) : <div></div>}
                         </div>

                         <div className="flex flex-wrap gap-6 pt-4 border-t border-border/60">
                            <label className="flex items-center gap-2 text-xs font-bold text-heading cursor-pointer">
                               <input type="checkbox" checked={settings.codEnabled} onChange={e => setSettings({...settings, codEnabled: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500" />
                               Enable COD (Cash on Delivery)
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-heading cursor-pointer">
                               <input type="checkbox" checked={settings.returnEnabled} onChange={e => setSettings({...settings, returnEnabled: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500" />
                               Enable Returns
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-heading cursor-pointer">
                               <input type="checkbox" checked={settings.shiprocketAutoAssign} onChange={e => setSettings({...settings, shiprocketAutoAssign: e.target.checked})} className="rounded text-orange-500 focus:ring-orange-500" />
                               Auto-Assign Courier via Shiprocket
                            </label>
                         </div>

                         <div className="pt-2">
                            <button type="submit" disabled={savingSettings} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                               {savingSettings ? "Saving..." : "Save Platform Settings"}
                            </button>
                         </div>
                      </form>

                      {/* Section 2: Company Profile / Billing Details */}
                      <form onSubmit={handleSaveCompanyProfile} className="bg-surface-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
                         <div className="flex items-center gap-2 border-b border-border pb-4">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                            <h2 className="text-lg font-bold text-heading">Company Profile &amp; Billing Details (for Commission Invoices)</h2>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Registered Company Name</label>
                               <input 
                                  type="text" 
                                  value={settings.companyName || ""} 
                                  onChange={e => setSettings({...settings, companyName: e.target.value})} 
                                  placeholder="e.g. StopShop Private Limited"
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Company GSTIN</label>
                               <input 
                                  type="text" 
                                  value={settings.companyGstin || ""} 
                                  onChange={e => setSettings({...settings, companyGstin: e.target.value})} 
                                  placeholder="e.g. 09AAECS8721M1Z5"
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading uppercase font-mono"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Company PAN</label>
                               <input 
                                  type="text" 
                                  value={settings.companyPan || ""} 
                                  onChange={e => setSettings({...settings, companyPan: e.target.value})} 
                                  placeholder="e.g. AAECS8721M"
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading uppercase font-mono"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Pincode</label>
                               <input 
                                  type="text" 
                                  value={settings.companyPincode || ""} 
                                  onChange={e => setSettings({...settings, companyPincode: e.target.value})} 
                                  placeholder="e.g. 201301"
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading font-mono"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">City</label>
                               <input 
                                  type="text" 
                                  value={settings.companyCity || ""} 
                                  onChange={e => setSettings({...settings, companyCity: e.target.value})} 
                                  placeholder="e.g. Noida"
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">State</label>
                               <input 
                                  type="text" 
                                  value={settings.companyState || ""} 
                                  onChange={e => setSettings({...settings, companyState: e.target.value})} 
                                  placeholder="e.g. Uttar Pradesh"
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading"
                               />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Country</label>
                               <input 
                                  type="text" 
                                  value={settings.companyCountry || ""} 
                                  onChange={e => setSettings({...settings, companyCountry: e.target.value})} 
                                  placeholder="e.g. India"
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading"
                               />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                               <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Registered / Corporate Office Address</label>
                               <textarea 
                                  value={settings.companyAddress || ""} 
                                  onChange={e => setSettings({...settings, companyAddress: e.target.value})} 
                                  placeholder="Enter complete office address..."
                                  rows={3}
                                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-heading"
                               />
                            </div>
                         </div>

                          <div className="pt-2">
                             <button type="submit" disabled={savingSettings} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                                {savingSettings ? "Saving..." : "Save Company Profile"}
                             </button>
                          </div>
                       </form>

                       {/* Section 3: Store Policies */}
                       <form onSubmit={handleSavePlatformSettings} className="bg-surface-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
                          <div className="flex items-center gap-2 border-b border-border pb-4">
                             <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                             <h2 className="text-lg font-bold text-heading">Store Policies</h2>
                          </div>
                          
                          <MarkdownHelpGuide />
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Shipping Policy (Markdown Supported)</label>
                                <textarea 
                                   value={settings.shippingPolicy || ""} 
                                   onChange={e => setSettings({...settings, shippingPolicy: e.target.value})} 
                                   placeholder="Enter your shipping policy here..."
                                   rows={8}
                                   className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                                <p className="text-[10px] text-muted mt-1">This text will be displayed publicly on the /shipping-policy page.</p>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Return & Refund Policy (Markdown Supported)</label>
                                <textarea 
                                   value={settings.refundPolicy || ""} 
                                   onChange={e => setSettings({...settings, refundPolicy: e.target.value})} 
                                   placeholder="Enter your return and refund policy here..."
                                   rows={8}
                                   className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                                <p className="text-[10px] text-muted mt-1">This text will be displayed publicly on the /refund-policy page.</p>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Privacy Policy (Markdown Supported)</label>
                                <textarea 
                                   value={settings.privacyPolicy || ""} 
                                   onChange={e => setSettings({...settings, privacyPolicy: e.target.value})} 
                                   placeholder="Enter your privacy policy here..."
                                   rows={8}
                                   className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                                <p className="text-[10px] text-muted mt-1">This text will be displayed publicly on the /privacy-policy page.</p>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Terms & Conditions (Markdown Supported)</label>
                                <textarea 
                                   value={settings.termsPolicy || ""} 
                                   onChange={e => setSettings({...settings, termsPolicy: e.target.value})} 
                                   placeholder="Enter your terms and conditions here..."
                                   rows={8}
                                   className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                                <p className="text-[10px] text-muted mt-1">This text will be displayed publicly on the /terms-and-conditions page.</p>
                             </div>
                          </div>

                           <div className="pt-2">
                             <button type="submit" disabled={savingSettings} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                                {savingSettings ? "Saving..." : "Save Policies"}
                             </button>
                          </div>
                       </form>
                       
                       {/* Section 4: SEO Settings */}
                       <form onSubmit={handleSavePlatformSettings} className="bg-surface-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
                          <div className="flex items-center gap-2 border-b border-border pb-4">
                             <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                             <h2 className="text-lg font-bold text-heading">SEO & Metadata</h2>
                          </div>
                          
                          <div className="space-y-4">
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Global SEO Title</label>
                                <input 
                                   type="text" 
                                   value={settings.seoTitle || ""} 
                                   onChange={e => setSettings({...settings, seoTitle: e.target.value})} 
                                   placeholder="e.g. StopShop — Premium Bronze & Bartan Export"
                                   className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                                <p className="text-[10px] text-muted mt-1">This appears in browser tabs and search engine results globally.</p>
                             </div>

                             <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Global SEO Description</label>
                                <textarea 
                                   value={settings.seoDescription || ""} 
                                   onChange={e => setSettings({...settings, seoDescription: e.target.value})} 
                                   placeholder="Enter the main meta description for the site..."
                                   rows={3}
                                   className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                                <p className="text-[10px] text-muted mt-1">150-160 characters recommended for optimal search engine display.</p>
                             </div>

                             <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Global SEO Keywords</label>
                                <textarea 
                                   value={settings.seoKeywords || ""} 
                                   onChange={e => setSettings({...settings, seoKeywords: e.target.value})} 
                                   placeholder="e.g. bronze cookware, bartan, export, premium kitchenware"
                                   rows={2}
                                   className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                                <p className="text-[10px] text-muted mt-1">Comma-separated list of target keywords.</p>
                             </div>
                          </div>
                          
                          <div className="pt-2">
                             <button type="submit" disabled={savingSettings} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                                {savingSettings ? "Saving..." : "Save SEO Settings"}
                             </button>
                          </div>
                       </form>

                       <CMSContentSettings 
                         settings={settings}
                         setSettings={setSettings}
                         savingSettings={savingSettings}
                         handleSave={handleSaveCMSContent}
                       />
                    </div>            )}
              </>
  );
}
