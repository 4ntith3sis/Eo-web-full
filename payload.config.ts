import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig, type CollectionConfig } from "payload";
import { s3Storage } from "@payloadcms/storage-s3";
import { AboutPage, ComparisonRows, Faqs, HomepageFacilities, PageLayout, Kantor, Leads, LayananKantor, Media, Partners, Promotions, Services, SiteSettings, Testimonials, isAdmin } from "./payload/collections/content";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const Users: CollectionConfig = {
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
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
};

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "app/(payload)"),
    },
    // @ts-expect-error Payload runtime supports custom views in this version.
    views: {
      puckBuilder: {
        path: "/puck-builder",
        exact: true,
            Component: { path: "../../payload/components/puck-manager-view.tsx", exportName: "default" },
      },
    },
  },
  collections: [Users, Services, Kantor, LayananKantor, Media, Partners, Promotions, Testimonials, ComparisonRows, PageLayout, Faqs, HomepageFacilities, Leads],
  plugins: [
    s3Storage({
      bucket: "media",
      clientUploads: true,
      collections: {
        media: {
          prefix: "",
          disableLocalStorage: true,
          generateFileURL: ({ filename, prefix }) => {
            const objectPath = [prefix, filename].filter((part): part is string => Boolean(part)).map((part) => encodeURIComponent(part)).join("/");
            return `${process.env.SUPABASE_URL ?? "https://qbfgapkitvhlylyrbivs.supabase.co"}/storage/v1/object/public/media/${objectPath}`;
          },
        },
      },
      config: {
        endpoint: process.env.SUPABASE_S3_ENDPOINT ?? "https://qbfgapkitvhlylyrbivs.storage.supabase.co/storage/v1/s3",
        region: process.env.SUPABASE_S3_REGION ?? "ap-northeast-1",
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY ?? "",
          secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY ?? "",
        },
      },
    }),
  ],
  globals: [SiteSettings, AboutPage],
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, "migrations"),
    push: false,
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
