"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    id: "kitchen-heritage",
    name: "Kitchen Heritage",
    tagline: "Traditional cooking vessels passed down through generations",
    image: "/bronze-kadai.png",
    productCount: "32 Products",
    gradient: "from-amber-900/70 to-orange-950/80",
  },
  {
    id: "modern-indian-living",
    name: "Modern Indian Living",
    tagline: "Contemporary home essentials with an Indian soul",
    image: "/bronze-hero.png",
    productCount: "28 Products",
    gradient: "from-stone-900/70 to-zinc-950/80",
  },
  {
    id: "brass-dining",
    name: "Brass Dining",
    tagline: "Royal dining sets for celebratory meals and everyday elegance",
    image: "/collection-tableware.png",
    productCount: "24 Products",
    gradient: "from-yellow-900/70 to-amber-950/80",
  },
  {
    id: "copper-wellness",
    name: "Copper Wellness",
    tagline: "Ayurvedic copper drinkware for natural health benefits",
    image: "/bronze-lota.png",
    productCount: "18 Products",
    gradient: "from-orange-900/70 to-red-950/80",
  },
  {
    id: "bedroom-essentials",
    name: "Bedroom Essentials",
    tagline: "Handcrafted décor and utility for your personal space",
    image: "/bronze-hero.png",
    productCount: "14 Products",
    gradient: "from-indigo-900/70 to-slate-950/80",
  },
];

export const FeaturedCollections = () => {
  return (
    <section className="py-6 md:py-8 relative overflow-hidden bg-surface">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-bronze-500/[0.04] rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-bronze-500" />
            Curated For You
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-heading mb-3">
            Featured <span className="gradient-text">Collections</span>
          </h2>
        </div>

        {/* Cinematic Collection Grid: 3 top + 2 bottom (centered) */}
        <div className="space-y-4 sm:space-y-5">
          {/* Top row — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {collections.slice(0, 3).map((col, index) => (
              <CollectionCard key={col.id} collection={col} index={index} />
            ))}
          </div>

          {/* Bottom row — 2 cards (centered, wider) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {collections.slice(3, 5).map((col, index) => (
              <CollectionCard key={col.id} collection={col} index={index + 3} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

interface CollectionCardProps {
  collection: typeof collections[0];
  index: number;
}

const CollectionCard = ({ collection, index }: CollectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={`/collection/${collection.id}`}
        className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] shadow-lg hover:shadow-2xl hover:shadow-bronze-500/[0.08] transition-all duration-300"
      >
        {/* Background Image */}
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-8">
          <span className="text-[10px] sm:text-xs text-white/60 font-medium mb-1">
            {collection.productCount}
          </span>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-white mb-1 leading-tight">
            {collection.name}
          </h3>
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-3 max-w-xs line-clamp-2">
            {collection.tagline}
          </p>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white font-semibold group-hover:gap-2.5 transition-all">
            <span>Explore Collection</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
