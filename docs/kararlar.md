# TechPick — Kararlar ve Açık İşler

Her çalışma oturumundan sonra buraya kısa bir not ekle: tarih, ne karar verildi, neden. Bu dosya projenin hafızası; yeni bir sohbet açtığında Claude buradan devam eder.

## Kararlar

| Tarih | Konu | Karar | Gerekçe |
|---|---|---|---|
| 24 Eyl 2026 | Fiyat aralığı | Motor her bütçeyi kabul eder; katalog kalite tabanıyla sınırlanır (8 GB altı RAM, eMMC, eski nesil işlemci alınmaz). Yoğunluk orta segmentte. | TL fiyatları hızla kaydığı için sabit aralık eskir. |
| 24 Eyl 2026 | MacBook | MVP'de var: güncel ve bir önceki nesil Air ve Pro, ~15-20 konfigürasyon. | "Mac mi Windows mu?" en sık sorulardan biri. |
| 24 Eyl 2026 | Affiliate | MVP'de düz link. Başvurular hafta 7-8'de; ilk program Teknosa Paylaş Kazan. | Programlar başvuruda çalışan site görmek ister. |
| 24 Eyl 2026 | İsim | TechPick çalışma adı; alan adı ve TÜRKPATENT kontrolüyle hafta 8'de kesinleşir. | Değiştirmek kodda birkaç yeri etkiler. |
| 24 Eyl 2026 | Repo | Temiz yeni monorepo. Eski repodaki scraper ve şema referans; eski repo arşivlenir. | Mimari değişiyor; temiz geçmiş portfolyoda daha iyi. |
| 24 Eyl 2026 | Epey verisi | Sadece "pazarda hangi modeller var" listesi için; yayına çıkmaz. | Kullanım koşulları ve tek kaynak bağımlılığı riski. |
| 26 Eyl 2026 | Öncelik | Bu dönemin ana projesi TechPick. How's my puck MVP yayınlanana kadar kod olarak rafta; sadece veri toplanıyor. | Haftada 10-15 saat iki projeye yetmez. |
| 26 Eyl 2026 | Çalışma şekli | Tasarım ve "neden" soruları bu projedeki sohbetlerde; kod Claude Code'da Learning modunda. Açıklayamadığım satırı commit etmiyorum. | Amaç ürün kadar öğrenmek. |
| 26 Eyl 2026 | Faz 2 bağlantısı | Serbest metin → sihirbaz kriterleri, Ollama ile yapılandırılmış çıktı deneyi olarak yapılacak; aynı zamanda LLM öğrenme projesi. | TechPick ve öğrenme hattı örtüşüyor. |
| 29 Eyl 2026 | Tablo ayrımı | `laptops` → `configurations` (özellik) + `offers` (fiyat, stok), 1-N. | Fiyat günlük değişir, özellik değişmez. |
| 29 Eyl 2026 | F/p fiyatı | Güvenilir mağazalardaki, stokta ve 48 saatten taze en düşük teklif kullanılır. Mağaza adı koda yazılmaz. | Güvenilirlik `stores.is_trusted` ile sağlanır. |
| 29 Eyl 2026 | Teklifsiz konfigürasyon | Önerilerde gösterilmez, silinmez; `is_visible` sütunu yok. | Tek doğruluk kaynağı offers. |
| 29 Eyl 2026 | Fiyat tipi | `price_kurus` tam sayı; float yok. | Float ondalıkta hata yapar. |
| 29 Eyl 2026 | Pazar yeri satıcıları | `seller_name NOT NULL DEFAULT ''`, `UNIQUE (configuration_id, store_id, seller_name)`. | Postgres'te NULL'lar eşit sayılmaz. |
| 29 Eyl 2026 | MPN | `configurations.mpn` benzersiz, boş olabilir. | Teklifleri konfigürasyona bağlamanın en güvenilir yolu. |
| 2 Eki 2026 | db paketi | Şema ve migration'lar `packages/db` altında, `@techpick/db` adıyla. `ingest/` workspace dışında, Python. | Şemayı web ve engine paylaşır; Python'u pnpm yönetmez. |
| 8 Eki 2026 | Merge yöntemi | PR'lar squash ile merge edilir, dal silinir. | main'de her PR tek commit. |
| 9 Eki 2026 | Supabase | Bölge Frankfurt; bağlantı session pooler (5432). | Türkiye'ye en yakın bölge; direct bağlantı IPv6 ister. |
| 9 Eki 2026 | Geliştirme ortamı | Claude Code yerelde (VS Code terminali); `DATABASE_URL` kökteki `.env`'de. 29 Eyl kararını günceller. | Yerel ortam DB'ye doğrudan bağlanır. |
| 9 Eki 2026 | Şema kapsamı | İlk migration 4 tablo: model_families, configurations, stores, offers. CPU/GPU şimdilik metin; cpus/gpus FK'leri 2. haftada. | Aile tablosu çeşitlilik kuralı için şart. |
| 12 Eki 2026 | Adlandırma | SQL sütunları snake_case ve birim adında (`weight_g`); TS alanları camelCase. Ekran `numeric(3,1)`. | Okunabilirlik, tutarlılık. |
| 12 Eki 2026 | RLS | Tüm tablolarda RLS açık, policy yok; RLS migration'da tutulur. | Supabase REST API anon key ile herkese açık. |
| 12 Eki 2026 | Çalışma şekli | Yeni konularda önce çözülmüş örnek, sonra azalan destek. | Boş sayfadan yazmak öğretici olmadı. |

## Açık işler

- [ ] techpick.com.tr alan adını kaydet (ucuz, şimdi alınabilir)
- [ ] Affiliate geliri için vergi durumunu bir mali müşavire sor (ilk ödemeden önce)
- [ ] Teknosa Paylaş Kazan'a katıl; Gelir Ortakları ve Admitad'a yayıncı olarak kaydol (hafta 7-8)

## Şu anki hafta

Hafta 1 (28 Eyl - 4 Eki):
- [x] Yeni repo
- [x] Şema + migration'lar
- [x] Supabase kurulumu
- [x] Boş site Vercel'de

Hafta 2 (5-11 Eki, gecikmeli): cpus/gpus benchmark tablosu, ilk 50 konfigürasyon (elle seçilecek)
