import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import * as bcrypt from "bcryptjs";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

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
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  const admin = await prisma.user.create({
    data: {
      name: "Admin TopUpKu",
      email: "admin@topupku.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user created: ${admin.email} / admin123`);

  // Create Site Configurations
  await prisma.siteConfig.createMany({
    data: [
      { key: "site_name", value: "TopUpKu", description: "Nama website" },
      { key: "site_description", value: "Layanan Top Up Game Tercepat, Termurah, Terpercaya di Indonesia.", description: "Deskripsi SEO website" },
      { key: "contact_whatsapp", value: "6281234567890", description: "Nomor WhatsApp CS" },
      { key: "contact_email", value: "support@topupku.com", description: "Email Support CS" },
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
  await prisma.promo.createMany({
    data: [
      {
        code: "HEMATNEW",
        title: "Promo Pengguna Baru",
        description: "Diskon Rp5.000 dengan minimal pembelian Rp20.000",
        type: "FIXED",
        value: 5000,
        minPurchase: 20000,
        isActive: true,
      },
      {
        code: "SUPERML",
        title: "Pesta Diamond MLBB",
        description: "Diskon 10% maksimum Rp15.000 khusus game Mobile Legends",
        type: "PERCENTAGE",
        value: 10,
        minPurchase: 30000,
        maxDiscount: 15000,
        isActive: true,
      },
    ],
  });
  console.log("Promos created.");

  // Create Games and Products
  const gamesData = [
    {
      name: "Mobile Legends: Bang Bang",
      slug: "mobile-legends",
      description: "Top Up Diamond Mobile Legends murah, aman, cepat, and legal 100%. Cukup masukkan User ID & Server ID Anda, pilih nominal, dan bayar!",
      imageUrl: "/games/mobile-legends.jpg",
      iconUrl: "/games/mobile-legends.jpg",
      publisher: "Moonton",
      category: "MOBA",
      isFeatured: true,
      isPopular: true,
      requiredFields: "userId,serverId",
      products: [
        { name: "5 Diamonds", price: 1579, originalPrice: 2000 },
        { name: "12 Diamonds", price: 3688, originalPrice: 4500 },
        { name: "19 Diamonds", price: 5797, originalPrice: 7000 },
        { name: "28 Diamonds", price: 7906, originalPrice: 10000 },
        { name: "44 Diamonds", price: 12124, originalPrice: 15000 },
        { name: "59 Diamonds", price: 15813, originalPrice: 20000 },
        { name: "86 Diamonds", price: 22139, originalPrice: 25000 },
        { name: "172 Diamonds", price: 43219, originalPrice: 50000 },
        { name: "257 Diamonds", price: 63769, originalPrice: 75000 },
        { name: "344 Diamonds", price: 84849, originalPrice: 100000 },
        { name: "514 Diamonds", price: 126479, originalPrice: 150000 },
        { name: "706 Diamonds", price: 173229, originalPrice: 200000 },
        { name: "1412 Diamonds", price: 343339, originalPrice: 400000 },
      ],
    },
    {
      name: "Free Fire",
      slug: "free-fire",
      description: "Beli Diamond Free Fire murah dan cepat. Proses instan 24 jam. Masukkan Player ID Free Fire Anda, pilih nominal Diamond, dan selesaikan pembayaran!",
      imageUrl: "/games/free-fire.jpg",
      iconUrl: "/games/free-fire.jpg",
      publisher: "Garena",
      category: "FPS",
      isFeatured: true,
      isPopular: true,
      requiredFields: "userId",
      products: [
        { name: "5 Diamonds", price: 1000, originalPrice: 1500 },
        { name: "12 Diamonds", price: 2000, originalPrice: 3000 },
        { name: "50 Diamonds", price: 8000, originalPrice: 10000 },
        { name: "70 Diamonds", price: 10000, originalPrice: 13000 },
        { name: "140 Diamonds", price: 19000, originalPrice: 25000 },
        { name: "355 Diamonds", price: 48000, originalPrice: 60000 },
        { name: "720 Diamonds", price: 95000, originalPrice: 120000 },
        { name: "1450 Diamonds", price: 189000, originalPrice: 240000 },
      ],
    },
    {
      name: "Genshin Impact",
      slug: "genshin-impact",
      description: "Top Up Genesis Crystals Genshin Impact instan. Masukkan UID & Server, pilih nominal, pilih metode pembayaran, dan Crystals langsung masuk!",
      imageUrl: "/games/genshin-impact.jpg",
      iconUrl: "/games/genshin-impact.jpg",
      publisher: "COGNOSPHERE",
      category: "RPG",
      isFeatured: true,
      isPopular: true,
      requiredFields: "userId,serverId",
      products: [
        { name: "60 Genesis Crystals", price: 16000, originalPrice: 17500 },
        { name: "300 Genesis Crystals", price: 79000, originalPrice: 85000 },
        { name: "980 Genesis Crystals", price: 249000, originalPrice: 265000 },
        { name: "1980 Genesis Crystals", price: 479000, originalPrice: 510000 },
        { name: "3280 Genesis Crystals", price: 799000, originalPrice: 850000 },
        { name: "6480 Genesis Crystals", price: 1599000, originalPrice: 1700000 },
      ],
    },
    {
      name: "PUBG Mobile",
      slug: "pubg-mobile",
      description: "Beli UC PUBG Mobile murah, cepat, dan terpercaya. Cukup masukkan Character ID Anda, pilih jumlah UC, lakukan pembayaran, dan UC langsung dikirim!",
      imageUrl: "/games/pubg-mobile.jpg",
      iconUrl: "/games/pubg-mobile.jpg",
      publisher: "Level Infinite",
      category: "FPS",
      isFeatured: false,
      isPopular: true,
      requiredFields: "userId",
      products: [
        { name: "60 UC", price: 14000, originalPrice: 16000 },
        { name: "325 UC", price: 70000, originalPrice: 80000 },
        { name: "660 UC", price: 140000, originalPrice: 160000 },
        { name: "1800 UC", price: 350000, originalPrice: 400000 },
        { name: "3850 UC", price: 700000, originalPrice: 800000 },
        { name: "8100 UC", price: 1400000, originalPrice: 1600000 },
      ],
    },
    {
      name: "Valorant",
      slug: "valorant",
      description: "Beli Valorant Points (VP) murah dan aman. Masukkan Riot ID + Tagline, pilih nominal VP, dan bayar lewat QRIS, e-wallet, atau bank transfer!",
      imageUrl: "/games/valorant.jpg",
      iconUrl: "/games/valorant.jpg",
      publisher: "Riot Games",
      category: "FPS",
      isFeatured: true,
      isPopular: true,
      requiredFields: "userId",
      products: [
        { name: "125 Valorant Points", price: 15000, originalPrice: 18000 },
        { name: "420 Valorant Points", price: 47000, originalPrice: 52000 },
        { name: "700 Valorant Points", price: 75000, originalPrice: 85000 },
        { name: "1375 Valorant Points", price: 140000, originalPrice: 155000 },
        { name: "2400 Valorant Points", price: 240000, originalPrice: 260000 },
        { name: "4000 Valorant Points", price: 390000, originalPrice: 420000 },
      ],
    },
    {
      name: "Honkai: Star Rail",
      slug: "honkai-star-rail",
      description: "Beli Oneiric Shards Honkai: Star Rail instan. Masukkan UID & Server, pilih nominal, dan bayar!",
      imageUrl: "/games/honkai-star-rail.jpg",
      iconUrl: "/games/honkai-star-rail.jpg",
      publisher: "COGNOSPHERE",
      category: "RPG",
      isFeatured: false,
      isPopular: false,
      requiredFields: "userId,serverId",
      products: [
        { name: "60 Oneiric Shards", price: 16000, originalPrice: 17500 },
        { name: "300 Oneiric Shards", price: 79000, originalPrice: 85000 },
        { name: "980 Oneiric Shards", price: 249000, originalPrice: 265000 },
        { name: "1980 Oneiric Shards", price: 479000, originalPrice: 510000 },
      ],
    },
    {
      name: "Call of Duty Mobile",
      slug: "call-of-duty-mobile",
      description: "Beli CP Call of Duty Mobile murah dan cepat. Masukkan OpenID Anda, pilih nominal CP, dan selesaikan transaksi!",
      imageUrl: "/games/call-of-duty-mobile.jpg",
      iconUrl: "/games/call-of-duty-mobile.jpg",
      publisher: "Garena",
      category: "FPS",
      isFeatured: false,
      isPopular: false,
      requiredFields: "userId",
      products: [
        { name: "80 CP", price: 15000, originalPrice: 17000 },
        { name: "240 CP", price: 45000, originalPrice: 50000 },
        { name: "480 CP", price: 85000, originalPrice: 95000 },
        { name: "960 CP", price: 170000, originalPrice: 190000 },
      ],
    },
    {
      name: "Arena of Valor",
      slug: "arena-of-valor",
      description: "Top Up Voucher Arena of Valor (AoV) aman dan cepat. Masukkan Player ID Anda, pilih nominal Voucher, dan bayar!",
      imageUrl: "/games/arena-of-valor.jpg",
      iconUrl: "/games/arena-of-valor.jpg",
      publisher: "Garena",
      category: "MOBA",
      isFeatured: false,
      isPopular: false,
      requiredFields: "userId",
      products: [
        { name: "20 Vouchers", price: 6000, originalPrice: 7500 },
        { name: "50 Vouchers", price: 14000, originalPrice: 17000 },
        { name: "100 Vouchers", price: 28000, originalPrice: 34000 },
        { name: "200 Vouchers", price: 56000, originalPrice: 65000 },
      ],
    },
  ];

  for (const gameData of gamesData) {
    const { products, ...gameFields } = gameData;
    const game = await prisma.game.create({
      data: {
        ...gameFields,
        products: {
          create: products.map((prod, index) => ({
            ...prod,
            sortOrder: index,
          })),
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
