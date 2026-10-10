# 🤲 My Prayer Mobile App

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Aplikasi mobile modern, responsif, dan _offline-first_ untuk membaca doa dan zikir harian setelah sholat fardhu.

</div>

---

## 🌟 Fitur Utama

- **🕌 Konten Doa & Zikir Lengkap**: Terdiri dari teks Arab yang jernih, teks latin, serta terjemahan bahasa Indonesia.
- **🔄 Sinkronisasi Cerdas & Offline-First**: Menggunakan engine lokal (AsyncStorage) dan Supabase PostgreSQL. Otomatis menyinkronkan data hanya saat ada pembaruan di server, sehingga tetap dapat diakses tanpa koneksi internet.
- **🔤 Pengatur Ukuran Font Dinamis**: Memungkinkan pengguna memperbesar atau memperkecil teks Arab sesuai kenyamanan baca.
- **📜 Navigasi Gulir Cerdas**: Tombol navigasi terapung (_floating scroll_) untuk mempermudah navigasi bacaan secara bertahap.
- **📋 Salin & Bagikan (Share)**: Fitur instan untuk menyalin teks doa ke clipboard atau membagikannya ke aplikasi lain.

---

## 🛠️ Tech Stack

- **Core Framework**: React Native dengan [Expo](https://expo.dev/) & TypeScript
- **Styling**: Tailwind CSS via [NativeWind](https://www.nativewind.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Local Storage / Cache**: `@react-native-async-storage/async-storage`
- **Icons**: `lucide-react-native`

---

## 📱 Panduan Instalasi & Menjalankan Proyek

1. **Clone repositori ini**:
   ```bash
   git clone [https://github.com/gfr-31/my-prayer-app.git](https://github.com/gfr-31/my-prayer-app.git)
   cd my-prayer-app
   ```
