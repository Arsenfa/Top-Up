import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://topupku-app.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/cek-order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  let gamePages: MetadataRoute.Sitemap = [];

  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    gamePages = games.map((game) => ({
      url: `${BASE_URL}/games/${game.slug}`,
      lastModified: game.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB might not be reachable at build time — skip game pages
  }

  return [...staticPages, ...gamePages];
}
