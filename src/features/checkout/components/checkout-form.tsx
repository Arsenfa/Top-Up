"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { User, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutOrder, validatePromoCode } from "../actions/checkout-actions";
import { formatCurrency } from "@/lib/utils";

// TypeScript declarations for Midtrans Snap
interface MidtransResult {
  order_id: string;
  transaction_status: string;
  payment_type?: string;
  fraud_status?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: MidtransResult) => void;
          onPending: (result: MidtransResult) => void;
          onError: (result: MidtransResult) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string | null;
}

interface GameDetail {
  id: string;
  name: string;
  slug: string;
  publisher: string;
  requiredFields: string;
}

interface CheckoutFormProps {
  game: GameDetail;
  products: ProductItem[];
}

export function CheckoutForm({ game, products }: CheckoutFormProps) {
  const router = useRouter();
  const { success, error, warning } = useToast();

  const [accountInfo, setAccountInfo] = useState<Record<string, string>>({});
  // ponytail: preselect cheapest product so price reads immediately, not "Rp 0"
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const [appliedPromo, setAppliedPromo] = useState<{
    id: string;
    code: string;
    title: string;
    type: string;
    value: number;
    maxDiscount: number | null;
  } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const requiredFields = game.requiredFields.split(",");

  const handleAccountInfoChange = (field: string, value: string) => {
    setAccountInfo((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const basePrice = selectedProduct ? selectedProduct.price : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyPromo = async () => {
    if (!selectedProductId) {
      error("Pilih nominal top up terlebih dahulu.");
      return;
    }
    if (!promoCode.trim()) {
      error("Masukkan kode promo terlebih dahulu.");
      return;
    }

    setPromoLoading(true);
    const result = await validatePromoCode(promoCode, basePrice);
    setPromoLoading(false);

    if (!result.success || !result.promo) {
      error(result.error || "Gagal menerapkan kode promo.");
      setAppliedPromo(null);
      setDiscountAmount(0);
      return;
    }

    const promo = result.promo;
    let disc = 0;
    if (promo.type === "FIXED") {
      disc = promo.value;
    } else if (promo.type === "PERCENTAGE") {
      disc = Math.floor((basePrice * promo.value) / 100);
      if (promo.maxDiscount && disc > promo.maxDiscount) {
        disc = promo.maxDiscount;
      }
    }

    setAppliedPromo(promo);
    setDiscountAmount(disc);
    success(`Kode promo ${promo.code} berhasil! Hemat ${formatCurrency(disc)}.`);
  };

  const handleClearPromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoCode("");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!accountInfo[field] || !accountInfo[field].trim()) errors[field] = `Kolom ini wajib diisi.`;
    });
    if (!selectedProductId) errors.product = "Pilih salah satu nominal top up.";
    if (!customerName.trim()) errors.name = "Nama lengkap wajib diisi.";
    if (!customerEmail.trim()) errors.email = "Alamat email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(customerEmail)) errors.email = "Format email tidak valid.";
    if (!customerPhone.trim()) errors.phone = "Nomor WhatsApp wajib diisi.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      error("Lengkapi semua kolom yang ditandai merah.");
      return;
    }

    setIsLoading(true);
    const result = await createCheckoutOrder({
      gameId: game.id,
      productId: selectedProductId,
      customerName,
      customerEmail,
      customerPhone,
      gameAccountInfo: accountInfo,
      promoCode: appliedPromo ? appliedPromo.code : undefined,
    });
    setIsLoading(false);

    if (!result.success || !result.token || !result.invoiceNumber) {
      error(result.error || "Gagal memproses transaksi.");
      return;
    }

    const { token, invoiceNumber } = result;

    if (window.snap && !token.startsWith("mock-")) {
      window.snap.pay(token, {
        onSuccess: () => { success("Pembayaran berhasil!"); router.push(`/order/${invoiceNumber}?status=success`); },
        onPending: () => { warning("Menunggu pembayaran..."); router.push(`/order/${invoiceNumber}?status=pending`); },
        onError: () => { error("Pembayaran gagal."); router.push(`/order/${invoiceNumber}?status=failed`); },
        onClose: () => { warning("Popup ditutup."); router.push(`/order/${invoiceNumber}`); },
      });
    } else {
      warning("Mode simulasi / Demo.");
      router.push(`/order/${invoiceNumber}`);
    }
  };

  const paymentMethods = [
    { id: "qris", name: "QRIS (GoPay, OVO, Dana, LinkAja)", logo: "https://midtrans.com/assets/img/icon/qris.svg", tag: "Instan" },
    { id: "gopay", name: "GoPay / ShopeePay E-Wallet", logo: "https://midtrans.com/assets/img/icon/gopay.svg", tag: "Instan" },
    { id: "bca_va", name: "BCA Virtual Account", logo: "https://midtrans.com/assets/img/icon/bca.svg", tag: "Verifikasi Otomatis" },
    { id: "bni_va", name: "BNI Virtual Account", logo: "https://midtrans.com/assets/img/icon/bni.svg", tag: "Verifikasi Otomatis" },
    { id: "bri_va", name: "BRI Virtual Account", logo: "https://midtrans.com/assets/img/icon/bri.svg", tag: "Verifikasi Otomatis" },
    { id: "mandiri_va", name: "Mandiri Virtual Account", logo: "https://midtrans.com/assets/img/icon/mandiri.svg", tag: "Verifikasi Otomatis" },
  ];

  return (
    <>
      <Script
        src={`https://app.${
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "" : "sandbox."
        }midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <form onSubmit={handleCheckout} className="flex flex-col gap-6 w-full">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="text-sm font-bold text-text-primary">Informasi Akun Game</h2>
            </div>
          </CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requiredFields.map((field) => (
              <Input
                key={field}
                id={field}
                label={field === "userId" ? "User ID / Player ID" : "Server ID / Regional"}
                placeholder={field === "userId" ? "Contoh: 12345678" : "Contoh: 1234"}
                value={accountInfo[field] || ""}
                onChange={(e) => handleAccountInfoChange(field, e.target.value)}
                error={validationErrors[field]}
              />
            ))}
          </CardBody>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-sm font-bold text-text-primary">Pilih Nominal Top Up</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((product) => {
                const isSelected = selectedProductId === product.id;
                const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => { setSelectedProductId(product.id); setAppliedPromo(null); setDiscountAmount(0); }}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer relative h-28 transition-colors duration-200 ${
                      isSelected ? "bg-accent/10 border-accent/60" : "bg-bg-tertiary border-border-color hover:border-border-strong"
                    }`}
                  >
                    {hasDiscount && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-danger/10 text-[9px] font-bold text-danger rounded">
                        Promo
                      </span>
                    )}
                    <span className="font-medium text-xs text-text-primary line-clamp-1 mb-1.5">{product.name}</span>
                    <span className="text-xs font-bold text-accent">{formatCurrency(product.price)}</span>
                    {hasDiscount && (
                      <span className="text-[10px] text-text-muted line-through mt-0.5">{formatCurrency(product.originalPrice!)}</span>
                    )}
                  </button>
                );
              })}
            </div>
            {validationErrors.product && <p className="text-xs text-danger font-medium mt-2">{validationErrors.product}</p>}
          </CardBody>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="text-sm font-bold text-text-primary">Pilih Metode Pembayaran</h2>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {paymentMethods.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-colors duration-200 ${
                    isSelected ? "bg-accent/10 border-accent/60" : "bg-bg-tertiary border-border-color hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg bg-bg-secondary border border-border-color p-1 flex items-center justify-center overflow-hidden shrink-0">
                      {renderPaymentLogo(method.id)}
                    </div>
                    <div>
                      <h4 className="font-medium text-xs text-text-primary">{method.name}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">{method.tag}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-accent bg-accent" : "border-border-color"}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </CardBody>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">4</span>
              <h2 className="text-sm font-bold text-text-primary">Data Kontak &amp; Konfirmasi</h2>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="name" label="Nama Lengkap" placeholder="Contoh: Budi Santoso" icon={<User className="w-4 h-4" />} value={customerName} onChange={(e) => { setCustomerName(e.target.value); if (validationErrors.name) setValidationErrors((p) => ({ ...p, name: "" })); }} error={validationErrors.name} />
              <Input id="email" type="email" label="Alamat Email" placeholder="Contoh: budi@gmail.com" icon={<Mail className="w-4 h-4" />} value={customerEmail} onChange={(e) => { setCustomerEmail(e.target.value); if (validationErrors.email) setValidationErrors((p) => ({ ...p, email: "" })); }} error={validationErrors.email} />
            </div>
            <Input id="phone" label="Nomor WhatsApp" placeholder="Contoh: 08123456789" icon={<Phone className="w-4 h-4" />} value={customerPhone} onChange={(e) => { setCustomerPhone(e.target.value); if (validationErrors.phone) setValidationErrors((p) => ({ ...p, phone: "" })); }} error={validationErrors.phone} />

            <div className="border-t border-border-color pt-4 mt-2">
              <label className="text-sm font-medium text-text-muted block mb-2">Kode Promo (Opsional)</label>
              <div className="flex gap-2">
                <Input id="promo" placeholder="Masukkan kode promo..." value={promoCode} onChange={(e) => setPromoCode(e.target.value)} disabled={!!appliedPromo || !selectedProductId} className="bg-bg-tertiary" />
                {appliedPromo ? (
                  <Button type="button" variant="danger" onClick={handleClearPromo}>Hapus</Button>
                ) : (
                  <Button type="button" variant="secondary" onClick={handleApplyPromo} isLoading={promoLoading} disabled={!selectedProductId || !promoCode}>Terapkan</Button>
                )}
              </div>
              {appliedPromo && (
                <p className="text-xs text-success font-medium mt-1">
                  Promo berhasil: {appliedPromo.title} (-{formatCurrency(discountAmount)})
                </p>
              )}
            </div>
          </CardBody>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs text-text-muted">Total Pembayaran:</span>
              <span className="text-lg font-bold text-accent">{formatCurrency(finalPrice)}</span>
              {discountAmount > 0 && <span className="text-[10px] text-success font-medium">Hemat {formatCurrency(discountAmount)}</span>}
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={isLoading}>
              Bayar Sekarang <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}

// Inline SVGs for payment method logos
function QrisLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 65 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Left Finder */}
      <path d="M2 3h6v6H2V3zm1.5 1.5v3h3v-3h-3z" />
      <rect x="4" y="5" width="2" height="2" rx="0.2" />

      {/* Top Right Finder */}
      <path d="M12 3h6v6h-6V3zm1.5 1.5v3h3v-3h-3z" />
      <rect x="14" y="5" width="2" height="2" rx="0.2" />

      {/* Bottom Left Finder */}
      <path d="M2 12h6v6H2v-6zm1.5 1.5v3h3v-3h-3z" />
      <rect x="4" y="14" width="2" height="2" rx="0.2" />

      {/* QR Pixels */}
      <rect x="10" y="5" width="1" height="2" />
      <rect x="9" y="8" width="2" height="1" />
      <rect x="9" y="12" width="2" height="2" />
      <rect x="13" y="12" width="1" height="2" />
      <rect x="16" y="12" width="2" height="1" />
      <rect x="12" y="15" width="2" height="2" />
      <rect x="15" y="15" width="3" height="1" />
      <rect x="9" y="16" width="2" height="2" />

      {/* Text QRIS */}
      <text x="23" y="17" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="15" letterSpacing="-0.3">
        QRIS
      </text>
    </svg>
  );
}

function GopayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 55 20" fill="currentColor" className={className}>
      <text x="50%" y="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="17" letterSpacing="-0.8">go<tspan fill="#00AED6">pay</tspan></text>
    </svg>
  );
}

function BcaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 45 20" fill="currentColor" className={className}>
      <text x="50%" y="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontStyle="italic" fontSize="18" letterSpacing="-0.8" fill="#005BAA">BCA</text>
    </svg>
  );
}

function BniLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 45 20" fill="currentColor" className={className}>
      <text x="50%" y="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="18" letterSpacing="-0.5" fill="#E77228">BNI</text>
    </svg>
  );
}

function BriLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 45 20" fill="currentColor" className={className}>
      <text x="50%" y="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="18" letterSpacing="-0.8" fill="#005BAA">BRI</text>
    </svg>
  );
}

function MandiriLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 20" fill="currentColor" className={className}>
      <text x="50%" y="15" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontStyle="italic" fontSize="16" letterSpacing="-0.8" fill="#F5A623">mandırı</text>
    </svg>
  );
}

function renderPaymentLogo(id: string) {
  const className = "w-full h-auto max-h-6 text-text-primary";
  switch (id) {
    case "qris":
      return <QrisLogo className={className} />;
    case "gopay":
      return <GopayLogo className={className} />;
    case "bca_va":
      return <BcaLogo className={className} />;
    case "bni_va":
      return <BniLogo className={className} />;
    case "bri_va":
      return <BriLogo className={className} />;
    case "mandiri_va":
      return <MandiriLogo className={className} />;
    default:
      return null;
  }
}
