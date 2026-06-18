"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt, Mail, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function CheckOrderForm() {
  const router = useRouter();
  const { error, success } = useToast();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim() || !email.trim()) {
      error("Mohon isi semua kolom pencarian.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/orders/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber: invoiceNumber.trim(), email: email.trim() }),
      });
      const data = await response.json();
      setIsLoading(false);

      if (!response.ok || !data.success) {
        error(data.error || "Transaksi tidak ditemukan.");
        return;
      }
      success("Transaksi ditemukan! Mengalihkan...");
      router.push(`/order/${invoiceNumber.trim()}`);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      error("Terjadi kesalahan sistem.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center p-6">
        <div className="mx-auto p-3 bg-accent/10 text-accent rounded-xl w-fit mb-4">
          <Receipt className="w-6 h-6" />
        </div>
        <h1 className="font-display text-lg font-bold text-text-primary">Lacak Transaksi Anda</h1>
        <p className="text-sm text-text-muted leading-relaxed mt-1">
          Masukkan nomor invoice dan email yang Anda gunakan saat checkout.
        </p>
      </CardHeader>
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input id="invoice" label="Nomor Invoice" placeholder="Contoh: TUK-20260618-ABC123" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} icon={<Receipt className="w-4 h-4" />} />
          <Input id="email" type="email" label="Alamat Email" placeholder="Contoh: pembeli@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} />
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Cari Transaksi <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
