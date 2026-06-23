export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { GameCard } from "@/components/shared/game-card";
import { Input } from "@/components/ui/input";
import { Search, Gamepad, ArrowUpDown } from "lucide-react";

export const metadata = {
  title: "Daftar Game - TopUpKu",
  description: "Cari game favorit Anda dan lakukan top up diamond atau voucher instan dengan harga terjangkau.",
};

interface GamesPageProps {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "ALL";
  const sort = params.sort || "name_asc";

  const { prisma } = await import("@/lib/prisma");

  const whereClause: Prisma.GameWhereInput = { isActive: true };
  if (q.trim() !== "") {
    whereClause.OR = [
      { name: { contains: q } },
      { publisher: { contains: q } },
    ];
  }
  if (category !== "ALL") whereClause.category = category;

  let orderByClause: Prisma.GameOrderByWithRelationInput = { sortOrder: "asc" };
  if (sort === "name_asc") orderByClause = { name: "asc" };
  else if (sort === "name_desc") orderByClause = { name: "desc" };

  const games = await prisma.game.findMany({ where: whereClause, orderBy: orderByClause });
  const categories = ["ALL", "MOBA", "FPS", "RPG"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
          Semua <span className="text-accent">Game</span>
        </h1>
        <p className="text-sm text-text-muted leading-relaxed max-w-xl">
          Temukan game favorit Anda dan lakukan top up saldo secara aman.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-bg-secondary border border-border-color flex flex-col md:flex-row items-center justify-between gap-4">
        <form method="GET" action="/games" className="w-full md:max-w-xs relative flex items-center">
          <Input id="q" name="q" placeholder="Cari game..." defaultValue={q} icon={<Search className="w-4 h-4 text-text-muted" />} className="w-full py-2.5" />
          {category !== "ALL" && <input type="hidden" name="category" value={category} />}
          {sort !== "name_asc" && <input type="hidden" name="sort" value={sort} />}
        </form>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex bg-bg-tertiary p-1 border border-border-color rounded-lg text-xs font-medium overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isActive = category === cat;
              const queryParams = new URLSearchParams();
              if (q) queryParams.set("q", q);
              if (cat !== "ALL") queryParams.set("category", cat);
              if (sort !== "name_asc") queryParams.set("sort", sort);
              const url = `/games?${queryParams.toString()}`;
              return (
                <Link key={cat} href={url} className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${isActive ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"}`}>
                  {cat === "ALL" ? "Semua" : cat}
                </Link>
              );
            })}
          </div>

          <div className="flex bg-bg-tertiary border border-border-color rounded-lg p-1 items-center gap-1.5 text-xs font-medium">
            <span className="text-text-secondary pl-2 pr-1 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urutan:
            </span>
            <div className="flex">
              {[
                { id: "name_asc", label: "A-Z" },
                { id: "name_desc", label: "Z-A" },
              ].map((s) => {
                const isActive = sort === s.id;
                const queryParams = new URLSearchParams();
                if (q) queryParams.set("q", q);
                if (category !== "ALL") queryParams.set("category", category);
                if (s.id !== "name_asc") queryParams.set("sort", s.id);
                const url = `/games?${queryParams.toString()}`;
                return (
                  <Link key={s.id} href={url} className={`px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${isActive ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"}`}>
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-16 text-center border border-border-color bg-bg-secondary flex flex-col items-center justify-center">
          <Gamepad className="w-12 h-12 text-text-muted mb-4" />
          <h3 className="font-bold text-base text-text-primary mb-1">Game Tidak Ditemukan</h3>
          <p className="text-sm text-text-muted max-w-xs leading-relaxed">
            Tidak ada game yang cocok dengan kriteria pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
}
