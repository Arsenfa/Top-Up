// Non-destructive catalog sync: ensures every product tier from games-data.ts
// exists for each game. Adds what's missing, never deletes.
// Safe to run against production — orders, users, banners are untouched.
//
// The live DB uses uuid PKs with gen_random_uuid() defaults, so we insert via
// raw SQL and let the DB fill id/createdAt/updatedAt rather than Prisma's cuid.
//
//   npx tsx prisma/sync-products.mts
import { PrismaClient } from "@prisma/client";
import { gamesData } from "./games-data";

const prisma = new PrismaClient();

async function main() {
  for (const { products, slug } of gamesData) {
    const game = await prisma.game.findUnique({ where: { slug }, select: { id: true } });
    if (!game) {
      console.log(`${slug.padEnd(20)} (game tidak ada, dilewati)`);
      continue;
    }

    const existing = await prisma.product.findMany({
      where: { gameId: game.id },
      select: { name: true },
    });
    const existingNames = new Set(existing.map((p) => p.name));
    const missing = products.filter((p) => !existingNames.has(p.name));

    for (const p of missing) {
      await prisma.$executeRaw`
        INSERT INTO "Product" ("gameId", "name", "price", "originalPrice")
        VALUES (${game.id}::uuid, ${p.name}, ${p.price}, ${p.originalPrice ?? null})`;
    }
    console.log(`${slug.padEnd(20)} +${missing.length} produk baru (total katalog ${products.length})`);
  }
  console.log("Sync selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
