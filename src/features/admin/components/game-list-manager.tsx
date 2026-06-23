"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toggleGameStatus, deleteGame, upsertGame } from "../actions/admin-game-actions";

interface GameItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  iconUrl: string | null;
  publisher: string;
  category: string;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  requiredFields: string;
}

interface GameListManagerProps {
  initialGames: GameItem[];
}

export function GameListManager({ initialGames }: GameListManagerProps) {
  const { success, error } = useToast();
  const [games, setGames] = useState<GameItem[]>(initialGames);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    iconUrl: "",
    publisher: "",
    category: "MOBA",
    isFeatured: false,
    isPopular: false,
    isActive: true,
    requiredFields: "userId",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingGame(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      iconUrl: "",
      publisher: "",
      category: "MOBA",
      isFeatured: false,
      isPopular: false,
      isActive: true,
      requiredFields: "userId",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (game: GameItem) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      slug: game.slug,
      description: game.description ?? "",
      imageUrl: game.imageUrl,
      iconUrl: game.iconUrl ?? "",
      publisher: game.publisher,
      category: game.category,
      isFeatured: game.isFeatured,
      isPopular: game.isPopular,
      isActive: game.isActive,
      requiredFields: game.requiredFields,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Auto-slugify name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleToggle = async (gameId: string, field: "isActive" | "isPopular" | "isFeatured", currentValue: boolean) => {
    setActionLoadingId(`${gameId}-${field}`);
    const result = await toggleGameStatus(gameId, field, !currentValue);
    setActionLoadingId(null);

    if (result.success) {
      success("Status game berhasil diubah!");
      setGames((prev) =>
        prev.map((g) => (g.id === gameId ? { ...g, [field]: !currentValue } : g))
      );
    } else {
      error(result.error || "Gagal mengubah status game.");
    }
  };

  const handleDelete = async (gameId: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus game "${name}" beserta seluruh produk di dalamnya?`)) {
      return;
    }

    setActionLoadingId(`${gameId}-delete`);
    const result = await deleteGame(gameId);
    setActionLoadingId(null);

    if (result.success) {
      success(`Game "${name}" berhasil dihapus.`);
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } else {
      error(result.error || "Gagal menghapus game.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama game wajib diisi.";
    if (!formData.slug.trim()) errors.slug = "Slug URL wajib diisi.";
    if (!formData.description.trim()) errors.description = "Deskripsi wajib diisi.";
    if (!formData.imageUrl.trim()) errors.imageUrl = "Link gambar banner wajib diisi.";
    if (!formData.publisher.trim()) errors.publisher = "Penerbit/Publisher wajib diisi.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormLoading(true);
    const result = await upsertGame(
      editingGame ? { ...formData, id: editingGame.id } : formData
    );
    setFormLoading(false);

    if (result.success) {
      success(editingGame ? "Data game berhasil diperbarui!" : "Game baru berhasil ditambahkan!");
      setIsModalOpen(false);
      window.location.reload(); // Quick refresh to load initial page props
    } else {
      error(result.error || "Gagal menyimpan data game.");
    }
  };

  // Filter list
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Action Toolbar */}
      <div className="p-5 rounded-2xl border border-border-color/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <Input
            id="game-search"
            placeholder="Cari game atau publisher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-text-secondary/60" />}
            className="w-full sm:w-64"
          />
          {/* Category filter */}
          <Select
            id="cat-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-40 py-2.5"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MOBA">MOBA</option>
            <option value="FPS">FPS / Shooter</option>
            <option value="RPG">RPG / Fantasy</option>
          </Select>
        </div>

        <Button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Game
        </Button>
      </div>

      {/* Table grid */}
      {filteredGames.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead>Publisher / Kategori</TableHead>
              <TableHead>Tipe Form ID</TableHead>
              <TableHead className="text-center">Aktif</TableHead>
              <TableHead className="text-center">Populer</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGames.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg-tertiary border border-border-color/40 flex-shrink-0 relative">
                      <Image src={game.imageUrl} alt={game.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-text-primary">{game.name}</span>
                      <span className="text-[10px] text-text-secondary">/{game.slug}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{game.publisher}</span>
                    <span className="text-[10px] text-text-secondary font-semibold uppercase">{game.category}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{game.requiredFields}</TableCell>
                
                {/* Booleans status toggles */}
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggle(game.id, "isActive", game.isActive)}
                    disabled={actionLoadingId === `${game.id}-isActive`}
                    className="cursor-pointer"
                  >
                    {game.isActive ? (
                      <Badge variant="success" className="gap-1"><Eye className="w-3 h-3" /> Ya</Badge>
                    ) : (
                      <Badge variant="neutral" className="gap-1"><EyeOff className="w-3 h-3" /> Tidak</Badge>
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggle(game.id, "isPopular", game.isPopular)}
                    disabled={actionLoadingId === `${game.id}-isPopular`}
                    className="cursor-pointer"
                  >
                    {game.isPopular ? (
                      <Badge variant="primary" className="gap-1"><Award className="w-3 h-3" /> Ya</Badge>
                    ) : (
                      <Badge variant="neutral" className="gap-1">Tidak</Badge>
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggle(game.id, "isFeatured", game.isFeatured)}
                    disabled={actionLoadingId === `${game.id}-isFeatured`}
                    className="cursor-pointer"
                  >
                    {game.isFeatured ? (
                      <Badge variant="warning" className="gap-1"><Star className="w-3 h-3" /> Ya</Badge>
                    ) : (
                      <Badge variant="neutral" className="gap-1">Tidak</Badge>
                    )}
                  </button>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenEditModal(game)}
                      className="p-2 border-none bg-bg-tertiary hover:bg-bg-tertiary/75"
                    >
                      <Edit className="w-3.5 h-3.5 text-accent" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(game.id, game.name)}
                      disabled={actionLoadingId === `${game.id}-delete`}
                      className="p-2 bg-danger/10 text-danger hover:bg-danger/25 border-none shadow-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="rounded-2xl p-16 text-center border border-border-color/60">
          <p className="text-text-secondary text-sm">Belum ada game terdaftar yang cocok.</p>
        </div>
      )}

      {/* Add / Edit Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGame ? "Edit Game" : "Tambah Game Baru"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleFormSubmit} isLoading={formLoading}>
              Simpan Game
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="name"
              label="Nama Game"
              placeholder="Contoh: Mobile Legends"
              value={formData.name}
              onChange={handleNameChange}
              error={formErrors.name}
            />
            <Input
              id="slug"
              label="Slug URL"
              placeholder="Contoh: mobile-legends"
              value={formData.slug}
              onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
              error={formErrors.slug}
            />
          </div>

          <Input
            id="desc"
            label="Deskripsi Game"
            placeholder="Masukkan deskripsi singkat petunjuk top up game..."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            error={formErrors.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="image"
              label="Link Gambar Banner"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
              error={formErrors.imageUrl}
            />
            <Input
              id="icon"
              label="Link Gambar Icon (Opsional)"
              placeholder="https://images.unsplash.com/..."
              value={formData.iconUrl}
              onChange={(e) => setFormData((p) => ({ ...p, iconUrl: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="pub"
              label="Penerbit / Publisher"
              placeholder="Contoh: Moonton"
              value={formData.publisher}
              onChange={(e) => setFormData((p) => ({ ...p, publisher: e.target.value }))}
              error={formErrors.publisher}
            />
            <Select
              id="category"
              label="Kategori Game"
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
            >
              <option value="MOBA">MOBA</option>
              <option value="FPS">FPS / Shooter</option>
              <option value="RPG">RPG / Fantasy</option>
            </Select>
          </div>

          <Input
            id="fields"
            label="Kolom Form Validasi ID (Koma sebagai pemisah)"
            placeholder="Contoh: userId,serverId atau userId saja"
            value={formData.requiredFields}
            onChange={(e) => setFormData((p) => ({ ...p, requiredFields: e.target.value }))}
            helperText="Gunakan 'userId' untuk player id saja. Atau 'userId,serverId' jika butuh server."
          />

          <div className="flex gap-6 mt-2 pt-2 border-t border-border-color/40">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 rounded accent-accent"
              />
              Tampilkan / Aktifkan Game
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData((p) => ({ ...p, isPopular: e.target.checked }))}
                className="w-4 h-4 rounded accent-accent"
              />
              Tandai Populer
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                className="w-4 h-4 rounded accent-accent"
              />
              Tandai Unggulan (Featured)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
