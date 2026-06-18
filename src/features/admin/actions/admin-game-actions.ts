"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleGameStatus(gameId: string, field: "isActive" | "isPopular" | "isFeatured", value: boolean) {
  try {
    const updateData: any = {};
    updateData[field] = value;

    await prisma.game.update({
      where: { id: gameId },
      data: updateData,
    });

    revalidatePath("/admin/games");
    revalidatePath("/games");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(`Failed to toggle game ${field}:`, error);
    return { success: false, error: "Gagal memperbarui status game." };
  }
}

export async function deleteGame(gameId: string) {
  try {
    await prisma.game.delete({
      where: { id: gameId },
    });

    revalidatePath("/admin/games");
    revalidatePath("/games");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete game:", error);
    return { success: false, error: "Gagal menghapus game dari database." };
  }
}

interface UpsertGameInput {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconUrl: string;
  publisher: string;
  category: string;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  requiredFields: string;
}

export async function upsertGame(input: UpsertGameInput) {
  try {
    const { id, ...data } = input;

    if (!data.name || !data.slug || !data.description || !data.imageUrl || !data.publisher || !data.category) {
      return { success: false, error: "Semua kolom data game wajib diisi." };
    }

    if (id) {
      // Update
      await prisma.game.update({
        where: { id },
        data,
      });
    } else {
      // Create
      // Verify slug uniqueness
      const existing = await prisma.game.findUnique({ where: { slug: data.slug } });
      if (existing) {
        return { success: false, error: "Slug game sudah terdaftar. Gunakan slug lain." };
      }

      await prisma.game.create({
        data,
      });
    }

    revalidatePath("/admin/games");
    revalidatePath("/games");
    revalidatePath(`/games/${data.slug}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to upsert game:", error);
    return { success: false, error: "Gagal menyimpan data game ke database." };
  }
}
