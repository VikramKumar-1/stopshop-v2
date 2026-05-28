"use client";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const HeritageStory = () => {
  return (
    <section className="py-8 md:py-10 relative overflow-hidden bg-[#1A0F05] border-y border-orange-900/30">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-800/[0.12] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-700/[0.08] rounded-full blur-[200px]" />
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='12' fill='none' stroke='%23fb923c' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='24' fill='none' stroke='%23fb923c' stroke-width='0.3' stroke-dasharray='2,3'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
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
              {/* Warm overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/40 via-transparent to-amber-900/20" />
            </div>

            {/* Floating stat badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-[#2D1A08] border border-orange-800/40 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-2xl z-20"
            >
              <p className="text-2xl sm:text-3xl font-display font-bold text-amber-400">200+</p>
              <p className="text-[10px] sm:text-xs text-orange-300/80 font-medium">Artisan Partners</p>
            </motion.div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
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
              href="/about"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-xl shadow-orange-900/30 hover:shadow-orange-800/40 transition-all duration-300 text-sm"
            >
              Meet Our Makers
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
