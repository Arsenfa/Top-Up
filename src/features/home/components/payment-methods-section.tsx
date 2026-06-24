import React from "react";
import { ShieldCheck } from "lucide-react";

const PAYMENT_METHODS = [
  { name: "QRIS", logo: "/payments/qris.svg" },
  { name: "GoPay", logo: "/payments/gopay.svg" },
  { name: "OVO", logo: "/payments/ovo.svg" },
  { name: "DANA", logo: "/payments/dana.svg" },
  { name: "ShopeePay", logo: "/payments/shopeepay.svg" },
  { name: "BCA", logo: "/payments/bca.svg" },
  { name: "BNI", logo: "/payments/bni.svg" },
  { name: "Mandiri", logo: "/payments/mandiri.svg" },
  { name: "BRI", logo: "/payments/bri.svg" },
];

export function PaymentMethodsSection() {
  return (
    <section className="w-full pt-12 pb-6 bg-bg-secondary border-t border-border-color">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">

          <div className="max-w-xs space-y-2 shrink-0">
            <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
              <span className="font-display font-extrabold text-sm text-text-primary">
                Pembayaran Resmi
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Transaksi dienkripsi aman dan diproses otomatis melalui Midtrans.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-text-muted font-semibold">
              <span>Partner</span>
              <span className="text-border-strong">|</span>
              <span>Midtrans</span>
            </div>
          </div>

          <div className="flex-grow grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full lg:max-w-2xl">
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-center p-3.5 rounded-xl border border-border-subtle bg-bg-tertiary/40 hover:bg-bg-tertiary hover:border-accent/20 transition-all duration-300 group cursor-default"
              >
                {m.name === "QRIS" ? (
                  <span className="text-xs font-bold text-text-muted group-hover:text-text-secondary transition-colors duration-300 tracking-wide">
                    QRIS
                  </span>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={m.logo}
                    alt={m.name}
                    width={60}
                    height={20}
                    loading="lazy"
                    className="h-5 w-auto max-w-[60px] object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
