import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { ShieldAlert, Zap, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // Cache individual game page for up to 60 seconds

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const { slug } = await params;

  // Fetch game by slug with its active products
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!game || !game.isActive) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back button or page header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Game Info details */}
        <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="glass rounded-3xl p-6 border border-border-color/60 flex flex-col items-center text-center">
            {/* Logo image wrapper */}
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-bg-tertiary border border-border-color shadow-xl mb-6">
              <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
            </div>

            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {game.publisher}
            </span>
            <h1 className="font-display text-2xl font-extrabold text-text-primary mt-1 mb-3">
              {game.name}
            </h1>
            <Badge variant="primary" className="mb-6">
              {game.category}
            </Badge>

            <div className="border-t border-border-color/60 pt-6 w-full text-left">
              <h4 className="font-bold text-sm text-text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-accent" />
                Deskripsi Game
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {game.description}
              </p>
            </div>
          </div>

          {/* Secure transaction notice */}
          <div className="glass rounded-2xl p-5 border border-border-color/60 flex gap-4">
            <div className="p-2.5 bg-success/10 text-success rounded-xl border border-success/15 h-fit flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-text-primary mb-1">Jaminan Transaksi Aman</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Setiap pembayaran diproteksi menggunakan enkripsi SSL dari Midtrans. Pengiriman top up diproses langsung secara otomatis dan legal 100%.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form Stepper */}
        <div className="lg:col-span-2">
          <CheckoutForm game={game} products={game.products} />
        </div>
      </div>
    </div>
  );
}
