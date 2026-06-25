"use client";

import React, { useState } from "react";
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
  { id: "ALL", label: "Semua", icon: LayoutGrid },
  { id: "MOBA", label: "MOBA", icon: Sword },
  { id: "FPS", label: "FPS", icon: Target },
  { id: "RPG", label: "RPG", icon: Sparkles },
];

export function GameSection({ games }: GameSectionProps) {
  const [selected, setSelected] = useState("ALL");
  const filtered = selected === "ALL" ? games : games.filter((g) => g.category === selected);

  return (
    <section id="games" className="w-full pt-16 sm:pt-24 pb-12 sm:pb-20 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-4 border-b border-border-color">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
              Pilih Game &amp; Top Up
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {filtered.length} game tersedia, proses instan 24/7
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-bg-secondary border border-border-color rounded-xl flex-shrink-0 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selected === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "text-bg-primary bg-accent"
                      : "text-text-secondary bg-bg-elevated hover:text-text-primary hover:bg-bg-elevated/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((game, i) => (
              <div
                key={game.id}
                className={`transition-opacity duration-200 ${
                  selected === "ALL" && i < 2 ? "lg:col-span-2" : ""
                }`}
              >
                <GameCard game={game} startPrice={game.minPrice} featured={selected === "ALL" && i < 2} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-border-color bg-bg-secondary">
            <LayoutGrid className="w-12 h-12 text-text-muted mb-4 stroke-[1.5]" />
            <p className="text-sm font-semibold text-text-muted">Tidak ada game di kategori ini.</p>
            <button
              onClick={() => setSelected("ALL")}
              className="mt-4 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tampilkan Semua
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
