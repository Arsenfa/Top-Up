"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Gamepad2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { loginAdmin } from "../actions/auth-actions";

export function LoginForm() {
  const router = useRouter();
  const { error, success } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      error("Mohon isi email dan password Anda.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await loginAdmin(formData);
    setIsLoading(false);

    if (!result.success) {
      error(result.error || "Login gagal. Periksa kembali email & password.");
      return;
    }

    success("Login berhasil! Mengalihkan ke Dashboard...");
    router.push("/admin");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center p-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-xl">
            <Gamepad2 className="w-6 h-6 text-accent" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-text-primary">
            TopUp<span className="text-accent">Ku</span>
          </span>
        </div>
        <h1 className="font-display text-lg font-bold text-text-primary">Portal Administrator</h1>
        <p className="text-xs text-text-secondary leading-relaxed mt-1">
          Gunakan akun administrator Anda untuk masuk ke sistem monitoring transaksi dan produk.
        </p>
      </CardHeader>
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email Admin"
            placeholder="admin@topupku.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Masuk Panel
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/15">
          <p className="text-xs font-semibold text-accent mb-2">Demo Credentials</p>
          <div className="flex flex-col gap-1.5 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-text-muted w-16">Email</span>
              <code className="font-mono bg-bg-tertiary px-2 py-0.5 rounded text-text-primary">admin@topupku.com</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted w-16">Password</span>
              <code className="font-mono bg-bg-tertiary px-2 py-0.5 rounded text-text-primary">admin123</code>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
