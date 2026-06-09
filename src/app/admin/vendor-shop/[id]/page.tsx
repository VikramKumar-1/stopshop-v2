"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, EyeOff, Award, Filter, MapPin, Eye } from "lucide-react";

export default function AdminVendorShop({ params }: { params: { id: string } }) {
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");
  const [modalProduct, setModalProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, pRes, catRes] = await Promise.all([
        fetch("/api/admin/vendors"),
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      if (vRes.ok) {
        const data = await vRes.json();
        const found = data.vendors.find((v:any) => v.id === parseInt(params.id));
        setVendor(found);
      }
      if (pRes.ok) {
        const data = await pRes.json();
        setProducts(data.filter((p:any) => p.vendorId === parseInt(params.id)));
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setDbCategories(data);
        if (data.length > 0) setSelectedCategorySlug(data[0].slug);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (id: number, name: string, currentActive: boolean) => {
    const action = currentActive ? "hide" : "unhide";
    if (!confirm(`Are you sure you want to ${action} "${name}" from the marketplace?`)) return;
    try {
      // Assuming we have a PATCH route to toggle active status or we'll update the product service
      const res = await fetch(`/api/products/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive })
      });
      if (res.ok) {
        alert(`Product ${action}d successfully.`);
        fetchData();
      } else {
        alert(`Failed to ${action} product.`);
      }
    } catch (e) {
      alert(`Error trying to ${action} product.`);
    }
  };
  const handleAssignToHomepage = async () => {
    if (selectedProducts.length === 0 || !selectedCategorySlug) return;
    try {
      // Fetch current settings
      const setRes = await fetch("/api/admin/settings");
      if (!setRes.ok) throw new Error("Failed to fetch settings");
      const { settings } = await setRes.json();
      
      let homepageSections = settings?.homepageSections || [];
      const cat = dbCategories.find(c => c.slug === selectedCategorySlug);
      
      const secIdx = homepageSections.findIndex((s:any) => s.slug === selectedCategorySlug);
      
      if (secIdx > -1) {
        const currentIds = homepageSections[secIdx].productIds;
        const newIds = Array.from(new Set([...currentIds, ...selectedProducts]));
        if (newIds.length > 15) {
          return alert(`Cannot add. The "${cat?.name}" section would exceed the maximum of 15 products (would have ${newIds.length}). Please unselect some products.`);
        }
        homepageSections[secIdx].productIds = newIds;
      } else {
        if (selectedProducts.length > 15) {
           return alert(`Cannot add. Maximum 15 products allowed per section.`);
        }
        homepageSections.push({ slug: selectedCategorySlug, title: cat?.name, productIds: selectedProducts });
      }

      // Save back
      const updateRes = await fetch("/api/admin/settings/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homepageSections })
      });
      
      if (updateRes.ok) {
        alert("Products successfully assigned to homepage section!");
        setSelectedProducts([]);
      } else {
        alert("Failed to assign products to homepage.");
      }
    } catch (e) {
      alert("Error assigning to homepage.");
    }
  };
  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>;
  if (!vendor) return <div className="min-h-screen bg-surface flex items-center justify-center text-muted">Vendor not found</div>;

  // Group products by Category then Material
  const grouped: Record<string, Record<string, any[]>> = {};
  products.forEach(p => {
    if (!grouped[p.categoryName]) grouped[p.categoryName] = {};
    if (!grouped[p.categoryName][p.material]) grouped[p.categoryName][p.material] = [];
    grouped[p.categoryName][p.material].push(p);
  });

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-4">
          <a href="/admin" className="p-2 bg-surface-card border border-border rounded-xl text-muted hover:text-heading transition-colors">
            <ArrowLeft size={20} />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
              <Award className="text-orange-500" /> {vendor.name}'s Catalog
            </h1>
            <p className="text-sm text-muted flex items-center gap-1 mt-1">
              <MapPin size={12} /> {vendor.location} | {products.length} Products Listed
            </p>
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="sticky top-4 z-50 bg-orange-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="font-bold">
              {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} Selected
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium">Assign to:</span>
              <select 
                value={selectedCategorySlug}
                onChange={e => setSelectedCategorySlug(e.target.value)}
                className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg outline-none font-bold"
              >
                {dbCategories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <button 
                onClick={handleAssignToHomepage}
                className="bg-slate-900 hover:bg-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Save to Section
              </button>
            </div>
          </div>
        )}

        {Object.keys(grouped).length === 0 ? (
          <div className="bg-surface-card border border-border p-12 rounded-3xl text-center text-muted">
            This vendor has not uploaded any products yet.
          </div>
        ) : (
          Object.keys(grouped).map(category => (
            <div key={category} className="space-y-6">
              <h2 className="text-xl font-black text-heading uppercase tracking-wider border-b-2 border-border pb-2 inline-block pr-8">
                {category}
              </h2>
              
              {Object.keys(grouped[category]).map(material => (
                <div key={material} className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-orange-500 flex items-center gap-2 mb-4">
                    <Filter size={16} /> Material: {material}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {grouped[category][material].map(p => {
                      const isSelected = selectedProducts.includes(p.id);
                      return (
                      <div key={p.id} className={`bg-surface border ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-border hover:border-orange-500/50'} rounded-xl overflow-hidden group relative flex flex-col transition-all`}>
                        {/* Checkbox for Selection */}
                        <div className="absolute top-2 left-2 z-20">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedProducts([...selectedProducts, p.id]);
                              else setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                            }}
                            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer shadow-sm"
                          />
                        </div>

                        {/* Hide Button */}
                        <button onClick={(e) => { e.stopPropagation(); handleToggleHide(p.id, p.name, p.active); }} className={`absolute top-2 right-2 p-1.5 ${p.active ? 'bg-red-500/90 hover:bg-red-600' : 'bg-emerald-500/90 hover:bg-emerald-600'} text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm`} title={p.active ? "Hide Product" : "Unhide Product"}>
                          {p.active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        <div onClick={() => setModalProduct(p)} className="flex flex-col flex-grow cursor-pointer">
                          <div className={`h-32 relative overflow-hidden ${!p.active ? 'opacity-50 grayscale' : 'bg-surface-hover'}`}>
                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={p.name} />
                            {p.stock <= 5 && p.active && <span className="absolute bottom-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">Only {p.stock} left</span>}
                            {!p.active && <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-[2px]">HIDDEN</span>}
                          </div>
                          <div className="p-3 flex flex-col flex-grow">
                            <p className="text-xs font-bold text-heading truncate group-hover:text-orange-500 transition-colors" title={p.name}>{p.name}</p>
                            <div className="flex justify-between items-center mt-auto pt-2">
                              <p className="text-xs font-black text-emerald-500">₹{p.price.toLocaleString()}</p>
                              <p className="text-[10px] text-muted font-mono">#{p.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

      </div>

      {/* Product Details Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setModalProduct(null)} className="absolute top-4 right-4 p-2 bg-surface-hover hover:bg-red-500 hover:text-white text-muted rounded-xl transition-colors z-10">
              <span className="sr-only">Close</span>
              <EyeOff size={20} className="hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Images */}
                <div className="md:w-1/2 space-y-4">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-surface-hover border border-border">
                    <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-full object-cover" />
                  </div>
                  {modalProduct.images && Array.isArray(modalProduct.images) && modalProduct.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
                      {modalProduct.images.map((img: string, idx: number) => (
                        <img key={idx} src={img} alt="" className="w-20 h-20 rounded-xl object-cover border border-border flex-shrink-0" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="md:w-1/2 flex flex-col">
                  <div className="mb-2">
                    <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-orange-500/20">{modalProduct.categoryName}</span>
                  </div>
                  <h2 className="text-2xl font-black text-heading leading-tight mb-2">{modalProduct.name}</h2>
                  <p className="text-sm font-mono text-muted mb-4">Product ID: #{modalProduct.id}</p>
                  
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="text-3xl font-black text-emerald-500">₹{modalProduct.price.toLocaleString()}</div>
                    <div className="text-sm text-muted line-through">₹{modalProduct.mrp.toLocaleString()}</div>
                    <div className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-lg">-{modalProduct.discount}%</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-card p-4 rounded-2xl border border-border">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Material</p>
                      <p className="font-bold text-heading">{modalProduct.material}</p>
                    </div>
                    <div className="bg-surface-card p-4 rounded-2xl border border-border">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Stock Level</p>
                      <p className={`font-bold ${modalProduct.stock <= 5 ? 'text-red-500' : 'text-heading'}`}>{modalProduct.stock} Units</p>
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div>
                      <h4 className="text-sm font-bold text-heading mb-2">Description</h4>
                      <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{modalProduct.description}</p>
                    </div>
                    {modalProduct.specs && (
                      <div>
                        <h4 className="text-sm font-bold text-heading mb-2 mt-4">Specifications</h4>
                        <div className="bg-surface-hover p-4 rounded-xl border border-border">
                          <p className="text-xs text-muted leading-relaxed">{modalProduct.specs.split(' | ').map((s:string) => <span key={s} className="block mb-1">• {s}</span>)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
