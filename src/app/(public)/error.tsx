"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-grow flex items-center justify-center py-16 sm:py-24 px-4">
      <div className="flex flex-col items-center text-center max-w-md gap-6">
        <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20">
          <AlertTriangle className="w-10 h-10 text-danger" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-extrabold text-text-primary tracking-tight">
            Ups, ada yang salah
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Halaman ini gagal dimuat. Bisa jadi server lagi sibuk atau ada masalah koneksi. Coba lagi dalam beberapa saat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover text-bg-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-border-color text-text-primary hover:border-accent/30 hover:text-accent transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
