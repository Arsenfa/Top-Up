export const dynamic = "force-dynamic";

import React from "react";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { ShieldAlert, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const { slug } = await params;

  const { prisma } = await import("@/lib/prisma");

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="rounded-2xl p-6 border border-border-color bg-bg-secondary flex flex-col items-center text-center">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-bg-tertiary border border-border-color mb-5">
              <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
            </div>

            <span className="text-xs text-text-muted">{game.publisher}</span>
            <h1 className="font-display text-xl font-bold text-text-primary mt-1 mb-3">{game.name}</h1>
            <Badge variant="primary">{game.category}</Badge>

            <div className="border-t border-border-color pt-5 w-full text-left mt-5">
              <h4 className="font-bold text-sm text-text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-accent" />
                Deskripsi Game
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">{game.description}</p>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-border-color bg-bg-secondary flex gap-4">
            <div className="p-2 bg-success/10 text-success rounded-xl h-fit shrink-0">
              <ShieldAlert className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-text-primary mb-1">Jaminan Transaksi Aman</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Pembayaran diproteksi enkripsi SSL Midtrans. Pengiriman top up diproses otomatis.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <CheckoutForm game={game} products={game.products} />
        </div>
      </div>
    </div>
  );
}
