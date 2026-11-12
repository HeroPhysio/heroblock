# Hero Block · Google Play ve App Store uygulaması

Bu klasör, Hero Block oyununun telefon uygulamasıdır. Oyun aynı oyun; [Capacitor](https://capacitorjs.com) ile Android ve iOS uygulamasına sarılır.

- Paket / Bundle ID: `tr.com.herouygulama.heroblock`
- Uygulama adı (telefonda): **Hero Block**
- Android: en düşük Android 7 (API 24), hedef API 36 · iOS: en düşük iOS 15

## Klasörler

| Klasör | Ne var |
| --- | --- |
| `www/` | Oyunun uygulama sürümü (yazı tipleri ve menü müziği içinde; internetsiz açılır) |
| `android/` | Android Studio projesi (Google Play için `.aab`) |
| `ios/` | Xcode projesi (App Store için) |
| `assets/` | Simge ve açılış ekranı kaynakları |

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

## Elle derleme (isteğe bağlı)

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

## Reklamlar (Google AdMob)

Uygulama, `@capacitor-community/admob` (8.3.0) eklentisiyle reklam gösterir. Sitede reklam yoktur.

- **Şerit (banner):** ekranın en altında, güvenli bölgenin üstünde. Tahta, raf ve jokerler reklamın üstünde kalır.
- **Oyun arası reklam:** ilk 2 oyunda çıkmaz. Sonra her 3 **TEKRAR OYNA**'da bir kez çıkar.
- **Ödüllü reklam:** isteğe bağlıdır. Hakkı biten jokere +1 hak verir. **YER KALMADI** penceresinde oyun başına bir kez ikinci şans verir (3x3 alan temizlenir).
- **İzin:** AB, AEA, Birleşik Krallık ve İsviçre'de açılışta Google'ın izin penceresi (UMP) çıkar. Oyuncu kararını menüdeki **REKLAM GİZLİLİK AYARLARI** ile değiştirebilir. iOS takip izni (ATT) sorulmaz.

**Şimdilik Google'ın TEST kimlikleri var** (yalnızca "Test Ad" çıkar). Yayından önce AdMob'da Android ve iOS için birer uygulama ve her birine 3 reklam birimi (ödüllü, geçiş, banner) açılır. Kimlikler şu yerlere yazılır:

| Nerede | Ne |
| --- | --- |
| `www/index.html` › `REKLAM_KIMLIK` | 6 reklam birimi kimliği (`ca-app-pub-…/…`), Android ve iOS için ayrı |
| `android/app/build.gradle` › `admobAppId` | Android uygulama kimliği (`ca-app-pub-…~…`). Derlemede `-PADMOB_APP_ID=…` ya da `ADMOB_APP_ID` ortam değişkeniyle de verilebilir |
| `ios/App/App/Info.plist` › `GADApplicationIdentifier` | iOS uygulama kimliği (`ca-app-pub-…~…`) |

Ayrıca sitenin köküne `app-ads.txt` konur (`google.com, pub-…, DIRECT, f08c47fec0942fa0`).

## Mağaza bağlantıları

- Gizlilik politikası: https://heroblock.herouygulama.com.tr/gizlilik.html
- Kullanım koşulları: https://heroblock.herouygulama.com.tr/kosullar.html
- Destek: https://heroblock.herouygulama.com.tr/destek.html
- Hesap ve veri silme: https://heroblock.herouygulama.com.tr/veri-silme.html
