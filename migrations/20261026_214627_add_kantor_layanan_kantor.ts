import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_services_benefit_items_icon" AS ENUM('briefcase', 'users', 'door', 'wifi', 'bell', 'map-pin', 'printer', 'coffee', 'car', 'clock', 'laptop', 'presentation', 'video', 'wallet', 'headset', 'award', 'handshake', 'star', 'sparkles');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('briefcase', 'users', 'door', 'wifi', 'bell', 'map-pin', 'printer', 'coffee', 'car', 'clock', 'laptop', 'presentation', 'video', 'wallet', 'headset', 'award', 'handshake', 'star', 'sparkles');
  CREATE TYPE "public"."enum_layanan_kantor_fasilitas_icon" AS ENUM('briefcase', 'users', 'door', 'wifi', 'bell', 'map-pin', 'printer', 'coffee', 'car', 'clock', 'laptop', 'presentation', 'video', 'wallet', 'headset', 'award', 'handshake', 'star', 'sparkles');
  CREATE TYPE "public"."enum_layanan_kantor_keunggulan_icon" AS ENUM('briefcase', 'users', 'door', 'wifi', 'bell', 'map-pin', 'printer', 'coffee', 'car', 'clock', 'laptop', 'presentation', 'video', 'wallet', 'headset', 'award', 'handshake', 'star', 'sparkles');
  CREATE TYPE "public"."enum_service_offices_facilities_icon" AS ENUM('briefcase', 'users', 'door', 'wifi', 'bell', 'map-pin', 'printer', 'coffee', 'car', 'clock', 'laptop', 'presentation', 'video', 'wallet', 'headset', 'award', 'handshake', 'star', 'sparkles');
  CREATE TYPE "public"."enum_homepage_layout_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('Virtual Office', 'Coworking Space', 'Meeting Room', 'Umum');
  CREATE TYPE "public"."enum_homepage_facilities_icon" AS ENUM('briefcase', 'users', 'door', 'wifi', 'bell', 'map-pin', 'printer', 'coffee', 'car', 'clock', 'laptop', 'presentation', 'video', 'wallet', 'headset', 'award', 'handshake', 'star', 'sparkles');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TYPE "public"."enum_about_page_values_icon" AS ENUM('briefcase', 'users', 'door', 'wifi', 'bell', 'map-pin', 'printer', 'coffee', 'car', 'clock', 'laptop', 'presentation', 'video', 'wallet', 'headset', 'award', 'handshake', 'star', 'sparkles');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services_benefit_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_services_benefit_items_icon" DEFAULT 'sparkles',
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_title" varchar,
  	"description" varchar,
  	"intro" varchar,
  	"benefits_title" varchar,
  	"benefits_description" varchar,
  	"icon" "enum_services_icon" DEFAULT 'briefcase',
  	"image_id" integer,
  	"image_alt" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "kantor_galeri" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "kantor" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"kota" varchar NOT NULL,
  	"deskripsi" varchar,
  	"alamat" varchar NOT NULL,
  	"jam_operasional" varchar,
  	"email" varchar,
  	"telepon" varchar,
  	"whatsapp" varchar,
  	"link_google_maps" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"foto_id" integer,
  	"alt_foto" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"aktif" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "layanan_kantor_paket_harga_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "layanan_kantor_paket_harga" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"price" numeric NOT NULL,
  	"unit" varchar NOT NULL,
  	"discount_active" boolean DEFAULT false,
  	"discount_percentage" numeric,
  	"discount_fixed" numeric
  );
  
  CREATE TABLE "layanan_kantor_fasilitas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_layanan_kantor_fasilitas_icon" DEFAULT 'sparkles',
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar
  );
  
  CREATE TABLE "layanan_kantor_keunggulan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_layanan_kantor_keunggulan_icon" DEFAULT 'sparkles',
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar
  );
  
  CREATE TABLE "layanan_kantor_galeri" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "layanan_kantor" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kantor_id" integer NOT NULL,
  	"layanan_id" integer NOT NULL,
  	"slug" varchar NOT NULL,
  	"nama_tampilan" varchar,
  	"deskripsi" varchar,
  	"tagline" varchar,
  	"harga_mulai" varchar,
  	"foto_id" integer,
  	"alt_foto" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"aktif" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_description" varchar,
  	"address" varchar,
  	"operating_hours" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_offices_whatsapp_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"priority" numeric DEFAULT 0
  );
  
  CREATE TABLE "service_offices_packages_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "service_offices_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"price" numeric NOT NULL,
  	"unit" varchar NOT NULL,
  	"discount_active" boolean DEFAULT false,
  	"discount_percentage" numeric,
  	"discount_fixed" numeric
  );
  
  CREATE TABLE "service_offices_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_service_offices_facilities_icon" DEFAULT 'briefcase',
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "service_offices_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "service_offices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"service_id" integer NOT NULL,
  	"city_id" integer NOT NULL,
  	"description" varchar,
  	"address" varchar NOT NULL,
  	"operating_hours" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"maps_url" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"tagline" varchar,
  	"starting_price" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"period" varchar,
  	"service_id" integer,
  	"image_id" integer,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"quote" varchar NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "comparison_rows" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL,
  	"service_id" integer,
  	"easyoffice" boolean DEFAULT false,
  	"typical" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_layout" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Homepage' NOT NULL,
  	"layout" jsonb NOT NULL,
  	"status" "enum_homepage_layout_status" DEFAULT 'draft' NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_faqs_category",
  	"service_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_facilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"icon" "enum_homepage_facilities_icon" DEFAULT 'briefcase',
  	"image_id" integer,
  	"image_alt" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"contact" varchar NOT NULL,
  	"interested_service_id" integer,
  	"location_id" integer,
  	"source_page" varchar,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"services_id" integer,
  	"kantor_id" integer,
  	"layanan_kantor_id" integer,
  	"cities_id" integer,
  	"service_offices_id" integer,
  	"media_id" integer,
  	"promotions_id" integer,
  	"testimonials_id" integer,
  	"comparison_rows_id" integer,
  	"homepage_layout_id" integer,
  	"faqs_id" integer,
  	"homepage_facilities_id" integer,
  	"leads_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_whatsapp_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"priority" numeric DEFAULT 0
  );
  
  CREATE TABLE "site_settings_navigation_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_stats_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"sort_order" numeric
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar,
  	"tagline" varchar,
  	"default_whatsapp" varchar,
  	"primary_whatsapp" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"operating_hours" varchar,
  	"logo_id" integer,
  	"header_cta_label" varchar,
  	"header_cta_message" varchar,
  	"footer_services_title" varchar,
  	"footer_company_title" varchar,
  	"footer_contact_title" varchar,
  	"footer_description" varchar,
  	"copyright_text" varchar,
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"gtm_container_id" varchar,
  	"homepage_hero_title" varchar,
  	"homepage_hero_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "about_page_story_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "about_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_values_icon" DEFAULT 'briefcase',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_title_accent" varchar,
  	"hero_description" varchar,
  	"hero_image_id" integer,
  	"hero_image_alt" varchar,
  	"hero_badge_title" varchar,
  	"hero_badge_text" varchar,
  	"hero_rating" varchar,
  	"hero_rating_text" varchar,
  	"story_eyebrow" varchar,
  	"story_title" varchar,
  	"story_title_accent" varchar,
  	"story_description" varchar,
  	"story_image_id" integer,
  	"story_image_alt" varchar,
  	"story_badge_title" varchar,
  	"story_badge_text" varchar,
  	"values_eyebrow" varchar,
  	"values_title" varchar,
  	"values_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefits" ADD CONSTRAINT "services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefit_items" ADD CONSTRAINT "services_benefit_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kantor_galeri" ADD CONSTRAINT "kantor_galeri_src_id_media_id_fk" FOREIGN KEY ("src_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kantor_galeri" ADD CONSTRAINT "kantor_galeri_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kantor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kantor" ADD CONSTRAINT "kantor_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kantor" ADD CONSTRAINT "kantor_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layanan_kantor_paket_harga_benefits" ADD CONSTRAINT "layanan_kantor_paket_harga_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layanan_kantor_paket_harga"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "layanan_kantor_paket_harga" ADD CONSTRAINT "layanan_kantor_paket_harga_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layanan_kantor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "layanan_kantor_fasilitas" ADD CONSTRAINT "layanan_kantor_fasilitas_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layanan_kantor_fasilitas" ADD CONSTRAINT "layanan_kantor_fasilitas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layanan_kantor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "layanan_kantor_keunggulan" ADD CONSTRAINT "layanan_kantor_keunggulan_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layanan_kantor_keunggulan" ADD CONSTRAINT "layanan_kantor_keunggulan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layanan_kantor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "layanan_kantor_galeri" ADD CONSTRAINT "layanan_kantor_galeri_src_id_media_id_fk" FOREIGN KEY ("src_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layanan_kantor_galeri" ADD CONSTRAINT "layanan_kantor_galeri_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layanan_kantor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "layanan_kantor" ADD CONSTRAINT "layanan_kantor_kantor_id_kantor_id_fk" FOREIGN KEY ("kantor_id") REFERENCES "public"."kantor"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layanan_kantor" ADD CONSTRAINT "layanan_kantor_layanan_id_services_id_fk" FOREIGN KEY ("layanan_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layanan_kantor" ADD CONSTRAINT "layanan_kantor_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "layanan_kantor" ADD CONSTRAINT "layanan_kantor_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_offices_whatsapp_numbers" ADD CONSTRAINT "service_offices_whatsapp_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_offices_packages_benefits" ADD CONSTRAINT "service_offices_packages_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_offices_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_offices_packages" ADD CONSTRAINT "service_offices_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_offices_facilities" ADD CONSTRAINT "service_offices_facilities_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_offices_facilities" ADD CONSTRAINT "service_offices_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_offices_gallery" ADD CONSTRAINT "service_offices_gallery_src_id_media_id_fk" FOREIGN KEY ("src_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_offices_gallery" ADD CONSTRAINT "service_offices_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_offices" ADD CONSTRAINT "service_offices_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_offices" ADD CONSTRAINT "service_offices_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_offices" ADD CONSTRAINT "service_offices_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_offices" ADD CONSTRAINT "service_offices_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotions" ADD CONSTRAINT "promotions_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotions" ADD CONSTRAINT "promotions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comparison_rows" ADD CONSTRAINT "comparison_rows_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_facilities" ADD CONSTRAINT "homepage_facilities_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_interested_service_id_services_id_fk" FOREIGN KEY ("interested_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_location_id_cities_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kantor_fk" FOREIGN KEY ("kantor_id") REFERENCES "public"."kantor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_layanan_kantor_fk" FOREIGN KEY ("layanan_kantor_id") REFERENCES "public"."layanan_kantor"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_offices_fk" FOREIGN KEY ("service_offices_id") REFERENCES "public"."service_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comparison_rows_fk" FOREIGN KEY ("comparison_rows_id") REFERENCES "public"."comparison_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_homepage_layout_fk" FOREIGN KEY ("homepage_layout_id") REFERENCES "public"."homepage_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_homepage_facilities_fk" FOREIGN KEY ("homepage_facilities_id") REFERENCES "public"."homepage_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_whatsapp_numbers" ADD CONSTRAINT "site_settings_whatsapp_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation_children" ADD CONSTRAINT "site_settings_navigation_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats_banner" ADD CONSTRAINT "site_settings_stats_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_how_it_works" ADD CONSTRAINT "site_settings_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_hero_highlights" ADD CONSTRAINT "about_page_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story_highlights" ADD CONSTRAINT "about_page_story_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_stats" ADD CONSTRAINT "about_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "services_benefits_order_idx" ON "services_benefits" USING btree ("_order");
  CREATE INDEX "services_benefits_parent_id_idx" ON "services_benefits" USING btree ("_parent_id");
  CREATE INDEX "services_benefit_items_order_idx" ON "services_benefit_items" USING btree ("_order");
  CREATE INDEX "services_benefit_items_parent_id_idx" ON "services_benefit_items" USING btree ("_parent_id");
  CREATE INDEX "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "kantor_galeri_order_idx" ON "kantor_galeri" USING btree ("_order");
  CREATE INDEX "kantor_galeri_parent_id_idx" ON "kantor_galeri" USING btree ("_parent_id");
  CREATE INDEX "kantor_galeri_src_idx" ON "kantor_galeri" USING btree ("src_id");
  CREATE UNIQUE INDEX "kantor_slug_idx" ON "kantor" USING btree ("slug");
  CREATE INDEX "kantor_foto_idx" ON "kantor" USING btree ("foto_id");
  CREATE INDEX "kantor_seo_seo_og_image_idx" ON "kantor" USING btree ("seo_og_image_id");
  CREATE INDEX "kantor_updated_at_idx" ON "kantor" USING btree ("updated_at");
  CREATE INDEX "kantor_created_at_idx" ON "kantor" USING btree ("created_at");
  CREATE INDEX "layanan_kantor_paket_harga_benefits_order_idx" ON "layanan_kantor_paket_harga_benefits" USING btree ("_order");
  CREATE INDEX "layanan_kantor_paket_harga_benefits_parent_id_idx" ON "layanan_kantor_paket_harga_benefits" USING btree ("_parent_id");
  CREATE INDEX "layanan_kantor_paket_harga_order_idx" ON "layanan_kantor_paket_harga" USING btree ("_order");
  CREATE INDEX "layanan_kantor_paket_harga_parent_id_idx" ON "layanan_kantor_paket_harga" USING btree ("_parent_id");
  CREATE INDEX "layanan_kantor_fasilitas_order_idx" ON "layanan_kantor_fasilitas" USING btree ("_order");
  CREATE INDEX "layanan_kantor_fasilitas_parent_id_idx" ON "layanan_kantor_fasilitas" USING btree ("_parent_id");
  CREATE INDEX "layanan_kantor_fasilitas_image_idx" ON "layanan_kantor_fasilitas" USING btree ("image_id");
  CREATE INDEX "layanan_kantor_keunggulan_order_idx" ON "layanan_kantor_keunggulan" USING btree ("_order");
  CREATE INDEX "layanan_kantor_keunggulan_parent_id_idx" ON "layanan_kantor_keunggulan" USING btree ("_parent_id");
  CREATE INDEX "layanan_kantor_keunggulan_image_idx" ON "layanan_kantor_keunggulan" USING btree ("image_id");
  CREATE INDEX "layanan_kantor_galeri_order_idx" ON "layanan_kantor_galeri" USING btree ("_order");
  CREATE INDEX "layanan_kantor_galeri_parent_id_idx" ON "layanan_kantor_galeri" USING btree ("_parent_id");
  CREATE INDEX "layanan_kantor_galeri_src_idx" ON "layanan_kantor_galeri" USING btree ("src_id");
  CREATE INDEX "layanan_kantor_kantor_idx" ON "layanan_kantor" USING btree ("kantor_id");
  CREATE INDEX "layanan_kantor_layanan_idx" ON "layanan_kantor" USING btree ("layanan_id");
  CREATE UNIQUE INDEX "layanan_kantor_slug_idx" ON "layanan_kantor" USING btree ("slug");
  CREATE INDEX "layanan_kantor_foto_idx" ON "layanan_kantor" USING btree ("foto_id");
  CREATE INDEX "layanan_kantor_seo_seo_og_image_idx" ON "layanan_kantor" USING btree ("seo_og_image_id");
  CREATE INDEX "layanan_kantor_updated_at_idx" ON "layanan_kantor" USING btree ("updated_at");
  CREATE INDEX "layanan_kantor_created_at_idx" ON "layanan_kantor" USING btree ("created_at");
  CREATE UNIQUE INDEX "cities_slug_idx" ON "cities" USING btree ("slug");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "service_offices_whatsapp_numbers_order_idx" ON "service_offices_whatsapp_numbers" USING btree ("_order");
  CREATE INDEX "service_offices_whatsapp_numbers_parent_id_idx" ON "service_offices_whatsapp_numbers" USING btree ("_parent_id");
  CREATE INDEX "service_offices_packages_benefits_order_idx" ON "service_offices_packages_benefits" USING btree ("_order");
  CREATE INDEX "service_offices_packages_benefits_parent_id_idx" ON "service_offices_packages_benefits" USING btree ("_parent_id");
  CREATE INDEX "service_offices_packages_order_idx" ON "service_offices_packages" USING btree ("_order");
  CREATE INDEX "service_offices_packages_parent_id_idx" ON "service_offices_packages" USING btree ("_parent_id");
  CREATE INDEX "service_offices_facilities_order_idx" ON "service_offices_facilities" USING btree ("_order");
  CREATE INDEX "service_offices_facilities_parent_id_idx" ON "service_offices_facilities" USING btree ("_parent_id");
  CREATE INDEX "service_offices_facilities_image_idx" ON "service_offices_facilities" USING btree ("image_id");
  CREATE INDEX "service_offices_gallery_order_idx" ON "service_offices_gallery" USING btree ("_order");
  CREATE INDEX "service_offices_gallery_parent_id_idx" ON "service_offices_gallery" USING btree ("_parent_id");
  CREATE INDEX "service_offices_gallery_src_idx" ON "service_offices_gallery" USING btree ("src_id");
  CREATE UNIQUE INDEX "service_offices_slug_idx" ON "service_offices" USING btree ("slug");
  CREATE INDEX "service_offices_service_idx" ON "service_offices" USING btree ("service_id");
  CREATE INDEX "service_offices_city_idx" ON "service_offices" USING btree ("city_id");
  CREATE INDEX "service_offices_image_idx" ON "service_offices" USING btree ("image_id");
  CREATE INDEX "service_offices_seo_seo_og_image_idx" ON "service_offices" USING btree ("seo_og_image_id");
  CREATE INDEX "service_offices_updated_at_idx" ON "service_offices" USING btree ("updated_at");
  CREATE INDEX "service_offices_created_at_idx" ON "service_offices" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "promotions_service_idx" ON "promotions" USING btree ("service_id");
  CREATE INDEX "promotions_image_idx" ON "promotions" USING btree ("image_id");
  CREATE INDEX "promotions_updated_at_idx" ON "promotions" USING btree ("updated_at");
  CREATE INDEX "promotions_created_at_idx" ON "promotions" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "comparison_rows_service_idx" ON "comparison_rows" USING btree ("service_id");
  CREATE INDEX "comparison_rows_updated_at_idx" ON "comparison_rows" USING btree ("updated_at");
  CREATE INDEX "comparison_rows_created_at_idx" ON "comparison_rows" USING btree ("created_at");
  CREATE INDEX "homepage_layout_updated_at_idx" ON "homepage_layout" USING btree ("updated_at");
  CREATE INDEX "homepage_layout_created_at_idx" ON "homepage_layout" USING btree ("created_at");
  CREATE INDEX "faqs_service_idx" ON "faqs" USING btree ("service_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "homepage_facilities_image_idx" ON "homepage_facilities" USING btree ("image_id");
  CREATE INDEX "homepage_facilities_updated_at_idx" ON "homepage_facilities" USING btree ("updated_at");
  CREATE INDEX "homepage_facilities_created_at_idx" ON "homepage_facilities" USING btree ("created_at");
  CREATE INDEX "leads_interested_service_idx" ON "leads" USING btree ("interested_service_id");
  CREATE INDEX "leads_location_idx" ON "leads" USING btree ("location_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_kantor_id_idx" ON "payload_locked_documents_rels" USING btree ("kantor_id");
  CREATE INDEX "payload_locked_documents_rels_layanan_kantor_id_idx" ON "payload_locked_documents_rels" USING btree ("layanan_kantor_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_service_offices_id_idx" ON "payload_locked_documents_rels" USING btree ("service_offices_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("promotions_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_comparison_rows_id_idx" ON "payload_locked_documents_rels" USING btree ("comparison_rows_id");
  CREATE INDEX "payload_locked_documents_rels_homepage_layout_id_idx" ON "payload_locked_documents_rels" USING btree ("homepage_layout_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_homepage_facilities_id_idx" ON "payload_locked_documents_rels" USING btree ("homepage_facilities_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_whatsapp_numbers_order_idx" ON "site_settings_whatsapp_numbers" USING btree ("_order");
  CREATE INDEX "site_settings_whatsapp_numbers_parent_id_idx" ON "site_settings_whatsapp_numbers" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_children_order_idx" ON "site_settings_navigation_children" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_children_parent_id_idx" ON "site_settings_navigation_children" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_stats_banner_order_idx" ON "site_settings_stats_banner" USING btree ("_order");
  CREATE INDEX "site_settings_stats_banner_parent_id_idx" ON "site_settings_stats_banner" USING btree ("_parent_id");
  CREATE INDEX "site_settings_how_it_works_order_idx" ON "site_settings_how_it_works" USING btree ("_order");
  CREATE INDEX "site_settings_how_it_works_parent_id_idx" ON "site_settings_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "about_page_hero_highlights_order_idx" ON "about_page_hero_highlights" USING btree ("_order");
  CREATE INDEX "about_page_hero_highlights_parent_id_idx" ON "about_page_hero_highlights" USING btree ("_parent_id");
  CREATE INDEX "about_page_story_highlights_order_idx" ON "about_page_story_highlights" USING btree ("_order");
  CREATE INDEX "about_page_story_highlights_parent_id_idx" ON "about_page_story_highlights" USING btree ("_parent_id");
  CREATE INDEX "about_page_stats_order_idx" ON "about_page_stats" USING btree ("_order");
  CREATE INDEX "about_page_stats_parent_id_idx" ON "about_page_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE INDEX "about_page_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "about_page_story_image_idx" ON "about_page" USING btree ("story_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "services_benefits" CASCADE;
  DROP TABLE "services_benefit_items" CASCADE;
  DROP TABLE "services_features" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "kantor_galeri" CASCADE;
  DROP TABLE "kantor" CASCADE;
  DROP TABLE "layanan_kantor_paket_harga_benefits" CASCADE;
  DROP TABLE "layanan_kantor_paket_harga" CASCADE;
  DROP TABLE "layanan_kantor_fasilitas" CASCADE;
  DROP TABLE "layanan_kantor_keunggulan" CASCADE;
  DROP TABLE "layanan_kantor_galeri" CASCADE;
  DROP TABLE "layanan_kantor" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "service_offices_whatsapp_numbers" CASCADE;
  DROP TABLE "service_offices_packages_benefits" CASCADE;
  DROP TABLE "service_offices_packages" CASCADE;
  DROP TABLE "service_offices_facilities" CASCADE;
  DROP TABLE "service_offices_gallery" CASCADE;
  DROP TABLE "service_offices" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "comparison_rows" CASCADE;
  DROP TABLE "homepage_layout" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "homepage_facilities" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_whatsapp_numbers" CASCADE;
  DROP TABLE "site_settings_navigation_children" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings_stats_banner" CASCADE;
  DROP TABLE "site_settings_how_it_works" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "about_page_hero_highlights" CASCADE;
  DROP TABLE "about_page_story_highlights" CASCADE;
  DROP TABLE "about_page_stats" CASCADE;
  DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_services_benefit_items_icon";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_layanan_kantor_fasilitas_icon";
  DROP TYPE "public"."enum_layanan_kantor_keunggulan_icon";
  DROP TYPE "public"."enum_service_offices_facilities_icon";
  DROP TYPE "public"."enum_homepage_layout_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_homepage_facilities_icon";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_about_page_values_icon";`)
}
