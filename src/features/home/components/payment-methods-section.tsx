"use client";

import { motion } from "framer-motion";

const PAYMENT_METHODS = [
  { name: "QRIS", color: "#dc2626", icon: "⬛" },
  { name: "GoPay", color: "#00aed6", icon: "💙" },
  { name: "OVO", color: "#4c2a86", icon: "💜" },
  { name: "Dana", color: "#118eff", icon: "💙" },
  { name: "ShopeePay", color: "#ee4d2d", icon: "🧡" },
  { name: "BCA", color: "#005baa", icon: "🏦" },
  { name: "BNI", color: "#e77228", icon: "🏦" },
  { name: "Mandiri", color: "#003082", icon: "🏦" },
  { name: "BRI", color: "#005baa", icon: "🏦" },
  { name: "Permata", color: "#e31837", icon: "🏦" },
];

/* SVG logo placeholders — professional minimal approach */
function PaymentLogo({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-4 px-3 rounded-xl bg-bg-secondary border border-border-color hover:border-border-strong transition-all duration-200 hover:bg-bg-tertiary group cursor-default">
      {/* Color strip bar acts as the brand color indicator */}
      <div className="w-full h-1 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-display font-black text-xs tracking-tight text-text-primary group-hover:text-accent transition-colors duration-200">
        {name}
      </span>
    </div>
  );
}

export function PaymentMethodsSection() {
  return (
    <section className="w-full py-20 lg:py-24 relative">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-color to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-label mb-4 inline-flex">Metode Pembayaran</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-text-primary tracking-tight mb-3">
            Bayar Pakai <span className="gradient-text">Apa Saja</span>
          </h2>
          <p className="text-base text-text-secondary max-w-lg mx-auto leading-relaxed">
            Kami mendukung 10+ metode pembayaran populer — mulai dari QRIS, dompet digital, hingga transfer bank.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-3"
        >
          {PAYMENT_METHODS.map((method) => (
            <PaymentLogo key={method.name} name={method.name} color={method.color} />
          ))}
        </motion.div>

        {/* Reassurance strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-text-muted"
        >
          {[
            "🔒 Enkripsi SSL 256-bit",
            "✅ Pembayaran terverifikasi Midtrans",
            "🛡️ Data transaksi aman",
            "📱 Tersedia di mobile & desktop",
          ].map((text) => (
            <span key={text}>{text}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
