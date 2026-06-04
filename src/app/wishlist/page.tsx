"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart, ArrowLeft, Star } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { convertPrice, getRawPrice } = useRegion();

  return (
    <div className="min-h-screen bg-surface pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors font-medium mb-2 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-heading flex items-center gap-3">
              My <span className="gradient-text">Wishlist</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                {wishlist.length} Items
              </span>
            </h1>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-surface-card border border-border/80 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -z-10" />
            <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4 border border-orange-500/10">
              <Heart size={28} />
            </div>
            <h2 className="text-lg font-bold text-heading mb-1.5">Your Wishlist is Empty</h2>
            <p className="text-xs text-muted max-w-xs mx-auto mb-6 leading-relaxed">
              Explore our premium handcrafted utensils and add items you love to your wishlist.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const displayPrice = item.price;
              const displayMrp = item.mrp;

              return (
                <div
                  key={item.id}
                  className="group bg-surface-card border border-bronze-500/[0.12] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-square w-full bg-orange-50/50 dark:bg-white/5 overflow-hidden border-b border-border/50">
                    <Link href={`/product/${item.slug || item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-border/60 hover:border-red-500/30 hover:text-red-500 text-muted rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                    
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                      {item.material}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Rating details */}
                      <div className="flex items-center gap-1.5 text-[10px] text-muted mb-1">
                        <div className="flex items-center gap-0.5 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                          <span>{item.rating}</span>
                          <Star size={8} fill="currentColor" className="stroke-none" />
                        </div>
                        <span>({item.reviews})</span>
                      </div>

                      {/* Name */}
                      <Link href={`/product/${item.slug || item.id}`}>
                        <h3 className="text-xs sm:text-sm font-bold text-heading hover:text-bronze-500 transition-colors line-clamp-1 mb-1 leading-snug">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Specs */}
                      <p className="text-[10px] text-muted line-clamp-1 mb-3">{item.specs}</p>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-1.5 mb-4 flex-wrap">
                        <span className="text-base font-bold text-heading">{convertPrice(displayPrice, item, false)}</span>
                        {getRawPrice(displayMrp, item, true) > getRawPrice(displayPrice, item, false) && (
                          <span className="text-xs text-muted line-through">{convertPrice(displayMrp, item, true)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Add to Inquiry/Cart Button */}
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="flex-grow inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-bold shadow-md shadow-bronze-500/10 text-[10px] sm:text-xs transition-all duration-300 active:scale-[0.97]"
                      >
                        <ShoppingCart size={13} />
                        Add to Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
