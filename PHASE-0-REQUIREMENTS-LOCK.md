# FASE 0 — PERSIAPAN DAN PENGUNCIAN REQUIREMENT

**Project:** EasyOffice  
**Tanggal:** 2026-10-24  
**Status:** Dikunci untuk persiapan implementasi Payload CMS  
**Perubahan implementasi:** Tidak ada instalasi, migrasi database, seed, atau perubahan source code pada fase ini.

---

## 1. Keputusan Arsitektur

| Area | Keputusan final |
|---|---|
| Database | PostgreSQL |
| CMS | Payload CMS |
| Integrasi aplikasi | Payload CMS terintegrasi langsung dengan Next.js melalui server-side/local API |
| Koleksi utama | `services`, `cities`, `service-offices`, `media`, `promotions`, `testimonials` |
| Draft/publish | Tidak digunakan. Semua dokumen langsung dianggap aktif, kecuali `promotions` yang memiliki status bisnis tersendiri. |
| Paket harga | Nested di dalam `service-offices`, bukan collection terpisah |
| Diskon | Berada pada paket harga; mendukung aktif/nonaktif dan persentase/nominal tetap |
| Keunikan slug kantor | `service-offices.slug` unik secara global, lintas kota dan layanan |
| Data lama | Boleh diganti atau dihapus selama migrasi; tidak ada kewajiban mempertahankan ID/struktur lama |
| Fallback | Mock data dipertahankan selama migrasi dan dipakai otomatis bila CMS belum siap/gagal diakses |

### Konsekuensi dari keputusan ini

- Istilah CMS final adalah **city** dan **service-office**; model lama `locations`/`serviceLocations` tidak menjadi batasan schema baru.
- Satu dokumen `service-office` mewakili satu kantor yang menawarkan satu layanan di satu kota.
- Satu kota dapat memiliki banyak kantor, termasuk kantor untuk layanan yang berbeda.
- Paket, harga, dan diskon dikelola pada konteks kantor-layanan agar setiap halaman kantor dapat berdiri sendiri.
- Tidak ada collection `packages`.
- Tidak ada workflow approval atau field Payload `drafts`/`_status`.

---

## 2. Struktur Data Final

```text
services
    └── service-offices.service -> services

cities
    └── service-offices.city -> cities

service-offices
    ├── service -> services
    ├── city -> cities
    ├── packages[]
    │   └── discount
    └── media -> media (hero/gallery, bila digunakan)

promotions
    ├── service -> services (opsional)
    └── media -> media (opsional)

testimonials
    └── media -> media (opsional, hanya jika diperlukan oleh tampilan)
```

### Aturan integritas data

1. `services.slug` unik.
2. `cities.slug` unik.
3. `service-offices.slug` unik **secara global**. Slug tidak boleh hanya unik dalam kota atau layanan.
4. Kombinasi `service-offices.service + service-offices.city` boleh memiliki lebih dari satu kantor, selama setiap kantor memiliki slug global yang berbeda.
5. Paket harga tidak memiliki ID bisnis atau URL sendiri; paket hanya hidup di dalam `service-office`.
6. Diskon nonaktif tetap disimpan tetapi tidak diterapkan pada harga publik.
7. Promotion berstatus `inactive` tetap disimpan tetapi tidak dikirim ke komponen publik.
8. Tidak ada dokumen yang disembunyikan karena status draft/publish.

---

## 3. Daftar Field Setiap Collection

Field `id`, `createdAt`, dan `updatedAt` dianggap sebagai field teknis Payload dan tidak termasuk keputusan bisnis di bawah ini.

### 3.1 `services`

| Field | Tipe | Wajib | Catatan |
|---|---|---:|---|
| `title` | Text | Ya | Nama layanan publik. |
| `slug` | Text | Ya | Unik; digunakan untuk URL layanan. |
| `shortTitle` | Text | Tidak | Versi pendek untuk navigasi/kartu. |
| `description` | Textarea | Ya | Deskripsi ringkas layanan. |
| `intro` | Textarea/Rich text | Ya | Intro pada halaman layanan. |
| `benefits` | Array of Text | Ya | Daftar manfaat layanan. |
| `features` | Array of Text | Tidak | Fitur ringkas layanan bila ditampilkan. |
| `icon` | Text | Tidak | Identifier ikon yang dipakai frontend. |
| `image` | Relationship -> `media` atau URL eksternal | Ya | Gambar utama layanan. URL eksternal lama boleh dipertahankan saat migrasi. |
| `imageAlt` | Text | Ya | Teks alternatif gambar. |

### 3.2 `cities`

| Field | Tipe | Wajib | Catatan |
|---|---|---:|---|
| `name` | Text | Ya | Nama kota. |
| `slug` | Text | Ya | Unik; identifier kota. |
| `shortDescription` | Textarea | Ya | Ringkasan kota/lokasi. |
| `address` | Textarea | Ya | Alamat umum kota/cabang bila berlaku. |
| `operatingHours` | Text | Ya | Jam operasional default. |
| `email` | Email | Ya | Kontak kota. |
| `phoneDisplay` | Text | Ya | Nomor telepon yang ditampilkan. |
| `whatsapp` | Text | Ya | Nomor WhatsApp default kota. |
| `image` | Relationship -> `media` atau URL eksternal | Tidak | Gambar kota/cabang bila digunakan. |

`cities` hanya menyimpan informasi umum kota. Detail kantor spesifik—nama kantor, alamat kantor, kontak override, gambar kantor—disimpan di `service-offices`.

### 3.3 `service-offices`

| Field | Tipe | Wajib | Catatan |
|---|---|---:|---|
| `slug` | Text | Ya | **Unik global**; dipakai sebagai segment URL kantor. |
| `name` | Text | Ya | Nama kantor yang tampil di UI. |
| `service` | Relationship -> `services` | Ya | Layanan yang tersedia di kantor ini. |
| `city` | Relationship -> `cities` | Ya | Kota tempat kantor berada. |
| `description` | Textarea/Rich text | Tidak | Deskripsi khusus kantor. |
| `tagline` | Text | Tidak | Tagline halaman kantor-layanan. |
| `address` | Textarea | Ya | Alamat spesifik kantor. |
| `operatingHours` | Text | Tidak | Override jam operasional kota. |
| `email` | Email | Tidak | Override email kota. |
| `phoneDisplay` | Text | Tidak | Override nomor telepon kota. |
| `whatsapp` | Text | Tidak | Override WhatsApp kota. |
| `startingPrice` | Text | Tidak | Harga mulai yang ditampilkan; dapat diturunkan dari paket jika tidak diisi. |
| `image` | Relationship -> `media` atau URL eksternal | Tidak | Hero kantor. URL Unsplash lama dipertahankan selama migrasi. |
| `imageAlt` | Text | Tidak | Teks alternatif hero. |
| `gallery` | Array of objects | Tidak | Item: `image` (media/URL) dan `alt`. |
| `facilities` | Array of objects | Tidak | Item: `icon`, `title`, `description`. Nested karena fasilitas dapat berbeda per kantor. |
| `faqs` | Array of objects | Tidak | Item: `question`, `answer`; FAQ khusus kantor. |
| `packages` | Array of objects | Ya | Paket harga kantor; minimal satu paket untuk kantor yang dijual. |

#### Struktur `service-offices.packages[]`

| Field | Tipe | Wajib | Catatan |
|---|---|---:|---|
| `name` | Text | Ya | Nama paket. |
| `description` | Textarea | Tidak | Penjelasan paket. |
| `price` | Text/Number | Ya | Harga dasar sebelum diskon. Format tampilan boleh dinormalisasi oleh data layer. |
| `period` | Text | Ya | Contoh: `/bulan`, `/jam`, `/hari`. |
| `features` | Array of Text | Ya | Isi/manfaat paket. |
| `featured` | Checkbox | Tidak | Penanda visual paket unggulan bila memang dipakai UI. |
| `ctaLabel` | Text | Ya | Label tombol CTA. |
| `discount.enabled` | Checkbox | Ya | Mengaktifkan/nonaktifkan diskon paket. Default `false`. |
| `discount.type` | Select: `percentage` / `fixed` | Kondisional | Wajib bila `enabled=true`. |
| `discount.value` | Number | Kondisional | Wajib bila `enabled=true`; harus lebih besar dari 0. |
| `discount.label` | Text | Tidak | Label promosi opsional, misalnya `Hemat 20%`. |
| `discountedPrice` | Number/Text | Tidak | Nilai hasil kalkulasi/cache opsional; sumber kebenaran tetap `price` + `discount`. |

#### Aturan diskon paket

- `enabled=false`: harga publik = `price`; field tipe/nilai boleh kosong atau diabaikan.
- `type=percentage`: `value` berada pada rentang `0 < value <= 100`; harga akhir dihitung `price - (price × value / 100)`.
- `type=fixed`: `value` adalah nominal potongan; harga akhir tidak boleh kurang dari nol.
- Diskon tidak memakai tanggal publikasi atau draft/publish.
- Jika perlu menonaktifkan diskon, ubah `enabled` menjadi `false`; jangan menghapus histori data secara otomatis.

### 3.4 `media`

Collection upload Payload dengan penyimpanan lokal.

| Field | Tipe | Wajib | Catatan |
|---|---|---:|---|
| `file` | Upload | Ya | File media Payload. |
| `alt` | Text | Tidak | Teks alternatif default. |
| `caption` | Text | Tidak | Caption bila digunakan. |

Media lama dari Unsplash **tidak wajib diunduh atau dipindahkan** pada migrasi awal. URL eksternal tetap valid sebagai fallback/legacy source sampai migrasi media disetujui.

### 3.5 `promotions`

| Field | Tipe | Wajib | Catatan |
|---|---|---:|---|
| `badge` | Text | Ya | Label singkat promo. |
| `title` | Text | Ya | Judul promo. |
| `description` | Textarea/Rich text | Ya | Detail promo. |
| `period` | Text | Ya | Periode yang ditampilkan sebagai teks. |
| `status` | Select: `active` / `inactive` | Ya | `inactive` tersimpan tetapi tidak tampil publik. |
| `service` | Relationship -> `services` | Tidak | Relasi layanan jika promo spesifik layanan. |
| `image` | Relationship -> `media` atau URL eksternal | Tidak | Gambar promo bila digunakan. |

Tidak ada `publishedAt`, `draft`, atau status publish Payload. `status` hanya aturan bisnis untuk visibilitas promo.

### 3.6 `testimonials`

| Field | Tipe | Wajib | Catatan |
|---|---|---:|---|
| `name` | Text | Ya | Nama pemberi testimonial. |
| `company` | Text | Ya | Nama perusahaan. |
| `quote` | Textarea/Rich text | Ya | Isi testimonial. |
| `image` | Relationship -> `media` | Tidak | Hanya jika tampilan final membutuhkannya. |

Tidak menambahkan `avatar`, `isFeatured`, atau `order` sebagai requirement wajib.

---

## 4. Keputusan URL

URL publik dipertahankan sedekat mungkin dengan route yang sudah ada:

| Halaman | URL |
|---|---|
| Beranda | `/` |
| Daftar layanan | `/layanan` atau entrypoint navigasi yang sudah ada |
| Detail layanan | `/layanan/[serviceSlug]` |
| Detail kantor | `/layanan/[serviceSlug]/[officeSlug]` |
| Promo | `/promo` |
| Tentang kami | `/tentang-kami` |
| Kontak | `/kontak` |

### Aturan routing kantor

- `[serviceSlug]` berasal dari `services.slug`.
- `[officeSlug]` berasal dari `service-offices.slug` dan **unik global**.
- Resolusi halaman detail menggunakan dua parameter: service + office slug. Data harus diverifikasi agar kantor tersebut memang terkait dengan service pada URL.
- Slug kantor tidak menggunakan `city.slug` sebagai bagian wajib URL. Kota tetap tersedia melalui relasi `service-office.city` dan breadcrumb/metadata.
- Redirect lama seperti `/virtual-office` tetap dipertahankan bila sudah ada di `next.config.ts`.
- Jika slug lama diganti, redirect permanen dapat dibuat pada fase migrasi; tidak ada kewajiban mempertahankan slug lama selain yang dipilih untuk kompatibilitas SEO.

---

## 5. Strategi Fallback Mock

### Tujuan

Menjaga situs tetap dapat dirender selama Payload, PostgreSQL, migration, atau seed belum siap—dan tetap toleran terhadap kegagalan CMS saat development/build.

### Bentuk implementasi yang disepakati

1. Pertahankan `lib/data/mock-data.ts` selama seluruh fase migrasi.
2. Buat data access layer CMS yang mengembalikan shape frontend yang sama dengan tipe existing.
3. Setiap query utama mengikuti pola:
   - coba ambil data dari Payload Local API;
   - normalisasi relasi/media ke shape komponen;
   - bila CMS tidak tersedia, query gagal, atau hasil wajib kosong, gunakan mock data;
   - jangan mencampur sebagian data CMS dan sebagian mock dalam satu entitas kecuali mapper secara eksplisit mendukungnya.
4. Pada fase awal, mock menjadi fallback default yang aman; CMS menjadi primary source setelah koneksi dan seed tervalidasi.
5. `generateStaticParams` harus dapat dibangun dari CMS dan memiliki fallback ke daftar mock agar build tidak terblokir.
6. URL gambar eksternal dari mock tetap boleh digunakan jika field Media belum terisi.
7. Fallback tidak menulis data kembali ke Payload dan tidak menjalankan seed otomatis.

### Urutan cutover

```text
mock only
  -> CMS read + mock fallback per query
  -> CMS primary + mock fallback untuk error/empty
  -> CMS primary setelah validasi production
```

### Kriteria fallback dianggap aman

- Halaman `/`, `/layanan/[service]`, dan `/layanan/[service]/[officeSlug]` tetap dapat dirender tanpa database.
- Paket tetap memiliki shape `name`, `price`, `period`, `features`, `ctaLabel`, dan informasi diskon.
- Promo `inactive` tidak tampil ketika sumbernya CMS maupun mock adapter.
- Kegagalan Payload tidak menyebabkan error fatal pada server component.
- Tidak ada perubahan prop pada komponen UI selama migrasi.

---

## 6. Batasan Migrasi Data Lama

- Data lama boleh **diganti, ditransformasi, atau dihapus** untuk mencapai struktur final.
- Seed/migrasi wajib memetakan data lama ke enam collection final, bukan mempertahankan nama collection lama secara otomatis.
- Data `serviceLocations[]` lama dipetakan ke `service-offices`; field `pricing[]` dipindahkan menjadi `packages[]` di dalam dokumen tersebut.
- Data `offices[]` lama menjadi dokumen `service-offices` individual bila setiap kantor harus memiliki slug global dan halaman sendiri.
- Jika ada konflik slug, gunakan keputusan bisnis baru dan catat mapping slug lama -> slug baru pada script migrasi/log, tanpa mengubah requirement keunikan global.
- Penghapusan data lama hanya dilakukan setelah backup/ekspor yang disetujui pada fase implementasi; Fase 0 sendiri tidak menghapus apa pun.

---

## 7. Output Fase 0

Requirement final yang siap menjadi dasar Fase instalasi dan implementasi:

- PostgreSQL ditetapkan sebagai database.
- Payload CMS ditetapkan untuk integrasi dengan Next.js.
- Enam collection final dikunci: `services`, `cities`, `service-offices`, `media`, `promotions`, `testimonials`.
- Paket harga berada nested di `service-offices`.
- Diskon paket mendukung `enabled`, `percentage`, dan `fixed`.
- Draft/publish tidak digunakan.
- Slug `service-offices` unik global.
- Data lama boleh diganti/dihapus saat migrasi dengan proses terkontrol.
- Mock data dipertahankan sebagai fallback selama migrasi dan cutover CMS.
- URL utama tetap berbasis `/layanan/[serviceSlug]/[officeSlug]`.

**Status:** Fase 0 selesai dan requirement terkunci. Implementasi Payload, instalasi dependency, konfigurasi PostgreSQL, migration, dan seed dilakukan pada fase berikutnya.
