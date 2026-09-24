import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const osEnum = pgEnum("laptop_os", ["windows", "macos", "linux", "freedos"]);
export const panelEnum = pgEnum("panel_type", ["ips", "oled", "va", "tn", "mini-led"]);
export const cpuVendorEnum = pgEnum("cpu_vendor", ["intel", "amd", "apple", "qualcomm"]);
export const gpuVendorEnum = pgEnum("gpu_vendor", ["nvidia", "amd", "intel", "apple", "qualcomm"]);

/** Benchmark reference table. One row per CPU model, shared by every laptop that uses it. */
export const cpus = pgTable("cpus", {
  id: serial("id").primaryKey(),
  vendor: cpuVendorEnum("vendor").notNull(),
  model: text("model").notNull().unique(),
  cores: smallint("cores").notNull(),
  threads: smallint("threads").notNull(),
  /** Cinebench R23 multi-core. The scorer uses this. */
  multiScore: integer("multi_score").notNull(),
  singleScore: integer("single_score"),
  benchmarkSource: text("benchmark_source"),
});

/** A GPU's score depends on its power limit, so the same chip can appear at several TGPs. */
export const gpus = pgTable(
  "gpus",
  {
    id: serial("id").primaryKey(),
    vendor: gpuVendorEnum("vendor").notNull(),
    model: text("model").notNull(),
    tgpWatts: smallint("tgp_watts"),
    integrated: boolean("integrated").notNull(),
    vramGb: smallint("vram_gb"),
    /** 3DMark Time Spy graphics score. The scorer uses this. */
    score: integer("score").notNull(),
    benchmarkSource: text("benchmark_source"),
  },
  (t) => [uniqueIndex("gpus_model_tgp_idx").on(t.model, t.tgpWatts)],
);

/** e.g. "Lenovo LOQ 15IRX9". Recommendations are diversified at this level. */
export const modelFamilies = pgTable("model_families", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  releaseYear: smallint("release_year"),
});

/** A concrete, buyable spec. Recommendations are made at this level. No price here. */
export const configurations = pgTable(
  "configurations",
  {
    id: serial("id").primaryKey(),
    familyId: integer("family_id")
      .notNull()
      .references(() => modelFamilies.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    /** Manufacturer part number; the main key for matching store listings. */
    mpn: text("mpn").unique(),
    cpuId: integer("cpu_id")
      .notNull()
      .references(() => cpus.id),
    gpuId: integer("gpu_id")
      .notNull()
      .references(() => gpus.id),
    ramGb: smallint("ram_gb").notNull(),
    ramUpgradeable: boolean("ram_upgradeable").notNull(),
    storageGb: integer("storage_gb").notNull(),
    os: osEnum("os").notNull(),
    screenInches: numeric("screen_inches", { precision: 3, scale: 1, mode: "number" }).notNull(),
    resolutionW: smallint("resolution_w").notNull(),
    resolutionH: smallint("resolution_h").notNull(),
    refreshHz: smallint("refresh_hz").notNull(),
    panel: panelEnum("panel").notNull(),
    srgbPct: smallint("srgb_pct"),
    weightKg: numeric("weight_kg", { precision: 4, scale: 2, mode: "number" }).notNull(),
    batteryWh: numeric("battery_wh", { precision: 5, scale: 1, mode: "number" }).notNull(),
    /** Specs checked by hand against the manufacturer page. Unverified rows are hidden in production. */
    verified: boolean("verified").notNull().default(false),
    extra: jsonb("extra").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("configurations_family_idx").on(t.familyId)],
);

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  homepage: text("homepage").notNull(),
  /** How to turn a product URL into an affiliate URL, if we are in a program. Null = plain link. */
  affiliateTemplate: text("affiliate_template"),
});

/** A store listing of a configuration. This is where prices live. */
export const offers = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    configurationId: integer("configuration_id")
      .notNull()
      .references(() => configurations.id, { onDelete: "cascade" }),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id),
    url: text("url").notNull(),
    priceTry: numeric("price_try", { precision: 10, scale: 2, mode: "number" }).notNull(),
    inStock: boolean("in_stock").notNull(),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("offers_config_store_idx").on(t.configurationId, t.storeId),
    index("offers_last_checked_idx").on(t.lastCheckedAt),
  ],
);

export const priceHistory = pgTable(
  "price_history",
  {
    id: serial("id").primaryKey(),
    offerId: integer("offer_id")
      .notNull()
      .references(() => offers.id, { onDelete: "cascade" }),
    priceTry: numeric("price_try", { precision: 10, scale: 2, mode: "number" }).notNull(),
    inStock: boolean("in_stock").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("price_history_offer_idx").on(t.offerId, t.recordedAt)],
);

/** Outbound clicks from a recommendation. Used to tune weights; holds no personal data. */
export const clickEvents = pgTable(
  "click_events",
  {
    id: serial("id").primaryKey(),
    offerId: integer("offer_id")
      .notNull()
      .references(() => offers.id, { onDelete: "cascade" }),
    slot: text("slot").notNull(),
    rank: smallint("rank").notNull(),
    criteria: jsonb("criteria").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("click_events_created_idx").on(t.createdAt)],
);
