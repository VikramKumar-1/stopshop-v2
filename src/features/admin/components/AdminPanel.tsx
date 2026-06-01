"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, ShieldAlert, LogOut, CheckCircle, Mail, Phone, MapPin, Package, Award } from "lucide-react";

export const AdminPanel = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard Data
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"inquiries" | "products" | "add-product">("inquiries");

  // Create Product Form
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    specs: "",
    price: "",
    mrp: "",
    discount: "0",
    categoryName: "kitchen-utility",
    material: "Bronze",
    stock: "10",
    featured: false,
    newLaunch: false,
  });

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user.role === "admin") {
          setAuthorized(true);
          fetchData();
        } else {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    } catch (e) {
      setAuthorized(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user.role === "admin") {
        setAuthorized(true);
        fetchData();
      } else {
        setLoginError(data.error || "Access Denied. Admin privilege required.");
      }
    } catch (err) {
      setLoginError("Failed to authenticate with server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setAuthorized(false);
  };

  const fetchData = async () => {
    try {
      // Fetch inquiries
      const resInq = await fetch("/api/inquiries");
      if (resInq.ok) {
        const dataInq = await resInq.json();
        setInquiries(dataInq);
      }

      // Fetch products
      const resProd = await fetch("/api/products", { cache: "no-store" });
      if (resProd.ok) {
        const dataProd = await resProd.json();
        setProducts(dataProd);
      }
    } catch (e) {
      console.error("Failed to load admin data");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      if (res.ok) {
        alert("Product created successfully!");
        setProductForm({
          name: "",
          description: "",
          specs: "",
          price: "",
          mrp: "",
          discount: "0",
          categoryName: "kitchen-utility",
          material: "Bronze",
          stock: "10",
          featured: false,
          newLaunch: false,
        });
        setActiveTab("products");
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create product");
      }
    } catch (err) {
      alert("Error creating product");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product deleted!");
        fetchData();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bronze-500" />
      </div>
    );
  }

  // Admin login screen
  if (!authorized) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface-card border border-border p-8 rounded-3xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-display font-bold text-heading">Admin Portal</h1>
            <p className="text-xs text-muted">Sign in to manage StopShop inquiries and inventory.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <div className="p-3 bg-red-500/5 text-red-500 text-xs border border-red-500/20 rounded-xl">{loginError}</div>}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stopshop.com"
                className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-xs text-heading focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-xs text-heading focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-bronze-500 to-bronze-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Interface
  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-bronze-950 via-bronze-900 to-bronze-950 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-bronze-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Administrative Dashboard</h1>
            <p className="text-xs text-bronze-200/80">Manage products, view export inquiries, and verify store logistics.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-4 mb-8">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === "inquiries" ? "text-bronze-500" : "text-muted hover:text-heading"
            }`}
          >
            Export Inquiries ({inquiries.length})
            {activeTab === "inquiries" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze-500" />}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === "products" ? "text-bronze-500" : "text-muted hover:text-heading"
            }`}
          >
            Products Catalog ({products.length})
            {activeTab === "products" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze-500" />}
          </button>
          <button
            onClick={() => setActiveTab("add-product")}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === "add-product" ? "text-bronze-500" : "text-muted hover:text-heading"
            }`}
          >
            Add New Product
            {activeTab === "add-product" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze-500" />}
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            {inquiries.length === 0 ? (
              <div className="text-center py-12 bg-surface-card border border-border rounded-2xl">
                <p className="text-sm text-muted">No export inquiries received yet.</p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  {/* Inquiry Header */}
                  <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-border">
                    <div>
                      <h3 className="font-bold text-base text-heading">{inq.name}</h3>
                      <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
                        <MapPin size={12} />
                        {inq.country || "Domestic Sales"} {inq.companyName ? `(${inq.companyName})` : ""}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-muted bg-surface border border-border px-3 py-1 rounded-full">
                      Received: {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Inquiry Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-body">
                        <Mail size={14} className="text-muted" />
                        <span className="font-bold">Email:</span> {inq.email}
                      </p>
                      <p className="flex items-center gap-2 text-body">
                        <Phone size={14} className="text-muted" />
                        <span className="font-bold">Phone:</span> {inq.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-heading mb-1">Message / Requirements:</h4>
                      <p className="text-muted italic bg-surface p-3 rounded-lg border border-border">{inq.message}</p>
                    </div>
                  </div>

                  {/* Cart Items if present */}
                  {inq.items && (
                    <div className="bg-surface border border-border rounded-xl p-4">
                      <h4 className="font-bold text-xs text-heading mb-2">Requested Items:</h4>
                      <div className="space-y-2 text-xs">
                        {(inq.items as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-body">
                              {item.name} <span className="text-muted">({item.material})</span>
                            </span>
                            <span className="font-bold text-heading">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-muted font-bold uppercase tracking-wider">
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Material</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-surface-hover transition-colors text-body">
                    <td className="p-4 font-bold text-heading">{prod.name}</td>
                    <td className="p-4 uppercase">{prod.categoryName}</td>
                    <td className="p-4 font-semibold">{prod.material}</td>
                    <td className="p-4">₹{prod.price.toLocaleString()}</td>
                    <td className={`p-4 font-bold ${prod.stock <= 5 ? "text-red-500" : "text-emerald-600"}`}>
                      {prod.stock}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "add-product" && (
          <div className="max-w-2xl bg-surface-card border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-heading mb-6">Create New Database Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Traditional Bell-Metal Patila"
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Specs (e.g. Dimensions/Weight) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.specs}
                    onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                    placeholder="e.g. Capacity: 2L | Weight: 1.5kg"
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted uppercase tracking-wider">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe product craftsmanship, heating details, wellness benefits..."
                  className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="2500"
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">MRP (INR)</label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    placeholder="3000"
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Discount (%)</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Category *</label>
                  <select
                    value={productForm.categoryName}
                    onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value })}
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="kitchen-utility">Kitchen Utility</option>
                    <option value="brass-cookware">Brass Cookware</option>
                    <option value="copper-products">Copper Products</option>
                    <option value="steel-essentials">Steel Essentials</option>
                    <option value="home-living">Home Living</option>
                    <option value="bedroom-essentials">Bedroom Essentials</option>
                    <option value="living-room">Living Room</option>
                    <option value="handicrafts">Handicrafts</option>
                    <option value="pooja-collection">Pooja Collection</option>
                    <option value="kitchen-racks">Kitchen Racks</option>
                    <option value="dinner-sets">Dinner Sets</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Material *</label>
                  <select
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Copper">Copper</option>
                    <option value="Brass">Brass</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted uppercase tracking-wider">Stock *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-surface border border-border focus:border-bronze-500/80 rounded-xl px-4 py-2.5 text-heading focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-heading">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="rounded border-border text-bronze-500 focus:ring-bronze-500"
                  />
                  Featured Product
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-heading">
                  <input
                    type="checkbox"
                    checked={productForm.newLaunch}
                    onChange={(e) => setProductForm({ ...productForm, newLaunch: e.target.checked })}
                    className="rounded border-border text-bronze-500 focus:ring-bronze-500"
                  />
                  New Launch
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-bronze-500 to-bronze-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300"
              >
                Add Product to Catalog
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
