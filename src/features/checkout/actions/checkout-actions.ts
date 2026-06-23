"use server";

import { prisma } from "@/lib/prisma";
import { getMidtransSnap } from "@/lib/midtrans";
import { generateInvoiceNumber } from "@/lib/utils";

// ponytail: demo mode when explicitly enabled OR no real Midtrans key is set.
// Covers the portfolio deploy so visitors can run a full transaction without a gateway.
function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  const key = process.env.MIDTRANS_SERVER_KEY;
  return !key || key === "SB-Mid-server-sandbox-key" || key === "your-midtrans-server-key";
}

interface CheckoutInput {
  gameId: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  gameAccountInfo: Record<string, string>;
  promoCode?: string;
}

export async function createCheckoutOrder(input: CheckoutInput) {
  try {
    const {
      gameId,
      productId,
      customerName,
      customerEmail,
      customerPhone,
      gameAccountInfo,
      promoCode,
    } = input;

    // 1. Basic validation
    if (!gameId || !productId || !customerName || !customerEmail || !customerPhone || !gameAccountInfo) {
      return { success: false, error: "Semua data transaksi wajib diisi." };
    }

    // 2. Fetch Game and Product
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!game || !game.isActive) {
      return { success: false, error: "Game tidak ditemukan atau sedang tidak aktif." };
    }

    if (!product || !product.isActive || product.gameId !== game.id) {
      return { success: false, error: "Produk nominal top up tidak ditemukan." };
    }

    // 3. Process Account Info Validation
    // Required fields are stored as comma-separated values (e.g. "userId,serverId")
    const required = game.requiredFields.split(",");
    for (const field of required) {
      if (!gameAccountInfo[field] || gameAccountInfo[field].trim() === "") {
        return { success: false, error: `Kolom ${field} wajib diisi.` };
      }
    }

    // 4. Calculate Price & Promos
    let finalAmount = product.price;
    let discountApplied = 0;
    let appliedPromoId = null;

    if (promoCode && promoCode.trim() !== "") {
      const promo = await prisma.promo.findUnique({
        where: { code: promoCode.toUpperCase() },
      });

      if (promo && promo.isActive) {
        const now = new Date();
        const startValid = !promo.startDate || now >= promo.startDate;
        const endValid = !promo.endDate || now <= promo.endDate;
        const limitValid = !promo.usageLimit || promo.usageCount < promo.usageLimit;

        if (startValid && endValid && limitValid && finalAmount >= promo.minPurchase) {
          if (promo.type === "FIXED") {
            discountApplied = promo.value;
          } else if (promo.type === "PERCENTAGE") {
            discountApplied = Math.floor((finalAmount * promo.value) / 100);
            if (promo.maxDiscount && discountApplied > promo.maxDiscount) {
              discountApplied = promo.maxDiscount;
            }
          }

          finalAmount = Math.max(0, finalAmount - discountApplied);
          appliedPromoId = promo.id;
        }
      }
    }

    // 5. Generate unique invoice number
    const invoiceNumber = generateInvoiceNumber();

    // 6. Midtrans Transaction parameters
    const parameter = {
      transaction_details: {
        order_id: invoiceNumber,
        gross_amount: finalAmount,
      },
      item_details: [
        {
          id: product.id,
          price: finalAmount,
          quantity: 1,
          name: `${game.name} - ${product.name}`,
        },
      ],
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      // Restrict payment types to common options in Indonesia
      enabled_payments: [
        "credit_card",
        "gopay",
        "shopeepay",
        "other_qris",
        "bca_va",
        "bni_va",
        "bri_va",
        "echannel", // Mandiri VA
        "permata_va",
      ],
      credit_card: {
        secure: true,
      },
    };

    let snapToken = "";
    let redirectUrl = "";

    if (isDemoMode()) {
      // ponytail: portfolio/demo deploy has no real gateway — issue a demo token
      // so anyone can complete the flow. completeDemoPayment marks it paid.
      snapToken = `demo-${Date.now()}`;
      redirectUrl = "";
    } else {
      try {
        const transaction = await getMidtransSnap().createTransaction(parameter);
        snapToken = transaction.token;
        redirectUrl = transaction.redirect_url;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Error creating Midtrans transaction:", msg);
        return { success: false, error: "Gagal menghubungkan ke gateway pembayaran. Silakan coba beberapa saat lagi." };
      }
    }

    // 7. Create Order + increment promo usage in an atomic transaction
    const [order] = await prisma.$transaction(async (tx) => {
      if (appliedPromoId) {
        // Atomic check-and-increment: only updates if usage is still under limit
        const updated = await tx.$executeRawUnsafe(
          `UPDATE "Promo" SET "usageCount" = "usageCount" + 1 WHERE id = $1 AND "isActive" = true AND ("usageLimit" IS NULL OR "usageCount" < "usageLimit")`,
          appliedPromoId
        );
        if (updated === 0) {
          throw new Error("Kuota penggunaan promo sudah habis.");
        }
      }

      // The live DB uses uuid PKs (gen_random_uuid()) while the Prisma schema
      // declares cuid(), so a typed create() inserts an invalid uuid. Insert via
      // raw SQL and let the DB fill id/createdAt/updatedAt.
      const rows = await tx.$queryRaw<{ id: string }[]>`
        INSERT INTO "Order" (
          "invoiceNumber", "gameId", "productId", "customerName", "customerEmail",
          "customerPhone", "gameAccountInfo", "amount", "discount", "status",
          "midtransTransactionId", "midtransSnapToken", "midtransResponse"
        ) VALUES (
          ${invoiceNumber}, ${game.id}::uuid, ${product.id}::uuid, ${customerName}, ${customerEmail},
          ${customerPhone}, ${JSON.stringify(gameAccountInfo)}, ${finalAmount}, ${discountApplied}, 'PENDING',
          ${invoiceNumber}, ${snapToken}, ${JSON.stringify({ token: snapToken, redirect_url: redirectUrl })}
        ) RETURNING "id"`;

      return [rows[0]];
    });

    return {
      success: true,
      token: snapToken,
      invoiceNumber,
      orderId: order.id,
    };
  } catch (error: unknown) {
    console.error("Checkout action failed:", error);
    return { success: false, error: "Gagal membuat transaksi. Silakan coba beberapa saat lagi." };
  }
}

/**
 * Marks a DEMO order as paid. Public (no auth) on purpose so portfolio visitors
 * can finish the flow — but it only ever touches orders whose token marks them
 * as demo and that are still PENDING. Real Midtrans orders are never affected.
 */
export async function completeDemoPayment(orderId: string) {
  try {
    if (!orderId) return { success: false, error: "Order tidak valid." };

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { success: false, error: "Transaksi tidak ditemukan." };

    const token = order.midtransSnapToken ?? "";
    const isDemoOrder = !token || token.startsWith("demo-") || token.startsWith("mock-");
    if (!isDemoOrder) {
      return { success: false, error: "Transaksi ini bukan transaksi demo." };
    }
    if (order.status !== "PENDING") {
      return { success: false, error: "Transaksi sudah diproses." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "SUCCESS", paidAt: new Date(), completedAt: new Date(), paymentMethod: "Demo" },
    });

    return { success: true };
  } catch (error) {
    console.error("Demo payment completion failed:", error);
    return { success: false, error: "Gagal menyelesaikan transaksi demo." };
  }
}

/**
 * Validates a promo code and returns the discount amount
 */
export async function validatePromoCode(code: string, minPurchaseAmount: number) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo || !promo.isActive) {
      return { success: false, error: "Kode promo tidak valid atau sudah tidak aktif." };
    }

    const now = new Date();
    if (promo.startDate && now < promo.startDate) {
      return { success: false, error: "Promo belum dimulai." };
    }
    if (promo.endDate && now > promo.endDate) {
      return { success: false, error: "Promo sudah berakhir." };
    }
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return { success: false, error: "Kuota penggunaan promo sudah habis." };
    }
    if (minPurchaseAmount < promo.minPurchase) {
      return { success: false, error: `Minimum pembelian untuk promo ini adalah Rp ${promo.minPurchase.toLocaleString("id-ID")}.` };
    }

    return {
      success: true,
      promo: {
        id: promo.id,
        code: promo.code,
        title: promo.title,
        type: promo.type,
        value: promo.value,
        maxDiscount: promo.maxDiscount,
      },
    };
  } catch (error) {
    console.error("Promo validation failed:", error);
    return { success: false, error: "Gagal memvalidasi kode promo." };
  }
}
