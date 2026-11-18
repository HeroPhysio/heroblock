# Hero Block

**Hero Uygulama Yazılım Teknolojileri Limited Şirketi** uygulamasıdır.
Kurucu: Baran Yavuz · İletişim: [iletisim@herouygulama.com.tr](mailto:iletisim@herouygulama.com.tr) · Web: [herouygulama.com.tr](https://herouygulama.com.tr)

8x8 tahtada oynanan blok bulmaca oyunu. Oyun Google Play (ve ileride App Store) uygulamasında oynanır.

## Site: https://heroblock.herouygulama.com.tr/

Bu deponun kökü GitHub Pages ile yayınlanan **tanıtım ve indirme sayfasıdır**; sitede oyun oynanmaz.

| Dosya | Ne |
|---|---|
| `index.html` | Tanıtım sayfası: öne çıkanlar, ekran görüntüleri, Google Play düğmesi |
| `gizlilik.html` | [Gizlilik Politikası ve KVKK Aydınlatma Metni](https://heroblock.herouygulama.com.tr/gizlilik.html) (mağazalarda kayıtlı adres) |
| `kosullar.html` | [Kullanım Koşulları](https://heroblock.herouygulama.com.tr/kosullar.html) (mağazalarda kayıtlı adres) |
| `destek.html` | [Destek](https://heroblock.herouygulama.com.tr/destek.html) |
| `veri-silme.html` | [Hesap ve veri silme](https://heroblock.herouygulama.com.tr/veri-silme.html) |
| `img/` | Ekran görüntüleri (WebP ve JPEG) |
| `og.jpg` | Bağlantı paylaşılınca görünen önizleme görseli (1200x630) |
| `sw.js` | Sitenin eski hâlinin tarayıcıya kaydettiği çevrimdışı oyun kopyasını siler ve kendini kaldırır |
| `fonts/` | Russo One ve Rajdhani (SIL Open Font License) |

**Google Play bağlantısı:** uygulama yayınlanınca mağaza adresi `index.html`'in başındaki `PLAY_URL` satırına yazılır:
`const PLAY_URL = 'https://play.google.com/store/apps/details?id=tr.com.herouygulama.heroblock';`
Boş kaldıkça indirme düğmeleri "YAKINDA Google Play'de" yazar ve tıklanmaz.

Uygulamadan paylaşılan düello (`?duel=`) ve meydan okuma (`?challenge=`) bağlantıları bu sayfayı açar; sayfa ziyaretçiye
bunların uygulamada oynandığını söyler.

## Uygulama: `uygulama/`

Google Play ve App Store uygulamasının (Capacitor) kaynağı; oyunun kendisi `uygulama/www/index.html`.
Derleme ve yayın adımları: [`uygulama/README.md`](uygulama/README.md).
