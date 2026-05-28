"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play, Pause, VolumeX, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";

const videos = [
  {
    id: 1,
    title: "Heritage Kadai Crafting",
    tag: "Cookware Crafting",
    url: "https://assets.mixkit.co/videos/preview/mixkit-blacksmith-hammering-glowing-metal-on-an-anvil-41866-large.mp4",
    product: "Bronze Kadai",
  },
  {
    id: 2,
    title: "Pouring Molten Bronze",
    tag: "Furnace Casting",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hot-liquid-metal-being-poured-into-a-mold-41873-large.mp4",
    product: "Molten Castings",
  },
  {
    id: 3,
    title: "Traditional Urli Casting",
    tag: "Bell Metal Casting",
    url: "https://assets.mixkit.co/videos/preview/mixkit-melting-metal-in-a-furnace-41874-large.mp4",
    product: "Bronze Urli",
  },
  {
    id: 4,
    title: "Engraving Floral Ridges",
    tag: "Artisanal Details",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hands-carving-wood-with-a-chisel-41861-large.mp4",
    product: "Engraved Lota",
  },
  {
    id: 5,
    title: "Sacred Pooja Rituals",
    tag: "Sacred Flames",
    url: "https://assets.mixkit.co/videos/preview/mixkit-fire-burning-slowly-in-a-dark-room-41875-large.mp4",
    product: "Bronze Diya",
  },
  {
    id: 6,
    title: "Serving Tea in Bronze",
    tag: "Royal Dining",
    url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-tea-into-a-cup-43187-large.mp4",
    product: "Tea Cup Set",
  },
  {
    id: 7,
    title: "Wellness Water Pitcher",
    tag: "Drinkware Health",
    url: "https://assets.mixkit.co/videos/preview/mixkit-pouring-water-into-a-glass-from-a-pitcher-43185-large.mp4",
    product: "Bronze Lota",
  },
  {
    id: 8,
    title: "Stirring Organic Curry",
    tag: "Kitchenware Testing",
    url: "https://assets.mixkit.co/videos/preview/mixkit-stirring-food-in-a-pan-43188-large.mp4",
    product: "Cooking Handi",
  },
  {
    id: 9,
    title: "Boiling Milk in Patila",
    tag: "Heat Retention",
    url: "https://assets.mixkit.co/videos/preview/mixkit-water-boiling-in-a-transparent-pot-41551-large.mp4",
    product: "Bronze Patila",
  },
  {
    id: 10,
    title: "Sparks of Craftsmanship",
    tag: "Polishing Metal",
    url: "https://assets.mixkit.co/videos/preview/mixkit-sparks-and-molten-metal-in-a-forge-41871-large.mp4",
    product: "Finishing Quality",
  }
];

export const ShopByVideos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const isScrollingRef = useRef(false);
  const dragThreshold = 8;
  const startX = useRef(0);
  const startY = useRef(0);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startX.current = clientX;
    startY.current = clientY;
    isScrollingRef.current = false;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaX = Math.abs(clientX - startX.current);
    const deltaY = Math.abs(clientY - startY.current);
    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      isScrollingRef.current = true;
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isScrollingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // Force loop at maximum 20 seconds
    const video = e.currentTarget;
    if (video.currentTime >= 20) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  return (
    <section className="py-10 md:py-12 relative overflow-hidden section-glass-ambient ambient-gold border-b border-bronze-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-6">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-orange-700 dark:text-bronze-300 tracking-wider uppercase mb-4"
            >
              <Sparkles size={14} className="text-bronze-500" />
              Watch & Shop
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-heading">
              Shop by <span className="gradient-text">Videos</span>
            </h2>
          </div>

          {/* Navigation controls (Arrows) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-bronze-500/20 bg-surface-card hover:bg-surface-hover text-heading shadow-md hover:shadow-lg transition-all active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-bronze-500/20 bg-surface-card hover:bg-surface-hover text-heading shadow-md hover:shadow-lg transition-all active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Video Slider Wrapper with Floating Side Arrows */}
        <div className="relative">
          {/* Left Side Floating Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-card/90 dark:bg-surface-card/85 hover:bg-surface-hover text-heading shadow-xl border border-bronze-500/30 hover:scale-105 active:scale-95 hidden md:flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          <div
            ref={scrollRef}
            onTouchStart={handleDragStart}
            onMouseDown={handleDragStart}
            onTouchMove={handleDragMove}
            onMouseMove={handleDragMove}
            className="flex overflow-x-auto gap-6 pb-8 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="snap-start snap-always shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-18px)] flex flex-col justify-between bg-surface-card border border-bronze-500/[0.14] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-bronze-500/8 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Video Player Container */}
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-black group">
                  <video
                    src={`${video.url}#t=0,20`}
                    muted
                    playsInline
                    autoPlay
                    loop
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Visual Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35 opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Floating Tags */}
                  <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-bronze-500 to-orange-600 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg">
                    {video.tag}
                  </div>

                  <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90">
                    <VolumeX size={14} />
                  </div>

                  {/* Bottom Video Info & Shop Button */}
                  <div className="absolute bottom-0 inset-x-0 p-5 z-20 text-white space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-display leading-tight drop-shadow-sm text-white">
                        {video.title}
                      </h3>
                      <p className="text-xs text-orange-200/90 font-medium mt-1">
                        Featured: {video.product}
                      </p>
                    </div>

                    <Link
                      href="/contact"
                      onClickCapture={handleLinkClick}
                      className="group/btn inline-flex items-center justify-center gap-1.5 px-4 py-2.5 w-full rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 hover:from-bronze-400 hover:to-bronze-500 text-white font-semibold shadow-md transition-all duration-300 text-xs"
                    >
                      Inquire Product
                      <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side Floating Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-card/90 dark:bg-surface-card/85 hover:bg-surface-hover text-heading shadow-xl border border-bronze-500/30 hover:scale-105 active:scale-95 hidden md:flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

      </div>
    </section>
  );
};
