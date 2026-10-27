import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig, type CollectionConfig } from "payload";
import { AboutPage, ComparisonRows, Faqs, HomepageFacilities, HomepageLayout, Kantor, Leads, LayananKantor, Media, Promotions, Services, SiteSettings, Testimonials, isAdmin } from "./payload/collections/content";

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
    components: {
      afterNavLinks: [{ path: "../../payload/components/puck-builder-link.tsx", exportName: "PuckBuilderLink" }],
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
  collections: [Users, Services, Kantor, LayananKantor, Media, Promotions, Testimonials, ComparisonRows, HomepageLayout, Faqs, HomepageFacilities, Leads],
  globals: [SiteSettings, AboutPage],
  db: postgresAdapter({
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
