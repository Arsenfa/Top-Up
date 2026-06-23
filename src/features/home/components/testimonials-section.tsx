"use client";

import { Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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

export function TestimonialsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-16 sm:py-24 bg-bg-secondary border-y border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 sm:mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
            Mereka udah buktiin
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="w-3.5 h-3.5 text-warning fill-warning" />
              ))}
            </div>
            <span className="text-xs text-text-muted">4.5 rata-rata dari {TESTIMONIALS.length} ulasan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-bg-primary border border-border-subtle p-5 flex flex-col gap-4"
            >
              <div className="flex gap-[3px]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-3.5 h-3.5 ${n <= t.rating ? "text-warning fill-warning" : "text-border-strong"}`}
                  />
                ))}
              </div>

              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border-color flex items-center justify-center text-[10px] font-bold text-text-muted shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary leading-none">{t.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{t.game}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
