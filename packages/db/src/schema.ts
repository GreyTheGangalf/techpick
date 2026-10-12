import { pgTable, pgEnum, integer, text, numeric, boolean, timestamp, unique } from "drizzle-orm/pg-core";
export const osEnum = pgEnum("os", ["windows", "macos", "linux", "none"]);

export const modelFamilies = pgTable(
    "model_families",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        brand: text("brand").notNull(),
        name: text("name").notNull(),
        createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    },
    (t) => [unique().on(t.brand, t.name)]
).enableRLS();

export const configurations = pgTable("configurations", 
    {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    familyId: integer("family_id").notNull().references(() => modelFamilies.id),
    variantName: text("variant_name").notNull(),
    mpn: text("mpn").unique(),
    os: osEnum("os").notNull(),
    cpuModel: text("cpu_model").notNull(),
    gpuModel:  text("gpu_model").notNull(),
    gpuTgpW: integer("gpu_tgp_w"),             // bkz. soru B
    ramGb: integer("ram_gb").notNull(),
    storageGb: integer("storage_gb").notNull(),
    weightG: integer("weight_g").notNull(),
    batteryWh: integer("battery_wh").notNull(),
    screenSizeIn: numeric("screen_size_in", { precision: 3, scale: 1, mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
},
// ADDED: the same variant cannot be entered twice in one family
  // (same idea as brand + name on model_families)
(t) => [unique().on(t.familyId, t.variantName)],
).enableRLS();

export const stores = pgTable("stores", {
id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
name: text("name").notNull().unique(),
url: text("url").notNull(),
isTrusted: boolean("is_trusted").notNull().default(false),
createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export const offers = pgTable(
"offers",
{
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    // FIX: this is a foreign key, not a second primary key. Its value comes from configurations,
    // so it cannot be auto-generated. Also fixed the typo "configuraton_id".
    configurationId: integer("configuration_id").notNull().references(() => configurations.id),
    storeId: integer("store_id").notNull().references(() => stores.id),
    sellerName: text("seller_name").notNull().default(""),
    priceKurus: integer("price_kurus").notNull(),
    inStock: boolean("in_stock").notNull(),
    url: text("url").notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
},
  // FIX: one offer per configuration + store + seller (decision of 29 Sep)
(t) => [unique().on(t.configurationId, t.storeId, t.sellerName)],
).enableRLS();
