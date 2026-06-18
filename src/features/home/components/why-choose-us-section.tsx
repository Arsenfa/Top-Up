import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Tag, Headset } from "lucide-react";

const REASONS = [
  {
    num: "01",
    title: "Proses Kilat Otomatis",
    desc: "Diamonds, UC, atau VP langsung dikirim ke akun game kamu dalam hitungan detik. Sistem otomatis 24/7.",
    icon: Clock,
  },
  {
    num: "02",
    title: "100% Aman & Legal",
    desc: "Reseller resmi berlisensi. Kami tidak pernah meminta password atau data sensitif akun kamu.",
    icon: ShieldCheck,
  },
  {
    num: "03",
    title: "Harga Paling Kompetitif",
    desc: "Harga termurah dan promo eksklusif mingguan. Diamond game favoritmu, harga grosir langsung.",
    icon: Tag,
  },
  {
    num: "04",
    title: "Support CS 24 Jam",
    desc: "Tim CS profesional siap membantu via WhatsApp, fast response.",
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

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
            Kenapa TopUpKu?
          </h2>
          <Link
            href="/#games"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors shrink-0 cursor-pointer"
          >
            Mulai Top Up
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Featured card */}
          <div
            className="lg:col-span-3 relative overflow-hidden rounded-[20px] border border-accent/20 bg-accent-dim p-8 sm:p-10 flex flex-col justify-between min-h-[300px] group hover:border-accent/40 transition-all duration-300"
          >
            <span
              className="absolute -right-4 -bottom-10 font-display font-extrabold text-[180px] leading-none text-accent pointer-events-none select-none opacity-[0.04]"
            >
              01
            </span>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent text-bg-primary flex items-center justify-center">
                <FeaturedIcon className="w-5 h-5" />
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

            <div className="flex items-center gap-2 mt-8 pt-4 border-t border-accent/10">
              <span className="text-xs font-semibold text-accent">Rata-rata 10 detik</span>
              <span className="text-accent/30">|</span>
              <span className="text-xs font-medium text-text-secondary">Otomatis 24/7</span>
            </div>
          </div>

          {/* Stacked cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.map((r) => {
              const Icon = r.icon;

              return (
                <div
                  key={r.num}
                  className="flex-1 rounded-[16px] border border-border-color bg-bg-secondary hover:border-accent/30 transition-all duration-300 p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-bg-tertiary text-text-secondary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
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
