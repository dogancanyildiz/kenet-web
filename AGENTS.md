# Ajan kuralları

**Amaç:** Bu belge depoda çalışan her ajanın uyacağı kuralları tek kaynakta toplar.

**Kapsam:**

- Claude Code, Cursor, Codex ve öteki CLI ajanları.
- Proje, belge, kod, git, sürüm, gizlilik ve onay kuralları.
- `CLAUDE.md` yalnız bu dosyayı içe aktarır; ayrı kural taşımaz.

## Proje özeti

| Konu         | Değer                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ad           | kenet.app (depo `github.com/dogancanyildiz/kenet.app`; yerel klasör `kenet-web` kalabilir): tanıtım sitesi. Ürün Kenet'tir, deposu `github.com/dogancanyildiz/kenet`. |
| Yığın        | Next.js 16 App Router, React 19, next-intl, Tailwind 4, vitest. `output: standalone`.                                                                                 |
| Diller       | Türkçe kökte (`/`, `/gizlilik`, `/destek`), İngilizce `/en` altında (`/en`, `/en/privacy`, `/en/support`).                                                            |
| Sayfalar     | Ana sayfa, gizlilik politikası, destek. Mağaza kaydı `kenet.app/gizlilik` ve `kenet.app/destek` adreslerini ister; bu yollar değişmez.                                |
| Tasarım      | Şafak tasarım dili, kaynak `kenet/docs/design.md`. Site sistem görünümünü izler; tema anahtarı yoktur.                                                                |
| Barındırma   | Coolify, Dockerfile build pack, önde Traefik ve Cloudflare proxy. `main` dalından yayın.                                                                              |
| Kanonik host | `www.kenet.app`. `kenet.app` (apex) yolu koruyarak 301 ile www'ye gider (karar 2026-11-13).                                                                           |

## Başlangıç akışı

1. `docs/roadmap.md` içindeki **aktif aşamayı** oku; yalnız onun maddelerinde çalış.
2. Sayfa işine `docs/pages.md` ile başla: neyin nerede olduğu oradadır.
3. Görünüm için `docs/design.md` belgesine uy; belirteçler `src/app/globals.css` dosyasındadır.
4. Metin işinde `docs/product.md` içindeki vaat ve ilkeleri kaynak al; ürün hakkında yeni iddia üretme.
5. Gerekçe için `docs/decisions.md` belgesine bak.

## Çalışma kuralları

- Dil: Türkçe, doğal ve doğrudan. Uzun çizgi (em dash) hiçbir yerde kullanılmaz; virgül, iki
  nokta, parantez ya da kısa çizgi kullanılır. Kalıp giriş ve kapanış cümleleri, emoji ve
  başlık yığını yok. Kod yorumları ve commit gövdeleri İngilizce olabilir; kullanıcıya görünen
  metin iki dilde `messages/` altındadır.
- Commit ve PR'lar depo sahibi adına yazılır: `Co-Authored-By`, "Generated with" ya da başka bir
  yapay zeka imzası eklenmez.
- Commit mesajları Conventional Commits (`feat`, `fix`, `chore`, `docs`, `ci`, `test`); sürüm ve
  `CHANGELOG.md` bunlardan üretilir (`scripts/release-version.mjs`).
- Dallanma: `feature/*` → `dev` (squash) → `main` (merge commit). `main`'e doğrudan push yok.
  Sürüm çıkarma yalnız sahibinin talimatıyla yapılır.
- Sunucu adresi, parola ve anahtar hiçbir dosyaya yazılmaz; belgelerde `<ORIGIN_IPV4>` gibi yer
  tutucu kullanılır.

## Değişmez kurallar

| No  | Kural                                                                                                                                | Gerekçe                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1   | `/gizlilik`, `/destek`, `/en/privacy`, `/en/support` yolları değişmez.                                                               | Mağaza kaydı bu adresleri taşır.                                                   |
| 2   | Her sayfa iki dilde de vardır; `messages/en.json` ve `messages/tr.json` aynı anahtar kümesini taşır ve her anahtar kodda kullanılır. | `tests/i18n/messages.test.ts` kilitler.                                            |
| 3   | `src/app/[lang]/` altındaki her sayfa `setRequestLocale` çağırır ve statik üretilir.                                                 | Unutan sayfa sessizce statik üretimden düşer; `npm run verify:routes` yakalar.     |
| 4   | Renk yalnız `globals.css` belirteçlerinden gelir; bileşende hex yoktur. Metin rolleri 4,5:1, kontrol çizgisi 3:1 kontrast taşır.     | `tests/design/tokens.test.ts` ölçer. Kaynak: Şafak.                                |
| 5   | Site çerez kullanmaz, hesap açmaz, üçüncü taraf betik yüklemez.                                                                      | Ürün vaadi "veri kullanıcınındır" siteye de uygulanır. Ölçüm eklenirse önce karar. |
| 6   | Ürün hakkında metin `kenet/docs/product.md` ile çelişmez; var olmayan özellik yazılmaz.                                              | Mağaza sayfası ve site aynı ürünü anlatır.                                         |
| 7   | Güvenlik başlıkları ve CSP `next.config.ts` içinde kalır; `unsafe-eval` üretime girmez.                                              | `tests/deploy/security-headers.test.ts` kilitler.                                  |

## Kalite kapıları

Her PR'dan önce sırayla:

```bash
npm run lint
npm run typecheck
npm run test
NEXT_PUBLIC_SITE_URL=https://www.kenet.app npm run build
npm run verify:routes
npm run format
```

CI aynı adımları koşar, ardından Dockerfile'ı lint eder, imajı derler ve `/api/health` ile `/`
adreslerini yoklar. Tek yetkili CI'dır; ajan raporu doğrulama yerine geçmez.

## Serbest alanlar

| Alan               | Senin kararın                                                | Koşul                                                                       |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Bileşen yapısı     | Modül, adlandırma, yerleşim ayrıntısı                        | Yok                                                                         |
| Arayüz ayrıntıları | Boşluk, animasyonsuz geçişler, erişilebilirlik iyileştirmesi | `pages.md` taslaktır; daha iyisini görürsen uygula, nedenini PR'a yaz.      |
| Bağımlılık         | İşi belirgin iyileştiren paket                               | Gerekçesini PR'a yaz; betik ya da stil yükleyen üçüncü taraf yok (kural 5). |
| Test yaklaşımı     | Zorunlu testlerin ötesi                                      | Yok                                                                         |

Belgede hata ya da çelişki görürsen körü körüne uygulama: sorunu söyle, önerini yaz.
