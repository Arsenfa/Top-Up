import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    game: "Mobile Legends",
    rating: 5,
    text: "Sudah langganan lebih dari 6 bulan. Diamond selalu langsung masuk, harga paling murah dibanding tempat lain. Gak pernah ada masalah sama sekali, CS juga ramah.",
    avatar: "BS",
    date: "2 hari lalu",
    featured: true,
  },
  {
    name: "Rina Ariani",
    game: "Genshin Impact",
    rating: 5,
    text: "Crystal langsung masuk dalam 3 detik! Sekarang kalau mau top up pasti ke TopUpKu dulu.",
    avatar: "RA",
    date: "5 hari lalu",
    featured: false,
  },
  {
    name: "Dimas Raharjo",
    game: "Valorant",
    rating: 4,
    text: "VP langsung masuk setelah bayar. CS nya juga ramah dan fast response. Kadang butuh waktu agak lama di jam sibuk tapi overall mantap.",
    avatar: "DR",
    date: "1 minggu lalu",
    featured: false,
  },
  {
    name: "Sari Ningrum",
    game: "Free Fire",
    rating: 5,
    text: "Harga diamond FF di sini paling hemat. Udah top up lebih dari 20 kali, gak pernah ada masalah.",
    avatar: "SN",
    date: "1 minggu lalu",
    featured: false,
  },
  {
    name: "Arya Wibawa",
    game: "PUBG Mobile",
    rating: 5,
    text: "UC PUBG langsung masuk. Promo HEMATNEW beneran hemat! Recommended banget buat yang sering top up.",
    avatar: "AW",
    date: "2 minggu lalu",
    featured: true,
  },
  {
    name: "Fira Dewi",
    game: "Honkai: Star Rail",
    rating: 4,
    text: "Top up Oneiric Shards gampang banget. Tinggal masukin UID, pilih nominal, bayar — selesai.",
    avatar: "FD",
    date: "3 minggu lalu",
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
  // Split into 3 columns for masonry effect
  const col1 = [TESTIMONIALS[0], TESTIMONIALS[3]]; // featured + short
  const col2 = [TESTIMONIALS[1], TESTIMONIALS[4]]; // short + featured
  const col3 = [TESTIMONIALS[2], TESTIMONIALS[5]]; // medium + short

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — left-aligned with stat */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Testimoni</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary tracking-tight mt-3">
              Apa kata mereka
            </h2>
          </div>
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

        {/* Masonry grid — 3 columns on desktop, stacked on mobile */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {[...col1, ...col2, ...col3].map((t, idx) => (
            <div
              key={t.name}
              className={`break-inside-avoid rounded-2xl border bg-bg-secondary hover:border-accent/30 transition-colors duration-300 ${
                t.featured
                  ? "border-accent/20 p-6"
                  : "border-border-color p-5"
              }`}
            >
              {/* Quote mark for featured */}
              {t.featured && (
                <Quote className="w-6 h-6 text-accent/20 mb-2 -scale-x-100" />
              )}

              <p
                className={`text-text-secondary leading-relaxed ${
                  t.featured ? "text-base" : "text-sm"
                }`}
              >
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-subtle">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-[10px] ${
                    t.featured
                      ? "bg-accent text-white"
                      : "bg-bg-tertiary text-text-secondary"
                  }`}
                >
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {t.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">
                      {t.game}
                    </span>
                    <span className="text-border-strong">·</span>
                    <span className="text-xs text-text-muted">
                      {t.date}
                    </span>
                  </div>
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
