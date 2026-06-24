export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderStatus } from "@/features/orders/components/order-status";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Pesanan ${id} - TopUpKu`,
    description: "Cek status pesanan top up game Anda.",
  };
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

  // ponytail: a demo order is one whose token was never issued by Midtrans.
  const isDemo =
    !order.midtransSnapToken ||
    order.midtransSnapToken.startsWith("demo-") ||
    order.midtransSnapToken.startsWith("mock-");

  const serializedOrder = {
    ...order,
    game: {
      name: order.game.name,
      slug: order.game.slug,
      imageUrl: order.game.imageUrl,
    },
    product: {
      name: order.product.name,
    },
  };

  return <OrderStatus order={serializedOrder} isDemo={isDemo} />;
}
