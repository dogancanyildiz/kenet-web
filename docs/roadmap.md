# Yol haritası

**Amaç:** Bu belge sitenin aşamalarını, aktif aşamayı ve her aşamanın çıkış ölçütünü verir.

## Aktif aşama

**Aşama 2: Sayfalar.** Aşama 1 2026-11-10'da bitti.

## Aşamalar

| No | Aşama | Durum | Çıkış ölçütü |
|---|---|---|---|
| 1 | İskelet | Bitti, 2026-11-10 | Üç sayfa iki dilde statik üretilir; CI, Dockerfile, güvenlik başlıkları ve belirteç testleri yeşil |
| 2 | Sayfalar | Aktif | Ana sayfa, gizlilik ve destek metinleri iki dilde tamam; Opus incelemesi orta ve üstü bulgu bırakmadı |
| 3 | Yayın | Açık | `kenet.app` Coolify'da yayında, TLS ve başlıklar canlıda doğrulandı, mağaza kaydı adresleri çalışıyor |
| 4 | Mağaza sonrası | Açık | App Store bağlantısı, ekran görüntüleri, sürüm notları sayfası |

## Aşama 1: İskelet

- [x] Next.js 16, next-intl, Tailwind 4, vitest; dogancanyildiz.com düzeni
- [x] Rotalar: `/`, `/gizlilik`, `/destek` ve `/en` karşılıkları; `global-not-found`
- [x] Şafak belirteçleri dört varyantta; kontrast testi
- [x] Güvenlik başlıkları ve CSP; önbellek politikası
- [x] CI (kalite ve Docker işleri), CodeQL, Dependabot, release iş akışı
- [x] Uygulama simgesi SVG ve PNG türevleri

## Aşama 2: Sayfalar

| Madde | Durum | Kanıt |
|---|---|---|
| Ana sayfa metni ve bölümleri | Açık; iskelet metin var | - |
| Gizlilik politikası | Açık; yer tutucu | Kaynak: `kenet/docs/product.md` vaatler, uygulamanın eriştiği veriler (takvim, konum, bildirim, iCloud) |
| Destek sayfası | Açık; iki kanal var | GitHub konuları ve geliştirici iletişimi; e-posta adresi kullanıcı kararı |
| Görsel doğrulama | Açık | Açık ve koyu modda, Kontrastı Artır açıkken ekran görüntüsü |

- [ ] Ana sayfa: vaat cümlesi, üç vaat, nasıl çalışır, platformlar, App Store yer tutucu
- [ ] Gizlilik: uygulamanın hangi veriye hangi amaçla eriştiği, nereye yazdığı, neyi toplamadığı; sitenin kendisi için çerezsiz bildirim; iletişim
- [ ] Destek: kanal, hata bildirirken verilecek bilgi, sık sorulanlar (kasa nerede, Obsidian ile açılır mı, veri nasıl taşınır)
- [ ] İki dilde dil ve tutarlılık turu

**Çıkış ölçütü:** Üç sayfa iki dilde yayına hazır; CI yeşil; Opus incelemesi orta ve üstü bulgu bırakmadı.

## Aşama 3: Yayın

- [ ] Alan adı alınır (kullanıcı), Cloudflare'a taşınır
- [ ] Coolify kaynağı: GitHub App, Dockerfile build pack, `NEXT_PUBLIC_SITE_URL` build değişkeni, sağlık kontrolü
- [ ] Cloudflare: DNS, SSL Full (strict), `www` yok
- [ ] Canlı doğrulama: başlıklar, hreflang, sitemap, 404
- [ ] Dal koruması: `main` ve `dev` için zorunlu kontroller `Quality checks`, `Docker image`, `CodeQL analysis`

## Sonraki fikirler

Ekran görüntüleri galerisi, sürüm notları, basın kiti, OG görseli, çerezsiz ölçüm (ayrı karar).
