export type Profile = "student" | "software" | "gaming" | "creative";
export type ScreenSize = "small" | "medium" | "large";

export type Answers = {
  budgetKurus: number;
  profiles: Profile[];
  portability: "rarely" | "sometimes" | "daily";
  screenSizes: ScreenSize[];                         // empty = any size
  os: ("windows" | "macos" | "linux")[];             // empty = any OS
};


export type Candidate = {
  configurationId: number;
  familyId: number;           
  os: "windows" | "macos" | "linux" | "none";
  cpu: { model: string; cb2024Single: number; cb2024Multi: number };
  gpu: { model: string; timespyGraphics: number; timespyRefTgpW: number | null };
  gpuTgpW: number | null;     
  storageGb: number;
  weightG: number;
  batteryWh: number;
  screenSizeIn: number;
  priceKurus: number;         
};