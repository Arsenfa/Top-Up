"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateSiteConfigs } from "../actions/admin-settings-actions";
import { Globe, FileText, Phone, Mail, Save, Key } from "lucide-react";

interface SettingsFormProps {
  configs: {
    site_name: string;
    site_description: string;
    contact_whatsapp: string;
    contact_email: string;
  };
}

export function SettingsForm({ configs }: SettingsFormProps) {
  const { success, error } = useToast();
  const [siteName, setSiteName] = useState(configs.site_name);
  const [siteDesc, setSiteDesc] = useState(configs.site_description);
  const [whatsapp, setWhatsapp] = useState(configs.contact_whatsapp);
  const [email, setEmail] = useState(configs.contact_email);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!siteName.trim() || !siteDesc.trim() || !whatsapp.trim() || !email.trim()) {
      error("Semua kolom pengaturan wajib diisi.");
      return;
    }

    setIsLoading(true);

    const result = await updateSiteConfigs([
      { key: "site_name", value: siteName.trim() },
      { key: "site_description", value: siteDesc.trim() },
      { key: "contact_whatsapp", value: whatsapp.trim() },
      { key: "contact_email", value: email.trim() },
    ]);

    setIsLoading(false);

    if (result.success) {
      success("Pengaturan situs berhasil disimpan!");
    } else {
      error(result.error || "Gagal menyimpan pengaturan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <Card variant="default">
        <CardHeader>
          <h2 className="text-sm font-extrabold text-text-primary">
            Pengaturan Umum Website
          </h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            id="site_name"
            label="Nama Website"
            placeholder="Contoh: TopUpKu"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            icon={<Globe className="w-4 h-4" />}
          />
          <Input
            id="site_desc"
            label="Deskripsi SEO Website"
            placeholder="Masukkan keterangan meta description untuk search engine..."
            value={siteDesc}
            onChange={(e) => setSiteDesc(e.target.value)}
            icon={<FileText className="w-4 h-4" />}
          />
        </CardBody>
      </Card>

      <Card variant="default">
        <CardHeader>
          <h2 className="text-sm font-extrabold text-text-primary">
            Kontak Customer Service
          </h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="contact_wa"
            label="Nomor WhatsApp CS (Gunakan format 62...)"
            placeholder="Contoh: 6281234567890"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            icon={<Phone className="w-4 h-4" />}
          />
          <Input
            id="contact_email"
            type="email"
            label="Email Support"
            placeholder="Contoh: support@topupku.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
        </CardBody>
        <CardFooter className="flex justify-end bg-black/10">
          <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Simpan Pengaturan
          </Button>
        </CardFooter>
      </Card>

      <Card variant="default" className="opacity-75">
        <CardHeader>
          <h2 className="text-sm font-extrabold text-text-primary">
            Kredensial Payment Gateway (Midtrans)
          </h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent h-fit">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-text-primary mb-1">Konfigurasi Melalui File Environment</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed max-w-xl">
                Kredensial rahasia Midtrans Server Key dan Client Key diatur dengan aman di file `.env` sistem backend. Perubahan kredensial API key harus dilakukan secara langsung di server environment untuk menjaga keamanan data rahasia merchant Anda.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
