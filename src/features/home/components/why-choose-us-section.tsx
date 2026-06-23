"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, ShieldOff, Tag, Headset } from "lucide-react";

const REASONS = [
  {
    icon: Clock,
    stat: "±10s",
    title: "Masuk dalam hitungan detik",
    desc: "Setelah bayar terkonfirmasi, item langsung dikirim otomatis ke akun game. Gak perlu nunggu admin online.",
  },
  {
    icon: ShieldOff,
    stat: "0",
    title: "Gak perlu kasih password",
    desc: "Cukup masukkan User ID yang bersifat publik. Kami tidak pernah minta password atau data sensitif.",
  },
  {
    icon: Tag,
    stat: "±3%",
    title: "Harga mendekati resmi",
    desc: "Bandingkan sendiri sama harga in-game. Sesekali ada promo eksklusif yang bikin lebih hemat.",
  },
  {
    icon: Headset,
    stat: "<5 mnt",
    title: "CS balas cepat via WhatsApp",
    desc: "Ada kendala? Chat tim CS langsung. Biasanya balas dalam beberapa menit di jam aktif.",
  },
];

export function WhyChooseUsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full py-16 sm:py-24 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 sm:mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
            Kenapa orang pake TopUpKu
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Ribet itu musuh. Kami bikin sesimpel mungkin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.stat}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent/25 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] text-accent" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-extrabold text-accent tabular-nums tracking-tight leading-none">
                    {r.stat}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display font-bold text-sm sm:text-base text-text-primary leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
