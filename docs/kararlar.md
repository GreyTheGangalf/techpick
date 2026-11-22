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
| 16 Kas 2026 | İlk veri | İlk 49 konfigürasyon girildi. 15-35k bandında güvenilir mağazada yeni ürün az, veri 35k+ ağırlıklı kalacak. Sihirbazın varsayılan bütçesi 30.000 TL. | 30k altı için 5 model yeterli. |
| 17 Kas 2026 | Kullanıcı verisi | Kullanıcıya ait veya kişiyi tanımlayan hiçbir veri tutulmaz: hesap, IP ve kullanıcı/oturum kimliği yok. click_events sadece konfigürasyon, mağaza ve zaman. Analitik çerezsiz. | KVKK yükünü sıfıra yakın tutmak. |
| 17 Kas 2026 | UI | Görsel katman (stil, bileşen düzeni) Claude’a yazdırılır; veri akışı (sorgular, server component, prop tipleri) benim. CLAUDE.md’ye istisna olarak eklenir. | Öğrenme hedefi motor ve veri; UI’da yaratıcılık koddan önemli. |
| 17 Kas 2026 | Fiyat cron’u | GitHub Actions ile günde 2 kez, JSON-LD’den okunur. Hata durumunda teklife dokunulmaz (checked_at güncellenmez), 48 saat kuralı eler. Amazon manuel. | Bayat fiyatı taze göstermemek; kazıma yasağı. |
| 18 Kas 2026 | Fiyat ayrıştırma | Fiyat string'inde hem `.` hem `,` varsa en sağdaki ondalıktır; tek ayırıcı tekrar ediyorsa ya da ardından tam 3 rakam geliyorsa binliktir. Hesap Decimal ile yapılır, sonuç kuruş (int) olarak döner; ayrıştırılamayan değer None olur, cron çökmez. | Mağazalar Türkçe ve İngilizce biçimi karışık kullanıyor; "noktaları/virgülleri sil" kuralı 42999.5'i bozuyordu. |
| 18 Kas 2026 | JSON-LD offer | offers listesinde ilk offer alınır; availability yoksa stokta değil sayılır; para birimi TRY değilse offer okunmaz. | Öne çıkan satıcı ilk sırada; stokta olmayanı önermek gizlemekten kötü. |
| 18 Kas 2026 | Cron şeması | offers.last_seen_at = son başarılı fiyat kontrolü (checked_at diye ayrı sütun yok). stores.fetch_method enum ('jsonld' / 'manual'), varsayılan 'manual'. price_history yalnızca fiyat değişince yazılır; offer silinemez. | Yeni mağaza açıkça işaretlenmeden taranmaz; geçmiş yanlışlıkla gitmez. |
| 18 Kas 2026 | Stok geçmişi | Tutulmaz; güncel stok offers.in_stock'ta. | MVP'de okuyan özellik yok. |
| 18 Kas 2026 | Manual offer tazeliği | Manual mağazalar da 48 saat kuralına uyar; fiyat elle doğrulanıp seed'lenince last_seen_at yenilenir. jsonld mağazaların fiyat ve last_seen_at alanlarının sahibi cron'dur, seed onlara dokunmaz. | Tek kural; yanlış fiyat fiyatsızlıktan kötü. |
| 18 Kas 2026 | Tarihçe başlangıcı | Offer'ın price_history'si boşsa cron ilk fiyatı başlangıç satırı olarak yazar; sonra yalnızca fiyat değişince yazılır. | "Bu fiyat ne zamandan beri böyle" sorusu ilk günden cevaplanabilsin. |
| 19 Kas 2026 | 403 veren mağazalar | Hepsiburada, Teknosa ve incehesap bot isteklerine 403 dönüyor; manual'a alındı. Tarayıcı taklidi yapılmaz; affiliate feed gelince cron'a dönerler. | Ürün kartı: fiyat yalnızca izin verilen kaynaklardan. |
| 20 Kas 2026 | Satıcı kontrolü | Cron sayfadaki satıcıyı offer'ın seller_name'iyle karşılaştırır (boş = mağazanın kendisi, harf duyarsız); uyuşmazsa offer'a dokunmaz. Yanlış girilmiş offer satırları elle silinebilir, eskiyenler silinmez. | Pazar yerinde öne çıkan satıcı değişince başka satıcının fiyatı yazılmasın. |
| 20 Kas 2026 | Fiyat cron'u canlı | GitHub Actions, 08:00 ve 20:00 (İstanbul). Cron: Trendyol, Game Garaj. MediaMarkt GitHub IP'lerini engellediği için manual. Proxy/IP gizleme yapılmaz. | Lokal çalışan ama sunucudan engellenen kaynak, izin verilen kaynak sayılmaz. |
| 20 Kas 2026 | Manual fiyat bakımı | Manual offer’lar ingest/verify.py ile elle doğrulanır. Tazelik süresi jsonld için 48 saat, manual için 7 gün; kartta kontrol tarihi gösterilir. 18 Kas kararını günceller. | Tarayıcı agent’ı engellenen otomatik erişimdir; 37 linki 2 günde bir kontrol etmek sürdürülemez.Stokta olmayanlar 14 günde bir kontrol edilir |
| 20 Kas 2026 | Seed ve fiyatlar | Seed yalnızca yeni offer ekler; mevcut offer’ın fiyatı, stoğu ve last_seen_at’i cron (jsonld) ya da verify.py (manual) tarafından yazılır, seed sadece URL’yi günceller. 18 Kas’taki “re-seed = elle doğrulama” kararını değiştirir. | Eski CSV fiyatı yeniden seed’lenince bayat fiyat taze görünürdü. |
| 21 Kas 2026 | Apple ve panel | MacBook'lar MVP'de, birkaç taban model. Apple GPU'nun Time Spy skoru yok; motor eksik GPU skorunu çökmeden ele alır. Oyun seçilince Mac elenmez, açıklama sonraya bırakıldı. Panel enum'unda TN var; ekran skorunda en düşük puanı alır. | Orta segment zaten 60-70 bin TL bandında; Mac oyun için önerilmez. |
| 21 Kas 2026 | Aile/variant adı değişimi | Eski satır silinmez; DB'de family_id/variant_name SQL ile güncellenir, sonra seed çalışır. 14 Eki'deki "elle silinir"i günceller. | Offer ve price_history id'ye bağlı. |
| 22 Kas 2026 | Ekran skoru | Panel puanı oled 100, ips 75, va 50, tn 20; bilinmeyen panel ips sayılır; aday küme içinde normalize edilir. 23 Eki'deki "herkese 100" kararını günceller. | Zayıf/güçlü yön metinleri göreli; mutlak skor herkes IPS iken ekranı yanlışlıkla zayıf yön yapardı. |
| 22 Kas 2026 | Bilinmeyen GPU | Time Spy skoru olmayan GPU (Apple): oyun seçilmediyse GPU ağırlığı o aday için hesaptan çıkar, seçildiyse 0 sayılır; value yalnızca CPU'dan. Kural veriye (timespy null) bakar, işletim sistemine değil. | Creative Mac haksız ceza yemesin; oyunda elemeden alta düşsün. |

## Açık işler

- [ ] techpick.com.tr alan adını kaydet (ucuz, şimdi alınabilir)
- [ ] Affiliate geliri için vergi durumunu bir mali müşavire sor (ilk ödemeden önce)
- [ ] Teknosa Paylaş Kazan'a katıl; Gelir Ortakları ve Admitad'a yayıncı olarak kaydol (hafta 7-8)
- [ ] 23 Kas: verify.py ile ilk manual kontrol

## Şu anki hafta

Hafta 1 (28 Eyl - 4 Eki):
- [x] Yeni repo
- [x] Şema + migration'lar
- [x] Supabase kurulumu
- [x] Boş site Vercel'de

Hafta 2 (5-11 Eki, gecikmeli): cpus/gpus benchmark tablosu, ilk 50 konfigürasyon (elle seçilecek)
