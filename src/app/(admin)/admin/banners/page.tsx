import React from "react";
import { BannerListManager } from "@/features/admin/components/banner-list-manager";

export default async function AdminBannersPage() {
  const { prisma } = await import("@/lib/prisma");

  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Kelola Banner</h1>
        <p className="text-xs text-text-secondary mt-1">
          Atur banner promosi berputar (carousel slider) yang muncul di halaman utama beranda website.
        </p>
      </div>

      <BannerListManager initialBanners={banners} />
    </div>
  );
}
