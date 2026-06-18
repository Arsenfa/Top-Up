import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    game: "Mobile Legends",
    rating: 5,
    text: "Sudah langganan 6 bulan. Diamond selalu langsung masuk, harga paling murah. CS juga ramah.",
    avatar: "BS",
    featured: true,
  },
  {
    name: "Rina Ariani",
    game: "Genshin Impact",
    rating: 5,
    text: "Crystal langsung masuk dalam 3 detik! Sekarang pasti ke TopUpKu dulu.",
    avatar: "RA",
    featured: false,
  },
  {
    name: "Dimas Raharjo",
    game: "Valorant",
    rating: 4,
    text: "VP langsung masuk setelah bayar. CS ramah dan fast response. Kadang agak lama di jam sibuk.",
    avatar: "DR",
    featured: false,
  },
  {
    name: "Sari Ningrum",
    game: "Free Fire",
    rating: 5,
    text: "Harga diamond FF paling hemat. Top up lebih dari 20 kali, gak pernah ada masalah.",
    avatar: "SN",
    featured: false,
  },
  {
    name: "Arya Wibawa",
    game: "PUBG Mobile",
    rating: 5,
    text: "UC PUBG langsung masuk. Promo HEMATNEW beneran hemat! Recommended banget.",
    avatar: "AW",
    featured: true,
  },
  {
    name: "Fira Dewi",
    game: "Honkai: Star Rail",
    rating: 4,
    text: "Top up Oneiric Shards gampang banget. Masukin UID, pilih nominal, bayar - selesai.",
    avatar: "FD",
    featured: false,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3 h-3 ${
            n <= rating
              ? "text-warning fill-warning"
              : "text-border-strong"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const col1 = [TESTIMONIALS[0], TESTIMONIALS[3]];
  const col2 = [TESTIMONIALS[1], TESTIMONIALS[4]];
  const col3 = [TESTIMONIALS[2], TESTIMONIALS[5]];

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary tracking-tight">
            Apa kata mereka
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-text-primary tracking-tight">
              4.9
            </span>
            <div className="flex flex-col">
              <StarRating rating={5} />
              <span className="text-xs text-text-muted mt-0.5">
                12.000+ ulasan
              </span>
            </div>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {[...col1, ...col2, ...col3].map((t) => (
            <div
              key={t.name}
              className={`break-inside-avoid rounded-2xl border bg-bg-secondary hover:border-accent/20 transition-colors duration-300 ${
                t.featured
                  ? "border-accent/20 p-6"
                  : "border-border-color p-5"
              }`}
            >
              <p
                className={`text-text-secondary leading-relaxed ${
                  t.featured ? "text-base" : "text-sm"
                }`}
              >
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-subtle">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    t.featured
                      ? "bg-accent text-bg-primary"
                      : "bg-bg-tertiary text-text-secondary"
                  }`}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {t.name}
                  </p>
                  <span className="text-xs text-text-muted">
                    {t.game}
                  </span>
                </div>
                <StarRating rating={t.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
