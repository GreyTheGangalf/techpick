CREATE TYPE "public"."cpu_vendor" AS ENUM('intel', 'amd', 'apple', 'qualcomm');--> statement-breakpoint
CREATE TYPE "public"."gpu_vendor" AS ENUM('nvidia', 'amd', 'intel', 'apple', 'qualcomm');--> statement-breakpoint
CREATE TYPE "public"."laptop_os" AS ENUM('windows', 'macos', 'linux', 'freedos');--> statement-breakpoint
CREATE TYPE "public"."panel_type" AS ENUM('ips', 'oled', 'va', 'tn', 'mini-led');--> statement-breakpoint
CREATE TABLE "click_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer NOT NULL,
	"slot" text NOT NULL,
	"rank" smallint NOT NULL,
	"criteria" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" integer NOT NULL,
	"slug" text NOT NULL,
	"mpn" text,
	"cpu_id" integer NOT NULL,
	"gpu_id" integer NOT NULL,
	"ram_gb" smallint NOT NULL,
	"ram_upgradeable" boolean NOT NULL,
	"storage_gb" integer NOT NULL,
	"os" "laptop_os" NOT NULL,
	"screen_inches" numeric(3, 1) NOT NULL,
	"resolution_w" smallint NOT NULL,
	"resolution_h" smallint NOT NULL,
	"refresh_hz" smallint NOT NULL,
	"panel" "panel_type" NOT NULL,
	"srgb_pct" smallint,
	"weight_kg" numeric(4, 2) NOT NULL,
	"battery_wh" numeric(5, 1) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"extra" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "configurations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "configurations_mpn_unique" UNIQUE("mpn")
);
--> statement-breakpoint
CREATE TABLE "cpus" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor" "cpu_vendor" NOT NULL,
	"model" text NOT NULL,
	"cores" smallint NOT NULL,
	"threads" smallint NOT NULL,
	"multi_score" integer NOT NULL,
	"single_score" integer,
	"benchmark_source" text,
	CONSTRAINT "cpus_model_unique" UNIQUE("model")
);
--> statement-breakpoint
CREATE TABLE "gpus" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor" "gpu_vendor" NOT NULL,
	"model" text NOT NULL,
	"tgp_watts" smallint,
	"integrated" boolean NOT NULL,
	"vram_gb" smallint,
	"score" integer NOT NULL,
	"benchmark_source" text
);
--> statement-breakpoint
CREATE TABLE "model_families" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"release_year" smallint,
	CONSTRAINT "model_families_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"configuration_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"url" text NOT NULL,
	"price_try" numeric(10, 2) NOT NULL,
	"in_stock" boolean NOT NULL,
	"last_checked_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer NOT NULL,
	"price_try" numeric(10, 2) NOT NULL,
	"in_stock" boolean NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"homepage" text NOT NULL,
	"affiliate_template" text,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_family_id_model_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."model_families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_cpu_id_cpus_id_fk" FOREIGN KEY ("cpu_id") REFERENCES "public"."cpus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_gpu_id_gpus_id_fk" FOREIGN KEY ("gpu_id") REFERENCES "public"."gpus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_configuration_id_configurations_id_fk" FOREIGN KEY ("configuration_id") REFERENCES "public"."configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "click_events_created_idx" ON "click_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "configurations_family_idx" ON "configurations" USING btree ("family_id");--> statement-breakpoint
CREATE UNIQUE INDEX "gpus_model_tgp_idx" ON "gpus" USING btree ("model","tgp_watts");--> statement-breakpoint
CREATE UNIQUE INDEX "offers_config_store_idx" ON "offers" USING btree ("configuration_id","store_id");--> statement-breakpoint
CREATE INDEX "offers_last_checked_idx" ON "offers" USING btree ("last_checked_at");--> statement-breakpoint
CREATE INDEX "price_history_offer_idx" ON "price_history" USING btree ("offer_id","recorded_at");