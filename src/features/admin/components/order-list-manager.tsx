"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, RotateCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateOrderStatus } from "../actions/admin-order-actions";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  gameAccountInfo: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: Date;
  game: {
    name: string;
  };
  product: {
    name: string;
  };
}

interface OrderListManagerProps {
  initialOrders: OrderItem[];
}

export function OrderListManager({ initialOrders }: OrderListManagerProps) {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);

    if (result.success) {
      success("Status transaksi berhasil diperbarui!");
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } else {
      error(result.error || "Gagal memperbarui status transaksi.");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.game.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusBadges = {
    PENDING: "warning" as const,
    PROCESSING: "info" as const,
    SUCCESS: "success" as const,
    FAILED: "danger" as const,
    EXPIRED: "neutral" as const,
    REFUNDED: "danger" as const,
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Filters Toolbar */}
      <div className="glass p-5 rounded-2xl border border-border-color/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full sm:max-w-xs">
          <Input
            id="search"
            placeholder="Cari invoice, nama, email, game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-text-secondary/60" />}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider hidden sm:inline">
            Status:
          </span>
          <Select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-44 py-2"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Pending (Menunggu)</option>
            <option value="PROCESSING">Processing (Proses)</option>
            <option value="SUCCESS">Success (Sukses)</option>
            <option value="FAILED">Failed (Gagal)</option>
            <option value="EXPIRED">Expired (Kedaluwarsa)</option>
            <option value="REFUNDED">Refunded (Refund)</option>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Game / Nominal</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>ID Akun Game</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ubah Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              // Parse account info
              let accountInfoStr = order.gameAccountInfo;
              try {
                const parsed = JSON.parse(order.gameAccountInfo);
                accountInfoStr = Object.entries(parsed)
                  .map(([k, v]) => `${k === "userId" ? "UID" : "Svr"}: ${v}`)
                  .join(" | ");
              } catch (e) {}

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-bold text-xs">
                    <div className="flex items-center gap-2">
                      {order.invoiceNumber}
                      <a
                        href={`/order/${order.invoiceNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-secondary hover:text-accent"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{order.game.name}</span>
                      <span className="text-[10px] text-text-secondary">{order.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customerName}</span>
                      <span className="text-[10px] text-text-secondary">{order.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{accountInfoStr}</TableCell>
                  <TableCell className="font-bold text-accent">{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {updatingId === order.id && <RotateCw className="w-3 h-3 animate-spin text-accent" />}
                      <Badge variant={statusBadges[order.status as keyof typeof statusBadges] || "neutral"}>
                        {order.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      id={`status-select-${order.id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="py-1.5 text-xs w-32"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="FAILED">FAILED</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="glass rounded-2xl p-16 text-center border border-border-color/60">
          <p className="text-text-secondary text-sm">Tidak ada transaksi yang cocok dengan kriteria filter.</p>
        </div>
      )}
    </div>
  );
}
