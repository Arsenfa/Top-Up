
## 0. Role & Skill yang Dipakai

Kamu bertindak sebagai senior product engineer + UI/UX lead yang mengerjakan redesign penuh untuk aplikasi production **TopUpKu** (https://topupku-app.vercel.app/) tanpa merusak fungsi yang sudah berjalan.

**Skill yang WAJIB dipakai:**
- `ponytail`
- `caveman`

Gunakan kedua skill ini sebagai basis kerja utama di setiap tahap. Selain itu, aktifkan skill/tool tambahan apa pun yang relevan dan tersedia di environment kamu (misalnya untuk design review, accessibility audit, performance audit, security review, atau database/schema review) — pilih sendiri sesuai kebutuhan tiap tahap, tidak perlu menunggu instruksi tambahan dariku.

## 1. Konteks Project (jangan diubah tanpa alasan kuat)

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Lucide React, Geist Font
- **Backend:** Next.js Server Actions, Prisma ORM, PostgreSQL, NextAuth v5, BcryptJS, Midtrans (payment gateway)
- **Infra:** Vercel (hosting), Supabase + Supavisor (database/connection pooling)
- **Testing:** TestSprite CLI (sudah terpasang)
- **Produk:** platform top up game (Mobile Legends, Free Fire, Genshin Impact, PUBG Mobile, Valorant, Honkai: Star Rail, Call of Duty Mobile, Arena of Valor) dengan checkout, payment gateway, admin panel, sistem promo, dan order tracking.

## 2. Tujuan Utama

1. Redesign tampilan TopUpKu agar terlihat profesional setara produk big tech / SaaS kelas atas (acuan kualitas polish: Stripe, Linear, Vercel) — **bukan** tampilan generic "AI-generated landing page".
2. Tetap pertahankan vibe gaming yang relevan untuk audiens top-up game Indonesia — energik, terasa "milik gamer", bukan korporat kaku/dingin.
3. Semua fitur dan menu yang sudah ada **harus tetap berfungsi 100%** setelah redesign — tidak ada regresi.
4. Lolos pengujian otomatis via TestSprite.
5. Berjalan mulus saat dideploy ulang ke Vercel (build sukses, environment variable valid, koneksi database & payment gateway tetap berfungsi di production).

## 3. Yang HARUS Dihindari (ciri "AI Slop" yang mau dihilangkan)

- Gradient generik ungu-ke-biru yang dipasang di hampir semua section tanpa fungsi jelas.
- Glassmorphism/blur berlebihan pada card tanpa alasan visual.
- Card berulang dengan rounded-corner & shadow seragam tanpa hierarki visual — semua section "terasa sama".
- Copywriting penuh buzzword generik ("revolusioner", "game-changing", "next-level") tanpa klaim spesifik/terukur.
- Ikon dekoratif/emoji berlebihan di UI (🔥💎🚀) sebagai pengganti hierarki visual yang sebenarnya.
- Hero section dengan blob 3D abstrak yang tidak ada hubungannya dengan brand/produk.
- Spacing tidak konsisten — elemen terasa "ditempel", bukan disusun sistematis.
- Avatar testimoni wajah AI-generated yang terlihat seragam/aneh. Pola avatar inisial yang sudah ada (BS, SN, RA, dst.) sudah tepat — **jangan diganti** foto AI generik.

## 4. Arah Desain yang Diinginkan

Bangun design system yang jelas sebelum eksekusi penuh ke semua halaman:

- **Color tokens:** 1 warna primary netral/gelap (kesan trust & premium) + 1 warna accent neon yang dipakai terbatas — hanya untuk CTA, status aktif, dan highlight harga. Jangan dipakai di semua tempat.
- **Typography scale:** pakai Geist, tentukan skala jelas (display, heading, body, caption) dengan kontras ukuran/berat font yang terasa nyata, bukan semua bold rata.
- **Spacing system:** konsisten berbasis grid 4px/8px.
- **Radius & shadow:** maksimal 3 level, dipakai konsisten di semua komponen.
- **Acuan kualitas:** platform top up/e-commerce gaming kredibel (Codashop, UniPin, VCGamers) dinaikkan ke arah polish checkout fintech — trust signal jelas (badge keamanan, logo partner rapi & konsisten ukurannya, micro-copy spesifik bukan generik).
- **Motion (Framer Motion):** dipakai secukupnya dan bermakna — transisi halaman, micro-interaction di hover/CTA, skeleton loading saat fetch data. Bukan animasi dekoratif di semua section.
- **Mobile-first**, benar-benar responsive (mayoritas user top-up game akses dari HP).
- **SEO:** pertahankan/optimalkan meta tags yang sudah ada (title, description, OG tags) — jangan dihapus saat redesign.

**Rekomendasi proses:** kerjakan dulu landing page sebagai proof of concept arah desain baru, tampilkan dulu, baru lanjut ke halaman lain (detail game, checkout, cek order, admin panel) supaya tidak boros waktu kalau ada revisi arah.

## 5. Checklist Fungsional — Wajib Tetap Berjalan Setelah Redesign

Jangan anggap pekerjaan selesai sebelum semua poin ini dikonfirmasi jalan:

**Auth (NextAuth v5 + BcryptJS)**
- [ ] Register user baru
- [ ] Login (credentials) dengan validasi password benar
- [ ] Login gagal menampilkan error message yang jelas
- [ ] Logout & session benar-benar ter-clear
- [ ] Route admin panel terlindungi, tidak bisa diakses tanpa login

**Katalog & Checkout**
- [ ] List 8 game existing tampil benar
- [ ] Filter kategori (Semua/MOBA/FPS/RPG) berfungsi
- [ ] Halaman detail game & pilihan denominasi tampil benar
- [ ] Form checkout (input UID/ID game, pilih nominal) validasi input dengan benar

**Payment (Midtrans)**
- [ ] Transaksi sandbox berhasil untuk tiap metode (QRIS, GoPay, OVO, DANA, ShopeePay, Bank Transfer/VA)
- [ ] Webhook callback Midtrans berhasil update status order di database
- [ ] Signature verification webhook tetap aman — jangan dilonggarkan saat redesign

**Order Tracking**
- [ ] Halaman "Cek Order" bisa mencari order berdasarkan ID/nomor
- [ ] Status order (pending/success/failed) tampil akurat sesuai data di database

**Promo System**
- [ ] Kode promo bisa diterapkan saat checkout
- [ ] Validasi promo (expired, limit penggunaan, minimum transaksi) tetap berjalan

**Admin Panel**
- [ ] CRUD game & denominasi/harga
- [ ] CRUD/manage kode promo
- [ ] Lihat & update status order

## 6. Testing — Wajib Pakai TestSprite

- Setelah redesign + functional check manual selesai, jalankan **TestSprite CLI**.
- Susun test case yang mengcover seluruh checklist di poin 5 (auth flow, checkout flow, payment sandbox, admin CRUD, cek order, promo).
- Tambahkan test regresi UI dasar: tidak ada link/button mati, tidak ada console error, tidak ada layout shift signifikan di breakpoint mobile/tablet/desktop.
- Semua test harus **PASS** sebelum lanjut ke tahap deploy. Kalau ada yang FAIL, perbaiki dulu — jangan dilewati.
- Laporkan hasil ringkas test (jumlah pass/fail + apa yang diperbaiki) di akhir pengerjaan.

## 7. Validasi Deployment di Vercel

- Pastikan build di Vercel sukses tanpa error (`next build`, termasuk `prisma generate` jalan di build step).
- Pastikan environment variable di Vercel project settings lengkap dan benar: connection string Supabase via Supavisor (pooled), `NEXTAUTH_SECRET`, `NEXTAUTH_URL` sesuai domain production, `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, dan variable lain yang dipakai project ini.
- Pastikan koneksi ke Supabase via Supavisor tidak exhaust connection limit di environment serverless Vercel.
- Pastikan URL callback/webhook Midtrans mengarah ke domain production yang benar, dan diuji ulang setelah deploy.
- Setelah deploy ke production, lakukan smoke test langsung di URL live: buka homepage, login admin & user biasa, coba 1 transaksi sandbox end-to-end, cek console browser untuk error.
- Pastikan tidak ada sisa hardcoded `localhost` atau URL development di kode setelah redesign.

## 8. Output yang Diharapkan di Akhir

1. Ringkasan perubahan desain (sebelum vs sesudah), terutama hal yang menghilangkan kesan "AI slop".
2. Konfirmasi seluruh checklist fungsional di poin 5 sudah ditest manual dan berjalan.
3. Hasil run TestSprite (pass/fail summary).
4. Konfirmasi deployment Vercel sukses + link production yang sudah live & berfungsi penuh.
5. Daftar environment variable yang perlu diset manual di Vercel dashboard (kalau ada yang baru) — **tanpa** menyertakan value rahasia di laporan.

**Catatan penting:** jangan ubah logic bisnis (perhitungan harga, validasi promo, signature verification Midtrans) kecuali memang diminta. Fokus redesign di sisi visual & UX, dengan tetap menjaga seluruh fungsi backend yang sudah ada bekerja seperti semula.
