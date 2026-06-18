"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Tag, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toggleProductStatus, deleteProduct, upsertProduct } from "../actions/admin-product-actions";
import { formatCurrency } from "@/lib/utils";

interface ProductItem {
  id: string;
  gameId: string;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string | null;
  isActive: boolean;
  isPromo: boolean;
  game: {
    name: string;
  };
}

interface GameSelectorItem {
  id: string;
  name: string;
}

interface ProductListManagerProps {
  initialProducts: ProductItem[];
  games: GameSelectorItem[];
}

export function ProductListManager({ initialProducts, games }: ProductListManagerProps) {
  const { success, error } = useToast();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameId, setSelectedGameId] = useState("ALL");

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState({
    gameId: games[0]?.id || "",
    name: "",
    price: 0,
    originalPrice: "" as any,
    description: "",
    isActive: true,
    isPromo: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      gameId: selectedGameId !== "ALL" ? selectedGameId : games[0]?.id || "",
      name: "",
      price: 0,
      originalPrice: "",
      description: "",
      isActive: true,
      isPromo: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormData({
      gameId: prod.gameId,
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice !== null ? prod.originalPrice : "",
      description: prod.description || "",
      isActive: prod.isActive,
      isPromo: prod.isPromo,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleToggle = async (productId: string, field: "isActive" | "isPromo", currentValue: boolean) => {
    setActionLoadingId(`${productId}-${field}`);
    const result = await toggleProductStatus(productId, field, !currentValue);
    setActionLoadingId(null);

    if (result.success) {
      success("Status produk berhasil diperbarui!");
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, [field]: !currentValue } : p))
      );
    } else {
      error(result.error || "Gagal memperbarui status produk.");
    }
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      return;
    }

    setActionLoadingId(`${productId}-delete`);
    const result = await deleteProduct(productId);
    setActionLoadingId(null);

    if (result.success) {
      success(`Produk "${name}" berhasil dihapus.`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      error(result.error || "Gagal menghapus produk.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const errors: Record<string, string> = {};
    if (!formData.gameId) errors.gameId = "Wajib memilih game.";
    if (!formData.name.trim()) errors.name = "Nama nominal wajib diisi.";
    if (Number(formData.price) <= 0) errors.price = "Harga wajib lebih besar dari 0.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormLoading(true);
    const result = await upsertProduct(
      editingProduct
        ? {
            ...formData,
            id: editingProduct.id,
            price: Number(formData.price),
            originalPrice: formData.originalPrice !== "" ? Number(formData.originalPrice) : null,
          }
        : {
            ...formData,
            price: Number(formData.price),
            originalPrice: formData.originalPrice !== "" ? Number(formData.originalPrice) : null,
          }
    );
    setFormLoading(false);

    if (result.success) {
      success(editingProduct ? "Produk berhasil diperbarui!" : "Produk baru berhasil ditambahkan!");
      setIsModalOpen(false);
      window.location.reload(); // Quick refresh page data
    } else {
      error(result.error || "Gagal menyimpan data produk.");
    }
  };

  // Filter list
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGameId === "ALL" || prod.gameId === selectedGameId;
    return matchesSearch && matchesGame;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Action Toolbar */}
      <div className="glass p-5 rounded-2xl border border-border-color/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <Input
            id="prod-search"
            placeholder="Cari nominal produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-text-secondary/60" />}
            className="w-full sm:w-64"
          />
          {/* Game filter selection */}
          <Select
            id="game-filter"
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="w-full sm:w-56 py-2.5"
          >
            <option value="ALL">Semua Game</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        <Button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Nominal
        </Button>
      </div>

      {/* Grid Table */}
      {filteredProducts.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead>Nominal Produk</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Harga Coret (Promo)</TableHead>
              <TableHead className="text-center">Status Aktif</TableHead>
              <TableHead className="text-center">Status Promo</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell className="font-bold">{prod.game.name}</TableCell>
                <TableCell className="font-semibold text-text-primary">{prod.name}</TableCell>
                <TableCell className="font-bold text-accent">{formatCurrency(prod.price)}</TableCell>
                <TableCell className="text-text-secondary">
                  {prod.originalPrice ? (
                    <span className="line-through">{formatCurrency(prod.originalPrice)}</span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                
                {/* Status Toggles */}
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggle(prod.id, "isActive", prod.isActive)}
                    disabled={actionLoadingId === `${prod.id}-isActive`}
                    className="cursor-pointer"
                  >
                    {prod.isActive ? (
                      <Badge variant="success">Aktif</Badge>
                    ) : (
                      <Badge variant="neutral">Buram</Badge>
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggle(prod.id, "isPromo", prod.isPromo)}
                    disabled={actionLoadingId === `${prod.id}-isPromo`}
                    className="cursor-pointer"
                  >
                    {prod.isPromo ? (
                      <Badge variant="primary" className="gap-1"><Percent className="w-3 h-3" /> Ya</Badge>
                    ) : (
                      <Badge variant="neutral">Tidak</Badge>
                    )}
                  </button>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenEditModal(prod)}
                      className="p-2 border-none bg-bg-tertiary hover:bg-bg-tertiary/75"
                    >
                      <Edit className="w-3.5 h-3.5 text-accent" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(prod.id, prod.name)}
                      disabled={actionLoadingId === `${prod.id}-delete`}
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
        <div className="glass rounded-2xl p-16 text-center border border-border-color/60">
          <p className="text-text-secondary text-sm">Belum ada nominal produk terdaftar yang cocok.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Nominal Produk" : "Tambah Nominal Produk Baru"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleFormSubmit} isLoading={formLoading}>
              Simpan Produk
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <Select
            id="gameId"
            label="Game"
            value={formData.gameId}
            onChange={(e) => setFormData((p) => ({ ...p, gameId: e.target.value }))}
            error={formErrors.gameId}
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>

          <Input
            id="name"
            label="Nama Nominal"
            placeholder="Contoh: 86 Diamonds atau 300 Genesis Crystals"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            error={formErrors.name}
            icon={<Tag className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              type="number"
              label="Harga Jual (IDR)"
              placeholder="Contoh: 22000"
              value={formData.price || ""}
              onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
              error={formErrors.price}
            />
            <Input
              id="orig"
              type="number"
              label="Harga Coret / Original (IDR, Opsional)"
              placeholder="Contoh: 25000"
              value={formData.originalPrice || ""}
              onChange={(e) => setFormData((p) => ({ ...p, originalPrice: e.target.value }))}
            />
          </div>

          <Input
            id="desc"
            label="Deskripsi Tambahan (Opsional)"
            placeholder="Masukkan keterangan singkat jika diperlukan..."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />

          <div className="flex gap-6 mt-2 pt-2 border-t border-border-color/40">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 rounded accent-accent"
              />
              Tampilkan / Aktifkan Produk
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPromo}
                onChange={(e) => setFormData((p) => ({ ...p, isPromo: e.target.checked }))}
                className="w-4 h-4 rounded accent-accent"
              />
              Tandai Sedang Promo (Coret Harga)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
