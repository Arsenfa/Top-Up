"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductStatus(productId: string, field: "isActive" | "isPromo", value: boolean) {
  try {
    const updateData: Prisma.ProductUpdateInput = { [field]: value };

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    revalidatePath("/admin/products");
    revalidatePath("/games");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(`Failed to toggle product ${field}:`, error);
    return { success: false, error: "Gagal memperbarui status produk." };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/games");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Gagal menghapus produk dari database." };
  }
}

interface UpsertProductInput {
  id?: string;
  gameId: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description?: string | null;
  isActive: boolean;
  isPromo: boolean;
}

export async function upsertProduct(input: UpsertProductInput) {
  try {
    const { id, ...data } = input;

    if (!data.gameId || !data.name || data.price <= 0) {
      return { success: false, error: "Game, nama nominal, dan harga bernilai positif wajib diisi." };
    }

    if (id) {
      // Update
      await prisma.product.update({
        where: { id },
        data,
      });
    } else {
      // Create
      await prisma.product.create({
        data,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/games");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to upsert product:", error);
    return { success: false, error: "Gagal menyimpan data produk." };
  }
}
