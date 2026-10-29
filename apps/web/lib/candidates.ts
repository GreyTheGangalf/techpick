import { and, eq, min } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { configurations, cpus, gpus, offers, stores } from "@techpick/db/schema";
import type { Candidate } from "@techpick/engine";

let cached: ReturnType<typeof drizzle> | null = null;

// Connect on first use, not at import time, so `next build` doesn't need the database.
function getDb() {
    if (cached === null) {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error("DATABASE_URL is not set (apps/web/.env.local or Vercel env)");
        }
        cached = drizzle(postgres(url, { prepare: false }));
    }
    return cached;
}

export async function loadCandidates(): Promise<Candidate[]> {
    const db = getDb();
    // Lowest in-stock price from a trusted store, per configuration.
    const bestPrice = db
        .select({ configurationId: offers.configurationId, priceKurus: min(offers.priceKurus).as("price_kurus") })
        .from(offers)
        .innerJoin(stores, eq(offers.storeId, stores.id))
        .where(and(eq(offers.inStock, true), eq(stores.isTrusted, true)))
        .groupBy(offers.configurationId)
        .as("best_price");
        
    const rows = await db
        .select({
            configurationId: configurations.id,
            familyId: configurations.familyId,
            os: configurations.os,
            cpuModel: cpus.model,
            cb2024Single: cpus.cb2024Single,
            cb2024Multi: cpus.cb2024Multi,
            gpuModel: gpus.model,
            timespyGraphics: gpus.timespyGraphics,
            timespyRefTgpW: gpus.timespyRefTgpW,
            gpuTgpW: configurations.gpuTgpW,
            ramGb: configurations.ramGb,
            storageGb: configurations.storageGb,
            weightG: configurations.weightG,
            batteryWh: configurations.batteryWh,
            screenSizeIn: configurations.screenSizeIn,
            priceKurus: bestPrice.priceKurus,
        })

        .from(configurations)
        .innerJoin(cpus, eq(configurations.cpuId, cpus.id))
        .innerJoin(gpus, eq(configurations.gpuId, gpus.id))
        .innerJoin(bestPrice, eq(configurations.id, bestPrice.configurationId));

    return rows.map((r) => ({
        configurationId: r.configurationId,
        familyId: r.familyId,
        os: r.os,
        cpu: { model: r.cpuModel, cb2024Single: r.cb2024Single, cb2024Multi: r.cb2024Multi },
        gpu: { model: r.gpuModel, timespyGraphics: r.timespyGraphics, timespyRefTgpW: r.timespyRefTgpW },
        gpuTgpW: r.gpuTgpW,
        ramGb: r.ramGb,
        storageGb: r.storageGb,
        weightG: r.weightG,
        batteryWh: r.batteryWh,
        screenSizeIn: r.screenSizeIn,
        priceKurus: Number(r.priceKurus),
    }));
}