"use server";

import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const ALLOWED_CONFIG_KEYS = ["site_name", "site_description", "contact_whatsapp", "contact_email"];

interface ConfigInput {
  key: string;
  value: string;
}

export async function updateSiteConfigs(configs: ConfigInput[]) {
  const auth = await requireAdmin(await getSession());
  if (!auth.success) return auth;
  try {
    // Only allow whitelisted config keys
    const validConfigs = configs.filter((c) => ALLOWED_CONFIG_KEYS.includes(c.key));
    for (const config of validConfigs) {
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: { key: config.key, value: config.value },
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
