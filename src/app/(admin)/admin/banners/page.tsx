import React from "react";
import { prisma } from "@/lib/prisma";
import { BannerListManager } from "@/features/admin/components/banner-list-manager";

export const revalidate = 0; // Dynamic rendering for admin banners

export default async function AdminBannersPage() {
  // Fetch banners
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
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
