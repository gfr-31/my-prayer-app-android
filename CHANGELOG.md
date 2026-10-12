# 📜 Catatan Perubahan (Changelog) - My Prayer

Semua perubahan penting pada aplikasi **My Prayer** akan didokumentasikan dalam file ini. Proyek ini menggunakan [Semantic Versioning](https://semver.org/).

---

## [v1.2.0] - 2026-10-11 (Terbaru)

### ✨ Fitur Baru (New Features)

- **Custom Reorder Mode**: Menambahkan mode khusus "Atur Posisi" yang dilengkapi dengan tombol panah naik (`↑`) dan turun (`↓`) di setiap kartu doa untuk mengatur urutan secara presisi.
- **Simpan Urutan Permanen**: Penambahan fungsionalitas penyimpanan posisi (`order_index`) ke penyimpanan lokal (`AsyncStorage`) dan sinkronisasi server Supabase saat tombol "Simpan Urutan" diklik.

### 🚀 Optimasi & Perbaikan (Performance & Improvements)

- **Komponen Modular**: Memisahkan kontrol mode susun ke dalam komponen terpisah (`ReorderControlBar`) agar kode lebih bersih dan terstruktur.
- **Optimasi `React.memo`**: Membungkus komponen `PrayerCard` dengan `React.memo` untuk mencegah render ulang yang tidak perlu dan menghilangkan _lag_ saat menggeser posisi doa.
- **Peningkatan `FlatList`**: Menambahkan properti performa seperti `windowSize`, `maxToRenderPerBatch`, dan `removeClippedSubviews` untuk pengalaman _scrolling_ yang lebih mulus.

---

## [v1.1.0] - 2026-03-xx

### ✨ Fitur Baru

- **Font Resizer**: Pengguna dapat memperbesar atau memperkecil ukuran teks Arab doa secara dinamis sesuai kenyamanan membaca.
- **Floating Scroll Navigation**: Tombol navigasi cepat (atas & bawah) untuk memudahkan perpindahan halaman layar tanpa harus _scroll_ manual secara penuh.
- **Aksi Cepat Kartu Doa**: Menambahkan tombol Salin teks (_Copy to Clipboard_) dan Bagikan (_Native Share_).

---

## [v1.0.0] - 2026-02-xx

### 🎉 Rilis Awal (Initial Release)

- Peluncuran dasar aplikasi **My Prayer** menggunakan React Native (Expo) dan TypeScript.
- Integrasi _backend_ dengan **Supabase** untuk sinkronisasi data doa secara _real-time_.
- Implementasi mekanisme _offline-first_ menggunakan **AsyncStorage** agar aplikasi tetap dapat diakses tanpa koneksi internet.
- Penerapan gaya desain modern menggunakan **NativeWind / Tailwind CSS** dengan tema warna khas Islami (`Warm Cream` & `Emerald Primary`).
