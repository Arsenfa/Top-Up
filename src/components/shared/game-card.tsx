import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

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
  featured?: boolean;
}

export function GameCard({ game, startPrice, featured }: GameCardProps) {
  const isPopular = game.isPopular ?? POPULAR_SLUGS.has(game.slug);

  return (
    <Link href={`/games/${game.slug}`} className="group block relative">
      <div
        className={`rounded-[16px] overflow-hidden border bg-bg-elevated flex h-full transition-all duration-300 group-hover:-translate-y-0.5 ${
          featured
            ? "flex-row border-accent/20 ring-1 ring-accent/5 hover:border-accent/40 hover:shadow-elevated"
            : "flex-col border-border-strong hover:border-accent/30 hover:shadow-elevated"
        }`}
      >
        {/* Visual */}
        <div className={`relative overflow-hidden bg-bg-tertiary ${
          featured ? "w-2/5 min-h-[160px]" : "aspect-[4/3]"
        }`}>
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            sizes={featured ? "(max-width: 1024px) 50vw, 33vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className="object-cover object-center transition-all duration-500 ease-out group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 pointer-events-none" />

          {isPopular && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-bg-primary text-[10px] font-semibold">
              <Flame className="w-2.5 h-2.5" />
              Populer
            </span>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-grow ${featured ? "p-5 justify-center" : "p-4"}`}>
          <span className="text-[11px] font-semibold text-text-secondary leading-none">
            {game.publisher}
          </span>

          <h3 className={`font-display font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1 mt-1.5 leading-snug ${
            featured ? "text-base sm:text-lg" : "text-sm sm:text-base"
          }`}>
            {game.name}
          </h3>

          <div className={`mt-auto border-t border-border-color flex items-center justify-between ${
            featured ? "pt-4 mt-4" : "pt-3"
          }`}>
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-text-secondary leading-none">Mulai dari</p>
              <p className={`font-extrabold text-text-primary ${featured ? "text-sm" : "text-xs"}`}>
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
