# Karar günlüğü

**Amaç:** Bu belge sitenin kararlarını tarih, karar ve gerekçe ile tutar. Değişen karar yeni satır alır; eski satır silinmez.

| Tarih | Karar | Gerekçe |
|---|---|---|
| 2026-11-10 | Yığın Next.js 16, next-intl, Tailwind 4, vitest; dogancanyildiz.com düzeni, kuralları, CI ve Dockerfile taşınır | Kullanıcı kararı. Bilinen düzen, hazır kalite kapıları; iki site aynı bakım ritmini paylaşır |
| 2026-11-10 | Barındırma Coolify, Dockerfile build pack, Traefik ve Cloudflare proxy; kişisel site ile aynı sunucu düzeni | Kullanıcı kararı. Mevcut panel ve runbook'lar kullanılır |
| 2026-11-10 | İlk kapsam: ana sayfa, `/gizlilik`, `/destek`; TR ve EN | Kullanıcı kararı. Mağaza kaydı (Kenet Aşama 12) bu iki adresi ister |
| 2026-11-10 | Kanonik host apex `kenet.app`; `www` yok | Mağaza kaydındaki adres kısa kalır; `.app` alan adları HSTS preload listesindedir, https zorunludur |
| 2026-11-10 | Türkçe kökte, İngilizce `/en` altında; dil tespiti ve çerez kapalı | Kişisel site ile aynı kural: URL tek sinyal, her sayfa önbelleğe alınabilir |
| 2026-11-10 | Yasal yollar `/gizlilik` ve `/destek`; iç rota adları `privacy` ve `support` | Kenet kararı 2026-10-21. next-intl `pathnames` eşler |
| 2026-11-10 | Şafak tasarım dili aynen; site sistem görünümünü izler, tema anahtarı yok; parıltı KA ve Saydamlığı Azalt'ta kapanır | Kenet design.md kuralları 3 ve "Parıltı" bölümü. Ürün ve site aynı görünür |
| 2026-11-10 | Yazı tipi yüklenmez; sistem yazı tipi yığını | Şafak kuralı 8 (yalnız sistem yazı tipi), CSP `font-src 'self'` sade kalır, sayfa hafif |
| 2026-11-10 | Site çerez kullanmaz, üçüncü taraf betik yüklemez; ölçüm yok | Ürün vaadi "veri kullanıcınındır". Çerezsiz Umami kişisel sitede var; buraya eklenmesi ayrı karar |
| 2026-11-10 | App Store bağlantısı `site.appStoreUrl` ile; null iken düğme pasif ve "Yakında" yazar | Ölü bağlantı yerine açık durum; mağaza yayınında tek satır değişir |
| 2026-11-10 | Destek kanalları: GitHub konuları ve geliştiricinin iletişim sayfası; e-posta adresi yok | Uygulama deposu açıktır. Bir `@kenet.app` adresi alan adı ve posta kurulumu bekler; kullanıcı kararı |
| 2026-11-10 | Lisans kararı açık; karar verilene kadar tüm hakları saklıdır, `LICENSE` dosyası yok | Uygulama "tüm hakları saklıdır"; site kodu için MIT seçeneği kullanıcıya bırakıldı |
| 2026-11-10 | `AGENTS.md` ve `CLAUDE.md` izlenir | Kenet düzeni: taze klon kuralları anında alır. `next dev` AGENTS.md başına kendi bloğunu ekler; blok commit'lenir |
| 2026-11-10 | Dallanma `feature/*` → `dev` → `main`; `release.yml` kişisel siteden aynen | Sürüm ve CHANGELOG otomatik; `main` yayın dalı |
| 2026-11-10 | Simge PNG'leri `sharp` ile üretilir ve commit'lenir | Derleme ortamında rasterleştirici gerekmez; `npm run icons` tek adım |
| 2026-11-10 | Gizlilik sayfası veri tablosu HTML tablo yerine liste ve tanım listesi (`ul > li > h3 + dl`) | İçerik tek kopya, telefonda alt alta ve geniş ekranda iki sütun; yatay kaydırma yok. Ekran okuyucu için satır başlığı h3 |
| 2026-11-10 | Site "çerez kullanmaz" der; Cloudflare Bot Fight Mode ve meydan okuma kapalı tutulur | Bu özellikler çerez koyar ve cümleyi yanlışlar; gerekirse önce politika değişir |
| 2026-11-10 | Bölüm başlıkları (h2) bütün sayfalarda küçük ikincil etiket: `text-sm font-medium text-text-secondary` | Şafak kuralı 2: bölüm başlığı kartın üstünde ve dışında, sessiz. Destek ve ana sayfa eşitlendi; gizlilik kart içi h2 taşır, inceleme turunda tutarlılığa bakılır |
