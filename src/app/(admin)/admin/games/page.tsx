import React from "react";
import { prisma } from "@/lib/prisma";
import { GameListManager } from "@/features/admin/components/game-list-manager";

export const revalidate = 0; // Dynamic rendering for admin games management

export default async function AdminGamesPage() {
  // Fetch all games
  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">Kelola Game</h1>
        <p className="text-xs text-text-secondary mt-1">
          Tambah game baru, ubah rincian deskripsi, dan atur game unggulan / populer yang tampil di beranda.
        </p>
      </div>

      <GameListManager initialGames={games} />
    </div>
  );
}
