export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Clock, Gamepad2, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const { prisma } = await import("@/lib/prisma");

  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
  const activeGames = await prisma.game.count({ where: { isActive: true } });

  const successfulOrders = await prisma.order.findMany({
    where: { status: "SUCCESS" },
    select: { amount: true },
  });
  const totalRevenue = successfulOrders.reduce((sum, order) => sum + order.amount, 0);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      game: { select: { name: true } },
      product: { select: { name: true } },
    },
  });

  const stats = [
    {
      label: "Total Pendapatan",
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="w-5 h-5 text-success" />,
      bgIcon: "bg-success/10 border-success/20",
    },
    {
      label: "Total Transaksi",
      value: totalOrders.toLocaleString("id-ID"),
      icon: <ShoppingCart className="w-5 h-5 text-accent" />,
      bgIcon: "bg-accent/10 border-accent/20",
    },
    {
      label: "Menunggu Pembayaran",
      value: pendingOrders.toLocaleString("id-ID"),
      icon: <Clock className="w-5 h-5 text-warning" />,
      bgIcon: "bg-warning/10 border-warning/20",
    },
    {
      label: "Game Aktif",
      value: activeGames.toLocaleString("id-ID"),
      icon: <Gamepad2 className="w-5 h-5 text-info" />,
      bgIcon: "bg-info/10 border-info/20",
    },
  ];

  const statusBadges = {
    PENDING: "warning" as const,
    PROCESSING: "info" as const,
    SUCCESS: "success" as const,
    FAILED: "danger" as const,
    EXPIRED: "neutral" as const,
    REFUNDED: "danger" as const,
  };

  const statusLabels = {
    PENDING: "Pending",
    PROCESSING: "Proses",
    SUCCESS: "Sukses",
    FAILED: "Gagal",
    EXPIRED: "Kedaluwarsa",
    REFUNDED: "Refund",
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text-primary">Dashboard</h1>
          <p className="text-xs text-text-secondary mt-1">
            Ikhtisar statistik dan monitoring transaksi penjualan terbaru.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Card key={index} variant="default">
            <CardBody className="flex items-center justify-between p-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-text-secondary font-semibold">
                  {stat.label}
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-text-primary">
                  {stat.value}
                </span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center justify-center ${stat.bgIcon}`}>
                {stat.icon}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-text-primary">
            Transaksi Terbaru
          </h2>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-accent">
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Game</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-bold text-xs">{order.invoiceNumber}</TableCell>
                  <TableCell>{order.game.name}</TableCell>
                  <TableCell className="font-semibold">{order.product.name}</TableCell>
                  <TableCell className="max-w-[120px] truncate">{order.customerName}</TableCell>
                  <TableCell className="font-bold text-accent">{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadges[order.status as keyof typeof statusBadges] || "neutral"}>
                      {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-text-secondary">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      dateStyle: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Card variant="default" className="p-10 text-center">
            <p className="text-text-secondary text-sm">Belum ada transaksi pembelian masuk.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
