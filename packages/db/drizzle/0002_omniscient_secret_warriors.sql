CREATE TABLE "cpus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cpus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"model" text NOT NULL,
	"vendor" text NOT NULL,
	"cb2024_single" integer NOT NULL,
	"cb2024_multi" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cpus_model_unique" UNIQUE("model")
);
--> statement-breakpoint
ALTER TABLE "cpus" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gpus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gpus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"model" text NOT NULL,
	"vendor" text NOT NULL,
	"timespy_graphics" integer NOT NULL,
	"timespy_ref_tgp_w" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gpus_model_unique" UNIQUE("model")
);
--> statement-breakpoint
ALTER TABLE "gpus" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "cpu_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "gpu_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_cpu_id_cpus_id_fk" FOREIGN KEY ("cpu_id") REFERENCES "public"."cpus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_gpu_id_gpus_id_fk" FOREIGN KEY ("gpu_id") REFERENCES "public"."gpus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configurations" DROP COLUMN "cpu_model";--> statement-breakpoint
ALTER TABLE "configurations" DROP COLUMN "gpu_model";