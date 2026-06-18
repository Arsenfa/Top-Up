import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

export const metadata: Metadata = {
  title: "TopUpKu — Layanan Top Up Game Tercepat & Termurah",
  description:
    "Top up diamond Mobile Legends (ML), Free Fire (FF), Genshin Impact, UC PUBG Mobile, VP Valorant instan 24 jam dengan payment gateway aman, QRIS, e-wallet, dan Bank Transfer.",
  keywords: "top up games, diamond ml, diamond ff, genesis crystals, valorant points, pubg mobile uc, midtrans, qris",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-bg-primary text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
