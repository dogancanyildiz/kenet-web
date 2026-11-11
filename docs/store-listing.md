# Mağaza meta verisi taslağı

**Amaç:** App Store Connect'e girilecek metinlerin tr ve en taslağı. Kaynak: kenet `raporlar/asama-17/inceleme/rapor-yayin.md` Y3; ürün iddiaları `docs/product.md` "Sitede anılan özellikler ve kanıtı" tablosuna ve kenet `docs/product.md` belgesine dayanır.

**Durum:** Taslak, 2026-11-11. Mağazaya girmeden önce sahibin onayı gerekir. İlk mağaza sürümü iPhone ve iPad içindir; Mac sonra gelir, bu yüzden metin Mac'i anmaz.

Kurallar: fiyat, "ücretsiz", "açık kaynak", şifreleme ve puan iddiası yok; kilit ekranı ve hızlı giriş widget'ları anılmaz (kenet `docs/product.md` "Kısmen"). Anahtar sözcükler ad ve alt başlıktaki sözcükleri tekrar etmez; virgülle ayrılır, boşluk yoktur.

## Sınırlar ve ölçüm

Sayılar Python `len()` (Unicode karakter) ve UTF-8 bayt olarak ölçüldü. Apple sınırı karakterdir; anahtar sözcükte Türkçe harfler bazı raporlarda bayt sayıldığı için bayt da 100 altında tutuldu.

| Alan | Sınır | tr karakter | tr bayt | en karakter | en bayt |
|---|---|---|---|---|---|
| Uygulama adı | 30 | 5 | 5 | 5 | 5 |
| Alt başlık | 30 | 29 | 32 | 28 | 28 |
| Tanıtım metni | 170 | 164 | 177 | 165 | 165 |
| Anahtar sözcükler | 100 | 89 | 95 | 98 | 98 |
| Bu sürümdeki yenilikler | 4000 | 35 | 38 | 37 | 37 |
| Açıklama | 4000 | 2603 | 2813 | 2671 | 2675 |
| İnceleme notu (yalnız en girilir) | 4000 | 1531 | 1664 | 1619 | 1621 |

## Adresler

| Alan | tr | en |
|---|---|---|
| Destek URL'si | `https://kenet.app/destek` | `https://kenet.app/en/support` |
| Gizlilik politikası URL'si | `https://kenet.app/gizlilik` | `https://kenet.app/en/privacy` |
| Pazarlama URL'si (isteğe bağlı) | `https://kenet.app/` | `https://kenet.app/en` |

## Türkçe (tr)

### Uygulama adı (5/30)

```text
Kenet
```

### Alt başlık (29/30)

```text
Kişi, konum ve zamanla günlük
```

### Tanıtım metni (164/170)

```text
Yaz; kim, nerede ve ne zaman kendiliğinden bağlansın. Hesap yok, veri toplanmaz; günlüğün Obsidian ile aynı biçimde düz Markdown dosyalarında, seçtiğin yerde durur.
```

### Anahtar sözcükler (89/100)

```text
günce,ajanda,markdown,obsidian,hedef,alışkanlık,görev,kanban,takvim,not,zincir,hatırlatma
```

### Bu sürümdeki yenilikler (35/4000)

```text
Kenet'in App Store'daki ilk sürümü.
```

### Açıklama (2603/4000)

```text
Kenet, gün içinde yazdığın kısa olayları kişilere, konumlara ve zamana kendiliğinden bağlayan kişisel bir günlüktür. Görevler ve hedefler de aynı yerde durur. Her şey düz Markdown dosyalarına yazılır; hesap açmazsın, uygulama veri toplamaz.

Sen yaz, Kenet bağlasın
"Ece ile Kadıköy'de kahve" yazarsın; Kenet Ece'yi kişi sayfasına, Kadıköy'ü konum sayfasına bağlar ve satırı saatiyle gün dosyana ekler. Belirsiz bir ad olursa tahmin etmez, sana sorar. Klasörleme ya da etiketleme yapmazsın.

Kişiler ve konumlar
Her kişinin kendi sayfası vardır: son görüşme, o kişiyle yaşananlar ve onunla ilgili açık görevler. Kişi sayfası o kişiyle ilgili yaklaşan takvim etkinliklerini de gösterir; doğum gününü kişi dosyasındaki tarihten takvime eklersin. Bağlantıları Graph'ta ve haritada görürsün. Rehberinden seçtiğin kişileri içe aktarabilirsin.

Görevler
Görevi doğal dille yazarsın; tarih, öncelik ve tekrar cümleden okunur. Aynı görevler liste, Kanban ve zaman çizelgesi olarak görünür, proje sayfalarında toplanır. Günü kapatırken açık görevleri bugüne, yarına ya da haftaya taşırsın.

Hedefler
Günlük, haftalık ve yıllık hedefler; zincir, ısı haritası ve zincir affı. Sayı hedefinde miktarı sayı klavyesiyle yazar, hedefe göre hızlı ekler ya da tek dokunuşla hedefe tamamlarsın. İstersen seçtiğin bir yere vardığında o yere bağlı hedef işaretlenir.

Takvim
Günün etkinliklerini günlüğünün yanında görürsün ve bir etkinlikten olay taslağı hazırlarsın. Etkinlikleri uygulamadan ekler, düzenler ve silersin. Görevlerin ve olayların takvime yazılmaz.

Geri dönüş
Haftalık ve aylık özetler, bu gün geçmişte, görüşme ritmi ve önemli tarihler yazmaya devam etmen için sebep verir.

Dosyalar senin
Kasa, Obsidian ile aynı biçimde düz Markdown dosyalarından oluşur; var olan bir Obsidian kasasını yerinde açabilirsin. SQLite yalnız arama için bir indekstir, gerçek kaynak dosyalardır. Kasayı cihazında, kendi iCloud Drive'ında ya da seçtiğin bir klasörde tutarsın. iCloud Drive'daki ya da seçtiğin klasördeki kasa uygulamayı silsen de kalır; cihazdaki yerel kasa uygulamayla birlikte silinir.

Gizlilik
Hesap, analitik, reklam ve izleme yok. Kenet'in sunucusu yoktur. İstersen uygulamayı Face ID ya da Touch ID ile kilitlersin. Uygulama kasayı şifrelemez, bu yüzden dosyaları Obsidian gibi başka uygulamalarla da açabilirsin.

Uygulamayı açmadan Siri ve Kısayollar ile olay ya da görev eklersin; paylaşım menüsünden metni günlüğe gönderirsin; ana ekran widget'ı zincirini gösterir. iPad'de kenar çubuğu, liste ve sayfa yan yana durur.

Arayüz Türkçe ve İngilizcedir.

Gizlilik politikası: https://kenet.app/gizlilik
```

## İngilizce (en)

### Uygulama adı (5/30)

```text
Kenet
```

### Alt başlık (28/30)

```text
Journal of people and places
```

### Tanıtım metni (165/170)

```text
Write; let who, where and when link themselves. No account, no data collected; your journal lives in plain Markdown files, in Obsidian's format, wherever you choose.
```

### Anahtar sözcükler (98/100)

```text
diary,markdown,obsidian,habit,goal,tasks,kanban,calendar,notes,streak,planner,log,tracker,reminder
```

### Bu sürümdeki yenilikler (37/4000)

```text
The first App Store release of Kenet.
```

### Açıklama (2671/4000)

```text
Kenet is a personal journal that links the short entries you write during the day to people, places and time. Tasks and goals live in the same place. Everything is written to plain Markdown files; you never create an account, and the app collects no data.

You write, Kenet links
Type "Coffee with Ece in Kadıköy" and Kenet links Ece to her person page, Kadıköy to its place page, and adds the line to your day file with its time. When a name is ambiguous, it asks instead of guessing. No folders, no tagging.

People and places
Every person has a page: when you last met, what happened together and the open tasks that involve them. The page also shows upcoming calendar events with that person, and you can add their birthday to your calendar from the date in their file. See the links in Graph and on a map. Import people you pick from your contacts.

Tasks
Write a task in plain language; the date, priority and repeat are read from the sentence. The same tasks show as a list, a Kanban board and a timeline, and gather on project pages. When you close the day, move open tasks to today, tomorrow or next week.

Goals
Daily, weekly and yearly goals with chains, a heat map and grace days. For a number goal, type the amount on the number pad, add a quick step sized to your target, or complete the goal in one tap. If you like, arriving at a place you chose marks the goal linked to it.

Calendar
See the day's events next to your journal and draft an entry from an event. Add, edit and delete events from the app. Your tasks and entries are never written to the calendar.

Looking back
Weekly and monthly summaries, on this day, keep-in-touch reminders and important dates give you a reason to keep writing.

Your files
The vault is a folder of plain Markdown files in the same format as Obsidian, and Kenet opens an existing Obsidian vault in place. SQLite is only an index for search; the files are the source of truth. Keep the vault on your device, in your own iCloud Drive or in a folder you pick. A vault in iCloud Drive or in a folder you picked stays if you delete the app; a local vault on the device is deleted with the app.

Privacy
No account, no analytics, no ads, no tracking. Kenet has no server. Lock the app with Face ID or Touch ID if you want. The app does not encrypt the vault, so other apps such as Obsidian can open the files.

Add an event or a task with Siri and Shortcuts without opening the app, send text to your journal from the share sheet, and keep your chain on the Home Screen widget. On iPad the sidebar, the list and the page sit side by side.

The interface is in English and Turkish.

Privacy policy: https://kenet.app/en/privacy
```

## İnceleme notu (App Review)

İnceleme notu dile göre değil, uygulamaya tek girilir; inceleyici için İngilizcesi girilir. Türkçesi kayıt içindir.

### en (1619/4000)

```text
No account or sign-in is needed, so there is no demo account.

On first launch the app asks where the vault (a folder of Markdown files) should live: iCloud Drive, on this device, or a folder you pick. Any choice works for review; the on-device option needs no setup. To see linked content, type a line such as "Coffee with Ece in Kadıköy" in the quick entry field on the Today screen. When a name is new or ambiguous, the app asks before it creates or links a person.

No permission is requested at launch. Each one is requested from the screen or setting that uses it:
- Calendar (full access): shows the day's events, drafts an entry from an event, shows a person's upcoming events, and saves the events the user adds, edits or deletes in the app. Tasks and entries are never written to the calendar. Requested when the user taps the calendar permission button.
- Location when in use: suggests nearby saved places while writing, shows the map and fills a place's coordinates.
- Location always: requested only when the user turns on a goal's location behaviour, so that arriving at a chosen place can mark that goal or send a reminder while the app is closed.
- Notifications: task, goal and evening journal reminders, scheduled on the device.
- Face ID: the optional app lock, off by default.

Importing from Contacts uses the system contact picker and Journaling Suggestions uses the system picker; neither asks for permission.

The app has no server, no analytics and no third-party SDK other than GRDB (the local SQLite index).

Privacy policy: https://kenet.app/en/privacy
Support: https://kenet.app/en/support
```

### tr (1531/4000)

```text
Hesap ya da giriş yoktur, bu yüzden deneme hesabı da yoktur.

İlk açılışta uygulama kasanın (Markdown dosyalarından oluşan bir klasör) nerede duracağını sorar: iCloud Drive, bu cihaz ya da seçilen bir klasör. İnceleme için her seçenek çalışır; cihaz seçeneği kurulum istemez. Bağlanmış içeriği görmek için Bugün ekranındaki hızlı giriş alanına "Ece ile Kadıköy'de kahve" gibi bir satır yazılır. Ad yeni ya da belirsizse uygulama kişi oluşturmadan ya da bağlamadan önce sorar.

İlk açılışta izin istenmez. Her izin onu kullanan ekrandan ya da ayardan istenir:
- Takvim (tam erişim): günün etkinliklerini göstermek, bir etkinlikten olay taslağı hazırlamak, kişinin yaklaşan etkinliklerini göstermek ve kullanıcının uygulamada eklediği, düzenlediği ya da sildiği etkinliği kaydetmek. Görevler ve olaylar takvime yazılmaz. Kullanıcı takvim izin düğmesine basınca istenir.
- Konum, kullanımdayken: yazarken yakındaki kayıtlı konumları önermek, haritayı göstermek, bir konumun koordinatını doldurmak.
- Konum, her zaman: yalnız kullanıcı bir hedefin konum davranışını açınca istenir; seçilen yere varınca uygulama kapalıyken de o hedefi işaretlemek ya da hatırlatmak için.
- Bildirimler: görev, hedef ve akşam günlük hatırlatmaları; cihazda planlanır.
- Face ID: isteğe bağlı uygulama kilidi, varsayılan olarak kapalı.

Rehberden içe aktarma sistemin kişi seçicisini, Günlük Önerileri sistemin seçicisini kullanır; ikisi de izin istemez.

Uygulamanın sunucusu, analitiği ve GRDB (yerel SQLite indeksi) dışında üçüncü taraf SDK'sı yoktur.
```

## Açık kalanlar

| Konu | Not |
|---|---|
| Fiyat ve gelir modeli | Karar açık (kenet `decisions.md` açık soru 3, rapor Y5); metin fiyat anmaz |
| Kategori | Sahibin kararı; aday "Yaşam Tarzı" ya da "Verimlilik" |
| Gizlilik etiketi | Uygulama veri toplamaz: App Store Connect'te "Veri toplanmıyor" (`PrivacyInfo.xcprivacy` ile uyumlu, rapor "Sağlam bulunanlar") |
| Telif satırı | `2026 Doğan Can YILDIZ` biçimi önerilir; sahibin onayı |
| Yaş derecelendirmesi | Anket sahibin; kullanıcı içeriği yalnız cihazda, paylaşım yok |
| AB tacir beyanı | Rapor Y6; sahibin kararı |
| Ekran görüntüleri | Rapor Y4: 6,9 inç iPhone ve 13 inç iPad boyutu gerekir |
