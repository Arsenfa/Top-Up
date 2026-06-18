import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductListManager } from "@/features/admin/components/product-list-manager";

export const revalidate = 0; // Dynamic rendering for admin products management

export default async function AdminProductsPage() {
  // Fetch products with their corresponding game names
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      game: { select: { name: true } },
    },
  });

  // Fetch games for selection
  const games = await prisma.game.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
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
