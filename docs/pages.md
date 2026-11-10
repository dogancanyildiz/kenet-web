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
| 1 | Başlık | "Gizlilik politikası", bir paragraf özet, "Son güncelleme" satırı (`time` öğesi; tarih `page.tsx` içinde sabit, dile göre biçimlenir) |
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
| 2 | Kanallar | h2 ve iki kart (h3): GitHub'da konu aç; geliştirici iletişim sayfası. E-posta yok (karar 2026-11-10) |
| 3 | Hata bildirirken | Tek kart: cihaz, sistem sürümü, Kenet sürümü, ne yaptın, ne bekledin, ne oldu, ekran görüntüsü; "GitHub konuları herkese açıktır" uyarısı |
| 4 | Sık sorulanlar | Tek kart, dört `details/summary`: kasa nerede durur; Obsidian ile açılır mı; veri nasıl taşınır ya da yedeklenir; iCloud zorunlu mu |

Bileşenler `src/components/support/`; test `tests/pages/support.test.tsx`.

## 404

Dilini yoldan okur (`/en/...` İngilizce, kalanı Türkçe). Başlık, bir cümle, ana sayfaya dönüş ve öteki dilin ana sayfası.

## Geçişler

Sayfalar arası geçiş `Link` ile; dış bağlantılar (`github.com`, `dogancanyildiz.com`) düz `a` ile ve `rel="noopener noreferrer"` taşır. Dil değiştirici aynı sayfanın karşılığına gider; karşılığı olmayan sayfa yoktur.
