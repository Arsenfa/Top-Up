import React from "react";
import { CheckOrderForm } from "@/features/orders/components/check-order-form";

export const metadata = {
  title: "Lacak Transaksi — TopUpKu",
  description: "Cari dan pantau status transaksi top up game Anda dengan mudah menggunakan nomor invoice.",
};

export default function CheckOrderPage() {
  return (
    <div className="flex-grow flex items-center justify-center py-16 sm:py-24 bg-gradient-to-b from-bg-secondary/20 to-bg-primary relative overflow-hidden px-4">
      {/* Background radial highlight */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <CheckOrderForm />
      </div>
    </div>
  );
}
