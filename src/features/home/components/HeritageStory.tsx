"use client";

import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const HeritageStory = ({ vendorCount = 0 }: { vendorCount?: number }) => {
  // If vendorCount is 0 (still loading) or less than 12, just say 12+ as a fallback/minimum
  const displayCount = vendorCount > 12 ? vendorCount : 12;

  return (
    <section className="lazy-scroll-section py-8 md:py-10 relative overflow-hidden bg-[#1A0F05] border-y border-orange-900/30">

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none [contain:strict]"
        style={{
          backgroundImage: `url('/images/heritage-pattern.svg')`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Image */}
          <div
            className="relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-black/30">
              <Image
                src="/bronze-kadai.png"
                alt="Indian artisans crafting bronze utensils"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

            </div>

            {/* Floating stat badge */}
            <div
              className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-[#2D1A08] border border-orange-800/40 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-2xl z-20"
            >
              <p className="text-2xl sm:text-3xl font-display font-bold text-amber-400">{displayCount}+</p>
              <p className="text-[10px] sm:text-xs text-orange-300/80 font-medium">Artisan Partners</p>
            </div>
          </div>

          {/* Right — Content */}
          <div
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300 tracking-wider uppercase">
              <Heart size={13} className="text-orange-400" />
              Our Heritage
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-orange-50 leading-[1.15]">
              From Indian{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Artisans
              </span>
              <br />
              to Global Homes
            </h2>

            {/* Heritage stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              {[
                { value: "50+", label: "Artisan Clusters" },
                { value: "12", label: "Indian States" },
                { value: "100%", label: "Handcrafted" },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-display font-bold text-amber-400">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-orange-300/70 font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/makers"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-xl shadow-orange-900/30 hover:shadow-orange-800/40 text-sm"
            >
              Meet Our Makers
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
