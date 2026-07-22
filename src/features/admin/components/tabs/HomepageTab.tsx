"use client";
import React, { useState, useRef } from "react";
import { Search, X, Loader2, Plus, Upload, Trash2, ChevronDown, ChevronUp, Sparkles, Flame, Globe, Package, Star, Heart } from "lucide-react";
import { compressImageToWebP } from "@/lib/imageCompressor";

const THEMES = [
  { id: "sunset", label: "Sunset Flame", gradient: "from-orange-500 via-amber-500 to-yellow-400", iconName: "Flame", Icon: Flame },
  { id: "rose", label: "Rose Sparkles", gradient: "from-rose-500 via-pink-500 to-fuchsia-500", iconName: "Sparkles", Icon: Sparkles },
  { id: "emerald", label: "Emerald Globe", gradient: "from-emerald-500 via-teal-500 to-cyan-500", iconName: "Globe", Icon: Globe },
  { id: "indigo", label: "Indigo Package", gradient: "from-violet-500 via-purple-500 to-indigo-500", iconName: "Package", Icon: Package },
  { id: "ocean", label: "Ocean Star", gradient: "from-blue-500 via-cyan-500 to-teal-400", iconName: "Star", Icon: Star },
  { id: "midnight", label: "Midnight Heart", gradient: "from-slate-800 via-indigo-900 to-slate-900", iconName: "Heart", Icon: Heart },
];

function MobileBannersEditor({ mobileBanners, setMobileBanners, showToast }: any) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const addBanner = () => {
    if (mobileBanners.length >= 6) {
      showToast("Maximum 6 mobile banners allowed.", "warning");
      return;
    }
    const newBanner = {
      id: Date.now().toString(),
      type: "text", // "text" or "image"
      title: "New Banner",
      subtitle: "Awesome Collection",
      desc: "Describe your collection here.",
      cta: "Explore",
      href: "/products",
      gradient: THEMES[mobileBanners.length % THEMES.length].gradient,
      icon: THEMES[mobileBanners.length % THEMES.length].iconName,
      imageUrl: "",
    };
    setMobileBanners([...mobileBanners, newBanner]);
    setExpandedIndex(mobileBanners.length);
  };

  const removeBanner = (index: number) => {
    const updated = [...mobileBanners];
    updated.splice(index, 1);
    setMobileBanners(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const updateBanner = (index: number, key: string, value: any) => {
    const updated = [...mobileBanners];
    updated[index] = { ...updated[index], [key]: value };
    setMobileBanners(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingIdx(index);
      const comp = await compressImageToWebP(file);
      const formData = new FormData();
      formData.append("file", comp.file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        updateBanner(index, "imageUrl", data.url);
        showToast(`⚡ WebP Banner uploaded (${comp.compressedSizeFormatted})`, "success");
      } else {
        showToast("Failed to upload image", "error");
      }
    } catch (err: any) {
      showToast("Error uploading image: " + err.message, "error");
    } finally {
      setUploadingIdx(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...mobileBanners];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setMobileBanners(updated);
    if (expandedIndex === idx) setExpandedIndex(idx - 1);
    else if (expandedIndex === idx - 1) setExpandedIndex(idx);
  };

  const moveDown = (idx: number) => {
    if (idx === mobileBanners.length - 1) return;
    const updated = [...mobileBanners];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setMobileBanners(updated);
    if (expandedIndex === idx) setExpandedIndex(idx + 1);
    else if (expandedIndex === idx + 1) setExpandedIndex(idx);
  };

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-heading">Mobile Hero Banners</h3>
          <p className="text-xs text-muted mt-1">Configure the auto-sliding banners shown on the mobile homepage (Max 6).</p>
        </div>
        <button 
          onClick={addBanner} 
          disabled={mobileBanners.length >= 6}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} /> Add Banner
        </button>
      </div>

      <div className="space-y-4">
        {mobileBanners.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-border rounded-xl text-muted text-sm">
            No banners configured. Add a banner to display on the mobile app.
          </div>
        )}
        {mobileBanners.map((banner: any, idx: number) => (
          <div key={banner.id || idx} className="border border-border rounded-xl overflow-hidden bg-surface">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-border/10 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-border/50 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                <span className="font-bold text-sm">
                  {banner.type === "image" ? "Image Banner" : banner.title || "Text Banner"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-bold uppercase">
                  {banner.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); moveUp(idx); }} 
                  disabled={idx === 0}
                  className="p-1.5 hover:bg-border rounded text-muted disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveDown(idx); }} 
                  disabled={idx === mobileBanners.length - 1}
                  className="p-1.5 hover:bg-border rounded text-muted disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeBanner(idx); }} 
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded text-muted transition-colors ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedIndex === idx && (
              <div className="p-4 border-t border-border bg-surface-card grid gap-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                    <input 
                      type="radio" 
                      name={`type-${idx}`} 
                      checked={banner.type === "text"}
                      onChange={() => updateBanner(idx, "type", "text")}
                      className="accent-orange-500"
                    /> Gradient Text Card
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                    <input 
                      type="radio" 
                      name={`type-${idx}`} 
                      checked={banner.type === "image"}
                      onChange={() => updateBanner(idx, "type", "image")}
                      className="accent-orange-500"
                    /> Image Banner
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-muted mb-1 font-bold">Link URL (Where should the user go when they click this entire banner?)</label>
                    <input 
                      type="text" 
                      value={banner.href || ""} 
                      onChange={(e) => updateBanner(idx, "href", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm outline-none focus:border-orange-500"
                      placeholder="Example: https://stopshop.com/products?category=brass"
                    />
                  </div>

                  {banner.type === "text" && (
                    <>
                      <div>
                        <label className="block text-xs text-muted mb-1 font-bold">Top Title</label>
                        <input 
                          type="text" 
                          value={banner.title || ""} 
                          onChange={(e) => updateBanner(idx, "title", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm outline-none focus:border-orange-500"
                          placeholder="e.g. NEW ARRIVALS"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1 font-bold">Main Subtitle</label>
                        <input 
                          type="text" 
                          value={banner.subtitle || ""} 
                          onChange={(e) => updateBanner(idx, "subtitle", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm outline-none focus:border-orange-500"
                          placeholder="e.g. Fresh Collection"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1 font-bold">Description</label>
                        <input 
                          type="text" 
                          value={banner.desc || ""} 
                          onChange={(e) => updateBanner(idx, "desc", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm outline-none focus:border-orange-500"
                          placeholder="e.g. Handcrafted brass dinner sets"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1 font-bold">Button CTA</label>
                        <input 
                          type="text" 
                          value={banner.cta || ""} 
                          onChange={(e) => updateBanner(idx, "cta", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm outline-none focus:border-orange-500"
                          placeholder="e.g. Explore"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-muted mb-3 font-bold">Premium Template Theme</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {THEMES.map((theme) => {
                            const Icon = theme.Icon;
                            const isSelected = banner.gradient === theme.gradient && banner.icon === theme.iconName;
                            
                            return (
                              <button
                                key={theme.id}
                                onClick={(e) => { 
                                  e.preventDefault(); 
                                  const updated = [...mobileBanners];
                                  updated[idx] = { ...updated[idx], gradient: theme.gradient, icon: theme.iconName };
                                  setMobileBanners(updated);
                                }}
                                className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient} p-4 text-left transition-all ${isSelected ? 'ring-4 ring-orange-500 scale-[1.02] shadow-md z-10' : 'ring-2 ring-transparent opacity-80 hover:opacity-100 hover:scale-[1.01]'}`}
                              >
                                {/* Decorative circles */}
                                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10" />
                                <div className="absolute -right-1 -bottom-2 w-12 h-12 rounded-full bg-white/[0.07]" />

                                <div className="relative z-10 flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <Icon size={12} className="text-white/80" strokeWidth={2.5} />
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                                        {theme.label}
                                      </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-white leading-tight">Theme Preview</h3>
                                  </div>
                                  
                                  {/* Big background icon */}
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.15]">
                                    <Icon size={40} strokeWidth={1.5} className="text-white" />
                                  </div>
                                  
                                  {isSelected && (
                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm relative z-20">
                                      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {banner.type === "image" && (
                    <div className="md:col-span-2">
                      <label className="block text-xs text-muted mb-1 font-bold">Banner Image</label>
                      <p className="text-[10px] text-muted mb-3">
                        Upload a wide image (Recommended aspect ratio 21:9, e.g., 800x340 pixels). The entire image will act as a fully clickable card linking to the URL you specified above.
                      </p>
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={banner.imageUrl || ""} 
                          onChange={(e) => updateBanner(idx, "imageUrl", e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-sm outline-none focus:border-orange-500"
                          placeholder="Paste an image URL here..."
                        />
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, idx)} 
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingIdx === idx}
                          className="px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 border border-orange-200"
                        >
                          {uploadingIdx === idx ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                          Upload from Device
                        </button>
                      </div>
                      
                      <div className="mt-4 border border-border border-dashed rounded-xl overflow-hidden h-32 w-full relative bg-surface-card flex items-center justify-center">
                        {banner.imageUrl ? (
                          <img src={banner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <div className="w-10 h-10 bg-border/50 rounded-full flex items-center justify-center mx-auto mb-2 text-muted">
                              <Upload size={18} />
                            </div>
                            <p className="text-xs font-bold text-muted">No image uploaded</p>
                            <p className="text-[10px] text-muted max-w-[250px] mx-auto mt-1">Upload an image or paste a URL to see a preview of your clickable banner here.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


export function HomepageTab({
  homepageSections,
  setHomepageSections,
  mobileBanners,
  setMobileBanners,
  dbCategories,
  products,
  editingSectionSlug,
  setEditingSectionSlug,
  cmsProductSearch,
  setCmsProductSearch,
  savingHomepage,
  setSavingHomepage,
  showToast,
}: {
  homepageSections: { slug: string; title?: string; productIds: number[] }[];
  setHomepageSections: (val: { slug: string; title?: string; productIds: number[] }[]) => void;
  mobileBanners: any[];
  setMobileBanners: (val: any[]) => void;
  dbCategories: any[];
  products: any[];
  editingSectionSlug: string | null;
  setEditingSectionSlug: (val: string | null) => void;
  cmsProductSearch: string;
  setCmsProductSearch: (val: string) => void;
  savingHomepage: boolean;
  setSavingHomepage: (val: boolean) => void;
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  return (
    <div className="space-y-6">
      <MobileBannersEditor 
        mobileBanners={mobileBanners} 
        setMobileBanners={setMobileBanners} 
        showToast={showToast} 
      />
      
      <div className="flex justify-between items-center bg-surface-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-heading">Homepage Sections Control</h3>
          <p className="text-xs text-muted mt-1">Select up to 15 products per existing category to highlight on the homepage.</p>
        </div>
                 <div className="flex gap-3">
                   <button disabled={savingHomepage} onClick={async () => {
                     if (savingHomepage) return;
                     try {
                       setSavingHomepage(true);
                       const res = await fetch("/api/admin/settings/homepage", {
                         method: "PUT",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ homepageSections, mobileBanners })
                       });
                       if (res.ok) {
                         showToast("Homepage configuration saved successfully!", "success");
                       } else {
                         const errText = await res.text();
                         showToast(`Failed to save homepage settings. Server says: ${errText}`, "error");
                       }
                     } catch (e: any) { showToast(`Error saving homepage: ${e.message}`, "error"); }
                     finally { setSavingHomepage(false); }
                   }} className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center min-w-[150px] ${savingHomepage ? 'bg-orange-400 cursor-not-allowed opacity-70' : 'bg-orange-500 hover:bg-orange-600'}`}>
                     {savingHomepage ? (
                       <span className="flex items-center gap-2">
                         <Loader2 className="animate-spin" size={14} /> Saving...
                       </span>
                     ) : "Save Live Homepage"}
                   </button>
                 </div>
               </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { slug: "best-sellers", name: "🔥 Best Sellers / Top Rated", isGlobal: true },
                    ...dbCategories.map(c => ({ slug: c.slug, name: c.name, isGlobal: false }))
                  ].map((secItem) => {
                    const section = homepageSections.find(s => s.slug === secItem.slug) || { slug: secItem.slug, productIds: [] as number[] };
                    return (
                    <div key={secItem.slug} className={`bg-surface-card border rounded-2xl p-6 shadow-sm ${secItem.isGlobal ? 'border-2 border-orange-500/40 bg-orange-500/5' : 'border-border'}`}>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-lg font-bold text-heading flex items-center gap-2">
                            {secItem.name}
                            {secItem.isGlobal && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">ALL CATEGORIES</span>}
                          </h4>
                          {secItem.isGlobal && <p className="text-xs text-muted mt-1">Pick top products across any category. If fewer than 15 are picked, the store auto-fills remaining slots with top-rated items!</p>}
                        </div>
                        <button onClick={() => setEditingSectionSlug(editingSectionSlug === secItem.slug ? null : secItem.slug)} className="px-3 py-1.5 bg-surface border border-border rounded-lg text-[10px] font-bold text-blue-500 hover:border-blue-500">
                          {editingSectionSlug === secItem.slug ? "Close Picker" : "Edit Products"}
                        </button>
                      </div>

                      {/* Visual Product Picker Block */}
                      {editingSectionSlug === secItem.slug && (
                        <div className="mb-6 p-4 bg-surface border border-border rounded-xl">
                          <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
                            <div>
                              <p className="text-xs font-bold text-heading">Step 1: Add products {secItem.isGlobal ? "from any catalog" : `from the ${secItem.name} catalog`}</p>
                              <p className="text-[10px] text-muted mt-0.5">Click a product to select or deselect it. (Capacity: {section.productIds.length}/15 used)</p>
                            </div>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                              <input 
                                type="text" 
                                placeholder="Search catalog to add..." 
                                value={cmsProductSearch}
                                onChange={(e) => setCmsProductSearch(e.target.value)}
                                className="pl-8 pr-4 py-2 bg-surface-card border border-border rounded-lg text-xs w-64 focus:border-orange-500 outline-none"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                            {products
                              .filter(p => (secItem.isGlobal || p.categoryName === secItem.slug) && p.name.toLowerCase().includes(cmsProductSearch.toLowerCase()))
                              .slice(0, 50)
                              .map(p => {
                              const isSelected = section.productIds.includes(p.id);
                              return (
                                <div 
                                  key={p.id} 
                                  onClick={() => {
                                    const newSecs = [...homepageSections];
                                    const secIdx = newSecs.findIndex(s => s.slug === secItem.slug);
                                    
                                    if (isSelected) {
                                      if (secIdx > -1) {
                                        newSecs[secIdx].productIds = newSecs[secIdx].productIds.filter(id => id !== p.id);
                                      }
                                    } else {
                                      if (secIdx > -1) {
                                        if (newSecs[secIdx].productIds.length < 15) newSecs[secIdx].productIds.push(p.id);
                                        else showToast("Maximum 15 products allowed per section.", "error");
                                      } else {
                                        newSecs.push({ slug: secItem.slug, title: secItem.name, productIds: [p.id] });
                                      }
                                    }
                                    setHomepageSections(newSecs);
                                  }}
                                  className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-border/50 hover:border-orange-500/50'}`}
                                >
                                  <img src={p.image} className="w-full h-24 object-cover" />
                                  <div className="p-2 bg-surface">
                                    <p className="text-[9px] font-bold truncate" title={p.name}>{p.name}</p>
                                    <p className="text-[10px] text-muted">₹{p.price}</p>
                                    {isSelected && <div className="mt-1 bg-orange-500 text-white text-[8px] font-bold text-center py-0.5 rounded">SELECTED</div>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {products.filter(p => (secItem.isGlobal || p.categoryName === secItem.slug) && p.name.toLowerCase().includes(cmsProductSearch.toLowerCase())).length > 50 && (
                            <p className="text-[10px] text-center text-muted mt-3 italic">Showing first 50 results. Type in the search box to find specific products.</p>
                          )}
                        </div>
                      )}

                      {/* Display Selected Products */}
                      <div className="mb-2">
                        <p className="text-xs font-bold text-heading">Step 2: Review Currently Highlighted Products</p>
                        <p className="text-[10px] text-muted">These exact products are currently visible on the live mobile app homepage. (Hover over a product and click X to remove it).</p>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
                        {section.productIds.length === 0 && <p className="text-xs text-muted italic">No products selected for this section yet.</p>}
                        {section.productIds.map(pid => {
                          const p = products.find(prod => prod.id === pid);
                          if (!p) return null;
                          return (
                            <div key={pid} className="flex-shrink-0 w-32 border border-border/80 rounded-xl overflow-hidden shadow-sm relative group">
                              <button onClick={() => {
                                const newSecs = [...homepageSections];
                                const secIdx = newSecs.findIndex(s => s.slug === secItem.slug);
                                if (secIdx > -1) {
                                  newSecs[secIdx].productIds = newSecs[secIdx].productIds.filter(id => id !== pid);
                                  setHomepageSections(newSecs);
                                }
                              }} className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600">
                                <X size={12} />
                              </button>
                              <img src={p.image} className="w-full h-32 object-cover" />
                              <div className="p-2 bg-surface text-center border-t border-border/50">
                                <p className="text-[10px] font-bold truncate text-heading" title={p.name}>{p.name}</p>
                                <p className="text-[10px] text-orange-500 font-black">₹{p.price}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )})}
                </div>
             </div>
  );
}
