"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, MessageCircle } from "lucide-react";

export function CTABannerSection() {
  return (
    <section className="w-full py-20 lg:py-24 relative overflow-hidden">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-3xl overflow-hidden border border-accent/20 bg-bg-secondary"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[110px]"
              style={{ background: "rgba(224,92,61,0.06)" }} />
            <div className="absolute bottom-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px]"
              style={{ background: "rgba(224,92,61,0.04)" }} />
            {/* Dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
            <div className="text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs font-bold uppercase tracking-wider text-accent mb-5">
                <Zap className="w-3 h-3" />
                Mulai Sekarang
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight mb-3 leading-tight">
                Siap Top Up Game <br className="hidden sm:block" />
                <span className="gradient-text">Favoritmu?</span>
              </h2>
              <p className="text-base text-text-secondary leading-relaxed">
                Bergabunglah bersama 100.000+ gamer Indonesia yang sudah percaya pada TopUpKu. Proses mudah, harga hemat, pengiriman kilat.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link
                href="/#games"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-accent hover:bg-accent-hover text-white transition-all duration-200 shadow-[0_4px_20px_rgba(224,92,61,0.22)] hover:shadow-[0_6px_28px_rgba(224,92,61,0.35)] active:scale-[0.97]"
              >
                <Zap className="w-4 h-4" />
                Pilih Game & Top Up
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-transparent border border-border-strong hover:border-text-muted text-text-primary hover:text-white transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi CS
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
