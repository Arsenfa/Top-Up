import React from "react";
import { prisma } from "@/lib/prisma";
import { PromoListManager } from "@/features/admin/components/promo-list-manager";

export const revalidate = 0; // Dynamic rendering for admin promos

export default async function AdminPromosPage() {
  // Fetch promos
  const promos = await prisma.promo.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Kelola Promo</h1>
        <p className="text-xs text-text-secondary mt-1">
          Atur kode promo kupon diskon, potongan tetap rupiah, potongan persentase, dan minimal pembelian.
        </p>
      </div>

      <PromoListManager initialPromos={promos} />
    </div>
  );
}
