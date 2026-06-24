"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  { q: "Berapa lama proses top up setelah pembayaran?", a: "Biasanya 3-10 detik setelah pembayaran dikonfirmasi. Pada kondisi tertentu bisa memakan waktu hingga 5 menit." },
  { q: "Apakah top up di TopUpKu aman untuk akun game saya?", a: "100% aman. Kami tidak memerlukan password akun game Anda, hanya User ID yang bersifat publik." },
  { q: "Metode pembayaran apa saja yang tersedia?", a: "QRIS, GoPay, OVO, Dana, ShopeePay, serta transfer bank BCA, BNI, BRI, dan Mandiri via Midtrans." },
  { q: "Bagaimana jika diamond tidak masuk setelah bayar?", a: "Hubungi CS kami via WhatsApp dengan nomor order. Kami akan proses ulang atau refund penuh." },
  { q: "Apakah ada kode promo atau diskon?", a: "Ya! Gunakan kode HEMATNEW untuk diskon Rp5.000. Pantau halaman Promo untuk penawaran terbaru." },
  { q: "Bagaimana cara cek status transaksi?", a: "Buka 'Cek Order' di navbar, masukkan nomor order dan email yang dipakai saat checkout." },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border transition-colors ${isOpen ? "border-accent/30 bg-bg-elevated" : "border-border-color bg-bg-tertiary"}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full px-5 py-4 text-left gap-4"
      >
        <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-accent" : "text-text-primary"}`}>
          {faq.q}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="h-px bg-border-subtle mb-4" />
          <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full py-16 sm:py-24 bg-bg-secondary border-y border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary tracking-tight mb-3">
              Pertanyaan Umum
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-6">
              Tidak menemukan jawaban? Tanyakan langsung ke tim kami - biasanya balas dalam hitungan menit.
            </p>

            <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors group"
            >
              <MessageCircle className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
              Hubungi CS via WhatsApp
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
