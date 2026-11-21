# Hero Block · Google Play ve App Store uygulaması

Bu klasör, Hero Block oyununun telefon uygulamasıdır. Oyun aynı oyun; [Capacitor](https://capacitorjs.com) ile Android ve iOS uygulamasına sarılır.

- Paket / Bundle ID: `tr.com.herouygulama.heroblock`
- Uygulama adı (telefonda): **Hero Block**
- Android: en düşük Android 7 (API 24), hedef API 36 · iOS: en düşük iOS 15

## Klasörler

| Klasör / dosya | Ne var |
| --- | --- |
| `capacitor.config.json` | Uygulama kimliği `tr.com.herouygulama.heroblock`, adı **Hero Block**, web klasörü `www` |
| `admob.config.json` | **Bütün Google AdMob kimlikleri** (tek dosya; Android ve iOS'ta gerçek kimlikler) |
| `www/` | Oyunun uygulama sürümü (yazı tipleri ve menü müziği içinde; internetsiz açılır) |
| `android/` | Android Studio projesi (Google Play için `.aab`) |
| `ios/` | Xcode projesi (App Store için) |
| `assets/` | Simge ve açılış ekranı kaynakları |
| `scripts/admob-ayarla.mjs` | `npx cap sync` sonrası reklam kimliklerini denetleyip iOS'a ve oyuna dağıtır |

Oyun güncellenince `www/index.html` yenilenir, sonra paketlenir.

## Derleme (bilgisayar gerekmez)

İkisi de GitHub'da, **Actions** sekmesinden **Run workflow** ile çalışır:

- **Android · Google Play paketi (AAB)**: imzalı `.aab` üretir. Çalıştırma bitince sayfanın altındaki **Artifacts** bölümünden indirilir, Play Console'a yüklenir. Her yüklemede **sürüm kodu** bir öncekinden büyük olmalı (ilk paket 1 idi; sonraki 2, 3...).
- **iOS · App Store Connect'e yükle**: GitHub'ın Mac sunucusunda (macOS 26, Xcode 26) derler, Apple'ın bulut imzasıyla imzalar ve App Store Connect'e (TestFlight) gönderir; Mac gerekmez, sertifika ya da profil dosyası hazırlanmaz. Sürüm çalıştırırken yazılır (varsayılan 1.0.11), derleme numarası kendiliğinden artar. **yukle** kutusu işaretsizken yalnızca derleme denemesi yapılır (yükleme yok; Apple hesabı ve gizli bilgi gerekmez). Arşiv imzasız alınır (Google kütüphanelerinin eski imzaları kaldırılır), dağıtım imzasını Apple'ın bulut imzası atar: hesapta kayıtlı cihaz, sertifika ya da profil dosyası gerekmez. `admob.config.json` › `ios` bölümünde Google'ın test kimlikleri varken yükleme yapılmaz.

### Gerekli gizli bilgiler

GitHub › Settings › Secrets and variables › Actions › **New repository secret**

| Ad | Ne |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Yükleme anahtarı dosyasının (`heroblock-yukleme-anahtari.jks`) base64 hâli |
| `ANDROID_KEYSTORE_PASSWORD` | Yükleme anahtarının şifresi |
| `APPLE_TEAM_ID` | Apple geliştirici takım kimliği (10 karakter; developer.apple.com › Account › Membership details) |
| `APPSTORE_API_KEY_ID` | App Store Connect API anahtarının Key ID'si (App Store Connect › Kullanıcılar ve Erişim › Entegrasyonlar › App Store Connect API › Takım Anahtarları › **+**; erişim **Admin**, bulut imzası için gerekli) |
| `APPSTORE_API_ISSUER_ID` | App Store Connect API Issuer ID (aynı sayfanın üstünde) |
| `APPSTORE_API_PRIVATE_KEY` | İndirilen `AuthKey_XXXX.p8` dosyasının içeriğinin tamamı (BEGIN/END satırları dahil; dosya yalnızca bir kez indirilebilir) |

> Yükleme anahtarı, şifreler ve `.p8` dosyası **hiçbir zaman** bu depoya konmaz (`.gitignore` bunları dışarıda tutar).
> Yükleme anahtarını kaybetmemek için iki ayrı yerde sakla.

## Android Studio ile AAB (App Bundle)

Bir kez, bu klasörde (`uygulama/`):

```bash
npm ci                     # Capacitor ve AdMob paketleri (node_modules)
npx cap sync android       # oyun dosyaları ve reklam ayarları Android projesine kopyalanır
npx cap open android       # Android Studio açılır (ya da Android Studio'da uygulama/android klasörünü aç)
```

Android Studio'da **Build › Generate Signed App Bundle or APK › Android App Bundle**'ı seç, yükleme anahtarını (`heroblock-yukleme-anahtari.jks`, takma ad `upload`) ve şifresini gir, **release**'i seç. Çıkan dosya: `android/app/release/app-release.aab`. Sürüm `android/app/build.gradle` içinde: şu an **1.0.11, sürüm kodu 12**. Her Google Play yüklemesinde sürüm kodu bir öncekinden büyük olmalı (bulut derlemesinde `-PhbSurumKodu=` ile verilir).

Oyun ya da reklam kimlikleri değişince yeniden `npx cap sync android` çalıştır.

## Elle derleme (komut satırı, isteğe bağlı)

```bash
npm ci
npx cap sync
# Android (android/keystore.properties dosyası ya da HB_STORE_* ortam değişkenleriyle imzalanır)
cd android && ./gradlew bundleRelease   # build.gradle'daki sürüm (1.0.11, kod 12); başka sürüm için: -PhbSurum=1.0.12 -PhbSurumKodu=13
# iOS: Mac'te ios/App/App.xcodeproj dosyasını Xcode ile aç › Product › Archive
```

`android/keystore.properties` örneği (depoya girmez):

```properties
storeFile=/tam/yol/heroblock-yukleme-anahtari.jks
storePassword=ŞİFRE
keyAlias=upload
keyPassword=ŞİFRE
```

## Uygulama görünümü ve geri tuşu

- **Başlık çubuğu yok, kenardan kenara:** oyun durum ve gezinme çubuklarının arkasına uzanır (koyu zemin, açık simgeler). `MainActivity` önce Capacitor'un temasını (`AppTheme.NoActionBar`) kurar, kenardan kenara görünümü **sonra** açar; sıra ters olursa Android 12 ve sonrasında üstte "Hero Block" yazan bir başlık çubuğu çıkar. Pencere zemini oyunun koyu rengi (`@color/hbArkaPlan`, `#050817`).
- **Web sitesi gibi değil:** sayfa kaymaz, esnemez; oyunun altındaki şirket bilgisi şeridi uygulamada yok (bilgiler ve gizlilik, koşullar, destek bağlantıları ana menüde). Haftalık skor tablosu ana menüde **HAFTANIN EN İYİLERİ** düğmesiyle açılır; ana menü tek ekrana sığar.
- **ANA MENÜ düğmesi (⌂):** üst bilgide solda, yanında yeniden başlat. Oyunu duraklatır: ana menü kartının üstünde **DURAKLATILDI**, **DEVAM ET** ile kaldığın yerden sürer. Düello ana menüde ve oyun sonunda; günlük bulmacadan ve meydan okumadan çıkış da bu düğmeyle (oynanmışsa önce sorar).
- **Açılış:** ana menüden önce görünmez bir kalem el yazısıyla "Hero Block" yazar (Hero camgöbeği-mavi, Block altın); yazı parlar, oyunun renklerinde bloklar saçılır, ekran ana menüye yumuşakça açılır. Toplam yaklaşık 2 saniye; dokununca, bir tuşa ya da geri tuşuna basınca hemen geçilir. Video yok: oyunun içinde SVG (kalem çizgileri `stroke-dashoffset` ile yazılır; parıltı, bloklar ve kararma yalnızca opaklık ve dönüşüm). Yazı oyun hazır olunca başlar; reklam izni penceresi, banner ve bildirimler açılış bitince görünür. "Hareketi azalt" açıksa yazı çizilmeden belirir. Yazı: Hershey Script 1 harfleri (kamu malı), harfler arası bağlantılarla beş kesintisiz kalem çizgisi.
- **Akıcı sürükleme:** uygulama ekranın en yüksek yenileme hızını ister (90, 120, 144 Hz; pil tasarrufunda ya da 60 Hz ayarında sistem düşürür). Sürüklenen parça kendi GPU katmanında yalnızca `translate3d` ile yer değiştirir; parmağın konumu karede bir kez işlenir; hedef kare ve önizleme yalnızca kare değişince hesaplanır; tahtanın katmanları sürüklerken yeniden çizilmez. Parça doğrudan parmağın gerçek konumuna kilitli (tahmin ya da yumuşatma yok); hedef kare iki karenin arasında gidip gelmesin diye histerezisli (değişmesi için parmak ortayı ~0,1 kare geçmeli).
- **Oyun hissiyatı:** raftaki parçaya dokununca parça 80 ms'de tahta boyuna büyür ve parmağın üstüne çıkar (merkezi parmağın 1,9 kare yukarısında; 4-5 kare boyda parçalarda alt kenar en az 0,5 kare yukarıda; yatayda dokunulan nokta orantılı olarak parmağın hizasında); parmağın altında gösterge çizilmez. Parçanın oturacağı yerde kendi renginde %35 opak gölge. Bırakınca parça 60 ms'de gölge hücrelere oturur (oyun hemen işlenir; ses, yerleşme parıltısı ve patlama parça oturunca). Satır/sütun tamamlama önizlemesi ve patlama efektleri 1.0.10'daki gibi. Üç parça da kullanılınca yeni üçlü soldan sağa 45 ms arayla, `cubic-bezier(0.34, 1.56, 0.64, 1)` ile 220 ms'de 0,2 → 1,08 → 1 büyür; her parçanın çevresinde 3-4 minik parıltı. "Hareketi azalt" açıksa oturma, esnek büyüme ve parıltı yok.
- **Ana menü müziği:** ses dosyası yok; sıcak, sakin bir ambiyans Web Audio ile çalınırken üretilir: 75 BPM, yalnızca sine ve triangle, bütün müzik kanalı 700 Hz alçak geçiren süzgeçten geçer. Bas pedi C3 → A2 → F2 → G2, Cmaj7 / Am9 arpejleri (130-523 Hz), E4 G4 B4 D5 C5 arasında seyrek melodi; her nota 0,2 sn girer, 0,9 sn'de söner. Düzeyi oyun içi efektlerin ~%28'i; müziğin aç/kapası ve SES cihazda saklanır.
- **Android geri tuşu:** açık pencereyi kapatır; oyundaysan ana menüye döner (oyun kayıtlı, **DEVAM ET** ile sürer); düelloda, günlük bulmacada ya da meydan okumada önce sorar; oyun bittiyse yeni oyunla ana menüye; ana menüdeyken uygulamayı arka plana alır.

## Paylaşım (Arkadaşına meydan oku, Arkadaşınla düello)

**KAYBETTİN** ekranındaki **ARKADAŞINA MEYDAN OKU** düğmesi ile düellodaki **BAĞLANTIYI GÖNDER** ve **SONUCU GÖNDER** düğmeleri, uygulamada `@capacitor/share` (8.0.3) eklentisiyle telefonun paylaşım menüsünü açar (eklenti yoksa bağlantı panoya kopyalanır). Paylaşılan bağlantı oyunun sitesidir: meydan okumada `https://heroblock.herouygulama.com.tr/?challenge=KOD&target=SKOR&name=AD`, düelloda `https://heroblock.herouygulama.com.tr/?duel=KOD&n1=AD&n2=AD` (düelloda önce açan oynar ve bağlantıyı gönderir; arkadaş aynı parçalarla, aynı sürede oynar, sonucu bağlantıyla geri yollar). Site artık yalnızca tanıtım ve indirme sayfasıdır, oyun sitede oynanmaz: bağlantı tarayıcıda açılırsa sayfa ziyaretçiye düellonun (meydan okumanın) Hero Block uygulamasında oynandığını söyler; düellodaki not da arkadaşın uygulaması olması gerektiğini yazar. **Android App Links (1.0.11 ve sonrası):** Android'de uygulama yüklüyse bağlantı tarayıcı yerine doğrudan uygulamada açılır. Uygulamanın manifestinde sitenin ana sayfası (`/`, `/index.html`) için `android:autoVerify="true"` bir intent-filter var; site de `/.well-known/assetlinks.json` ile paket adını ve imza sertifikalarının SHA-256 parmak izlerini (Google Play uygulama imzalama anahtarı `E1:2C:F0:…:6D:30:89` ve yükleme anahtarı `96:A3:47:…:8E:A6`) bildirir. Android uygulamayı kurarken ve güncellerken dosyayı okuyup imzayı doğrular (Play Console › Deep links sayfasında durum görünür). Bağlantı uygulamayı kapalıyken açarsa ilk ekran bağlantının ekranıdır (düello daveti ya da meydan okuma sorusu); uygulama açıkken gelirse açık pencereler kapanır, oyun kaldığı yerde bekler (ana menüde **DEVAM ET**). Süren düello, günlük bulmaca ya da meydan okuma kesilmez: oyuncuya bitince bağlantıya yeniden dokunması söylenir. Yalnızca ana sayfa uygulamaya gider; gizlilik, koşullar, destek ve veri silme sayfaları tarayıcıda açılır. iPhone için Universal Links (App Store sürümüyle) ayrıca kurulacak.

## Reklamlar (Google AdMob)

Uygulama, `@capacitor-community/admob` (8.3.0) eklentisiyle reklam gösterir. Sitede reklam yoktur.

- **Şerit (banner):** ekranın en altında, güvenli bölgenin üstünde; Google'ın uyarlanabilir boyu (telefonda yaklaşık 50-70, tablette 90 dp). Alanı sabittir: banner istendiği anda ayrılır (bu cihazdaki son banner boyu; ilk açılışta genişliğe göre tahmin), banner yenilenirken ya da yüklenemediğinde korunur. Tahta, raf ve jokerler hep onun üstünde kalır, banner gelip gidince zıplamaz. Reklamsız oyunda (ve reklam izni yoksa) alan kalkar.
- **Oyun arası reklam:** ilk 2 oyunda çıkmaz. Sonra her 3 **TEKRAR OYNA**'da bir kez çıkar. Bu sıklık (ilk kaç oyun reklamsız, kaç **TEKRAR OYNA**'da bir, iki reklam arasında en az kaç saniye; 0 = kapalı) yeni sürüm yayımlamadan skor sunucusunun yönetim panelindeki **Uzaktan ayar** bölümünden değiştirilir: uygulama açılışta `https://skor.herouygulama.com.tr/index.php?a=config` adresini okur, son alınan ayarı cihazda saklar. Ana menüdeki kısa duyuru da aynı yerden yazılır.
- **Ödüllü reklam:** isteğe bağlıdır. Hakkı biten jokere +1 hak verir. **KAYBETTİN** penceresindeki **REKLAM İZLE — TAHTAYI TEMİZLE VE DEVAM ET** düğmesiyle oyun başına bir kez ikinci şans verir: tahtadaki bütün bloklar patlar, skor, kombo ve eldeki parçalar aynen kalır.
- **İzin:** AB, AEA, Birleşik Krallık ve İsviçre'de açılışta Google'ın izin penceresi (UMP) çıkar. Oyuncu kararını menüdeki **REKLAM GİZLİLİK AYARLARI** ile değiştirebilir. **iOS:** Google'ın izin penceresinden sonra, reklamlar başlamadan önce Apple'ın uygulama takip izni (ATT) bir kez sorulur. Penceredeki açıklama `ios/App/App/Info.plist` › `NSUserTrackingUsageDescription` (Türkçe) ve `en.lproj` / `tr.lproj` › `InfoPlist.strings`'te. İzin verilmese de reklamlar kişiselleştirilmeden çıkar, oyunun tamamı oynanır. Bu yüzden App Store Connect › Uygulama Gizliliği'nde reklam verisi "sizi izlemek için kullanılan veri" olarak bildirilir (Google'ın listesi: developers.google.com/admob/ios/privacy/data-disclosure).

### Kimlikler: tek dosya, `admob.config.json`

Bütün AdMob kimlikleri yalnızca **`uygulama/admob.config.json`** dosyasındadır. **Android: gerçek kimlikler** (1.0.11'den başlayarak; AdMob hesabı `pub-1035107027510605`, uygulama `ca-app-pub-1035107027510605~7969060635`; şerit, oyun arası ve ödüllü reklam birimleri aynı hesabın). Kendi reklamına dokunma: geçersiz tıklama hesabı riske atar. Deneme APK'sını kendi telefonunda açacaksan telefonu AdMob › Ayarlar › Test cihazları'na ya da aşağıdaki `testDevices`'a ekle; o telefonda yalnızca test reklamı çıkar. **iOS: gerçek kimlikler** (App Store sürümü 1.0.11'den başlayarak; aynı AdMob hesabı, uygulama `ca-app-pub-1035107027510605~6888817214`; şerit, oyun arası ve ödüllü reklam birimleri aynı hesabın). TestFlight'ta da kendi reklamına dokunma; iPhone'unu AdMob › Ayarlar › Test cihazları'na ekleyebilirsin. App Store'da yayına girince AdMob'daki iOS uygulamasını App Store kaydına bağla.

| Alan | Ne | Biçim |
| --- | --- | --- |
| `android.appId`, `ios.appId` | Uygulama kimliği (AdMob › Uygulamalar › uygulama ayarları) | `ca-app-pub-…~…` |
| `banner`, `interstitial`, `rewarded` | Reklam birimleri: şerit, oyun arası, ödüllü | `ca-app-pub-…/…` |
| `testDevices` | Gerçek kimliklerle kendi telefonunda denerken o telefonun test cihazı kimliği (Logcat'te `setTestDeviceIds` satırında yazar). O telefonda yalnızca test reklamı çıkar | `["33BE…"]` |

Gerçek kimlikleri yazınca `npx cap sync` çalıştır. Gerisi kendiliğinden olur:

- **Android:** `android/app/build.gradle` uygulama kimliğini her derlemede bu dosyadan okuyup `AndroidManifest.xml`'deki `com.google.android.gms.ads.APPLICATION_ID`'ye yazar ve oyunun okuduğu kopyayı yalnızca Android kimlikleriyle yeniden yazar.
- **iOS:** `npx cap sync` sonrasında `scripts/admob-ayarla.mjs` çalışır ve uygulama kimliğini `ios/App/App/Info.plist` › `GADApplicationIdentifier`'a yazar.
- **Oyun:** reklam birimlerini uygulamanın içine konan kopyadan okur (her platformun kopyasında yalnızca kendi kimlikleri: Android paketinde iOS'unkiler, iOS paketinde Android'inkiler yoktur). Dosya yoksa ya da bir kimlik bozuksa o reklam türü hiç istenmez; Google'ın test kimliklerine dönülmez.
- **Denetim:** biçimi yanlış (`~` ile `/` karışmış) ya da başka hesaba ait bir kimlik varsa `npx cap sync` ve Android derlemesi hata verip durur. Android derlemesi ayrıca dosya yoksa ya da Android bölümünde Google'ın test kimlikleri varsa durur: Android paketine yalnızca gerçek kimlikler girer (kendi cihazında denemek için `testDevices`). Elle denetlemek için `npm run admob` çalıştır.

Sitenin kökünde `app-ads.txt` yayında: `google.com, pub-1035107027510605, DIRECT, f08c47fec0942fa0` (AdMob mağazadaki geliştirici sitesinde, https://heroblock.herouygulama.com.tr/app-ads.txt, arar).

## Seviye, günlük görevler ve ses

- **Seviye ve rütbe:** her oyunda kazanılan puan XP olarak cihazda birikir. Seviye 1'den başlar; rütbeler **ÇAYLAK** (1-4), **STRATEJİST** (5-11), **BLOK USTASI** (12-21), **BÜYÜK USTA** (22-34), **EFSANE** (35+). Ana menüde ayarların üstünde seviye, rütbe ve ilerleme çubuğu; oyun sonunda o oyunda kazanılan XP.
- **Günlük görevler:** seviye satırına dokununca her gün yenilenen 3 görev (ör. 15 çizgi patlat, KOMBO ×2 yap, tek oyunda 7.500 puan). Üçü bitince **ÖDÜLÜ AL**: seçilen jokere +1 hak (oyun başına ücretsiz hak bitince kullanılır, süresi dolmaz).
- **Ses motoru:** bütün efektler Web Audio ile anında üretilir (ses dosyası yok); kombolarda patlatma sesi pentatonik gamda bir nota yükselir. Ana menüdeki **SES** kaydırıcısı (%0-%100) ana kazancı sürer (efektler ve menü müziği); çıkışta yumuşak sıkıştırıcı ve tavan cızırtıyı önler. Ses bağlamı ilk dokunuşta kurulur.
- **iPhone ve iPad ses oturumu:** `ambient` (oyunda `navigator.audioSession.type = "ambient"`, uygulamada `AppDelegate` › `AVAudioSession` `.ambient`). Oyunun sesleri başka uygulamanın müziğiyle (Spotify, Apple Music) karışır, onu durdurmaz; kilit ekranında ve Denetim Merkezi'nde medya kartı çıkmaz. Telefon sessiz moddayken oyun sesleri de susar. Oyun hiç `<audio>` öğesi kullanmaz (bir `<audio>` çalmak oturumu `playback`e alır). `Info.plist`'te `UIBackgroundModes` / `audio` yok; iOS derlemesi eklenirse durur.
- **Android tablet sesi:** kısa kenarı en az 600 dp olan Android cihazda ses tamponu ~50 ms (`latencyHint: 0.05`; telefonda `interactive`, gecikme artmaz): büyük ve 120 Hz ekranda patlama efektleri sırasında ses cızırdamaz. Sesler tamponun dörtte biri kadar (4-15 ms) ileriye planlanır; aynı anda en çok 36 ses çalar (aşılırsa en eski efekt 15 ms'de kısılır); notalar doğrusal girişle (en az 3 ms), gürültü katmanları 1,5 ms girişle başlar (tık / patlama olmaz). Örnekleme hızı cihazınki (yeniden örnekleme yok); ses dosyası yok.

## Reklamsız oyun (uygulama içi satın alma)

Uygulama, `@capgo/native-purchases` (8.9.16; Google Play Billing 9, iOS StoreKit 2) eklentisiyle **tek seferlik** bir ürün satar: **REKLAMSIZ OYUN**. Satın alan oyuncuda şerit ve oyun arası reklam çıkmaz; ödüllü reklamlar (joker hakkı, ikinci şans) isteğe bağlı kalır. Sitede satın alma yoktur.

- **Ana menüde REKLAMLARI KALDIR** düğmesi (mağazanın fiyatıyla) ve **oyun her açıldığında** (ve uygulamaya 30 dakikadan uzun aradan sonra dönülünce) bir kez küçük bir pencere: başlık, açıklama, **SATIN AL ₺100,00**, **ŞİMDİ DEĞİL**, **SATIN ALIMI GERİ YÜKLE**. Pencere ana menü açıkken çıkar; takma ad, izin (UMP) ya da başka bir pencere varken bekler, oyuncu o arada oyuna başladıysa çıkmaz.
- **Düğme her zaman görünür:** REKLAMLARI KALDIR, mağaza ürünü göndermese de (internet yok, ürün mağazada henüz hazır değil) fiyatsız durur. Pencere ürünün durumunu yazar (**Fiyat mağazadan alınıyor…** / **şu an mağazadan yüklenemedi**); **SATIN AL** ürünü hemen yeniden ister, fiyat gelince ödeme ekranı açılır; **SATIN ALIMI GERİ YÜKLE** her zaman çalışır. Açılış penceresi ise yalnızca ürün (fiyat) gelince çıkar. Düğmenin görünmediği durumlar: satış panelden kapalı, oyuncu zaten satın almış, sitede (tarayıcı).
- **Fiyat mağazada belirlenir** (Google, uygulama içi ödemede fiyatın mağazadan gelmesini şart koşar). Oyun fiyatı mağazadan okur ve oyuncunun para biriminde gösterir; kodda fiyat yoktur.
- **Yönetim paneli** (skor sunucusu sürüm 6 › Uzaktan ayar › **REKLAMSIZ PAKET**): satışı aç / kapat, açılış penceresini aç / kapat, ürün kimliği (`reklamsiz` ile başlar), Türkçe / İngilizce ad ve açıklama. Uygulama bunları açılışta `?a=config` adresinden okur (birkaç dakikada yayılır).
- **Fiyatı değiştirmek:** Play Console › Para kazanma › Ürünler › Uygulama içi ürünler › `reklamsiz` › fiyatı düzenle. Ya da farklı fiyatlı ikinci bir ürün aç (ör. `reklamsiz_150`) ve kimliğini panele yaz: `reklamsiz` ile başlayan **herhangi bir** ürünü almış oyuncu reklamsızdır, eski fiyattan alanlar etkilenmez.
- **Doğrulama:** satın alma cihazda saklanır (açılışta banner hiç görünmez); mağaza her açılışta ve uygulamaya dönünce yeniden sorulur. İade edilen satın alma geri alınır (reklamlar geri gelir); sonradan tamamlanan (bekleyen, ör. nakit) ödeme onaylanır (`acknowledgePurchase`; onaylanmayan satın almayı Google 3 gün içinde iade eder). Mağaza sorulamazsa (internet yok) bilinen durum kalır.

### Google Play Console'da ürünü açmak (bir kez)

1. Ürün açabilmek için uygulamanın bu sürümü (Billing izni olan, 1.0.8 ve sonrası) Play Console'a en az **dahili test** kanalına yüklenmiş olmalı. Satıcı hesabı (ödeme profili) gerekir: Play Console › Ayarlar › Ödeme profili.
2. **Para kazanma › Ürünler › Uygulama içi ürünler › Ürün oluştur:** ürün kimliği **`reklamsiz`** (sonradan değiştirilemez), ad ve açıklama (`magaza/magaza-metinleri.txt` › UYGULAMA İÇİ ÜRÜN), satın alma seçeneği: tek seferlik (**satın al**), fiyat **100,00 TRY**; diğer ülkeler için önerilen fiyatları kabul et. Kaydet ve **Etkinleştir**.
3. **Deneme:** Play Console › Ayarlar › **Lisans testi** listesine kendi Google hesabını ekle. Uygulamayı dahili test bağlantısıyla **Play Store'dan** yükle (elle kurulan APK'da mağaza ürünü bulamayabilir). Lisans testçisi gerçek para ödemez ("Test kartı, her zaman onaylar"); "yavaş test kartı" ile bekleyen ödemeyi deneyebilirsin. İadeyi Play Console › **Sipariş yönetimi**'nden dene (iade ederken "hakkı kaldır"ı seç): uygulama bir sonraki açılışta reklamları geri getirir.
4. Ürün etkinleşene kadar (ya da mağaza bulunamazsa) oyunda düğme ve pencere görünmez; oyun bunu kendisi yeniden dener.

### App Store Connect (iOS)

Uygulama › **Uygulama İçi Satın Almalar** › **Tüketilmeyen** (Non-Consumable): ürün kimliği **`reklamsiz`**, fiyat 100 TRY'ye en yakın basamak, görünen ad ve açıklama (mağaza metinleri dosyasında). İlk ürün, uygulamanın bir sürümüyle birlikte incelemeye gönderilir (sürüm sayfası › **Uygulama İçi Satın Almalar ve Abonelikler** bölümünde ürünü seç). iOS'ta **SATIN ALIMI GERİ YÜKLE** zorunludur, pencerede var.

StoreKit ürünü (TestFlight'ta ve App Review'da da) ancak şunlar tamamsa döndürür; biri eksikse pencere "şu an mağazadan yüklenemedi" yazar (Apple TN3186):
- Ürün kimliği tam olarak `reklamsiz`, fiyatı ve en az bir dil için görünen adı / açıklaması girilmiş (durum: **Gönderilmeye Hazır**, "Eksik Meta Veri" değil).
- **İş › Sözleşmeler:** Ücretli Uygulamalar sözleşmesi **Etkin**; banka hesabı ve vergi formları da **Etkin**.
- Uygulamanın paket kimliği `tr.com.herouygulama.heroblock` ve bu kimlikte In-App Purchase yeteneği açık (açık kimliklerde varsayılan olarak açıktır).
- Ürün ayarındaki değişikliklerin deneme ortamına yansıması 1 saati bulabilir.

## Mağaza bağlantıları

- Gizlilik politikası: https://heroblock.herouygulama.com.tr/gizlilik.html
- Kullanım koşulları: https://heroblock.herouygulama.com.tr/kosullar.html
- Destek: https://heroblock.herouygulama.com.tr/destek.html
- Hesap ve veri silme: https://heroblock.herouygulama.com.tr/veri-silme.html
