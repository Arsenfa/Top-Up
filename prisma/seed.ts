import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { gamesData } from "./games-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean existing database records
  await prisma.siteConfig.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleaned.");

  // Create Admin User
  const seedPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(seedPassword, salt);

  const admin = await prisma.user.create({
    data: {
      name: "Admin TopUpKu",
      email: "admin@topupku.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // Create Site Configurations
  await prisma.siteConfig.createMany({
    data: [
      { key: "site_name", value: "TopUpKu" },
      { key: "site_description", value: "Layanan Top Up Game Tercepat, Termurah, Terpercaya di Indonesia." },
      { key: "contact_whatsapp", value: "6281234567890" },
      { key: "contact_email", value: "support@topupku.com" },
    ],
  });
  console.log("Site configurations created.");

  // Create Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Promo Hemat Awal Bulan!",
        subtitle: "Dapatkan diskon hingga 20% untuk Top Up Mobile Legends & Free Fire",
        imageUrl: "/banners/promo-hemat.jpg",
        linkUrl: "/games/mobile-legends",
        sortOrder: 1,
      },
      {
        title: "Genshin Impact Update 4.7",
        subtitle: "Genesis Crystals termurah hanya di TopUpKu, proses kilat 1 detik!",
        imageUrl: "/banners/genshin-promo.jpg",
        linkUrl: "/games/genshin-impact",
        sortOrder: 2,
      },
    ],
  });
  console.log("Banners created.");

  // Create Promos
  const now = new Date();
  await prisma.promo.createMany({
    data: [
      {
        code: "HEMATNEW",
        description: "Diskon Rp5.000 dengan minimal pembelian Rp20.000",
        type: "FIXED",
        value: 5000,
        minPurchase: 20000,
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear() + 1, 11, 31),
        isActive: true,
      },
      {
        code: "SUPERML",
        description: "Diskon 10% maksimum Rp15.000 khusus game Mobile Legends",
        type: "PERCENTAGE",
        value: 10,
        minPurchase: 30000,
        maxDiscount: 15000,
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear() + 1, 11, 31),
        isActive: true,
      },
    ],
  });
  console.log("Promos created.");

  // Create Games and Products

  for (const gameData of gamesData) {
    const { products, ...gameFields } = gameData;
    const game = await prisma.game.create({
      data: {
        ...gameFields,
        products: {
          create: products,
        },
      },
    });
    console.log(`Game created with products: ${game.name}`);
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
