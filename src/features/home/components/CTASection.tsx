"use client";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-10 md:py-12 section-glass-ambient ambient-bronze">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-bronze-600 to-bronze-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 px-8 sm:px-16 py-16 sm:py-20 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-xs font-medium text-bronze-100 tracking-wider uppercase">
              <MessageSquare size={14} />
              Ready to Partner?
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white max-w-3xl mx-auto leading-tight">
              Start Exporting Premium Bronze Bartan Today
            </h2>

            <p className="text-bronze-100/80 max-w-xl mx-auto text-lg">
              Get a custom quote for your business. We handle sourcing, packaging, documentation, and international shipping.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-bronze-800 font-semibold shadow-xl"
              >
                Get Your Free Quote
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 text-white font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
