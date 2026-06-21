import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

function formatPrice(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

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

export function GameCard({ game, startPrice }: GameCardProps) {
  const isPopular = game.isPopular ?? POPULAR_SLUGS.has(game.slug);

  return (
    <Link href={`/games/${game.slug}`} className="group block relative">
      <div
        className="rounded-[16px] overflow-hidden border border-border-color bg-bg-secondary flex flex-col h-full hover:border-accent/30 transition-all duration-300 group-hover:-translate-y-0.5"
      >
        {/* Visual */}
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary">
          <img
            src={game.imageUrl}
            alt={game.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 pointer-events-none" />

          {isPopular && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-bg-primary text-[10px] font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              Populer
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-[10px] font-semibold text-text-muted leading-none">
            {game.publisher}
          </span>

          <h3 className="font-display font-bold text-sm sm:text-base text-text-primary group-hover:text-accent transition-colors line-clamp-1 mt-1.5 leading-snug">
            {game.name}
          </h3>

          <div className="mt-auto pt-3 border-t border-border-subtle flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold text-text-muted leading-none">Mulai dari</p>
              <p className="text-xs font-extrabold text-text-primary">
                {startPrice ? formatPrice(startPrice) : "Rp 1.000"}
              </p>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform duration-200">
              Top Up
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
