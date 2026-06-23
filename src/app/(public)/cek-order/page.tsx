import React from "react";
import { CheckOrderForm } from "@/features/orders/components/check-order-form";

export const metadata = {
  title: "Lacak Transaksi - TopUpKu",
  description: "Cari dan pantau status transaksi top up game Anda dengan mudah menggunakan nomor invoice.",
};

export default function CheckOrderPage() {
  return (
    <div className="flex-grow flex items-center justify-center py-16 sm:py-24 bg-bg-primary px-4">
      <CheckOrderForm />
    </div>
  );
}
