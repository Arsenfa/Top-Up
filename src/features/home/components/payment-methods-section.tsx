import React from "react";
import { ShieldCheck } from "lucide-react";

// Inline SVGs for Indonesian Payment Partners
function QrisLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 24" fill="currentColor" className={className} style={style}>
      <path d="M2 3h6v6H2V3zm1 1v4h4V4H3zm7 0h2v2h-2V4zm3 0h4v6h-4V4zm1 1v4h2V5h-2zM2 12h6v6H2v-6zm1 1v4h4v-4H3zm7-1h2v4h-2v-4zm0 5h4v2h-4v-2zm5-5h2v6h-2v-6zm3 1h2v3h-2v-3zm0 4h4v2h-4v-2z" />
      <text x="24" y="18" fontFamily="sans-serif" fontWeight="bold" fontSize="15" letterSpacing="-0.5">QRIS</text>
    </svg>
  );
}

function GopayLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="900" fontSize="17" letterSpacing="-0.8">go<tspan fill="var(--gopay-color, currentColor)">pay</tspan></text>
    </svg>
  );
}

function OvoLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="800" fontSize="18" letterSpacing="0.5">ovo</text>
    </svg>
  );
}

function DanaLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="900" fontSize="17" letterSpacing="-0.5">DANA</text>
    </svg>
  );
}

// Fixed parameter types for all inline SVGs to support style props
function ShopeepayLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 95 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="800" fontSize="14" letterSpacing="-0.3">ShopeePay</text>
    </svg>
  );
}

function BcaLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="bold" fontStyle="italic" fontSize="18" letterSpacing="-0.8">BCA</text>
    </svg>
  );
}

function MandiriLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="bold" fontStyle="italic" fontSize="16" letterSpacing="-0.8">mandırı</text>
    </svg>
  );
}

function BniLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="900" fontSize="18" letterSpacing="-0.5">BNI</text>
    </svg>
  );
}

function BriLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="bold" fontSize="18" letterSpacing="-0.8">BRI</text>
    </svg>
  );
}

function MidtransLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 20" fill="currentColor" className={className} style={style}>
      <text x="0" y="15" fontFamily="sans-serif" fontWeight="bold" fontSize="15" letterSpacing="-0.8">midtrans</text>
    </svg>
  );
}

const PAYMENT_METHODS = [
  { name: "QRIS", color: "#1D4ED8", logo: QrisLogo },
  { name: "GoPay", color: "#00AED6", logo: GopayLogo },
  { name: "OVO", color: "#4C2A86", logo: OvoLogo },
  { name: "Dana", color: "#118EFF", logo: DanaLogo },
  { name: "ShopeePay", color: "#EE4D2D", logo: ShopeepayLogo },
  { name: "BCA", color: "#005BAA", logo: BcaLogo },
  { name: "BNI", color: "#E77228", logo: BniLogo },
  { name: "Mandiri", color: "#F5A623", logo: MandiriLogo },
  { name: "BRI", color: "#005BAA", logo: BriLogo },
];

export function PaymentMethodsSection() {
  return (
    <section className="w-full pt-12 pb-6 bg-bg-secondary border-t border-border-color">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seamless integrated design — blends directly into the footer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          
          {/* Left Column: Trust Info */}
          <div className="max-w-xs space-y-2 shrink-0">
            <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
              <span className="font-display font-extrabold text-sm text-text-primary">
                Metode Pembayaran Resmi
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Semua transaksi dienkripsi secara aman dan diproses otomatis melalui payment gateway Midtrans.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-text-muted font-bold uppercase tracking-wider">
              <span>Partner Resmi</span>
              <span className="text-border-strong">·</span>
              <MidtransLogo className="h-3.5 w-auto text-text-muted" />
            </div>
          </div>

          {/* Right Column: Partners Logo Grid */}
          <div className="flex-grow grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full lg:max-w-2xl">
            {PAYMENT_METHODS.map((m) => {
              const LogoComponent = m.logo;
              return (
                <div
                  key={m.name}
                  className="flex items-center justify-center p-3.5 rounded-xl border border-border-subtle bg-bg-tertiary/20 hover:bg-bg-primary hover:border-accent/20 transition-all duration-300 group cursor-default"
                  style={{
                    ["--gopay-color" as any]: m.name === "GoPay" ? m.color : undefined,
                  }}
                >
                  <LogoComponent 
                    className="h-5 w-auto text-text-muted group-hover:text-text-primary transition-colors duration-300" 
                    style={{
                      color: `var(--hover-color, ${m.color})`,
                    }}
                  />
                </div>
              );
            })}
          </div>

        </div>
        
      </div>
    </section>
  );
}
