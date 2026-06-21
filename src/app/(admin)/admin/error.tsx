"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold text-text-primary">Terjadi Kesalahan</h2>
        <p className="text-sm text-text-secondary max-w-sm">
          {error.message || "Halaman ini gagal dimuat. Silakan coba lagi."}
        </p>
      </div>
      <Button onClick={reset} variant="primary" size="sm" className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
