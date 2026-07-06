"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { intentQueue } from "@/lib/analytics/intentQueue";

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  prices?: any;
  image: string;
  specs: string;
  material: string;
  categoryName: string;
  quantity: number;
  stock: number;
  vendorId?: number;
  crossSellIds?: any;
  bundleDiscountType?: string;
  bundleDiscountValue?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  addBundleToCart: (products: any[], quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  bundleDiscount: number;
  cartTotalAfterBundle: number;
  loaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initCart = async () => {
      let localCart: CartItem[] = [];
      const savedCart = localStorage.getItem("stopshops-cart");
      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse local cart");
        }
      }

      try {
        const authRes = await fetch("/api/auth/me", { headers: { 'Cache-Control': 'no-cache' } });
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated) {
            setIsAuthenticated(true);
            
            // Sync local cart to DB if any
            if (localCart.length > 0) {
              await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "SYNC", items: localCart })
              });
              localStorage.removeItem("stopshops-cart");
              localCart = []; // clear local reference
            }

            // Fetch DB cart
            const cartRes = await fetch("/api/cart", { headers: { 'Cache-Control': 'no-cache' } });
            if (cartRes.ok) {
              const cartData = await cartRes.json();
              if (cartData.items) {
                setCart(cartData.items);
                setLoaded(true);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to init auth/cart", err);
      }
      
      // Fallback or unauthenticated
      setCart(localCart);
      setLoaded(true);
    };

    initCart();
  }, []);

  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    if (!isAuthenticated) {
      localStorage.setItem("stopshops-cart", JSON.stringify(newCart));
    }
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    const stock = product.stock !== undefined ? product.stock : 10;
    const price = product.price || Math.round(product.id * 100 + 299);
    const mrp = product.mrp || Math.round(product.id * 150 + 499);
    const slug = product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || String(product.id);
    const qtyToAdd = Math.min(quantity, stock);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      const newCart = [...prevCart];

      if (existingIndex > -1) {
        const newQty = newCart[existingIndex].quantity + quantity;
        newCart[existingIndex].quantity = Math.min(newQty, stock);
      } else {
        newCart.push({
          id: product.id,
          slug,
          name: product.name,
          price,
          mrp,
          prices: product.prices,
          image: product.image,
          specs: product.specs || "",
          material: product.material || "Bronze",
          categoryName: product.categoryName || "kitchen-utility",
          quantity: qtyToAdd,
          stock,
          vendorId: product.vendorId || product.vendor?.id,
          crossSellIds: product.crossSellIds,
          bundleDiscountType: product.bundleDiscountType,
          bundleDiscountValue: product.bundleDiscountValue,
        });
      }
      
      if (!isAuthenticated) {
        localStorage.setItem("stopshops-cart", JSON.stringify(newCart));
      }
      return newCart;
    });

    if (isAuthenticated) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD", item: { id: product.id, quantity: qtyToAdd } })
      }).catch(console.error);
    }
    
    // Background sync intent for targeted vendor retargeting via queue
    const vendorId = product.vendorId || product.vendor?.id;
    if (vendorId) {
      intentQueue.track({ productId: product.id, vendorId, type: "CART" });
    }

    // Show toast notification
    setToastMessage(`"${product.name}" added to cart successfully!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addBundleToCart = async (products: any[], quantity: number = 1) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];

      products.forEach((product) => {
        const existingIndex = newCart.findIndex((item) => item.id === product.id);
        const stock = product.stock !== undefined ? product.stock : 10;
        const price = product.price || Math.round(product.id * 100 + 299);
        const mrp = product.mrp || Math.round(product.id * 150 + 499);
        const slug = product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || String(product.id);

        if (existingIndex > -1) {
          const newQty = newCart[existingIndex].quantity + quantity;
          newCart[existingIndex].quantity = Math.min(newQty, stock);
        } else {
          newCart.push({
            id: product.id,
            slug,
            name: product.name,
            price,
            mrp,
            prices: product.prices,
            image: product.image,
            specs: product.specs || "",
            material: product.material || "Bronze",
            categoryName: product.categoryName || "kitchen-utility",
            quantity: Math.min(quantity, stock),
            stock,
            vendorId: product.vendorId || product.vendor?.id,
            crossSellIds: product.crossSellIds,
            bundleDiscountType: product.bundleDiscountType,
            bundleDiscountValue: product.bundleDiscountValue,
          });
        }
      });

      if (!isAuthenticated) {
        localStorage.setItem("stopshops-cart", JSON.stringify(newCart));
      }
      return newCart;
    });

    if (isAuthenticated) {
      // Sync all added items
      const itemsToSync = products.map(p => ({
        id: p.id,
        quantity: Math.min(quantity, p.stock !== undefined ? p.stock : 10)
      }));
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SYNC", items: itemsToSync })
      }).catch(console.error);
    }

    // Background sync intent
    products.forEach((product) => {
      const vendorId = product.vendorId || product.vendor?.id;
      if (vendorId) {
        intentQueue.track({ productId: product.id, vendorId, type: "CART" });
      }
    });

    // Show toast notification
    setToastMessage(`🎁 Complete Bundle (${products.length} items) added to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.id !== productId);
    saveCart(newCart);

    if (isAuthenticated) {
      fetch(`/api/cart?productId=${productId}`, { method: "DELETE" }).catch(console.error);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const existingIndex = cart.findIndex((item) => item.id === productId);
    if (existingIndex > -1) {
      const newCart = [...cart];
      const stock = newCart[existingIndex].stock;
      const newQty = Math.max(1, Math.min(quantity, stock));
      newCart[existingIndex].quantity = newQty;
      saveCart(newCart);

      if (isAuthenticated) {
        fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: newQty })
        }).catch(console.error);
      }
    }
  };

  const clearCart = () => {
    saveCart([]);
    if (isAuthenticated) {
      fetch("/api/cart", { method: "DELETE" }).catch(console.error);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  let bundleDiscount = 0;
  cart.forEach((item) => {
    if (item.crossSellIds && Array.isArray(item.crossSellIds) && item.crossSellIds.length > 0) {
      const allPresent = item.crossSellIds.every((id: number) => cart.some(c => c.id === id));
      if (allPresent) {
        const quantities = [item.quantity, ...item.crossSellIds.map((id: number) => cart.find(c => c.id === id)?.quantity || 0)];
        const bundleSets = Math.min(...quantities);
        
        if (bundleSets > 0) {
          if (item.bundleDiscountType === "FLAT") {
            bundleDiscount += (item.bundleDiscountValue || 0) * bundleSets;
          } else if (item.bundleDiscountType === "PERCENTAGE") {
            const crossSellItemsCost = item.crossSellIds.reduce((sum: number, id: number) => sum + (cart.find(c => c.id === id)?.price || 0), 0);
            const totalBundleUnitCost = item.price + crossSellItemsCost;
            bundleDiscount += (totalBundleUnitCost * (item.bundleDiscountValue || 0) / 100) * bundleSets;
          }
        }
      }
    }
  });

  const cartTotalAfterBundle = Math.max(0, cartTotal - bundleDiscount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addBundleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        bundleDiscount,
        cartTotalAfterBundle,
        loaded,
      }}
    >
      {children}
      
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-orange-500 to-orange-600 dark:from-bronze-600 dark:to-bronze-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 size={12} className="text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
