# TechPick — Ürün Kartı

Son güncelleme: 26 Eylül 2026. Bu, 24 Eylül tarihli "Fikir ve İlerleme Dokümanı"nın kısa hâlidir. Affiliate, vergi, alan adı ve marka araştırmaları o belgede duruyor; MVP yayınlanana kadar onlara dönülmüyor.

## Özet

TechPick, teknik bilgisi olmayan kullanıcıya ihtiyacını sorup Türkiye'de satılan laptoplar arasından en uygun 3 tanesini gerekçesi ve güncel fiyatıyla öneren bir site.

- **Değer önerisi:** "Ne için kullanacaksın, bütçen ne?" sorusundan 2 dakikada güvenilir, açıklamalı bir öneriye.
- **Konumlanma:** Laptop bilmeyenlerin laptop danışmanı. Akakçe/Cimri fiyat karşılaştırır, Epey özellik listeler; TechPick ihtiyaçtan öneriye giden boşluğu doldurur.
- **Hedef:** MVP 29 Kasım 2026 civarında yayında; 2027 bahar dönemi sonuna kadar gerçek kullanıcısı olan, portfolyoda gösterilebilir bir ürün.
- **Geliştirici:** Tek kişi, son sınıf CS öğrencisi, haftada 10-15 saat. Kapsam buna göre dar.

**Hedef kullanıcılar:** üniversiteye başlayan öğrenci, yazılım öğrencisi, oyuncu, tasarım/video üreticisi, ofis çalışanı. Asıl soru bir özellik listesi değil, bir cümle: *"35 bin TL'm var, yazılım okuyacağım, arada oyun oynarım, ne alayım?"*

## MVP kapsamı

Akış: Ana sayfa → Sihirbaz (6-7 soru) → Sonuç (3 öneri + gerekçe) → Ürün detay (mağaza fiyatları) → Mağazaya yönlendirme. Sonuç sayfasından kriter değiştirilebilir.

| MVP'de var | MVP'de yok |
|---|---|
| Sihirbaz + 3 öneri + "neden bu" açıklaması | Kullanıcı hesabı, favoriler, fiyat alarmı |
| 150-300 laptop konfigürasyonu (MacBook dahil, ~15-20) | Yapay zekâ sohbet modu (Faz 2) |
| Mağaza bazında fiyat, düz link | Kulaklık, monitör, telefon, PC toplama |
| Ürün detay ve 2-3 ürün karşılaştırma | İngilizce, yorum/puan sistemi |
| SEO liste sayfaları, mobil uyumlu Türkçe arayüz | |

**Sihirbaz soruları:** bütçe (kaydırıcı), kullanım amacı (çoklu seçim), oyunlar (hafif/ağır), taşıma sıklığı, ekran boyutu, işletim sistemi, olmazsa olmazlar (opsiyonel: marka, OLED, Linux uyumu).

## Öneri motoru

Deterministik ve açıklanabilir. Yapay zekâ ürün seçmez; Faz 2'de sadece serbest metni kritere çevirir.

1. **Kesin filtreler:** fiyat ≤ bütçe × 1,05, stokta, işletim sistemi, ekran boyutu, olmazsa olmazlar.
2. **Alt skorlar (0-100, aday küme içinde normalize):** CPU (Cinebench/Geekbench), GPU (model + TGP → 3DMark Time Spy), bellek, ekran, taşınabilirlik (kg, Wh), fiyat/performans.
3. **Profil ağırlıkları:** birden fazla profil seçilirse ortalama alınır. Skor = Σ ağırlık × alt skor − ceza (bütçe aşımı; taşınabilirlik önemliyken 2,2 kg üstü).
4. **Çeşitlilik:** aynı modelin varyantları tekrar etmez. Çıktı: "En iyi eşleşme", "En iyi fiyat/performans", "Biraz daha öde, çok daha iyisini al".
5. **Açıklama:** en çok katkı veren 2-3 alt skor şablon cümleye döner; zayıf yön de söylenir.

| Profil | CPU | GPU | Bellek | Ekran | Taşınabilirlik | Fiyat/perf. |
|---|---|---|---|---|---|---|
| Öğrenci / ofis | 15 | 5 | 15 | 15 | 30 | 20 |
| Yazılım | 30 | 5 | 25 | 15 | 15 | 10 |
| Oyun | 15 | 45 | 10 | 15 | 0 | 15 |
| Tasarım / video | 25 | 25 | 15 | 25 | 0 | 10 |

Ağırlıklar başlangıç tahmini; 20-30 gerçek senaryoluk test setiyle ayarlanacak.

## Veri

En büyük risk veri. Üç katman: model ailesi → konfigürasyon (öneri burada) → mağaza ilanı (fiyat burada). İlanlar konfigürasyonlara MPN ile, olmazsa elle onayla eşleştirilir.

| Veri | Kaynak | Güncelleme |
|---|---|---|
| Özellikler | Üretici ve mağaza sayfaları, yarı-manuel admin paneli | Yeni model geldikçe |
| Benchmark (CPU/GPU) | Kamuya açık tablolardan elle derlenmiş ~150 satır | Ayda bir |
| Fiyat ve stok | Affiliate feed'leri ve izin verilen kaynaklar | Günde 1-2 (cron) |

Epey'den çekilen veri yalnızca "pazarda hangi modeller var" listesi için kullanılır, yayına çıkmaz.

## Teknik mimari

Next.js (App Router) + TypeScript + shadcn/ui + Tailwind, Supabase PostgreSQL, Drizzle ORM, Python veri toplayıcı (GitHub Actions cron), Vercel, Vercel Analytics veya Umami. Öneri motoru TypeScript'te, birim testleriyle.

Repo yapısı (temiz, yeni monorepo): `apps/web`, `packages/engine`, `ingest/`, `db/`.

Tablolar: `model_families`, `configurations`, `cpus`, `gpus`, `stores`, `offers`, `price_history`, `click_events`.

## Yol haritası

| Hafta | Tarih | Kilometre taşı |
|---|---|---|
| 1 | 28 Eyl - 4 Eki | Yeni repo, şema + migration'lar, Supabase, boş site Vercel'de |
| 2 | 5 - 11 Eki | cpus/gpus benchmark tablosu, ilk 50 konfigürasyon |
| 3 | 12 - 18 Eki | Öneri motoru + birim testleri, 20 senaryoluk test seti |
| 4 | 19 - 25 Eki | Sihirbaz ve sonuç sayfası, açıklama şablonları |
| 5 | 26 Eki - 1 Kas | Ürün detay + karşılaştırma |
| 6 | 2 - 8 Kas | Fiyat güncelleme cron'u, offers + price_history, admin paneli |
| 7 | 9 - 15 Kas | 150+ konfigürasyon, 10 kişiyle kullanıcı testi, ağırlık ayarı |
| 8 | 16 - 22 Kas | SEO sayfaları, analitik, KVKK ve affiliate metinleri, affiliate başvuruları |
| 9 | 23 - 29 Kas | Hata düzeltme, alan adı, MVP yayını |

Sonrası: **Faz 2** (Aralık-Şubat) yapay zekâ sohbet modu (serbest metin → sihirbaz kriterleri), fiyat alarmı, 300+ konfigürasyon. **Faz 3** (bahar) kulaklık ve monitör.

## MVP başarı metrikleri (ilk 30 gün)

Sihirbazı tamamlama %60+, sonuçtan mağazaya tıklama %25+, test kullanıcılarında "bu öneriye güvenirim" 10 kişiden 7+, 24 saatten eski fiyat oranı %10 altı, aylık 1.000+ ziyaretçi.

## Güven ilkeleri

- Sıralama komisyondan bağımsız; motor mağaza bilgisini puanlamada kullanmaz.
- Affiliate ilişkisi her sonuç sayfasında belirtilir.
- Her öneride zayıf yön yazılır.
- "Nasıl puanlıyoruz" sayfası ağırlık tablosunu açıkça gösterir.
