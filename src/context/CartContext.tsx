"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

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
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  loaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("stopshops-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart");
      }
    }
    setLoaded(true);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("stopshops-cart", JSON.stringify(newCart));
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          const existingIndex = cart.findIndex((item) => item.id === product.id);
          const newCart = [...cart];

          const stock = product.stock !== undefined ? product.stock : 10;
          const price = product.price || Math.round(product.id * 100 + 299);
          const mrp = product.mrp || Math.round(product.id * 150 + 499);
          const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
            });
          }
          saveCart(newCart);
          
          // Show toast notification
          setToastMessage(`"${product.name}" added to cart successfully!`);
          const timer = setTimeout(() => {
            setToastMessage(null);
          }, 3000);
        } else {
          window.location.href = `/profile?redirect=${encodeURIComponent(window.location.pathname)}&reason=inquiry`;
        }
      } else {
        window.location.href = `/profile?redirect=${encodeURIComponent(window.location.pathname)}&reason=inquiry`;
      }
    } catch (e) {
      console.error("Auth check failed during add to cart:", e);
      window.location.href = `/profile?redirect=${encodeURIComponent(window.location.pathname)}&reason=inquiry`;
    }
  };

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.id !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const existingIndex = cart.findIndex((item) => item.id === productId);
    if (existingIndex > -1) {
      const newCart = [...cart];
      const stock = newCart[existingIndex].stock;
      newCart[existingIndex].quantity = Math.max(1, Math.min(quantity, stock));
      saveCart(newCart);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
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

