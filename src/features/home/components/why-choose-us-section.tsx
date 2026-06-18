import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Tag, Headset } from "lucide-react";

const REASONS = [
  {
    num: "01",
    title: "Proses Kilat Otomatis",
    desc: "Diamonds, UC, atau VP langsung dikirim ke akun game kamu dalam hitungan detik setelah pembayaran berhasil dikonfirmasi. Sistem kami berjalan otomatis 24/7.",
    icon: Clock,
  },
  {
    num: "02",
    title: "100% Aman & Legal",
    desc: "Kami adalah reseller resmi berlisensi. Keamanan akun kamu terjamin sepenuhnya karena kami tidak pernah meminta password atau data login sensitif.",
    icon: ShieldCheck,
  },
  {
    num: "03",
    title: "Harga Paling Kompetitif",
    desc: "Nikmati penawaran harga termurah dan bundle promo eksklusif mingguan. Belanja diamond game favoritmu dengan harga grosir langsung.",
    icon: Tag,
  },
  {
    num: "04",
    title: "Support CS 24 Jam",
    desc: "Tim customer service profesional kami selalu bersiap membantu menyelesaikan semua kendala transaksimu secara fast response via WhatsApp.",
    icon: Headset,
  },
];

export function WhyChooseUsSection() {
  const featured = REASONS[0];
  const rest = REASONS.slice(1);
  const FeaturedIcon = featured.icon;

  return (
    <section className="w-full py-16 sm:py-24 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header — Left-aligned with allowed eyebrow under restraint rules */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label">Kenapa TopUpKu?</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight mt-3">
              Keunggulan Layanan Kami
            </h2>
          </div>
          <Link
            href="/#games"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors shrink-0 cursor-pointer"
          >
            Mulai Top Up Sekarang
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bento grid with visual diversity to prevent white-on-white AI look */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          
          {/* Featured card — Spans 3 columns with sienna tint background & asymmetric style */}
          <div 
            className="lg:col-span-3 relative overflow-hidden rounded-[24px] border border-accent/20 bg-accent-dim p-8 sm:p-10 flex flex-col justify-between min-h-[300px] group hover:border-accent/40 transition-all duration-300 shadow-sm"
          >
            {/* Elegant watermark number */}
            <span
              className="absolute -right-6 -bottom-10 font-display font-extrabold text-[200px] leading-none text-accent pointer-events-none select-none opacity-[0.04]"
            >
              01
            </span>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center shadow-sm">
                  <FeaturedIcon className="w-5.5 h-5.5" />
                </div>
                <span className="font-display text-xs font-extrabold text-accent uppercase tracking-widest">
                  Unggulan
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
                  {featured.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                  {featured.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-4 border-t border-accent/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
                <span>Rata-rata 10 detik proses</span>
              </div>
              <span className="text-accent/30">·</span>
              <span className="text-xs font-medium text-text-secondary">Otomatis 24/7</span>
            </div>
          </div>

          {/* 3 stacked cards — Spans 2 columns with diverse card styling */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.map((r, idx) => {
              const Icon = r.icon;
              // Card background diversity: 1 card gets an off-white sienna accent card design
              const isSpecial = idx === 1; // "Harga Paling Kompetitif" gets featured visual highlight

              return (
                <div
                  key={r.num}
                  className={`flex-1 rounded-[20px] border p-6 transition-all duration-300 group ${
                    isSpecial
                      ? "border-accent/20 bg-bg-secondary hover:border-accent/40 shadow-[0_4px_20px_rgba(194,65,12,0.02)]"
                      : "border-border-color bg-bg-secondary hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSpecial 
                          ? "bg-accent-dim text-accent" 
                          : "bg-bg-tertiary text-text-secondary"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-sm text-text-primary group-hover:text-accent transition-colors leading-snug">
                        {r.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
