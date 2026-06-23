import React from "react";

// ponytail: no per-game currency art assets exist, so we draw one of a few
// shapes tinted to each game's brand color. Keyed by game slug.

type Shape = "diamond" | "crystal" | "hex" | "coin" | "ticket";

interface CurrencyMeta {
  shape: Shape;
  color: string; // brand color of the in-game currency
  unit: string; // short currency name, e.g. "Diamonds"
}

const CURRENCY_BY_SLUG: Record<string, CurrencyMeta> = {
  "mobile-legends": { shape: "diamond", color: "#3B82F6", unit: "Diamonds" },
  "free-fire": { shape: "diamond", color: "#F59E0B", unit: "Diamonds" },
  "genshin-impact": { shape: "crystal", color: "#5B8DEF", unit: "Genesis Crystals" },
  "honkai-star-rail": { shape: "crystal", color: "#8B5CF6", unit: "Oneiric Shards" },
  valorant: { shape: "hex", color: "#FF4655", unit: "Valorant Points" },
  "pubg-mobile": { shape: "coin", color: "#E8A33D", unit: "UC" },
  "call-of-duty-mobile": { shape: "coin", color: "#F0A500", unit: "CP" },
  "arena-of-valor": { shape: "ticket", color: "#D4AF37", unit: "Vouchers" },
};

const FALLBACK: CurrencyMeta = { shape: "diamond", color: "#7C8AA0", unit: "Items" };

export function getCurrencyMeta(slug: string): CurrencyMeta {
  return CURRENCY_BY_SLUG[slug] ?? FALLBACK;
}

function ShapePath({ shape }: { shape: Shape }) {
  switch (shape) {
    case "diamond":
      return <path d="M12 2l5.5 6.5L12 22 6.5 8.5 12 2z" />;
    case "crystal":
      return <path d="M12 2l4 5-1.5 13h-5L8 7l4-5z" />;
    case "hex":
      return <path d="M12 2l8.5 5v10L12 22 3.5 17V7L12 2z" />;
    case "coin":
      return <circle cx="12" cy="12" r="9" />;
    case "ticket":
      return <path d="M3 7h18v4a2 2 0 000 4v2H3v-2a2 2 0 000-4V7z" />;
  }
}

interface IconProps {
  slug: string;
  className?: string;
}

export function GameCurrencyIcon({ slug, className = "w-4 h-4" }: IconProps) {
  const { shape, color } = getCurrencyMeta(slug);
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ color }}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0.5}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ShapePath shape={shape} />
    </svg>
  );
}
