"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { User, ShieldCheck, Zap, DollarSign, Tag, Mail, Phone, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutOrder, validatePromoCode } from "../actions/checkout-actions";
import { formatCurrency } from "@/lib/utils";

// TypeScript declarations for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
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
  const { toast, success, error, warning } = useToast();

  // Form States
  const [accountInfo, setAccountInfo] = useState<Record<string, string>>({});
  const [selectedProductId, setSelectedProductId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");

  // Promo Calculation States
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);

  // Flow / Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Dynamic input fields based on game configuration
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

  // Get selected product price
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const basePrice = selectedProduct ? selectedProduct.price : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Apply promo code action
  const handleApplyPromo = async () => {
    if (!selectedProductId) {
      error("Silakan pilih nominal top up terlebih dahulu sebelum memasukkan kode promo.");
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
    success(`Kode promo ${promo.code} berhasil diterapkan! Hemat ${formatCurrency(disc)}.`);
  };

  // Clear Promo Code
  const handleClearPromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoCode("");
  };

  // Validate form fields
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate account fields
    requiredFields.forEach((field) => {
      if (!accountInfo[field] || !accountInfo[field].trim()) {
        errors[field] = `Kolom ini wajib diisi.`;
      }
    });

    // Validate product selection
    if (!selectedProductId) {
      errors.product = "Pilih salah satu nominal top up.";
    }

    // Validate customer contact
    if (!customerName.trim()) {
      errors.name = "Nama lengkap wajib diisi.";
    }
    if (!customerEmail.trim()) {
      errors.email = "Alamat email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      errors.email = "Format email tidak valid.";
    }
    if (!customerPhone.trim()) {
      errors.phone = "Nomor WhatsApp wajib diisi.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit checkout action
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error("Silakan lengkapi semua kolom form yang ditandai merah.");
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
      error(result.error || "Gagal memproses transaksi checkout.");
      return;
    }

    const { token, invoiceNumber } = result;

    // Trigger Midtrans Snap payment popup
    if (window.snap) {
      window.snap.pay(token, {
        onSuccess: (res) => {
          success("Pembayaran berhasil diverifikasi!");
          router.push(`/order/${invoiceNumber}?status=success`);
        },
        onPending: (res) => {
          warning("Menunggu penyelesaian pembayaran...");
          router.push(`/order/${invoiceNumber}?status=pending`);
        },
        onError: (res) => {
          error("Transaksi pembayaran gagal.");
          router.push(`/order/${invoiceNumber}?status=failed`);
        },
        onClose: () => {
          warning("Popup transaksi pembayaran ditutup.");
          router.push(`/order/${invoiceNumber}`);
        },
      });
    } else {
      // Mock fallback redirect to order details
      warning("Sistem pembayaran berjalan dalam mode simulasi.");
      router.push(`/order/${invoiceNumber}`);
    }
  };

  const paymentMethods = [
    {
      id: "qris",
      name: "QRIS (GoPay, OVO, Dana, LinkAja)",
      logo: "https://midtrans.com/assets/img/icon/qris.svg",
      tag: "Instan",
    },
    {
      id: "gopay",
      name: "GoPay / ShopeePay E-Wallet",
      logo: "https://midtrans.com/assets/img/icon/gopay.svg",
      tag: "Instan",
    },
    {
      id: "bca_va",
      name: "BCA Virtual Account",
      logo: "https://midtrans.com/assets/img/icon/bca.svg",
      tag: "Verifikasi Otomatis",
    },
    {
      id: "bni_va",
      name: "BNI Virtual Account",
      logo: "https://midtrans.com/assets/img/icon/bni.svg",
      tag: "Verifikasi Otomatis",
    },
    {
      id: "bri_va",
      name: "BRI Virtual Account",
      logo: "https://midtrans.com/assets/img/icon/bri.svg",
      tag: "Verifikasi Otomatis",
    },
    {
      id: "mandiri_va",
      name: "Mandiri Virtual Account",
      logo: "https://midtrans.com/assets/img/icon/mandiri.svg",
      tag: "Verifikasi Otomatis",
    },
  ];

  return (
    <>
      {/* Midtrans Snap JS Script Loader */}
      <Script
        src={`https://app.${
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "" : "sandbox."
        }midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <form onSubmit={handleCheckout} className="flex flex-col gap-6 w-full">
        {/* Step 1: Account Info */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent font-display text-sm">
                1
              </div>
              <h2 className="text-base font-extrabold text-text-primary">Masukkan Informasi Akun</h2>
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

        {/* Step 2: Product Selection */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent font-display text-sm">
                2
              </div>
              <h2 className="text-base font-extrabold text-text-primary">Pilih Nominal Top Up</h2>
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
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setAppliedPromo(null);
                      setDiscountAmount(0);
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center cursor-pointer relative h-28
                      ${
                        isSelected
                          ? "bg-accent/10 border-accent/60 ring-1 ring-accent"
                          : "bg-bg-secondary hover:bg-bg-tertiary/50 border-border-color"
                      }`}
                  >
                    {hasDiscount && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-danger/10 border border-danger/25 text-[8px] font-bold text-danger rounded uppercase tracking-wider">
                        Promo
                      </span>
                    )}
                    <span className="font-bold text-xs sm:text-sm text-text-primary line-clamp-1 mb-1.5">
                      {product.name}
                    </span>
                    <span className="text-xs font-semibold text-accent">
                      {formatCurrency(product.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] text-text-secondary/50 line-through mt-0.5">
                        {formatCurrency(product.originalPrice!)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {validationErrors.product && (
              <p className="text-xs text-danger font-medium mt-2">{validationErrors.product}</p>
            )}
          </CardBody>
        </Card>

        {/* Step 3: Payment Method */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent font-display text-sm">
                3
              </div>
              <h2 className="text-base font-extrabold text-text-primary">Pilih Metode Pembayaran</h2>
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
                  className={`flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all
                    ${
                      isSelected
                        ? "bg-accent/10 border-accent/60 ring-1 ring-accent"
                        : "bg-bg-secondary hover:bg-bg-tertiary/50 border-border-color"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 rounded-lg bg-white/5 border border-border-color/30 p-1 flex items-center justify-center overflow-hidden">
                      <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-text-primary">{method.name}</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5">{method.tag}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-primary">
                      {formatCurrency(finalPrice)}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0
                        ${isSelected ? "border-accent bg-accent" : "border-border-color bg-transparent"}`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </CardBody>
        </Card>

        {/* Step 4: Contact & Checkout */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent font-display text-sm">
                4
              </div>
              <h2 className="text-base font-extrabold text-text-primary">Data Kontak & Konfirmasi</h2>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="name"
                label="Nama Lengkap"
                placeholder="Contoh: Budi Santoso"
                icon={<User className="w-4 h-4" />}
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (validationErrors.name) setValidationErrors((prev) => ({ ...prev, name: "" }));
                }}
                error={validationErrors.name}
              />
              <Input
                id="email"
                type="email"
                label="Alamat Email"
                placeholder="Contoh: budi@gmail.com"
                icon={<Mail className="w-4 h-4" />}
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: "" }));
                }}
                error={validationErrors.email}
              />
            </div>
            <Input
              id="phone"
              label="Nomor WhatsApp"
              placeholder="Contoh: 08123456789"
              icon={<Phone className="w-4 h-4" />}
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                if (validationErrors.phone) setValidationErrors((prev) => ({ ...prev, phone: "" }));
              }}
              error={validationErrors.phone}
            />

            {/* Promo Code Input */}
            <div className="border-t border-border-color/60 pt-4 mt-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                Kode Promo (Opsional)
              </label>
              <div className="flex gap-2">
                <Input
                  id="promo"
                  placeholder="Masukkan kode promo (misal: HEMATNEW)..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={!!appliedPromo || !selectedProductId}
                  className="bg-bg-secondary"
                />
                {appliedPromo ? (
                  <Button type="button" variant="danger" onClick={handleClearPromo}>
                    Hapus
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleApplyPromo}
                    isLoading={promoLoading}
                    disabled={!selectedProductId || !promoCode}
                  >
                    Terapkan
                  </Button>
                )}
              </div>
              {appliedPromo && (
                <p className="text-xs text-success font-medium mt-1">
                  Promo berhasil diterapkan: {appliedPromo.title} (-{formatCurrency(discountAmount)})
                </p>
              )}
            </div>
          </CardBody>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs text-text-secondary font-medium">Total Pembayaran:</span>
              <span className="text-lg font-extrabold text-accent">{formatCurrency(finalPrice)}</span>
              {discountAmount > 0 && (
                <span className="text-[10px] text-success font-semibold mt-0.5">
                  Hemat {formatCurrency(discountAmount)}
                </span>
              )}
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={isLoading}>
              Bayar Sekarang
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
