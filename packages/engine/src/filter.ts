import type { Answers, Candidate, ScreenSize } from "./types.ts";

export function filterCandidates(answers: Answers, candidates: Candidate[]): Candidate[] {
  return candidates.filter(
    (c) => fitsBudget(c, answers) && fitsOs(c, answers) && fitsScreen(c, answers),
  );
}

export function fitsBudget(c: Candidate, answers: Answers): boolean {
  return c.priceKurus * 100 <= answers.budgetKurus * 105;
}

export function fitsOs(c: Candidate, answers: Answers): boolean {
  if (answers.os.length === 0) return true;
  if (c.os === "none") return answers.os.includes("windows");
  return answers.os.includes(c.os);
}

export function screenSizeOf(inches: number): ScreenSize {
  if (inches < 15) return "small";
  if (inches < 17) return "medium";
  return "large";
}

export function fitsScreen(c: Candidate, answers: Answers): boolean {
  if (answers.screenSizes.length === 0) return true;
  return answers.screenSizes.includes(screenSizeOf(c.screenSizeIn));
}