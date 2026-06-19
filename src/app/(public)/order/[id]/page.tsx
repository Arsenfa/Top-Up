export const dynamic = "force-dynamic";

import React from "react";
import { notFound } from "next/navigation";
import { OrderStatus } from "@/features/orders/components/order-status";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;

  const { prisma } = await import("@/lib/prisma");

  const order = await prisma.order.findUnique({
    where: { invoiceNumber: id },
    include: {
      game: true,
      product: true,
    },
  });

  if (!order) {
    notFound();
  }

  const serializedOrder = {
    ...order,
    game: {
      name: order.game.name,
      imageUrl: order.game.imageUrl,
    },
    product: {
      name: order.product.name,
    },
  };

  return <OrderStatus order={serializedOrder} />;
}
