import React from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

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
  { name: "Daftar Game", href: "/#games" },
  { name: "Hubungi CS", href: "https://wa.me/6281234567890" },
];

const TRUST_FACTS = [
  "Pembayaran via Midtrans",
  "Tanpa password akun game",
  "Bantuan lewat WhatsApp",
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const year = CURRENT_YEAR;

  return (
    <footer className="w-full bg-bg-secondary border-t border-border-color mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center w-fit">
              <span className="font-display font-extrabold text-lg tracking-tight text-text-primary">
                TopUp<span className="text-accent">Ku</span>
              </span>
            </Link>

            <p className="text-sm text-text-muted leading-relaxed">
              Platform top up game terpercaya. Diamond, koin, UC, dan voucher game dengan harga hemat &amp; pengiriman instan.
            </p>

            <div className="flex flex-col gap-1.5 mt-1">
              <a
                href="tel:+6281234567890"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors w-fit"
              >
                <Phone className="w-3.5 h-3.5" />
                +62 812-3456-7890
              </a>
              <a
                href="mailto:support@topupku.com"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors w-fit"
              >
                <Mail className="w-3.5 h-3.5" />
                support@topupku.com
              </a>
            </div>
          </div>

          {/* Popular Games */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary">Game Populer</h4>
            <ul className="flex flex-col gap-2">
              {POPULAR_GAMES.map((g) => (
                <li key={g.name}>
                  <Link
                    href={g.href}
                    className="text-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary">Layanan</h4>
            <ul className="flex flex-col gap-2">
              {LINKS_LAYANAN.map((l) => (
                <li key={l.name}>
                  {l.href.startsWith("http") ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      {l.name}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      {l.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary">Trust</h4>
            <ul className="flex flex-col gap-2">
              {TRUST_FACTS.map((fact) => (
                <li key={fact} className="text-sm text-text-muted">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-color">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-center">
          <p className="text-xs text-text-muted">
            &copy; {year} TopUpKu. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
