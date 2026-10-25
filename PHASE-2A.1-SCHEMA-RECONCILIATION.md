# PHASE 2A.1 — RECONCILIATION SCHEMA DENGAN REQUIREMENT EASYOFFICE

**Project:** `/Users/4ntith3sis/Documents/My project/fix build/easyoffice`  
**Referensi:** `PHASE-1-AUDIT-REPORT.md`, `lib/data/mock-data.ts` (848 baris), `types/index.ts`, halaman/komponen yang menggunakan data  
**Status:** Hanya rekonsiliasi & perancangan. **Tidak ada implementasi, instalasi, migrasi, seed, perubahan DB/config/source code.**

---

## 1. Baseline Database & Status Keputusan

Berdasarkan requirement yang dikonfirmasi, baseline collections/globals adalah:

| Entity | Tipe | Status | Keterangan |
|---|---|---|---|
| **Services** | Collection | **Disetujui (baseline)** | Katalog layanan. Harus mendukung info layanan dan hubungannya dengan lokasi yang menyediakan layanan. Bentuk relasi perlu disesuaikan dengan kompatibilitas frontend. |
| **Locations** | Collection | **Disetujui (baseline)** | Mengelola lokasi. **Packages harus bersarang (array/struktur bertingkat) di dalam Locations**, bukan collection terpisah. Setiap lokasi bisa punya beberapa paket harga. |
| **Testimonials** | Collection | **Disetujui (baseline)** | Hanya field yang benar-benar dibutuhkan berdasarkan data aktual. Tidak menambah `avatar`/`isFeatured`/`order` tanpa dasar. |
| **Promotions** | Collection | **Disetujui (baseline)** | Status **Active/Inactive**. Promosi Inactive tetap tersimpan di CMS tapi **tidak ditampilkan** ke pengunjung. Relasi ke Services hanya jika diperlukan & sesuai requirement. |
| **FAQs** | Collection | **Disetujui (baseline)** | Tetap sebagai collection utama. Tidak dipindah ke Global tanpa alasan kuat berbasis requirement. |
| **Media** | Collection | **Disetujui (baseline)** | Penyimpanan lokal. **Pertahankan URL gambar eksternal (Unsplash)** selama migrasi belum disetujui. Jangan unduh/pindahkan aset. |
| **Leads** | Collection | **Disetujui (baseline)** | Dari formulir website sesuai alur yang ada. Tidak menambah field sensitif/mekanisme baru tanpa dasar. |
| **Users** | Collection (Auth) | **Disetujui (baseline)** | Role admin dan editor. Rincian izin sesuai requirement. Tidak membuat akun/kredensial/matriks baru saat ini. |
| **SiteSettings** | Global | **Disetujui (baseline)** | Pengaturan umum. Jangan memindahkan info spesifik per lokasi ke Global. |

---

## 2. Ketidaksesuaian Draft Sebelumnya dengan Requirement

| Item di draft sebelumnya | Status vs Requirement | Koreksi |
|---|---|---|
| `ServiceLocations` sebagai collection terpisah dengan relasi Services-Locations + tagline/pricing/facilities/faqs/gallery | **Belum disetujui** | Jangan langsung menambah collection ini. Lakukan analisis kebutuhan spesifik kombinasi layanan-lokasi dan tempatkan data ke entitas yang tepat (Services/Locations/packages nested). Hanya jika terbukti mutlak diperlukan oleh frontend/route dan tidak bisa ditempatkan di baseline, tambahkan dengan persetujuan. |
| `Packages` sebagai collection tersendiri dengan relasi ke Services/Locations | **Tidak sesuai baseline** | **Packages harus bersarang di Locations** (array/struktur bertingkat). Tidak membuat collection `Packages`. |
| `Facilities` sebagai collection terpisah | **Tidak disetujui tanpa dasar** | Jangan buat collection terpisah. Fasilitas umum vs spesifik perlu dibedakan; jika tidak ada requirement eksplisit untuk mengelolanya terpusat, jangan ditambahkan. |
| `GeneralFaqs` sebagai Global terpisah | **Tidak disetujui tanpa dasar** | FAQ tetap sebagai collection utama sesuai baseline. |
| `Comparison` sebagai Global otomatis | **Tidak disetujui tanpa dasar** | Hanya buat Global jika ada kebutuhan eksplisit dari requirement. Saat ini perlu dicek kebutuhan aktual. |
| Menambah `seoTitle/seoDescription`, `isFeatured`, `order`, `relatedService` sebagai requirement final | **Tidak ada bukti cukup** | Ditandai sebagai **rekomendasi teknis/opsional** saja, bukan keputusan bisnis yang sudah disepakati. |

---

## 3. Koreksi: Packages Bersarang di Locations

**Fakta dari source:** `lib/data/mock-data.ts` menunjukkan setiap `ServiceLocation` punya `pricing[]` (array `PricingPlan`), dan halaman `app/layanan/[service]/[location]/page.tsx` merender `PricingTable` berdasarkan `combo.pricing`. Namun **baseline requirement** menyatakan: *"Packages harus disimpan sebagai array atau struktur bertingkat di dalam Locations, bukan sebagai collection tersendiri."*

**Rekomendasi pemodelan (sesuai baseline):**
Letakkan paket harga di dalam collection `Locations` sebagai field array bertingkat, misalnya `packages` dengan struktur:

| Field Paket (di Locations.packages[]) | Tipe Payload (usulan) | Required | Validasi | Dasar Kebutuhan |
|---|---|---|---|---|
| `name` | Text | Ya | - | Nama paket (fakta dari `PricingPlan.name`) |
| `description` | Textarea | Opsional | - | Deskripsi paket jika ada di data aktual |
| `price` | Text | Ya | - | Harga (fakta) |
| `period`/`unit` | Text | Ya | - | Periode/unit harga (fakta `PricingPlan.period`) |
| `features` | Array of Text | Ya | - | Fitur/keunggulan (fakta `PricingPlan.features[]`) |
| `discountInfo` | Text/Textarea | Opsional | - | Hanya jika ada di requirement/data aktual (saat ini tidak terlihat eksplisit sebagai kebutuhan wajib) |
| `featured` | Checkbox | **Tidak wajib** | - | Bukan requirement baseline; hanya rekomendasi teknis jika benar-benar dibutuhkan UI |
| `ctaLabel` | Text | Opsional | - | Bisa diturunkan/diatur; perlu verifikasi kebutuhan aktual |

**Catatan penting:**
- Tidak ada relasi `Packages` -> `Services`/`Locations` karena Packages **bukan collection tersendiri**.
- Setiap lokasi dapat memiliki beberapa paket. Ini sesuai dengan fakta bahwa harga bisa berbeda per lokasi, namun penempatannya dipindah ke `Locations.packages[]` sesuai baseline requirement.

---

## 4. Evaluasi ServiceLocations & Data yang Ditempatkan Di Dalamnya

### Data di `serviceLocations[]` (mock) saat ini
Dari `types/index.ts:99-119` dan `lib/data/mock-data.ts:341-745`:
- `serviceSlug`, `locationSlug` (identitas kombinasi)
- `tagline`
- `startingPrice`
- `pricing[]` (PricingPlan)
- `facilities[]` (Facility)
- `faqs[]` (Faq)
- `whatsapp?` (override)
- `image`, `imageAlt` (hero unik per combo)
- `gallery[]` (3 gambar unik per combo)

### Pemisahan kebutuhan
| Item | Rekomendasi Penempatan | Alasan |
|---|---|---|
| `pricing[]` | **Bersarang di `Locations.packages[]`** (sesuai baseline) | Baseline menyatakan packages di Locations. Namun perlu diperhatikan: di mock, paket bisa berbeda per (service,location). Jika paket benar-benar spesifik per kombinasi layanan-lokasi, penempatan di Locations saja bisa kurang fleksibel — **perlu keputusan pengguna**. |
| `tagline` | **Perlu analisis** | Saat ini muncul di hero halaman service×location. Bisa jadi milik konteks kombinasi atau bisa diturunkan. Belum jelas apakah wajib dikelola terpisah. |
| `startingPrice` | **Perlu analisis** | Bisa diturunkan dari `packages` terendah di lokasi, atau perlu spesifik per kombinasi. **Belum diputuskan**. |
| `facilities[]` | **Perlu analisis** | Bisa milik lokasi atau spesifik per kombinasi. Tidak ada collection Facilities di baseline; jika spesifik per kombinasi, perlu tempat penyimpanan. |
| `faqs[]` | **FAQ tetap collection** per baseline, namun FAQ per kombinasi layanan-lokasi perlu dipetakan. Bisa berupa relasi/filter atau nested — **perlu keputusan**. |
| `whatsapp?` override | **Bisa di Locations** atau per konteks | Ada di `Location.whatsapp`; override saat ini ada di combo. Perlu verifikasi kebutuhan. |
| `image`, `imageAlt`, `gallery[]` | **Perlu analisis** | Unik per kombinasi di mock. Bisa dikelola di konteks yang tepat; perlu pastikan kompatibel dengan Next/Image dan media lokal. |

### Alternatif pemodelan (tanpa langsung menambah collection `ServiceLocations`)
1. **Alternatif A: Hanya Services + Locations (+ packages nested di Locations)**
   - **Pro:** Sesuai persis baseline requirement.
   - **Kontra:** Jika `tagline`, `facilities` spesifik, FAQ spesifik, gambar/galeri spesifik benar-benar berbeda per (service,location) dan **tidak bisa** direpresentasikan oleh data layanan/lokasi saja, halaman `/layanan/[service]/[location]` bisa kehilangan konteks. Perlu verifikasi apakah data saat ini benar-benar spesifik atau bisa disederhanakan.
2. **Alternatif B: Tambah collection `ServiceLocations` (hanya jika terbukti perlu)**
   - **Pro:** Paling kompatibel dengan struktur mock saat ini, menjaga fleksibilitas per kombinasi.
   - **Kontra:** **Belum disetujui** di baseline. Menambah collection baru tanpa persetujuan bertentangan dengan instruksi.
3. **Alternatif C: Hybrid**
   - Packages di Locations, info umum di Services/Locations, **hanya elemen yang benar-benar spesifik per kombinasi** yang dikelola terpisah (jika ada yang tak bisa ditempatkan). **Perlu identifikasi elemen tersebut**.

### Dampak terhadap route/helper/frontend
| Aspek | Dampak jika hanya A | Dampak jika B (hanya jika disetujui) |
|---|---|---|
| `/layanan/[service]` | Umumnya bisa dipetakan dari Services + Locations yang menyediakan layanan | Mirip saat ini |
| `/layanan/[service]/[location]` | Bergantung pada apakah semua data tersedia di Services/Locations. Jika ada yang hilang, UI bisa beda. **Perlu audit elemen spesifik** | Paling mirip dengan mock |
| `getService/getLocation/getServiceLocation/locationsForService/getServiceLocationsForLocation` | Helper perlu diadaptasi (bisa berbasis relasi berbeda). Nama helper tidak wajib dipertahankan, yang penting bentuk data kompatibel. | Bisa mendekati struktur saat ini |
| `generateStaticParams` | Bisa dibangun dari kombinasi Services×Locations yang valid (jika relasi ada) | Dari collection ServiceLocations |

**Kesimpulan:** Belum cukup bukti untuk memutuskan antara A/B/C. **Perlu keputusan pengguna** apakah kombinasi layanan-lokasi memerlukan entitas terpisah atau bisa sepenuhnya direpresentasikan oleh Services + Locations dengan packages nested.

---

## 5. Facilities, FAQs, Comparison Data

| Item | Status Baseline | Analisis | Rekomendasi |
|---|---|---|---|
| **Facilities** | Tidak ada di baseline | Di mock: `allFacilities` untuk homepage (slice 6), dan `facilities[]` nested per `ServiceLocation`. Tidak ada requirement eksplisit untuk collection terpisah. | **Jangan buat collection `Facilities`**. Jika fasilitas per lokasi/kombinasi perlu dikelola, pertimbangkan nested di entitas yang tepat. Homepage bisa mengambil dari sumber yang ada. |
| **FAQs** | Collection utama (disetujui) | `generalFaqs` dipakai di halaman Kontak, FAQ per combo dipakai di halaman layanan. Baseline menyatakan FAQ tetap sebagai collection utama. | **Pertahankan sebagai collection `FAQs`**. Jangan pindah ke Global otomatis. Jika ada FAQ spesifik per konteks, perlu dipetakan (bisa relasi/filter) tanpa membuat Global terpisah tanpa alasan. |
| **Comparison Data** | Tidak disebut eksplisit di baseline | `comparisonRows[]` ada di mock, dipakai `ComparisonTable`. Bentuk array sederhana. | **Tidak otomatis jadi Global.** Hanya jika requirement menyatakan perlu dikelola di CMS, bisa dipertimbangkan sebagai Global atau collection. Saat ini **belum ada dasar requirement** — tandai sebagai perlu konfirmasi. |

---

## 6. Field per Collection (Berdasarkan Kebutuhan Aktual)

Hanya field dengan dasar kebutuhan yang dicantumkan. Field teknis Payload (id, timestamps) tidak dibahas sebagai keputusan bisnis.

### Services
| Field | Tipe Payload (usulan) | Required | Validasi | Dasar |
|---|---|---|---|---|
| `title` | Text | Ya | - | Fakta (`Service.title`) |
| `slug` | Text | Ya | Unik | Fakta, digunakan routing |
| `shortTitle` | Text | Opsional | - | Ada di tipe, bisa berguna UI |
| `description` | Textarea | Ya | - | Fakta |
| `intro` | Textarea | Ya | - | Fakta (digunakan di hero layanan) |
| `benefits` | Array of Text | Ya | - | Fakta |
| `features` | Array of Text | Opsional | - | Ada di tipe; hanya jika digunakan |
| `icon` | Text | Opsional | - | Ada di tipe; verifikasi penggunaan |
| `image` | Upload/Relationship to Media atau Text(URL) | Ya | - | Fakta (unik per service) |
| `imageAlt` | Text | Ya | - | Aksesibilitas |
| `href` | Text | Opsional | - | Bisa diturunkan dari slug; jangan wajibkan duplikasi |

### Locations
| Field | Tipe Payload (usulan) | Required | Validasi | Dasar |
|---|---|---|---|---|
| `name` | Text | Ya | - | Fakta |
| `slug` | Text | Ya | Unik | Fakta, routing/filter |
| `description`/`shortDescription` | Textarea | Ya | - | Fakta |
| `address` | Textarea | Ya | - | Fakta |
| `operatingHours` | Text | Ya | - | Fakta |
| `email` | Email | Ya | Format email | Fakta |
| `phoneDisplay` | Text | Ya | - | Fakta |
| `whatsapp` | Text | Ya | Format wa.me friendly | Fakta |
| `image` | Upload/URL | **Perlu konfirmasi** | - | Tertulis "gambar kantor" di requirement; ada indikasi penggunaan di konteks lokasi/hero |
| `packages` | Array of blocks/objects | Ya | Min items | **Baseline: wajib bersarang di Locations** (lihat §3) |

### Testimonials
| Field | Tipe Payload (usulan) | Required | Validasi | Dasar |
|---|---|---|---|---|
| `name` | Text | Ya | - | Fakta |
| `company` | Text | Ya | - | Fakta |
| `quote` | Textarea | Ya | - | Fakta |

*(Tidak menambah avatar/featured/order tanpa dasar)*

### Promotions
| Field | Tipe Payload (usulan) | Required | Validasi | Dasar |
|---|---|---|---|---|
| `badge` | Text | Ya | - | Fakta |
| `title` | Text | Ya | - | Fakta |
| `description` | Textarea | Ya | - | Fakta |
| `period` | Text | Ya | - | Fakta |
| `status` | Select (`Active`, `Inactive`) | Ya | - | **Baseline: Active/Inactive**. Inactive tetap tersimpan, tidak ditampilkan. |
| `image` | Upload/URL | Opsional | - | Bisa bergantung strategi; tidak wajib jika mapping berubah |
| `relatedService` | Relationship -> `Services` | Opsional | - | Hanya jika diperlukan sesuai requirement (saat ini ada mapping di frontend) |

### FAQs
| Field | Tipe Payload (usulan) | Required | Validasi | Dasar |
|---|---|---|---|---|
| `question` | Text | Ya | - | Fakta |
| `answer` | Textarea/RichText | Ya | - | Fakta |
| `category`/konteks | Select/Text | Opsional | - | Hanya jika diperlukan untuk membedakan konteks (general vs lain) tanpa memindahkan ke Global |

### Media, Leads, Users, SiteSettings
- **Media:** Sesuai collection Payload standar dengan storage lokal `public/media`. Pertahankan remote patterns untuk URL eksternal.
- **Leads:** Field mengikuti formulir yang ada saat ini. Tidak menambah field sensitif baru.
- **Users:** Auth collection dengan role `admin`/`editor` sesuai requirement. Belum buat akun.
- **SiteSettings (Global):** Hanya info umum (name, tagline, email, phoneDisplay, dll) yang benar-benar global. Tidak memindahkan info per-lokasi.

---

## 7. Relasi, Helper & Kompatibilitas Frontend

### Relasi yang disarankan (sesuai baseline)
- **Services 1:N ?** - Perlu didefinisikan hubungan dengan Locations. Apakah "hubungannya dengan lokasi yang menyediakan layanan tersebut" berarti relasi banyak-ke-banyak, atau bisa dilihat dari ketersediaan paket di Locations? **Perlu klarifikasi**.
- **Locations** berisi `packages[]` (nested) - tidak ada relasi Packages collection.
- **Promotions** bisa opsional relasi ke Services.

### Helper yang ada (hanya referensi)
- `getService(slug)`, `getLocation(slug)`, `getServiceLocation(serviceSlug, locationSlug)`, `locationsForService(serviceSlug)`, `getServiceLocationsForLocation(locationSlug)` di `lib/data/mock-data.ts`
- `generateStaticParams` di `app/layanan/[service]/page.tsx` dan `app/layanan/[service]/[location]/page.tsx`

**Prinsip:** Nama helper **tidak wajib dipertahankan persis**. Yang penting adalah **bentuk data yang dikembalikan kompatibel** dengan komponen. Data access layer (Payload Local API) nanti harus menormalisasi hasil query agar komponen bisa tetap bekerja tanpa mengubah route/UI.

### Catatan kompatibilitas
Jika Services tidak lagi menjadi sumber utama untuk sebagian data yang saat ini ada di `ServiceLocation` (tagline/fasilitas spesifik/galeri spesifik), perlu dipastikan ada sumber data pengganti. Ini adalah alasan utama kenapa `ServiceLocations` perlu dikaji lebih lanjut sebelum memutuskan.

---

## 8. Database & Arsitektur (Dipertahankan)

- **PostgreSQL lokal:** Homebrew, berjalan di **port 5432** (terverifikasi). Service `postgresql@16` started.
- **Database target:** `easyoffice_cms` - **tidak ditemukan** di instance 5432 yang berhasil diakses.
- **Port 5433:** Sesuai `.env` project, namun **koneksi belum terverifikasi** karena autentikasi gagal. **Tidak menyimpulkan** status di instance 5433.
- **Aksi dilarang:** Tidak membuat/menghapus database, tidak mengubah role/config, tidak ubah `.env`.
- **Arsitektur:** Payload Local API di server Next.js, mock jadi sumber awal setelah schema disetujui, PostgreSQL lokal (bukan Docker), Puck ditunda, frontend dipertahankan.

---

## 9. Risiko & Keputusan yang Masih Memerlukan Persetujuan

| Risiko/Keputusan | Tingkat | Keterangan |
|---|---|---|
| **Penempatan packages** | Sedang-Tinggi | Baseline bilang "packages di Locations", tapi di mock paket bisa beda per (service,location). Perlu konfirmasi: apakah paket benar-benar milik lokasi (bisa dipakai lintas konteks) atau spesifik per kombinasi layanan-lokasi? |
| **Kebutuhan collection `ServiceLocations`** | Tinggi | Belum disetujui. Perlu putusan setelah mengidentifikasi elemen mana yang **benar-benar tidak bisa** ditempatkan di Services/Locations. Jika mutlak diperlukan untuk route halaman detail, perlu persetujuan eksplisit untuk menambah collection. |
| **Relasi Services-Locations** | Tinggi | "Data harus mendukung informasi layanan dan hubungannya dengan lokasi yang menyediakan layanan tersebut" - perlu bentuk relasi (many-to-many via apa?) yang disepakati. |
| **FAQ spesifik per konteks** | Sedang | FAQ tetap collection, tapi FAQ per service×location perlu dipetakan. Perlu strategi tanpa membuat Global baru. |
| **Comparison Data** | Sedang | Perlu konfirmasi apakah perlu dikelola di CMS atau tetap statis. |
| **Gambar kantor di Locations** | Sedang | Requirement menyebut "Gambar kantor" di Locations - perlu konfirmasi wajib/tidak. |
| **Promotions status** | Rendah-Sedang | Sudah jelas Active/Inactive, tapi perilaku filter di frontend perlu dipastikan. |

---

## 10. Tindakan Implementasi yang Baru Boleh Dilakukan Setelah Persetujuan

**Hanya setelah persetujuan eksplisit atas laporan ini:**
1. Finalisasi keputusan tentang `ServiceLocations` (tambah/tidak) dan bentuk relasi Services-Locations
2. Konfirmasi penempatan packages (di Locations seperti baseline) dan penanganan kasus perbedaan harga per kombinasi
3. Instalasi dependencies Payload (jika disetujui)
4. Buat `payload.config.ts` dan collections sesuai keputusan final
5. Setup koneksi DB ke `easyoffice_cms` (setelah verifikasi koneksi aman/keputusan port)
6. Migration schema
7. Integrasi frontend bertahap via Payload Local API dengan normalisasi data

**Saat ini:** Tidak ada tindakan di atas yang dilakukan.

---

## KESIMPULAN PHASE 2A.1

- **Baseline dipertahankan:** Services, Locations (dengan **packages nested**), Testimonials, Promotions (Active/Inactive), FAQs (collection), Media (lokal + pertahankan URL eksternal), Leads, Users (admin/editor), SiteSettings (Global) - sesuai requirement.
- **Koreksi draft:** `ServiceLocations` sebagai collection terpisah **belum disetujui**. `Packages` **tidak dibuat sebagai collection** terpisah, harus bersarang di Locations. `Facilities` terpisah, `GeneralFaqs` Global, `Comparison` Global tidak dibuat otomatis tanpa dasar.
- **Analisis kritis:** Data yang saat ini di `serviceLocations` perlu dipetakan ke entitas yang tepat. Ada kemungkinan beberapa elemen (tagline, fasilitas spesifik, FAQ spesifik, gambar/galeri spesifik) **belum punya tempat** jika hanya menggunakan Services+Locations - **perlu keputusan pengguna** apakah cukup dengan baseline atau perlu menambah entitas terpisah.
- **Frontend kompatibel:** Helper/nama helper tidak wajib dipertahankan persis; yang penting bentuk data ternormalisasi kompatibel dengan komponen. Route/UI tidak diubah.
- **DB aman:** PostgreSQL 5432 terverifikasi, `easyoffice_cms` belum ditemukan di instance tersebut, 5433 belum terverifikasi. Tidak ada perubahan DB/config.
- **Hanya file baru:** `PHASE-2A.1-SCHEMA-RECONCILIATION.md` dibuat. Tidak ada file lain diubah/ditimpa.

**BERHENTI - Menunggu persetujuan pengguna atas rekonsiliasi ini sebelum implementasi.**
