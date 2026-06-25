"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (nextIndex: number, dir: "left" | "right") => {
      if (isTransitioning) return;
      setDirection(dir);
      setIsTransitioning(true);
      // ponytail: short delay for exit animation, then swap
      setTimeout(() => {
        setActiveIndex(nextIndex);
        setIsTransitioning(false);
      }, 200);
    },
    [isTransitioning]
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % banners.length;
      goTo(next, "right");
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length, activeIndex, goTo]);

  if (banners.length === 0) return null;

  const handlePrev = () => {
    const next = activeIndex === 0 ? banners.length - 1 : activeIndex - 1;
    goTo(next, "left");
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % banners.length;
    goTo(next, "right");
  };

  const currentBanner = banners[activeIndex];

  const slideClass = isTransitioning
    ? direction === "right"
      ? "opacity-0 -translate-x-4"
      : "opacity-0 translate-x-4"
    : "opacity-100 translate-x-0";

  return (
    <div className="relative w-full py-4">
      <div
        className="relative rounded-[20px] border border-border-color bg-bg-secondary overflow-hidden group min-h-[360px] md:min-h-[280px] lg:min-h-[320px] flex flex-col md:grid md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.2fr_0.8fr]"
      >
        {/* Content Panel */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-bg-secondary relative z-10">
          <div className={`space-y-4 transition-all duration-200 ease-in-out ${slideClass}`}>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-text-primary leading-[1.15] tracking-tight line-clamp-2">
              {currentBanner.title}
            </h2>

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
          </div>
        </div>

        {/* Image Panel */}
        <div className="relative h-48 md:h-full overflow-hidden bg-bg-tertiary">
          <div className={`absolute inset-0 transition-all duration-200 ease-in-out ${slideClass}`}>
            <Image
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bg-secondary via-transparent to-transparent opacity-60 md:opacity-100 pointer-events-none" />
          </div>
        </div>

        {/* Carousel Navigation */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Promo sebelumnya"
              className="absolute left-4 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg-secondary border border-border-color text-text-primary hover:border-accent hover:text-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Promo berikutnya"
              className="absolute left-14 md:left-auto md:right-4 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-20 w-8 h-8 rounded-full bg-bg-secondary border border-border-color text-text-primary hover:border-accent hover:text-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Stepper dots */}
            <div className="absolute right-6 bottom-6 z-20 hidden md:flex gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ke promo ${i + 1}`}
                  onClick={() => {
                    goTo(i, i > activeIndex ? "right" : "left");
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
