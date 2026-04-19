# KeMetroFest - Event Management Platform

KeMetroFest adalah platform manajemen event modern yang dirancang khusus untuk festival kuliner dan UMKM di Kota Metro. Platform ini menyediakan Landing Page yang interaktif untuk pengunjung dan Admin Dashboard yang lengkap untuk penyelenggara.

## ✨ Fitur Utama

- **Landing Page Interaktif**: Desain brutalist yang berani, responsif, dan dinamis dengan animasi GSAP.
- **Manajemen Slot Stand**: Visualisasi blok stan yang tersedia, terisi, atau penuh secara real-time.
- **Pendaftaran Tenant & Mitra**: Alur pendaftaran terintegrasi langsung ke WhatsApp dengan template pesan otomatis.
- **Admin Dashboard**:
  - **Manajemen Tenant**: Tambah, edit, hapus, dan kelola status pendaftar tenant.
  - **Manajemen Mitra/Sponsor**: Kelola daftar mitra dan tingkatan (Tier) sponsor dengan badge otomatis.
  - **Pengaturan Konten**: Ubah informasi event, gambar hero, deskripsi pendaftaran, hingga SEO (Meta Title/Desc) tanpa menyentuh kode.
  - **Sistem Backup**: Fitur Ekspor/Impor database (JSON) dan ekspor ke format SQL untuk keamanan data.
- **Persistensi Lokal**: Seluruh data disimpan di `localStorage` browser, memungkinkan penggunaan tanpa database backend yang rumit.

## 🚀 Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS (Custom Theme)
- **Animasi**: GSAP (ScrollTrigger)
- **Icon**: Lucide React
- **UI Components**: Shadcn UI, Sonner (Toast), Framer Motion
- **Form Handling**: React Hook Form, Zod Validation

## 📦 Instalasi & Menjalankan Project

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd kemetrofest
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Jalankan Mode Pengembangan**
   ```bash
   npm run dev
   ```

4. **Build untuk Produksi**
   ```bash
   npm run build
   ```

## 🛠️ Panduan Admin

Untuk mengakses dashboard admin, navigasikan ke `/admin` atau klik link Admin yang tersedia. Seluruh perubahan yang dilakukan di dashboard akan langsung tercermin di Landing Page secara instan.

### Keamanan Data
Karena aplikasi ini menggunakan penyimpanan lokal (browser), sangat disarankan untuk:
- Melakukan **Backup** secara rutin di tab **Pengaturan > Backup**.
- Gunakan fitur **Restore** jika Anda pindah browser atau perangkat.

## 🎨 Desain & Estetika

Project ini mengusung tema **Brutalist Modern** dengan karakteristik:
- Warna-warna berani dan kontras (Amber, Lime, Charcoal).
- Border tebal (*Hard Borders*) dan bayangan tegas (*Hard Shadows*).
- Tipografi yang kuat (Montserrat & Space Grotesk).

---
*Dibuat untuk KeMetroFest - Memajukan UMKM Kota Metro.*
