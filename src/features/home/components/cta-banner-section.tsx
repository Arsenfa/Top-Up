import Link from "next/link";
import { Zap, ArrowRight, MessageCircle } from "lucide-react";

const TRUST_INDICATORS = [
  "Proses Otomatis 24/7",
  "100.000+ Gamer Aktif",
  "Garansi Refund",
] as const;

/* Cross-hatch pattern - subtle texture without network request */
const crossHatchSvg = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L20 20M20 0L0 20' stroke='%232E3138' stroke-width='.5' fill='none' opacity='.3'/%3E%3C/svg%3E")`;

export function CTABannerSection() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl border border-accent/20 bg-bg-tertiary"
          style={{ backgroundImage: crossHatchSvg, backgroundSize: "20px 20px" }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 px-8 py-12 sm:px-12 lg:px-16">
            <div className="max-w-xl space-y-4">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary tracking-tight leading-tight">
                Siap Top Up Game Favoritmu?
              </h2>

              <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                Bergabung bersama ratusan ribu gamer Indonesia yang mempercayakan kebutuhan top up mereka ke TopUpKu.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                {TRUST_INDICATORS.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted"
                  >
                    <Zap className="w-3 h-3 text-accent" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link
                href="/#games"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover text-bg-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" />
                Pilih Game & Top Up
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-border-color hover:border-accent text-text-primary transition-all duration-200 hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi CS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
