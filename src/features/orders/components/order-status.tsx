"use client";

import React, { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, XCircle, Copy, ArrowLeft, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatus, simulatePayment } from "@/features/admin/actions/admin-order-actions";
import { completeDemoPayment } from "@/features/checkout/actions/checkout-actions";
import { GameCurrencyIcon } from "@/lib/game-currency";

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
    game: { name: string; slug: string; imageUrl: string };
    product: { name: string };
  };
  isAdmin?: boolean; // Add admin flag
  isDemo?: boolean; // Demo order: anyone can complete payment
}

export function OrderStatus({ order, isAdmin = false, isDemo = false }: OrderStatusProps) {
  const { success, error, warning } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleCompleteDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await completeDemoPayment(order.id);
      if (res.success) {
        success("Pembayaran demo berhasil!");
        setCurrentStatus("SUCCESS");
      } else {
        error(res.error || "Gagal menyelesaikan pembayaran demo.");
      }
    } catch {
      error("Terjadi kesalahan saat menyelesaikan pembayaran demo.");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    // Double-check: only in development and for admins
    if (process.env.NODE_ENV !== "development") {
      error("Payment simulation only available in development environment");
      return;
    }

    setSimLoading(true);
    try {
      const res = await simulatePayment(order.id);
      if (res.success) {
        success("Simulasi pembayaran berhasil!");
        setCurrentStatus("SUCCESS");
      } else {
        error(res.error || "Gagal mensimulasikan pembayaran.");
      }
    } catch {
      error("Terjadi kesalahan saat simulasi pembayaran.");
    } finally {
      setSimLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentStatus !== "PENDING") return;
    
    const controller = new AbortController();
    
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/payment/status?invoice=${order.invoiceNumber}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success && data.status !== currentStatus) {
          setCurrentStatus(data.status);
          if (data.status === "SUCCESS") success("Pembayaran berhasil diverifikasi!");
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was aborted, ignore
          return;
        }
        console.error("Failed to poll order status:", err);
      }
    };

    const interval = setInterval(pollStatus, 5000);
    
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [order.invoiceNumber, currentStatus, success]);

  let accountInfo: Record<string, string> = {};
  try {
    accountInfo = JSON.parse(order.gameAccountInfo);
  } catch {
    // ignore parse error
  }

  const handleCopyInvoice = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(order.invoiceNumber);
    success("Nomor invoice disalin!");
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
        onSuccess: () => { success("Pembayaran sukses!"); window.location.reload(); },
        onPending: () => { warning("Menunggu pembayaran..."); window.location.reload(); },
        onError: () => { error("Pembayaran gagal."); window.location.reload(); },
        onClose: () => { warning("Popup ditutup."); },
      });
    } else {
      setPayLoading(false);
      warning("Mode simulasi.");
    }
  };

  const statusConfig = {
    PENDING: {
      label: "Menunggu Pembayaran",
      variant: "warning" as const,
      icon: (
        <div className="w-16 h-16 rounded-full bg-warning/10 text-warning flex items-center justify-center">
          <Clock className="w-8 h-8 stroke-[2.5]" />
        </div>
      ),
      description: "Selesaikan pembayaran Anda sebelum batas waktu berakhir agar transaksi dapat diproses otomatis.",
    },
    PROCESSING: {
      label: "Sedang Diproses",
      variant: "info" as const,
      icon: (
        <div className="w-16 h-16 rounded-full bg-info/10 text-info flex items-center justify-center">
          <Clock className="w-8 h-8 stroke-[2.5]" />
        </div>
      ),
      description: "Pembayaran terverifikasi! Pesanan Anda sedang diproses oleh sistem otomatis kami.",
    },
    SUCCESS: {
      label: "Berhasil",
      variant: "success" as const,
      icon: (
        <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
      ),
      description: "Top up sukses! Item/diamond telah berhasil dikirim ke akun game Anda. Terima kasih!",
    },
    FAILED: {
      label: "Gagal",
      variant: "danger" as const,
      icon: (
        <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center">
          <XCircle className="w-8 h-8 stroke-[2.5]" />
        </div>
      ),
      description: "Transaksi gagal atau ditolak. Silakan hubungi CS jika ada kendala.",
    },
    EXPIRED: {
      label: "Kedaluwarsa",
      variant: "neutral" as const,
      icon: (
        <div className="w-16 h-16 rounded-full bg-neutral/10 text-text-muted flex items-center justify-center">
          <XCircle className="w-8 h-8 stroke-[2.5]" />
        </div>
      ),
      description: "Waktu batas pembayaran telah habis. Silakan buat pesanan baru.",
    },
  }[currentStatus] || {
    label: currentStatus,
    variant: "neutral" as const,
    icon: (
      <div className="w-16 h-16 rounded-full bg-neutral/10 text-text-muted flex items-center justify-center">
        <AlertCircle className="w-8 h-8 stroke-[2.5]" />
      </div>
    ),
    description: "Status transaksi tidak diketahui.",
  };

  return (
    <>
      <Script
        src={`https://app.${process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "" : "sandbox."}midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20 flex flex-col gap-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Status Hero */}
        <Card>
          <CardBody className="flex flex-col items-center text-center p-8 sm:p-12">
            <div className="mb-6">{statusConfig.icon}</div>
            <Badge variant={statusConfig.variant} className="mb-4 text-xs px-3.5 py-1.5 font-semibold">{statusConfig.label}</Badge>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-2">
              Invoice: {order.invoiceNumber}
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg">{statusConfig.description}</p>

            {currentStatus === "PENDING" && (
              <div className="flex flex-col items-center gap-3 mt-8">
                {isDemo ? (
                  <>
                    <Button onClick={handleCompleteDemo} isLoading={demoLoading}>Selesaikan Pembayaran (Demo)</Button>
                    <p className="text-[11px] text-text-muted max-w-xs">
                      Mode demo: tidak ada pembayaran sungguhan. Klik untuk menyimulasikan transaksi berhasil.
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {order.midtransSnapToken && (
                      <Button onClick={handlePayNow} isLoading={payLoading}>Selesaikan Pembayaran</Button>
                    )}
                    {/* Only show simulation button in development and for admins */}
                    {process.env.NODE_ENV === "development" && isAdmin && (
                      <Button onClick={handleSimulateSuccess} variant="outline" isLoading={simLoading}>
                        Simulasi Bayar Sukses (Dev Only)
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-8 pb-0">
            <h2 className="text-base font-extrabold text-text-primary">Rincian Transaksi</h2>
            <button onClick={handleCopyInvoice} className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors border border-border-color px-3 py-1.5 rounded-lg hover:bg-bg-tertiary">
              <Copy className="w-3.5 h-3.5" />
              {isCopying ? "Tersalin!" : "Salin Invoice"}
            </button>
          </CardHeader>
          <CardBody className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex items-center gap-4 border-b border-border-color pb-5">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-tertiary border border-border-color shrink-0 relative">
                <Image src={order.game.imageUrl} alt={order.game.name} fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-text-primary">{order.game.name}</h4>
                <p className="text-xs text-text-muted">Rincian Pembelian Game</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-text-muted font-medium">Nominal Top Up</span>
                <span className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-text-primary">
                  <GameCurrencyIcon slug={order.game.slug} className="w-4 h-4" />
                  {order.product.name}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-text-muted font-medium">Total Bayar</span>
                <span className="text-base sm:text-lg font-black text-accent">{formatCurrency(order.amount)}</span>
              </div>

              {Object.entries(accountInfo).map(([key, val]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-muted font-medium">{key === "userId" ? "User ID / Player ID" : "Server ID"}</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-text-primary">{val}</span>
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-text-muted font-medium">Metode Pembayaran</span>
                <span className="text-sm sm:text-base font-bold text-text-primary">{order.paymentMethod || "Midtrans"}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-text-muted font-medium">Tanggal Transaksi</span>
                <span className="text-sm sm:text-base font-bold text-text-primary">
                  {new Date(order.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>

              {(order.paidAt || currentStatus === "SUCCESS") && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-muted font-medium">Waktu Pembayaran</span>
                  <span className="text-sm sm:text-base font-bold text-text-primary">
                    {new Date(order.paidAt || new Date()).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-border-color pt-6 mt-2 flex flex-col gap-3.5">
              <h3 className="text-xs font-bold text-text-muted">Informasi Kontak</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <Mail className="w-4.5 h-4.5 text-accent shrink-0" />
                  <span className="font-medium">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <Smartphone className="w-4.5 h-4.5 text-accent shrink-0" />
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
