# Hero Block

**Hero Uygulama Yazılım Teknolojileri Limited Şirketi** uygulamasıdır.
Kurucu: Baran Yavuz · İletişim: [iletisim@herouygulama.com.tr](mailto:iletisim@herouygulama.com.tr) · Web: [herouygulama.com.tr](https://herouygulama.com.tr)

8x8 tahtada oynanan blok bulmaca oyunu. Parçaları sürükle, dolan satır ve sütunları patlat, komboyu sürdür.

Puanlama: yerleştirilen her kare 5 puan, patlayan her kare 50 puan;
aynı hamlede 2 çizgi 2 kat, 3 çizgi 3 kat puan getirir ve hepsi kombo ile çarpılır.
Art arda her patlatma komboyu 1 artırır; 5 hamle boyunca hiç patlatma yapılmazsa kombo sıfırlanır.
Tahtayı birkaç çizgiyi ya da tüm tahtayı birden patlatacak şekilde hazırlarsan oyun çoğu zaman o işi bitirecek
parçayı da verir. Tahtayı tamamen boşaltmak (TAM TEMİZLİK!) 5.000 bonus puan getirir.
Puanlar Kasım 2026'dan beri ilk puanlamanın 5 katı (oyunun kodunda `PUAN_KAT = 5`). Skor sunucusu ve paylaşılan bağlantılar
ilk ölçekte kalır: sunucuya giden puan (skor tablosu, anonim istatistik) ile meydan okuma ve düello bağlantılarındaki puan
PUAN_KAT'a bölünür, gelen puan PUAN_KAT ile çarpılır. Böylece sunucunun puan denetimi aynen çalışır, eski bağlantılar ve eski
sürümler uyumlu kalır. Yönetim paneli (skor sunucusu sürüm 5'ten beri, sunucudaki `PUAN_KAT`) puanları oyunda görünen değerle gösterir;
panelden düzeltilen puan da oyundaki değerle yazılır. Cihazdaki rekor ve kayıtlı oyun ilk açılışta yeni ölçeğe çevrilir
(16 Kasım'da birkaç saat yayında kalan 10 kat puanlamanınkiler de).
Adil zorluk: tahta en çok %85 doluyken gelen üç parçadan en az biri her zaman boşluklara sığar (gerekirse son parça küçük bir
parçayla değişir: en az bir hamlelik kurtuluş şansı); tahta daha doluysa oyun normal biter.
Parçalar çeşitli gelir: aynı parça art arda pek gelmez, oyun ilerledikçe (puan ya da hamle) zorlaşır.
ARKADAŞINLA DÜELLO (bağlantıyla, uzaktan): önce düelloyu açan oynar (1, 2, 3 ya da 5 dakika), sonra BAĞLANTIYI GÖNDER ile
bağlantıyı paylaşır (?duel=KOD&n1=AD). Bağlantıyı açan arkadaş aynı tohumla, yani aynı parçalarla ve aynı sürede oynar; üstte
HEDEF görünür, yüksek puan kazanır. Arkadaş SONUCU GÖNDER ile sonuç bağlantısını yollar; RÖVANŞ'ta seri sürer. Bağlantıda
yalnızca tohum, süre, adlar, puan, çizgi, kombo ve seri vardır (bütünlük işaretli; sunucuya bir şey gitmez). Arkadaşın
uygulaması olmasa da bağlantı sitede açılır. Düelloda joker yok; düello tek kişilik oyunu ve rekoru etkilemez.
HAFTANIN EN İYİLERİ: ilk açılışta bir takma ad sorulur (geçilebilir); haftanın en yüksek puanlı 10 oyuncusu
ana ekranda görünür. Tablo her pazartesi 00:00'da (Türkiye saati) sıfırlanır; puanlar skor.herouygulama.com.tr'de tutulur.
Ses kesilirse "SES DURDU" düğmesi çıkar, dokununca ses geri gelir. Yeni sürüm yayımlanınca açık oyunda
"YENİ SÜRÜM VAR" düğmesi çıkar; oyun kayıtlı olduğu için güncelleme kaldığın yerden sürer.
Her 50.000 puanda tema değişir: 17 tema sırayla döner. Puan arttıkça oyun zorlaşır.
DİL: oyun Türkçe açılır; ana menüdeki (ve ilk açılıştaki takma ad penceresindeki) TÜRKÇE / ENGLISH seçiciyle
bütün oyun İngilizceye geçer, seçim cihazda hatırlanır.
JOKERLER: rafın altındaki DÖNDÜR (parçayı saat yönünde 90° çevirir), YENİLE (yeni üç parça) ve KARE SİL (dokunulan tek kareyi
patlatır) her yeni oyunda birer hakla başlar. Hiçbir parça sığmadığında işe yarar joker varsa oyun hemen bitmez.
REKLAMLAR (yalnızca Google Play ve App Store uygulamalarında, Google AdMob): altta şerit reklam, ilk 2 oyundan sonra her
3. TEKRAR OYNA'da bir oyun arası reklam, isteğe bağlı ödüllü reklamla jokere +1 hak ya da oyun başına bir kez ikinci şans
(tahta tamamen temizlenir; skor, kombo ve eldeki parçalar aynen kalır). Sitede reklam yoktur: hakkı biten joker sönük kalır,
ikinci şans düğmesi çıkmaz.
REKLAMSIZ OYUN (uygulama içi satın alma, yalnızca uygulamalarda, @capgo/native-purchases): tek seferlik, tüketilmeyen ürün
(Google Play / App Store ürün kimliği `reklamsiz`). Satın alan oyuncuda şerit ve oyun arası reklam çıkmaz; ödüllü reklamlar
isteğe bağlı kalır. Ana menüde REKLAMLARI KALDIR düğmesi (mağazanın fiyatıyla, ör. ₺100,00) ve oyun her açıldığında (ve
30 dakikadan uzun aradan sonra dönülünce) bir kez küçük bir pencere (ŞİMDİ DEĞİL, SATIN ALIMI GERİ YÜKLE). Fiyat mağazada
belirlenir (Play Console › Para kazanma › Uygulama içi ürünler); oyun fiyatı mağazadan okur. Ürün kimliği (`reklamsiz` ile
başlar), pencerenin adı ve açıklaması (Türkçe / İngilizce), satış ve açılış penceresi skor sunucusunun yönetim panelinden
(sürüm 6, Uzaktan ayar › REKLAMSIZ PAKET) değişir; `reklamsiz` ile başlayan herhangi bir ürünü almış oyuncu reklamsızdır, bu
yüzden farklı fiyatlı ikinci bir ürün (ör. `reklamsiz_150`) açıp panelden seçmek de olur. Satın alma cihazda da saklanır;
mağaza her açılışta yeniden sorulur (iade edilen satın alma geri alınır, sonradan onaylanan ödeme onaylanır).
ANA MENÜ / DURAKLAT: üst bilgide solda ⌂ (oyunu duraklatır, ana menüde DURAKLATILDI ve DEVAM ET) ve ↻ YENİDEN BAŞLAT; düello
ana menüde. Bilgisayarda Esc oyunu duraklatır, ana menüde Esc oyuna döndürür; uygulamada Android geri tuşu da ana menüye götürür.
SEVİYE VE RÜTBE: bütün oyunlarda kazanılan toplam puan XP olarak cihazda birikir; seviye 1'den başlar, seviye n'den n+1'e
(2.000 + 400 × (n − 1)) × PUAN_KAT XP. Rütbeler ÇAYLAK (1-4), STRATEJİST (5-11), BLOK USTASI (12-21), BÜYÜK USTA (22-34), EFSANE
(35+). Ana menüde ayarların üstünde seviye, rütbe ve ilerleme çubuğu; oyun sonunda kazanılan XP. İlk açılışta XP rekor kadar başlar.
GÜNLÜK GÖREVLER: her gün (cihazın yerel günü) günün tohumundan 3 görev (çizgi / parça, kombo / tek hamlede çok çizgi, tek oyunda
puan / joker). Üçü bitince ÖDÜLÜ AL: seçilen jokere +1 hak; ödül hakkı jokerin oyun başına ücretsiz hakkı bitince kullanılır, süresi
dolmaz (cihazda, en çok 99).
SES MOTORU (SoundEngine): Web Audio ile tamamen prosedürel, ses dosyası yok. pick 450→650 Hz, place 150→55 Hz (alçak geçiren),
clear komboya göre do majör pentatonik (523-1046 Hz) yükselen melodi ve çok çizgide akor, allClear 4 notalı zafer arpeji, joker
parıltısı, gameOver 330→277→220 Hz. Ana zincir: ANA KAZANÇ (ana menüdeki SES kaydırıcısı, %0-%100; menü müziği de ondan geçer) →
yumuşak sıkıştırıcı → yumuşak tavan (kırpma yok). Ses bağlamı ilk dokunuşta (pointerdown / touchstart) kurulur.
PARÇA DENGESİ (ağırlıklı havuz): çekirdek parçalar (2x2 kare, 1x2-1x4 çubuklar, küçük ve orta L, T, S/Z) %65, büyük parçalar
(3x3 kare, 1x5, büyük L, 2x3) %22, 1x1 %8 (art arda iki elde gelmez; tahta %70'ten fazla doluysa kurtarıcıdır), çapraz %5.
Bir elde en çok 1 çapraz, en çok 2 büyük parça ve tek bir 3x3. Günlük bulmaca ve düello aynı tablo ve kuralları kendi tohumlarıyla kullanır.
DUYURU: ana menüde, skor sunucusunun yönetim panelinden yazılan kısa bir duyuru görünebilir (oyuncu kapatabilir).
GÜNLÜK BULMACA: her gün herkese aynı 12-15 bloklu tahta ve aynı parça sırası (tarih tohum olur). Tahtayı temizle ya da günün
hedef puanına ulaş; çözülen günler takvimde işaretlenir, art arda çözülen günler seriyi (🔥) oluşturur. Joker ve ikinci şans yok.
ARKADAŞINA MEYDAN OKU: KAYBETTİN ekranındaki düğme oyunun bağlantısını paylaşır (?challenge=KOD&target=SKOR&name=AD). Bağlantıyı
açan arkadaş aynı parçaları aynı sırayla alır, üstte HEDEF görünür; hedefi geçince kutlama olur.
BLOK TEMALARI: NEON (varsayılan), KRİSTAL (ilk TAM TEMİZLİK), AHŞAP (3 günlük bulmaca), HEROPHYSIO (rekor 50.000; bloklarda zeminsiz HeroPhysio logosu).
Günlük bulmaca ve meydan okuma puanı rekoru ve haftalık tabloyu etkilemez.

**Oyna:** https://heroblock.herouygulama.com.tr/

Eski adres (herophysio.github.io/blok-kahramani) buraya yönlenir; oyuncuların o adresteki rekoru, kayıtlı oyunu,
takma adı ve ayarları ilk açılışta cihazın içinde yeni adrese taşınır.

**Gizlilik:** Sitede hesap, reklam, izleme ve çerez yok; oyun bitince sunucuya kişiyi tanımlamayan anonim bir istatistik gider. Google Play ve App Store uygulamaları Google AdMob reklamları
gösterir (AB, AEA, Birleşik Krallık ve İsviçre'de Google'ın izin penceresiyle); reklamları kaldıran isteğe bağlı satın almanın
ödemesini mağaza alır, ödeme bilgisi bize gelmez. Skor tablosuna katılmak isteğe bağlıdır
(takma ad ve haftalık puan); diğer oyun bilgileri yalnızca cihazda saklanır.
Ayrıntılar: [Gizlilik Politikası ve KVKK Aydınlatma Metni](https://heroblock.herouygulama.com.tr/gizlilik.html) · [Kullanım Koşulları](https://heroblock.herouygulama.com.tr/kosullar.html) ·
[Destek](https://heroblock.herouygulama.com.tr/destek.html) · [Hesap ve veri silme](https://heroblock.herouygulama.com.tr/veri-silme.html)

Skor tablosunda uygunsuz bir takma ad gören oyuncu, adın yanındaki ⋮ düğmesiyle onu şikayet edebilir ya da engelleyebilir.

İnternet olmadan da oynanır: oyunu bir kez internetle açınca dosyaları cihaza kaydedilir (`sw.js`).
iPhone'da Safari'de açıp Paylaş → Ana Ekrana Ekle ile uygulama gibi tam ekran oynayabilirsin.
Oyunun tamamı tek dosya: `index.html` (HTML, CSS ve JavaScript). Ana menü müziği `muzik/ana-menu.mp3`. Yazı tipleri `fonts/` klasöründe
(Rajdhani ve Russo One, SIL Open Font License).
