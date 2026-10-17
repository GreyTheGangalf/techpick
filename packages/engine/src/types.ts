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