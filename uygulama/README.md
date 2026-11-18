# Hero Block · Google Play ve App Store uygulaması

Bu klasör, Hero Block oyununun telefon uygulamasıdır. Oyun aynı oyun; [Capacitor](https://capacitorjs.com) ile Android ve iOS uygulamasına sarılır.

- Paket / Bundle ID: `tr.com.herouygulama.heroblock`
- Uygulama adı (telefonda): **Hero Block**
- Android: en düşük Android 7 (API 24), hedef API 36 · iOS: en düşük iOS 15

## Klasörler

| Klasör / dosya | Ne var |
| --- | --- |
| `capacitor.config.json` | Uygulama kimliği `tr.com.herouygulama.heroblock`, adı **Hero Block**, web klasörü `www` |
| `admob.config.json` | **Bütün Google AdMob kimlikleri** (tek dosya; şimdilik Google'ın test kimlikleri) |
| `www/` | Oyunun uygulama sürümü (yazı tipleri ve menü müziği içinde; internetsiz açılır) |
| `android/` | Android Studio projesi (Google Play için `.aab`) |
| `ios/` | Xcode projesi (App Store için) |
| `assets/` | Simge ve açılış ekranı kaynakları |
| `scripts/admob-ayarla.mjs` | `npx cap sync` sonrası reklam kimliklerini denetleyip iOS'a ve oyuna dağıtır |

Oyun güncellenince `www/index.html` yenilenir, sonra paketlenir.

## Derleme (bilgisayar gerekmez)

İkisi de GitHub'da, **Actions** sekmesinden **Run workflow** ile çalışır:

- **Android · Google Play paketi (AAB)**: imzalı `.aab` üretir. Çalıştırma bitince sayfanın altındaki **Artifacts** bölümünden indirilir, Play Console'a yüklenir. Her yüklemede **sürüm kodu** bir öncekinden büyük olmalı (ilk paket 1 idi; sonraki 2, 3...).
- **iOS · App Store Connect'e yükle**: GitHub'ın Mac sunucusunda derler, imzalar ve App Store Connect'e (TestFlight) gönderir. Derleme numarası kendiliğinden artar.

### Gerekli gizli bilgiler

GitHub › Settings › Secrets and variables › Actions › **New repository secret**

| Ad | Ne |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Yükleme anahtarı dosyasının (`heroblock-yukleme-anahtari.jks`) base64 hâli |
| `ANDROID_KEYSTORE_PASSWORD` | Yükleme anahtarının şifresi |
| `APPLE_TEAM_ID` | Apple geliştirici takım kimliği (10 karakter) |
| `APPSTORE_API_KEY_ID` | App Store Connect API anahtarının Key ID'si |
| `APPSTORE_API_ISSUER_ID` | App Store Connect API Issuer ID |
| `APPSTORE_API_PRIVATE_KEY` | İndirilen `AuthKey_XXXX.p8` dosyasının içeriğinin tamamı |

> Yükleme anahtarı, şifreler ve `.p8` dosyası **hiçbir zaman** bu depoya konmaz (`.gitignore` bunları dışarıda tutar).
> Yükleme anahtarını kaybetmemek için iki ayrı yerde sakla.

## Android Studio ile AAB (App Bundle)

Bir kez, bu klasörde (`uygulama/`):

```bash
npm ci                     # Capacitor ve AdMob paketleri (node_modules)
npx cap sync android       # oyun dosyaları ve reklam ayarları Android projesine kopyalanır
npx cap open android       # Android Studio açılır (ya da Android Studio'da uygulama/android klasörünü aç)
```

Android Studio'da **Build › Generate Signed App Bundle or APK › Android App Bundle**'ı seç, yükleme anahtarını (`heroblock-yukleme-anahtari.jks`, takma ad `upload`) ve şifresini gir, **release**'i seç. Çıkan dosya: `android/app/release/app-release.aab`. Her Google Play yüklemesinde `android/app/build.gradle` içindeki sürüm kodu bir öncekinden büyük olmalı (bulut derlemesinde `-PhbSurumKodu=` ile verilir).

Oyun ya da reklam kimlikleri değişince yeniden `npx cap sync android` çalıştır.

## Elle derleme (komut satırı, isteğe bağlı)

```bash
npm ci
npx cap sync
# Android (android/keystore.properties dosyası ya da HB_STORE_* ortam değişkenleriyle imzalanır)
cd android && ./gradlew bundleRelease -PhbSurum=1.0.1 -PhbSurumKodu=2
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
- **Android geri tuşu:** açık pencereyi kapatır; oyundaysan ana menüye döner (oyun kayıtlı, **DEVAM ET** ile sürer); düelloda, günlük bulmacada ya da meydan okumada önce sorar; oyun bittiyse yeni oyunla ana menüye; ana menüdeyken uygulamayı arka plana alır.

## Paylaşım (Arkadaşına meydan oku, Arkadaşınla düello)

**KAYBETTİN** ekranındaki **ARKADAŞINA MEYDAN OKU** düğmesi ile düellodaki **BAĞLANTIYI GÖNDER** ve **SONUCU GÖNDER** düğmeleri, uygulamada `@capacitor/share` (8.0.3) eklentisiyle telefonun paylaşım menüsünü açar (eklenti yoksa bağlantı panoya kopyalanır). Paylaşılan bağlantı oyunun sitesidir: meydan okumada `https://heroblock.herouygulama.com.tr/?challenge=KOD&target=SKOR&name=AD`, düelloda `https://heroblock.herouygulama.com.tr/?duel=KOD&n1=AD&n2=AD` (düelloda önce açan oynar ve bağlantıyı gönderir; arkadaş aynı parçalarla, aynı sürede oynar, sonucu bağlantıyla geri yollar). Site artık yalnızca tanıtım ve indirme sayfasıdır, oyun sitede oynanmaz: bağlantı tarayıcıda açılırsa sayfa ziyaretçiye düellonun (meydan okumanın) Hero Block uygulamasında oynandığını söyler; düellodaki not da arkadaşın uygulaması olması gerektiğini yazar. Bağlantının telefonda doğrudan uygulamada açılması için Android App Links (sitede `/.well-known/assetlinks.json`, Play Console › Uygulama bütünlüğü › Uygulama imzalama anahtarı sertifikasının SHA-256 parmak izi) ve iOS Universal Links kurulmalıdır; kurulana kadar bağlantıyı alan arkadaş düelloyu açamaz.

## Reklamlar (Google AdMob)

Uygulama, `@capacitor-community/admob` (8.3.0) eklentisiyle reklam gösterir. Sitede reklam yoktur.

- **Şerit (banner):** ekranın en altında, güvenli bölgenin üstünde. Tahta, raf ve jokerler reklamın üstünde kalır.
- **Oyun arası reklam:** ilk 2 oyunda çıkmaz. Sonra her 3 **TEKRAR OYNA**'da bir kez çıkar. Bu sıklık (ilk kaç oyun reklamsız, kaç **TEKRAR OYNA**'da bir, iki reklam arasında en az kaç saniye; 0 = kapalı) yeni sürüm yayımlamadan skor sunucusunun yönetim panelindeki **Uzaktan ayar** bölümünden değiştirilir: uygulama açılışta `https://skor.herouygulama.com.tr/index.php?a=config` adresini okur, son alınan ayarı cihazda saklar. Ana menüdeki kısa duyuru da aynı yerden yazılır.
- **Ödüllü reklam:** isteğe bağlıdır. Hakkı biten jokere +1 hak verir. **KAYBETTİN** penceresindeki **REKLAM İZLE — TAHTAYI TEMİZLE VE DEVAM ET** düğmesiyle oyun başına bir kez ikinci şans verir: tahtadaki bütün bloklar patlar, skor, kombo ve eldeki parçalar aynen kalır.
- **İzin:** AB, AEA, Birleşik Krallık ve İsviçre'de açılışta Google'ın izin penceresi (UMP) çıkar. Oyuncu kararını menüdeki **REKLAM GİZLİLİK AYARLARI** ile değiştirebilir. iOS takip izni (ATT) sorulmaz.

### Kimlikler: tek dosya, `admob.config.json`

Bütün AdMob kimlikleri yalnızca **`uygulama/admob.config.json`** dosyasındadır. **Şimdilik Google'ın resmi TEST kimlikleri var**: yalnızca "Test Ad" etiketli reklam çıkar, AdMob hesabın riske girmez.

| Alan | Ne | Biçim |
| --- | --- | --- |
| `android.appId`, `ios.appId` | Uygulama kimliği (AdMob › Uygulamalar › uygulama ayarları) | `ca-app-pub-…~…` |
| `banner`, `interstitial`, `rewarded` | Reklam birimleri: şerit, oyun arası, ödüllü | `ca-app-pub-…/…` |
| `testDevices` | Gerçek kimliklerle kendi telefonunda denerken o telefonun test cihazı kimliği (Logcat'te `setTestDeviceIds` satırında yazar). O telefonda yalnızca test reklamı çıkar | `["33BE…"]` |

Gerçek kimlikleri yazınca `npx cap sync` çalıştır. Gerisi kendiliğinden olur:

- **Android:** `android/app/build.gradle` uygulama kimliğini her derlemede bu dosyadan okuyup `AndroidManifest.xml`'deki `com.google.android.gms.ads.APPLICATION_ID`'ye yazar.
- **iOS:** `npx cap sync` sonrasında `scripts/admob-ayarla.mjs` çalışır ve uygulama kimliğini `ios/App/App/Info.plist` › `GADApplicationIdentifier`'a yazar.
- **Oyun:** reklam birimlerini uygulamanın içine konan kopyadan okur. Dosya yoksa ya da bir kimlik bozuksa o kimlik için Google'ın test kimliğini kullanır.
- **Denetim:** biçimi yanlış (`~` ile `/` karışmış) ya da başka hesaba ait bir kimlik varsa `npx cap sync` ve Android derlemesi hata verip durur. Elle denetlemek için `npm run admob` çalıştır.

Ayrıca sitenin köküne `app-ads.txt` konur (`google.com, pub-…, DIRECT, f08c47fec0942fa0`; `pub-…` uygulama kimliğindeki numaradır).

## Seviye, günlük görevler ve ses

- **Seviye ve rütbe:** her oyunda kazanılan puan XP olarak cihazda birikir. Seviye 1'den başlar; rütbeler **ÇAYLAK** (1-4), **STRATEJİST** (5-11), **BLOK USTASI** (12-21), **BÜYÜK USTA** (22-34), **EFSANE** (35+). Ana menüde ayarların üstünde seviye, rütbe ve ilerleme çubuğu; oyun sonunda o oyunda kazanılan XP.
- **Günlük görevler:** seviye satırına dokununca her gün yenilenen 3 görev (ör. 15 çizgi patlat, KOMBO ×2 yap, tek oyunda 7.500 puan). Üçü bitince **ÖDÜLÜ AL**: seçilen jokere +1 hak (oyun başına ücretsiz hak bitince kullanılır, süresi dolmaz).
- **Ses motoru:** bütün efektler Web Audio ile anında üretilir (ses dosyası yok); kombolarda patlatma sesi pentatonik gamda bir nota yükselir. Ana menüdeki **SES** kaydırıcısı (%0-%100) ana kazancı sürer (efektler ve menü müziği); çıkışta yumuşak sıkıştırıcı ve tavan cızırtıyı önler. Ses bağlamı ilk dokunuşta kurulur.

## Reklamsız oyun (uygulama içi satın alma)

Uygulama, `@capgo/native-purchases` (8.9.16; Google Play Billing 9, iOS StoreKit 2) eklentisiyle **tek seferlik** bir ürün satar: **REKLAMSIZ OYUN**. Satın alan oyuncuda şerit ve oyun arası reklam çıkmaz; ödüllü reklamlar (joker hakkı, ikinci şans) isteğe bağlı kalır. Sitede satın alma yoktur.

- **Ana menüde REKLAMLARI KALDIR** düğmesi (mağazanın fiyatıyla) ve **oyun her açıldığında** (ve uygulamaya 30 dakikadan uzun aradan sonra dönülünce) bir kez küçük bir pencere: başlık, açıklama, **SATIN AL ₺100,00**, **ŞİMDİ DEĞİL**, **SATIN ALIMI GERİ YÜKLE**. Pencere ana menü açıkken çıkar; takma ad, izin (UMP) ya da başka bir pencere varken bekler, oyuncu o arada oyuna başladıysa çıkmaz.
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

Uygulama › **Uygulama İçi Satın Almalar** › **Tüketilmeyen** (Non-Consumable): ürün kimliği **`reklamsiz`**, fiyat 100 TRY'ye en yakın basamak, görünen ad ve açıklama (mağaza metinleri dosyasında). İlk ürün, uygulamanın bir sürümüyle birlikte incelemeye gönderilir. iOS'ta **SATIN ALIMI GERİ YÜKLE** zorunludur, pencerede var.

## Mağaza bağlantıları

- Gizlilik politikası: https://heroblock.herouygulama.com.tr/gizlilik.html
- Kullanım koşulları: https://heroblock.herouygulama.com.tr/kosullar.html
- Destek: https://heroblock.herouygulama.com.tr/destek.html
- Hesap ve veri silme: https://heroblock.herouygulama.com.tr/veri-silme.html
