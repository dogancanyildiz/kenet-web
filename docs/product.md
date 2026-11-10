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
| Dil | Türkçe ve İngilizce |
| Lisans | Tüm hakları saklıdır. Gelir modeli ilk mağaza yayınından önce karara bağlanır. |

## Üç vaat

Site bu üç vaadi anlatır; başka vaat eklenmez.

| Vaat | Siteye yansıması |
|---|---|
| Veri kullanıcınındır | Markdown gerçek kaynaktır, kasa yereldir, hesap yoktur, uygulama silinse de dosyalar kalır. |
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
| `/gizlilik` | Mağaza kaydının istediği politika; uygulamanın eriştiği veriyi ve toplamadığını açık yazmak | Her izin (takvim, konum, bildirim, iCloud) amaçla birlikte listelenir; sitenin çerezsiz olduğu yazar |
| `/destek` | Sorun ve soru kanalı | GitHub konuları ve geliştirici iletişimi; bir hata bildiriminde istenen bilgi listesi |

## Kaynak belgeler

| Konu | Kaynak |
|---|---|
| Ürün tanımı, vaatler, ilkeler, özellik ağacı | `kenet/docs/product.md` |
| Erişilen veriler ve izinler | `kenet/docs/product.md`, `kenet/docs/architecture.md`, `kenet/docs/roadmap.md` Aşama 11 ve 12 |
| Tasarım dili | `kenet/docs/design.md` |
| Alan adı ve yasal sayfa adresleri | `kenet/docs/decisions.md` 2026-10-21 |
