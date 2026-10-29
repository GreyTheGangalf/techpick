import { readFileSync } from "node:fs";
import { eq, sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { configurations, cpus, gpus, modelFamilies, offers, osEnum, stores } from "../src/schema.ts";


type Db = PostgresJsDatabase;
type CsvRow = Record<string, string>;

function readCsv(fileName: string): CsvRow[] {
  const text = readFileSync(new URL(fileName, import.meta.url), "utf8")
    .replace(/^﻿/, ""); // Windows editors may add an invisible BOM at the start
  const [headerLine, ...lines] = text.trim().split(/\r?\n/); // \r? handles Windows line endings
  const headers = headerLine.split(",");

  return lines.map((line, i) => {
    const cells = line.split(",");
    if (cells.length !== headers.length) {
      throw new Error(`${fileName} line ${i + 2}: expected ${headers.length} columns, got ${cells.length}`);
    }
    return Object.fromEntries(headers.map((h, j) => [h, cells[j].trim()]));
  });
}

function toInt(value: string, field: string): number {
  const n = Number(value);
  if (value === "" || !Number.isInteger(n)) {
    throw new Error(`${field}: "${value}" is not an integer`);
  }
  return n;
}

async function seedCpus(db: Db) {
  const rows = readCsv("cpus.csv").map((r) => ({
    model: r.model,
    vendor: r.vendor,
    cb2024Single: toInt(r.cb2024_single, "cb2024_single"),
    cb2024Multi: toInt(r.cb2024_multi, "cb2024_multi"),
  }));

  await db
    .insert(cpus)
    .values(rows)
    .onConflictDoUpdate({
      target: cpus.model,
      set: {
        vendor: sql`excluded.vendor`,
        cb2024Single: sql`excluded.cb2024_single`,
        cb2024Multi: sql`excluded.cb2024_multi`,
      },
    });

  console.log(`cpus: ${rows.length} rows upserted`);
}

function toIntOrNull(value: string, field: string): number | null {
  const n = Number(value);
  if (value === "") return null;
  return toInt(value, field);
}

async function seedGpus(db: Db) {
  const rows = readCsv("gpus.csv").map((r) => ({
    model: r.model,
    vendor: r.vendor,
    timespyGraphics: toInt(r.timespy_graphics, "timespy_graphics"),
    timespyRefTgpW: toIntOrNull(r.timespy_ref_tgp_w, "timespy_ref_tgp_w"),
  }));
  await db
    .insert(gpus)
    .values(rows)
    .onConflictDoUpdate({
      target: gpus.model,
      set: {
        vendor: sql`excluded.vendor`,
        timespyGraphics: sql`excluded.timespy_graphics`,
        timespyRefTgpW: sql`excluded.timespy_ref_tgp_w`,
      },
    });
  console.log(`gpus: ${rows.length} rows upserted`);
}

function toDecimal(value: string, field: string): number {
  const n = Number(value);
  if (value === "" || Number.isNaN(n)) {
    throw new Error(`${field}: "${value}" is not a number`);
  }
  return n;
}

function toIdMap(rows: { id: number; key: string }[]): Map<string, number> {
  return new Map(rows.map((r) => [r.key, r.id]));
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set in the root .env");
}

function lookup(map: Map<string, number>, name: string, what: string, line: number): number {
  const id = map.get(name);
  if (id === undefined) {
    throw new Error(`configurations.csv line ${line}: unknown ${what} "${name}" (add it to ${what}s.csv first)`);
  }
  return id;
}

async function seedConfigurations(db: Db) {
  const csv = readCsv("configurations.csv");

  const familyRows = [...new Map(csv.map((r) => [`${r.brand}|${r.family}`, { brand: r.brand, name: r.family }])).values()];
  await db.insert(modelFamilies).values(familyRows).onConflictDoNothing();

  const familyIds = toIdMap(
    (await db.select({ id: modelFamilies.id, brand: modelFamilies.brand, name: modelFamilies.name }).from(modelFamilies))
      .map((f) => ({ id: f.id, key: `${f.brand}|${f.name}` })),
  );
  const cpuIds = toIdMap(await db.select({ id: cpus.id, key: cpus.model }).from(cpus));
  const gpuIds = toIdMap(await db.select({ id: gpus.id, key: gpus.model }).from(gpus));

  const rows = csv.map((r, i) => {
    const line = i + 2;
    return {
      familyId: lookup(familyIds, `${r.brand}|${r.family}`, "family", line),
      cpuId: lookup(cpuIds, r.cpu, "cpu", line),
      gpuId: lookup(gpuIds, r.gpu, "gpu", line),
      variantName: r.variant_name,
      mpn: r.mpn === "" ? null : r.mpn,
      os: toOs(r.os, line),
      gpuTgpW: toIntOrNull(r.gpu_tgp_w, "gpu_tgp_w"),
      ramGb: toInt(r.ram_gb, "ram_gb"),
      storageGb: toInt(r.storage_gb, "storage_gb"),
      weightG: toInt(r.weight_g, "weight_g"),
      batteryWh: toInt(r.battery_wh, "battery_wh"),
      screenSizeIn: toDecimal(r.screen_size_in, "screen_size_in"),
    };
  });

  await db
    .insert(configurations)
    .values(rows)
    .onConflictDoUpdate({
      target: [configurations.familyId, configurations.variantName],
      set: {
        mpn: sql`excluded.mpn`,
        os: sql`excluded.os`,
        cpuId: sql`excluded.cpu_id`,
        gpuId: sql`excluded.gpu_id`,
        gpuTgpW: sql`excluded.gpu_tgp_w`,
        ramGb: sql`excluded.ram_gb`,
        storageGb: sql`excluded.storage_gb`,
        weightG: sql`excluded.weight_g`,
        batteryWh: sql`excluded.battery_wh`,
        screenSizeIn: sql`excluded.screen_size_in`,
      },
    });

  console.log(`model_families: ${familyRows.length} in CSV, configurations: ${rows.length} rows upserted`);
}

type Os = (typeof osEnum.enumValues)[number]

function toOs(value: string, line: number): Os {
  const allowed: readonly string[] = osEnum.enumValues;

  if (!allowed.includes(value)) {
    throw new Error(`configurations.csv line ${line}: os "${value}" must be one of ${allowed.join(", ")}`);
  }
  return value as Os;
}

function toBool(value: string, field: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${field}: "${value}" must be true or false`);
}

async function seedStores(db: Db) {
  const rows = readCsv("stores.csv").map((r) => ({
    name: r.name,
    url: r.url,
    isTrusted: toBool(r.is_trusted, "is_trusted"),
  }));

  await db
    .insert(stores)
    .values(rows)
    .onConflictDoUpdate({
      target: stores.name,
      set: { url: sql`excluded.url`, isTrusted: sql`excluded.is_trusted` },
    });

  console.log(`stores: ${rows.length} rows upserted`);
}

async function seedOffers(db: Db) {
  const csv = readCsv("offers.csv");

  const storeIds = toIdMap(await db.select({ id: stores.id, key: stores.name }).from(stores));
  const configIds = toIdMap(
    (await db
      .select({ id: configurations.id, family: modelFamilies.name, variant: configurations.variantName })
      .from(configurations)
      .innerJoin(modelFamilies, eq(configurations.familyId, modelFamilies.id)))
      .map((c) => ({ id: c.id, key: `${c.family}|${c.variant}` })),
  );
  const rows = csv.map((r, i) => {
    const line = i + 2;
    return {
      configurationId: lookup(configIds, `${r.family}|${r.variant_name}`, "configuration", line),
      storeId: lookup(storeIds, r.store, "store", line),
      sellerName: r.sellerName,
      priceKurus: toInt(r.price_kurus, "price_kurus"),
      inStock: toBool(r.in_stock,"in_stock"),
      url: r.url,
    };
  });

  await db
    .insert(offers)
    .values(rows)
    .onConflictDoUpdate({
      target: [offers.configurationId, offers.storeId, offers.sellerName],
      set: {
        priceKurus: sql`excluded.price_kurus`,
        inStock: sql`excluded.in_stock`,
        url: sql`excluded.url`,
        lastSeenAt: sql`now()`,
      },
    });

  console.log(`offers: ${rows.length} rows upserted`);
}

const client = postgres(url);
try {
  const db = drizzle(client);   // create the Drizzle wrapper once, reuse it for every table
  await seedCpus(db);
  await seedGpus(db);
  await seedConfigurations(db);
  await seedStores(db);
  await seedOffers(db);
} finally {
  await client.end();
}
