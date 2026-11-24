// Hero Coin satın almalarının sunucuda doğrulanması için Google'ın satın alma verisi (originalJson) ve imzası (signature)
// gerekir. @capgo/native-purchases bu iki alanı JavaScript'e vermez; bu betik eklentinin Android kaynağına, satın alma
// bilgisinin yazıldığı her yere bu iki alanı ekler. Tekrar çalıştırılırsa değişiklik yapmaz.
// Kullanım: node scripts/satin-alma-imza.mjs   (npm ci'den sonra, cap sync / gradle'dan önce)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const dosya = join(kok, 'node_modules/@capgo/native-purchases/android/src/main/java/ee/forgr/nativepurchases/NativePurchasesPlugin.java');
let kaynak = readFileSync(dosya, 'utf8');
const desen = /^(\s*)(\w+)\.put\("purchaseToken", purchase\.getPurchaseToken\(\)\);\n/gm;
let eklenen = 0;
let toplam = 0;
kaynak = kaynak.replace(desen, (satir, girinti, nesne, konum, tum) => {
  toplam++;
  const sonraki = tum.slice(konum + satir.length, konum + satir.length + 200);
  if (sonraki.includes('"originalJson"')) return satir;
  eklenen++;
  return satir +
    `${girinti}${nesne}.put("originalJson", purchase.getOriginalJson());\n` +
    `${girinti}${nesne}.put("signature", purchase.getSignature());\n`;
});
if (toplam !== 4) {
  console.error(`[satın alma imzası] beklenen 4 yer bulunamadı (${toplam}); eklenti sürümü değişmiş olabilir`);
  process.exit(1);
}
if (eklenen) writeFileSync(dosya, kaynak);
console.log(`[satın alma imzası] ${eklenen ? eklenen + ' yere eklendi' : 'zaten ekli'} (${toplam} yer)`);
