# Panduan Persiapan Supabase - KeMetroFest

Ikuti langkah-langkah berikut untuk menyiapkan database cloud Anda:

## 1. Buat Akun & Project
1. Buka [supabase.com](https://supabase.com) dan login dengan GitHub Anda.
2. Klik **New Project**.
3. Pilih **Organization** Anda.
4. Isi **Name**: `KeMetroFest`.
5. Isi **Database Password**: (Simpan password ini baik-baik).
6. Pilih **Region**: `Singapore` (untuk akses tercepat dari Indonesia).
7. Klik **Create new project**.

## 2. Setup Tabel (SQL)
1. Setelah project siap, di menu sidebar kiri, klik **SQL Editor**.
2. Klik **New Query**.
3. Buka file `migration.sql` yang sudah saya buat di project Anda.
4. **Copy seluruh isi `migration.sql`** dan tempel (paste) ke SQL Editor Supabase.
5. Klik **Run**.
6. Sekarang tabel Anda sudah jadi! Cek di menu **Table Editor** untuk memastikannya.

## 3. Ambil API Keys
1. Di sidebar kiri, klik icon **Project Settings** (icon gerigi).
2. Pilih menu **API**.
3. Anda akan melihat dua informasi penting:
   - **Project URL**
   - **Project API keys (anon public)**
4. Salin kedua nilai tersebut.

## 4. Konfigurasi di Project Lokal
1. Buat file baru bernama **`.env`** di root folder project Anda (sejajar dengan `package.json`).
2. Masukkan kode berikut (ganti dengan nilai yang Anda salin tadi):
   ```text
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 5. Matikan RLS (Opsional untuk Pengembangan)
Supabase memiliki fitur keamanan ketat bernama RLS. Untuk mempermudah pengembangan awal:
1. Pergi ke menu **Table Editor**.
2. Pilih tabel (misal: `tenants`).
3. Klik **RLS is enabled** (di bagian atas) -> pilih **Disable RLS**.
4. Lakukan hal yang sama untuk tabel lainnya.
   *(Nanti kita akan aktifkan lagi dengan kebijakan yang lebih aman).*

---
**Jika langkah 1-4 sudah selesai, beri tahu saya!** Saya akan langsung mengubah kode `store.ts` agar aplikasi Anda mulai mengirim data ke Supabase, bukan lagi ke browser. 🚀
