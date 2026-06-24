import React from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Clock, Gamepad2, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const { prisma } = await import("@/lib/prisma");

  const [totalOrders, pendingOrders, activeGames, revenueAgg, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.game.count({ where: { isActive: true } }),
    prisma.order.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        game: { select: { name: true } },
        product: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.amount ?? 0;

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

      {/* Stats — revenue card gets visual weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Primary metric: revenue — accent glow, larger text */}
        <Card className="sm:col-span-2 lg:col-span-1 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardBody className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-muted font-medium tracking-wide uppercase">
                Total Pendapatan
              </span>
              <span className="text-2xl font-extrabold text-accent tracking-tight">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        {/* Secondary metrics — compact, uniform */}
        {[
          { label: "Transaksi", value: totalOrders.toLocaleString("id-ID"), icon: <ShoppingCart className="w-4 h-4" />, color: "text-info" },
          { label: "Menunggu Bayar", value: pendingOrders.toLocaleString("id-ID"), icon: <Clock className="w-4 h-4" />, color: "text-warning" },
          { label: "Game Aktif", value: activeGames.toLocaleString("id-ID"), icon: <Gamepad2 className="w-4 h-4" />, color: "text-success" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardBody className="flex items-center justify-between p-5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-text-muted font-medium tracking-wide uppercase">
                  {stat.label}
                </span>
                <span className="text-xl font-extrabold text-text-primary tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className={`${stat.color} opacity-60`}>
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
