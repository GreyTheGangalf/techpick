export type Profile = "student" | "developer" | "gaming" | "creator";

export type GamingLevel = "none" | "light" | "heavy";
export type Portability = "daily" | "sometimes" | "rarely";
export type ScreenPreference = "small" | "medium" | "large" | "any";
export type OsPreference = "windows" | "macos" | "any";

export type LaptopOs = "windows" | "macos" | "linux" | "freedos";
export type PanelType = "ips" | "oled" | "va" | "tn" | "mini-led";

/** A single laptop configuration, flattened for scoring. Deliberately has no store data. */
export interface Candidate {
  id: string;
  familyId: string;
  brand: string;
  name: string;
  /** Lowest current in-stock offer price, TRY. */
  priceTry: number;
  os: LaptopOs;
  cpu: { model: string; multiScore: number };
  gpu: { model: string; score: number; integrated: boolean };
  ramGb: number;
  ramUpgradeable: boolean;
  storageGb: number;
  display: {
    inches: number;
    width: number;
    height: number;
    refreshHz: number;
    panel: PanelType;
    srgbPct: number | null;
  };
  weightKg: number;
  batteryWh: number;
}

export interface Criteria {
  budgetTry: number;
  profiles: Profile[];
  gaming: GamingLevel;
  portability: Portability;
  screen: ScreenPreference;
  os: OsPreference;
  mustHave?: {
    oled?: boolean;
    brands?: string[];
  };
}

export type SubScoreKey = "cpu" | "gpu" | "memory" | "display" | "portability" | "value";

export type SubScores = Record<SubScoreKey, number>;
export type Weights = Record<SubScoreKey, number>;

/** `alternative` fills a slot when no candidate qualifies for `best-value` or `stretch`. */
export type PickSlot = "best-match" | "best-value" | "stretch" | "alternative";

export interface Reason {
  kind: "strength" | "weakness";
  key: SubScoreKey | "budget";
  text: string;
}

export interface ScoredCandidate {
  candidate: Candidate;
  subScores: SubScores;
  penalty: number;
  score: number;
}

export interface Pick extends ScoredCandidate {
  slot: PickSlot;
  reasons: Reason[];
}

export interface RecommendationResult {
  picks: Pick[];
  weights: Weights;
  /** How many candidates survived the hard filters. */
  poolSize: number;
}
