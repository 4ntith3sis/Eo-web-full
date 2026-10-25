# PHASE 2A.2 — VALIDASI PEMETAAN DATA EASYOFFICE

**Project:** `/Users/4ntith3sis/Documents/My project/fix build/easyoffice`  
**Referensi:** `PHASE-1-AUDIT-REPORT.md`, `PHASE-2A-SCHEMA-DRAFT.md`, `PHASE-2A.1-SCHEMA-RECONCILIATION.md`, `lib/data/mock-data.ts`, `types/index.ts`, halaman/komponen terkait  
**Status:** Hanya pembacaan & analisis. **Tidak ada perubahan source code, tipe, mock data, route, config, DB, migrasi/seed, atau instalasi.**

---

## 1. Matriks Field → Sumber → Halaman/Komponen → Calon Entitas Database

| Field/Entitas | Sumber Saat Ini (fakta) | Halaman/Komponen Pengguna | Calon Entitas DB | Catatan |
|---|---|---|---|---|
| **Services** | `services[]` di `lib/data/mock-data.ts:73-157` (tipe `Service` di `types/index.ts:19-33`) | `app/layanan/[service]/page.tsx` (`getService`, `generateStaticParams`), `components/sections/services-overview.tsx`, `components/layout/footer.tsx`, `app/promo/page.tsx` (mapping), `app/page.tsx` (via komponen) | **Services (Collection)** - baseline disetujui | `slug` unik, dipakai untuk routing `/layanan/[service]`. |
| **Locations** | `locations[]` di `lib/data/mock-data.ts:29-63` (tipe `Location` di `types/index.ts:3-17`) | `app/layanan/[service]/[location]/page.tsx` (`getLocation`), `components/sections/location-selector.tsx`, `components/sections/location-detail-card.tsx`, `components/sections/location-card.tsx`, `components/layout/footer.tsx` | **Locations (Collection)** - baseline disetujui | Berisi info lokasi + **packages[] nested** (wajib sesuai baseline). |
| **Packages (nested)** | `serviceLocations[].pricing[]` berbentuk `PricingPlan[]` (`types/index.ts:47-54`, `lib/data/mock-data.ts:341-745`) | `app/layanan/[service]/[location]/page.tsx` lewat `combo.pricing` → `components/sections/pricing-table.tsx` | **Locations.packages[] (nested array/blocks)** - **wajib**, bukan collection terpisah | Baseline tegas: packages bersarang di Locations. Lihat §3. |
| **Testimonials** | `testimonials[]` `lib/data/mock-data.ts:774-815` (`types/index.ts:62-66`) | `components/sections/testimonials.tsx`, dipakai di home & halaman layanan | **Testimonials (Collection)** - baseline | Hanya name/company/quote sesuai fakta. |
| **Promotions** | `promotions[]` `lib/data/mock-data.ts:817-839` (`types/index.ts:68-73`) | `components/sections/promo-section.tsx`, `app/promo/page.tsx` | **Promotions (Collection)** - baseline, **status Active/Inactive** | Inactive tidak ditampilkan. `promoServices` mapping saat ini hardcoded ke `[services[0],services[2],services[1]]`. |
| **FAQs (umum)** | `generalFaqs[]` `lib/data/mock-data.ts:219-317` (`types/index.ts:62`) | `app/kontak/page.tsx:181` → `components/sections/faq.tsx` | **FAQs (Collection)** - baseline tetap collection utama | Tidak dipindah ke Global tanpa alasan kuat. |
| **FAQs (per konteks)** | `serviceLocations[].faqs[]` + `preview.faqs` dari landing service | `app/layanan/[service]/page.tsx:157` (dari preview combo), `app/layanan/[service]/[location]/page.tsx:137` | **FAQs (Collection)** dengan cara pemetaan/filter, atau nested jika mutlak butuh konteks spesifik | Perlu strategi tanpa membuat Global otomatis. |
| **Facilities (homepage)** | `allFacilities` (dari `facilityPool`) `lib/data/mock-data.ts:213` + `components/sections/facilities-grid.tsx` default | `app/page.tsx:4,27` (slice 6) | Belum ada di baseline collection terpisah | Default `items = allFacilities`. Tidak ada dasar requirement untuk collection terpisah. |
| **Facilities (per combo)** | `serviceLocations[].facilities[]` `lib/data/mock-data.ts` per combo | `app/layanan/[service]/[location]/page.tsx:132` → `FacilitiesGrid` dengan `items={combo.facilities}` | Perlu penempatan (nested di entitas yang tepat) | Bisa spesifik per kombinasi - **perlu keputusan** penempatannya. |
| **Comparison** | `comparisonRows[]` `lib/data/mock-data.ts:841-847` (`types/index.ts:75-79`) | `components/sections/comparison-table.tsx:2,27`, dipakai di home/layanan | Belum ada di baseline; tidak otomatis jadi Global/collection | Hanya jika dibutuhkan dikelola di CMS. |
| **Media/Gambar** | URL Unsplash + `combo.image/gallery`, `service.image`, promo mapping | Berbagai halaman/komponen, `next.config.ts` allowlist Unsplash | **Media (Collection)** + pertahankan URL eksternal | Jangan unduh/pindahkan. |
| **Leads** | Form di `components/sections/contact-form.tsx` (name, business, email, phone, topic, message) → submit via `whatsappUrl` | `app/kontak/page.tsx:123` | **Leads (Collection)** - baseline | Hanya berdasarkan form yang ada. Tidak tambah mekanisme baru. |
| **Users/SiteSettings** | `site` object `lib/data/mock-data.ts:38-44`, auth kebutuhan | `components/layout/footer.tsx`, `app/kontak/page.tsx` | **Users (Auth), SiteSettings (Global)** - baseline | SiteSettings hanya info umum, bukan spesifik per lokasi. |

---

## 2. Matriks Variasi Data Berdasarkan Layanan dan Lokasi

Dianalisis dari `lib/data/mock-data.ts` dan penggunaan halaman:

| Aspek | Observasi (fakta) | Variasi? | Catatan |
|---|---|---|---|
| **Ketersediaan layanan per lokasi** | `serviceLocations[]` hanya berisi kombinasi yang tersedia. `locationsForService(serviceSlug)` mengembalikan lokasi yang punya `ServiceLocation` untuk service tsb. `app/layanan/[service]/page.tsx:53` menggunakan `locationsForService`. | **Ya** - tidak semua kombinasi ada | Menentukan kombinasi valid. |
| **Harga/paket** | `PricingPlan` per `ServiceLocation`. Nama paket bisa sama tapi harga bisa berbeda per lokasi (komentar di `types/index.ts:99-101`). | **Ya** | Sangat spesifik per kombinasi di mock. Ini konflik potensial dengan "packages di Locations" jika paket hanya milik lokasi. Lihat §3. |
| **Tagline** | `combo.tagline` berbeda per combo; dipakai di hero metadata/description dan card (`app/layanan/[service]/[location]/page.tsx:41,71`, `components/sections/location-card.tsx:35`) | **Ya** | Spesifik per (service,location). |
| **StartingPrice** | `combo.startingPrice` per combo, ditampilkan di card | **Ya** | Spesifik per kombinasi. |
| **Facilities** | `combo.facilities[]` per combo, passed ke `FacilitiesGrid` di halaman detail | **Ya** | Bisa berbeda per kombinasi. Berbeda dari `allFacilities` homepage. |
| **FAQs** | `combo.faqs[]` per combo, `preview.faqs` untuk landing service | **Ya** | Spesifik per kombinasi. |
| **WhatsApp override** | `combo.whatsapp?` override, else fallback ke lokasi (`locationWhatsappNumber`) | **Kadang** | Ada kemungkinan override. |
| **Hero image & gallery** | `combo.image/imageAlt` unik per combo, `gallery[]` 3 foto unik per combo (komentar di tipe) | **Ya** | Sangat spesifik per kombinasi. |

**Fakta kunci:** `getServiceLocation(serviceSlug, locationSlug)` mengembalikan entitas gabungan yang mengontrol sebagian besar konten halaman `/layanan/[service]/[location]`. `locationsForService` menentukan lokasi yang tersedia untuk sebuah layanan.

---

## 3. Analisis Packages yang Bersarang di Locations

### Temuan
- **Baseline requirement (wajib):** Packages harus bersarang di Locations, bukan collection tersendiri.
- **Fakta mock:** `pricing[]` ada di `ServiceLocation` (bukan di `Location`). `PricingTable` menerima `plans={combo.pricing}` dari halaman detail.
- **Komponen:** `components/sections/pricing-table.tsx` hanya menerima `plans` (prop) - tidak peduli asal datanya, selama shape sesuai `PricingPlan`.

### Konflik
Ada ketegangan antara baseline ("packages di Locations") dan struktur saat ini ("pricing di ServiceLocation"). Di mock, **harga bisa berbeda antar layanan dalam lokasi yang sama** maupun antar lokasi - kalau packages hanya ada di level `Locations`, sulit merepresentasikan harga yang berbeda per layanan tanpa struktur tambahan.

### Pilihan Penyelesaian (tanpa mengubah baseline sepihak)
| Opsi | Deskripsi | Pro | Kontra |
|---|---|---|---|
| **A. Packages di Locations (sesuai baseline)** | Pindahkan `packages[]` ke `Locations`. Asumsikan paket berlaku untuk layanan yang relevan atau struktur sudah cukup. | Sesuai persis baseline requirement. | Mungkin tidak cukup jika paket **benar-benar berbeda per (service,location)** dan tidak bisa direpresentasikan. Perlu verifikasi kebutuhan. |
| **B. Packages nested di Locations dengan konteks layanan** | Tetap di Locations, tambahkan penanda layanan/kelompok jika diperlukan. | Tetap di Locations sesuai baseline. | Bisa kompleks, perlu validasi cocok dengan data aktual. |
| **C. Pertahankan fleksibilitas dengan mempertimbangkan ServiceLocations hanya jika mutlak perlu** | Hanya menambah entitas terpisah **setelah bukti** bahwa A/B tidak bisa memenuhi kebutuhan halaman `/layanan/[service]/[location]`. | Minimal, tidak menambah collection tanpa alasan. | Membutuhkan analisis mendalam per elemen. **Saat ini belum ada keputusan.** |

**Rekomendasi:** **Ikuti baseline dulu (packages di Locations)**, namun **verifikasi** apakah semua kasus di mock bisa dipetakan. Jika ada kasus dimana paket benar-benar tidak bisa direpresentasikan, **laporkan konflik dan minta persetujuan** sebelum menambah collection apapun. **Tidak mengubah baseline secara sepihak.**

---

## 4. Rekomendasi Relasi Services–Locations

### Fakta saat ini
- `services[]` dan `locations[]` ada terpisah.
- Kombinasi valid ditentukan oleh keberadaan `serviceLocations[]` (lihat `locationsForService`, `getServiceLocation`).
- `generateStaticParams` untuk `/layanan/[service]/[location]` dibangun dari `serviceLocations.map(...)` di `app/layanan/[service]/[location]/page.tsx:23-28`.
- `generateStaticParams` untuk `/layanan/[service]` dibangun dari `services.map(...)` di `app/layanan/[service]/page.tsx:26`.

### Kebutuhan
"Data harus mendukung informasi layanan dan hubungannya dengan lokasi yang menyediakan layanan tersebut."

### Rekomendasi Bentuk Relasi (tanpa menambah collection baru secara otomatis)
| Pendekatan | Deskripsi | Kesesuaian | Catatan |
|---|---|---|---|
| **A. Many-to-Many via ketersediaan (berdasarkan packages/keberadaan)** | Relasi ditentukan dari keberadaan paket di Locations untuk layanan tertentu atau dari mapping eksplisit. | **Sederhana**, sesuai baseline (packages di Locations). | Perlu cara untuk menentukan "lokasi mana yang menyediakan layanan X". Bisa via field di Locations (array layanan yang tersedia) atau diturunkan. **Perlu klarifikasi**. |
| **B. Many-to-Many relation Services <-> Locations** | Tambah relasi many-to-many di Payload (tanpa collection perantara terpisah jika menggunakan built-in many-to-many). | Fleksibel. | **Bukan collection `ServiceLocations` terpisah** - bisa berupa relationship array. Perlu memastikan kompatibel dengan `locationsForService`. |
| **C. Biarkan ditentukan oleh data kombinasi (hanya jika ada entitas kombinasi disetujui)** | Jika terbukti mutlak perlu, pertimbangkan entitas perantara **hanya dengan persetujuan**. | Mirip struktur saat ini. | **Belum disetujui** per Phase 2A.1. |

**Rekomendasi:** **Utamakan A atau B** yang tidak menciptakan collection `ServiceLocations` baru. Yang penting `locationsForService(serviceSlug)` bisa direkonstruksi dan `generateStaticParams` untuk route dinamis tetap bisa dibangun. **Nama helper tidak wajib dipertahankan persis** selama bentuk data hasil normalisasi kompatibel dengan komponen.

---

## 5. Analisis FAQ, Facilities, Comparison, Media, Leads

| Item | Penggunaan Aktual | Kebutuhan CMS? | Rekomendasi Penempatan | Catatan |
|---|---|---|---|---|
| **FAQs umum** | `app/kontak/page.tsx` pakai `generalFaqs` → `FaqSection` | **Ya** (baseline menyatakan FAQ collection utama) | **FAQs Collection** | Tetap sebagai collection, jangan pindah ke Global. |
| **FAQs per layanan/lokasi** | `app/layanan/[service]/page.tsx` ambil dari preview combo; `app/layanan/[service]/[location]/page.tsx` pakai `combo.faqs` | **Perlu** jika ingin dikelola | Bisa di **FAQs Collection** dengan relasi/filter, atau nested di entitas yang sesuai. **Jangan buat Global**. | Saat ini spesifik per kombinasi di mock. |
| **Facilities homepage** | `app/page.tsx` pakai `allFacilities.slice(0,6)`, `FacilitiesGrid` default ke `allFacilities` | **Perlu dicek** - bisa statis atau dikelola | Bisa tetap dari sumber terpusat atau collection jika ada kebutuhan. **Tidak ada dasar kuat untuk collection terpisah** di baseline. | Default items tersedia. |
| **Facilities per combo** | `app/layanan/[service]/[location]/page.tsx` pakai `combo.facilities` | **Perlu dicek** | Jika spesifik per lokasi/kombinasi dan perlu dikelola, perlu tempat penyimpanan. Jangan buat collection `Facilities` terpisah tanpa dasar requirement. | Sangat spesifik di mock. |
| **Comparison Table** | `comparisonRows[]` dipakai di home & layanan | **Belum jelas** | **Tidak otomatis** jadi Global atau collection. Hanya jika requirement menyatakan perlu dikelola. | Data sederhana, bisa tetap atau dipindah nanti jika diminta. |
| **Media** | Campuran URL Unsplash + path gambar per entitas | **Ya** (Media collection baseline) | **Media Collection** untuk upload lokal `public/media`. **Pertahankan URL eksternal** selama migrasi belum disetujui. Konfigurasi `remotePatterns` untuk Unsplash sudah ada. | Jangan unduh/pindahkan aset. |
| **Leads** | `ContactForm` (nama, bisnis, email, telp, topik, pesan) → kirim via WhatsApp (`whatsappUrl`) | **Ya** (baseline Leads collection) | **Leads Collection** - simpan data form sesuai field yang ada. **Jangan tambah field sensitif/mekanisme baru**. | Saat ini mengarah ke WhatsApp, bukan POST ke backend - perlu dicatat untuk integrasi nanti. |

---

## 6. Konflik Antara Baseline Requirement dan Struktur Mock Data

| Konflik | Tipe | Penjelasan | Resolusi yang Diusulkan |
|---|---|---|---|
| **Pricing di ServiceLocation vs Packages di Locations** | **Kritis** | Mock punya `pricing[]` di tiap combo (bisa beda per layanan di lokasi sama). Baseline bilang packages wajib di Locations. | Ikuti baseline (packages di Locations). Jika ada kasus yang tidak bisa dipetakan, **laporkan konflik spesifik** dan minta persetujuan sebelum menambah collection. |
| **Tagline/facilities/faqs/image/gallery spesifik per kombinasi** | **Kritis** | Banyak field bersifat unik per (service,location) di mock, dipakai langsung oleh halaman detail. | Identifikasi mana yang bisa ke Services/Locations, mana yang butuh tempat lain. **Jangan otomatis buat `ServiceLocations`** - evaluasi case by case dan minta persetujuan jika mutlak perlu. |
| **generateStaticParams dari ServiceLocations** | **Sedang** | Saat ini dibangun dari `serviceLocations[]`. Jika hilang entitas ini, perlu sumber lain untuk daftar kombinasi valid. | Bisa dibangun dari kombinasi Services×Locations yang valid (berdasarkan relasi/ketersediaan). Perlu definisikan "kombinasi valid". |
| **Helper names** | **Rendah** | Beberapa laporan menyebut `getServiceLocationsForLocation` yang tidak ada di `lib/data/mock-data.ts` saat ini. | Nama helper **tidak wajib dipertahankan persis**. Yang penting bentuk data kompatibel setelah normalisasi. |
| **Facilities split** | **Sedang** | `allFacilities` (homepage) vs `combo.facilities` (detail) - sumber berbeda. | Perlu strategi pemetaan; jangan buat collection terpisah tanpa dasar. |

---

## 7. Keputusan yang Masih Memerlukan Persetujuan Pengguna

| Keputusan | Mengapa Perlu Persetujuan | Opsi |
|---|---|---|
| **1. Entitas kombinasi layanan-lokasi** | Beberapa data (tagline, startingPrice, facilities spesifik, faqs spesifik, image/gallery spesifik) tampak tidak bisa ditempatkan hanya di Services/Locations/packages. | (A) Cukup Services+Locations+packages nested di Locations. (B) Tambah collection perantara **hanya jika terbukti mutlak perlu** (butuh persetujuan eksplisit). |
| **2. Bentuk relasi Services-Locations** | Baseline bilang "mendukung informasi layanan dan hubungannya dengan lokasi yang menyediakan layanan tersebut". | (A) Many-to-many relationship. (B) Ditentukan dari packages/ketersediaan di Locations. (C) Lainnya - perlu diskusi. |
| **3. Penempatan packages saat harga beda per (service,location)** | Konflik antara "packages di Locations" vs harga spesifik per kombinasi di mock. | (A) Tetap di Locations (asumsi struktur cukup). (B) Butuh konteks tambahan - perlu klarifikasi skenario bisnis. |
| **4. FAQ spesifik per konteks** | FAQ per combo vs FAQ collection utama. | (A) Semua di FAQs collection dengan relasi/filter. (B) Nested di entitas yang tepat. (C) Strategi lain. |
| **5. Facilities detail per kombinasi** | `combo.facilities` berbeda dari homepage. | (A) Nested di entitas yang tepat. (B) Collection terpisah (perlu dasar requirement). (C) Statis. |
| **6. Comparison table** | Perlu dikelola di CMS atau tidak? | (A) Global. (B) Collection. (C) Tetap statis di kode. |

---

## 8. Rekomendasi Schema Paling Sederhana yang Tetap Memenuhi Kebutuhan Frontend

**Rekomendasi minimal (sesuai baseline):**

### Collections
1. **Services** - katalog layanan (slug, title, description, intro, benefits[], image, etc.)
2. **Locations** - lokasi + **packages[] nested** (name, slug, address, contacts, whatsapp, packages[])
3. **Testimonials** - name, company, quote
4. **Promotions** - badge, title, description, period, **status (Active/Inactive)**, image, relatedService (opsional)
5. **FAQs** - question, answer (dengan strategi pemetaan untuk konteks spesifik)
6. **Media** - upload lokal, pertahankan remote untuk Unsplash
7. **Leads** - field dari form kontak (tanpa mekanisme baru)
8. **Users** - auth admin/editor

### Globals
- **SiteSettings** - info umum saja (name, tagline, email, phoneDisplay)

### Catatan Implementasi
- **Relasi:** Gunakan relasi semestinya (Services-Locations) tanpa menambah collection `ServiceLocations` terpisah kecuali ada persetujuan eksplisit setelah bukti kuat.
- **Normalisasi data:** Data access layer harus mengkonversi struktur Payload ke bentuk yang kompatibel dengan tipe `types/index.ts` dan kebutuhan komponen.
- **Helper:** Fungsi helper bisa diadaptasi; tidak wajib mempertahankan nama persis.
- **generateStaticParams:** Bangun dari kombinasi valid (bisa dari relasi/ketersediaan). Perlu definisikan sumber daftar kombinasi.
- **Media:** `next.config.ts` sudah punya `images.remotePatterns` untuk Unsplash - pertahankan.
- **Form Leads:** Saat ini submit ke WhatsApp; perlu diputuskan pola penyimpanan di CMS nanti.

---

## RINGKASAN TEMUAN

**File yang dibuat:** `PHASE-2A.2-DATA-MAPPING.md`  
**File lain yang diubah:** Tidak ada. Semua laporan sebelumnya (`PHASE-1-AUDIT-REPORT.md`, `PHASE-2A.1-SCHEMA-RECONCILIATION.md`) **tidak diubah**.  
**Database/Config/Source:** Tidak ada perubahan. Tidak ada instalasi/migrasi/seed.  
**Baseline dipertahankan:** 9 entitas sesuai requirement + packages wajib di Locations.

**Temuan kunci:**
1. Struktur mock saat ini bergantung pada `serviceLocations[]` sebagai agregator per kombinasi (tagline, pricing, facilities, FAQs, gallery). Baseline menempatkan packages di Locations - ada konflik yang **perlu keputusan**.
2. Beberapa field sangat spesifik per (service,location) dan belum punya tempat jelas di baseline minimal. Belum cukup bukti untuk menambah collection `ServiceLocations` - perlu persetujuan eksplisit jika mutlak diperlukan.
3. Relasi Services-Locations perlu bentuk yang bisa menghasilkan daftar lokasi per layanan dan daftar kombinasi valid untuk `generateStaticParams`.
4. FAQs tetap collection, Promotions butuh status Active/Inactive, Leads berdasarkan form yang ada, Media tetap pertahankan URL eksternal.

**BERHENTI - Menunggu persetujuan pengguna atas temuan ini. Tidak melanjutkan ke fase berikutnya.**
