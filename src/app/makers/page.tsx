import React from "react";
import Link from "next/link";
import { Store, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { prisma } from "@/lib/db";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MakersPage() {
  // Fetch all approved vendors directly via Prisma (Server Component)
  const vendors = await prisma.user.findMany({
    where: { role: "vendor", vendorStatus: "APPROVED" },
    select: {
      id: true,
      name: true,
      location: true,
      createdAt: true,
      _count: {
        select: { products: true }
      },
      products: {
        select: { image: true },
        take: 3, // Get up to 3 preview images
      }
    },
    orderBy: { createdAt: "asc" } // Show oldest/most established first
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-4 pb-20">
      
      {/* Header Banner */}
      <div className="relative bg-[#1A0F05] border-y border-orange-900/30 overflow-hidden mb-10">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none [contain:strict]"
          style={{
            backgroundImage: `url('/images/heritage-pattern.svg')`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300 tracking-wider uppercase mb-2">
            <Heart size={13} className="text-orange-400" />
            Our Heritage
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-orange-50">
            Meet Our <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">Makers</span>
          </h1>
          <p className="text-orange-200/80 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Discover the incredibly talented Indian artisans behind our premium handcrafted collections. Every purchase directly supports these master craftsmen and helps keep traditional heritage alive.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-orange-300">
            <div className="flex items-center gap-2 text-sm font-bold bg-[#2D1A08] px-4 py-2 rounded-full border border-orange-800/40 shadow-xl">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>{vendors.length} Verified Partners</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold bg-[#2D1A08] px-4 py-2 rounded-full border border-orange-800/40 shadow-xl">
              <CheckCircle2 size={16} className="text-amber-400" />
              <span>100% Authentic Handcrafted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {vendors.map((vendor) => {
            const cleanSlug = vendor.name ? vendor.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : vendor.id;
            const vendorUrl = `/store/${cleanSlug}`;

            return (
              <Link
                key={vendor.id}
                href={vendorUrl}
                className="group flex flex-col bg-surface-card border border-border hover:border-orange-500/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Store Profile Area */}
                <div className="p-6 sm:p-8 flex items-start gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Store size={28} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded flex items-center w-fit gap-1">
                      <ShieldCheck size={10} /> Verified
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-heading font-display group-hover:text-orange-500 transition-colors line-clamp-1">
                      {vendor.name || "Artisan Workshop"}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                      <MapPin size={13} className="text-orange-400 shrink-0" />
                      <span className="truncate">{vendor.location || "India"}</span>
                    </div>
                  </div>
                </div>

                {/* Preview Images */}
                <div className="px-6 pb-6">
                  {vendor.products.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {vendor.products.map((p, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-surface-hover border border-border">
                          <Image
                            src={p.image}
                            alt="Product preview"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                      {/* Fill empty spots if less than 3 products */}
                      {Array.from({ length: 3 - vendor.products.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="relative aspect-square rounded-xl bg-surface-hover border border-border flex items-center justify-center text-muted/30">
                          <Store size={20} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-xl bg-surface-hover border border-border flex flex-col items-center justify-center text-muted gap-2">
                      <Store size={24} className="opacity-40" />
                      <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">Workshop Setup in Progress</span>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="px-6 py-4 bg-surface border-t border-border mt-auto flex items-center justify-between">
                  <div className="text-xs text-muted font-semibold">
                    <span className="text-heading font-black">{vendor._count?.products || 0}</span> Unique items
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
                    Visit Store <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {vendors.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Store size={48} className="mx-auto text-muted/50" />
            <h2 className="text-xl font-bold text-heading">No Artisans Available Yet</h2>
            <p className="text-muted text-sm">We are currently onboarding master craftsmen to our platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}
