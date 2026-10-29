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
| 13 Eki 2026 | Benchmark | CPU: Cinebench 2024 single/multi; GPU: Time Spy Graphics + ölçüldüğü TGP. TGP düzeltmesi motorda formülle yapılır. | Veri DB’de, mantık motorda; watt başına puan verisi çoğu GPU için yok.
| 13 Eki 2026 | Benchmark kaynağı | Tek kaynak Notebookcheck; sadece notebook CPU'ları; skorlar tam sayıya yuvarlanır. | Farklı kaynakların skorları karşılaştırılamaz. |
| 14 Eki 2026 | Seed | CSV'ler packages/db/seed/ altında; pnpm db:seed model adına göre upsert eder. İsim değişince eski satır elle silinir. | Tekrar çalıştırılabilir, elle id girilmez. |
| 14 Eki 2026 | Apple GPU (açık) | Time Spy macOS'ta yok; Apple GPU skorlaması motor haftasında karara bağlanacak. | gpu_id NOT NULL. |
| 15 Eki 2026 | Aile ve konfigürasyon | Aynı şasinin RAM/depolama/nesil farkları aynı aile altında ayrı konfigürasyon; aile adı nesil kodu içermez. | Çeşitlilik kuralı aileye bakar. |
| 16 Eki 2026 | Configurations seed | CSV'de CPU/GPU adla yazılır, seed adı id'ye çevirir; bilinmeyen adda satır numarasıyla durur. Boş MPN NULL olur. | Id'ler DB'de üretilir, sabit değildir. |
| 17 Eki 2026 | Motor temeli | Motor saf fonksiyon, DB'ye dokunmaz; testler node:test ile. Normalizasyon aday küme içinde min-max, eşitlikte 100. GPU: skor × (TGP/ref)^0.5, oran 1'de kesilir. | Test edilebilirlik; üs senaryolarla ayarlanacak. |
| 17 Eki 2026 | Kesin filtreler | fiyat×100 ≤ bütçe×105 (tam sayı), ekran grupları <15 / 15-16.9 / ≥17, FreeDOS Windows sayılır ve zayıf yön olarak söylenir. |
| 23 Eki | Alt skorlar | CPU = single ve multi ayrı normalize edilip ortalanır; taşınabilirlik = ağırlık (düşük iyi) ve pil ortalaması; ekran panel verisi olmadığı için herkese 100; fiyat/perf = (CPU+GPU)/2 ÷ fiyat. | Ölçekleri farklı değerler ham ortalanırsa büyük olan baskın çıkar. |
| 23 Eki 2026 | Cezalar | Bütçe aşımı doğrusal: bütçede 0, %5 aşımda −10 puan. Günlük taşıyanda 2200 g üstü −10. Sayılar penalties.ts'te sabit. | Kullanıcı testlerinden sonra ayarlanacak. |
| 27 Eki 2026 | Üç öneri | En iyi eşleşme = sıralamada ilk. Fiyat/perf. = kalanlar içinde value alt skoru en yüksek olan. Biraz daha öde = kalanlar içinde en iyi eşleşmeden pahalı olanların en yüksek puanlısı. Üçü farklı laptop; uygun aday yoksa kart gösterilmez. | Aynı ürün iki kartta görünmesin. |
| 27 Eki 2026 | Sihirbaz kapsamı | MVP'de 5 soru: bütçe, kullanım, taşıma, ekran, işletim sistemi. "Oyunlar" sorusu yok, oyun profili yeterli. "Olmazsa olmazlar" sonraya kaldı. | Motorda karşılıkları ve OLED gibi veriler yok. |
| 29 Eki 2026 | Elle fiyat | Cron'a kadar fiyatlar stores.csv ve offers.csv ile elle seed'lenir. Pazar yerinde satıcı seller_name'e yazılır; boş = mağazanın kendisi. Linklerden takip parametreleri silinir. | Sonuç sayfası fiyatsız çalışamaz. |
| 29 Eki 2026 | Fiyat tazeliği | 48 saat kuralı MAX_OFFER_AGE_HOURS sabitiyle kodda durur, cron gelene kadar (6. hafta) uygulanmaz. | Elle girilen fiyatlar 2 günde düşerdi.
| 29 Eki 2026 | DB bağlantısı (site) | Vercel transaction pooler (6543) ve prepare: false kullanır; lokal ve seed session pooler (5432) ile kalır. Site DATABASE_URL'i apps/web/.env.local'dan okur. | Serverless'ta her istek yeni bağlantı açar; 9 Eki kararını site için günceller. |
| 29 Eki 2026 | Sonuç kartı | Ad, mağaza ve link motora girmez; recommend sonrası seçilen ≤3 id için ayrı sorguyla gelir. Kartta CPU, GPU ve RAM gösterilir. Boş sonuçta bütçeyi/seçimleri genişletme önerisi. | Motor mağazadan bağımsız kalır; aday sayısı büyüse de sorgu küçük kalır. |

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
