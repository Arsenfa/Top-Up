"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ConfigInput {
  key: string;
  value: string;
}

export async function updateSiteConfigs(configs: ConfigInput[]) {
  try {
    for (const config of configs) {
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: { key: config.key, value: config.value, description: `Pengaturan ${config.key}` },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update site configs:", error);
    return { success: false, error: "Gagal memperbarui pengaturan situs." };
  }
}
