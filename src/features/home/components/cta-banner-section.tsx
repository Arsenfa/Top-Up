import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CTABannerSection() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl border border-accent/15 bg-bg-secondary overflow-hidden">
          {/* Subtle radial glow, not full gradient bg */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 p-8 sm:p-12 lg:p-14 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                <Zap className="w-3 h-3" />
                Proses otomatis 24/7
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary tracking-tight leading-tight">
                Top up game favoritmu sekarang
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                8 game tersedia. Bayar pakai QRIS, e-wallet, atau transfer bank. Langsung masuk ke akun.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Link
                href="/#games"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover text-bg-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Lihat Daftar Game
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
