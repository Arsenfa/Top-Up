"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Star, Check } from "lucide-react";

const STATS = [
  {
    value: "100K+",
    label: "Total Transaksi",
    sub: "Diproses bulan ini",
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    value: "50+",
    label: "Game Tersedia",
    sub: "MOBA, FPS, RPG & more",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    value: "4.9★",
    label: "Rating Pengguna",
    sub: "Dari 12.000+ ulasan",
    icon: <Star className="w-5 h-5 fill-amber text-amber" />,
    color: "text-amber",
    bg: "bg-amber/10",
  },
  {
    value: "99.9%",
    label: "Sukses Rate",
    sub: "Pengiriman otomatis",
    icon: <Check className="w-5 h-5" />,
    color: "text-success",
    bg: "bg-success/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function StatsSection() {
  return (
    <section className="w-full py-16 relative overflow-hidden">
      {/* Subtle divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-bg-secondary border border-border-color hover:border-border-strong transition-colors duration-300"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className={`font-display font-black text-3xl sm:text-4xl tracking-tight ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="font-semibold text-sm text-text-primary mt-1">{stat.label}</div>
                <div className="text-xs text-text-muted mt-0.5">{stat.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
