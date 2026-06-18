"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";

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
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((i) => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((i) => (i === 0 ? banners.length - 1 : i - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % banners.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const currentBanner = banners[activeIndex];

  return (
    <div className="relative w-full py-4">
      <div
        className="relative rounded-[20px] border border-border-color bg-bg-secondary overflow-hidden group min-h-[360px] md:min-h-[280px] lg:min-h-[320px] flex flex-col md:grid md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.2fr_0.8fr]"
      >
        {/* Content Panel */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-bg-secondary relative z-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentBanner.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-dim text-accent text-[10px] font-bold uppercase tracking-wider">
                <Tag className="w-3 h-3" />
                Promo Spesial
              </div>

              <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-text-primary leading-[1.15] tracking-tight line-clamp-2">
                {currentBanner.title}
              </h3>

              {currentBanner.subtitle && (
                <p className="text-sm text-text-secondary leading-relaxed max-w-sm line-clamp-3">
                  {currentBanner.subtitle}
                </p>
              )}

              {currentBanner.linkUrl && (
                <div className="pt-2">
                  <Link
                    href={currentBanner.linkUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-accent hover:bg-accent-hover text-bg-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Klaim Promo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image Panel */}
        <div className="relative h-48 md:h-full overflow-hidden bg-bg-tertiary">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentBanner.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bg-secondary via-transparent to-transparent opacity-60 md:opacity-100 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg-secondary border border-border-color text-text-primary hover:border-accent hover:text-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="absolute left-14 md:left-auto md:right-4 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg-secondary border border-border-color text-text-primary hover:border-accent hover:text-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Stepper dots */}
            <div className="absolute right-6 bottom-6 z-20 hidden md:flex gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1);
                    setActiveIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? "w-6 bg-accent"
                      : "w-1.5 bg-border-strong hover:bg-text-muted"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
