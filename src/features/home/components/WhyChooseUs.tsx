"use client";

import { Check, ShieldCheck } from "lucide-react";
import Image from "next/image";

const trustPoints = [
  "Authentic Indian Materials",
  "Quality Checked Products",
  "Export Grade Packaging",
  "MSME & Artisan Sourced",
  "Trusted by Global Buyers",
  "Direct Factory Pricing",
];

export const WhyChooseUs = () => {
  return (
    <section className="py-6 md:py-8 relative overflow-hidden section-glass-ambient ambient-bronze">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Content */}
          <div
            className="space-y-6"
          >
            <div>
              <p
                className="text-sm uppercase tracking-[0.2em] text-orange-600 dark:text-bronze-400 font-medium mb-3"
              >
                Why StopShop
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading leading-[1.15]"
              >
                Built for Trust,{" "}
                <span className="gradient-text">Made in India</span>
              </h2>
            </div>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-emerald-500" strokeWidth={3} />
                  </div>
                  <span className="text-sm sm:text-base text-heading font-medium">{point}</span>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-3 pt-3 border-t border-bronze-500/10 mt-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bronze-500/15 to-bronze-600/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-bronze-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-heading">100% Verified Products</p>
                <p className="text-xs text-muted">Every item inspected before shipping</p>
              </div>
            </div>
          </div>

          {/* Right — Image */}
          <div
            className="relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-bronze-900/10">
              <Image
                src="/bronze-hero.png"
                alt="StopShop quality checked products"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Subtle warm overlay */}

            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 glass rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-2xl z-20"
            >
              <p className="text-xl sm:text-2xl font-display font-bold gradient-text">20+</p>
              <p className="text-[10px] sm:text-xs text-muted font-medium">Countries Trust Us</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
