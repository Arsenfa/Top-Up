"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleBannerStatus(bannerId: string, value: boolean) {
  try {
    await prisma.banner.update({
      where: { id: bannerId },
      data: { isActive: value },
    });
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle banner:", error);
    return { success: false, error: "Gagal merubah status banner." };
  }
}

export async function deleteBanner(bannerId: string) {
  try {
    await prisma.banner.delete({ where: { id: bannerId } });
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return { success: false, error: "Gagal menghapus banner." };
  }
}

interface UpsertBannerInput {
  id?: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export async function upsertBanner(input: UpsertBannerInput) {
  try {
    const { id, ...data } = input;

    if (!data.title || !data.imageUrl) {
      return { success: false, error: "Judul dan link gambar banner wajib diisi." };
    }

    if (id) {
      await prisma.banner.update({ where: { id }, data });
    } else {
      await prisma.banner.create({ data });
    }

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to upsert banner:", error);
    return { success: false, error: "Gagal menyimpan data banner." };
  }
}
