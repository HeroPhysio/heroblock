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

## Paylaşım (Arkadaşına meydan oku)

**KAYBETTİN** ekranındaki **ARKADAŞINA MEYDAN OKU** düğmesi, uygulamada `@capacitor/share` (8.0.3) eklentisiyle telefonun paylaşım menüsünü açar (eklenti yoksa bağlantı panoya kopyalanır). Paylaşılan bağlantı oyunun sitesidir: `https://heroblock.herouygulama.com.tr/?challenge=KOD&target=SKOR&name=AD`. Bağlantı şimdilik tarayıcıda, sitede açılır; telefonda uygulama yüklüyse doğrudan uygulamada açılması için Android App Links (sitede `/.well-known/assetlinks.json`, Play Console › Uygulama bütünlüğü › Uygulama imzalama anahtarı sertifikasının SHA-256 parmak izi) ve iOS Universal Links ayrıca kurulmalıdır.

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

## Mağaza bağlantıları

- Gizlilik politikası: https://heroblock.herouygulama.com.tr/gizlilik.html
- Kullanım koşulları: https://heroblock.herouygulama.com.tr/kosullar.html
- Destek: https://heroblock.herouygulama.com.tr/destek.html
- Hesap ve veri silme: https://heroblock.herouygulama.com.tr/veri-silme.html
