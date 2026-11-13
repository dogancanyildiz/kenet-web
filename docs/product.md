# Ürün ve sitenin amacı

**Amaç:** Bu belge sitenin anlattığı ürünü, kimin için yazıldığını ve her sayfanın işini verir. Ürünün kendi belgeleri `kenet/docs/` altındadır; bu belge onları özetler, yeniden yazmaz.

## Ürün

| Öğe | İçerik |
|---|---|
| Ad | Kenet |
| Tek cümle | Gün içinde yazdığın kısa olayları kişilere, konumlara ve zamana kendiliğinden bağlayan; görevleri ve hedefleri de aynı yerde tutan, verisi düz Markdown olan kişisel günlük. |
| Vaat cümlesi | "Yaz; kim, nerede ve ne zaman kendiliğinden bağlansın. Dosyalar hep senin." |
| Platform | iPhone, iPad ve Mac. Mac uygulaması mağazaya sonra girer. |
| Veri | Obsidian uyumlu Markdown kasa; SQLite yalnız indeks. Hesap yok, bulut hesabı yok; iCloud kasası isteğe bağlı. |
| Dil | Türkçe ve İngilizce. Uygulamanın arayüzü cihazda Kenet için seçili dili izler. |
| Lisans | Tüm hakları saklıdır. Gelir modeli ilk mağaza yayınından önce karara bağlanır. |

## Üç vaat

Site bu üç vaadi anlatır; başka vaat eklenmez.

| Vaat | Siteye yansıması |
|---|---|
| Veri kullanıcınındır | Markdown gerçek kaynaktır, kasa yereldir, hesap yoktur. iCloud Drive'daki ya da seçilen klasördeki kasa uygulama silinse de kalır; iPhone ve iPad'de uygulama klasöründeki yerel kasa uygulamayla birlikte silinir (kenet `rapor-yayin.md` Y7). Site bu ayrımı atlamaz. |
| Hiçbir şey kaybolmaz | Önce dosyaya yazar, sonra indeksi günceller; tanımadığına dokunmaz; silmede onay ya da geri alma. |
| Başka platforma taşınabilir | Kasa Obsidian ile aynıdır; uygulamaya özgü sözdizimi yoktur; kasa şifrelenmez. |

## İlkeler (metinde kullanılabilir)

| No | İlke |
|---|---|
| 1 | Bir satır yazmak 10 saniyeden kısa sürer |
| 2 | Sen yaz, uygulama bağlasın |
| 3 | Veri kullanıcınındır |
| 4 | Tek çekirdek, çok ekran |
| 5 | Geri bir şey verir |
| 6 | Belirsizse sor |

## Tanım cümlesi

Ana sayfa `lead` metni ile `metadata.defaultDescription` aynı metindir (`messages/*/home.json`, `messages/*/common.json`); `tests/pages/home.test.tsx` eşitliği, 25-45 kelimeyi (kısa tutulur: hero paragrafı telefonda uzamasın, sahibin kararı 2026-11-11) ve ilk 150 karakterde "Markdown" ile hesap bilgisini kilitler. Metin değişirse iki dosya birlikte değişir.

> Kenet, hesap gerektirmeyen ve verisini düz Markdown dosyalarında tutan kişisel bir günlüktür. Gün içinde yazdığın kısa olayları kişilere, konumlara ve zamana kendiliğinden bağlar; kasan Obsidian ile uyumludur.

## Sitede anılan özellikler ve kanıtı

Sitede ürün hakkında yeni bir iddia ancak kenet deposunda karşılığı varsa yazılır.

| İddia | Nerede | Kanıt (kenet deposu) |
|---|---|---|
| Hedef sayfasında miktar paneli: sayı klavyesi, hedefe göre hızlı ekleme, "Hedefe tamamla" | Ana sayfa hedef karesi, mağaza metni | `docs/decisions.md` 2026-11-11 "Hedef miktarı ayrıntıda"; `App/Screens/Goals/GoalAmountPanel.swift` |
| Takvim etkinliği ekleme, düzenleme, silme; görev ve olay takvime yazılmaz | Gizlilik takvim satırı, mağaza metni | `docs/decisions.md` 2026-11-11 "Takvim etkinliği yazma"; `App/Screens/Calendar/CalendarEventSheets.swift`; `App/Resources/InfoPlist.xcstrings` takvim izin metni |
| Kişi sayfasında yaklaşan etkinlikler (yalnız takvim izni varken) ve "Doğum günü ekle" (tarih kişi dosyasındaki alandan) | Ana sayfa kişi karesi, gizlilik takvim satırı | `App/Screens/Entities/EntityView.swift` (`canRead` kapısı); `docs/decisions.md` 2026-11-11 "Doğum günü alanı"; `App/Screens/Entities/EntityCalendarSection.swift`; `Packages/Core/Sources/VaultFormat/PersonBirthday.swift` |
| Geniş ekranda (iPad, Mac) geçmiş gün açılınca tek Program kartı (İngilizce arayüzde "Schedule") | Ana sayfa iPad alt yazısı | `docs/screens.md` "Geniş ekran (iPad, Mac)"; `App/Screens/Today/DayView.swift` `pastDayScrollContent` ve `usesProgramLayout`; PR #383 |
| Ana ekran zincir widget'ı | Mağaza metni | `Widgets/KenetWidgetBundle.swift` `GoalChainWidget`; `docs/roadmap.md` Aşama 11 "Ana ekran widget'ı". Kilit ekranı ve hızlı giriş widget'ları da kodda var (`LockScreenWidget`, `QuickEntryWidget`, `QuickEntryControl`; Aşama 11) ama gerçek cihazda denenmedi; site ve mağaza metni bu yüzden onları anmaz |
| Arayüz Türkçe ve İngilizce, uygulama dilini izler | Ana sayfa kapanışı | `docs/product.md` "Arayüz dili"; PR #383, `Tests/KenetTests/PresentationLocaleLanguageTests.swift` |
| iPhone ve iPad'de yerel kasa uygulamayla silinir, iCloud ve seçilen klasör kalır (Mac için iddia yok) | Ana sayfa vaat 1, gizlilik kasa satırı, destek SSS | `docs/architecture.md` "Kasa konumu" (`Documents/Vault`); `raporlar/asama-17/inceleme/rapor-yayin.md` Y7 |

## Kitle

| Kitle | Ne arar | Hangi sayfa |
|---|---|---|
| Mağaza sayfasından gelen aday kullanıcı | Uygulama ne yapar, verim güvende mi | Ana sayfa, gizlilik |
| Mağaza inceleyicisi | Gizlilik politikası ve destek adresi | `/gizlilik`, `/destek` |
| Mevcut kullanıcı | Sorun bildirme, soru | `/destek` |
| Obsidian kullanıcısı | Kasa uyumu | Ana sayfa vaatler, destek SSS |

## Sayfa amaçları

| Sayfa | Amaç | Ölçüt |
|---|---|---|
| `/` | Ürünü bir ekranda anlatmak ve mağazaya yönlendirmek | İlk ekranda vaat cümlesi ve mağaza düğmesi görünür |
| `/gizlilik` | Mağaza kaydının istediği politika; uygulamanın eriştiği veriyi ve toplamadığını açık yazmak | Her izin (takvim, konum, bildirim, iCloud) amaçla birlikte listelenir; takvime neyin yazıldığı açıktır; sitenin çerezsiz olduğu yazar |
| `/destek` | Sorun ve soru kanalı | GitHub konuları ve geliştirici iletişimi; bir hata bildiriminde istenen bilgi listesi |

## Kaynak belgeler

| Konu | Kaynak |
|---|---|
| Ürün tanımı, vaatler, ilkeler, özellik ağacı | `kenet/docs/product.md` |
| Erişilen veriler ve izinler | `kenet/docs/product.md`, `kenet/docs/architecture.md`, `kenet/docs/roadmap.md` Aşama 11 ve 12 |
| Tasarım dili | `kenet/docs/design.md` |
| Alan adı ve yasal sayfa adresleri | `kenet/docs/decisions.md` 2026-10-21 |
