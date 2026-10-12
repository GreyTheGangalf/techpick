CREATE TYPE "public"."os" AS ENUM('windows', 'macos', 'linux', 'none');--> statement-breakpoint
CREATE TABLE "configurations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "configurations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"family_id" integer NOT NULL,
	"variant_name" text NOT NULL,
	"mpn" text,
	"os" "os" NOT NULL,
	"cpu_model" text NOT NULL,
	"gpu_model" text NOT NULL,
	"gpu_tgp_w" integer,
	"ram_gb" integer NOT NULL,
	"storage_gb" integer NOT NULL,
	"weight_g" integer NOT NULL,
	"battery_wh" integer NOT NULL,
	"screen_size_in" numeric(3, 1) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "configurations_mpn_unique" UNIQUE("mpn"),
	CONSTRAINT "configurations_family_id_variant_name_unique" UNIQUE("family_id","variant_name")
);
--> statement-breakpoint
CREATE TABLE "model_families" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "model_families_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "model_families_brand_name_unique" UNIQUE("brand","name")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "offers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"configuration_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"seller_name" text DEFAULT '' NOT NULL,
	"price_kurus" integer NOT NULL,
	"in_stock" boolean NOT NULL,
	"url" text NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offers_configuration_id_store_id_seller_name_unique" UNIQUE("configuration_id","store_id","seller_name")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"url" text NOT NULL,
	"is_trusted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stores_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_family_id_model_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."model_families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_configuration_id_configurations_id_fk" FOREIGN KEY ("configuration_id") REFERENCES "public"."configurations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;