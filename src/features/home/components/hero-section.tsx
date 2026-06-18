"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface GameSearchItem {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface HeroSectionProps {
  games: GameSearchItem[];
}

const MOCK_TRANSACTIONS = [
  { id: 1, user: "Gamer 8127****", game: "Mobile Legends", item: "257 Diamonds", time: "Baru saja" },
  { id: 2, user: "Gamer 3041****", game: "Valorant", item: "300 VP", time: "2 detik lalu" },
  { id: 3, user: "Gamer 9274****", game: "Genshin Impact", item: "500 Genesis Crystals", time: "5 detik lalu" },
  { id: 4, user: "Gamer 4810****", game: "Free Fire", item: "140 Diamonds", time: "8 detik lalu" },
];

export function HeroSection({ games }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [txIndex, setTxIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTxIndex((prev) => (prev + 1) % MOCK_TRANSACTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (slug: string) => {
    router.push(`/games/${slug}`);
    setIsFocused(false);
    setSearchQuery("");
  };

  return (
    <section className="w-full relative overflow-hidden bg-bg-primary">
      {/* Subtle geometric background accent */}
      <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-accent/[0.03] rounded-bl-[100px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

          {/* Left: Text content & Search */}
          <div className="space-y-6 lg:max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] text-text-primary tracking-tight leading-[1.1] font-bold">
              Top Up Game
              <br />
              <span className="text-accent">Instan</span> &amp; Hemat
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg">
              Platform top up otomatis 24/7. Diamond, UC, VP, dan Crystals game favoritmu dengan harga terbaik.
            </p>

            {/* Search Widget */}
            <div ref={containerRef} className="relative w-full max-w-lg">
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 bg-bg-secondary shadow-sm ${
                  isFocused
                    ? "border-accent ring-2 ring-accent/10 shadow-md"
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
                    className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-color rounded-xl shadow-lg overflow-hidden z-30"
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

            {/* Trust signals - clean, no decorative dots */}
            <div className="flex items-center gap-5 text-xs text-text-muted pt-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span>Proses 10 detik</span>
              </div>
              <div className="w-px h-3 bg-border-color" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Mitra resmi game</span>
              </div>
            </div>
          </div>

          {/* Right: Hero Visual + Live Activity */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Hero artwork frame */}
            <div className="relative rounded-[28px] overflow-hidden border border-border-color bg-bg-secondary p-1.5 shadow-lg">
              <img
                src="/games/valorant.jpg"
                alt="TopUpKu Gaming Banner"
                className="w-full h-auto aspect-square object-cover rounded-[22px] bg-bg-tertiary"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-[22px] m-1.5" />
            </div>

            {/* Floating Live Transaction Widget */}
            <div className="absolute -bottom-5 -left-3 sm:-left-5 w-[250px] sm:w-[270px] bg-bg-secondary border border-border-color rounded-2xl p-4 shadow-xl z-20">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border-subtle">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  Transaksi Aktif
                </span>
              </div>

              <div className="h-10 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={MOCK_TRANSACTIONS[txIndex].id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-bold text-text-primary">
                        {MOCK_TRANSACTIONS[txIndex].user}
                      </span>
                      <span className="text-[9px] text-accent font-semibold">
                        {MOCK_TRANSACTIONS[txIndex].game}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mt-0.5">
                      <span className="text-[10px] text-text-secondary truncate max-w-[150px]">
                        Beli {MOCK_TRANSACTIONS[txIndex].item}
                      </span>
                      <span className="text-[9px] text-text-muted">
                        {MOCK_TRANSACTIONS[txIndex].time}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Floating Guarantee Badge */}
            <div className="absolute -top-3 -right-3 bg-bg-secondary border border-border-color rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20">
              <div className="w-7 h-7 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-text-primary leading-none">Garansi Legal</p>
                <p className="text-[9px] text-text-muted mt-0.5 leading-none">Mitra Resmi Game</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
