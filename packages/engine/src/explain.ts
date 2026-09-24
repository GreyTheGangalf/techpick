import type { Candidate, Criteria, PanelType, Reason, ScoredCandidate, SubScoreKey, Weights } from "./types";

const STRENGTH_MIN = 60;
const WEAKNESS_MAX = 40;
/** A sub-score only counts as a weakness if the user actually cares about it. */
const WEAKNESS_MIN_WEIGHT = 10;

const PANEL_LABEL: Record<PanelType, string> = {
  oled: "OLED",
  "mini-led": "Mini-LED",
  ips: "IPS",
  va: "VA",
  tn: "TN",
};

const num = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 1 });

function strengthText(key: SubScoreKey, c: Candidate): string {
  switch (key) {
    case "cpu":
      return `${c.cpu.model} işlemcisi derleme, render gibi ağır işlerde rahat eder.`;
    case "gpu":
      return c.gpu.integrated
        ? `${c.gpu.model} dahili grafik, bu fiyat aralığında güçlü sayılır.`
        : `${c.gpu.model} ekran kartıyla güncel oyunları ve 3D işleri akıcı çalıştırırsın.`;
    case "memory":
      return `${c.ramGb} GB RAM${c.ramUpgradeable ? ", ileride yükseltilebilir" : ""}; aynı anda çok iş açmak sorun olmaz.`;
    case "display": {
      const d = c.display;
      const color = d.srgbPct ? `, %${d.srgbPct} sRGB` : "";
      return `${num(d.inches)}" ${PANEL_LABEL[d.panel]} ekran, ${d.refreshHz} Hz${color}.`;
    }
    case "portability":
      return `${num(c.weightKg)} kg ağırlık ve ${num(c.batteryWh)} Wh pil; her gün taşımaya uygun.`;
    case "value":
      return "Bu fiyata verdiği performans, adaylar arasında en iyilerden.";
  }
}

function weaknessText(key: SubScoreKey, c: Candidate): string {
  switch (key) {
    case "cpu":
      return `${c.cpu.model} adaylar arasında zayıf kalıyor; ağır işlerde yavaşlayabilir.`;
    case "gpu":
      return c.gpu.integrated
        ? "Harici ekran kartı yok; oyun ve 3D işler için yetersiz."
        : `${c.gpu.model} adaylar arasında zayıf; yeni oyunlarda ayarları düşürmen gerekir.`;
    case "memory":
      return c.ramUpgradeable
        ? `${c.ramGb} GB RAM zamanla yetersiz kalabilir, ama sonradan eklenebiliyor.`
        : `${c.ramGb} GB RAM zamanla yetersiz kalabilir ve yükseltilemiyor.`;
    case "display":
      return "Ekranı adaylar arasında vasat; renk ya da tazeleme hızı beklentiyi karşılamayabilir.";
    case "portability":
      return `${num(c.weightKg)} kg; her gün çantada taşımak için ağır.`;
    case "value":
      return "Fiyatına göre verdiği performans, alternatiflerin gerisinde.";
  }
}

/**
 * Up to two strengths (the sub-scores contributing most to the total) and one weakness.
 * Always naming a weakness is intentional: it is what makes the recommendation believable.
 */
export function explain(scored: ScoredCandidate, weights: Weights, criteria: Criteria): Reason[] {
  const { candidate: c, subScores } = scored;
  const keys = Object.keys(weights) as SubScoreKey[];

  const strengths = keys
    .filter((k) => weights[k] > 0 && subScores[k] >= STRENGTH_MIN)
    .sort((a, b) => weights[b] * subScores[b] - weights[a] * subScores[a])
    .slice(0, 2)
    .map((k): Reason => ({ kind: "strength", key: k, text: strengthText(k, c) }));

  const reasons: Reason[] = [...strengths];

  if (c.priceTry > criteria.budgetTry) {
    const pct = Math.ceil(((c.priceTry - criteria.budgetTry) / criteria.budgetTry) * 100);
    reasons.push({ kind: "weakness", key: "budget", text: `Bütçeni yaklaşık %${pct} aşıyor.` });
    return reasons;
  }

  const weakest = keys
    .filter((k) => weights[k] >= WEAKNESS_MIN_WEIGHT && subScores[k] <= WEAKNESS_MAX)
    .sort((a, b) => subScores[a] - subScores[b])[0];
  if (weakest) reasons.push({ kind: "weakness", key: weakest, text: weaknessText(weakest, c) });

  return reasons;
}
