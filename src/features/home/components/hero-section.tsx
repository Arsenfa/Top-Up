"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, ShieldCheck, Zap, Clock } from "lucide-react";

interface GameSearchItem {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface HeroSectionProps {
  games: GameSearchItem[];
}

export function HeroSection({ games }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive suggestions during render - no useEffect needed
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return games
      .filter((g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery, games]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (slug: string) => {
    router.push(`/games/${slug}`);
    setIsFocused(false);
    setSearchQuery("");
  };

  return (
    <section className="w-full bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

          {/* Left: Text content & Search */}
          <div className="space-y-6 lg:max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] text-text-primary tracking-tighter leading-[1.2] font-black">
                Top Up Game Favorit
                <br />
                <span className="text-accent">Langsung Masuk</span>
              </h1>
            </motion.div>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-md">
              Diamond ML, UC PUBG, VP Valorant. Bayar, tunggu sebentar, selesai. Tanpa login akun, tanpa ribet.
            </p>

            {/* Search Widget */}
            <div ref={containerRef} className="relative w-full max-w-lg">
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 bg-bg-secondary ${
                  isFocused
                    ? "border-accent ring-2 ring-accent/10"
                    : "border-border-color"
                }`}
              >
                <Search className="w-5 h-5 text-text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Cari game favoritmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isFocused && (searchQuery || suggestions.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-color rounded-xl overflow-hidden z-30 shadow-elevated"
                  >
                    {suggestions.length > 0 ? (
                      <div className="py-1">
                        {suggestions.map((game) => (
                          <button
                            key={game.id}
                            onClick={() => handleSelect(game.slug)}
                            className="w-full px-4 py-3 text-left hover:bg-bg-tertiary flex items-center justify-between transition-colors group text-sm cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                                {game.name}
                              </span>
                              <span className="text-xs text-text-muted bg-bg-tertiary px-2 py-0.5 rounded-md">
                                {game.category}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                          </button>
                        ))}
                      </div>
                    ) : searchQuery ? (
                      <div className="px-4 py-6 text-center text-sm text-text-muted">
                        Tidak ada game &ldquo;{searchQuery}&rdquo; ditemukan.
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust signals: static, no mock data */}
            <div className="flex items-center gap-5 text-xs text-text-muted pt-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span>Proses ±10 detik</span>
              </div>
              <div className="w-px h-3 bg-border-color" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Tanpa password akun</span>
              </div>
              <div className="w-px h-3 bg-border-color hidden sm:block" />
              <div className="items-center gap-1.5 hidden sm:flex">
                <Clock className="w-3.5 h-3.5 text-info" />
                <span>Tersedia 24/7</span>
              </div>
            </div>
          </div>

          {/* Right: Hero Visual, clean, no badges */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="relative rounded-[28px] overflow-hidden border border-border-color bg-bg-secondary p-1.5 shadow-elevated">
              <div className="relative aspect-square rounded-[22px] overflow-hidden bg-bg-tertiary">
                <Image
                  src="/games/valorant.jpg"
                  alt="TopUpKu Gaming Banner"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 450px"
                  className="object-cover rounded-[22px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-[22px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
