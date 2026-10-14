import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cpus, gpus } from "../src/schema.ts";

type Db = PostgresJsDatabase;
type CsvRow = Record<string, string>;

// Read a CSV next to this file into objects keyed by the header row.
// Our data has no commas or quotes inside values, so a plain split is enough;
// the column-count check makes sure that assumption fails loudly if it breaks.
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

// CSV values are always strings; reject anything that is not a whole number.
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
    // `source` is intentionally dropped: it documents the CSV, not the DB.
  }));

  // Upsert: insert new models, update scores of models that already exist.
  // `excluded` is Postgres's name for "the row we tried to insert".
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

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set in the root .env");
}

const client = postgres(url);
try {
  const db = drizzle(client);   // create the Drizzle wrapper once, reuse it for every table
  await seedCpus(db);
  await seedGpus(db);
} finally {
  await client.end();
}
