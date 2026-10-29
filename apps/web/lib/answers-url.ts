import type { Answers, Profile, ScreenSize } from "@techpick/engine";

type Os = Answers["os"][number];
type Portability = Answers["portability"];

const PROFILES: readonly Profile[] = ["student", "software", "gaming", "creative"];
const SCREENS: readonly ScreenSize[] = ["small", "medium", "large"];
const OSES: readonly Os[] = ["windows", "macos", "linux"];
const PORTABILITIES: readonly Portability[] = ["rarely", "sometimes", "daily"];

const DEFAULT_BUDGET_TL = 30_000;

// Answers → "butce=30000&kullanim=gaming,software&tasima=daily&ekran=medium&isletim=windows"
export function answersToSearch(a: Answers): string {
    const params = new URLSearchParams({
        butce: String(a.budgetKurus / 100),
        kullanim: a.profiles.join(","),
        tasima: a.portability,
        ekran: a.screenSizes.join(","),
        isletim: a.os.join(","),
    });
    return params.toString();
}

// Keep only values we know; anyone can type anything into a URL.
function pickList<T extends string>(raw: string | undefined, allowed: readonly T[]): T[] {
    if (!raw) return [];
    return raw.split(",").filter((x): x is T => (allowed as readonly string[]).includes(x));
}

export function answersFromSearch(sp: Record<string, string | string[] | undefined>): Answers {
    const get = (key: string) => (typeof sp[key] === "string" ? sp[key] : undefined);

    const budgetTl = Number(get("butce"));
    const portability = get("tasima");

    return {
        budgetKurus: (Number.isInteger(budgetTl) && budgetTl > 0 ? budgetTl : DEFAULT_BUDGET_TL) * 100,
        profiles: pickList(get("kullanim"), PROFILES),
        portability: PORTABILITIES.includes(portability as Portability) ? (portability as Portability) : "sometimes",
        screenSizes: pickList(get("ekran"), SCREENS),
        os: pickList(get("isletim"), OSES),
    };
}