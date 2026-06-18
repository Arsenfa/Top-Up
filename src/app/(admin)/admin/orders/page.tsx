import React from "react";
import { prisma } from "@/lib/prisma";
import { OrderListManager } from "@/features/admin/components/order-list-manager";

export const revalidate = 0; // Dynamic rendering for admin orders management

export default async function AdminOrdersPage() {
  // Fetch all orders
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      game: { select: { name: true } },
      product: { select: { name: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Monitor Transaksi</h1>
        <p className="text-xs text-text-secondary mt-1">
          Lihat rincian transaksi, verifikasi akun game, dan ubah status pengiriman secara manual.
        </p>
      </div>

      <OrderListManager initialOrders={orders} />
    </div>
  );
}
