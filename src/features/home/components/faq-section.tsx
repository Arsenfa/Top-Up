"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Berapa lama proses top up setelah pembayaran?",
    a: "Proses pengiriman berjalan otomatis dan biasanya selesai dalam 3–10 detik setelah pembayaran berhasil dikonfirmasi oleh sistem payment gateway kami. Pada kondisi tertentu (misalnya server provider sedang maintenance), bisa memakan waktu hingga 5 menit.",
  },
  {
    q: "Apakah top up di TopUpKu aman untuk akun game saya?",
    a: "100% aman. Kami adalah reseller resmi yang bersertifikat dari publisher game. Kami tidak memerlukan password akun game Anda, hanya User ID / Player ID yang bersifat publik. Akun game Anda tidak akan pernah berisiko.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami mendukung QRIS (scan dari semua app e-wallet), GoPay, OVO, Dana, ShopeePay, serta transfer bank BCA, BNI, BRI, dan Mandiri. Pembayaran diproses dengan aman menggunakan Midtrans yang sudah berlisensi Bank Indonesia.",
  },
  {
    q: "Bagaimana jika diamond / item tidak masuk setelah bayar?",
    a: "Jika sudah lebih dari 10 menit dan item belum masuk, silakan hubungi Customer Support kami melalui WhatsApp atau email dengan menyertakan nomor order transaksi. Kami akan segera memproses ulang atau memberikan refund penuh.",
  },
  {
    q: "Apakah ada kode promo atau diskon?",
    a: "Ya! Kami secara rutin merilis kode promo melalui media sosial dan newsletter kami. Untuk pengguna baru, gunakan kode HEMATNEW untuk mendapatkan diskon Rp5.000. Pantau terus halaman Promo kami untuk penawaran terbaru.",
  },
  {
    q: "Bagaimana cara cek status transaksi saya?",
    a: "Buka menu 'Cek Transaksi' di navbar, lalu masukkan nomor order atau email yang digunakan saat checkout. Status transaksi akan ditampilkan secara real-time, termasuk detail pengiriman item.",
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border transition-colors duration-200 ${isOpen ? "border-accent/30 bg-bg-tertiary" : "border-border-color bg-bg-secondary"}`}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-5 py-4 text-left gap-4"
      >
        <span className={`text-sm font-semibold transition-colors duration-200 ${isOpen ? "text-accent" : "text-text-primary"}`}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isOpen ? "bg-accent/15 text-accent" : "bg-bg-overlay text-text-muted"}`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="h-px bg-border-subtle mb-4" />
              <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full py-20 lg:py-28 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-label mb-4 inline-flex">FAQ</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight mb-3">
            Pertanyaan yang <span className="gradient-text">Sering Ditanyakan</span>
          </h2>
          <p className="text-base text-text-secondary max-w-lg mx-auto leading-relaxed">
            Tidak menemukan jawaban yang kamu cari? Hubungi CS kami langsung.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-col gap-2.5"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
