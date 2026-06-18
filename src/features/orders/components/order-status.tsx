"use client";

import React, { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, XCircle, Copy, ArrowLeft, Gamepad, Calendar, Mail, Smartphone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatus } from "@/features/admin/actions/admin-order-actions";

interface OrderStatusProps {
  order: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    gameAccountInfo: string;
    amount: number;
    status: string;
    paymentMethod: string | null;
    midtransSnapToken: string | null;
    paidAt: Date | null;
    createdAt: Date;
    game: {
      name: string;
      imageUrl: string;
    };
    product: {
      name: string;
    };
  };
}

export function OrderStatus({ order }: OrderStatusProps) {
  const { success, error, warning } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleSimulateSuccess = async () => {
    setSimLoading(true);
    try {
      const res = await updateOrderStatus(order.id, "SUCCESS");
      if (res.success) {
        success("Simulasi pembayaran berhasil! Status diubah menjadi Berhasil.");
        setCurrentStatus("SUCCESS");
      } else {
        error(res.error || "Gagal mensimulasikan pembayaran.");
      }
    } catch (err) {
      error("Terjadi kesalahan saat simulasi pembayaran.");
    } finally {
      setSimLoading(false);
    }
  };

  // Poll status from API every 5 seconds if PENDING
  React.useEffect(() => {
    if (currentStatus !== "PENDING") return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/status?invoice=${order.invoiceNumber}`);
        const data = await response.json();
        if (data.success && data.status !== currentStatus) {
          setCurrentStatus(data.status);
          if (data.status === "SUCCESS") {
            success("Pembayaran berhasil diverifikasi!");
          }
        }
      } catch (err) {
        console.error("Failed to poll order status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order.invoiceNumber, currentStatus, success]);


  // Parse account information
  let accountInfo: Record<string, string> = {};
  try {
    accountInfo = JSON.parse(order.gameAccountInfo);
  } catch (err) {
    console.error("Failed to parse game account info:", err);
  }

  const handleCopyInvoice = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(order.invoiceNumber);
    success("Nomor invoice berhasil disalin!");
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handlePayNow = () => {
    if (!order.midtransSnapToken) {
      error("Token pembayaran tidak ditemukan.");
      return;
    }

    setPayLoading(true);

    if (window.snap) {
      setPayLoading(false);
      window.snap.pay(order.midtransSnapToken, {
        onSuccess: (res) => {
          success("Pembayaran sukses!");
          window.location.reload();
        },
        onPending: (res) => {
          warning("Menunggu penyelesaian pembayaran...");
          window.location.reload();
        },
        onError: (res) => {
          error("Transaksi pembayaran gagal.");
          window.location.reload();
        },
        onClose: () => {
          warning("Popup transaksi pembayaran ditutup.");
        },
      });
    } else {
      setPayLoading(false);
      warning("Sistem pembayaran berjalan dalam mode simulasi.");
    }
  };

  // Status mapping
  const statusConfig = {
    PENDING: {
      label: "Menunggu Pembayaran",
      variant: "warning" as const,
      icon: <Clock className="w-8 h-8 text-warning animate-pulse" />,
      description: "Silakan selesaikan pembayaran Anda menggunakan snap popup.",
    },
    PROCESSING: {
      label: "Sedang Diproses",
      variant: "info" as const,
      icon: <Clock className="w-8 h-8 text-info" />,
      description: "Pembayaran terverifikasi! Sistem sedang mengirim top up ke akun game Anda.",
    },
    SUCCESS: {
      label: "Berhasil",
      variant: "success" as const,
      icon: <CheckCircle2 className="w-8 h-8 text-success" />,
      description: "Top up sukses dikirim! Terima kasih telah berbelanja di TopUpKu.",
    },
    FAILED: {
      label: "Gagal",
      variant: "danger" as const,
      icon: <XCircle className="w-8 h-8 text-danger" />,
      description: "Transaksi pembayaran gagal atau ditolak.",
    },
    EXPIRED: {
      label: "Kedaluwarsa",
      variant: "neutral" as const,
      icon: <XCircle className="w-8 h-8 text-text-secondary" />,
      description: "Waktu pembayaran telah habis. Silakan buat pesanan baru.",
    },
  }[currentStatus] || {
    label: currentStatus,
    variant: "neutral" as const,
    icon: <AlertCircle className="w-8 h-8 text-text-secondary" />,
    description: "Status transaksi tidak diketahui.",
  };

  return (
    <>
      {/* Midtrans Snap JS Script Loader for retry */}
      <Script
        src={`https://app.${
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "" : "sandbox."
        }midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Status Hero Card */}
        <Card variant="glass" className="border-border-color/60">
          <CardBody className="flex flex-col items-center text-center p-8">
            <div className="p-4 bg-bg-secondary rounded-full border border-border-color/40 mb-5 shadow-inner">
              {statusConfig.icon}
            </div>
            <Badge variant={statusConfig.variant} className="mb-3">
              {statusConfig.label}
            </Badge>
            <h1 className="font-display text-lg font-bold text-text-primary mb-2">
              Nomor Invoice: {order.invoiceNumber}
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md">
              {statusConfig.description}
            </p>

            {currentStatus === "PENDING" && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {order.midtransSnapToken && (
                  <Button onClick={handlePayNow} className="shadow-xl" isLoading={payLoading}>
                    Selesaikan Pembayaran
                  </Button>
                )}
                <Button
                  onClick={handleSimulateSuccess}
                  variant="secondary"
                  className="shadow-xl border border-accent/25 hover:border-accent text-accent"
                  isLoading={simLoading}
                >
                  Simulasikan Bayar Sukses (Demo)
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Transaction Details */}
        <Card variant="default">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
              Rincian Transaksi
            </h2>
            <button
              onClick={handleCopyInvoice}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors border border-border-color/80 px-2.5 py-1.5 rounded-xl hover:bg-bg-tertiary/50"
            >
              <Copy className="w-3.5 h-3.5" />
              {isCopying ? "Tersalin!" : "Salin Invoice"}
            </button>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 text-xs sm:text-sm">
            {/* Game Info */}
            <div className="flex items-center gap-3.5 border-b border-border-color/60 pb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-bg-tertiary border border-border-color/40">
                <img src={order.game.imageUrl} alt={order.game.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary">{order.game.name}</h4>
                <p className="text-[10px] text-text-secondary font-medium">Top Up Nominal</p>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                  Nominal Top Up
                </span>
                <span className="font-bold text-text-primary">{order.product.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                  Total Bayar
                </span>
                <span className="font-extrabold text-accent">{formatCurrency(order.amount)}</span>
              </div>

              {Object.entries(accountInfo).map(([key, val]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                    {key === "userId" ? "User ID / Player ID" : "Server ID"}
                  </span>
                  <span className="font-mono font-bold text-text-primary">{val}</span>
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                  Metode Pembayaran
                </span>
                <span className="font-bold text-text-primary uppercase">
                  {order.paymentMethod || "Midtrans"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                  Tanggal Transaksi
                </span>
                <span className="text-text-primary">
                  {new Date(order.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {(order.paidAt || currentStatus === "SUCCESS") && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                    Waktu Pembayaran
                  </span>
                  <span className="text-text-primary">
                    {new Date(order.paidAt || new Date()).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="border-t border-border-color/60 pt-4 mt-2 flex flex-col gap-3">
              <h3 className="font-bold text-[10px] text-text-secondary uppercase tracking-wider">
                Informasi Kontak Notifikasi
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Smartphone className="w-4 h-4 text-accent" />
                  <span>{order.customerPhone}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
