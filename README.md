# TechPick

Ne için kullanacağını ve bütçeni söyle; Türkiye'de satılan laptoplar arasından sana en uygun üç tanesini gerekçesiyle ve güncel fiyatıyla önerir.

> Durum: geliştirme aşamasında (1. hafta). İlk sürüm hedefi Kasım 2026.

## Nasıl çalışır

Öneri motoru deterministik ve açıklanabilir; yapay zekâ ürün seçmez.

1. **Kesin filtreler:** bütçe (+%5), işletim sistemi, ekran boyutu, olmazsa olmazlar.
2. **Alt skorlar (0-100):** CPU, GPU, bellek, ekran, taşınabilirlik, fiyat/performans. CPU ve GPU gerçek benchmark skorlarından gelir.
3. **Profil ağırlıkları:** öğrenci, yazılım, oyun, tasarım. Birden fazla profil seçilirse ağırlıklar harmanlanır.
4. **Çeşitlilik:** üç öneri farklı model ailelerinden gelir: en iyi eşleşme, en iyi fiyat/performans, biraz daha fazla öde.
5. **Açıklama:** her öneride güçlü yanlar ve bir zayıf yan yazılır.

Sıralama mağaza ya da komisyon bilgisini hiç görmez; motorun girdisinde bu alanlar yoktur ve bir test bunu korur.

## Yapı

```
apps/web          Next.js 16 (App Router), Tailwind 4, shadcn/ui
packages/engine   Öneri motoru + Vitest testleri
packages/db       Drizzle şeması, migration'lar, seed
ingest/           Python fiyat toplama işleri (6. hafta)
```

Veri modeli: `model_families` → `configurations` (öneri bu seviyede) → `offers` (mağaza fiyatı) → `price_history`. CPU ve GPU benchmark'ları ayrı referans tablolarında.

## Geliştirme

Gereksinimler: Node 22+, pnpm 11.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # motor testleri
pnpm typecheck
pnpm lint
```

Veritabanı (Supabase):

```bash
cp packages/db/.env.example packages/db/.env   # DATABASE_URL'i doldur
pnpm db:migrate
pnpm db:seed
```

## Veri

- Seed'deki CPU/GPU skorları **yaklaşık ve doğrulanmamış** (`benchmark_source = 'yaklaşık, doğrulanmadı'`). Öneri üretmeden önce gerçek kaynaktan güncellenmeli.
- Time Spy macOS'ta çalışmadığı için Apple GPU'ları için platformlar arası bir karşılık gerekiyor (açık konu).
- Konfigürasyonlar elle doğrulanana kadar `verified = false` kalır ve yayında gösterilmez.
