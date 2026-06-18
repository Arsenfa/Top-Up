"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, Gamepad2, X, Zap, ShieldCheck, Clock,
  TrendingUp, ArrowRight, CheckCircle2, Users,
} from "lucide-react";

interface GameSearchItem {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface HeroSectionProps {
  games: GameSearchItem[];
}

/* ─── Static data for the right panel ─── */
const FEATURED_GAMES = [
  {
    name: "Mobile Legends",
    currency: "Diamond",
    startFrom: "Rp 1.579",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    category: "MOBA",
    color: "#6366f1",
  },
  {
    name: "Free Fire",
    currency: "Diamond",
    startFrom: "Rp 1.000",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
    category: "FPS",
    color: "#ef4444",
  },
  {
    name: "Genshin Impact",
    currency: "Genesis Crystals",
    startFrom: "Rp 16.000",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    category: "RPG",
    color: "#f59e0b",
  },
];

const RECENT_TRANSACTIONS = [
  { user: "Budi S.", game: "Mobile Legends", amount: "86 Diamond", time: "2s ago" },
  { user: "Rina A.", game: "Free Fire", amount: "70 Diamond", time: "15s ago" },
  { user: "Dimas R.", game: "Genshin Impact", amount: "980 Crystals", time: "32s ago" },
  { user: "Sari N.", game: "PUBG Mobile", amount: "325 UC", time: "1m ago" },
  { user: "Arya W.", game: "Valorant", amount: "700 VP", time: "2m ago" },
];

const TRUST_BADGES = [
  { icon: <Clock className="w-4 h-4" />, label: "24/7 Service" },
  { icon: <Zap className="w-4 h-4" />, label: "Instant Delivery" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure Payment" },
  { icon: <Users className="w-4 h-4" />, label: "100K+ Transaksi" },
];

const HERO_STATS = [
  { value: "100K+", label: "Transaksi" },
  { value: "50+", label: "Game" },
  { value: "4.9★", label: "Rating" },
  { value: "99.9%", label: "Sukses" },
];

/* ─── Category chip helper ─── */
const categoryClass = (cat: string): string => {
  const map: Record<string, string> = {
    MOBA: "chip-moba",
    FPS: "chip-fps",
    RPG: "chip-rpg",
    SPORTS: "chip-sports",
  };
  return map[cat] ?? "chip-other";
};

/* ─── Animated transaction ticker ─── */
function TransactionTicker() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % RECENT_TRANSACTIONS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const tx = RECENT_TRANSACTIONS[idx];

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-bg-overlay border border-border-color">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-1.5 text-xs"
      >
        <span className="font-semibold text-text-primary">{tx.user}</span>
        <span className="text-text-muted">beli</span>
        <span className="text-accent font-semibold">{tx.amount}</span>
        <span className="text-text-muted">· {tx.game}</span>
        <span className="ml-auto pl-2 text-text-muted text-[10px] shrink-0">{tx.time}</span>
      </motion.div>
    </div>
  );
}

/* ─── Stacked game card for right panel ─── */
function FeaturedGameStack() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % FEATURED_GAMES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full">
      {/* Main card */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-border-color shadow-2xl">
        {FEATURED_GAMES.map((game, i) => (
          <motion.div
            key={game.name}
            className="absolute inset-0"
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2 ${categoryClass(game.category)}`}>
                {game.category}
              </span>
              <div className="font-display font-bold text-lg text-white leading-tight">{game.name}</div>
              <div className="text-xs text-white/70 mt-0.5">Mulai dari <span className="text-white font-semibold">{game.startFrom}</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex gap-1.5 justify-center mt-3">
        {FEATURED_GAMES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-accent" : "w-1.5 bg-border-strong"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Hero ─── */
export function HeroSection({ games }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GameSearchItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!searchQuery.trim()) { setSuggestions([]); return; }
    const q = searchQuery.toLowerCase();
    setSuggestions(
      games.filter((g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)).slice(0, 6)
    );
  }, [searchQuery, games]);

  const handleSelect = (slug: string) => {
    router.push(`/games/${slug}`);
    setIsFocused(false);
    setSearchQuery("");
  };

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-bg-primary" />
      {/* Minimal background — no glow blobs. Clean is better. */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Single, very subtle warm haze — not a gimmick, just depth */}
        <div className="absolute top-[-15%] right-[5%] w-[520px] h-[520px] rounded-full blur-[160px]"
          style={{ background: "rgba(224,92,61,0.04)" }} />
        {/* Dot grid — fine and neutral */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">

          {/* ════ LEFT COLUMN ════ */}
          <div className="flex flex-col">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-label mb-6 inline-flex">
                <TrendingUp className="w-3 h-3" />
                Platform Top Up #1 di Indonesia
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-5xl xl:text-6xl text-text-primary tracking-tight leading-[1.1] mb-5"
            >
              Top Up Game{" "}
              <span className="gradient-text">Instan</span>,{" "}
              <br className="hidden sm:block" />
              Hemat &amp; Aman
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg mb-8"
            >
              Beli Diamond, UC, Genesis Crystals &amp; VP game favoritmu dengan harga terbaik.
              Pembayaran fleksibel — QRIS, e-wallet &amp; transfer bank.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              ref={containerRef}
              className="relative w-full max-w-lg mb-8"
            >
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 bg-bg-secondary shadow-xl ${
                  isFocused
                    ? "border-accent shadow-[0_0_0_4px_rgba(224,92,61,0.12)]"
                    : "border-border-color"
                }`}
              >
                <Search className="w-5 h-5 text-text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Cari game (Mobile Legends, Free Fire…)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-text-muted hover:text-text-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 bg-bg-tertiary border border-border-color rounded-lg text-[10px] font-mono text-text-muted shrink-0">
                  ⌘K
                </kbd>
              </div>

              {/* Suggestions Dropdown */}
              {isFocused && (searchQuery || suggestions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-color rounded-2xl shadow-2xl overflow-hidden z-30"
                >
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-subtle">
                        Hasil Pencarian
                      </div>
                      {suggestions.map((game) => (
                        <button
                          key={game.id}
                          onClick={() => handleSelect(game.slug)}
                          className="w-full px-4 py-3 text-left hover:bg-bg-tertiary flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                              <Gamepad2 className="w-3.5 h-3.5 text-accent" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                                {game.name}
                              </div>
                              <div className="text-[10px] text-text-muted">{game.category}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="px-4 py-8 text-center text-sm text-text-muted">
                      Tidak ada game "{searchQuery}" ditemukan.
                    </div>
                  ) : null}
                </motion.div>
              )}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-secondary border border-border-color text-xs font-semibold text-text-secondary"
                >
                  <span className="text-accent">{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </motion.div>

            {/* Stats Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="grid grid-cols-4 gap-4 max-w-lg"
            >
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-black text-xl sm:text-2xl text-text-primary">{stat.value}</div>
                  <div className="text-[11px] text-text-muted font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {/* Featured game stack */}
            <FeaturedGameStack />

            {/* Live transaction ticker */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-success" />
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Live Transaksi</span>
              </div>
              <TransactionTicker />
            </div>

            {/* Quick shortcuts */}
            <div className="grid grid-cols-3 gap-2">
              {["Mobile Legends", "Free Fire", "Genshin Impact"].map((name, i) => {
                const slugs = ["mobile-legends", "free-fire", "genshin-impact"];
                return (
                  <Link
                    key={name}
                    href={`/games/${slugs[i]}`}
                    className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-bg-secondary border border-border-color hover:border-accent/30 hover:bg-bg-tertiary transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Gamepad2 className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-[10px] font-semibold text-text-muted text-center leading-tight group-hover:text-text-primary transition-colors">
                      {name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <Link
              href="/#games"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-accent hover:bg-accent-hover text-white transition-all duration-200 shadow-[0_4px_20px_rgba(224,92,61,0.22)] hover:shadow-[0_4px_28px_rgba(224,92,61,0.35)]"
            >
              <Zap className="w-4 h-4" />
              Lihat Semua Game
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Guarantee note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              Pengiriman otomatis &lt; 5 detik setelah pembayaran
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
