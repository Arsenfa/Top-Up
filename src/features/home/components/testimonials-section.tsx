"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    game: "Mobile Legends",
    rating: 5,
    text: "Sudah langganan di sini lebih dari 6 bulan. Diamond selalu langsung masuk, harga paling murah dibanding tempat lain. Pokoknya rekomen banget!",
    avatar: "BS",
    date: "2 hari lalu",
  },
  {
    name: "Rina Ariani",
    game: "Genshin Impact",
    rating: 5,
    text: "Awalnya ragu coba di sini, tapi ternyata crystal langsung masuk dalam 3 detik! Serius kaget. Sekarang kalau mau top up pasti ke TopUpKu dulu.",
    avatar: "RA",
    date: "5 hari lalu",
  },
  {
    name: "Dimas Raharjo",
    game: "Valorant",
    rating: 5,
    text: "VP langsung masuk setelah bayar. CS nya juga ramah dan fast response waktu ada masalah kecil. Aman dan terpercaya!",
    avatar: "DR",
    date: "1 minggu lalu",
  },
  {
    name: "Sari Ningrum",
    game: "Free Fire",
    rating: 5,
    text: "Harga diamond FF di sini paling hemat yang pernah aku coba. Udah top up lebih dari 20 kali, gak pernah ada masalah sekali pun.",
    avatar: "SN",
    date: "1 minggu lalu",
  },
  {
    name: "Arya Wibawa",
    game: "PUBG Mobile",
    rating: 5,
    text: "UC PUBG langsung masuk ke karakter. Promo HEMATNEW beneran hemat! Tampilan website juga rapih, mudah dipake. Lanjut langganan!",
    avatar: "AW",
    date: "2 minggu lalu",
  },
  {
    name: "Fira Dewi",
    game: "Honkai: Star Rail",
    rating: 4,
    text: "Top up Oneiric Shards gampang banget. Tinggal masukin UID, pilih nominal, bayar — selesai. Pelayanan overall memuaskan.",
    avatar: "FD",
    date: "3 minggu lalu",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= rating ? "text-amber fill-amber" : "text-border-strong"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="section-label mb-4 inline-flex">Testimoni Pengguna</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight mb-3">
            Dipercaya{" "}
            <span className="gradient-text">100.000+</span>{" "}
            Gamer
          </h2>
          <p className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Jangan percaya kata kami saja — ini yang dikatakan para gamers yang sudah merasakan langsung.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="group flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-bg-secondary border border-border-color hover:border-border-strong hover:bg-bg-tertiary transition-all duration-300"
            >
              {/* Rating */}
              <StarRating rating={t.rating} />

              {/* Text */}
              <p className="text-sm text-text-secondary leading-relaxed flex-grow">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center font-display font-bold text-xs text-accent">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{t.name}</p>
                  <p className="text-[11px] text-text-muted truncate">Pemain {t.game}</p>
                </div>
                <span className="text-[10px] text-text-muted shrink-0">{t.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
