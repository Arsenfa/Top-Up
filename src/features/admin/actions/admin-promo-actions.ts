"use server";

import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function togglePromoStatus(promoId: string, value: boolean) {
  const auth = await requireAdmin(await getSession());
  if (!auth.success) return auth;
  try {
    await prisma.promo.update({
      where: { id: promoId },
      data: { isActive: value },
    });
    revalidatePath("/admin/promos");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle promo:", error);
    return { success: false, error: "Gagal merubah status promo." };
  }
}

export async function deletePromo(promoId: string) {
  const auth = await requireAdmin(await getSession());
  if (!auth.success) return auth;
  try {
    await prisma.promo.delete({ where: { id: promoId } });
    revalidatePath("/admin/promos");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete promo:", error);
    return { success: false, error: "Gagal menghapus promo." };
  }
}

interface UpsertPromoInput {
  id?: string;
  code: string;
  title: string | null;
  description: string;
  type: string;
  value: number;
  minPurchase: number;
  maxDiscount?: number | null;
  isActive: boolean;
}

export async function upsertPromo(input: UpsertPromoInput) {
  const auth = await requireAdmin(await getSession());
  if (!auth.success) return auth;
  try {
    const { id, ...data } = input;
    data.code = data.code.toUpperCase();

    if (!data.code || !data.title || !data.description || data.value <= 0) {
      return { success: false, error: "Kode, judul, deskripsi, dan nilai wajib diisi." };
    }

    if (id) {
      await prisma.promo.update({ where: { id }, data });
    } else {
      const existing = await prisma.promo.findUnique({ where: { code: data.code } });
      if (existing) {
        return { success: false, error: "Kode promo ini sudah terdaftar." };
      }
      // ponytail: default date range = now until next year
      const now = new Date();
      await prisma.promo.create({
        data: {
          ...data,
          startDate: now,
          endDate: new Date(now.getFullYear() + 1, 11, 31),
        },
      });
    }

    revalidatePath("/admin/promos");
    return { success: true };
  } catch (error) {
    console.error("Failed to upsert promo:", error);
    return { success: false, error: "Gagal menyimpan data promo." };
  }
}
