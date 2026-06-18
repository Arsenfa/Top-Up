"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

const REASONS = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Proses Kilat",
    desc: "Sistem kami memproses pesanan secara otomatis. Diamond, UC, atau VP langsung masuk ke akunmu dalam hitungan detik setelah pembayaran dikonfirmasi.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "100% Aman & Legal",
    desc: "Kami beroperasi sebagai reseller resmi yang bersertifikat. Akun game kamu tidak pernah terancam — kami tidak membutuhkan password game-mu.",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Harga Terbaik",
    desc: "Kami berkomitmen memberikan harga paling kompetitif di kelasnya. Hemat lebih banyak dengan kode promo eksklusif dan penawaran bundle spesial.",
    color: "text-amber",
    bg: "bg-amber/10",
    border: "border-amber/20",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "CS 24/7",
    desc: "Tim Customer Support kami siap melayani kendala transaksi kapan saja — siang, malam, hari libur — melalui WhatsApp, email, dan live chat.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function WhyChooseUsSection() {
  return (
    <section className="w-full py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <span className="section-label mb-4 inline-flex">Keunggulan Kami</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight mb-4">
            Kenapa Pilih{" "}
            <span className="gradient-text">TopUpKu</span>?
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            Bukan sekadar janji — setiap fitur kami dirancang untuk memberikan pengalaman top up yang benar-benar mulus dan terpercaya.
          </p>
        </motion.div>

        {/* Grid — 2 col left full, right has 2 stacked */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {REASONS.map((r) => (
            <motion.div
              key={r.title}
              variants={item}
              className="group flex flex-col gap-5 p-6 rounded-2xl bg-bg-secondary border border-border-color hover:border-border-strong transition-all duration-300 hover:bg-bg-tertiary"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${r.bg} ${r.border} ${r.color} transition-transform duration-300 group-hover:scale-105`}>
                {r.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-text-primary mb-2">{r.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/#games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-bg-secondary border border-border-color hover:border-accent/40 text-text-primary hover:text-accent transition-all duration-200"
          >
            Mulai Top Up Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
