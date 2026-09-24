import type { Candidate, Criteria } from "./types";

/** Main picks may go this far over budget. */
export const BUDGET_TOLERANCE = 1.05;
/** The "pay a bit more" pick may go this far over budget. */
export const STRETCH_CAP = 1.15;

export function matchesOs(c: Candidate, pref: Criteria["os"]): boolean {
  if (pref === "any") return true;
  if (pref === "macos") return c.os === "macos";
  // FreeDOS machines are sold to people who install Windows themselves.
  return c.os === "windows" || c.os === "freedos";
}

export function matchesScreen(c: Candidate, pref: Criteria["screen"]): boolean {
  const inches = c.display.inches;
  switch (pref) {
    case "small":
      return inches < 15;
    case "medium":
      return inches >= 15 && inches < 17;
    case "large":
      return inches >= 17;
    case "any":
      return true;
  }
}

export function matchesMustHave(c: Candidate, mustHave: Criteria["mustHave"]): boolean {
  if (!mustHave) return true;
  if (mustHave.oled && c.display.panel !== "oled") return false;
  if (mustHave.brands?.length) {
    const brands = mustHave.brands.map((b) => b.toLocaleLowerCase("tr-TR"));
    if (!brands.includes(c.brand.toLocaleLowerCase("tr-TR"))) return false;
  }
  return true;
}

/** Hard filters. Keeps candidates up to the stretch cap; the main picks narrow further later. */
export function filterCandidates(candidates: Candidate[], criteria: Criteria): Candidate[] {
  const maxPrice = criteria.budgetTry * STRETCH_CAP;
  return candidates.filter(
    (c) =>
      c.priceTry > 0 &&
      c.priceTry <= maxPrice &&
      matchesOs(c, criteria.os) &&
      matchesScreen(c, criteria.screen) &&
      matchesMustHave(c, criteria.mustHave),
  );
}
