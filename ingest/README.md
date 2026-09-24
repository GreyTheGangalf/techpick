# ingest

Fiyat ve stok toplama işleri (Python). GitHub Actions cron ile günde 1-2 kez çalışacak ve `offers` / `price_history` tablolarını güncelleyecek.

Henüz iş yok; 6. haftada eklenecek. Kurallar:

- Kaynak önceliği: affiliate ürün feed'leri > izin verilen sayfalar. Her kaynak için önce robots.txt ve kullanım koşullarına bak.
- Koruma aşan araçlar (`cloudscraper` vb.) kullanılmaz. Epey verisi yayında kullanılmaz; bkz. fikir dokümanı > Veri stratejisi.
- Mağaza ilanı, konfigürasyona önce MPN ile eşleştirilir; eşleşmeyenler manuel onay kuyruğuna düşer.
- 48 saatten eski teklifler sitede gösterilmez.

Eski prototipteki Epey scraper'ı (`GreyTheGangalf/TechPick-AI-Agent`) sadece referans; buraya taşınmadı.
