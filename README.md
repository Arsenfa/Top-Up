# ⚡ TopUpKu - Premium Game Top-Up Storefront

TopUpKu adalah platform top up game otomatis 24/7 yang dirancang dengan antarmuka (UI/UX) premium, modern, dan bergaya editorial bersih. Aplikasi ini dibangun menggunakan **Next.js 16**, **Tailwind CSS**, **Prisma ORM**, **SQLite**, serta terintegrasi langsung dengan **Midtrans Payment Gateway** untuk memproses pembayaran secara instan dan otomatis.

---

## ✨ Fitur Utama

- 🎮 **Catalog Game Populer**: Mendukung berbagai game populer seperti Mobile Legends, Free Fire, Genshin Impact, PUBG Mobile, Valorant, Honkai: Star Rail, CODM, dan Arena of Valor.
- ⚡ **Proses Otomatis 24/7**: Integrasi sistem yang memproses pembelian secara instan setelah pembayaran terverifikasi.
- 💳 **Metode Pembayaran Lokal Lengkap**: Mendukung QRIS (GoPay, OVO, Dana, LinkAja), E-Wallet, serta Virtual Account bank ternama (BCA, BNI, BRI, Mandiri) menggunakan integrasi Snap Midtrans.
- 🎨 **Desain UI/UX Premium (Anti-AI Slop)**: Antarmuka yang bersih, responsif, menggunakan tipografi modern, mikro-animasi halus (`framer-motion`), serta tata letak bento grid yang estetik.
- 📈 **Social Proof Real-Time**: Widget transaksi aktif yang menampilkan transaksi terbaru secara langsung di beranda untuk meningkatkan kepercayaan pelanggan.
- 🔐 **Dashboard Admin Lengkap**: Panel admin khusus untuk mengelola daftar game, produk/nominal, kode promo, banner slider, serta memantau status pesanan.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Framer Motion (Animasi)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) dengan SQLite (`dev.db`)
- **Payment Gateway**: [Midtrans Snap API](https://midtrans.com/)
- **Autentikasi**: NextAuth.js
- **Icon**: [Lucide React](https://lucide.dev/)

---

## 🚀 Memulai (Getting Started)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- npm, yarn, atau pnpm

### 2. Kloning Repositori
```bash
git clone https://github.com/Arsenfa/Top-Up.git
cd Top-Up
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables (`.env`)
Buat file bernama `.env` di direktori utama proyek Anda dan isi sebagai berikut:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="buat-secret-acak-anda-disini"

# Konfigurasi Midtrans (Sandbox / Production)
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION="false"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
```

### 5. Sinkronisasi Database & Seeding Aset Lokal
Jalankan perintah berikut untuk meriset database dan mengisi data game, produk, kode promo, serta akun admin awal beserta seluruh aset gambar lokal:
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### 6. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## 🔑 Kredensial Admin Default
Setelah Anda melakukan seeding, Anda dapat masuk ke Dashboard Admin di `/admin` dengan kredensial berikut:
- **Halaman Login**: `/login`
- **Email**: `admin@topupku.com`
- **Password**: `admin123`

---

## 📁 Struktur Direktori
```text
├── docs/               # Dokumentasi proyek
├── prisma/             # Schema database & script seed data
├── public/             # Aset statis lokal (Gambar Game, Banners, Logos)
└── src/
    ├── app/            # Next.js App Router (Halaman & API)
    ├── components/     # Komponen UI global & layout bersama
    ├── features/       # Logika fitur (home, checkout, orders, auth, admin)
    ├── hooks/          # Custom React Hooks
    ├── lib/            # Fungsi utilitas & konfigurasi prisma
    └── types/          # Definisi TypeScript type
```

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi MIT. Silakan gunakan dan modifikasi untuk keperluan portofolio Anda.
