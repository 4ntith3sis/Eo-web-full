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
  admin: { useAsTitle: "title", defaultColumns: ["title", "slug", "isActive"] },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "shortTitle", type: "text" },
    { name: "description", type: "textarea" },
    { name: "intro", type: "textarea" },
    { name: "benefits", type: "array", fields: [{ name: "value", type: "text" }] },
    { name: "benefitsTitle", type: "text" },
    { name: "benefitsDescription", type: "textarea" },
    { name: "benefitItems", type: "array", fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text", required: true }, { name: "description", type: "textarea" }] },
    { name: "features", type: "array", fields: [{ name: "value", type: "text" }] },
    { name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" },
    { name: "image", type: "relationship", relationTo: "media" },
    { name: "imageAlt", type: "text" },
    { name: "seo", type: "group", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "ogImage", type: "relationship", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }] },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const Cities: CollectionConfig = {
  slug: "cities",
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "isActive"] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "shortDescription", type: "textarea" },
    { name: "address", type: "textarea" },
    { name: "operatingHours", type: "text" },
    { name: "email", type: "email" },
    { name: "phone", type: "text" },
    { name: "whatsapp", type: "text" },
    { name: "whatsappNumbers", type: "array", fields: [
      { name: "label", type: "text" }, { name: "number", type: "text", required: true },
      { name: "active", type: "checkbox", defaultValue: true }, { name: "priority", type: "number", defaultValue: 0 },
    ] },
    { name: "latitude", type: "number" },
    { name: "longitude", type: "number" },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const ServiceOffices: CollectionConfig = {
  slug: "service-offices",
  access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  admin: { useAsTitle: "name", defaultColumns: ["name", "service", "city", "isActive"] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "service", type: "relationship", relationTo: "services", required: true },
    { name: "city", type: "relationship", relationTo: "cities", required: true },
    { name: "description", type: "textarea" },
    { name: "address", type: "textarea", required: true },
    { name: "operatingHours", type: "text" },
    { name: "email", type: "email" },
    { name: "phone", type: "text" },
    { name: "whatsapp", type: "text" },
    { name: "mapsUrl", type: "text" },
    { name: "latitude", type: "number" },
    { name: "longitude", type: "number" },
    { name: "packages", type: "array", fields: pricingFields },
    { name: "facilities", type: "array", fields: [
      { name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "image", type: "relationship", relationTo: "media" }, { name: "imageAlt", type: "text" },
    ] },
    { name: "tagline", type: "text" },
    { name: "startingPrice", type: "text" },
    { name: "image", type: "relationship", relationTo: "media" },
    { name: "imageAlt", type: "text" },
    { name: "gallery", type: "array", fields: [{ name: "src", type: "relationship", relationTo: "media" }, { name: "alt", type: "text" }] },
    { name: "seo", type: "group", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "ogImage", type: "relationship", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }] },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

// Public pages read active content without a user session. Mutations remain restricted.
const simpleContentAccess = { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin };

export const Media: CollectionConfig = {
  slug: "media",
  access: simpleContentAccess,
  upload: { staticDir: "public/media", mimeTypes: ["image/jpeg", "image/png", "image/webp"], formatOptions: { format: "webp", options: { quality: 78 } } },
  fields: [{ name: "alt", type: "text" }],
};

export const Promotions: CollectionConfig = {
  slug: "promotions",
  access: simpleContentAccess,
  admin: { useAsTitle: "title" },
  fields: [
    { name: "badge", type: "text" }, { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" }, { name: "period", type: "text" },
    { name: "service", type: "relationship", relationTo: "services" }, { name: "image", type: "relationship", relationTo: "media" }, { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  access: simpleContentAccess,
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true }, { name: "company", type: "text" },
    { name: "quote", type: "textarea", required: true }, { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const ComparisonRows: CollectionConfig = {
  slug: "comparison-rows",
  access: simpleContentAccess,
  admin: { useAsTitle: "feature" },
  fields: [
    { name: "feature", type: "text", required: true },
    { name: "service", type: "relationship", relationTo: "services" },
    { name: "easyoffice", type: "checkbox", defaultValue: false },
    { name: "typical", type: "checkbox", defaultValue: false },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const HomepageLayout: CollectionConfig = {
  slug: "homepage-layout",
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: { useAsTitle: "name", defaultColumns: ["name", "status", "puckEdit"] },
  fields: [
    { name: "name", type: "text", required: true, defaultValue: "Homepage" },
    { name: "layout", type: "json", required: true },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }] },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "puckEdit", type: "text", virtual: true, admin: { readOnly: true, components: { Cell: "../../payload/components/puck-edit-cell.tsx#PuckEditCell" } } },
  ],
};

export const Faqs: CollectionConfig = {
  slug: "faqs",
  access: simpleContentAccess,
  admin: { useAsTitle: "question" },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    { name: "category", type: "select", options: ["Virtual Office", "Coworking Space", "Meeting Room", "Umum"] },
    { name: "service", type: "relationship", relationTo: "services" },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const HomepageFacilities: CollectionConfig = {
  slug: "homepage-facilities",
  access: simpleContentAccess,
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" },
    { name: "image", type: "relationship", relationTo: "media" },
    { name: "imageAlt", type: "text" },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const Leads: CollectionConfig = {
  slug: "leads",
  access: { read: isAuthenticated, create: () => true, update: isAdminOrEditor, delete: isAdmin },
  admin: { useAsTitle: "name", defaultColumns: ["name", "contact", "status", "createdAt"] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "contact", type: "text", required: true },
    { name: "interestedService", type: "relationship", relationTo: "services" },
    { name: "location", type: "relationship", relationTo: "cities" },
    { name: "sourcePage", type: "text" },
    { name: "status", type: "select", defaultValue: "new", options: ["new", "contacted", "qualified", "closed"] },
    { name: "notes", type: "textarea" },
  ],
};

export const SiteSettings: import("payload").GlobalConfig = {
  slug: "site-settings",
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    { name: "siteName", type: "text", defaultValue: "EasyOffice" },
    { name: "tagline", type: "text" },
    { name: "defaultWhatsapp", type: "text" },
    { name: "primaryWhatsapp", type: "text", admin: { description: "Nomor utama yang hanya digunakan pada halaman Kontak." } },
    { name: "whatsappNumbers", type: "array", fields: [{ name: "label", type: "text" }, { name: "number", type: "text", required: true }, { name: "active", type: "checkbox", defaultValue: true }, { name: "priority", type: "number", defaultValue: 0 }] },
    { name: "defaultWhatsappByLocation", type: "array", fields: [{ name: "location", type: "relationship", relationTo: "cities" }, { name: "number", type: "text" }] },
    { name: "email", type: "email" }, { name: "phone", type: "text" }, { name: "address", type: "textarea" },
    { name: "operatingHours", type: "text" },
    { name: "logo", type: "relationship", relationTo: "media" },
    { name: "headerCtaLabel", type: "text", defaultValue: "Hubungi Kami" },
    { name: "headerCtaMessage", type: "textarea" },
    { name: "navigation", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text" }, { name: "children", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text", required: true }, { name: "description", type: "text" }] }] },
    { name: "footerServicesTitle", type: "text", defaultValue: "Layanan Kami" },
    { name: "footerCompanyTitle", type: "text", defaultValue: "Perusahaan" },
    { name: "footerContactTitle", type: "text", defaultValue: "Hubungi Kami" },
    { name: "footerDescription", type: "textarea" },
    { name: "copyrightText", type: "text" },
    { name: "socialLinks", type: "array", fields: [{ name: "label", type: "text" }, { name: "url", type: "text" }] },
    { name: "defaultSeoTitle", type: "text" }, { name: "defaultSeoDescription", type: "textarea" }, { name: "gtmContainerId", type: "text" },
    { name: "homepageHeroTitle", type: "text" }, { name: "homepageHeroDescription", type: "textarea" },
    { name: "statsBanner", type: "array", fields: [{ name: "value", type: "text", required: true }, { name: "label", type: "text", required: true }] },
    { name: "howItWorks", type: "array", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "sortOrder", type: "number" }] },
  ],
};

export const AboutPage: import("payload").GlobalConfig = {
  slug: "about-page",
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "Tentang EasyOffice" },
    { name: "heroTitle", type: "text" }, { name: "heroTitleAccent", type: "text" }, { name: "heroDescription", type: "textarea" },
    { name: "heroImage", type: "relationship", relationTo: "media" }, { name: "heroImageAlt", type: "text" },
    { name: "heroBadgeTitle", type: "text" }, { name: "heroBadgeText", type: "text" }, { name: "heroRating", type: "text" }, { name: "heroRatingText", type: "text" },
    { name: "heroHighlights", type: "array", fields: [{ name: "value", type: "text" }] },
    { name: "storyEyebrow", type: "text" }, { name: "storyTitle", type: "text" }, { name: "storyTitleAccent", type: "text" }, { name: "storyDescription", type: "textarea" },
    { name: "storyImage", type: "relationship", relationTo: "media" }, { name: "storyImageAlt", type: "text" }, { name: "storyBadgeTitle", type: "text" }, { name: "storyBadgeText", type: "text" },
    { name: "storyHighlights", type: "array", fields: [{ name: "value", type: "text" }] },
    { name: "stats", type: "array", fields: [{ name: "value", type: "text" }, { name: "label", type: "text" }] },
    { name: "valuesEyebrow", type: "text" }, { name: "valuesTitle", type: "text" }, { name: "valuesDescription", type: "textarea" },
    { name: "values", type: "array", fields: [{ name: "icon", type: "text" }, { name: "title", type: "text" }, { name: "description", type: "textarea" }] },
  ],
};
