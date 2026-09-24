import "dotenv/config";
import { createDb } from "./index";
import { cpus, gpus, stores } from "./schema";

/**
 * Reference data only: stores and a starter benchmark table.
 * Benchmark numbers are rough placeholders marked UNVERIFIED; replace them from a real source
 * (see README > Veri) before they drive recommendations. No laptops or prices are seeded on purpose.
 */
const UNVERIFIED = "yaklaşık, doğrulanmadı";

const storeRows: (typeof stores.$inferInsert)[] = [
  { name: "Teknosa", slug: "teknosa", homepage: "https://www.teknosa.com" },
  { name: "Amazon.com.tr", slug: "amazon-tr", homepage: "https://www.amazon.com.tr" },
  { name: "Hepsiburada", slug: "hepsiburada", homepage: "https://www.hepsiburada.com" },
  { name: "Trendyol", slug: "trendyol", homepage: "https://www.trendyol.com" },
  { name: "MediaMarkt", slug: "mediamarkt", homepage: "https://www.mediamarkt.com.tr" },
  { name: "Vatan Bilgisayar", slug: "vatan", homepage: "https://www.vatanbilgisayar.com" },
];

const cpuRows = ([
  { vendor: "intel", model: "Core i5-13420H", cores: 8, threads: 12, multiScore: 12000 },
  { vendor: "intel", model: "Core i7-13620H", cores: 10, threads: 16, multiScore: 15000 },
  { vendor: "intel", model: "Core Ultra 7 155H", cores: 16, threads: 22, multiScore: 17000 },
  { vendor: "amd", model: "Ryzen 5 7535HS", cores: 6, threads: 12, multiScore: 11000 },
  { vendor: "amd", model: "Ryzen 7 7735HS", cores: 8, threads: 16, multiScore: 14500 },
  { vendor: "amd", model: "Ryzen 7 8845HS", cores: 8, threads: 16, multiScore: 17000 },
  { vendor: "apple", model: "Apple M3", cores: 8, threads: 8, multiScore: 10500 },
  { vendor: "apple", model: "Apple M4", cores: 10, threads: 10, multiScore: 14500 },
] satisfies (typeof cpus.$inferInsert)[]).map((r) => ({ ...r, benchmarkSource: UNVERIFIED }));

const gpuRows = ([
  { vendor: "intel", model: "Intel Iris Xe", integrated: true, score: 1800 },
  { vendor: "intel", model: "Intel Arc (Meteor Lake)", integrated: true, score: 3500 },
  { vendor: "amd", model: "Radeon 680M", integrated: true, score: 2600 },
  { vendor: "amd", model: "Radeon 780M", integrated: true, score: 3000 },
  // Time Spy does not run on macOS; Apple scores need a cross-platform equivalent.
  { vendor: "apple", model: "Apple M3 GPU (10 çekirdek)", integrated: true, score: 3500 },
  { vendor: "nvidia", model: "GeForce RTX 4050 Laptop", tgpWatts: 95, integrated: false, vramGb: 6, score: 8500 },
  { vendor: "nvidia", model: "GeForce RTX 4060 Laptop", tgpWatts: 115, integrated: false, vramGb: 8, score: 10500 },
  { vendor: "nvidia", model: "GeForce RTX 4070 Laptop", tgpWatts: 115, integrated: false, vramGb: 8, score: 12000 },
] satisfies (typeof gpus.$inferInsert)[]).map((r) => ({ ...r, benchmarkSource: UNVERIFIED }));

async function main() {
  const db = createDb();
  await db.insert(stores).values(storeRows).onConflictDoNothing();
  await db.insert(cpus).values(cpuRows).onConflictDoNothing();
  await db.insert(gpus).values(gpuRows).onConflictDoNothing();
  console.log(`Seeded ${storeRows.length} stores, ${cpuRows.length} CPUs, ${gpuRows.length} GPUs.`);
  await db.$client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
