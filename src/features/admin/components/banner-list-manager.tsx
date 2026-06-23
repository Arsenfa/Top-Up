"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Search, Plus, Edit, Trash2, Link as LinkIcon, SortAsc } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toggleBannerStatus, deleteBanner, upsertBanner } from "../actions/admin-banner-actions";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface BannerListManagerProps {
  initialBanners: BannerItem[];
}

export function BannerListManager({ initialBanners }: BannerListManagerProps) {
  const { success, error } = useToast();
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 0,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      sortOrder: 0,
      isActive: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: BannerItem) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || "",
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl || "",
      sortOrder: b.sortOrder,
      isActive: b.isActive,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleToggle = async (bannerId: string, currentValue: boolean) => {
    setActionLoadingId(bannerId);
    const result = await toggleBannerStatus(bannerId, !currentValue);
    setActionLoadingId(null);

    if (result.success) {
      success("Status banner berhasil diperbarui!");
      setBanners((prev) =>
        prev.map((b) => (b.id === bannerId ? { ...b, isActive: !currentValue } : b))
      );
    } else {
      error(result.error || "Gagal mengubah status banner.");
    }
  };

  const handleDelete = async (bannerId: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus banner "${title}"?`)) {
      return;
    }

    setActionLoadingId(`${bannerId}-delete`);
    const result = await deleteBanner(bannerId);
    setActionLoadingId(null);

    if (result.success) {
      success(`Banner "${title}" berhasil dihapus.`);
      setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    } else {
      error(result.error || "Gagal menghapus banner.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Judul banner wajib diisi.";
    if (!formData.imageUrl.trim()) errors.imageUrl = "Link gambar banner wajib diisi.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormLoading(true);
    const result = await upsertBanner(
      editingBanner
        ? {
            ...formData,
            id: editingBanner.id,
            sortOrder: Number(formData.sortOrder),
          }
        : {
            ...formData,
            sortOrder: Number(formData.sortOrder),
          }
    );
    setFormLoading(false);

    if (result.success) {
      success(editingBanner ? "Banner berhasil diperbarui!" : "Banner baru berhasil ditambahkan!");
      setIsModalOpen(false);
      window.location.reload();
    } else {
      error(result.error || "Gagal menyimpan data banner.");
    }
  };

  const filteredBanners = banners.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Action Toolbar */}
      <div className="p-5 rounded-2xl border border-border-color/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          id="banner-search"
          placeholder="Cari judul banner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-text-secondary/60" />}
          className="w-full sm:w-64"
        />

        <Button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Banner
        </Button>
      </div>

      {/* Table grid */}
      {filteredBanners.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner Preview</TableHead>
              <TableHead>Judul / Subtitle</TableHead>
              <TableHead>Link Redirect</TableHead>
              <TableHead className="text-center">Urutan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBanners.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="w-24 h-12 rounded-lg overflow-hidden bg-bg-tertiary border border-border-color/40 relative">
                    <Image src={b.imageUrl} alt={b.title} fill sizes="96px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">{b.title}</span>
                    <span className="text-[10px] text-text-secondary line-clamp-1">{b.subtitle || "-"}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[150px] truncate">
                  {b.linkUrl || "-"}
                </TableCell>
                <TableCell className="text-center font-bold text-accent">{b.sortOrder}</TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleToggle(b.id, b.isActive)}
                    disabled={actionLoadingId === b.id}
                    className="cursor-pointer"
                  >
                    {b.isActive ? (
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
                      onClick={() => handleOpenEditModal(b)}
                      className="p-2 border-none bg-bg-tertiary hover:bg-bg-tertiary/75"
                    >
                      <Edit className="w-3.5 h-3.5 text-accent" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(b.id, b.title)}
                      disabled={actionLoadingId === `${b.id}-delete`}
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
          <p className="text-text-secondary text-sm">Belum ada banner promosi terdaftar.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? "Edit Banner Promo" : "Tambah Banner Promo Baru"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleFormSubmit} isLoading={formLoading}>
              Simpan Banner
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <Input
            id="title"
            label="Judul Banner"
            placeholder="Contoh: Promo Gila Diamond ML"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            error={formErrors.title}
          />
          <Input
            id="subtitle"
            label="Sub-judul / Deskripsi Banner"
            placeholder="Contoh: Diskon 20% khusus pengguna Gopay..."
            value={formData.subtitle}
            onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
          />
          <Input
            id="image"
            label="Link Gambar Banner"
            placeholder="https://images.unsplash.com/..."
            value={formData.imageUrl}
            onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
            error={formErrors.imageUrl}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="link"
              label="Link Redirect Tujuan (Opsional)"
              placeholder="Contoh: /games/mobile-legends"
              value={formData.linkUrl}
              onChange={(e) => setFormData((p) => ({ ...p, linkUrl: e.target.value }))}
              icon={<LinkIcon className="w-4 h-4" />}
            />
            <Input
              id="sort"
              type="number"
              label="Urutan Tampil (Sort Order)"
              placeholder="Contoh: 0"
              value={formData.sortOrder || ""}
              onChange={(e) => setFormData((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
              icon={<SortAsc className="w-4 h-4" />}
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded accent-accent"
            />
            Aktifkan Banner Langsung
          </label>
        </form>
      </Modal>
    </div>
  );
}
