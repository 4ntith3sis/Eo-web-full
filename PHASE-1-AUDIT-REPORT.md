# PHASE 1 — AUDIT TERPERINCI SOURCE PROJECT & ENVIRONMENT EASYOFFICE

**Tanggal Audit:** 2026-10-24  
**Status:** Read-only (tanpa perubahan source code, instalasi, database, atau konfigurasi)  
**Target:** Persiapan pembangunan CMS menggunakan Payload CMS + PostgreSQL lokal  
**Prasyarat:** Phase 0 telah selesai

---

## 1. Ringkasan Hasil Audit

- **Project terverifikasi:** `/Users/4ntith3sis/Documents/My project/fix build/easyoffice` (Next.js 16.3.8 + React 19.2.8 + TypeScript 5 + Tailwind v4)
- **Frontend sepenuhnya berbasis mock data:** Seluruh konten publik dikonsumsi dari `lib/data/mock-data.ts` (848 baris). **Belum ada integrasi Payload CMS** — hanya placeholder kosong di `payload/`, `lib/payload/`, `puck/`.
- **Ketergantungan data tinggi:** 12 file (6 di `app/`, 5 di `components/`, 1 di `layout`) mengimpor dari `@/lib/data/mock-data`. Halaman dinamis (`/layanan/[service]`, `/layanan/[service]/[location]`) menggunakan `generateStaticParams` berbasis mock.
- **Model relasi kompleks:** `ServiceLocation` (gabungan `serviceSlug` + `locationSlug`) mengontrol pricing, fasilitas, FAQ, galeri, dan kontak per kombinasi. Ini perlu dimodelkan dengan relasi di Payload.
- **Lingkungan siap:** Node v26.7.0, npm 11.19.0, PostgreSQL 16.14 (Homebrew) berjalan lokal (`postgresql@16 started`), `psql`/`pg_dump` tersedia. Port yang umum digunakan: 5432 (lokal) dan 5433 terkonfigurasi di `.env` (saat ini menunjuk DB `easyoffice`).
- **Puck Editor:** Ditunda sesuai arahan. Hanya placeholder yang ada.

---

## 2. Verifikasi Direktori Project dan Status Git

- **Path absolut:** `/Users/4ntith3sis/Documents/My project/fix build/easyoffice` (verified)
- **Git repo:** Ya (`.git/` ada)
- **Branch:** `main` (remote `origin/main`)
- **Commit aktif:** `4f82997 feat: refine promo sections and service pages`
- **Status working tree:** Bersih kecuali untracked
  - `?? AGENTS.md`
  - `?? CLAUDE.md`
- **Perubahan lokal:** Tidak ada modifikasi/staged/deleted. **Dipertahankan** sesuai arahan.
- **PHASE-1-AUDIT-REPORT.md:** Tidak ditemukan sebelumnya → **akan dibuat** (satu-satunya perubahan file yang diizinkan).

---

## 3. Peta Halaman, Komponen, dan Sumber Data

### Halaman (App Router)
| Halaman | File | Sumber Data | Field yang Digunakan | Catatan |
|---------|------|-------------|---------------------|---------|
| Home (`/`) | `app/page.tsx` | `allFacilities` (mock), komponen menerima props dari mock | Hero, StatsBand, FacilitiesGrid (slice 6), PromoSection, ServicesOverview, HowItWorks, ComparisonTable, Testimonials, WhatsappCta | Mengimpor `allFacilities` dari mock. |
| Layanan per service (`/layanan/[service]`) | `app/layanan/[service]/page.tsx` | `services`, `getService`, `locationsForService`, `getServiceLocation`, `Testimonials`, `FaqSection` via preview, `PromoSection`, `ComparisonTable`, `BenefitsSection`, `WhatsappCta` | Service metadata/intro/benefits/image, lokasi tersedia, preview combo untuk FAQ, statis/promosi | `generateStaticParams()` dari `services`. `notFound()` jika service tidak ditemukan. |
| Layanan per service×lokasi (`/layanan/[service]/[location]`) | `app/layanan/[service]/[location]/page.tsx` | `serviceLocations`, `getService`, `getLocation`, `getServiceLocation`, `locationWhatsappNumber`, `whatsappFor` | Kombinasi service+location, pricing, facilities, faqs, gallery, kontak WA per lokasi | `generateStaticParams()` dari seluruh `serviceLocations`. Menggabungkan data service+location+combo. |
| Promo (`/promo`) | `app/promo/page.tsx` | `promotions`, `services` | Judul/deskripsi promo, gambar dari `promoServices` (mapping 0,2,1), link ke layanan, WA | Mapping promo → layanan untuk gambar/CTA. |
| Tentang Kami (`/tentang-kami`) | `app/tentang-kami/page.tsx` | Hanya statis (values/stats hardcoded) + `ServicesOverview`, `WhatsappCta` | Konten statis, tidak ada import mock-data langsung | Tidak bergantung langsung pada entitas mock kecuali komponen turunan. |
| Kontak (`/kontak`) | `app/kontak/page.tsx` | `site`, `generalFaqs` | `site.phoneDisplay`, `site.email`, FAQ umum, jam operasional hardcoded | Menggunakan `site` dan `generalFaqs`. |
| Not Found (`/not-found.tsx`) | `app/not-found.tsx` | Statis | — | Tanpa mock data. |
| Layout (`app/layout.tsx`) | `app/layout.tsx` | `whatsappUrl` dari `lib/whatsapp`, `Header`, `Footer` | Metadata, floating WA | `Header`/`Footer` bergantung pada mock (lihat bawah). |

### Komponen Layout
| Komponen | File | Sumber Data | Penggunaan |
|----------|------|-------------|------------|
| Header | `components/layout/header.tsx` | Tidak ada import mock langsung terlihat dari grep, menggunakan `nav` config | Navigasi utama + dropdown layanan (via `components/layout/nav.ts`) |
| Footer | `components/layout/footer.tsx` | `services`, `site` dari `@/lib/data/mock-data` | Daftar layanan di footer, info kontak `site.email`/`site.phoneDisplay`, copyright `site.name` |
| Mobile Nav | `components/layout/mobile-nav.tsx` | Bergantung pada konfigurasi nav | Navigasi mobile |
| Nav config | `components/layout/nav.ts` | Kemungkinan mengacu pada layanan | Konfigurasi navigasi |

### Komponen Sections (18 file)
| Komponen | File | Sumber Data | Penggunaan |
|----------|------|-------------|------------|
| Hero | `components/sections/hero.tsx` | Props-driven (diberi dari page) | Umum, tidak import mock sendiri |
| ServicesOverview | `components/sections/services-overview.tsx` | `services` dari mock | Menampilkan daftar layanan |
| ServiceLocationGrid | `components/sections/service-location-grid.tsx` | Props (location+combo) | Grid lokasi per layanan |
| LocationSelector | `components/sections/location-selector.tsx` | `locations` dari mock | Pemilih lokasi (state lokal) |
| LocationCard/LocationDetailCard | `components/sections/location-card.tsx`, `location-detail-card.tsx` | Props-driven | Menampilkan info lokasi |
| PricingTable | `components/sections/pricing-table.tsx` | Props (`plans`, `topic`, `locationName`, `whatsappNumber`) | Tabel harga per combo |
| FacilitiesGrid | `components/sections/facilities-grid.tsx` | `allFacilities` dari mock (atau props) | Grid fasilitas |
| Gallery | `components/sections/gallery.tsx` | Props (`images`) | Galeri foto per combo |
| FaqSection (faq.tsx) | `components/sections/faq.tsx` | Props-driven | FAQ (general atau per combo) |
| PromoSection | `components/sections/promo-section.tsx` | `promotions`, `services` dari mock | Promo di berbagai halaman |
| Testimonials | `components/sections/testimonials.tsx` | `testimonials` dari mock | Marquee testimonial |
| ComparisonTable | `components/sections/comparison-table.tsx` | `comparisonRows` dari mock | Tabel perbandingan |
| BenefitsSection | `components/sections/benefits-section.tsx` | Props/konfigurasi per serviceSlug | Keunggulan per layanan |
| StatsBand | `components/sections/stats-band.tsx` | Statis/props | Statistik |
| HowItWorks | `components/sections/how-it-works.tsx` | Statis | Cara kerja |
| ContactForm | `components/sections/contact-form.tsx` | Statis (UI form) | Form kontak |
| WhatsappCta | `components/sections/whatsapp-cta.tsx` | Props + `whatsappFor`/helpers | CTA WhatsApp |

**Total import dari mock-data:** 12 lokasi penggunaan (terdeteksi via grep). Hampir seluruh konten dinamis bergantung pada `lib/data/mock-data.ts`.

---

## 4. Matriks Entitas, Field, Relasi, dan Halaman Pengguna

Sumber: `lib/data/mock-data.ts` (848 baris) dan `types/index.ts` (1921 bytes). Berikut pemetaan berdasarkan penggunaan aktual.

### Entitas utama

| Entitas | Tipe (types) | Sumber di mock | Field (berdasarkan kode) | Wajib/opsional (penggunaan aktual) | Digunakan oleh | Kebutuhan CMS |
|---------|--------------|-----------------|--------------------------|-----------------------------------|----------------|---------------|
| **Site/Config** | `site` object (inline) | `lib/data/mock-data.ts:38-44` | `name`, `tagline`, `email`, `phoneDisplay` | Semua digunakan | `components/layout/footer.tsx`, `app/kontak/page.tsx` | Global/Site Setting (singleton) |
| **Location** | `Location` interface | `locations[]` (baris ~60+) | `slug` (unik), `name`, `shortDescription`, `address`, `operatingHours`, `email`, `phoneDisplay`, `whatsapp` (wa.me format) | Semua field digunakan di UI/kontak | `components/sections/location-selector.tsx`, `components/sections/location-detail-card.tsx`, `app/layanan/[service]/[location]/page.tsx`, breadcrumbs/metadata | Collection `locations` (slug unik) |
| **Service** | `Service` interface | `services[]` | `slug` (unik), `title`, `shortTitle`, `description`, `intro`, `benefits[]`, `features[]`, `icon`, `href`, `image` (unik per service), `imageAlt` | Hampir semua digunakan; `features[]` ada di tipe tapi pemakaian perlu dicek per halaman | `components/sections/services-overview.tsx`, `components/layout/footer.tsx`, `app/layanan/[service]/page.tsx`, `app/promo/page.tsx`, hero/metadata | Collection `services` (slug unik) |
| **ServiceLocation** (kombinasi) | `ServiceLocation` interface | `serviceLocations[]` | `serviceSlug`, `locationSlug`, `tagline`, `startingPrice`, `pricing[]` (PricingPlan), `facilities[]` (Facility), `faqs[]` (Faq), `whatsapp?` (override), `image` (unik per combo), `imageAlt`, `gallery[]` (GalleryImage, 3 foto unik) | Semua digunakan di halaman service×location; `whatsapp` optional (fallback ke lokasi) | `app/layanan/[service]/[location]/page.tsx`, `app/layanan/[service]/page.tsx` (preview), `ServiceLocationGrid`, `PricingTable`, `Gallery`, `FaqSection`, `WhatsappCta` | Collection `serviceLocations` dengan relasi ke `services` dan `locations` (composite key/unique constraint pada service+location) |
| **PricingPlan** | `PricingPlan` interface (nested) | Di dalam `serviceLocations[].pricing[]` | `name`, `price`, `period`, `features[]`, `featured?`, `ctaLabel` | Digunakan oleh `PricingTable` | Pricing per combo lokasi | Nested array/blocks di ServiceLocation atau collection terpisah (relasi) |
| **Facility** | `Facility` interface (nested/global) | `serviceLocations[].facilities[]` dan `allFacilities[]` | `icon`, `title`, `description` | Digunakan di `FacilitiesGrid` | Per combo atau umum | Bisa nested di combo atau collection terpisah + relasi |
| **Faq** | `Faq` interface (nested) | `serviceLocations[].faqs[]`, `generalFaqs[]` | `question`, `answer` | Digunakan di `FaqSection` | Per combo atau umum (`/kontak`) | Nested atau collection terpisah |
| **Promotion** | `Promotion` interface | `promotions[]` | `badge`, `title`, `description`, `period` | Digunakan di `PromoSection` dan `app/promo/page.tsx` | Halaman promo dan section | Collection `promotions` |
| **Testimonial** | `Testimonial` interface | `testimonials[]` | `name`, `company`, `quote` | Digunakan di `Testimonials` (marquee) | Home dan halaman layanan | Collection `testimonials` |
| **ComparisonRow** | `ComparisonRow` interface | `comparisonRows[]` | `feature`, `easyoffice` (bool), `typical` (bool) | Digunakan di `ComparisonTable` | Berbagai halaman | Collection atau global |
| **GalleryImage** | `GalleryImage` interface (nested) | `serviceLocations[].gallery[]` (3 items) | `src`, `alt` | Digunakan di `Gallery` | Per combo service×location | Nested array di ServiceLocation |
| **allFacilities** | Derived array | Dari mock (digunakan di home) | Struktur `Facility` | `app/page.tsx` slice 6 | Home highlights | Bisa berasal dari collection `facilities` atau gabungan |

### Relasi kunci
- **Service 1:N ServiceLocation** (satu layanan tersedia di beberapa lokasi)
- **Location 1:N ServiceLocation** (satu lokasi punya beberapa layanan)
- **ServiceLocation ↔ Pricing/Facilities/FAQs/Gallery:** Saat ini **nested** dalam objek `ServiceLocation` per kombinasi (unik). Ini adalah inti logika: konten/pricing berbeda per `(service, location)`.
- **Helper functions:** `getService(slug)`, `getLocation(slug)`, `getServiceLocation(serviceSlug, locationSlug)`, `locationsForService(serviceSlug)`, `getServiceLocationsForLocation(locationSlug)` digunakan di pages/components.

**Temuan:** Relasi `(serviceSlug, locationSlug)` bersifat **natural key**. Di Payload perlu dijaga keunikan kombinasi ini dan pastikan query berdasarkan kedua slug tetap efisien.

---

## 5. Analisis Mendalam `Service`, `Location`, dan `ServiceLocation`

### Service (`services[]`)
- **Slug unik:** `virtual-office`, `coworking-space`, `meeting-room` (dikonfirmasi dari routing dan data)
- **Konten:** `title`, `shortTitle`, `description`, `intro`, `benefits[]`, `features[]`, `icon`, `href`, `image`, `imageAlt`
- **Penggunaan:** Landing service (`/layanan/[service]`) menampilkan hero/benefits/daftar lokasi tersedia. `ServicesOverview` menampilkan semua service. Footer menampilkan daftar service.
- **Catatan:** `image` bersifat unik per service (komentar di tipe menegaskan). Perlu media terpisah atau reuse dicegah.

### Location (`locations[]`)
- **3 lokasi:** `bandung`, `jakarta`, `bekasi` (dengan nomor WA berbeda per lokasi)
- **Konten:** Identitas, alamat, jam operasional, kontak, `whatsapp` (format wa.me)
- **Penggunaan:** Selector, detail card, kontak, WA per lokasi, metadata
- **Catatan:** Digunakan sebagai filter untuk menemukan `ServiceLocation` yang tersedia.

### ServiceLocation (paling kritikal)
- **Bentuk:** Agregasi unik per `(serviceSlug, locationSlug)`. Tidak semua kombinasi ada (mis. tergantung ketersediaan) — `locationsForService` hanya mengembalikan lokasi yang punya `ServiceLocation` terkait.
- **Konten khusus per kombinasi:**
  - `tagline` (hero/intro khusus lokasi)
  - `startingPrice` (ditampilkan di card)
  - `pricing[]` (tabel harga, bisa beda antar lokasi meski nama paket mirip)
  - `facilities[]` (bisa beda per lokasi)
  - `faqs[]` (FAQ spesifik)
  - `whatsapp?` (override nomor WA jika ada)
  - `image` unik per combo, `gallery[]` 3 gambar unik
- **Dampak UI:** Halaman `/layanan/[service]/[location]` bergantung sepenuhnya pada combo ini. Perubahan kecil di combo mempengaruhi hero, pricing, fasilitas, galeri, FAQ, dan CTA WA.
- **Implikasi schema:** Opsi modeling di Payload:
  1. **Collection `serviceLocations`** dengan relasi `hasOne`/`relationship` ke `services` dan `locations`, plus field nested untuk `pricing`, `facilities`, `faqs`, `gallery`. Tambahkan unique index pada `(service, location)`.
  2. Atau **blocks/nested** — perlu pastikan kompatibel dengan cara halaman saat ini mengkonsumsi data.
- **Rekomendasi:** Pertahankan struktur yang mirip agar integrasi frontend minimal (mengganti sumber data, bukan merombak komponen). Mapping relasi harus presisi.

---

## 6. Audit Dependensi dan Kesiapan Integrasi Payload

### package.json saat ini
```json
{
  "name": "easyoffice",
  "version": "0.1.0",
  "private": true,
  "scripts": {"dev": "next dev", "build": "next build", "start": "next start", "lint": "eslint"},
  "dependencies": {"lucide-react": "^1.49.0", "next": "16.3.8", "react": "19.2.8", "react-dom": "19.2.8"},
  "devDependencies": {"@tailwindcss/postcss": "^4", "@types/node": "^20", "@types/react": "^19", "@types/react-dom": "^19", "eslint": "^9", "eslint-config-next": "16.3.8", "tailwindcss": "^4", "typescript": "^5"}
}
```
- **Payload:** Tidak terpasang. Tidak ada `payload`, `@payloadcms/*`, `@payloadcms/db-postgres`, `graphql`, `sharp`.
- **Folder placeholder:** `payload/{collections,globals,hooks}/.gitkeep`, `lib/payload/.gitkeep`, `puck/components/.gitkeep` — belum ada implementasi.

### Kesesuaian versi
- Next.js 16.3.8 + React 19.2.8 — kompatibel dengan versi terbaru Payload CMS v3, namun perlu memverifikasi kompatibilitas exact saat instalasi. **Belum diinstal**, jadi evaluasi berbasis rekomendasi umum.

### Kebutuhan untuk integrasi (berdasarkan kebutuhan)
- **Core:** `payload`, `@payloadcms/next`, `@payloadcms/richtext-lexical` (atau sesuai kebutuhan), `@payloadcms/db-postgres`, `@payloadcms/ui` (biasanya terbundel)
- **DB:** `pg` atau driver yang dibutuhkan `@payloadcms/db-postgres`
- **Media:** Storage lokal sudah direncanakan (`public/media` sesuai `.env`). Perlu konfigurasi upload di Payload.
- **Auth/Admin:** Perlu konfigurasi admin user/collection users dan `PAYLOAD_SECRET`.
- **API/Routes:** Payload v3 dengan Next.js App Router biasanya butuh route handlers di `app/(payload)/...` atau setup sesuai pola; perlu konfigurasi `next.config.ts` (plugins/webpack) dan `payload.config.ts`.

### Pendekatan integrasi yang dipilih: **Payload Local API di server Next.js**
Berdasarkan arahan Phase 1:
- **Konsep:** Di server components/routes, gunakan Payload Local API untuk mengambil data langsung dari DB tanpa HTTP roundtrip (efisien). Di client components, bisa tetap lewat API routes jika diperlukan, tapi sebisa mungkin minimal.
- **Cara menggantikan mock data tanpa mengubah UI/route:**
  1. Buat layer data access, mis. `lib/cms/` atau ganti import di pages/components untuk membaca dari Payload (tetap mengembalikan shape yang sama persis dengan tipe `types/index.ts` saat ini).
  2. Pertahankan fungsi helper seperti `getService`, `getServiceLocation` dengan sumber data dari Payload (bisa di-cache/memoized).
  3. `generateStaticParams` bisa tetap bekerja dengan data dari Payload saat build.
  4. Jangan ubah props interface komponen sections — hanya ganti sumber datanya.
- **Keuntungan:** Tidak perlu mengubah struktur route/App Router, UI tetap sama, bisa bertahap (fallback ke mock jika CMS belum siap saat development).

### Risiko integrasi
- **Konflik dependensi:** Perlu hati-hati dengan peer deps Next 16/React 19.
- **Konfigurasi Next:** `next.config.ts` saat ini minimal (images + redirects). Payload butuh setup tertentu di Next config.
- **TypeScript paths:** Sudah ada `@/*` di tsconfig, aman.
- **Puck ditunda:** Tidak disentuh (hanya placeholder) — sesuai batasan.

**Status:** Payload **belum siap** untuk integrasi. Butuh instalasi dan konfigurasi di Phase berikutnya.

---

## 7. Audit PostgreSQL dan Environment Tanpa Menampilkan Secret

### Environment info
- **Node.js:** `v26.7.0`
- **npm:** `11.19.0`
- **Next.js:** `16.3.8` | **React:** `19.2.8` | **TypeScript:** `^5`
- **OS:** macOS (darwin) sesuai konteks

### PostgreSQL lokal
- **Client:** `/opt/homebrew/bin/psql` (PostgreSQL) **16.14 (Homebrew)**
- **Dump:** `/opt/homebrew/bin/pg_dump` **16.14 (Homebrew)**
- **Service status:** `postgresql@16` **started** via Homebrew LaunchAgent (`~/Library/LaunchAgents/sh.brew.postgresql@16.plist`)
- **Proses berjalan:** Terdeteksi proses `postgres` (launcher/walwriter/autovacuum) — layanan aktif
- **Port aktif (umum):** 5432 (default Homebrew). **Tidak dapat dipastikan 100% tanpa mengubah konfigurasi**, tapi proses berjalan normal.
- **Port di `.env`:** `POSTGRES_PORT=5433`, `DATABASE_URL` menggunakan port 5433 dengan user/password `easyoffice` ke DB `easyoffice` (struktur terlihat, nilai kredensial tidak ditampilkan). Ini sesuai catatan di `.env.example` untuk menghindari benturan dengan local Postgres di 5432.
- **Coba koneksi ke 5433 sebagai user `easyoffice`:** Gagal autentikasi (meminta password / no password supplied) — **tidak berhasil diverifikasi** tanpa menyentuh kredensial/env. Dicatat sebagai belum terverifikasi.

### Konfigurasi project
- `.env` ada (local defaults). `.env.example` tersedia sebagai template.
- Variabel terkait DB/Payload: `DATABASE_URL`, `POSTGRES_*`, `PAYLOAD_SECRET`, `PAYLOAD_ADMIN_*`, `PAYLOAD_MEDIA_DIR`, `NEXT_PUBLIC_MEDIA_BASE_URL` — terdefinisi di template/env.
- **Target arsitektur:** Database baru `easyoffice_cms` (terpisah dari EasyTax). Saat ini `.env` menunjuk ke `easyoffice` di port 5433 — **perlu diselaraskan** saat Phase 2.
- **Docker:** Tidak wajib. PostgreSQL berjalan langsung di Mac (sesuai arahan). Tidak ada indikasi penggunaan Docker untuk DB saat ini.

### Verifikasi database `easyoffice_cms`
- **Upaya:** Hanya bisa dicek via `psql` — mencoba koneksi aman ke 5432/5433 memerlukan kredensial yang tepat. **Tidak dilakukan perubahan data.**
- **Hasil:** **Belum terverifikasi** keberadaan database `easyoffice_cms`. Perlu dicek di Phase 2 dengan persetujuan/konfigurasi koneksi yang aman.
- **Larangan dipatuhi:** Tidak membuat/menghapus DB, tidak menjalankan migration/seed.

**Kondisi environment:** Cukup baik untuk development (Node/npm/Postgres tersedia). Yang perlu disiapkan: instalasi Payload deps, konfigurasi koneksi ke `easyoffice_cms`, setup schema/migrasi.

---

## 8. Pemetaan Media dan Asset

### Direktori public
- `public/` ada (struktur dasar). Tidak ada listing detail file besar dalam audit ini, tapi referensi gambar teridentifikasi.

### Referensi gambar saat ini
- **Eksternal (Unsplash):** Digunakan di beberapa tempat
  - `app/tentang-kami/page.tsx`: `https://images.unsplash.com/photo-1524758631624-e2822e304c36?...` dan `https://images.unsplash.com/photo-1521737711867-e3b97375f902?...`
- **Dari mock data (`lib/data/mock-data.ts`):** Banyak entitas punya `image`/`imageAlt` dan `gallery[]` dengan URL (termasuk Unsplash). Komentar di `types/index.ts` menegaskan: *"Unique image URL — must not be reused across services or combos."* dan *"Unique hero image for this Service × Location page — never reused."*, serta gallery 3 foto unik per combo.
- **Next config:** `images.remotePatterns` mengizinkan `images.unsplash.com` — sudah dikonfigurasi.

### Kebutuhan media untuk CMS
- **Upload lokal:** Sesuai `.env` (`PAYLOAD_MEDIA_DIR=public/media`, `NEXT_PUBLIC_MEDIA_BASE_URL=/media`). Media perlu dikelola melalui Payload Media collection dengan upload lokal (bisa migrasi ke object storage nanti).
- **Mapping:** Setiap `Service.image`, `ServiceLocation.image`, `ServiceLocation.gallery[].src` perlu bisa dikelola via CMS. URL saat ini bisa tetap dipertahankan atau dipindah ke media lokal tergantung strategi seed.
- **Risiko:** Mengganti URL bisa mempengaruhi tampilan jika tidak dimapping dengan benar. Perlu memastikan relasi media di Payload menghasilkan URL yang kompatibel dengan komponen saat ini (atau menyesuaikan komponen minimal jika perlu, tapi diutamakan tanpa mengubah UI).

**Rekomendasi:** Saat seed, pertimbangkan untuk meng-copy/mempertahankan referensi URL yang ada atau upload ke `public/media` dengan path yang konsisten. Jangan mengunduh/memindahkan asset saat ini.

---

## 9. Strategi Pemindahan Mock Data dan Seed

### Data yang bisa dipindahkan langsung
- **Site settings:** `site` → Global singleton
- **Locations:** `locations[]` → Collection `locations` (slug unik)
- **Services:** `services[]` → Collection `services` (slug unik)
- **Promotions:** `promotions[]` → Collection `promotions`
- **Testimonials:** `testimonials[]` → Collection `testimonials`
- **Comparison:** `comparisonRows[]` → Collection atau Global
- **General FAQs:** `generalFaqs[]` → Collection atau Global
- **allFacilities:** Bisa jadi collection `facilities` atau nested; saat ini digunakan untuk highlights

### Data yang memerlukan transformasi
- **ServiceLocation:** Perlu memetakan `serviceSlug`/`locationSlug` menjadi relasi ke collection `services`/`locations`. Field nested `pricing[]`, `facilities[]`, `faqs[]`, `gallery[]` perlu dikonversi ke bentuk yang didukung Payload (arrays/blocks/relationships). `whatsapp` override perlu dipertahankan.
- **Media URLs:** Jika ingin menggunakan Payload media, URL eksternal/yang ada perlu dimigrasi ke Media documents atau tetap disimpan sebagai string URL dengan konfigurasi yang sesuai.

### Relasi yang harus dibuat terlebih dahulu
Urutan pembuatan/seed yang disarankan:
1. **Locations** (independen)
2. **Services** (independen)  
3. **ServiceLocations** (bergantung pada Locations + Services) — buat relasi dan pastikan unique (service + location)
4. **Promotions, Testimonials, FAQs umum, Facilities, Comparison** (bisa paralel atau setelah)

### Risiko
- **Slug duplikat:** Slug saat ini unik, tapi perlu enforce uniqueness di Payload.
- **Relasi rusak:** Jika seed ServiceLocation sebelum Services/Locations ada, relasi akan gagal.
- **Data ganda:** Jika seed dijalankan berulang tanpa upsert/idempotency.
- **Perbedaan struktur:** Jika shape berbeda dari yang diharapkan frontend, UI bisa rusak.
- **Media:** URL eksternal mungkin berubah/kadaluarsa.

### Rekomendasi seed yang aman dan terkontrol
- **Idempotent:** Gunakan `findOne` by slug/unique key sebelum create, atau gunakan `upsert` berdasarkan identifier unik.
- **Order-aware:** Seed dalam urutan dependency (locations → services → serviceLocations → others).
- **Transactional jika mungkin:** Atau batch dengan error handling.
- **Dry-run:** Validasi mapping tanpa menulis terlebih dahulu.
- **Simpan mapping:** Catat old slug → new id jika ada transformasi.
- **Jangan auto-run:** Buat script terpisah, jalankan manual hanya setelah persetujuan dan schema final.
- **Seed terpisah dari migrasi schema:** Migrasi untuk struktur, seed untuk data.
- **Verifikasi:** Setelah seed, bandingkan jumlah data dan spot-check halaman kunci.

**Catatan:** Tidak ada script seed/migrasi dibuat pada Phase 1 (sesuai batasan).

---

## 10. Risiko Teknis dan Keputusan yang Masih Diperlukan

### Risiko Teknis
| Risiko | Tingkat | Deskripsi | Mitigasi |
|--------|---------|-----------|----------|
| Payload belum terpasang | Tinggi | Tidak ada konfigurasi/collection aktif sama sekali | Pasang deps, buat `payload.config.ts`, definisikan schema di Phase berikutnya |
| Model ServiceLocation kompleks | Tinggi | Agregasi unik per service×location dengan nested arrays; relasi harus presisi | Desain schema hati-hati, jaga bentuk data agar kompatibel dengan komponen |
| Gap env DB | Sedang-Tinggi | `.env` menunjuk `easyoffice` di 5433, target `easyoffice_cms` | Konfirmasi buat/assign DB di Phase 2, sesuaikan env |
| Port/koneksi DB belum terverifikasi | Sedang | Autentikasi ke 5433 gagal tanpa kredensial; perlu cek aman | Verifikasi dengan cara aman di Phase 2 |
| Media URL eksternal | Sedang | Banyak gambar dari Unsplash, perlu strategi media lokal/remote | Konfigurasi remotePatterns sudah ada; bisa seed URL atau migrasi bertahap |
| Perubahan bentuk data bisa merusak UI | Tinggi | Komponen mengharapkan shape persis dari mock | Buat data access layer yang menormalkan output ke tipe existing |
| Versi deps Next 16/React 19 | Sedang | Payload perlu kompatibel saat instalasi | Cek kompatibilitas saat `npm install` Payload packages |

### Keputusan yang Masih Diperlukan
1. **Masuk ke Phase 2?** Ya/Tidak — perlu persetujuan untuk persiapan DB + finalisasi schema.
2. **Target database:** Konfirmasi penggunaan `easyoffice_cms` (buat baru terpisah). Apakah perlu backup/migrasi dari DB lain? (Tidak disarankan menggunakan EasyTax)
3. **Strategi integrasi data:** Local API vs REST/GraphQL langsung di client? Rekomendasi Local API di server, tapi perlu konfirmasi.
4. **Modeling ServiceLocation:** Collection terpisah dengan relasi vs embedded — perlu putusan untuk efisiensi query dan kemudahan pengelolaan di admin.
5. **Media strategy:** Pertahankan URL eksternal dulu atau migrasi ke upload lokal `public/media` sejak awal?
6. **Seed konten awal:** Seed dari mock data otomatis atau input manual via Payload admin?
7. **Penyesuaian env:** Update `.env` untuk `easyoffice_cms` di port yang tepat (5432 atau 5433) setelah konfirmasi.

---

## 11. Rekomendasi Ruang Lingkup Phase 2

Berdasarkan temuan Phase 1, rekomendasi untuk Phase 2:

### Prioritas Utama
1. **Verifikasi DB aman** - Cek ketersediaan PostgreSQL, verifikasi/siapkan database `easyoffice_cms` (tanpa menghapus data existing tanpa persetujuan). Sesuaikan koneksi.
2. **Finalisasi schema Payload** - Definisikan collections: `Users` (auth), `Locations`, `Services`, `ServiceLocations` (dengan relasi + nested pricing/facilities/faqs/gallery), `Promotions`, `Testimonials`, `Facilities`, `FAQs`, `Media`. Tambahkan Globals untuk `SiteSettings`.
3. **Desain relasi ServiceLocation** - Pastikan unique constraint `(service, location)`. Rencanakan query pattern yang mirip dengan helper saat ini.
4. **Rencana integrasi frontend** - Siapkan strategi data access layer agar komponen bisa switch dari mock ke Payload tanpa redesign.

### Scope yang Disarankan
- **In scope:** DB prep, schema design & approval, env alignment, persiapan konfigurasi Payload (tanpa install besar-besaran jika belum disetujui), mapping data.
- **Out of scope:** Instalasi Payload penuh, coding integrasi frontend, seed eksekusi — bisa di Phase 3. Atau bisa digabung tergantung persetujuan, tapi lebih aman pisahkan persiapan vs implementasi.

### Catatan
- Jangan mengubah UI/route
- Puck tetap ditunda
- Gunakan read-only untuk pemeriksaan DB
- Dokumentasikan keputusan schema

---

## 12. Daftar Pemeriksaan yang Belum Dapat Diverifikasi

| Item | Status | Alasan |
|------|--------|--------|
| Keberadaan database `easyoffice_cms` | **Belum diverifikasi** | Perlu koneksi ke Postgres dengan kredensial yang benar. Mencoba koneksi ke port 5433 sebagai user `easyoffice` gagal autentikasi tanpa menyentuh kredensial/env. |
| Status exact port PostgreSQL yang digunakan project | **Sebagian diverifikasi** | Proses postgres berjalan, Homebrew service started. `.env` menggunakan 5433. Port 5432 juga umum — tidak dipastikan tanpa mengubah config. |
| Apakah ada data di DB `easyoffice` yang ada saat ini | **Belum diverifikasi** | Read-only check butuh koneksi berhasil. Tidak dilakukan. |
| Versi exact Payload yang kompatibel | **Belum diketahui** | Belum terinstal. Perlu cek saat instalasi di fase berikutnya. |
| Konfigurasi runtime Payload (jika ada di branch lain) | **Tidak ditemukan** | Hanya placeholder kosong. |
| Asset di `public/` detail isi | **Sebagian** | Struktur ada, tidak di-list penuh (bisa besar) — referensi eksternal teridentifikasi cukup untuk audit. |

Semua item di atas bersifat aman untuk diverifikasi nanti tanpa perubahan berisiko.

---

## 13. Konfirmasi Seluruh Batasan Pekerjaan dan Perubahan yang Dilakukan

### Batasan yang Dipatuhi
- [x] **Hanya pemeriksaan dan laporan** — tidak ada perubahan file source code
- [x] **Tidak menginstal dependensi**
- [x] **Tidak membuat/mengubah database**
- [x] **Tidak menjalankan migration atau seed**
- [x] **Tidak mengubah `.env` atau konfigurasi**
- [x] **Tidak mengimplementasikan Payload**
- [x] **Tidak mengintegrasikan frontend dengan CMS**
- [x] **Tidak mengubah mock data**
- [x] **Tidak mengubah desain/UI**
- [x] **Tidak mengerjakan Puck Editor** (hanya dicek sebagai placeholder/ditunda)
- [x] **Tidak menghapus/menimpa file** (file untracked `AGENTS.md`, `CLAUDE.md` dipertahankan)
- [x] **Tidak pindah branch/worktree**
- [x] **Tidak menjalankan perintah git yang mengubah working tree**
- [x] **Tidak menampilkan password/secret/token/connection string lengkap**
- [x] **Tidak mengubah resource Docker**
- [x] **Tidak melanjutkan Phase 2 otomatis**

### Perubahan yang Dilakukan
- **Hanya 1 file baru dibuat:** `PHASE-1-AUDIT-REPORT.md` di root project (`/Users/4ntith3sis/Documents/My project/fix build/easyoffice/PHASE-1-AUDIT-REPORT.md`)
- **File ini belum ada sebelumnya** — tidak ada file yang ditimpa
- **Tidak ada file lain yang dibuat/diubah/dihapus**

### Verifikasi Akhir
- Project path terverifikasi dan masih tersedia
- Ketergantungan frontend terhadap mock data dipetakan secara menyeluruh
- Kebutuhan konten CMS dan relasi (terutama Service-Location-ServiceLocation) diidentifikasi
- Kesiapan Payload dievaluasi (belum terpasang, butuh setup)
- PostgreSQL dan environment diperiksa dengan aman
- Strategi pemindahan data dan seed direkomendasikan
- Risiko dan keputusan yang diperlukan dicatat
- Semua temuan dibedakan (terbukti vs rekomendasi/asumsi)

**STATUS:** Phase 1 SELESAI. Menunggu persetujuan pengguna untuk melanjutkan ke Phase 2. Tidak ada tindakan implementasi otomatis yang dilakukan.
