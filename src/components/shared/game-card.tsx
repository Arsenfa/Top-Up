import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Star } from "lucide-react";

/* ── Game-specific image map keyed by slug ── */
const GAME_IMAGES: Record<string, string> = {
  "mobile-legends": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
  "free-fire": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
  "genshin-impact": "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
  "pubg-mobile": "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?q=80&w=600&auto=format&fit=crop",
  "valorant": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
  "honkai-star-rail": "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop",
  "call-of-duty-mobile": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
  "arena-of-valor": "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop",
};

/* ── Category styling ── */
const CATEGORY_CHIP: Record<string, string> = {
  MOBA: "chip-moba",
  FPS: "chip-fps",
  RPG: "chip-rpg",
  SPORTS: "chip-sports",
};

/* ── Popular game slugs ── */
const POPULAR_SLUGS = new Set(["mobile-legends", "free-fire", "genshin-impact", "valorant", "pubg-mobile"]);

interface GameCardProps {
  game: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    publisher: string;
    category: string;
    isPopular?: boolean;
  };
  startPrice?: number;
}

function formatPrice(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

export function GameCard({ game, startPrice }: GameCardProps) {
  const image = GAME_IMAGES[game.slug] ?? game.imageUrl;
  const categoryChip = CATEGORY_CHIP[game.category] ?? "chip-other";
  const isPopular = game.isPopular ?? POPULAR_SLUGS.has(game.slug);

  return (
    <Link href={`/games/${game.slug}`} className="group block focus-visible:outline-none">
      <div className="relative rounded-2xl overflow-hidden border border-border-color bg-bg-secondary card-hover flex flex-col h-full focus-within:border-accent/40">

        {/* ── Image ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary">
          <img
            src={image}
            alt={game.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category chip */}
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${categoryChip}`}>
            {game.category}
          </span>

          {/* Popular badge */}
          {isPopular && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber/15 border border-amber/30 text-[10px] font-bold uppercase tracking-wider text-amber">
              <Star className="w-2.5 h-2.5 fill-amber" />
              Hot
            </span>
          )}
        </div>

        {/* ── Details ── */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">
              {game.publisher}
            </p>
            <h3 className="font-display font-bold text-sm text-text-primary group-hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug">
              {game.name}
            </h3>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
            <div>
              <p className="text-[10px] text-text-muted">Mulai dari</p>
              <p className="text-xs font-bold text-text-primary">
                {startPrice ? formatPrice(startPrice) : "Rp 1.000"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-accent group-hover:gap-1.5 transition-all duration-200">
              <Zap className="w-3 h-3" />
              <span>Top Up</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
            </div>
          </div>
        </div>

        {/* Accent hover border glow */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-accent/20 transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
