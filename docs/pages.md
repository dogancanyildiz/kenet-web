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
| 1 | Giriş (kart) | Üst satır "iPhone, iPad ve Mac için"; h1 vaat cümlesi; bir paragraf; künye satırı "3 vaat, 6 ilke, 1 kasa" (sayı ve sözcük metin renginde yarı kalın, ayraçlar ikincil); App Store düğmesi (mağaza yoksa "Yakında App Store'da" pasif) |
| 2 | Üç vaat | Üç kart: Veri senin, Hiçbir şey kaybolmaz, Başka platforma taşınabilir |
| 3 | Nasıl çalışır | Tek kartta numaralı beş adım, kullanıcı günü akışından: yaz, tanı, emin değilse sor, bağla, önce dosyaya yaz sonra indeksi güncelle |
| 4 | Platformlar | Tek kart, üç sütun: iPhone, iPad, Mac; "Mac uygulaması mağazaya sonra girer" notu. Ekran görüntüsü yok (Aşama 4) |
| 5 | Kapanış | h2 "Obsidian": kasa aynı biçimde, var olan kasa yerinde açılır; mağaza düğmesinin tekrarı |

Bileşenler `src/components/home/` altında: `intro`, `masthead`, `promises`, `how-it-works`, `platforms`, `closing`. Test `tests/pages/home.test.tsx` başlık düzeylerini, h2 sırasını ve kart sayısını ölçer.

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
