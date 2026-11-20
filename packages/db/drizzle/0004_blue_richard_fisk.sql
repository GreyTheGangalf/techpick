CREATE TYPE "public"."fetch_method" AS ENUM('jsonld', 'manual');--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "price_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"offer_id" integer NOT NULL,
	"price_kurus" integer NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "price_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "fetch_method" "fetch_method" DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "price_history_offer_recorded_idx" ON "price_history" USING btree ("offer_id","recorded_at");