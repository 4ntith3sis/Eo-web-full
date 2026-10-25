# FASE 1 — AUDIT DAN SNAPSHOT PROYEK

**Project:** EasyOffice  
**Tanggal audit:** 2026-10-24  
**Status:** Selesai, read-only terhadap source/config/database  
**Tujuan:** Membuat baseline aman sebelum instalasi Payload CMS.

> Catatan: `PHASE-1-AUDIT-REPORT.md` sudah ada sebagai file untracked sebelum fase ini. File tersebut tidak ditimpa. Laporan ini adalah snapshot Fase 1 yang dibuat terpisah.

---

## 1. Baseline Toolchain

| Komponen | Versi/hasil |
|---|---|
| Node.js | `v26.7.0` |
| npm | `11.19.0` |
| Next.js | `16.3.8` |
| React | `19.2.8` |
| React DOM | `19.2.8` |
| TypeScript CLI | `5.9.3` |
| Package manager | npm (`package-lock.json` tersedia) |
| Database/CMS sebelum fase berikutnya | Belum ada dependency Payload di `package.json` |

Sumber versi package aplikasi: `package.json`. Versi runtime diverifikasi melalui CLI.

---

## 2. Baseline Lint dan Build

### `npm run lint`

**Hasil: BERHASIL**

Perintah menjalankan `eslint` tanpa error atau warning yang dilaporkan.

### `npm run build`

**Hasil: BERHASIL**

Next.js menyelesaikan pemeriksaan TypeScript/build dengan exit code sukses:

```text
Finished TypeScript in 1347ms ...
```

Baseline ini harus dijadikan pembanding setelah setiap perubahan instalasi/config Payload. Jika build berikutnya gagal, bandingkan terlebih dahulu dengan kondisi ini sebelum melakukan perubahan tambahan.

---

## 3. Snapshot Git

### Commit saat audit

```text
cb2ec30 Update office cards and pricing discounts
```

### Branch/tracking

```text
main...origin/main
```

### Kondisi working tree

Tidak ada file tracked yang berubah atau staged. Working tree memiliki file untracked berikut sebelum/dalam audit:

- `AGENTS.md`
- `CLAUDE.md`
- `PHASE-0-REQUIREMENTS-LOCK.md`
- `PHASE-1-AUDIT-REPORT.md`
- `PHASE-2A.1-SCHEMA-RECONCILIATION.md`
- `PHASE-2A.2-DATA-MAPPING.md`
- `PHASE-2A.3-SCHEMA-RECOMMENDATION.md`
- `PHASE-2A.4-CONTENT-MODEL-ANALYSIS.md`
- `PHASE-2A.5-SCHEMA-FINALIZATION.md`
- `PHASE-2A.6-PACKAGES-PRICING-VALIDATION.md`
- `PHASE-2A.7-SCHEMA-RECONCILIATION.md`
- `PHASE-1-SNAPSHOT-AUDIT.md` (file ini)
- `backups/phase-1/mock-data.ts` (backup fase ini)

File-file untracked tersebut tidak dihapus, di-reset, atau ditimpa.

---

## 4. Snapshot Struktur Route

Struktur App Router yang ditemukan:

```text
app/
├── layout.tsx
├── page.tsx
├── not-found.tsx
├── kontak/page.tsx
├── promo/page.tsx
├── tentang-kami/page.tsx
└── layanan/
    └── [service]/
        ├── page.tsx
        └── [location]/page.tsx
```

Route dinamis saat ini membaca data mock untuk `generateStaticParams`, metadata, dan rendering halaman.

### Redirect legacy

`next.config.ts` memiliki redirect permanen:

- `/virtual-office` -> `/layanan/virtual-office`
- `/virtual-office/:slug` -> `/layanan/virtual-office/:slug`
- `/coworking-space/:slug` -> `/layanan/coworking-space/:slug`
- `/meeting-room/:slug` -> `/layanan/meeting-room/:slug`

Konfigurasi gambar mengizinkan host remote `images.unsplash.com`.

---

## 5. Snapshot Struktur Komponen

### Layout

```text
components/layout/
├── header.tsx
├── footer.tsx
└── mobile-nav.tsx
```

### Sections

```text
components/sections/
├── benefits-section.tsx
├── comparison-table.tsx
├── contact-form.tsx
├── facilities-grid.tsx
├── faq.tsx
├── gallery.tsx
├── hero.tsx
├── how-it-works.tsx
├── location-card.tsx
├── location-detail-card.tsx
├── location-selector.tsx
├── pricing-table.tsx
├── promo-section.tsx
├── service-location-grid.tsx
├── services-overview.tsx
├── stats-band.tsx
├── testimonials.tsx
└── whatsapp-cta.tsx
```

### UI primitives

```text
components/ui/
├── badge.tsx
├── breadcrumbs.tsx
├── button.tsx
├── card.tsx
├── container.tsx
└── section.tsx
```

Komponen page/section masih mengimpor langsung dari `lib/data/mock-data.ts`; belum ada data access layer Payload.

---

## 6. Dependensi terhadap Mock Data

Terdapat 12 lokasi import langsung dari `@/lib/data/mock-data`, termasuk:

- `app/page.tsx`
- `app/kontak/page.tsx`
- `app/promo/page.tsx`
- `app/layanan/[service]/page.tsx`
- `app/layanan/[service]/[location]/page.tsx`
- `components/layout/footer.tsx`
- `components/sections/services-overview.tsx`
- `components/sections/location-selector.tsx`
- `components/sections/facilities-grid.tsx`
- `components/sections/promo-section.tsx`
- `components/sections/testimonials.tsx`
- `components/sections/comparison-table.tsx`

Dependensi paling kritis berada pada:

- `services`
- `locations`
- `serviceLocations`
- `pricing`
- `offices`
- `promotions`
- `testimonials`
- `generalFaqs`
- `allFacilities`

---

## 7. Environment Variables

Audit hanya mencatat nama variabel; nilai secret/kredensial tidak dimasukkan ke laporan.

### Variabel yang tersedia di `.env` dan/atau `.env.example`

- `NODE_ENV`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SERVER_URL`
- `PORT`
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `PAYLOAD_SECRET`
- `PAYLOAD_ADMIN_EMAIL`
- `PAYLOAD_ADMIN_PASSWORD`
- `PAYLOAD_MEDIA_DIR`
- `NEXT_PUBLIC_MEDIA_BASE_URL`

### Observasi environment

- `.env` dan `.env.example` tersedia.
- Project sudah memiliki placeholder konfigurasi PostgreSQL/Payload, tetapi Payload belum terpasang di dependencies.
- `DATABASE_URL`/`POSTGRES_*` menunjuk konfigurasi lokal yang menggunakan port `5433`; koneksi database tidak diuji atau diubah pada fase ini.
- `PAYLOAD_SECRET` pada `.env` bersifat development dan ditandai sebagai insecure; wajib diganti dengan secret kuat sebelum environment non-development.
- `PAYLOAD_ADMIN_PASSWORD` berada di environment lokal; jangan dicatat ke Git atau laporan publik.

---

## 8. Backup Mock Data

Backup dibuat tanpa mengubah file sumber:

```text
backups/phase-1/mock-data.ts
```

File sumber:

```text
lib/data/mock-data.ts
```

SHA-256 sumber dan backup:

```text
lib/data/mock-data.ts          f831428ad84b31f9b86cf427d68951d23975f2e584730c838318e3c62bbcca7a
backups/phase-1/mock-data.ts   f831428ad84b31f9b86cf427d68951d23975f2e584730c838318e3c62bbcca7a
```

Hash identik, sehingga backup merupakan salinan byte-for-byte dari mock data saat audit.

---

## 9. Risiko Kompatibilitas sebelum Instalasi Payload

| Risiko | Level | Dampak | Mitigasi fase berikutnya |
|---|---|---|---|
| Next.js `16.3.8` + React `19.2.8` dengan Payload | Tinggi | Peer dependency/API bisa tidak cocok. | Verifikasi matriks versi Payload sebelum `npm install`; jalankan lint/build setelah instalasi. |
| Node.js `26.7.0` | Sedang-Tinggi | Sebagian package CMS/database mungkin belum menguji Node 26. | Cek engine support package; siapkan fallback ke Node LTS bila diperlukan. |
| Belum ada Payload dependency/config | Tinggi | Instalasi menyentuh routing, bundling, admin, dan server config. | Tambahkan bertahap; jangan mengubah UI sekaligus. |
| Import langsung mock di 12 lokasi | Tinggi | Cutover besar dapat memecahkan shape props. | Buat adapter/data access layer dengan output shape existing. |
| Route kantor memakai `[location]` tetapi data memiliki `offices[]` | Tinggi | Migrasi ke `service-offices` dapat mengubah resolusi URL dan static params. | Pertahankan resolver kompatibel dan validasi slug global. |
| Relasi Media vs URL Unsplash | Sedang | Field upload Payload berbeda dengan string URL lama. | Mapper menerima relationship maupun URL eksternal selama transisi. |
| PostgreSQL port/env belum diverifikasi | Sedang | Migration bisa gagal terhubung atau memakai instance yang salah. | Verifikasi koneksi secara aman sebelum migration; jangan hardcode credential. |
| Secret development lemah | Sedang | Tidak aman untuk deployment. | Ganti `PAYLOAD_SECRET` dan admin password sebelum staging/production. |
| Build static params bergantung mock | Sedang | Build dapat gagal bila CMS kosong/tidak tersedia. | Sediakan fallback mock pada `generateStaticParams` dan server data layer. |
| Data lama mempunyai struktur gabungan | Sedang-Tinggi | `serviceLocations`, packages, offices, discount harus ditransformasi. | Seed idempotent, validasi slug, dan dry-run mapping sebelum menulis DB. |

---

## 10. Perubahan yang Dilakukan pada Fase 1

Perubahan fungsional: **tidak ada**.

Artefak yang dibuat:

1. `PHASE-1-SNAPSHOT-AUDIT.md`
2. `backups/phase-1/mock-data.ts`

Tidak dilakukan:

- instalasi package
- perubahan `package.json`/lockfile
- perubahan `.env`
- perubahan source code aplikasi
- perubahan route
- perubahan database
- migrasi atau seed
- penghapusan/reset file existing

---

## Kesimpulan Fase 1

Baseline proyek **aman dan berhasil** sebelum instalasi Payload:

- Toolchain telah dicatat.
- `npm run lint` berhasil.
- `npm run build` berhasil.
- Commit dan kondisi Git telah dicatat.
- Struktur route dan komponen telah dipetakan.
- Nama environment variables telah diaudit tanpa membocorkan secret.
- Mock data telah dibackup dan hash backup identik dengan sumber.

Fase berikutnya dapat dimulai dengan verifikasi kompatibilitas dependency Payload dan rencana instalasi bertahap.
