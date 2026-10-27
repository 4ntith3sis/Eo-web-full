import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const Users = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
  access: {
    read: ({ req }) => req.user?.role === "admin",
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
};

const discountFields = [
  { name: "active", type: "checkbox", defaultValue: false },
  { name: "percentage", type: "number", min: 0, max: 100 },
  { name: "fixed", type: "number", min: 0 },
];
const iconOptions = [{ label: "Briefcase", value: "briefcase" }, { label: "Users", value: "users" }, { label: "Door / Ruangan", value: "door" }, { label: "Wi-Fi", value: "wifi" }, { label: "Bell / Resepsionis", value: "bell" }, { label: "Lokasi", value: "map-pin" }, { label: "Printer", value: "printer" }, { label: "Kopi", value: "coffee" }, { label: "Mobil / Parkir", value: "car" }, { label: "Jam", value: "clock" }, { label: "Laptop", value: "laptop" }, { label: "Presentasi", value: "presentation" }, { label: "Video", value: "video" }, { label: "Dompet", value: "wallet" }, { label: "Headset", value: "headset" }, { label: "Penghargaan", value: "award" }, { label: "Jabat Tangan", value: "handshake" }, { label: "Bintang", value: "star" }, { label: "Sparkles", value: "sparkles" }];
const isAuthenticated = ({ req }) => Boolean(req.user);
const isAdmin = ({ req }) => req.user?.role === "admin";
const isAdminOrEditor = ({ req }) => req.user?.role === "admin" || req.user?.role === "editor";
const pricingFields = [
  { name: "name", type: "text", required: true },
  { name: "description", type: "textarea" },
  { name: "price", type: "number", required: true, min: 0 },
  { name: "unit", type: "text", required: true },
  { name: "benefits", type: "array", fields: [{ name: "value", type: "text", required: true }] },
  { name: "discount", type: "group", fields: discountFields },
];
const Services = { slug: "services", access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "title" }, fields: [
  { name: "title", type: "text", required: true, validate: (value) => typeof value === "string" && value.trim().length >= 2 || "Nama layanan minimal 2 karakter." }, { name: "slug", type: "text", required: true, unique: true, admin: { readOnly: true } }, { name: "sortOrder", type: "number", defaultValue: 9999, admin: { description: "Urutan card layanan di beranda. Angka lebih kecil tampil lebih dulu." } },
  { name: "shortTitle", type: "text" }, { name: "description", type: "textarea" }, { name: "intro", type: "textarea" },
  { name: "benefits", type: "array", fields: [{ name: "value", type: "text" }] }, { name: "benefitsTitle", type: "text" }, { name: "benefitsDescription", type: "textarea" }, { name: "benefitItems", type: "array", fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text", required: true }, { name: "description", type: "textarea" }] }, { name: "keunggulan", type: "array", fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text", required: true }, { name: "description", type: "textarea" }] }, { name: "features", type: "array", fields: [{ name: "value", type: "text" }] },
  { name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" }, { name: "image", type: "upload", relationTo: "media" }, { name: "imageAlt", type: "text" }, { name: "seo", type: "group", fields: [{ name: "title", type: "text" }, { name: "slug", type: "text", admin: { readOnly: true } }, { name: "description", type: "textarea" }, { name: "ogImage", type: "upload", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }] }, { name: "isActive", type: "checkbox", defaultValue: true },
] };
/* legacy collection retained only in source history; not registered */
const Kantor = { slug: "kantor", access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "nama" }, fields: [
  { name: "nama", type: "text", required: true }, { name: "slug", type: "text", required: true, unique: true, admin: { readOnly: true } }, { name: "kota", type: "text", required: true }, { name: "deskripsi", type: "textarea" }, { name: "alamat", type: "textarea", required: true }, { name: "jamOperasional", type: "text" }, { name: "email", type: "email" }, { name: "telepon", type: "text" }, { name: "whatsapp", type: "text", admin: { hidden: true, description: "Nomor lama; gunakan Daftar WhatsApp Kantor." } }, { name: "whatsappNumbers", type: "array", label: "Daftar Nomor WhatsApp Global", labels: { singular: "Nomor WhatsApp", plural: "Nomor WhatsApp Global" }, admin: { description: "Tambahkan beberapa nomor. Nomor aktif dengan urutan prioritas teratas akan digunakan otomatis." }, fields: [{ name: "label", type: "text" }, { name: "number", type: "text", required: true }, { name: "active", type: "checkbox", defaultValue: true }, { name: "priority", type: "number", defaultValue: 0 }] }, { name: "linkGoogleMaps", type: "text" }, { name: "latitude", type: "number" }, { name: "longitude", type: "number" }, { name: "foto", type: "upload", relationTo: "media", required: true }, { name: "altFoto", type: "text", required: true }, { name: "galeri", type: "array", minRows: 1, fields: [{ name: "src", type: "upload", relationTo: "media" }, { name: "alt", type: "text" }] }, { name: "seo", type: "group", fields: [{ name: "title", type: "text" }, { name: "slug", type: "text", admin: { readOnly: true } }, { name: "description", type: "textarea" }, { name: "ogImage", type: "upload", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }] }, { name: "aktif", type: "checkbox", defaultValue: true },
] };
const LayananKantor = { slug: "layanan-kantor", access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "namaTampilan" }, fields: [
  { name: "kantor", type: "relationship", relationTo: "kantor", required: true }, { name: "layanan", type: "relationship", relationTo: "services", required: true }, { name: "slug", type: "text", required: true, unique: true }, { name: "namaTampilan", type: "text" }, { name: "deskripsi", type: "textarea" }, { name: "tagline", type: "text" }, { name: "hargaMulai", type: "text" }, { name: "catatanLegalitas", type: "textarea", label: "Catatan Legalitas / PKP" }, { name: "linkShopee", type: "text", label: "Link Pembayaran Shopee", admin: { hidden: true, description: "Legacy. Section Shopee sekarang hanya menampilkan informasi." } }, { name: "paketHarga", type: "array", minRows: 1, fields: pricingFields }, { name: "fasilitas", type: "array", minRows: 6, maxRows: 6, fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text" }, { name: "description", type: "textarea" },] }, { name: "foto", type: "upload", relationTo: "media", required: true }, { name: "altFoto", type: "text", required: true }, { name: "galeri", type: "array", minRows: 1, fields: [{ name: "src", type: "upload", relationTo: "media" }, { name: "alt", type: "text" }] }, { name: "seo", type: "group", fields: [{ name: "title", type: "text" }, { name: "slug", type: "text", admin: { readOnly: true } }, { name: "description", type: "textarea" }, { name: "ogImage", type: "upload", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }] }, { name: "aktif", type: "checkbox", defaultValue: true },
] };
const simpleContentAccess = { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin };
const Media = { slug: "media", access: simpleContentAccess, upload: { staticDir: "public/media", mimeTypes: ["image/jpeg", "image/png", "image/webp"], formatOptions: { format: "webp", options: { quality: 78 } } }, fields: [{ name: "alt", type: "text" }] };
const Promotions = { slug: "promotions", access: simpleContentAccess, admin: { useAsTitle: "title", description: "Buat penawaran dengan memilih satu jenis promo. Badge dan teks tombol ditentukan otomatis." }, fields: [{ name: "badge", type: "select", label: "Jenis Promo", defaultValue: "promo", options: [{ label: "Promo — Claim Promo", value: "promo" }, { label: "Trial — Coba Gratis", value: "trial" }, { label: "Diskon — Claim Diskon", value: "diskon" }], admin: { description: "Pilihan ini menentukan badge dan teks tombol pada kartu promo." } }, { name: "title", type: "text", required: true, label: "Judul Promo" }, { name: "description", type: "textarea", label: "Deskripsi Promo" }, { name: "period", type: "text", label: "Periode Promo", admin: { description: "Contoh: Berlaku sampai 31 Desember 2026." } }, { name: "service", type: "relationship", relationTo: "services", required: true, label: "Layanan Terkait", admin: { description: "Tombol promo akan menuju halaman layanan ini." } }, { name: "image", type: "upload", relationTo: "media", label: "Gambar Promo" }, { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true }, { name: "ctaLabel", type: "text", label: "Teks Tombol (Legacy)", defaultValue: "Ambil Promo", admin: { hidden: true } }, { name: "ctaMessage", type: "textarea", label: "Pesan WhatsApp Promo (Legacy)", admin: { hidden: true } }, { name: "ctaHref", type: "text", label: "Link Promo (Legacy)", admin: { hidden: true } }] };
const Testimonials = { slug: "testimonials", access: simpleContentAccess, admin: { useAsTitle: "name" }, fields: [{ name: "name", type: "text", required: true }, { name: "company", type: "text" }, { name: "quote", type: "textarea", required: true }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const ComparisonRows = { slug: "comparison-rows", access: simpleContentAccess, admin: { useAsTitle: "feature" }, fields: [{ name: "feature", type: "text", required: true }, { name: "easyoffice", type: "select", label: "Ketersediaan EasyOffice", defaultValue: "true", options: [{ label: "Tersedia", value: "true" }, { label: "Belum tentu tersedia", value: "neutral" }, { label: "Tidak tersedia", value: "false" }] }, { name: "typical", type: "select", label: "Ketersediaan Penyedia Lain", defaultValue: "neutral", options: [{ label: "Tersedia", value: "true" }, { label: "Belum tentu tersedia", value: "neutral" }, { label: "Tidak tersedia", value: "false" }] }, { name: "service", type: "relationship", relationTo: "services" }, { name: "sortOrder", type: "number", defaultValue: 0 }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const HomepageLayout = { slug: "homepage-layout", access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "name", hidden: true }, fields: [{ name: "name", type: "text", required: true, defaultValue: "Halaman Baru" }, { name: "route", type: "text", required: true, unique: true }, { name: "layout", type: "json", required: true }, { name: "status", type: "select", required: true, defaultValue: "draft", options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }] }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const Faqs = { slug: "faqs", access: simpleContentAccess, admin: { useAsTitle: "title" }, fields: [{ name: "title", type: "text", required: true }, { name: "service", type: "relationship", relationTo: "services" }, { name: "question", type: "text", admin: { hidden: true } }, { name: "answer", type: "textarea", admin: { hidden: true } }, { name: "items", type: "array", fields: [{ name: "question", type: "text", required: true }, { name: "answer", type: "textarea", required: true }, { name: "sortOrder", type: "number", defaultValue: 0 }] }, { name: "sortOrder", type: "number", defaultValue: 0 }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const HomepageFacilities = { slug: "homepage-facilities", access: simpleContentAccess, admin: { useAsTitle: "title" }, fields: [{ name: "title", type: "text", required: true }, { name: "description", type: "textarea" }, { name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" }, { name: "image", type: "upload", relationTo: "media" }, { name: "imageAlt", type: "text" }, { name: "sortOrder", type: "number", defaultValue: 0 }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const Leads = { slug: "leads", access: { read: isAuthenticated, create: () => true, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "name" }, fields: [{ name: "name", type: "text", required: true }, { name: "contact", type: "text", required: true }, { name: "interestedService", type: "relationship", relationTo: "services" }, { name: "location", type: "text" }, { name: "sourcePage", type: "text" }, { name: "status", type: "select", defaultValue: "new", options: ["new", "contacted", "qualified", "closed"] }, { name: "notes", type: "textarea" }] };
const AboutPage = { slug: "about-page", access: { read: () => true, update: isAdminOrEditor }, fields: [{ name: "eyebrow", type: "text" }, { name: "heroTitle", type: "text" }, { name: "heroTitleAccent", type: "text" }, { name: "heroDescription", type: "textarea" }, { name: "heroImage", type: "upload", relationTo: "media" }, { name: "heroImageAlt", type: "text" }, { name: "heroBadgeTitle", type: "text" }, { name: "heroBadgeText", type: "text" }, { name: "heroRating", type: "text" }, { name: "heroRatingText", type: "text" }, { name: "heroHighlights", type: "array", fields: [{ name: "value", type: "text" }] }, { name: "storyEyebrow", type: "text" }, { name: "storyTitle", type: "text" }, { name: "storyTitleAccent", type: "text" }, { name: "storyDescription", type: "textarea" }, { name: "storyImage", type: "upload", relationTo: "media" }, { name: "storyImageAlt", type: "text" }, { name: "storyBadgeTitle", type: "text" }, { name: "storyBadgeText", type: "text" }, { name: "storyHighlights", type: "array", fields: [{ name: "value", type: "text" }] }, { name: "stats", type: "array", fields: [{ name: "value", type: "text" }, { name: "label", type: "text" }] }, { name: "valuesEyebrow", type: "text" }, { name: "valuesTitle", type: "text" }, { name: "valuesDescription", type: "textarea" }, { name: "values", type: "array", fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" }, { name: "title", type: "text" }, { name: "description", type: "textarea" }] }] };
const SiteSettings = { slug: "site-settings", access: { read: () => true, update: isAdminOrEditor }, fields: [{ name: "siteName", type: "text" }, { name: "tagline", type: "text" }, { name: "defaultWhatsapp", type: "text", label: "Nomor WhatsApp Global (Legacy)", admin: { hidden: true, description: "Nomor cadangan global lama. Gunakan Daftar Nomor WhatsApp Global." } }, { name: "primaryWhatsapp", type: "text", label: "Nomor WhatsApp Utama", admin: { description: "Nomor utama yang hanya digunakan pada halaman Kontak." } }, { name: "whatsappNumbers", type: "array", label: "Daftar Nomor WhatsApp Global", labels: { singular: "Nomor WhatsApp", plural: "Nomor WhatsApp Global" }, admin: { description: "Tambahkan beberapa nomor. Nomor aktif dengan urutan prioritas teratas akan digunakan otomatis." }, fields: [{ name: "label", type: "text" }, { name: "number", type: "text", required: true }, { name: "active", type: "checkbox", defaultValue: true }, { name: "priority", type: "number", defaultValue: 0 }] }, { name: "email", type: "email" }, { name: "phone", type: "text" }, { name: "operatingHours", type: "text" }, { name: "logo", type: "upload", relationTo: "media" }, { name: "headerCtaLabel", type: "text" }, { name: "headerCtaMessage", type: "textarea" }, { name: "navigation", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text" }, { name: "children", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text", required: true }, { name: "description", type: "text" }] }] }, { name: "footerServicesTitle", type: "text" }, { name: "footerCompanyTitle", type: "text" }, { name: "footerContactTitle", type: "text" }, { name: "footerDescription", type: "textarea" }, { name: "copyrightText", type: "text" }, { name: "defaultSeoTitle", type: "text" }, { name: "defaultSeoDescription", type: "textarea" }, { name: "gtmContainerId", type: "text" }, { name: "homepageHeroEyebrow", type: "text", defaultValue: "EasyOffice" }, { name: "homepageHeroTitle", type: "text" }, { name: "homepageHeroDescription", type: "textarea" }, { name: "homepageHeroImage", type: "upload", relationTo: "media" }, { name: "homepageHeroImageAlt", type: "text" }, { name: "homepageHeroImageLabel", type: "text" }, { name: "homepageHeroPrimaryCtaLabel", type: "text", defaultValue: "Hubungi Kami" }, { name: "homepageHeroPrimaryCtaMessage", type: "textarea" }, { name: "homepageHeroSecondaryCtaLabel", type: "text", defaultValue: "Lihat Layanan" }, { name: "homepageHeroSecondaryCtaHref", type: "text", defaultValue: "/layanan/virtual-office" }, { name: "homepageHeroTrustItems", type: "array", fields: [{ name: "text", type: "text", required: true }, { name: "sortOrder", type: "number", defaultValue: 0 }] },  { name: "homepageServicesTitle", type: "text", label: "Judul Section Layanan", defaultValue: "Layanan EasyOffice" }, { name: "homepageServicesDescription", type: "textarea", label: "Deskripsi Section Layanan" }, { name: "homepageFacilitiesTitle", type: "text", label: "Judul Section Fasilitas", defaultValue: "Mengapa Pilih EasyOffice?" }, { name: "homepageFacilitiesDescription", type: "textarea", label: "Deskripsi Section Fasilitas" }, { name: "homepageComparisonTitle", type: "text", label: "Judul Section Perbandingan", defaultValue: "Perbandingan dengan Office Lain" }, { name: "homepageComparisonDescription", type: "textarea", label: "Deskripsi Section Perbandingan" }, { name: "homepagePromoTitle", type: "text", label: "Judul Section Promo", defaultValue: "Penawaran Spesial untuk Anda" }, { name: "homepagePromoDescription", type: "textarea", label: "Deskripsi Section Promo" },{ name: "homepageShopeeTitle", type: "text", label: "Judul Section Shopee", defaultValue: "Pesan Paket EasyOffice dengan Mudah" }, { name: "homepageShopeeDescription", type: "textarea", label: "Deskripsi Section Shopee" }, { name: "homepageShopeeImage", type: "upload", label: "Gambar Section Shopee", relationTo: "media" }, { name: "homepageShopeeImageAlt", type: "text", label: "Deskripsi Gambar Shopee" }, { name: "homepageShopeeCtaLabel", type: "text", label: "Label Shopee", defaultValue: "Shopee", admin: { description: "Teks identitas marketplace pada section informasi Shopee." } }, { name: "homepageShopeeHref", type: "text", label: "Link Shopee Homepage", admin: { hidden: true, description: "Legacy. Tidak digunakan oleh section informasi Shopee." } }, { name: "statsBanner", type: "array", label: "Statistik Homepage", labels: { singular: "Statistik", plural: "Statistik Homepage" }, admin: { description: "Isi angka, label, dan pilih ikon yang paling sesuai untuk setiap statistik." }, fields: [{ name: "value", type: "text", required: true, label: "Nilai" }, { name: "label", type: "text", required: true, label: "Label" }, { name: "icon", type: "select", label: "Ikon", defaultValue: "auto", options: [{ label: "Otomatis berdasarkan label", value: "auto" }, { label: "Lokasi / Kota", value: "location" }, { label: "Pengguna / Client", value: "users" }, { label: "Bisnis / Perusahaan", value: "briefcase" }, { label: "Rating / Bintang", value: "star" }, { label: "Legal / Terverifikasi", value: "shield" }, { label: "Ceklis", value: "check" }, { label: "Pesan / WhatsApp", value: "message" }, { label: "Jam / Kecepatan", value: "clock" }, { label: "Target / Pencapaian", value: "target" }, { label: "Gedung / Kantor", value: "building" }, { label: "Penghargaan", value: "award" }, { label: "Uang / Harga", value: "banknote" }, { label: "Kalender", value: "calendar" }, { label: "Global / Dunia", value: "globe" }, { label: "Headset / Bantuan", value: "headset" }, { label: "Pertumbuhan / Roket", value: "rocket" }, { label: "Belanja", value: "shopping" }, { label: "Pencapaian / Trofi", value: "trophy" }, { label: "Cepat / Energi", value: "zap" }, { label: "Kemitraan", value: "handshake" }, { label: "Favorit / Hati", value: "heart" }, { label: "Dompet", value: "wallet" }] } ] }, { name: "howItWorks", type: "array", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "sortOrder", type: "number" }] }] };

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "app/(payload)"),
    },
    components: {
      afterNavLinks: [{ path: "../../payload/components/puck-builder-link.tsx", exportName: "PuckBuilderLink" }],
    },
    views: {
      puckBuilder: {
        path: "/puck-builder",
        exact: true,
        Component: { path: "../../payload/components/puck-manager-view.tsx", exportName: "default" },
      },
    },
  },
  collections: [Users, Services, Kantor, LayananKantor, Media, Promotions, Testimonials, ComparisonRows, HomepageLayout, Faqs, HomepageFacilities, Leads],
  globals: [SiteSettings, AboutPage],
  db: postgresAdapter({
    generateSchemaOutputFile: path.resolve(dirname, "payload-generated-schema.ts"),
    migrationDir: path.resolve(dirname, "migrations"),
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
  }),
  sharp,
  graphQL: {
    disable: true,
  },
    typescript: {
      outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  telemetry: false,
});
