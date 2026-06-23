import { Star } from "lucide-react";

const GAME_COLORS: Record<string, string> = {
  "Mobile Legends": "#3B82F6",
  "Genshin Impact": "#14B8A6",
  "Valorant": "#EF4444",
  "Free Fire": "#F59E0B",
  "PUBG Mobile": "#22C55E",
  "Honkai: Star Rail": "#A855F7",
};

const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    game: "Mobile Legends",
    rating: 4,
    text: "udah langganan beberapa bulan, diamond selalu masuk. sekali agak lama pas jam sibuk tapi akhirnya masuk juga.",
    avatar: "BS",
  },
  {
    name: "Rina Ariani",
    game: "Genshin Impact",
    rating: 5,
    text: "top up crystal gampang, masuk cepet kurang dari semenit. sekarang kalau mau beli langsung kesini aja.",
    avatar: "RA",
  },
  {
    name: "Dimas Raharjo",
    game: "Valorant",
    rating: 4,
    text: "VP masuk setelah bayar. pernah ganggu di jam sibuk, tapi cs langsung bantu lewat WA dan ke resolve.",
    avatar: "DR",
  },
  {
    name: "Sari Ningrum",
    game: "Free Fire",
    rating: 5,
    text: "harga diamond FF paling murah yang aku nemu. udah top up berkali-kali gak pernah ada masalah.",
    avatar: "SN",
  },
  {
    name: "Arya Wibawa",
    game: "PUBG Mobile",
    rating: 4,
    text: "UC masuk, prosesnya gampang. cuma kadang QRIS agak nge-lag buat dibayarnya, mungkin dari paymentnya.",
    avatar: "AW",
  },
  {
    name: "Fira Dewi",
    game: "Honkai: Star Rail",
    rating: 5,
    text: "tinggal masukin UID, pilih nominal, bayar, selesai. oneiric shard langsung masuk. recommended.",
    avatar: "FD",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${
            n <= rating
              ? "text-warning fill-warning"
              : "text-border-strong"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t, color }: { t: typeof TESTIMONIALS[number]; color: string }) {
  return (
    <div className="rounded-2xl bg-bg-secondary border border-border-color p-5 flex flex-col gap-4 h-full hover:border-border-strong transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            {t.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary leading-none">
              {t.name}
            </p>
            <span
              className="text-[11px] font-medium mt-0.5 block"
              style={{ color }}
            >
              {t.game}
            </span>
          </div>
        </div>
        <StarRating rating={t.rating} />
      </div>

      <p className="text-sm text-text-secondary leading-relaxed">
        &ldquo;{t.text}&rdquo;
      </p>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary tracking-tight">
              Mereka udah buktiin
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {TESTIMONIALS.length} orang udah ngerasain langsung
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard
              key={t.name}
              t={t}
              color={GAME_COLORS[t.game] || "#FF6B35"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
