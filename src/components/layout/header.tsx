"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap, Menu, X, Receipt, ChevronDown,
  Gamepad2, MessageCircle, Star, Home,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda", icon: <Home className="w-3.5 h-3.5" /> },
  { href: "/#games", label: "Game Populer", icon: <Gamepad2 className="w-3.5 h-3.5" /> },
  { href: "/cek-order", label: "Cek Transaksi", icon: <Receipt className="w-3.5 h-3.5" /> },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080c14]/90 backdrop-blur-2xl border-b border-[#1e2d45]/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative flex items-center justify-center w-8 h-8">
                {/* Background hexagon-ish */}
                <div className="absolute inset-0 bg-accent rounded-xl rotate-[8deg] group-hover:rotate-[14deg] transition-transform duration-300" />
                <Zap className="relative w-4 h-4 text-white z-10" strokeWidth={2.5} />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-display font-black text-[19px] tracking-tight text-text-primary">TopUp</span>
                <span className="font-display font-black text-[19px] tracking-tight text-accent">Ku</span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive(link.href)
                      ? "text-accent bg-accent/8"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-accent rounded-full" />
                  )}
                </Link>
              ))}

              {/* Promo Dropdown stub */}
              <button className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200">
                <Star className="w-3.5 h-3.5" />
                Promo
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </nav>

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                href="/cek-order"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary border border-border-color/70 hover:border-border-strong bg-bg-secondary/60 hover:bg-bg-tertiary transition-all duration-200"
              >
                <Receipt className="w-4 h-4" />
                Cek Order
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-accent hover:bg-accent-hover text-white transition-all duration-200 shadow-[0_4px_14px_rgba(224,92,61,0.22)] hover:shadow-[0_4px_20px_rgba(224,92,61,0.35)] active:scale-[0.97]"
              >
                <Zap className="w-4 h-4" />
                Top Up Sekarang
              </Link>
            </div>

            {/* ── Mobile Menu Toggle ── */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-all duration-200"
            >
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}>
                <X className="w-5 h-5" />
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}>
                <Menu className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* ── Mobile Drawer Panel ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-bg-secondary border-l border-border-color flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-color">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-black text-base tracking-tight">
                TopUp<span className="text-accent">Ku</span>
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-transparent"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-transparent transition-all">
              <Star className="w-3.5 h-3.5" />
              Promo
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-transparent transition-all">
              <MessageCircle className="w-3.5 h-3.5" />
              Support
            </button>
          </nav>

          {/* Drawer CTA */}
          <div className="p-4 border-t border-border-color flex flex-col gap-2.5">
            <Link href="/cek-order" onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-text-secondary border border-border-color bg-bg-tertiary hover:border-border-strong transition-all"
            >
              <Receipt className="w-4 h-4" />
              Cek Transaksi
            </Link>
            <Link href="/" onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-accent hover:bg-accent-hover text-white transition-all shadow-[0_4px_14px_rgba(224,92,61,0.22)]"
            >
              <Zap className="w-4 h-4" />
              Top Up Sekarang
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
