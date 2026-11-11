# Sayfalar

**Amaç:** Bu belge her sayfada neyin nerede olduğunu tarif eder. Nasıl göründüğü `design.md` belgesindedir.

## Kabuk

| Öğe | Yer | Davranış |
|---|---|---|
| İçeriğe geç bağlantısı | Belgenin ilk odaklanabilir öğesi | Odaklanınca görünür |
| Üst bilgi | Sabit (sticky), 68 px, `paper` %85 ve bulanıklık; Saydamlığı Azalt'ta opak. Marka işareti 24 px ve "Kenet"; Gizlilik, Destek ve TR ve EN (ince dikey ayraçla) sağda, 44 px | Geçerli sayfa ve dil vurgu alt çizgisi taşır (`aria-current`). Dil bağlantısı aynı sayfanın öteki dilini açar; iki dil her genişlikte görünür, 380 px altında marka adı gizlenir. `scroll-padding-top` üst bilgi kadar |
| Ana içerik | `main#main` | Odak hedefidir |
| Alt bilgi | Marka ve "Kenet, Doğan Can YILDIZ tarafından geliştirilir." (ad bağlantı); Sayfalar ve Proje sütunları; alt şeritte telif aralığı ve derleme bilgisi | Derleme bilgisi değişken boşsa gizlenir; dış bağlantılar eğik ok taşır |

## Ana sayfa `/`

Şablon düzeni (üst satır, başlık, üç eşit kart, numaralı liste) 2026-11-10'da kaldırıldı; sayfa ürünü
anlatmak yerine gösterir. Bölüm başlığı kalıbı: küçük etiket `p` ve altında cümle `h2` (`SectionHeading`).

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Hero | Solda h1 vaat cümlesi (40/48/56 px), bir cümle lead, mağaza düğmesi ve yanında "iPhone, iPad ve Mac"; sağda `DeviceFrame` içinde gerçek Bugün ekranı (açık ve koyu çift, `picture` ile tek indirme, preload). Mobilde telefon altta, üst 340 px görünür ve zemine solar. Parıltı iki tonlu (mürdüm ve kehribar), yalnız üst 900 px |
| 2 | Nasıl çalışır | h2 "Sen yaz. Kişiyi, konumu ve zamanı Kenet bağlasın." Tek kart, üç satır, `rule` ile ayrılır: Yazdığın (hızlı giriş kapsülü, Olay seçili), Gördüğün (aynı cümle; `Ece` düz mavi, `Kadıköy` noktalı yeşil alt çizgi, ek `'de` çizgi dışında), Dosyada (mono: `- 09:41 [[Ece Yalın|Ece]] ile [[Kadıköy]]'de kahve ^a1b2c3`) |
| 3 | Üç vaat | h2 "Dosyalar hep senin." Tek kart, üç satır, solda 44 px işaret sütunu (belge, görev kutusu, çift ok; inline SVG), başlık ve bir cümle |
| 4 | Ekranlar | h2 "Her gün açılan ekran sade kalır; ayrıntı öteki sekmelerde." Üç telefon (Bugün, Görevler listesi, Kanban) `lg` ve üstünde yan yana, altında yatay şerit; `WindowFrame` içinde Mac Kanban (yalnız açık görsel, koyu modda `elevated` zemin ve `line` sınır) ve alt yazı |
| 5 | Kasa | h2 "Obsidian ile aynı kasa. Dışa aktarma yok." Tek kart iki sütun: klasör ağacı ve gün dosyası örneği (`kenet/docs/vault-format.md` örneğinin dile göre kısaltılmışı, blok kimlikli; Obsidian Tasks emoji'leri dosyanın parçası). Altında "SQLite yalnız indekstir; gerçek kaynak bu dosyalar." |
| 6 | Kapanış | Kart yok, üstte `rule`: solda "iPhone, iPad ve Mac için." (32 px `p`) ve altında "Veri düz Markdown dosyaları olarak hep senin.", sağda mağaza düğmesi (telefonda alt alta) |

Görseller `public/screens/*.webp` (Kenet snapshot testlerinden, `scripts/optimize-screens.mjs`; 780×1688 ve 1600×1047, toplam 316 KB); hepsi eager yüklenir. Bileşenler `src/components/home/`: `hero`, `mechanism`, `promises`, `promise-icons`, `screens`, `vault`, `closing`, `device-frame`, `window-frame`. Testler `tests/pages/home.test.tsx` ve `tests/design/compiled-css.test.ts` (derlenmiş CSS: maske, parıltı yüksekliği, KA ve Saydamlığı Azalt'ta parıltı kapalı).

## Gizlilik `/gizlilik`

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Başlık | "Gizlilik politikası", bir paragraf özet, "Son güncelleme" satırı (`PageHeader` `meta`; `time` öğesi; tarih `page.tsx` içinde sabit, dile göre biçimlenir) |
| 1a | Bu sayfada | Beş bölüme çapa listesi (`PrivacyToc`); telefonda içeriğin üstünde, `lg` ve üstünde yapışkan sol sütun. Bölüm kimlikleri `section` öğesindedir |
| 2 | Özet (kart) | Üç cümle: veri cihazda ya da kendi iCloud'unda; hesap yok; uygulama veri toplamaz |
| 3 | Uygulamanın eriştiği veriler (kart) | Satır başına h3 ve üç cevaplı tanım listesi (ne için, nerede durur, kapatılabilir mi); telefonda alt alta, geniş ekranda iki sütun. 10 satır: kasa dosyaları, takvim, konum, bildirimler, iCloud, Siri ve Kısayollar, widget ve paylaşım verisi, Face ID ya da Touch ID, rehber seçici, sistemin günlük önerileri |
| 4 | Toplanmayan veriler (kart) | Analitik, çökme raporu, reklam kimliği, hesap, üçüncü taraf SDK; gizlilik bildirimine gönderme |
| 5 | Bu site (kart) | Çerez yok, hesap yok, üçüncü taraf yok; erişim günlükleri Cloudflare ve kendi sunucuda oluşur, ölçüm için kullanılmaz |
| 6 | Değişiklikler ve iletişim (kart) | Değişiklik bu sayfada tarihle; `/destek` sayfasına yerelleşmiş `Link` |

Her satır Kenet kodundaki ve belgelerindeki kanıta dayanır; kanıt tablosu PR #7 açıklamasında ve uygulayıcı raporundadır. Tablo yerine liste ve tanım listesi seçildi: içerik tek kopya kalır ve dar ekranda yatay kaydırma olmaz. Bileşenler `src/components/privacy/`; test `tests/pages/privacy.test.tsx`.

## Destek `/destek`

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Başlık | "Destek", bir paragraf |
| 2 | Kanallar | h2 ve iki eşit yükseklikte kart (h3): GitHub'da konu aç; geliştirici iletişim sayfası. Bağlantı kartın dibinde, eğik oklu. E-posta yok (karar 2026-11-10) |
| 3 | Hata bildirirken | Tek kart: cihaz, sistem sürümü, Kenet sürümü, ne yaptın, ne bekledin, ne oldu, ekran görüntüsü; "GitHub konuları herkese açıktır" uyarısı |
| 4 | Sık sorulanlar | Tek kart, dört `details.disclosure`: kasa nerede durur; Obsidian ile açılır mı; veri nasıl taşınır ya da yedeklenir; iCloud zorunlu mu. Sağda chevron, bütün satır tıklanır |

Bileşenler `src/components/support/`; test `tests/pages/support.test.tsx`.

## 404

Dilini yoldan okur (`/en/...` İngilizce, kalanı Türkçe). Üstte marka bağlantısı, `404` etiketi, başlık (sayfa başlığı ölçeği), bir cümle, ana sayfaya dönüş ve öteki dilin ana sayfası.

## Geçişler

Sayfalar arası geçiş `Link` ile; dış bağlantılar (`github.com`, `dogancanyildiz.com`) düz `a` ile ve `rel="noopener noreferrer"` taşır. Dil değiştirici aynı sayfanın karşılığına gider; karşılığı olmayan sayfa yoktur.
