# Tasarım dili: Şafak, web uyarlaması

**Amaç:** Bu belge Kenet'in Şafak tasarım dilinin siteye nasıl uygulandığını tanımlar. Kaynak `kenet/docs/design.md` belgesidir; değer çelişirse kaynak kazanır.

## Yön

| Öğe | Tanım |
|---|---|
| Zemin | Nötr gri: koyu `#0E0F11`, açık `#F3F3F6`. Site sistem görünümünü izler; tema anahtarı yoktur. |
| Parıltı | Sol üstten yayılan iki tonlu ışık: mürdüm (`--glow-a` #8E3F80) ve kehribar yankısı (`--glow-b` #C98B2F), oranlar Kenet `design.md` "Parıltı" bölümünden (koyuda %45 ve %28, açıkta %16 ve %16). `body` zemininde sabit 900 px yükseklikte (`background-size`), içerikle kayar, cam değildir. Kontrastı Artır ve Saydamlığı Azalt açıkken kapanır; `tests/design/compiled-css.test.ts` kilitler. |
| Yüzey | Her bölüm bir karttır: 20 px köşe, ince `rule` sınır, gölge yok. Kart içinde kart yoktur. |
| Yazı | Sistem yazı tipi: Apple'da SF Pro, ötekilerde sistem. Site yazı tipi yüklemez. |
| Eylem | Tek vurgu rengi: mürdüm. Parıltı eylem değildir. |

## Belirteçler

Kaynağı `src/app/globals.css`. Her renk belirtecinin dört varyantı vardır: açık, koyu ve ikisinin Kontrastı Artır (`prefers-contrast: more`) karşılığı. Tailwind sınıfları `text-text`, `text-text-secondary`, `bg-surface`, `bg-well`, `border-rule`, `text-accent`, `bg-accent`, `text-on-accent` biçimindedir.

| Rol | Belirteç | Kullanım |
|---|---|---|
| Zemin | `paper` | Sayfa |
| Yükseltilmiş zemin | `elevated` | Menü, açılır öğe (şimdilik kullanılmaz) |
| Kart | `surface` | Bölüm kartı |
| İç alan | `well` | Pasif düğme, hover zemini |
| Süs çizgisi | `rule` | Kart sınırı, satır ayracı; bilgi taşımaz |
| Güçlü çizgi | `line` | Pasif düğme sınırı |
| Kontrol çizgisi | `control` | Metin dışı denetim sınırı; 3:1 |
| Metin | `text` | Başlık, gövde |
| İkincil metin | `text-secondary` | Üst satır, açıklama, alt bilgi |
| Üçüncül metin | `text-tertiary` | Derleme bilgisi gibi yan bilgi |
| Vurgu | `accent` | Birincil düğme dolgusu, odak çerçevesi, bağlantı alt çizgisi, numaralar |
| Vurgu üstü | `on-accent` | Vurgu dolgusundaki yazı |
| Vurgu tonu | `accent-soft` | Seçim |
| Kişi, konum | `person`, `place` | `.link-person` düz ve `.link-place` noktalı alt çizgi (1,5 px, 3 px uzaklık), metin rengi değişmez; ana sayfa mekanizma kartı |
| Uyarı, tehlike | `warning`, `danger` | Sitede kullanılmaz; uygulama ile aynı kalır |
| Cihaz çerçevesi | `device-bezel`, `device-shadow` | Telefon çerçevesi (#000 iki modda) ve tek yumuşak gölge |

Kontrast alt sınırları: metin rolleri 4,5:1, kontrol çizgisi 3:1; `tests/design/tokens.test.ts` dört varyantta zemin, kart ve iç alan üstünde ölçer.

## Kurallar

| No | Kural |
|---|---|
| 1 | Bileşende hex renk yoktur; renk belirteçten gelir. |
| 2 | Bağlantı metni metin rengindedir, anlamı alt çizgi taşır (`.prose-link`). Gezinme bağlantıları ikincil metin renginde, hover'da `well` zemin. |
| 3 | Durumu yalnız renk anlatmaz: pasif mağaza düğmesi "Yakında" yazar ve `aria-disabled` taşır. |
| 4 | Dokunma hedefleri en az 44 px (`min-h-11`). |
| 5 | Hareket yoktur: parıltı durağan, geçiş animasyonu yok. |
| 5a | Ürün görseli yalnız gerçek ekran görüntüsüdür (Kenet snapshot testleri); stok görsel, illüstrasyon, eğik ya da filtreli ekran yok. Görseller `scripts/optimize-screens.mjs` ile WebP'ye çevrilir. |
| 5b | Görsel doğrulama `scripts/screenshot.mjs` ile yapılır (yerel Chrome headless): 375/640/768/1280 px, açık ve koyu, Kontrastı Artır, Saydamlığı Azalt; yatay taşma sıfır. |
| 6 | Künye cümlesi sayıyı öne çıkarır: sayı metin renginde yarı kalın, bağlaç ikincil renkte (ana sayfa metni bu kalıbı kullanabilir). |
| 7 | Açık ve koyu modda yerleşim aynıdır. |
| 8 | Ritim: `PageSection` bandı 48/64/80 px (telefon, `sm`, `lg`); bölüm başlığı ile içerik arası 24 px (`mt-6`). Alt bilgi son bandın hemen altında başlar (`mt-8`). |
| 9 | Satır kırma: h1-h3 `text-wrap: balance`, paragraf `pretty`. Akan metin en çok 68 karakter (`.measure`): sayfa girişi, SSS cevabı, 404 açıklaması. |
| 10 | Etiket: bölüm etiketi, sayfa üst satırı ve sütun başlığı tek sınıftır (`.eyebrow`, 13 px orta ağırlık, ikincil metin). |
| 11 | Gezinme bağlantısı `.nav-link`: ikincil metin, hover'da metin rengi (üst bilgide ayrıca `well` zemin). Geçerli sayfa `aria-current` taşır, metin renginde kalır ve 2 px vurgu alt çizgisi alır; durum yalnız renkle anlatılmaz. |
| 12 | Siteden çıkan bağlantı sağında 16 px eğik ok (`IconArrowUpRight`, `aria-hidden`) taşır; aynı sekmede açılır, `target` yoktur. |
| 13 | Açılır satır (`details.disclosure`): yerel işaret gizlenir, sağda chevron açıkken 180° döner, geçiş yoktur. Bütün satır hedeftir, hover'da `well`, odak çerçevesi satırın içinde. |
| 14 | Zorlanmış renkler (Windows Yüksek Karşıtlık): parıltı kalkar, kart ve üst bilgi sınırı `CanvasText`, odak ve geçerli sayfa çizgisi `Highlight`. `globals.css` sonunda katmansız blok. |

## Bileşenler

| Bileşen | Dosya | Not |
|---|---|---|
| Kabuk bandı | `components/layout/page-section.tsx` | Dikey bant, `page-shell` ile ortalanır (en çok 64 rem) |
| Sayfa başlığı | `components/layout/page-header.tsx` | h1 40/48 px ve bir paragraf |
| Bölüm başlığı | `components/layout/section-heading.tsx` | Etiket `p` (13 px ikincil) ve cümle `h2` (28–30 px); bütün sayfalarda |
| Telefon çerçevesi | `components/home/device-frame.tsx` | 390:844 iç oran, 44/54 px köşe, 8 px `device-bezel`; açık ve koyu görsel `picture` ile |
| Mac penceresi | `components/home/window-frame.tsx` | 14 px köşe, `line` sınır, 28 px başlık şeridi ve üç boş daire |
| Üst bilgi | `components/layout/header.tsx` | 68 px satır: marka; sağda iki ayrı yer işareti, sayfalar (`nav-links.tsx`) ve dil |
| Sayfa bağlantıları | `components/layout/nav-links.tsx` | İstemci bileşeni yalnız `usePathname` için; geçerli sayfaya `aria-current="page"` |
| Dil değiştirici | `components/layout/language-switcher.tsx` | TR ve EN (ince dikey ayraçla), Türkçe önce; kod ekranda, dilin kendi adı ekran okuyucuda (`a11y.localeTr`, `a11y.localeEn`); etkin dil `aria-current="true"`. 640 px altında yalnız öteki dil görünür (satır 320 px'e sığsın diye) |
| Sayfa başlığı ek satırı | `components/layout/page-header.tsx` `meta` | Lead altında 14 px üçüncül metin (gizlilikte son güncelleme) |
| Sayfa içi dizin | `components/privacy/privacy-toc.tsx` | "Bu sayfada": düz çapa listesi, solda `rule` çizgisi, hover'da `control`; `lg` ve üstünde yapışkan sol sütun. Betik ve kaydırma izleme yok |
| Alt bilgi | `components/layout/footer.tsx` | Solda marka ve geliştirici cümlesi (ad cümle içi bağlantı), sağda iki sütun: Sayfalar, Proje (kaynak kodu, hata bildir, geliştiricinin sitesi). Alt şeritte telif ve derleme damgası (mono, üçüncül) |
| Kapanış bandı | `components/home/closing.tsx` | Kart yok; üstte `rule`, solda cümle ve not, sağda mağaza düğmesi |
| Satır içi simgeler | `components/ui/icons.tsx` | Eğik ok ve chevron; 1,5 çizgi, `currentColor` |
| Marka işareti | `components/brand/brand-mark.tsx` | Uygulama simgesinin iki şeridi; mürekkep `currentColor`, vurgu `accent` |
| Mağaza düğmesi | `components/store-badge.tsx` | Bağlantı yoksa pasif |

## Simge

`src/app/icon.svg` uygulamanın `app-icon.svg` dosyasının kopyasıdır; `npm run icons` PNG türevlerini üretir. Simge değişince önce uygulama deposunda değişir, sonra buraya kopyalanır.
