# Coolify ve Cloudflare kurulumu

**Amaç:** Bu belge depoda olmayan panel adımlarını sırayla verir. Sunucu adresi ve sırlar yazılmaz; yer tutucu kullanılır.

## Ön koşul

- [x] `kenet.app` alındı; kanonik host `www.kenet.app` (karar 2026-11-13).
- [ ] Alan adı Cloudflare'a taşınır, proxied kipte.

## Coolify

1. Yeni kaynak: GitHub App ile `dogancanyildiz/kenet.app`, dal `main`, build pack **Dockerfile**.
2. Build değişkenleri: `NEXT_PUBLIC_SITE_URL=https://www.kenet.app`. `NEXT_PUBLIC_BUILD_SHA` ve `NEXT_PUBLIC_BUILD_DATE` boş bırakılır; Dockerfile `SOURCE_COMMIT` ve derleme saatine düşer.
3. Port 3000; sağlık kontrolü imajın kendi `HEALTHCHECK` komutudur (`/api/health`).
4. Alan adları `https://www.kenet.app,https://kenet.app`. "Redirect to www" açık, kalıcı (301).
5. Preview Deployments kapalı: tek geliştirici, her PR CI'dan geçer.
6. İlk yayın sonrası `curl -I https://www.kenet.app` ile `Strict-Transport-Security`, `Content-Security-Policy` ve `Cache-Control` başlıkları doğrulanır.

## Cloudflare

1. DNS: `kenet.app` A kaydı origin'e, `www` CNAME `kenet.app`'e; ikisi de proxied.
2. SSL/TLS: Full (strict). Always Use HTTPS açık.
3. `.app` üst alan adı HSTS preload listesindedir; tarayıcı https'i zaten zorlar. Uygulama katmanındaki HSTS başlığı kalır.
4. Cache: HTML için kural yok; uygulama `s-maxage=300` gönderir. `/_next/static/*` zaten `immutable`.
5. Bot ve WAF: varsayılan; site form taşımaz. **Bot Fight Mode ve meydan okuma kapalı kalır:** açılırsa Cloudflare `__cf_bm` ya da `cf_clearance` çerezi koyar ve gizlilik sayfasındaki "çerez kullanmaz" cümlesi yanlış olur.

## GitHub

1. Dal koruması `main` ve `dev` (2026-11-13): zorunlu kontroller `Quality checks`, `Docker image`, `CodeQL analysis`; adları değişmemeli. Birleştirme yalnız PR ile, yöneticiler de dahil; force push ve dal silme kapalı. Depoda squash ve merge commit açık, rebase kapalı; birleşen dal silinir.
2. Settings → Actions → General: "Allow GitHub Actions to create and approve pull requests" açık (release iş akışının sürüm eşitleme PR'ı için).
3. Dependabot güvenlik güncellemeleri açık.

## Canlı doğrulama

```bash
curl -sI https://www.kenet.app | grep -i -E "strict-transport|content-security|cache-control"
curl -s -o /dev/null -w '%{http_code}\n' https://www.kenet.app/gizlilik
curl -s -o /dev/null -w '%{http_code}\n' https://www.kenet.app/en/support
curl -s https://www.kenet.app/sitemap.xml | head -20
curl -s -o /dev/null -w '%{http_code}\n' https://www.kenet.app/olmayan-sayfa   # 404
```
