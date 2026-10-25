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
  { name: "title", type: "text", required: true }, { name: "slug", type: "text", required: true, unique: true },
  { name: "shortTitle", type: "text" }, { name: "description", type: "textarea" }, { name: "intro", type: "textarea" },
  { name: "benefits", type: "array", fields: [{ name: "value", type: "text" }] }, { name: "benefitsTitle", type: "text" }, { name: "benefitsDescription", type: "textarea" }, { name: "benefitItems", type: "array", fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "sparkles" }, { name: "title", type: "text", required: true }, { name: "description", type: "textarea" }] }, { name: "features", type: "array", fields: [{ name: "value", type: "text" }] },
  { name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" }, { name: "image", type: "relationship", relationTo: "media" }, { name: "imageAlt", type: "text" }, { name: "seo", type: "group", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "ogImage", type: "relationship", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }] }, { name: "isActive", type: "checkbox", defaultValue: true },
] };
const Cities = { slug: "cities", access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "name" }, fields: [
  { name: "name", type: "text", required: true }, { name: "slug", type: "text", required: true, unique: true }, { name: "shortDescription", type: "textarea" },
  { name: "address", type: "textarea" }, { name: "operatingHours", type: "text" }, { name: "email", type: "email" }, { name: "phone", type: "text" }, { name: "whatsapp", type: "text" }, { name: "latitude", type: "number" }, { name: "longitude", type: "number" }, { name: "isActive", type: "checkbox", defaultValue: true },
] };
const ServiceOffices = { slug: "service-offices", access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "name" }, fields: [
  { name: "name", type: "text", required: true }, { name: "slug", type: "text", required: true, unique: true }, { name: "service", type: "relationship", relationTo: "services", required: true }, { name: "city", type: "relationship", relationTo: "cities", required: true },
  { name: "description", type: "textarea" }, { name: "address", type: "textarea", required: true }, { name: "operatingHours", type: "text" }, { name: "email", type: "email" }, { name: "phone", type: "text" }, { name: "whatsapp", type: "text" }, { name: "whatsappNumbers", type: "array", fields: [{ name: "label", type: "text" }, { name: "number", type: "text", required: true }, { name: "active", type: "checkbox", defaultValue: true }, { name: "priority", type: "number", defaultValue: 0 }] }, { name: "mapsUrl", type: "text" }, { name: "latitude", type: "number" }, { name: "longitude", type: "number" }, { name: "packages", type: "array", fields: pricingFields }, { name: "facilities", type: "array", fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" }, { name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "image", type: "relationship", relationTo: "media" }] }, { name: "tagline", type: "text" }, { name: "startingPrice", type: "text" }, { name: "image", type: "relationship", relationTo: "media" }, { name: "imageAlt", type: "text" }, { name: "gallery", type: "array", fields: [{ name: "src", type: "relationship", relationTo: "media" }, { name: "alt", type: "text" }] }, { name: "seo", type: "group", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "ogImage", type: "relationship", relationTo: "media" }, { name: "canonicalUrl", type: "text" }, { name: "noIndex", type: "checkbox", defaultValue: false }] }, { name: "isActive", type: "checkbox", defaultValue: true },
] };
const simpleContentAccess = { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin };
const Media = { slug: "media", access: simpleContentAccess, upload: { staticDir: "public/media", mimeTypes: ["image/jpeg", "image/png", "image/webp"], formatOptions: { format: "webp", options: { quality: 78 } } }, fields: [{ name: "alt", type: "text" }] };
const Promotions = { slug: "promotions", access: simpleContentAccess, admin: { useAsTitle: "title" }, fields: [{ name: "badge", type: "text" }, { name: "title", type: "text", required: true }, { name: "description", type: "textarea" }, { name: "period", type: "text" }, { name: "service", type: "relationship", relationTo: "services" }, { name: "image", type: "relationship", relationTo: "media" }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const Testimonials = { slug: "testimonials", access: simpleContentAccess, admin: { useAsTitle: "name" }, fields: [{ name: "name", type: "text", required: true }, { name: "company", type: "text" }, { name: "quote", type: "textarea", required: true }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const ComparisonRows = { slug: "comparison-rows", access: simpleContentAccess, admin: { useAsTitle: "feature" }, fields: [{ name: "feature", type: "text", required: true }, { name: "service", type: "relationship", relationTo: "services" }, { name: "easyoffice", type: "checkbox", defaultValue: false }, { name: "typical", type: "checkbox", defaultValue: false }, { name: "sortOrder", type: "number", defaultValue: 0 }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const HomepageLayout = { slug: "homepage-layout", access: { read: () => true, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "name", defaultColumns: ["name", "status", "puckEdit"] }, fields: [{ name: "name", type: "text", required: true, defaultValue: "Homepage" }, { name: "layout", type: "json", required: true }, { name: "status", type: "select", required: true, defaultValue: "draft", options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }] }, { name: "isActive", type: "checkbox", defaultValue: true }, { name: "puckEdit", type: "text", virtual: true, admin: { readOnly: true, components: { Cell: "../../payload/components/puck-edit-cell.tsx#PuckEditCell" } } }] };
const Faqs = { slug: "faqs", access: simpleContentAccess, admin: { useAsTitle: "question" }, fields: [{ name: "question", type: "text", required: true }, { name: "answer", type: "textarea", required: true }, { name: "category", type: "select", options: ["Virtual Office", "Coworking Space", "Meeting Room", "Umum"] }, { name: "service", type: "relationship", relationTo: "services" }, { name: "sortOrder", type: "number", defaultValue: 0 }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const HomepageFacilities = { slug: "homepage-facilities", access: simpleContentAccess, admin: { useAsTitle: "title" }, fields: [{ name: "title", type: "text", required: true }, { name: "description", type: "textarea" }, { name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" }, { name: "image", type: "relationship", relationTo: "media" }, { name: "imageAlt", type: "text" }, { name: "sortOrder", type: "number", defaultValue: 0 }, { name: "isActive", type: "checkbox", defaultValue: true }] };
const Leads = { slug: "leads", access: { read: isAuthenticated, create: () => true, update: isAdminOrEditor, delete: isAdmin }, admin: { useAsTitle: "name" }, fields: [{ name: "name", type: "text", required: true }, { name: "contact", type: "text", required: true }, { name: "interestedService", type: "relationship", relationTo: "services" }, { name: "location", type: "relationship", relationTo: "cities" }, { name: "sourcePage", type: "text" }, { name: "status", type: "select", defaultValue: "new", options: ["new", "contacted", "qualified", "closed"] }, { name: "notes", type: "textarea" }] };
const AboutPage = { slug: "about-page", access: { read: () => true, update: isAdminOrEditor }, fields: [{ name: "eyebrow", type: "text" }, { name: "heroTitle", type: "text" }, { name: "heroTitleAccent", type: "text" }, { name: "heroDescription", type: "textarea" }, { name: "heroImage", type: "relationship", relationTo: "media" }, { name: "heroImageAlt", type: "text" }, { name: "heroBadgeTitle", type: "text" }, { name: "heroBadgeText", type: "text" }, { name: "heroRating", type: "text" }, { name: "heroRatingText", type: "text" }, { name: "heroHighlights", type: "array", fields: [{ name: "value", type: "text" }] }, { name: "storyEyebrow", type: "text" }, { name: "storyTitle", type: "text" }, { name: "storyTitleAccent", type: "text" }, { name: "storyDescription", type: "textarea" }, { name: "storyImage", type: "relationship", relationTo: "media" }, { name: "storyImageAlt", type: "text" }, { name: "storyBadgeTitle", type: "text" }, { name: "storyBadgeText", type: "text" }, { name: "storyHighlights", type: "array", fields: [{ name: "value", type: "text" }] }, { name: "stats", type: "array", fields: [{ name: "value", type: "text" }, { name: "label", type: "text" }] }, { name: "valuesEyebrow", type: "text" }, { name: "valuesTitle", type: "text" }, { name: "valuesDescription", type: "textarea" }, { name: "values", type: "array", fields: [{ name: "icon", type: "select", options: iconOptions, defaultValue: "briefcase" }, { name: "title", type: "text" }, { name: "description", type: "textarea" }] }] };
const SiteSettings = { slug: "site-settings", access: { read: () => true, update: isAdminOrEditor }, fields: [{ name: "siteName", type: "text" }, { name: "tagline", type: "text" }, { name: "defaultWhatsapp", type: "text" }, { name: "primaryWhatsapp", type: "text", admin: { description: "Nomor utama yang hanya digunakan pada halaman Kontak." } }, { name: "whatsappNumbers", type: "array", fields: [{ name: "label", type: "text" }, { name: "number", type: "text", required: true }, { name: "active", type: "checkbox", defaultValue: true }, { name: "priority", type: "number", defaultValue: 0 }] }, { name: "email", type: "email" }, { name: "phone", type: "text" }, { name: "operatingHours", type: "text" }, { name: "logo", type: "relationship", relationTo: "media" }, { name: "headerCtaLabel", type: "text" }, { name: "headerCtaMessage", type: "textarea" }, { name: "navigation", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text" }, { name: "children", type: "array", fields: [{ name: "label", type: "text", required: true }, { name: "href", type: "text", required: true }, { name: "description", type: "text" }] }] }, { name: "footerServicesTitle", type: "text" }, { name: "footerCompanyTitle", type: "text" }, { name: "footerContactTitle", type: "text" }, { name: "footerDescription", type: "textarea" }, { name: "copyrightText", type: "text" }, { name: "defaultSeoTitle", type: "text" }, { name: "defaultSeoDescription", type: "textarea" }, { name: "gtmContainerId", type: "text" }, { name: "homepageHeroTitle", type: "text" }, { name: "homepageHeroDescription", type: "textarea" }, { name: "statsBanner", type: "array", fields: [{ name: "value", type: "text", required: true }, { name: "label", type: "text", required: true }] }, { name: "howItWorks", type: "array", fields: [{ name: "title", type: "text" }, { name: "description", type: "textarea" }, { name: "sortOrder", type: "number" }] }] };

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
  collections: [Users, Services, Cities, ServiceOffices, Media, Promotions, Testimonials, ComparisonRows, HomepageLayout, Faqs, HomepageFacilities, Leads],
  globals: [SiteSettings, AboutPage],
  db: postgresAdapter({
    generateSchemaOutputFile: "/tmp/payload-generated-schema.ts",
    migrationDir: "/tmp/content-migrations",
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
  }),
  sharp,
  graphQL: {
    disable: true,
  },
  typescript: {
    outputFile: "/tmp/payload-types.ts",
  },
  telemetry: false,
});
