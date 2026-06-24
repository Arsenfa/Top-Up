import React from "react";
import { GameListManager } from "@/features/admin/components/game-list-manager";

export default async function AdminGamesPage() {
  const { prisma } = await import("@/lib/prisma");

  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Kelola Game</h1>
        <p className="text-xs text-text-secondary mt-1">
          Tambah game baru, ubah rincian deskripsi, dan atur game unggulan / populer yang tampil di beranda.
        </p>
      </div>

      <GameListManager key={games.length} initialGames={games} />
    </div>
  );
}
