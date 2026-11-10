# Yol haritası

**Amaç:** Bu belge sitenin aşamalarını, aktif aşamayı ve her aşamanın çıkış ölçütünü verir.

## Aktif aşama

**Aşama 3: Yayın.** Aşama 1 ve 2 2026-11-10'da bitti; Aşama 2'nin görsel doğrulaması kullanıcıda.

## Aşamalar

| No | Aşama | Durum | Çıkış ölçütü |
|---|---|---|---|
| 1 | İskelet | Bitti, 2026-11-10 | Üç sayfa iki dilde statik üretilir; CI, Dockerfile, güvenlik başlıkları ve belirteç testleri yeşil |
| 2 | Sayfalar | Bitti, 2026-11-10 | Ana sayfa, gizlilik ve destek metinleri iki dilde tamam (PR #1, #4, #7); iki Opus turu, orta bulgular düzeltildi |
| 3 | Yayın | Aktif | `kenet.app` Coolify'da yayında, TLS ve başlıklar canlıda doğrulandı, mağaza kaydı adresleri çalışıyor |
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
| Ana sayfa metni ve bölümleri | Bitti | PR #1: beş bölüm, künye satırı, 46 test |
| Gizlilik politikası | Bitti | PR #7: 10 satırlı veri erişim listesi, her satır Kenet kodundan kanıtlı; kanıt tablosu PR açıklamasında |
| Destek sayfası | Bitti | PR #4: kanallar, hata bildirirken, dört SSS |
| İnceleme | Bitti | Opus iki tur: 0 yüksek; 6 orta ve 25 düşük düzeltildi ya da ürün sorusu olarak PR gövdesine yazıldı |
| Görsel doğrulama | Kullanıcıda | Açık ve koyu modda, Kontrastı Artır açıkken bakılacak; tarayıcı aracı yok |

Ürün sahibine kalan sorular (PR #7 ve #4 gövdelerinde): erişim günlüğü saklama süresi, Apple'ın kendi tanılama paylaşımının anılması, "uygulama silinse de dosyalar kalır" vaadinin iOS yerel kasasıyla çelişkisi, günlük önerileri ilk sürümde kapalıysa 10. satır, Mac sürümünde yeniden gözden geçirme, künyedeki "6 ilke" sayısının sayfada karşılığı olmaması.

**Çıkış ölçütü:** Üç sayfa iki dilde yayına hazır; CI yeşil; Opus incelemesi orta ve üstü bulgu bırakmadı. Sağlandı.

## Aşama 3: Yayın

- [ ] Alan adı alınır (kullanıcı), Cloudflare'a taşınır
- [ ] Coolify kaynağı: GitHub App, Dockerfile build pack, `NEXT_PUBLIC_SITE_URL` build değişkeni, sağlık kontrolü
- [ ] Cloudflare: DNS, SSL Full (strict), `www` yok
- [ ] Canlı doğrulama: başlıklar, hreflang, sitemap, 404
- [ ] Dal koruması: `main` ve `dev` için zorunlu kontroller `Quality checks`, `Docker image`, `CodeQL analysis`

## Sonraki fikirler

Ekran görüntüleri galerisi, sürüm notları, basın kiti, OG görseli, çerezsiz ölçüm (ayrı karar).
