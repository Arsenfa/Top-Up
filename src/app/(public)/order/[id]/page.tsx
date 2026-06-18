import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/features/orders/components/order-status";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;

  // Query order by invoice number
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

  // Map Date fields to match expected client component prop signatures
  const serializedOrder = {
    ...order,
    // Ensure nested relations are passed through
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
