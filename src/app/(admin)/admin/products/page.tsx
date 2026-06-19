export const dynamic = "force-dynamic";

import React from "react";
import { ProductListManager } from "@/features/admin/components/product-list-manager";

export default async function AdminProductsPage() {
  const { prisma } = await import("@/lib/prisma");

  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      game: { select: { name: true } },
    },
  });

  const games = await prisma.game.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Kelola Produk</h1>
        <p className="text-xs text-text-secondary mt-1">
          Atur harga nominal top up diamond, koin, cash, voucher game, dan beri promo coret harga.
        </p>
      </div>

      <ProductListManager initialProducts={products} games={games} />
    </div>
  );
}
