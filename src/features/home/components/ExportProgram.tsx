"use client";
import { motion } from "framer-motion";
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
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bronze-500/[0.05] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/[0.05] rounded-full blur-[180px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(160,120,60,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(160,120,60,0.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase">
              <Globe size={14} className="text-bronze-500" />
              Unique Differentiator
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading leading-[1.15]">
              Export With{" "}
              <span className="gradient-text">StopShop</span>
            </h2>

            {/* Export Services List */}
            <div className="space-y-3 pt-2">
              {exportServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group flex items-start gap-3.5 p-3 sm:p-4 rounded-xl bg-surface-card border border-bronze-500/10 hover:border-bronze-500/20 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-bronze-500/15 to-bronze-600/10 flex items-center justify-center flex-shrink-0 group-hover:from-bronze-500/25 group-hover:to-bronze-600/15 transition-all">
                      <Icon size={18} className="text-bronze-500 dark:text-bronze-400" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-heading mb-0.5">{service.title}</h4>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed">{service.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-semibold shadow-xl shadow-bronze-500/15 hover:shadow-bronze-500/30 transition-all duration-300 text-sm"
              >
                <MessageSquare size={16} />
                Request Bulk Quote
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right — Visual Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 gradient-border space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bronze-500/20 to-bronze-600/10 flex items-center justify-center mx-auto">
                  <Truck size={28} className="text-bronze-500 dark:text-bronze-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-heading">Why Export With Us?</h3>
                <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto">Trusted by buyers in 20+ countries for quality and reliability.</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { value: "20+", label: "Countries Served", emoji: "🌍" },
                  { value: "500+", label: "Orders Delivered", emoji: "📦" },
                  { value: "48hr", label: "Quote Response", emoji: "⚡" },
                  { value: "100%", label: "Quality Checked", emoji: "✅" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 sm:p-4 rounded-xl bg-surface-card/50 border border-bronze-500/10">
                    <span className="text-xl sm:text-2xl mb-1 block">{stat.emoji}</span>
                    <p className="text-xl sm:text-2xl font-display font-bold gradient-text">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs text-muted font-medium mt-1">{stat.label}</p>
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
                    className="object-contain p-0 group-hover/cert:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-white text-[10px] font-bold bg-bronze-600/90 px-3 py-1.5 rounded-full shadow-md">View Document</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
