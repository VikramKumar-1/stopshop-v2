"use client";
import { ArrowRight, Package, Building2, UtensilsCrossed, Globe, Truck, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const exportServices = [
  {
    icon: Package,
    title: "Bulk Orders",
    description: "Minimum 50 units with tiered pricing for larger quantities.",
  },
  {
    icon: Building2,
    title: "Hotel Supply",
    description: "Premium cookware and tableware for hospitality chains.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurant Supply",
    description: "Commercial-grade kitchen essentials for restaurants.",
  },
  {
    icon: Globe,
    title: "Middle East Distribution",
    description: "Established distribution channels in UAE, Qatar, and Saudi.",
  },
  {
    icon: Truck,
    title: "Global Shipping",
    description: "Export-grade packaging with worldwide logistics support.",
  },
];

export const ExportProgram = () => {
  return (
    <section className="py-8 md:py-10 relative overflow-hidden section-glass-ambient ambient-ocean">


      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(160,120,60,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(160,120,60,0.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left — Content */}
          <div
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase">
              <Globe size={14} className="text-bronze-500" />
              Unique Differentiator
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-heading leading-[1.15]">
              Export With{" "}
              <span className="gradient-text">StopShop</span>
            </h2>

            {/* Export Services List */}
            <div className="space-y-2 pt-1">
              {exportServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-start gap-3 p-2 sm:p-3 rounded-xl bg-surface-card border border-bronze-500/10 hover:border-bronze-500/20 hover:shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bronze-500/15 to-bronze-600/10 flex items-center justify-center flex-shrink-0 group-hover:from-bronze-500/25 group-hover:to-bronze-600/15">
                      <Icon size={16} className="text-bronze-500 dark:text-bronze-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-heading mb-0.5">{service.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-semibold shadow-xl shadow-bronze-500/15 hover:shadow-bronze-500/30 text-sm"
              >
                <MessageSquare size={16} />
                Request Bulk Quote
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right — Visual Stats Card */}
          <div
            className="relative"
          >
            <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 gradient-border space-y-5 sm:space-y-6">
              {/* Header */}
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-bronze-500/20 to-bronze-600/10 flex items-center justify-center mx-auto">
                  <Truck size={24} className="text-bronze-500 dark:text-bronze-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-heading">Why Export With Us?</h3>
                <p className="text-[11px] sm:text-xs text-muted max-w-sm mx-auto">Trusted by buyers in 20+ countries for quality and reliability.</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { value: "20+", label: "Countries Served", emoji: "🌍" },
                  { value: "500+", label: "Orders Delivered", emoji: "📦" },
                  { value: "48hr", label: "Quote Response", emoji: "⚡" },
                  { value: "100%", label: "Quality Checked", emoji: "✅" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-surface-card/50 border border-bronze-500/10 text-left">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{stat.emoji}</span>
                    <div>
                      <p className="text-sm sm:text-base font-display font-bold gradient-text leading-none mb-1">{stat.value}</p>
                      <p className="text-[9px] sm:text-[10px] text-muted font-medium leading-none">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certificate Showcase */}
              <div className="pt-4 border-t border-bronze-500/10 flex flex-col items-center gap-2">
                <p className="text-[10px] sm:text-xs font-bold text-heading tracking-wider uppercase text-center">DPIIT Certificate of Recognition</p>
                <p className="text-[8px] sm:text-[9px] text-muted -mt-1 text-center font-medium">Ministry of Commerce & Industry, Govt. of India</p>
                <a 
                  href="/certificate.png" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative w-full max-w-[360px] aspect-[1.414/1] rounded-xl overflow-hidden border border-bronze-500/25 shadow-md group/cert cursor-zoom-in bg-white"
                >
                  <Image
                    src="/certificate.png"
                    alt="StopShop Company Export Certificate"
                    fill
                    sizes="360px"
                    className="object-contain p-0"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold bg-bronze-600/90 px-3 py-1.5 rounded-full shadow-md">View Document</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
