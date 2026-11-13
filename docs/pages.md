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
| 1 | Hero | Solda h1 vaat cümlesi (40/48/56 px), tanım paragrafı lead (17 px, `max-w-xl`; metni `metadata.defaultDescription` ile aynı, `product.md` "Tanım cümlesi"), mağaza girişi (kayıt yokken "Yakında App Store'da" metni, düğme değil) ve yanında "iPhone ve iPad; Mac sonra" (Mac mağazaya sonra girer, kenet `docs/decisions.md` 2026-10-07, 2026-10-16, 2026-10-22); altında kanıt şeridi: "Hesap yok", "Düz Markdown", "Obsidian ile aynı kasa", "Uygulama veri toplamaz" (sonuncusu `/gizlilik` bağlantısı), vurgu noktalı satır içi liste, puan ya da yorum yerine; sağda `DeviceFrame` içinde gerçek Bugün ekranı (açık ve koyu çift, `picture` ile tek indirme, preload). Mobilde telefon altta, üst 340 px görünür ve zemine solar. Parıltı iki tonlu (mürdüm ve kehribar), yalnız üst 900 px |
| 2 | Nasıl çalışır | h2 "Sen yaz. Kişiyi, konumu ve zamanı Kenet bağlasın." Tek kart, üç satır, `rule` ile ayrılır: Yazdığın (hızlı giriş kapsülü, Olay seçili), Gördüğün (aynı cümle; `Ece` düz mavi, `Kadıköy` noktalı yeşil alt çizgi, ek `'de` çizgi dışında), Dosyada (mono, kaydırmaz, sarar; `design.md` kural 9a: `- 09:41 [[Ece Yalın|Ece]] ile [[Kadıköy]]'de kahve ^a1b2c3`) |
| 3 | Üç vaat | h2 "Dosyalar hep senin." Tek kart, üç satır, solda 44 px işaret sütunu (belge, görev kutusu, çift ok; inline SVG), başlık ve bir cümle. İlk vaadin ("Veri senin") altında "Gizlilik politikasını oku" bağlantısı (`/gizlilik`, 44 px) |
| 4 | Ekranlar | h2 "Her gün açılan ekran sade kalır; ayrıntı öteki sekmelerde." Dört mağaza tarzı kare (kişi sayfası, Kişiler ve Konumlar, Görevler Kanban, hedef ayrıntısı), her birinde kısa başlık ve ekranda ne görüldüğünü söyleyen bir ya da iki cümle (hedef karesi miktar panelini, kişi karesi yaklaşan etkinlikleri ve doğum gününü anar); `lg` ve üstünde dört sütun, altında yatay şerit. Altında `DeviceFrame device="tablet"` içinde yatay iPad kişi sayfası (açık ve koyu) ve alt yazı (yan yana sütunlar; gün ayrıntısının tek Program kartı). Mac görseli yok: Mac uygulaması mağazaya sonra girer ve eski Mac görüntüsünde sütun adları İngilizceydi |
| 5 | Kasa | h2 "Obsidian ile aynı kasa. Dışa aktarma yok." Tek kart iki sütun: klasör ağacı ve gün dosyası örneği (`kenet/docs/vault-format.md` örneğinin dile göre kısaltılmışı, blok kimlikli; Obsidian Tasks emoji'leri dosyanın parçası). Altında "SQLite yalnız indekstir; gerçek kaynak bu dosyalar." |
| 6 | Kapanış | Kart yok, üstte `rule`: solda "iPhone, iPad ve Mac için." (32 px `p`), altında "Veri düz Markdown dosyaları olarak hep senin." ve "Uygulama veri toplamaz, bu site çerez kullanmaz. Gizlilik politikası" (bağlantı), sağda mağaza girişi (telefonda alt alta). En altta "Platform durumu" etiketi ve üç satır (`sm` ve üstünde üç sütun): iPhone ve iPad ilk sürümle, Mac sonra, arayüz dili. Ana sayfada SSS yok: sorular `/destek` SSS'sinde tek kopya kalır |

Görseller `public/screens/*.webp` (kaynak `.local/kaynak-ekranlar/` altındaki Kenet arayüz turları, gitignore'lu; `node scripts/optimize-screens.mjs [kaynak kökü]`). Kaynak `screen-tour.sh --store` mağaza turu (2026-11-12 ikinci tur, `store-261112b`), saat 9:41. Telefonlar 6,9" 1320×2868 kaynaktan kırpılmadan 780×1695; iPad 13" Bugün ekranı (takvimde üç kurgusal etkinlik; izin bandı görünen kare kullanılmaz; varlık tipi galerisi kareleri eski harfsiz alan adları yüzünden kullanılmaz) EXIF yönüyle yataya çevrilir, üst 56 ve alt 64 px kırpılır, 1600×1130. WebP kalite 75, `effort` 6. Dosyalar: `today`, `person`, `people`, `kanban`, `goal`, `ipad-today`, her biri `-light` ve `-dark`; toplam 599 KB, bir ziyaretçi tek temayı indirir (yaklaşık 300 KB). Hero görseli eager ve yüksek öncelikli, ötekiler lazy yüklenir. Bileşenler `src/components/home/`: `hero`, `mechanism`, `promises`, `promise-icons`, `screens`, `vault`, `closing`, `device-frame`. Testler `tests/pages/home.test.tsx` (çerçeve sayısı, kare başlıkları, `public/screens` ile kullanılan dosyaların birebir eşleşmesi) ve `tests/design/compiled-css.test.ts` (derlenmiş CSS: maske, parıltı yüksekliği, KA ve Saydamlığı Azalt'ta parıltı kapalı).

## Gizlilik `/gizlilik`

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Başlık | "Gizlilik politikası", bir paragraf özet, "Son güncelleme" satırı (`PageHeader` `meta`; `time` öğesi; tarih `page.tsx` içinde sabit, dile göre biçimlenir) |
| 1a | Bu sayfada | Beş bölüme çapa listesi (`PrivacyToc`); telefonda içeriğin üstünde, `lg` ve üstünde yapışkan sol sütun. Bölüm kimlikleri `section` öğesindedir |
| 2 | Özet (kart) | Üç cümle: veri cihazda ya da kendi iCloud'unda; hesap yok; uygulama veri toplamaz |
| 3 | Uygulamanın eriştiği veriler (kart) | Satır başına h3 ve üç cevaplı tanım listesi (ne için, nerede durur, kapatılabilir mi); telefonda alt alta, geniş ekranda iki sütun. Kasa satırı uygulama silinince neyin kaldığını ayırır (yerel kasa iPhone ve iPad'de silinir, iCloud Drive ve seçilen klasör kalır); takvim satırı okuma ile yazmayı (eklenen, düzenlenen, silinen etkinlik; doğum günü; görev ve olay yazılmaz) ve tam erişim iznini anlatır. 10 satır: kasa dosyaları, takvim, konum, bildirimler, iCloud, Siri ve Kısayollar, widget ve paylaşım verisi, Face ID ya da Touch ID, rehber seçici, sistemin günlük önerileri |
| 4 | Toplanmayan veriler (kart) | Analitik, çökme raporu, reklam kimliği, hesap, üçüncü taraf SDK; gizlilik bildirimine gönderme |
| 5 | Bu site (kart) | Çerez yok, hesap yok, üçüncü taraf yok; erişim günlükleri Cloudflare ve kendi sunucuda oluşur, ölçüm için kullanılmaz |
| 6 | Değişiklikler ve iletişim (kart) | Değişiklik bu sayfada tarihle; `/destek` sayfasına yerelleşmiş `Link` |

Her satır Kenet kodundaki ve belgelerindeki kanıta dayanır; kanıt tablosu PR #7 açıklamasında ve uygulayıcı raporundadır. Tablo yerine liste ve tanım listesi seçildi: içerik tek kopya kalır ve dar ekranda yatay kaydırma olmaz. Bileşenler `src/components/privacy/`; test `tests/pages/privacy.test.tsx`.

## Destek `/destek`

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Başlık | "Destek", bir paragraf |
| 2 | Kanallar | h2 ve iki eşit yükseklikte kart (h3): GitHub'da konu aç; geliştirici iletişim sayfası. Bağlantı kartın dibinde, eğik oklu. E-posta yok (karar 2026-11-10) |
| 3 | Hata bildirirken | Tek kart, madde işaretleri gizlilikteki gibi `accent` (`bulletListClass`): cihaz, sistem sürümü, Kenet sürümü, ne yaptın, ne bekledin, ne oldu, ekran görüntüsü; "GitHub konuları herkese açıktır" uyarısı |
| 4 | Sık sorulanlar | Tek kart, dört `details.disclosure`: kasa nerede durur; Obsidian ile açılır mı; veri nasıl taşınır ya da yedeklenir; iCloud zorunlu mu. Sağda chevron, bütün satır tıklanır |

Bileşenler `src/components/support/`; test `tests/pages/support.test.tsx`.

## 404

Dilini yoldan okur (`/en/...` İngilizce, kalanı Türkçe). Üstte marka bağlantısı, `404` etiketi, başlık (sayfa başlığı ölçeği), bir cümle, ana sayfaya dönüş ve öteki dilin ana sayfası (iki bağlantı da 44 px dokunma hedefi).

## Geçişler

Sayfalar arası geçiş `Link` ile; dış bağlantılar (`github.com`, `dogancanyildiz.com`) düz `a` ile ve `rel="noopener noreferrer"` taşır. Dil değiştirici aynı sayfanın karşılığına gider; karşılığı olmayan sayfa yoktur.
