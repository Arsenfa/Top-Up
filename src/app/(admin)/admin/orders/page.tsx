import React from "react";
import { OrderListManager } from "@/features/admin/components/order-list-manager";

export default async function AdminOrdersPage() {
  const { prisma } = await import("@/lib/prisma");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      game: { select: { name: true } },
      product: { select: { name: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Monitor Transaksi</h1>
        <p className="text-xs text-text-secondary mt-1">
          Lihat rincian transaksi, verifikasi akun game, dan ubah status pengiriman secara manual.
        </p>
      </div>

      <OrderListManager key={orders.length} initialOrders={orders} />
    </div>
  );
}
