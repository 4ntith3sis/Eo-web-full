import type { Access, CollectionConfig, Field } from "payload";

type RoleUser = { role?: string };

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);
export const isAdmin: Access = ({ req }) => (req.user as RoleUser | null)?.role === "admin";
export const isAdminOrEditor: Access = ({ req }) => {
  const role = (req.user as RoleUser | null)?.role;
  return role === "admin" || role === "editor";
};

const discountFields: Field[] = [
  { name: "active", type: "checkbox", defaultValue: false },
  {
    name: "percentage",
    type: "number",
    min: 0,
    max: 100,
    admin: { condition: (_, siblingData) => Boolean(siblingData?.active) },
  },
  {
    name: "fixed",
    type: "number",
    min: 0,
    admin: { condition: (_, siblingData) => Boolean(siblingData?.active) },
  },
];

const pricingFields: Field[] = [
  { name: "name", type: "text", required: true },
  { name: "description", type: "textarea" },
  { name: "price", type: "number", required: true, min: 0 },
  { name: "unit", type: "text", required: true },
  { name: "benefits", type: "array", fields: [{ name: "value", type: "text", required: true }] },
  { name: "discount", type: "group", fields: discountFields },
];

const iconOptions = [
  { label: "Briefcase", value: "briefcase" }, { label: "Users", value: "users" },
  { label: "Door / Ruangan", value: "door" }, { label: "Wi-Fi", value: "wifi" },
  { label: "Bell / Resepsionis", value: "bell" }, { label: "Lokasi", value: "map-pin" },
  { label: "Printer", value: "printer" }, { label: "Kopi", value: "coffee" },
  { label: "Mobil / Parkir", value: "car" }, { label: "Jam", value: "clock" },
  { label: "Laptop", value: "laptop" }, { label: "Presentasi", value: "presentation" },
  { label: "Video", value: "video" }, { label: "Dompet", value: "wallet" },
  { label: "Headset", value: "headset" }, { label: "Penghargaan", value: "award" },
  { label: "Jabat Tangan", value: "handshake" }, { label: "Bintang", value: "star" },
  { label: "Sparkles", value: "sparkles" },
];

export const Services: CollectionConfig = {
  slug: "services",
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  admin: { useAsTitle: "title", defaultColumns: ["title", "isActive"], description: "Kelola layanan yang tampil di website. Isi konten, gambar, keunggulan, dan SEO." },
  fields: [{ type: "tabs", tabs: [
    { label: "Informasi Layanan", fields: [
      { name: "title", type: "text", required: true, label: "Nama Layanan", validate: (value: unknown) => typeof value === "string" && value.trim().length >= 2 || "Nama layanan minimal 2 karakter." },
      { name: "slug", type: "text", required: true, unique: true, admin: { hidden: true } },
      { name: "shortTitle", type: "text", label: "Judul Singkat" },
      { name: "description", type: "textarea", label: "Deskripsi Singkat", admin: { description: "Jelaskan manfaat utama layanan dalam 1–3 kalimat." } },
      { name: "intro", type: "textarea", label: "Deskripsi Lengkap" },
      { name: "icon", type: "select", label: "Ikon Layanan", options: iconOptions, defaultValue: "briefcase" },
    ] },
    { label: "Keunggulan", fields: [
      { name: "benefitsTitle", type: "text", label: "Judul Keunggulan" },
      { name: "benefitsDescription", type: "textarea", label: "Deskripsi Keunggulan" },
      { name: "benefitItems", type: "array", label: "Daftar Keunggulan", labels: { singular: "Keunggulan", plural: "Keunggulan" }, fields: [{ name: "icon", type: "select", label: "Ikon", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text", label: "Judul", required: true }, { name: "description", type: "textarea", label: "Penjelasan" }] },
      { name: "benefits", type: "array", admin: { hidden: true }, fields: [{ name: "value", type: "text" }] },
      { name: "keunggulan", type: "array", admin: { hidden: true }, fields: [{ name: "icon", type: "select", options: iconOptions }, { name: "title", type: "text" }, { name: "description", type: "textarea" }] },
      { name: "features", type: "array", admin: { hidden: true }, fields: [{ name: "value", type: "text" }] },
    ] },
    { label: "Gambar", fields: [
      { name: "image", type: "upload", label: "Gambar Layanan", relationTo: "media" },
      { name: "imageAlt", type: "text", label: "Deskripsi Gambar", admin: { description: "Jelaskan isi gambar untuk aksesibilitas." } },
    ] },
    { label: "SEO & Publikasi", fields: [
      { name: "seo", type: "group", label: "SEO & Google", fields: [{ name: "title", type: "text", label: "Judul Google" }, { name: "slug", type: "text", admin: { hidden: true } }, { name: "description", type: "textarea", label: "Deskripsi Google" }, { name: "ogImage", type: "upload", label: "Gambar saat dibagikan", relationTo: "media" }, { name: "canonicalUrl", type: "text", admin: { hidden: true } }, { name: "noIndex", type: "checkbox", label: "Sembunyikan dari Google", defaultValue: false }] },
      { name: "sortOrder", type: "number", admin: { hidden: true }, defaultValue: 9999 },
      { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
    ] },
  ] }],
  hooks: { beforeValidate: [({ data }) => { if (data) { data.slug = slugify(data.title); data.seo = { ...(data.seo ?? {}), slug: slugify(data.seo?.title || data.title) }; } return data; }] },
};

const galleryFields: Field[] = [{ name: "src", type: "upload", relationTo: "media" }, { name: "alt", type: "text", label: "Teks Alternatif Gambar", admin: { description: "Jelaskan isi gambar untuk aksesibilitas dan SEO." } }];
const seoFields: Field[] = [{ name: "title", type: "text" }, { name: "slug", type: "text", admin: { readOnly: true } }, { name: "description", type: "textarea" }, { name: "ogImage", type: "upload", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }];
const facilityFields: Field[] = [{ name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text" }, { name: "description", type: "textarea" }];
const slugify = (value: unknown) => String(value ?? "").trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** New normalized office master. service-offices remains legacy during migration. */
export const Kantor: CollectionConfig = {
  slug: "kantor",
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  admin: { useAsTitle: "nama", defaultColumns: ["nama", "kota", "aktif"], description: "Kelola data kantor, kontak, foto, dan nomor WhatsApp berdasarkan lokasi." },
  fields: [
    { name: "nama", type: "text", label: "Nama Kantor", required: true }, { name: "slug", type: "text", required: true, unique: true, admin: { readOnly: true, description: "Dibuat otomatis dari kota." } }, { name: "kota", type: "text", label: "Kota", required: true },
    { name: "deskripsi", type: "textarea" }, { name: "alamat", type: "textarea", required: true }, { name: "jamOperasional", type: "text" }, { name: "email", type: "email" }, { name: "telepon", type: "text" }, { name: "whatsapp", type: "text", admin: { hidden: true, description: "Nomor lama; gunakan Daftar WhatsApp Kantor." } }, { name: "whatsappNumbers", type: "array", fields: [{ name: "label", type: "text" }, { name: "number", type: "text", required: true }, { name: "active", type: "checkbox", defaultValue: true }, { name: "priority", type: "number", defaultValue: 0 }] }, { name: "linkGoogleMaps", type: "text", label: "Link Google Maps", admin: { description: "Tempel link lokasi dari Google Maps." } }, { name: "latitude", type: "number", admin: { hidden: true } }, { name: "longitude", type: "number", admin: { hidden: true } }, { name: "foto", type: "upload", relationTo: "media", required: true }, { name: "altFoto", type: "text", required: true }, { name: "galeri", type: "array", minRows: 1, fields: galleryFields }, { name: "seo", type: "group", label: "SEO & Google", fields: seoFields }, { name: "aktif", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
  ],
  hooks: { beforeValidate: [({ data }) => { if (data) { data.slug = `easyoffice-${slugify(data.kota || data.nama)}`; data.seo = { ...(data.seo ?? {}), slug: slugify(data.seo?.title || data.nama || data.kota) }; } return data; }] },
};

/** New office × service offering. service-offices remains legacy during migration. */
export const LayananKantor: CollectionConfig = {
  slug: "layanan-kantor",
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  admin: { useAsTitle: "namaTampilan", defaultColumns: ["namaTampilan", "kantor", "layanan", "aktif"], description: "Hubungkan layanan dengan kantor, lalu isi harga, fasilitas, foto, dan SEO." },
  fields: [{ type: "tabs", tabs: [
    { label: "Kantor & Layanan", fields: [{ name: "kantor", type: "relationship", relationTo: "kantor", required: true, label: "Kantor", admin: { description: "Pilih kantor tempat layanan tersedia." } }, { name: "layanan", type: "relationship", relationTo: "services", required: true, label: "Layanan", admin: { description: "Pilih jenis layanan." } }, { name: "slug", type: "text", required: true, unique: true, admin: { hidden: true } }, { name: "namaTampilan", type: "text", label: "Nama Tampilan" }, { name: "deskripsi", type: "textarea", label: "Deskripsi" }, { name: "tagline", type: "text", label: "Tagline" }, { name: "hargaMulai", type: "text", label: "Harga Mulai" }, { name: "catatanLegalitas", type: "textarea", label: "Catatan Legalitas / PKP" }, { name: "linkShopee", type: "text", admin: { hidden: true } }] },
    { label: "Harga & Fasilitas", fields: [{ name: "paketHarga", type: "array", minRows: 1, labels: { singular: "Paket Harga", plural: "Paket Harga" }, fields: pricingFields }, { name: "fasilitas", type: "array", minRows: 6, maxRows: 6, labels: { singular: "Fasilitas", plural: "Fasilitas" }, fields: facilityFields }] },
    { label: "Foto & Publikasi", fields: [{ name: "foto", type: "upload", label: "Foto Utama", relationTo: "media", required: true }, { name: "altFoto", type: "text", label: "Deskripsi Foto", required: true }, { name: "galeri", type: "array", label: "Galeri Foto", minRows: 1, fields: galleryFields }, { name: "seo", type: "group", label: "SEO & Google", fields: seoFields }, { name: "aktif", type: "checkbox", label: "Tampilkan di Website", defaultValue: true }] },
  ] }],
  hooks: { beforeValidate: [async ({ data, req, originalDoc }) => {
    if (data?.kantor && data?.layanan) {
      const kantor = typeof data.kantor === "object" ? data.kantor : await req.payload.findByID({ collection: "kantor", id: data.kantor as string });
      const layanan = typeof data.layanan === "object" ? data.layanan : await req.payload.findByID({ collection: "services", id: data.layanan as string });
      data.slug = `${slugify((layanan as { slug?: string; title?: string }).slug || (layanan as { title?: string }).title)}-${slugify((kantor as { slug?: string; kota?: string; nama?: string }).slug || (kantor as { kota?: string; nama?: string }).kota || (kantor as { nama?: string }).nama)}`;
      data.seo = { ...(data.seo ?? {}), slug: slugify(data.seo?.title || data.namaTampilan || data.slug) };
    }
    if (!data?.kantor || !data?.layanan) return data;
    const kantor = typeof data.kantor === "object" ? data.kantor.id : data.kantor;
    const layanan = typeof data.layanan === "object" ? data.layanan.id : data.layanan;
    const existing = await req.payload.find({ collection: "layanan-kantor", where: { and: [{ kantor: { equals: kantor } }, { layanan: { equals: layanan } }] }, limit: 1 });
    if (existing.docs.some((doc) => doc.id !== originalDoc?.id)) throw new Error("Kombinasi kantor dan layanan ini sudah ada.");
    return data;
  }] },
};

// Public pages read active content without a user session. Mutations remain restricted.
const simpleContentAccess = { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin };

export const Media: CollectionConfig = {
  slug: "media",
  access: simpleContentAccess,
  upload: { staticDir: "public/media", mimeTypes: ["image/jpeg", "image/png", "image/webp"], formatOptions: { format: "webp", options: { quality: 78 } } },
  fields: [{ name: "alt", type: "text", label: "Teks Alternatif Gambar", admin: { description: "Jelaskan isi gambar untuk aksesibilitas dan SEO." } }],
};

export const Promotions: CollectionConfig = {
  slug: "promotions",
  access: simpleContentAccess,
  admin: { useAsTitle: "title" },
  fields: [
    { name: "badge", type: "select", label: "Jenis Promo", defaultValue: "promo", options: [{ label: "Promo — Claim Promo", value: "promo" }, { label: "Trial — Coba Gratis", value: "trial" }, { label: "Diskon — Claim Diskon", value: "diskon" }], admin: { description: "Kategori ini menentukan badge dan teks tombol promo di website." } }, { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", label: "Deskripsi Promo" }, { name: "period", type: "text", label: "Periode Promo", admin: { description: "Contoh: Berlaku sampai 31 Desember 2026." } },
    { name: "service", type: "relationship", relationTo: "services", required: true, label: "Layanan Terkait", admin: { description: "Tombol promo akan menuju halaman layanan ini." } }, { name: "image", type: "upload", relationTo: "media", label: "Gambar Promo" }, { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
    { name: "ctaLabel", type: "text", label: "Teks Tombol (Legacy)", defaultValue: "Ambil Promo", admin: { hidden: true, description: "Tidak digunakan untuk promo baru. Teks tombol otomatis mengikuti Jenis Promo." } }, { name: "ctaMessage", type: "textarea", label: "Pesan WhatsApp Promo (Legacy)", admin: { hidden: true } }, { name: "ctaHref", type: "text", label: "Link Promo (Legacy)", admin: { hidden: true, description: "Tidak digunakan. Tombol promo menuju Layanan Terkait." } },
  ],
};

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  access: simpleContentAccess,
  admin: { useAsTitle: "name", description: "Kelola testimoni pelanggan." },
  fields: [
    { name: "name", type: "text", label: "Nama Pelanggan", required: true }, { name: "company", type: "text", label: "Perusahaan" },
    { name: "quote", type: "textarea", label: "Isi Testimoni", required: true }, { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const ComparisonRows: CollectionConfig = {
  slug: "comparison-rows",
  access: simpleContentAccess,
  admin: { useAsTitle: "feature", description: "Tambahkan satu fitur per baris. Isi nama fitur dan pilih status ketersediaannya." },
  fields: [{ type: "tabs", tabs: [
    { label: "Informasi Fitur", fields: [{ name: "feature", type: "text", required: true, label: "Nama Fitur", admin: { description: "Tulis satu nama fitur singkat, misalnya: Alamat bisnis profesional." } }] },
    { label: "Ketersediaan", fields: [
      { name: "easyoffice", type: "select", label: "Di EasyOffice", defaultValue: "true", options: [{ label: "Ya, tersedia", value: "true" }, { label: "Tergantung paket atau lokasi", value: "neutral" }, { label: "Tidak tersedia", value: "false" }], admin: { description: "Pilih bagaimana fitur ini tersedia di EasyOffice." } },
      { name: "typical", type: "select", label: "Di Penyedia Lain", defaultValue: "neutral", options: [{ label: "Umumnya tersedia", value: "true" }, { label: "Tergantung penyedia", value: "neutral" }, { label: "Umumnya tidak tersedia", value: "false" }], admin: { description: "Pilih kondisi umum fitur ini pada penyedia lain." } },
    ] },
    { label: "Penempatan", fields: [
      { name: "service", type: "relationship", relationTo: "services", label: "Berlaku untuk Layanan", admin: { description: "Kosongkan jika fitur berlaku untuk semua layanan." } },
      { name: "sortOrder", type: "number", label: "Urutan Tampil", defaultValue: 0, admin: { hidden: true } },
      { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
    ] },
  ] }],
};

export const HomepageLayout: CollectionConfig = {
  slug: "homepage-layout",
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: { useAsTitle: "name", hidden: true },
  fields: [
    { name: "name", type: "text", required: true, defaultValue: "Homepage" },
    { name: "route", type: "text", required: true, unique: true, admin: { description: "URL halaman, contoh: /tentang-kami-baru" } },
    { name: "layout", type: "json", required: true },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }] },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const Faqs: CollectionConfig = {
  slug: "faqs",
  access: simpleContentAccess,
  admin: { useAsTitle: "title", description: "Buat satu grup FAQ, lalu tambahkan pertanyaan dan jawaban di dalamnya." },
  fields: [
    { name: "title", type: "text", required: true, label: "Judul FAQ", admin: { description: "Contoh: Pertanyaan Umum Virtual Office." } },
    { name: "service", type: "relationship", relationTo: "services", label: "Untuk Layanan", admin: { description: "Kosongkan jika FAQ ini berlaku untuk semua layanan." } },
    { name: "question", type: "text", admin: { hidden: true } },
    { name: "answer", type: "textarea", admin: { hidden: true } },
    { name: "items", type: "array", labels: { singular: "Pertanyaan & Jawaban", plural: "Pertanyaan & Jawaban" }, admin: { description: "Tambahkan satu pertanyaan dan jawabannya pada setiap blok." }, fields: [
      { name: "question", type: "text", required: true, label: "Pertanyaan", admin: { description: "Tulis pertanyaan seperti yang biasanya ditanyakan pelanggan." } },
      { name: "answer", type: "textarea", required: true, label: "Jawaban", admin: { description: "Tulis jawaban yang jelas dan mudah dipahami." } },
      { name: "sortOrder", type: "number", defaultValue: 0, admin: { hidden: true } },
    ] },
    { name: "sortOrder", type: "number", label: "Urutan Tampil", defaultValue: 0, admin: { hidden: true } },
    { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
  ],
};

export const HomepageFacilities: CollectionConfig = {
  slug: "homepage-facilities",
  access: simpleContentAccess,
  admin: { useAsTitle: "title", description: "Kelola judul dan isi promo." },
  fields: [
    { name: "title", type: "text", label: "Judul Fasilitas", required: true },
    { name: "description", type: "textarea" },
    { name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" },
    { name: "sortOrder", type: "number", label: "Urutan Tampil", defaultValue: 0 },
    { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
  ],
};

export const Leads: CollectionConfig = {
  slug: "leads",
  access: { read: isAuthenticated, create: () => true, update: isAdminOrEditor, delete: isAdmin },
  admin: { useAsTitle: "name", defaultColumns: ["name", "contact", "status", "createdAt"] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "contact", type: "text", required: true },
    { name: "interestedService", type: "relationship", relationTo: "services", label: "Layanan yang Diminati" },
    { name: "location", type: "text" },
    { name: "sourcePage", type: "text", label: "Halaman Asal" },
    { name: "status", type: "select", label: "Status Prospek", defaultValue: "new", options: [{ label: "Baru", value: "new" }, { label: "Sudah Dihubungi", value: "contacted" }, { label: "Berpotensi", value: "qualified" }, { label: "Selesai", value: "closed" }] },
    { name: "notes", type: "textarea" },
  ],
};

export const SiteSettings: import("payload").GlobalConfig = {
  slug: "site-settings",
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    { name: "siteName", type: "text", defaultValue: "EasyOffice" },
    { name: "tagline", type: "text" },
    { name: "defaultWhatsapp", type: "text", label: "Nomor WhatsApp Global (Legacy)", admin: { hidden: true, description: "Nomor cadangan global lama." } },
    { name: "primaryWhatsapp", type: "text", label: "Nomor WhatsApp Utama", admin: { description: "Nomor utama untuk halaman Kontak." } },
    { name: "whatsappNumbers", type: "array", label: "Daftar Nomor WhatsApp Global", labels: { singular: "Nomor WhatsApp", plural: "Nomor WhatsApp Global" }, admin: { description: "Tambahkan beberapa nomor. Nomor aktif dengan urutan prioritas teratas akan digunakan otomatis." }, fields: [{ name: "label", type: "text", label: "Nama Penggunaan", admin: { description: "Contoh: Sales, Customer Service, atau Marketing." } }, { name: "number", type: "text", label: "Nomor WhatsApp", required: true }, { name: "active", type: "checkbox", label: "Aktif", defaultValue: true }, { name: "priority", type: "number", label: "Urutan Penggunaan", defaultValue: 0, admin: { description: "Angka lebih kecil digunakan lebih dahulu." } }] },
    { name: "defaultWhatsappByLocation", type: "array", label: "Nomor Cadangan per Lokasi (Legacy)", admin: { hidden: true, description: "Pengaturan lama. Gunakan nomor WhatsApp pada data kantor." }, fields: [{ name: "location", type: "text", label: "Lokasi" }, { name: "number", type: "text", label: "Nomor WhatsApp" }] },
    { name: "email", type: "email" }, { name: "phone", type: "text" }, { name: "address", type: "textarea" },
    { name: "operatingHours", type: "text" },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "headerCtaLabel", type: "text", defaultValue: "Hubungi Kami" },
    { name: "headerCtaMessage", type: "textarea" },
    { name: "navigation", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text" }, { name: "children", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text", required: true }, { name: "description", type: "text" }] }] },
    { name: "footerServicesTitle", type: "text", defaultValue: "Layanan Kami" },
    { name: "footerCompanyTitle", type: "text", defaultValue: "Perusahaan" },
    { name: "footerContactTitle", type: "text", defaultValue: "Hubungi Kami" },
    { name: "footerDescription", type: "textarea" },
    { name: "copyrightText", type: "text" },
    { name: "socialLinks", type: "array", fields: [{ name: "label", type: "text" }, { name: "url", type: "text" }] },
    { name: "defaultSeoTitle", type: "text", label: "Judul SEO Default", admin: { description: "Judul cadangan untuk halaman yang belum memiliki SEO khusus." } }, { name: "defaultSeoDescription", type: "textarea", label: "Deskripsi SEO Default" }, { name: "gtmContainerId", type: "text", label: "Google Tag Manager ID", admin: { description: "Opsional. Hanya perlu diisi jika menggunakan Google Tag Manager." } },
    { name: "homepageHeroEyebrow", type: "text", label: "Teks Kecil Hero", defaultValue: "EasyOffice" },
    { name: "homepageHeroTitle", type: "text", label: "Judul Hero", admin: { description: "Judul utama yang tampil di bagian paling atas homepage." } }, { name: "homepageHeroDescription", type: "textarea", label: "Deskripsi Hero" },
    { name: "homepageHeroImage", type: "upload", label: "Gambar Hero", relationTo: "media" }, { name: "homepageHeroImageAlt", type: "text", label: "Deskripsi Aksesibilitas Gambar", admin: { description: "Jelaskan isi gambar untuk screen reader." } }, { name: "homepageHeroImageLabel", type: "text", label: "Label di Atas Gambar" },
    { name: "homepageHeroPrimaryCtaLabel", type: "text", label: "Teks Tombol Utama", defaultValue: "Hubungi Kami" }, { name: "homepageHeroPrimaryCtaMessage", type: "textarea", label: "Pesan WhatsApp Tombol Utama" },
    { name: "homepageHeroSecondaryCtaLabel", type: "text", label: "Teks Tombol Kedua", defaultValue: "Lihat Layanan" }, { name: "homepageHeroSecondaryCtaHref", type: "text", label: "Link Tombol Kedua", defaultValue: "/layanan/virtual-office" },
    { name: "homepageHeroTrustItems", type: "array", label: "Poin Keunggulan Hero", labels: { singular: "Poin Keunggulan", plural: "Poin Keunggulan" }, fields: [{ name: "text", type: "text", label: "Teks Poin", required: true }, { name: "sortOrder", type: "number", label: "Urutan", defaultValue: 0 }] },
    { name: "homepageServicesTitle", type: "text", label: "Judul Section Layanan", defaultValue: "Layanan EasyOffice" },
    { name: "homepageServicesDescription", type: "textarea", label: "Deskripsi Section Layanan" },
    { name: "homepageFacilitiesTitle", type: "text", label: "Judul Section Fasilitas", defaultValue: "Mengapa Pilih EasyOffice?" },
    { name: "homepageFacilitiesDescription", type: "textarea", label: "Deskripsi Section Fasilitas" },
    { name: "homepageComparisonTitle", type: "text", label: "Judul Section Perbandingan", defaultValue: "Perbandingan dengan Office Lain" },
    { name: "homepageComparisonDescription", type: "textarea", label: "Deskripsi Section Perbandingan" },
    { name: "homepagePromoTitle", type: "text", label: "Judul Section Promo", defaultValue: "Penawaran Spesial untuk Anda" },
    { name: "homepagePromoDescription", type: "textarea", label: "Deskripsi Section Promo" },
    { name: "homepageShopeeTitle", type: "text", label: "Judul Section Shopee", defaultValue: "Pesan Paket EasyOffice dengan Mudah" },
    { name: "homepageShopeeDescription", type: "textarea", label: "Deskripsi Section Shopee" },
    { name: "homepageShopeeImage", type: "upload", label: "Gambar Section Shopee", relationTo: "media" },
    { name: "homepageShopeeImageAlt", type: "text", label: "Deskripsi Gambar Shopee" },
    { name: "homepageShopeeCtaLabel", type: "text", label: "Label Shopee", defaultValue: "Shopee", admin: { description: "Teks identitas marketplace pada section informasi Shopee." } },
    { name: "homepageShopeeHref", type: "text", label: "Link Shopee Homepage", admin: { hidden: true, description: "Legacy. Tidak digunakan oleh section informasi Shopee." } },
    { name: "statsBanner", type: "array", label: "Statistik Homepage", labels: { singular: "Statistik", plural: "Statistik Homepage" }, admin: { description: "Isi angka, label, dan pilih ikon yang paling sesuai untuk setiap statistik." }, fields: [{ name: "value", type: "text", required: true, label: "Nilai" }, { name: "label", type: "text", required: true, label: "Label" }, { name: "icon", type: "select", label: "Ikon", defaultValue: "auto", options: [{ label: "Otomatis berdasarkan label", value: "auto" }, { label: "Lokasi / Kota", value: "location" }, { label: "Pengguna / Client", value: "users" }, { label: "Bisnis / Perusahaan", value: "briefcase" }, { label: "Rating / Bintang", value: "star" }, { label: "Legal / Terverifikasi", value: "shield" }, { label: "Ceklis", value: "check" }, { label: "Pesan / WhatsApp", value: "message" }, { label: "Jam / Kecepatan", value: "clock" }, { label: "Target / Pencapaian", value: "target" }, { label: "Gedung / Kantor", value: "building" }, { label: "Penghargaan", value: "award" }, { label: "Uang / Harga", value: "banknote" }, { label: "Kalender", value: "calendar" }, { label: "Global / Dunia", value: "globe" }, { label: "Headset / Bantuan", value: "headset" }, { label: "Pertumbuhan / Roket", value: "rocket" }, { label: "Belanja", value: "shopping" }, { label: "Pencapaian / Trofi", value: "trophy" }, { label: "Cepat / Energi", value: "zap" }, { label: "Kemitraan", value: "handshake" }, { label: "Favorit / Hati", value: "heart" }, { label: "Dompet", value: "wallet" }] } ] },
    { name: "howItWorks", type: "array", label: "Cara Kerja", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "sortOrder", type: "number", label: "Urutan" }] },
  ],
};

export const AboutPage: import("payload").GlobalConfig = {
  slug: "about-page",
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "Tentang EasyOffice" },
    { name: "heroTitle", type: "text" }, { name: "heroTitleAccent", type: "text" }, { name: "heroDescription", type: "textarea" },
    { name: "heroImage", type: "upload", relationTo: "media" }, { name: "heroImageAlt", type: "text" },
    { name: "heroBadgeTitle", type: "text" }, { name: "heroBadgeText", type: "text" }, { name: "heroRating", type: "text" }, { name: "heroRatingText", type: "text" },
    { name: "heroHighlights", type: "array", fields: [{ name: "value", type: "text" }] },
    { name: "storyEyebrow", type: "text" }, { name: "storyTitle", type: "text" }, { name: "storyTitleAccent", type: "text" }, { name: "storyDescription", type: "textarea" },
    { name: "storyImage", type: "upload", relationTo: "media" }, { name: "storyImageAlt", type: "text" }, { name: "storyBadgeTitle", type: "text" }, { name: "storyBadgeText", type: "text" },
    { name: "storyHighlights", type: "array", fields: [{ name: "value", type: "text" }] },
    { name: "stats", type: "array", fields: [{ name: "value", type: "text" }, { name: "label", type: "text" }] },
    { name: "valuesEyebrow", type: "text" }, { name: "valuesTitle", type: "text" }, { name: "valuesDescription", type: "textarea" },
    { name: "values", type: "array", fields: [{ name: "icon", type: "text" }, { name: "title", type: "text" }, { name: "description", type: "textarea" }] },
  ],
};
