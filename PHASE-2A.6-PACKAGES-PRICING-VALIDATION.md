# PHASE 2A.6 — VALIDASI PACKAGES DAN PRICING

**Project:** `/Users/4ntith3sis/Documents/My project/fix build/easyoffice`  
**Status:** Analisis & dokumentasi. Model C (`ServiceLocations`) telah disetujui untuk dimasukkan ke rancangan schema. **Bukan implementasi.**  
**Batasan:** `Packages` wajib tetap di `Locations.packages[]`. Tidak mengubah source/config/DB/migrasi/seed/UI/route. Hanya file baru ini yang dibuat.

---

## 1. Ringkasan Eksekutif

Berdasarkan audit data aktual di `lib/data/mock-data.ts` dan `types/index.ts`:
- Terdapat **9 kombinasi** layanan-lokasi: Virtual Office (Bandung/Jakarta/Bekasi), Coworking Space (Bandung/Jakarta/Bekasi), Meeting Room (Bandung/Jakarta/Bekasi).
- **Semua paket saat ini didefinisikan di level `ServiceLocation.pricing[]`**, bukan di `Location`.
- Nama paket **bisa sama** (Basic/Business/Premium) namun **harga dan fitur berbeda** antar lokasi dan antar layanan.
- `startingPrice` berbeda per kombinasi dan tidak selalu bisa disimpulkan hanya dari lokasi tanpa konteks layanan.

Rekomendasi: **Pertahankan packages di `Locations.packages[]`**, namun **tambahkan penanda layanan yang berlaku** (mis. `applicableServices[]` berisi slug layanan, atau relationship ke `Services`) karena ada variasi harga per (layanan, lokasi). Serta **pertimbangkan menyimpan `startingPrice` di `ServiceLocations`** atau menghitungnya dari paket yang berlaku untuk kombinasi terkait.

---

## 2. Sumber Kode yang Diperiksa

- `types/index.ts:47-54` (`PricingPlan`), `types/index.ts:3-17` (`Location`), `types/index.ts:99-119` (`ServiceLocation`)
- `lib/data/mock-data.ts:29-63` (`locations[]`), `lib/data/mock-data.ts:73-157` (`services[]`), `lib/data/mock-data.ts:341-745` (`serviceLocations[]` dengan `pricing[]`), `lib/data/mock-data.ts:746-765` (`getServiceLocation`, `locationsForService`)
- `components/sections/pricing-table.tsx` (menerima `plans`, menampilkan harga/fitur)
- `app/layanan/[service]/[location]/page.tsx` (menggunakan `combo.pricing`, `combo.startingPrice`)

---

## 3. Tabel Pemetaan Lengkap Paket

### Virtual Office
| Kombinasi | startingPrice | Paket | Harga | Periode | Fitur | featured/cta |
|-----------|---------------|-------|-------|---------|-------|--------------|
| VO - Bandung | Rp 350 rb | Basic | Rp 350 rb | /bulan | Alamat bisnis, Penanganan surat, Pemberitahuan via email | default |
|  |  | Business | Rp 650 rb | /bulan | Semua fitur Basic, Layanan resepsionis, 2 jam meeting room / bulan, Nomor telepon khusus | default |
|  |  | Premium | Rp 1,2 jt | /bulan | Semua fitur Business, 8 jam meeting room / bulan, Akses coworking 4 hari / bulan, Prioritas dukungan | default |
| VO - Jakarta | Rp 450 rb | Basic | Rp 450 rb | /bulan | Alamat bisnis Jakarta Selatan, Penanganan surat, Pemberitahuan via email | default |
|  |  | Business | Rp 850 rb | /bulan | Semua fitur Basic, Layanan resepsionis, 4 jam meeting room / bulan, Nomor telepon khusus | default |
|  |  | Premium | Rp 1,6 jt | /bulan | Semua fitur Business, 12 jam meeting room / bulan, Akses coworking 8 hari / bulan, Prioritas dukungan | default |
| VO - Bekasi | Rp 300 rb | Basic | Rp 300 rb | /bulan | Alamat bisnis Bekasi, Penanganan surat, Pemberitahuan via email | default |
|  |  | Business | Rp 550 rb | /bulan | Semua fitur Basic, Layanan resepsionis, 1 jam meeting room / bulan, Nomor telepon khusus | default |
|  |  | Premium | Rp 1 jt | /bulan | Semua fitur Business, 6 jam meeting room / bulan, Akses coworking 3 hari / bulan, Prioritas dukungan | default |

### Coworking Space
| Kombinasi | startingPrice | Paket | Harga | Periode | Fitur | featured/cta |
|-----------|---------------|-------|-------|---------|-------|--------------|
| Coworking - Bandung | Rp 75 rb | Hot Desk | Rp 75 rb | /hari | Akses area kerja bersama, WiFi, Kopi/teh gratis | default |
|  |  | Dedicated Desk | Rp 1,25 jt | /bulan | Meja tetap, Loker pribadi, Akses 24/7, 4 jam meeting room / bulan | default |
|  |  | Private Office (Small) | Rp 4,5 jt | /bulan | Ruang privat, Furnitur lengkap, Akses 24/7, 10 jam meeting room / bulan | default |
| Coworking - Jakarta | Rp 95 rb | Hot Desk | Rp 95 rb | /hari | Akses area kerja bersama, WiFi, Kopi/teh gratis | default |
|  |  | Dedicated Desk | Rp 1,65 jt | /bulan | Meja tetap, Loker pribadi, Akses 24/7, 6 jam meeting room / bulan | default |
|  |  | Private Office (Small) | Rp 6 jt | /bulan | Ruang privat, Furnitur lengkap, Akses 24/7, 15 jam meeting room / bulan | default |
| Coworking - Bekasi | Rp 60 rb | Hot Desk | Rp 60 rb | /hari | Akses area kerja bersama, WiFi, Kopi/teh gratis | default |
|  |  | Dedicated Desk | Rp 1 jt | /bulan | Meja tetap, Loker pribadi, Akses 24/7, 3 jam meeting room / bulan | default |
|  |  | Private Office (Small) | Rp 3,8 jt | /bulan | Ruang privat, Furnitur lengkap, Akses 24/7, 8 jam meeting room / bulan | default |

### Meeting Room
| Kombinasi | startingPrice | Paket | Harga | Periode | Fitur | featured/cta |
|-----------|---------------|-------|-------|---------|-------|--------------|
| Meeting Room - Bandung | Rp 150 rb | 2 Jam | Rp 150 rb | /2 jam | Ruang meeting, Proyektor/TV, WiFi, Air mineral | default |
|  |  | Half Day (4 Jam) | Rp 275 rb | /4 jam | Semua fitur 2 Jam, Whiteboard, Snack ringan | default |
|  |  | Full Day (8 Jam) | Rp 500 rb | /8 jam | Semua fitur Half Day, Printer, Layanan resepsionis, Parkir tamu | default |
| Meeting Room - Jakarta | Rp 200 rb | 2 Jam | Rp 200 rb | /2 jam | Ruang meeting, Proyektor/TV, WiFi, Air mineral | default |
|  |  | Half Day (4 Jam) | Rp 375 rb | /4 jam | Semua fitur 2 Jam, Whiteboard, Snack ringan | default |
|  |  | Full Day (8 Jam) | Rp 700 rb | /8 jam | Semua fitur Half Day, Printer, Layanan resepsionis, Parkir tamu | default |
| Meeting Room - Bekasi | Rp 120 rb | 2 Jam | Rp 120 rb | /2 jam | Ruang meeting, Proyektor/TV, WiFi, Air mineral | default |
|  |  | Half Day (4 Jam) | Rp 225 rb | /4 jam | Semua fitur 2 Jam, Whiteboard, Snack ringan | default |
|  |  | Full Day (8 Jam) | Rp 420 rb | /8 jam | Semua fitur Half Day, Printer, Layanan resepsionis, Parkir tamu | default |

---

## 4. Temuan Duplikasi dan Variasi

| Temuan | Bukti | Keterangan |
|---|---|---|
| **Nama paket sama, harga berbeda** | Basic/Business/Premium, Hot Desk/Dedicated Desk/Private Office, 2 Jam/Half Day/Full Day | Sangat jelas antar lokasi dan antar layanan. |
| **Nama paket sama, fitur berbeda** | VO: Business di Bandung 2 jam meeting room, Jakarta 4 jam, Bekasi 1 jam. Coworking: jam meeting room berbeda. | Fitur spesifik berbeda per kombinasi. |
| **Paket hanya tersedia untuk layanan tertentu** | Paket VO berbeda struktur dari Coworking/Meeting Room | Tidak ada paket yang sama digunakan lintas jenis layanan. |
| **Tidak semua paket bisa dipakai lintas layanan** | Lihat tabel di atas | **Fakta:** paket bersifat spesifik per jenis layanan. |
| **`startingPrice` berbeda** | Rp 350/450/300 rb (VO), Rp 75/95/60 rb (Coworking), Rp 150/200/120 rb (Meeting Room) | Cocok dengan paket termurah per kombinasi, namun tetap spesifik per (layanan,lokasi). |
| **Format harga** | "Rp 350 rb", "Rp 1,2 jt", "Rp 75 rb" | String dengan format berbeda - **tidak bisa diasumsikan perbandingan numerik otomatis** tanpa normalisasi. |
| **`featured`, `ctaLabel`** | Tidak terlihat di data mock saat ini | Tidak ada bukti penggunaan saat ini. |

---

## 5. Perbandingan Alternatif A dan B

### Alternatif A — Packages nested dengan penanda layanan (`applicableServices`)
- **Struktur:** `Locations.packages[]` dengan tambahan `applicableServices: string[]` berisi slug layanan (atau relationship ke Services)
- **Kelebihan:** Memenuhi requirement "packages di Locations", bisa membedakan paket per layanan di lokasi yang sama, admin bisa mengelola di level lokasi dengan konteks layanan
- **Kekurangan:** Butuh validasi agar paket hanya muncul untuk layanan yang berlaku; perlu strategi query/filter
- **Kelayakan:** **Layak** berdasarkan fakta bahwa paket berbeda per layanan

### Alternatif B — Packages nested tanpa penanda layanan
- **Struktur:** `Locations.packages[]` tanpa penanda layanan
- **Kelebihan:** Lebih sederhana
- **Kekurangan:** **Tidak cukup** - karena paket benar-benar berbeda per jenis layanan dan tidak bisa dibedakan tanpa konteks. Jika semua paket lokasi ditampilkan untuk semua layanan di lokasi tersebut, akan menampilkan paket yang salah.
- **Kelayakan:** **Tidak valid** berdasarkan bukti data

**Kesimpulan:** **Alternatif A direkomendasikan**. Alternatif B tidak bisa memenuhi kebutuhan tampilan `PricingTable` yang benar per kombinasi layanan-lokasi.

---

## 6. Analisis `startingPrice`

| Pendekatan | Evaluasi | Keterangan |
|---|---|---|
| **1. Turunkan dari paket yang berlaku** | **Layak dengan syarat** | Di mock, `startingPrice` umumnya cocok dengan paket termurah untuk kombinasi tsb (VO Bandung Rp 350 rb = Basic). Namun perlu memastikan filter berdasarkan layanan yang berlaku. |
| **2. Simpan di `ServiceLocations`** | **Lebih aman** | Karena `startingPrice` spesifik per kombinasi dan bisa berbeda konteks, menyimpan di `ServiceLocations` menghindari ambiguitas dan kompatibel langsung dengan kode saat ini (`combo.startingPrice`). |

**Rekomendasi:** **Simpan `startingPrice` di `ServiceLocations`** sebagai field spesifik kombinasi. Bisa juga dihitung sebagai fallback, namun untuk kompatibilitas dengan frontend saat ini dan menghindari ambiguitas filter paket, **lebih aman disimpan di `ServiceLocations`**.

---

## 7. Rekomendasi Schema

### Struktur `Locations.packages[]` (konseptual berdasarkan data nyata)
```typescript
// Konseptual
packages: Array<{
  name: string;
  description?: string;
  price: string;        // "Rp 350 rb", "Rp 1,2 jt"
  period: string;       // "/bulan", "/hari", "/2 jam"
  features: string[];
  applicableServices: string[]; // ["virtual-office"] - WAJIB untuk membedakan
  featured?: boolean;   // hanya jika dibutuhkan
  ctaLabel?: string;    // hanya jika dibutuhkan
}>
```

### Aturan validasi
1. **Setiap paket harus memiliki `applicableServices`** (minimal satu slug layanan) untuk mencegah muncul pada layanan yang salah.
2. **Uniqueness kombinasi (service, location)** di `ServiceLocations` untuk mencegah duplikasi halaman.
3. **Filter paket:** Saat render `PricingTable` untuk kombinasi tertentu, tampilkan hanya paket dimana `applicableServices` mencakup `serviceSlug`.
4. **Validasi slug:** Pastikan slug di `applicableServices` valid terhadap collection `Services`.

---

## 8. Dampak Terhadap Normalisasi Frontend

- **Data access layer** perlu menggabungkan: `Services` (umum) + `Locations` (umum + packages) + `ServiceLocations` (khusus kombinasi) + filter packages berdasarkan layanan
- **`getServiceLocation`** harus mengembalikan bentuk kompatibel dengan `types/index.ts` (termasuk `pricing[]`, `startingPrice`)
- **`PricingTable`** bisa tetap menerima `plans` - cukup pastikan hanya paket yang berlaku yang dikirim
- **`generateStaticParams`** dibangun dari dokumen `ServiceLocations`
- **Route/UI tidak berubah**

---

## 9. Keputusan yang Memerlukan Persetujuan

| Keputusan | Penjelasan | Status |
|---|---|---|
| **Tambahkan `applicableServices` ke `Locations.packages[]`** | Diperlukan karena paket berbeda per layanan. Alternatif tanpa penanda tidak valid berdasarkan bukti. | **Memerlukan persetujuan** |
| **Simpan `startingPrice` di `ServiceLocations`** | Lebih aman dan kompatibel dengan kode saat ini. Bisa diturunkan jika logika filter terbukti konsisten, namun penyimpanan eksplisit lebih aman. | **Memerlukan persetujuan** |
| **Filter paket berdasarkan layanan saat render** | Harus diterapkan untuk menghindari menampilkan paket yang salah. | **Memerlukan persetujuan** |

---

## 10. Kesimpulan

- **Semua 9 kombinasi + paket lengkap** telah dipetakan dari data aktual tanpa rekayasa nilai.
- **Konflik teridentifikasi:** Nama paket sama tapi harga/fitur berbeda per kombinasi; paket spesifik per jenis layanan.
- **`Packages` tetap di `Locations.packages[]`** sesuai requirement.
- **Diperlukan `applicableServices`** untuk membedakan paket antar layanan - **Alternatif A direkomendasikan, Alternatif B tidak layak**.
- **`startingPrice` direkomendasikan disimpan di `ServiceLocations`** untuk menghindari ambiguitas.
- **Tidak ada perubahan** pada source code, config, database, migrasi, atau seed.

**BERHENTI - Menunggu persetujuan atas keputusan di §9 sebelum implementasi.**
