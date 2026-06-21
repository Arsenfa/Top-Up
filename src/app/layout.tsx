import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

export const metadata: Metadata = {
  title: "TopUpKu - Top Up Game Tercepat & Termurah",
  description:
    "Top up diamond Mobile Legends (ML), Free Fire (FF), Genshin Impact, UC PUBG Mobile, VP Valorant instan 24 jam dengan payment gateway aman, QRIS, e-wallet, dan Bank Transfer.",
  keywords: "top up games, diamond ml, diamond ff, genesis crystals, valorant points, pubg mobile uc, midtrans, qris",
  openGraph: {
    title: "TopUpKu - Top Up Game Tercepat & Termurah",
    description:
      "Top up diamond Mobile Legends (ML), Free Fire (FF), Genshin Impact, UC PUBG Mobile, VP Valorant instan 24 jam dengan payment gateway aman.",
    url: "https://topupku-app.vercel.app",
    siteName: "TopUpKu",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopUpKu - Top Up Game Tercepat & Termurah",
    description:
      "Top up diamond Mobile Legends (ML), Free Fire (FF), Genshin Impact, UC PUBG Mobile, VP Valorant instan 24 jam.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
