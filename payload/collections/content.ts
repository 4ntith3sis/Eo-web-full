import type { Access, CollectionConfig, Field } from "payload";
import { revalidatePath } from "next/cache";

type RoleUser = { role?: string };

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);
export const isAdmin: Access = ({ req }) => (req.user as RoleUser | null)?.role === "admin";
export const isAdminOrEditor: Access = ({ req }) => {
  const role = (req.user as RoleUser | null)?.role;
  return role === "admin" || role === "editor";
};

function validateLayoutForPublish(value: unknown): string | null {
  if (!value || typeof value !== "object") return "Layout halaman tidak valid.";
  const content = (value as { content?: unknown }).content;
  if (!Array.isArray(content)) return "Isi layout halaman tidak valid.";
  const walk = (items: unknown[], depth = 0): string | null => {
    if (depth > 6) return "Struktur layout terlalu dalam.";
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const node = item as { type?: string; props?: Record<string, unknown> };
      const props = node.props ?? {};
      if (node.type === "Heading" && !String(props.children ?? "").trim()) return "Heading tidak boleh kosong.";
      if (node.type === "Button" && (!String(props.label ?? "").trim() || /^(javascript|data):/i.test(String(props.href ?? "")))) return "Button memiliki label atau link yang tidak valid.";
      if (node.type === "Image" && !String(props.alt ?? "").trim()) return "Setiap gambar wajib memiliki alt text.";
      for (const child of Object.values(props)) if (Array.isArray(child)) { const error = walk(child, depth + 1); if (error) return error; }
    }
    return null;
  };
  return walk(content);
}


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
      { name: "icon", type: "select", label: "Ikon Layanan (Legacy)", options: iconOptions, defaultValue: "briefcase", admin: { hidden: true, description: "Kartu layanan menggunakan gambar layanan, bukan ikon tambahan." } },
    ] },
    { label: "Keunggulan", fields: [
      { name: "benefitsTitle", type: "text", label: "Judul Keunggulan" },
      { name: "benefitsDescription", type: "textarea", label: "Deskripsi Keunggulan" },
      { name: "keunggulanItems", type: "array", label: "Daftar Keunggulan", labels: { singular: "Keunggulan", plural: "Keunggulan" }, fields: [{ name: "icon", type: "select", label: "Ikon", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text", label: "Judul", required: true }, { name: "description", type: "textarea", label: "Penjelasan" }] },
    ] },
    { label: "Manfaat", fields: [
      { name: "manfaatTitle", type: "text", label: "Judul Manfaat" },
      { name: "manfaatDescription", type: "textarea", label: "Deskripsi Manfaat" },
      { name: "manfaatItems", type: "array", label: "Daftar Manfaat", labels: { singular: "Manfaat", plural: "Manfaat" }, fields: [{ name: "icon", type: "select", label: "Ikon", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text", label: "Judul", required: true }, { name: "description", type: "textarea", label: "Penjelasan" }] },
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
const facilityFields: Field[] = [{ name: "icon", type: "select", label: "Ikon Fasilitas", options: iconOptions, defaultValue: "sparkles", admin: { description: "Pilih ikon yang paling sesuai dengan fasilitas." } }, { name: "title", type: "text", label: "Nama Fasilitas", required: true }, { name: "description", type: "textarea", label: "Penjelasan Fasilitas" }];
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
    { label: "Harga & Fasilitas", fields: [{ name: "paketHarga", type: "array", minRows: 1, labels: { singular: "Paket Harga", plural: "Paket Harga" }, fields: pricingFields }, { name: "fasilitas", type: "array", labels: { singular: "Fasilitas", plural: "Fasilitas" }, admin: { description: "Jumlah fasilitas fleksibel. Saat ini desain biasanya menggunakan 6 item, tetapi tidak wajib." }, fields: facilityFields }] },
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
  upload: { mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
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

export const Partners: CollectionConfig = {
  slug: "partners",
  access: simpleContentAccess,
  admin: { useAsTitle: "name", defaultColumns: ["name", "sortOrder", "isActive"], description: "Kelola logo mitra yang ditampilkan sebelum testimoni." },
  fields: [
    { name: "name", type: "text", label: "Nama Mitra", required: true },
    { name: "logo", type: "upload", relationTo: "media", label: "Logo", required: true },
    { name: "logoAlt", type: "text", label: "Teks Alternatif", admin: { description: "Jelaskan logo untuk aksesibilitas." } },
    { name: "href", type: "text", label: "Tautan (Opsional)" },
    { name: "sortOrder", type: "number", label: "Urutan", defaultValue: 0 },
    { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
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
      { name: "placement", type: "select", label: "Penempatan Data", options: [{ label: "Global", value: "global" }, { label: "Layanan", value: "service" }], admin: { description: "Pilih Global atau Layanan. Data tanpa penempatan tidak akan ditampilkan." } },
      { name: "service", type: "relationship", relationTo: "services", label: "Berlaku untuk Layanan", admin: { description: "Wajib diisi jika Penempatan = Layanan." } },
      { name: "sortOrder", type: "number", label: "Urutan Tampil", defaultValue: 0, admin: { hidden: true } },
      { name: "isActive", type: "checkbox", label: "Tampilkan di Website", defaultValue: true },
    ] },
  ] }],
  hooks: { beforeValidate: [({ data }) => { if (!data) return data; if (data.placement === "service" && !data.service) throw new Error("Pilih layanan jika Penempatan Data diatur ke Layanan."); if (data.placement === "global" && data.service) throw new Error("Kosongkan layanan jika Penempatan Data diatur ke Global."); return data; }] },
};

export const PageLayout: CollectionConfig = {
  slug: "page-layout",
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: ({ req, data }) => {
      const role = (req.user as RoleUser | null)?.role;
      if (role === "admin") return true;
      return role === "editor" && data?.status !== "published";
    },
    delete: isAdmin,
  },
  admin: { useAsTitle: "name", defaultColumns: ["name", "route", "status", "isActive", "editVisual"], description: "Kelola halaman visual dan routing website. Gunakan tombol Edit Visual dengan Puck untuk mengatur tampilan halaman." },
  labels: { singular: "Halaman", plural: "Halaman" },
  hooks: {
    beforeValidate: [({ data, req }) => {
      if (!data) return data;
      const name = String(data.name ?? "Homepage").trim();
      const slug = name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "halaman";
      data.name = name;
      data.route = `/${slug}`;
      data.seoTitle = data.seoTitle || name;
      data.seoDescription = data.seoDescription || `Informasi ${name} EasyOffice.`;
      if (data.status === "published") {
        if ((req.user as RoleUser | null)?.role !== "admin") throw new Error("Hanya admin yang dapat mempublish halaman.");
        const layoutError = validateLayoutForPublish(data.layout);
        if (layoutError) throw new Error(layoutError);
      }
      return data;
    }],
    afterChange: [({ doc }) => { revalidatePath(String(doc.route ?? "/")); revalidatePath("/"); return doc; }],
  },
  fields: [
    { name: "name", type: "text", required: true, defaultValue: "Homepage" },
    { name: "route", type: "text", required: true, unique: true, admin: { readOnly: true, description: "Slug otomatis dari nama halaman." } },
    { name: "seoTitle", type: "text", label: "Judul SEO", admin: { description: "Default mengikuti nama halaman." } },
    { name: "seoDescription", type: "textarea", label: "Deskripsi SEO", admin: { description: "Default dibuat dari nama halaman." } },
    { name: "layout", type: "json", required: true, defaultValue: { content: [], root: {} }, admin: { hidden: true } },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }] },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "editVisual", type: "ui", admin: { components: { Cell: "../../payload/components/puck-edit-cell.tsx#PuckEditCell" } } },
  ],
};

export const Faqs: CollectionConfig = {
  slug: "faqs",
  access: simpleContentAccess,
  admin: { useAsTitle: "title", description: "Buat satu grup FAQ, lalu tambahkan pertanyaan dan jawaban di dalamnya." },
  fields: [
    { name: "title", type: "text", required: true, label: "Judul FAQ", admin: { description: "Contoh: Pertanyaan Umum Virtual Office." } },
    { name: "placement", type: "select", label: "Penempatan FAQ", options: [{ label: "Global", value: "global" }, { label: "Layanan", value: "service" }], admin: { description: "Pilih Global atau Layanan. FAQ tanpa penempatan tidak akan ditampilkan." } },
    { name: "service", type: "relationship", relationTo: "services", label: "Untuk Layanan", admin: { description: "Wajib diisi jika Penempatan = Layanan." } },
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
  hooks: { beforeValidate: [({ data }) => { if (!data) return data; if (data.placement === "service" && !data.service) throw new Error("Pilih layanan jika Penempatan FAQ diatur ke Layanan."); if (data.placement === "global" && data.service) throw new Error("Kosongkan layanan jika Penempatan FAQ diatur ke Global."); return data; }] },
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
  label: "Pengaturan Website",
  admin: { group: "Konten Website" },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: {
    afterRead: [({ doc }) => {
      const defaults: Record<string, string> = {
        siteName: "EasyOffice",
        headerCtaLabel: "Hubungi Kami",
        homepageHeroEyebrow: "EasyOffice",
        homepageHeroTitle: "Solusi Ruang Kerja Profesional untuk Bisnis Anda",
        homepageHeroDescription: "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional.",
        homepageHeroImageLabel: "Virtual Office • Coworking Space • Meeting Room • Private Office",
        homepageHeroPrimaryCtaLabel: "Hubungi Kami",
        homepageHeroPrimaryCtaMessage: "Halo EasyOffice, saya ingin bertanya tentang layanan Anda.",
        homepageHeroSecondaryCtaLabel: "Lihat Layanan",
        homepageHeroSecondaryCtaHref: "/layanan/virtual-office",
        homepageServicesTitle: "Layanan EasyOffice",
        homepageServicesDescription: "Berbagai layanan untuk mendukung operasional dan citra profesional bisnis Anda.",
        homepageFacilitiesTitle: "Mengapa Pilih EasyOffice?",
        homepageFacilitiesDescription: "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda.",
        homepageComparisonTitle: "Perbandingan dengan Office Lain",
        homepageComparisonDescription: "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice.",
        homepagePromoTitle: "Penawaran Spesial untuk Anda",
        homepagePromoDescription: "Temukan penawaran EasyOffice untuk kebutuhan ruang kerja dan bisnis Anda.",
        homepageShopeeTitle: "Pesan Paket EasyOffice dengan Mudah",
        homepageShopeeDescription: "Pembayaran layanan EasyOffice tersedia melalui marketplace Shopee dengan transaksi yang aman dan terpercaya.",
        homepageCtaTitle: "Siap Menemukan Ruang Kerja yang Tepat?",
        homepageCtaDescription: "Hubungi EasyOffice melalui WhatsApp — tim kami siap membantu memilih layanan dan lokasi yang sesuai dengan kebutuhan bisnis Anda.",
        homepageCtaButtonLabel: "Hubungi via WhatsApp",
        homepageCtaSecondaryButtonLabel: "Lihat Info Kontak",
        footerDescription: "Solusi Ruang Kerja Profesional. Virtual Office, Coworking Space, dan Meeting Room di Bandung, Jakarta, dan Bekasi.",
        copyrightText: `© ${new Date().getFullYear()} EasyOffice. Seluruh hak cipta dilindungi.`,
        defaultSeoTitle: "EasyOffice — Virtual Office, Coworking Space & Meeting Room",
        defaultSeoDescription: "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi.",
      };
      const result = { ...doc };
      for (const [key, value] of Object.entries(defaults)) {
        if (result[key] == null || result[key] === "") result[key] = value;
      }
      return result;
    }],
  },
  fields: [
    { type: "tabs", tabs: [
      { label: "Identitas & Kontak", description: "Informasi utama yang dilihat pengunjung saat mencari atau menghubungi EasyOffice.", fields: [
        { name: "siteName", type: "text", label: "Nama Bisnis", defaultValue: "EasyOffice", required: true },
        { name: "tagline", type: "text", label: "Slogan Singkat", admin: { description: "Kalimat pendek tentang EasyOffice." } },
        { name: "logo", type: "upload", label: "Logo Website", relationTo: "media", admin: { description: "Pilih gambar logo. Format yang disarankan: PNG atau WebP." } },
        { name: "email", type: "email", label: "Email Kontak" },
        { name: "phone", type: "text", label: "Nomor Telepon", admin: { description: "Gunakan format internasional, misalnya +62…" } },
        { name: "address", type: "textarea", label: "Alamat Kantor" },
        { name: "operatingHours", type: "text", label: "Jam Operasional", admin: { description: "Contoh: Senin–Jumat, 09.00–17.00 WIB." } },
      ] },
      { label: "WhatsApp", description: "Atur nomor yang digunakan tombol WhatsApp di website.", fields: [
        { name: "primaryWhatsapp", type: "text", label: "Nomor WhatsApp Halaman Kontak", admin: { description: "Nomor khusus yang tampil di halaman Kontak. Sertakan kode negara, tanpa tanda + atau spasi; contoh 62812…" } },
        { name: "whatsappNumbers", type: "array", label: "Nomor WhatsApp untuk Tombol Website", labels: { singular: "Nomor WhatsApp", plural: "Daftar Nomor WhatsApp" }, admin: { description: "Tambahkan nomor untuk tombol chat website. Nomor aktif dengan angka urutan paling kecil dipilih lebih dahulu." }, fields: [
          { name: "label", type: "text", label: "Nama Tim", admin: { description: "Contoh: Sales atau Customer Service." } },
          { name: "number", type: "text", label: "Nomor WhatsApp", required: true, admin: { description: "Gunakan kode negara tanpa tanda + atau spasi; contoh 62812…" } },
          { name: "active", type: "checkbox", label: "Gunakan Nomor Ini", defaultValue: true },
          { name: "priority", type: "number", label: "Urutan Prioritas", defaultValue: 0, admin: { description: "Angka paling kecil dipilih lebih dahulu." } },
        ] },
        { name: "headerCtaLabel", type: "text", label: "Teks Tombol Kontak di Header", defaultValue: "Hubungi Kami" },
        { name: "headerCtaMessage", type: "textarea", label: "Pesan WhatsApp dari Header", admin: { description: "Opsional. Pesan awal yang muncul saat pengunjung menekan tombol header." } },
      ] },
      { label: "Beranda: Bagian Pembuka", description: "Judul, gambar, dan tombol pertama yang dilihat pengunjung di halaman utama.", fields: [
        { name: "homepageHeroEyebrow", type: "text", label: "Teks Kecil di Atas Judul", defaultValue: "EasyOffice" },
        { name: "homepageHeroTitle", type: "text", label: "Judul Utama", admin: { description: "Tulis pesan utama untuk calon pelanggan." } },
        { name: "homepageHeroDescription", type: "textarea", label: "Penjelasan Singkat" },
        { name: "homepageHeroImage", type: "upload", label: "Gambar Utama", relationTo: "media" },
        { name: "homepageHeroImageLabel", type: "text", label: "Teks pada Gambar", defaultValue: "Virtual Office • Coworking Space • Meeting Room • Private Office" },
    { name: "homepageHeroPrimaryCtaLabel", type: "text", label: "Teks Tombol Utama", defaultValue: "Hubungi Kami" },
        { name: "homepageHeroPrimaryCtaMessage", type: "textarea", label: "Pesan WhatsApp Tombol Utama", defaultValue: "Halo EasyOffice, saya ingin bertanya tentang layanan Anda." },
        { name: "homepageHeroSecondaryCtaLabel", type: "text", label: "Teks Tombol Kedua", defaultValue: "Lihat Layanan" },
        { name: "homepageHeroSecondaryCtaHref", type: "text", label: "Tujuan Tombol Kedua", defaultValue: "/layanan/virtual-office", admin: { description: "Gunakan alamat halaman website yang diawali /, misalnya /layanan/virtual-office." } },
        { name: "homepageHeroTrustItems", type: "array", label: "Poin Keunggulan", labels: { singular: "Poin", plural: "Daftar Poin" }, fields: [{ name: "text", type: "text", label: "Teks Poin", required: true }, { name: "sortOrder", type: "number", label: "Urutan Tampil", defaultValue: 0 }] },
      ] },
      { label: "Beranda: Bagian Lain", description: "Judul dan penjelasan untuk bagian layanan, fasilitas, perbandingan, promo, dan Shopee.", fields: [
        { name: "homepageServicesTitle", type: "text", label: "Judul Bagian Layanan", defaultValue: "Layanan EasyOffice" },
        { name: "homepageServicesDescription", type: "textarea", label: "Penjelasan Bagian Layanan", defaultValue: "Berbagai layanan untuk mendukung operasional dan citra profesional bisnis Anda." },
        { name: "homepageFacilitiesTitle", type: "text", label: "Judul Bagian Fasilitas", defaultValue: "Mengapa Pilih EasyOffice?" },
        { name: "homepageFacilitiesDescription", type: "textarea", label: "Penjelasan Bagian Fasilitas", defaultValue: "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda." },
        { name: "homepageComparisonTitle", type: "text", label: "Judul Bagian Perbandingan", defaultValue: "Perbandingan dengan Office Lain" },
        { name: "homepageComparisonDescription", type: "textarea", label: "Penjelasan Bagian Perbandingan", defaultValue: "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice." },
        { name: "homepagePromoTitle", type: "text", label: "Judul Bagian Promo", defaultValue: "Penawaran Spesial untuk Anda" },
        { name: "homepagePromoDescription", type: "textarea", label: "Penjelasan Bagian Promo", defaultValue: "Temukan penawaran EasyOffice untuk kebutuhan ruang kerja dan bisnis Anda." },
        { name: "homepageShopeeTitle", type: "text", label: "Judul Bagian Shopee", defaultValue: "Pesan Paket EasyOffice dengan Mudah" },
        { name: "homepageShopeeDescription", type: "textarea", label: "Penjelasan Bagian Shopee", defaultValue: "Pembayaran layanan EasyOffice tersedia melalui marketplace Shopee dengan transaksi yang aman dan terpercaya." },
        { name: "homepageShopeeImage", type: "upload", label: "Gambar Bagian Shopee", relationTo: "media" },
        { name: "homepageShopeeCtaLabel", type: "text", label: "Label CTA Shopee (Tidak Digunakan)", admin: { hidden: true, description: "Field lama yang tidak digunakan. Bagian Shopee hanya menampilkan informasi." } },
        { name: "homepageShopeeHref", type: "text", label: "Tautan Shopee (Tidak Digunakan)", admin: { hidden: true, description: "Field lama yang tidak digunakan. Bagian Shopee hanya menampilkan informasi." } },
        { name: "homepageCtaTitle", type: "text", label: "Judul Ajakan Menghubungi", defaultValue: "Siap Menemukan Ruang Kerja yang Tepat?" },
        { name: "homepageCtaDescription", type: "textarea", label: "Penjelasan Ajakan Menghubungi", defaultValue: "Hubungi EasyOffice melalui WhatsApp — tim kami siap membantu memilih layanan dan lokasi yang sesuai dengan kebutuhan bisnis Anda." },
        { name: "homepageCtaButtonLabel", type: "text", label: "Teks Tombol Ajakan", defaultValue: "Hubungi via WhatsApp" },
        { name: "homepageCtaSecondaryButtonLabel", type: "text", label: "Teks Tombol Info Kontak", defaultValue: "Lihat Info Kontak" },
        { name: "statsBanner", type: "array", label: "Statistik di Beranda", labels: { singular: "Statistik", plural: "Daftar Statistik" }, admin: { description: "Contoh: nilai 10+, label Tahun Pengalaman." }, fields: [{ name: "value", type: "text", label: "Angka atau Nilai", required: true }, { name: "label", type: "text", label: "Keterangan", required: true }, { name: "icon", type: "select", label: "Ikon", defaultValue: "auto", options: [{ label: "Pilih otomatis", value: "auto" }, { label: "Lokasi / Kota", value: "location" }, { label: "Pengguna / Klien", value: "users" }, { label: "Bisnis / Perusahaan", value: "briefcase" }, { label: "Rating / Bintang", value: "star" }, { label: "Legal / Terverifikasi", value: "shield" }, { label: "Ceklis", value: "check" }, { label: "Pesan / WhatsApp", value: "message" }, { label: "Jam / Kecepatan", value: "clock" }, { label: "Target / Pencapaian", value: "target" }, { label: "Gedung / Kantor", value: "building" }, { label: "Penghargaan", value: "award" }, { label: "Uang / Harga", value: "banknote" }, { label: "Kalender", value: "calendar" }, { label: "Global / Dunia", value: "globe" }, { label: "Bantuan", value: "headset" }, { label: "Pertumbuhan", value: "rocket" }, { label: "Belanja", value: "shopping" }, { label: "Trofi", value: "trophy" }, { label: "Energi", value: "zap" }, { label: "Kemitraan", value: "handshake" }, { label: "Favorit", value: "heart" }, { label: "Dompet", value: "wallet" }] }] },
        { name: "howItWorks", type: "array", label: "Cara Kerja", labels: { singular: "Langkah", plural: "Langkah-langkah" }, fields: [{ name: "title", type: "text", label: "Judul Langkah" }, { name: "description", type: "textarea", label: "Penjelasan" }, { name: "sortOrder", type: "number", label: "Urutan Tampil" }] },
      ] },
      { label: "Menu & Bagian Bawah", description: "Tautan navigasi serta informasi footer website.", fields: [
        { name: "navigation", type: "array", label: "Menu Navigasi", labels: { singular: "Menu", plural: "Daftar Menu" }, admin: { description: "Atur nama dan tujuan tautan menu website." }, fields: [{ name: "label", type: "text", label: "Nama Menu", required: true }, { name: "href", type: "text", label: "Tujuan Menu", admin: { description: "Alamat halaman, misalnya /kontak." } }, { name: "children", type: "array", label: "Submenu", labels: { singular: "Submenu", plural: "Daftar Submenu" }, fields: [{ name: "label", type: "text", label: "Nama Submenu", required: true }, { name: "href", type: "text", label: "Tujuan Submenu", required: true }, { name: "description", type: "text", label: "Penjelasan Singkat" }] }] },
        { name: "footerDescription", type: "textarea", label: "Deskripsi Bisnis di Footer", defaultValue: "Solusi Ruang Kerja Profesional. Virtual Office, Coworking Space, dan Meeting Room di Bandung, Jakarta, dan Bekasi." },
        { name: "footerServicesTitle", type: "text", label: "Judul Kolom Layanan", defaultValue: "Layanan Kami" },
        { name: "footerCompanyTitle", type: "text", label: "Judul Kolom Perusahaan", defaultValue: "Perusahaan" },
        { name: "footerContactTitle", type: "text", label: "Judul Kolom Kontak", defaultValue: "Hubungi Kami" },
        { name: "copyrightText", type: "text", label: "Teks Hak Cipta", defaultValue: "© 2026 EasyOffice. Seluruh hak cipta dilindungi.", admin: { description: "Teks yang tampil di bagian bawah website." } },
        { name: "socialLinks", type: "array", label: "Media Sosial", labels: { singular: "Tautan", plural: "Tautan Media Sosial" }, fields: [{ name: "label", type: "text", label: "Nama Platform", admin: { description: "Contoh: Instagram atau LinkedIn." } }, { name: "url", type: "text", label: "Alamat Profil", admin: { description: "Tempel tautan lengkap ke profil media sosial." } }] },
      ] },
      { label: "SEO & Integrasi", description: "Pengaturan opsional untuk mesin pencari dan pengukuran pengunjung.", fields: [
        { name: "defaultSeoTitle", type: "text", label: "Judul SEO Cadangan", defaultValue: "EasyOffice — Virtual Office, Coworking Space & Meeting Room", admin: { description: "Dipakai pada halaman yang belum memiliki judul SEO sendiri." } },
        { name: "defaultSeoDescription", type: "textarea", label: "Deskripsi SEO Cadangan", defaultValue: "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi.", admin: { description: "Ringkasan singkat website untuk mesin pencari." } },
        { name: "gtmContainerId", type: "text", label: "ID Google Tag Manager", admin: { description: "Opsional, format GTM-XXXXXXX. Tag dipasang jika ID diisi." } },
      ] },
    ] },
    { name: "defaultWhatsapp", type: "text", label: "Nomor WhatsApp Cadangan Lama", admin: { hidden: true, description: "Pengaturan lama, tidak perlu diubah." } },
    { name: "defaultWhatsappByLocation", type: "array", label: "Nomor Cadangan Lokasi Lama", admin: { hidden: true, description: "Pengaturan lama, tidak perlu diubah." }, fields: [{ name: "location", type: "text", label: "Lokasi" }, { name: "number", type: "text", label: "Nomor WhatsApp" }] },
  ],
};

export const AboutPage: import("payload").GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  admin: { group: "Konten Website" },
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
