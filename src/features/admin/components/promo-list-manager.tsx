"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { togglePromoStatus, deletePromo, upsertPromo } from "../actions/admin-promo-actions";
import { formatCurrency } from "@/lib/utils";

interface PromoItem {
  id: string;
  code: string;
  title: string;
  description: string;
  type: string;
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  isActive: boolean;
}

interface PromoListManagerProps {
  initialPromos: PromoItem[];
}

export function PromoListManager({ initialPromos }: PromoListManagerProps) {
  const { success, error } = useToast();
  const [promos, setPromos] = useState<PromoItem[]>(initialPromos);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    type: "FIXED",
    value: 0,
    minPurchase: 0,
    maxDiscount: "" as number | "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingPromo(null);
    setFormData({
      code: "",
      title: "",
      description: "",
      type: "FIXED",
      value: 0,
      minPurchase: 0,
      maxDiscount: "",
      isActive: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: PromoItem) => {
    setEditingPromo(p);
    setFormData({
      code: p.code,
      title: p.title,
      description: p.description,
      type: p.type,
      value: p.value,
      minPurchase: p.minPurchase,
      maxDiscount: p.maxDiscount !== null ? p.maxDiscount : "",
      isActive: p.isActive,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleToggle = async (promoId: string, currentValue: boolean) => {
    setActionLoadingId(promoId);
    const result = await togglePromoStatus(promoId, !currentValue);
    setActionLoadingId(null);

    if (result.success) {
      success("Status promo berhasil diperbarui!");
      setPromos((prev) =>
        prev.map((p) => (p.id === promoId ? { ...p, isActive: !currentValue } : p))
      );
    } else {
      error(result.error || "Gagal mengubah status promo.");
    }
  };

  const handleDelete = async (promoId: string, code: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus promo "${code}"?`)) {
      return;
    }

    setActionLoadingId(`${promoId}-delete`);
    const result = await deletePromo(promoId);
    setActionLoadingId(null);

    if (result.success) {
      success(`Promo "${code}" berhasil dihapus.`);
      setPromos((prev) => prev.filter((p) => p.id !== promoId));
    } else {
      error(result.error || "Gagal menghapus promo.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = "Kode promo wajib diisi.";
    if (!formData.title.trim()) errors.title = "Judul promo wajib diisi.";
    if (!formData.description.trim()) errors.description = "Deskripsi wajib diisi.";
    if (Number(formData.value) <= 0) errors.value = "Nilai potongan wajib lebih besar dari 0.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormLoading(true);
    const result = await upsertPromo(
      editingPromo
        ? {
            ...formData,
            id: editingPromo.id,
            value: Number(formData.value),
            minPurchase: Number(formData.minPurchase),
            maxDiscount: formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null,
          }
        : {
            ...formData,
            value: Number(formData.value),
            minPurchase: Number(formData.minPurchase),
            maxDiscount: formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null,
          }
    );
    setFormLoading(false);

    if (result.success) {
      success(editingPromo ? "Promo berhasil diperbarui!" : "Promo baru berhasil ditambahkan!");
      setIsModalOpen(false);
      window.location.reload();
    } else {
      error(result.error || "Gagal menyimpan data promo.");
    }
  };

  const filteredPromos = promos.filter((p) =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Action Toolbar */}
      <div className="p-5 rounded-2xl border border-border-color/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          id="promo-search"
          placeholder="Cari kode atau judul promo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-text-secondary/60" />}
          className="w-full sm:w-64"
        />

        <Button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Promo
        </Button>
      </div>

      {/* Table grid */}
      {filteredPromos.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Promo</TableHead>
              <TableHead>Judul / Deskripsi</TableHead>
              <TableHead>Potongan</TableHead>
              <TableHead>Min. Pembelian</TableHead>
              <TableHead>Maks. Diskon</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromos.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-bold text-accent text-sm">{p.code}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">{p.title}</span>
                    <span className="text-[10px] text-text-secondary line-clamp-1">{p.description}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  {p.type === "FIXED" ? (
                    formatCurrency(p.value)
                  ) : (
                    <span className="flex items-center gap-0.5">{p.value}% <Percent className="w-3.5 h-3.5 text-accent" /></span>
                  )}
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(p.minPurchase)}</TableCell>
                <TableCell>
                  {p.maxDiscount ? formatCurrency(p.maxDiscount) : "-"}
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggle(p.id, p.isActive)}
                    disabled={actionLoadingId === p.id}
                    className="cursor-pointer"
                  >
                    {p.isActive ? (
                      <Badge variant="success">Aktif</Badge>
                    ) : (
                      <Badge variant="neutral">Buram</Badge>
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenEditModal(p)}
                      className="p-2 border-none bg-bg-tertiary hover:bg-bg-tertiary/75"
                    >
                      <Edit className="w-3.5 h-3.5 text-accent" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(p.id, p.code)}
                      disabled={actionLoadingId === `${p.id}-delete`}
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
          <p className="text-text-secondary text-sm">Belum ada promo yang cocok.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromo ? "Edit Promo" : "Tambah Promo Baru"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleFormSubmit} isLoading={formLoading}>
              Simpan Promo
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="code"
              label="Kode Promo"
              placeholder="Contoh: HEMATNEW"
              value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
              error={formErrors.code}
              disabled={!!editingPromo}
            />
            <Input
              id="title"
              label="Judul Promo"
              placeholder="Contoh: Diskon Awal Bulan"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              error={formErrors.title}
            />
          </div>

          <Input
            id="desc"
            label="Deskripsi / Syarat Promo"
            placeholder="Contoh: Diskon 10% maksimum Rp15.000..."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            error={formErrors.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="type"
              label="Tipe Potongan"
              value={formData.type}
              onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
            >
              <option value="FIXED">Nominal Tetap (Rupiah)</option>
              <option value="PERCENTAGE">Persentase (%)</option>
            </Select>
            <Input
              id="value"
              type="number"
              label="Nilai Potongan"
              placeholder={formData.type === "FIXED" ? "Contoh: 5000" : "Contoh: 10"}
              value={formData.value || ""}
              onChange={(e) => setFormData((p) => ({ ...p, value: Number(e.target.value) }))}
              error={formErrors.value}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="min"
              type="number"
              label="Min. Pembelian (IDR)"
              placeholder="Contoh: 20000"
              value={formData.minPurchase || ""}
              onChange={(e) => setFormData((p) => ({ ...p, minPurchase: Number(e.target.value) }))}
            />
            <Input
              id="max"
              type="number"
              label="Maks. Diskon (IDR, Khusus Persentase)"
              placeholder="Contoh: 15000"
              value={formData.maxDiscount || ""}
              onChange={(e) => setFormData((p) => ({ ...p, maxDiscount: e.target.value === "" ? "" : Number(e.target.value) }))}
              disabled={formData.type === "FIXED"}
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded accent-accent"
            />
            Aktifkan Promo Langsung
          </label>
        </form>
      </Modal>
    </div>
  );
}
