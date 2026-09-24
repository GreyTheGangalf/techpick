import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "İhtiyacını anlat",
    body: "Bütçen, laptopu ne için kullanacağın, ne kadar taşıyacağın. Teknik terim yok, 6-7 soru.",
  },
  {
    title: "Üç öneri al",
    body: "En iyi eşleşme, en iyi fiyat/performans ve biraz daha fazla ödersen alabileceğin daha iyisi.",
  },
  {
    title: "Nedenini gör",
    body: "Her önerinin güçlü ve zayıf yanı açıkça yazılı. Sıralamayı mağaza komisyonu değil, senin kriterlerin belirler.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-16 sm:py-24">
      <p className="text-muted-foreground text-sm font-medium">TechPick</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Hangi laptopu almalıyım?
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl text-lg text-pretty">
        Ne için kullanacağını ve bütçeni söyle. Türkiye&apos;de satılan laptoplar arasından sana en uygun üç
        tanesini gerekçesiyle ve güncel fiyatıyla önerelim.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Button size="lg" disabled>
          Sihirbaz yakında
        </Button>
        <span className="text-muted-foreground text-sm">İlk sürüm Kasım 2026&apos;da.</span>
      </div>

      <section className="mt-20" aria-labelledby="nasil-calisir">
        <h2 id="nasil-calisir" className="text-xl font-semibold">
          Nasıl çalışır?
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="border-border rounded-xl border p-5">
              <span className="text-muted-foreground font-mono text-sm">{i + 1}</span>
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="text-muted-foreground mt-auto pt-20 text-xs">
        TechPick bağımsız bir öğrenci projesidir.
      </footer>
    </main>
  );
}
