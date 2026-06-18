import React from "react";
import Link from "next/link";
import { Zap, Mail, Phone, MessageCircle, Globe, ShieldCheck, Clock, ArrowUpRight } from "lucide-react";

const POPULAR_GAMES = [
  { name: "Mobile Legends", href: "/games/mobile-legends" },
  { name: "Free Fire", href: "/games/free-fire" },
  { name: "Genshin Impact", href: "/games/genshin-impact" },
  { name: "PUBG Mobile", href: "/games/pubg-mobile" },
  { name: "Valorant", href: "/games/valorant" },
  { name: "Honkai: Star Rail", href: "/games/honkai-star-rail" },
];

const LINKS_LAYANAN = [
  { name: "Cek Transaksi", href: "/cek-order" },
  { name: "Promo & Diskon", href: "#" },
  { name: "Cara Top Up", href: "#" },
  { name: "Hubungi CS", href: "#" },
];

const LINKS_LEGAL = [
  { name: "Syarat & Ketentuan", href: "#" },
  { name: "Kebijakan Privasi", href: "#" },
  { name: "Kebijakan Refund", href: "#" },
];

const VALUE_PROPS = [
  { icon: <Zap className="w-4 h-4" />, label: "Proses Kilat 3 Detik", color: "text-accent bg-accent/10 border-accent/20" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "100% Aman & Legal", color: "text-success bg-success/10 border-success/20" },
  { icon: <Clock className="w-4 h-4" />, label: "CS 24/7 Siap Bantu", color: "text-amber bg-amber/10 border-amber/20" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-bg-secondary border-t border-border-color mt-auto">
      {/* Value Props Strip */}
      <div className="border-b border-border-subtle py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VALUE_PROPS.map((vp) => (
              <div key={vp.label} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${vp.color} shrink-0`}>
                  {vp.icon}
                </div>
                <span className="text-sm font-semibold text-text-primary">{vp.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-0">
                <span className="font-display font-black text-[18px] tracking-tight text-text-primary">TopUp</span>
                <span className="font-display font-black text-[18px] tracking-tight text-accent">Ku</span>
              </div>
            </Link>

            <p className="text-xs text-text-muted leading-relaxed">
              Platform layanan top up game online terpercaya #1 di Indonesia. Diamond, koin, UC, dan voucher game dengan harga paling hemat &amp; pengiriman instan.
            </p>

            <div className="flex flex-col gap-2 mt-1">
              <a href="tel:+6281234567890" className="flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors w-fit">
                <Phone className="w-3.5 h-3.5 text-accent" />
                +62 812-3456-7890
              </a>
              <a href="mailto:support@topupku.com" className="flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors w-fit">
                <Mail className="w-3.5 h-3.5 text-accent" />
                support@topupku.com
              </a>
            </div>

            {/* Socials */}
            <div className="flex gap-2 mt-1">
              {[
                { Icon: MessageCircle, href: "#", label: "WhatsApp" },
                { Icon: Globe, href: "#", label: "Website" },
                { Icon: Mail, href: "#", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border-color hover:border-accent/40 hover:text-accent text-text-muted flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Popular Games */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">Game Populer</h4>
            <ul className="flex flex-col gap-2">
              {POPULAR_GAMES.map((g) => (
                <li key={g.name}>
                  <Link
                    href={g.href}
                    className="flex items-center justify-between group text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    Top Up {g.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5 translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">Layanan</h4>
            <ul className="flex flex-col gap-2">
              {LINKS_LAYANAN.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="flex items-center justify-between group text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    {l.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5 translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">Legal</h4>
            <ul className="flex flex-col gap-2">
              {LINKS_LEGAL.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="flex items-center justify-between group text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    {l.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5 translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment badge strip */}
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <p className="text-[10px] text-text-muted mb-2 font-semibold uppercase tracking-wider">Powered by</p>
              <div className="flex flex-wrap gap-1.5">
                {["Midtrans", "QRIS", "GoPay", "OVO"].map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded bg-bg-tertiary border border-border-color text-[10px] font-semibold text-text-muted">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-subtle py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-text-muted">
            &copy; {year} <span className="font-semibold text-text-secondary">TopUpKu</span>. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Semua sistem berjalan normal
          </div>
        </div>
      </div>
    </footer>
  );
}
