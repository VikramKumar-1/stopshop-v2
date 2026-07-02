"use client";

import { Search, ShieldCheck, Box, Plane, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Sourcing",
    description: "Direct partnerships with India's finest bronze artisans and manufacturers.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Quality Check",
    description: "Multi-stage inspection to meet international safety and durability standards.",
  },
  {
    icon: Box,
    number: "03",
    title: "Packaging",
    description: "Premium, secure packaging designed for long-distance international shipping.",
  },
  {
    icon: Plane,
    number: "04",
    title: "Delivery",
    description: "Reliable logistics with full documentation and real-time order tracking.",
  },
];

export const ExportProcessPreview = () => {
  return (
    <section className="py-10 md:py-12 section-glass-ambient ambient-ocean overflow-hidden">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Export Theme Background Line Art Drawing */}
        <div className="absolute right-0 bottom-0 w-[320px] h-[240px] sm:w-[400px] sm:h-[300px] opacity-25 dark:opacity-10 pointer-events-none z-0 [contain:strict]">
          <img 
            src="/images/export-process-bg.svg" 
            alt="Export Process Background" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 gap-6 relative z-10">
          <div className="space-y-4">
            <p
              className="text-sm uppercase tracking-[0.2em] text-orange-600 dark:text-bronze-400 font-medium"
            >
              Our Process
            </p>
            <h2
              className="text-4xl sm:text-5xl font-display font-bold text-heading"
            >
              How We <span className="gradient-text">Export</span>
            </h2>
          </div>
          <div>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm text-orange-600 dark:text-bronze-400 hover:text-orange-500 dark:hover:text-bronze-300"
            >
              View full process
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative glass rounded-2xl p-8 hover-lift gradient-border"
            >
              <span className="absolute top-6 right-6 text-5xl font-display font-bold text-heading/[0.04] group-hover:text-bronze-500/10">
                {step.number}
              </span>
              <div className="relative space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bronze-500/20 to-bronze-600/10 flex items-center justify-center group-hover:from-bronze-500/30 group-hover:to-bronze-600/20">
                  <step.icon size={26} className="text-bronze-500 dark:text-bronze-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-heading">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-bronze-500/25 dark:border-bronze-700/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
