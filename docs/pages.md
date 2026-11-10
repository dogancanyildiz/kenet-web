# Sayfalar

**Amaç:** Bu belge her sayfada neyin nerede olduğunu tarif eder. Nasıl göründüğü `design.md` belgesindedir.

## Kabuk

| Öğe | Yer | Davranış |
|---|---|---|
| İçeriğe geç bağlantısı | Belgenin ilk odaklanabilir öğesi | Odaklanınca görünür |
| Üst bilgi | Marka işareti ve "Kenet" solda; Gizlilik, Destek ve dil bağlantısı sağda | Dil bağlantısı aynı sayfanın öteki dilini açar |
| Ana içerik | `main#main` | Odak hedefidir |
| Alt bilgi | Telif aralığı; geliştirici sitesi, kaynak kodu, derleme bilgisi | Derleme bilgisi değişken boşsa gizlenir |

## Ana sayfa `/`

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Giriş | Üst satır "iPhone, iPad ve Mac için"; başlık vaat cümlesi; bir paragraf; App Store düğmesi (mağaza yoksa "Yakında App Store'da" pasif) |
| 2 | Üç vaat | Üç kart: Veri senin, Hiçbir şey kaybolmaz, Başka platforma taşınabilir |
| 3 | Nasıl çalışır | Numaralı üç satır tek kartta: 10 saniye, sen yaz uygulama bağlasın, belirsizse sor |
| 4 | (Aşama 2) Platformlar ve ekran görüntüleri | Karar bekliyor |

## Gizlilik `/gizlilik`

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Başlık | "Gizlilik politikası", bir paragraf özet, son güncelleme tarihi |
| 2 | Özet | Üç cümle: veri cihazda, hesap yok, uygulama veri toplamaz |
| 3 | Uygulamanın eriştiği veriler | Tablo: veri, amaç, nerede durur, kapatılabilir mi. Satırlar: kasa dosyaları, takvim, konum, bildirimler, iCloud (isteğe bağlı), Siri ve Kısayollar, widget verisi (App Group) |
| 4 | Toplanmayan veriler | Analitik, çökme raporu, reklam kimliği, hesap |
| 5 | Site | kenet.app çerez kullanmaz, üçüncü taraf betik yüklemez; sunucu günlükleri |
| 6 | Değişiklikler ve iletişim | Değişiklik bu sayfada tarihle; iletişim `/destek` |

Metin kaynakları `product.md` içindeki tabloda. Uygulamada olmayan bir özellik politikaya yazılmaz; emin olunmayan satır soru olarak PR açıklamasına yazılır.

## Destek `/destek`

| Sıra | Bölüm | İçerik |
|---|---|---|
| 1 | Başlık | "Destek", bir paragraf |
| 2 | Kanallar | İki kart: GitHub'da konu aç; geliştirici iletişim sayfası |
| 3 | (Aşama 2) Hata bildirirken | Cihaz, sistem sürümü, uygulama sürümü, adımlar, beklenen ve olan |
| 4 | (Aşama 2) Sık sorulanlar | Kasa nerede; Obsidian ile açılır mı; veri nasıl taşınır; iCloud zorunlu mu |

## 404

Dilini yoldan okur (`/en/...` İngilizce, kalanı Türkçe). Başlık, bir cümle, ana sayfaya dönüş ve öteki dilin ana sayfası.

## Geçişler

Sayfalar arası geçiş `Link` ile; dış bağlantılar (`github.com`, `dogancanyildiz.com`) düz `a` ile ve `rel="noopener noreferrer"` taşır. Dil değiştirici aynı sayfanın karşılığına gider; karşılığı olmayan sayfa yoktur.
