import React from "react";
import { SettingsForm } from "@/features/admin/components/settings-form";

export default async function AdminSettingsPage() {
  const { prisma } = await import("@/lib/prisma");

  const dbConfigs = await prisma.siteConfig.findMany();

  const configs = {
    site_name: "TopUpKu",
    site_description: "Layanan Top Up Game Tercepat, Termurah, Terpercaya di Indonesia.",
    contact_whatsapp: "6281234567890",
    contact_email: "support@topupku.com",
  };

  dbConfigs.forEach((c) => {
    if (c.key in configs) {
      configs[c.key as keyof typeof configs] = c.value;
    }
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Pengaturan Situs</h1>
        <p className="text-xs text-text-secondary mt-1">
          Sesuaikan branding nama toko, info kontak layanan pelanggan, dan deskripsi SEO.
        </p>
      </div>

      <SettingsForm configs={configs} />
    </div>
  );
}
