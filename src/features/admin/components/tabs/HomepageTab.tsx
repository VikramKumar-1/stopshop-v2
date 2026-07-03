"use client";
import React from "react";
import { Search, X, Loader2 } from "lucide-react";

export function HomepageTab({
  homepageSections,
  setHomepageSections,
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
                         body: JSON.stringify({ homepageSections })
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
                 {dbCategories.map((cat) => {
                   const section = homepageSections.find(s => s.slug === cat.slug) || { slug: cat.slug, productIds: [] as number[] };
                   return (
                   <div key={cat.slug} className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                       <h4 className="text-lg font-bold text-heading">{cat.name}</h4>
                       <button onClick={() => setEditingSectionSlug(editingSectionSlug === cat.slug ? null : cat.slug)} className="px-3 py-1.5 bg-surface border border-border rounded-lg text-[10px] font-bold text-blue-500 hover:border-blue-500">
                         {editingSectionSlug === cat.slug ? "Close Picker" : "Edit Products"}
                       </button>
                     </div>

                     {/* Visual Product Picker Block */}
                     {editingSectionSlug === cat.slug && (
                       <div className="mb-6 p-4 bg-surface border border-border rounded-xl">
                         <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
                           <p className="text-xs font-bold text-heading">Select up to 15 products (Currently: {section.productIds.length}/15)</p>
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
                             .filter(p => p.categoryName === cat.slug && p.name.toLowerCase().includes(cmsProductSearch.toLowerCase()))
                             .slice(0, 50)
                             .map(p => {
                             const isSelected = section.productIds.includes(p.id);
                             return (
                               <div 
                                 key={p.id} 
                                 onClick={() => {
                                   const newSecs = [...homepageSections];
                                   const secIdx = newSecs.findIndex(s => s.slug === cat.slug);
                                   
                                   if (isSelected) {
                                     if (secIdx > -1) {
                                       newSecs[secIdx].productIds = newSecs[secIdx].productIds.filter(id => id !== p.id);
                                     }
                                   } else {
                                     if (secIdx > -1) {
                                       if (newSecs[secIdx].productIds.length < 15) newSecs[secIdx].productIds.push(p.id);
                                       else showToast("Maximum 15 products allowed per section.", "error");
                                     } else {
                                       newSecs.push({ slug: cat.slug, title: cat.name, productIds: [p.id] });
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
                         {products.filter(p => p.categoryName === cat.slug && p.name.toLowerCase().includes(cmsProductSearch.toLowerCase())).length > 50 && (
                           <p className="text-[10px] text-center text-muted mt-3 italic">Showing first 50 results. Type in the search box to find specific products.</p>
                         )}
                       </div>
                     )}

                     {/* Display Selected Products */}
                     <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
                       {section.productIds.length === 0 && <p className="text-xs text-muted italic">No products selected for this section yet.</p>}
                       {section.productIds.map(pid => {
                         const p = products.find(prod => prod.id === pid);
                         if (!p) return null;
                         return (
                           <div key={pid} className="flex-shrink-0 w-32 border border-border/80 rounded-xl overflow-hidden shadow-sm relative group">
                             <button onClick={() => {
                               const newSecs = [...homepageSections];
                               const secIdx = newSecs.findIndex(s => s.slug === cat.slug);
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
