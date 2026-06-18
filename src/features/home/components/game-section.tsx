"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GameCard } from "@/components/shared/game-card";
import { LayoutGrid, Sword, Target, ShieldAlert, Sparkles } from "lucide-react";

interface GameItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  publisher: string;
  category: string;
  isPopular?: boolean;
  minPrice?: number;
}

interface GameSectionProps {
  games: GameItem[];
}

const categories = [
  { id: "ALL", label: "Semua Game", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { id: "MOBA", label: "MOBA", icon: <Sword className="w-3.5 h-3.5" /> },
  { id: "FPS", label: "FPS / Shooter", icon: <Target className="w-3.5 h-3.5" /> },
  { id: "RPG", label: "RPG / Fantasy", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function GameSection({ games }: GameSectionProps) {
  const [selected, setSelected] = useState("ALL");

  const filtered = selected === "ALL" ? games : games.filter((g) => g.category === selected);

  return (
    <section id="games" className="w-full py-20 lg:py-28 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label mb-3 inline-flex">
              <Sparkles className="w-3 h-3" />
              Semua Game
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight">
              Daftar <span className="gradient-text">Game Populer</span>
            </h2>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex gap-1.5 p-1 bg-bg-secondary border border-border-color rounded-xl flex-shrink-0 flex-wrap"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selected === cat.id
                    ? "bg-accent text-white shadow-[0_2px_8px_rgba(224,92,61,0.22)]"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Games Grid */}
        {filtered.length > 0 ? (
          <motion.div
            key={selected}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {filtered.map((game) => (
              <motion.div key={game.id} variants={item}>
                <GameCard
                  game={game}
                  startPrice={game.minPrice}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border-color bg-bg-secondary">
            <LayoutGrid className="w-10 h-10 text-text-muted mb-3" />
            <p className="text-sm text-text-muted">Tidak ada game di kategori ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}
