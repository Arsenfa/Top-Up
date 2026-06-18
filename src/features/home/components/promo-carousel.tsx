"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

interface PromoCarouselProps {
  banners: BannerItem[];
}

export function PromoCarousel({ banners }: PromoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const handlePrev = () => setActiveIndex((i) => (i === 0 ? banners.length - 1 : i - 1));
  const handleNext = () => setActiveIndex((i) => (i + 1) % banners.length);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border-color group shadow-2xl mb-6" style={{ aspectRatio: "21 / 7" }}>
      {/* Slides */}
      <AnimatePresence initial={false}>
        {banners.map((banner, index) =>
          index === activeIndex ? (
            <motion.div
              key={banner.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center px-8 sm:px-14 lg:px-20 max-w-2xl">
                <div className="flex flex-col gap-3">
                  <span className="section-label w-fit">Promo Spesial</span>
                  <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white leading-tight">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm text-white/70 max-w-xs leading-relaxed line-clamp-2">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.linkUrl && (
                    <Link
                      href={banner.linkUrl}
                      className="inline-flex items-center gap-1.5 w-fit mt-1 px-5 py-2.5 rounded-xl text-sm font-bold bg-accent hover:bg-accent-hover text-white transition-all duration-200 shadow-[0_4px_14px_rgba(224,92,61,0.22)]"
                    >
                      Klaim Promo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Nav arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 border border-white/10 hover:bg-accent/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 border border-white/10 hover:bg-accent/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
