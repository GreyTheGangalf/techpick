CREATE TYPE "public"."panel" AS ENUM('ips', 'oled', 'va', 'tn');--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "panel" "panel";--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "resolution_w" integer;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "resolution_h" integer;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "refresh_hz" integer;