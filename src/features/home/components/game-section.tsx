"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameCard } from "@/components/shared/game-card";
import { LayoutGrid, Sword, Target, Sparkles } from "lucide-react";

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
  { id: "ALL", label: "Semua Game", icon: LayoutGrid },
  { id: "MOBA", label: "MOBA", icon: Sword },
  { id: "FPS", label: "FPS / Shooter", icon: Target },
  { id: "RPG", label: "RPG / Fantasy", icon: Sparkles },
];

export function GameSection({ games }: GameSectionProps) {
  const [selected, setSelected] = useState("ALL");
  const filtered = selected === "ALL" ? games : games.filter((g) => g.category === selected);

  return (
    <section id="games" className="w-full py-12 sm:py-20 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header — Left-aligned editorial title without duplicate eyebrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b border-border-color">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
              Pilih Game &amp; Top Up
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Menampilkan {filtered.length} game yang siap diisi instan 24/7
            </p>
          </div>

          {/* Filter tabs — Premium sliding indicator layout */}
          <div className="flex items-center gap-1 p-1 bg-bg-tertiary/60 border border-border-subtle rounded-xl flex-shrink-0 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selected === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {/* Sliding background indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 bg-accent rounded-lg shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Games Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              {filtered.map((game) => (
                <motion.div
                  layout
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameCard game={game} startPrice={game.minPrice} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 rounded-3xl border border-border-color bg-bg-secondary shadow-sm"
            >
              <LayoutGrid className="w-12 h-12 text-text-muted mb-4 stroke-[1.5]" />
              <p className="text-sm font-semibold text-text-muted">Tidak ada game di kategori ini.</p>
              <button 
                onClick={() => setSelected("ALL")}
                className="mt-4 px-4 py-2 bg-accent/5 hover:bg-accent/10 text-accent rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Tampilkan Semua Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
