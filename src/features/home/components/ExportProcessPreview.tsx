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
        <svg className="absolute right-0 bottom-0 w-[320px] h-[240px] sm:w-[400px] sm:h-[300px] text-orange-700 dark:text-bronze-500 opacity-25 dark:opacity-10 pointer-events-none z-0" viewBox="0 0 500 400" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Sea Wave Lines */}
          <path d="M 0 350 Q 125 330 250 350 T 500 350 M 0 370 Q 125 350 250 370 T 500 370" />
          
          {/* Cargo Ship Outline */}
          <path d="M 120 300 L 380 300 L 410 330 L 90 330 Z" strokeWidth="1.5" />
          <rect x="140" y="270" width="30" height="30" />
          <rect x="175" y="270" width="30" height="30" />
          <rect x="210" y="260" width="30" height="40" />
          <rect x="245" y="250" width="30" height="50" />
          <rect x="280" y="270" width="35" height="30" />
          <rect x="320" y="260" width="30" height="40" />
          
          <path d="M 360 300 L 360 250 L 375 250 L 375 300" />
          <path d="M 360 270 L 375 270" />
          <path d="M 370 250 L 370 230" />
          
          {/* Globe Grid behind the ship */}
          <circle cx="250" cy="180" r="120" strokeDasharray="3,3" />
          <path d="M 130 180 Q 250 120 370 180" />
          <path d="M 130 180 Q 250 240 370 180" />
          <path d="M 250 60 Q 210 180 250 300" />
          <path d="M 250 60 Q 290 180 250 300" />
          
          {/* Export routes */}
          <path d="M 250 180 Q 350 120 420 160" strokeWidth="1.5" strokeDasharray="5,5" />
          <path d="M 250 180 Q 150 100 80 140" strokeWidth="1.5" strokeDasharray="5,5" />
          <path d="M 250 180 Q 300 80 340 50" strokeWidth="1.5" strokeDasharray="5,5" />
          
          {/* Compass Rose */}
          <g transform="translate(80, 80) scale(0.6)">
            <circle cx="50" cy="50" r="40" strokeDasharray="2,2" />
            <path d="M 50 10 L 50 90 M 10 50 L 90 50" />
            <path d="M 50 10 L 55 45 L 90 50 L 55 55 L 50 90 L 45 55 L 10 50 L 45 45 Z" fill="none" strokeWidth="1" />
          </g>
        </svg>

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
