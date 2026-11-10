# kenet-web

[![CI](https://github.com/dogancanyildiz/kenet-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/dogancanyildiz/kenet-web/actions/workflows/ci.yml)

**Amaç:** README depoya giriş noktasıdır: siteyi, durumu, kurulumu ve belge haritasını tek sayfada verir.

**Kapsam:**

- Site özeti, durum, yığın
- Kurulum, betikler, ortam değişkenleri
- Belge haritası, dağıtım, lisans

## Site özeti

| Konu       | Bilgi                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Alan adı   | `kenet.app`; alınamazsa `kenetapp.com` (Kenet kararı 2026-10-21)                                                                 |
| Ürün       | Kenet: kişiler, konumlar ve olaylar üzerine kurulu kişisel günlük; iPhone, iPad ve Mac. Deposu `github.com/dogancanyildiz/kenet` |
| Sayfalar   | `/` ana sayfa, `/gizlilik`, `/destek`; İngilizce `/en`, `/en/privacy`, `/en/support`                                             |
| Yığın      | Next.js 16 App Router, React 19, next-intl, Tailwind 4, vitest; `output: standalone`                                             |
| Tasarım    | Şafak tasarım dili, kaynağı `kenet/docs/design.md`; site sistem görünümünü izler                                                 |
| Barındırma | Coolify, Dockerfile build pack, Traefik ve Cloudflare arkasında                                                                  |

## Proje durumu

**Tablo, 2026-11-10 tarihindeki durumu verir.**

| Konu  | Durum                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Aşama | 1: iskelet. Rotalar, iki dil, belirteçler, güvenlik başlıkları, CI ve Dockerfile hazır.                                                  |
| Açık  | Ana sayfa metni ve görselleri, gizlilik politikası metni, destek sayfası ayrıntısı, Coolify ve Cloudflare kurulumu, App Store bağlantısı |
| Sürüm | Yok; ilk sürüm `main`'e ilk birleştirmede `release.yml` ile kesilir                                                                      |

Ayrıntı `docs/roadmap.md` belgesindedir.

## Kurulum

```bash
nvm use            # Node 24, .nvmrc
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` yedeksizdir: yoksa `npm run build` düşer, çünkü sessiz bir yedek
`robots.txt` ve `sitemap.xml` dosyalarına yanlış host yazardı.

## Betikler

| Betik                   | Ne yapar                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm run dev`           | Geliştirme sunucusu                                                                                           |
| `npm run build`         | Üretim derlemesi, `.next/standalone`                                                                          |
| `npm run start`         | Üretim derlemesini sunar                                                                                      |
| `npm run lint`          | ESLint, tip duyarlı kurallar, uyarı sıfır                                                                     |
| `npm run typecheck`     | `tsc --noEmit`                                                                                                |
| `npm test`              | vitest; CI `--coverage` ekler                                                                                 |
| `npm run format`        | Prettier denetimi; `format:write` yazar                                                                       |
| `npm run verify:routes` | Derlemeden sonra her sayfanın iki dilde prerender edildiğini ve `/api` rotalarının dinamik kaldığını doğrular |
| `npm run icons`         | `src/app/icon.svg` dosyasından `icon.png` ve `apple-icon.png` üretir; simge değişince çalıştırılır            |
| `npm run release:check` | `main`'e sonraki birleştirmenin keseceği sürümü basar, hiçbir şey yazmaz                                      |

## Ortam değişkenleri

| Değişken                 | Coolify katmanı | Zorunlu | Not                                                                                                              |
| ------------------------ | --------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | Build           | Evet    | `https://kenet.app`. `next build` istemci paketine gömer.                                                        |
| `NEXT_PUBLIC_BUILD_SHA`  | Build           | Hayır   | Altbilgideki commit. CI `github.sha` geçer; Coolify'da boş bırakılır, Dockerfile `SOURCE_COMMIT` değerine düşer. |
| `NEXT_PUBLIC_BUILD_DATE` | Build           | Hayır   | ISO derleme zamanı; boşsa derleme anındaki UTC.                                                                  |

Site çerez kullanmaz, hesap açmaz ve üçüncü taraf betik yüklemez. Ölçüm eklenmesi ayrı bir karardır.

## Belge haritası

| Belge                    | Konu                                                |
| ------------------------ | --------------------------------------------------- |
| `AGENTS.md`              | Ajan kuralları, değişmez kurallar, kalite kapıları  |
| `docs/roadmap.md`        | Aşamalar ve aktif aşama                             |
| `docs/product.md`        | Sitenin anlattığı ürün, hedef kitle, sayfa amaçları |
| `docs/pages.md`          | Sayfa sayfa içerik ve yerleşim                      |
| `docs/design.md`         | Şafak'ın web uyarlaması, belirteçler, kurallar      |
| `docs/decisions.md`      | Karar günlüğü                                       |
| `docs/deploy/coolify.md` | Coolify ve Cloudflare kurulum adımları              |

## Dağıtım

Coolify bu depoyu GitHub App ile izler ve `main`'e her push'ta Dockerfile build pack ile derler.
İmaj `.next/standalone` içinden `node server.js` çalıştırır; sağlık kontrolü `/api/health`.
Yerel doğrulama:

```bash
docker compose up --build -d
curl -s http://127.0.0.1:3000/api/health
docker compose down
```

Dallanma `feature/*` → `dev` → `main`. `main`'e her birleştirme `release.yml` ile Conventional
Commits'ten sürüm türetir, etiket ve GitHub Release üretir, sürüm eşitleme PR'ını `dev`'e açar.

## Lisans

Site kodu ve metinleri için lisans kararı açıktır (`docs/decisions.md`). Karar verilene kadar tüm
hakları saklıdır. Kenet uygulamasının lisansı kendi deposundadır.
