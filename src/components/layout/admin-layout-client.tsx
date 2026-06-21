"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  Package,
  Receipt,
  Percent,
  Image as ImageIcon,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/features/auth/actions/auth-actions";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { success, error } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/admin/games", label: "Kelola Game", icon: <Gamepad2 className="w-5 h-5" /> },
    { href: "/admin/products", label: "Kelola Produk", icon: <Package className="w-5 h-5" /> },
    { href: "/admin/orders", label: "Monitor Transaksi", icon: <Receipt className="w-5 h-5" /> },
    { href: "/admin/promos", label: "Kelola Promo", icon: <Percent className="w-5 h-5" /> },
    { href: "/admin/banners", label: "Kelola Banner", icon: <ImageIcon className="w-5 h-5" /> },
    { href: "/admin/settings", label: "Pengaturan Situs", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const result = await logoutAdmin();
    setIsLoggingOut(false);

    if (result.success) {
      success("Berhasil keluar dari portal admin.");
      router.push("/login");
    } else {
      error("Gagal melakukan keluar.");
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-bg-secondary border border-border-color rounded-xl text-text-secondary hover:text-text-primary transition-all shadow-elevated"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-bg-secondary border-r border-border-color transform lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out flex flex-col justify-between
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-8 py-6 px-4">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2 px-2 group">
            <div className="p-2 bg-accent/10 border border-accent/20 rounded-xl">
              <Gamepad2 className="w-5 h-5 text-accent" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-text-primary">
              Admin<span className="text-accent">Panel</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer border
                  ${
                    isActive(item.href)
                      ? "bg-accent/10 border-accent/25 text-accent shadow-lg shadow-accent/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40 border-transparent"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-color/60 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-primary line-clamp-1">Administrator</span>
              <span className="text-[10px] text-text-secondary line-clamp-1">admin@topupku.com</span>
            </div>
          </div>
          
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2 py-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali Ke Toko
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 text-danger hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/20"
          >
            <LogOut className="w-4 h-4" />
            Keluar Panel
          </Button>
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-grow p-6 lg:p-10 lg:ml-0 overflow-y-auto max-w-7xl mx-auto w-full pt-20 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
