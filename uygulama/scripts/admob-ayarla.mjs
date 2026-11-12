#!/usr/bin/env node
/* Google AdMob kimliklerini tek dosyadan (admob.config.json) uygulamaya dağıtır.
   "npx cap copy" ve "npx cap sync" bitince kendiliğinden çalışır (package.json › "capacitor:copy:after" ve
   "capacitor:sync:after"; kimlik yanlışsa "npx cap sync" hata verip durur). Elle: npm run admob
     • Oyunun okuduğu kopya: android/app/src/main/assets/public/admob.config.json ve ios/App/App/public/admob.config.json
       (oyun reklam birimi kimliklerini buradan alır; dosya yoksa Google'ın test kimliklerini kullanır)
     • iOS uygulama kimliği: ios/App/App/Info.plist › GADApplicationIdentifier
   Android uygulama kimliğini (AndroidManifest › com.google.android.gms.ads.APPLICATION_ID) android/app/build.gradle her
   derlemede doğrudan bu dosyadan okur. Biçimi yanlış bir kimlik varsa işlem durur (yanlış kimlikle paket çıkmasın). */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = process.env.CAPACITOR_ROOT_DIR || join(dirname(fileURLToPath(import.meta.url)), '..');
const DOSYA = join(KOK, 'admob.config.json');
const GOOGLE_TEST = '3940256099942544'; // Google'ın test yayıncı numarası
const UYGULAMA = /^ca-app-pub-(\d{16})~(\d{10})$/;
const BIRIM = /^ca-app-pub-(\d{16})\/(\d{10})$/;
const BIRIMLER = ['banner', 'interstitial', 'rewarded'];
const PLATFORMLAR = ['android', 'ios'];
const HEDEF = {
  android: join(KOK, 'android', 'app', 'src', 'main', 'assets', 'public'),
  ios: join(KOK, 'ios', 'App', 'App', 'public')
};
const PLIST = join(KOK, 'ios', 'App', 'App', 'Info.plist');

function dur(mesaj) {
  console.error(`\n[admob] HATA: ${mesaj}\n[admob] Düzelt: ${DOSYA}\n`);
  process.exit(1);
}

let ayar;
try {
  ayar = JSON.parse(readFileSync(DOSYA, 'utf8'));
} catch (e) {
  dur(`admob.config.json okunamadı (${e.message})`);
}

// Denetim: biçim ve aynı hesap. Gerçek bir uygulama kimliğinin yanında Google'ın test birimleri olabilir (deneme için);
// gerçek birimler ise yalnızca kendi hesabının uygulama kimliğiyle çalışır.
const oyun = {};
const ozet = [];
for (const p of PLATFORMLAR) {
  const a = ayar && ayar[p];
  if (!a || typeof a !== 'object') dur(`"${p}" bölümü yok`);
  const appId = String(a.appId ?? '').trim();
  const u = UYGULAMA.exec(appId);
  if (!u) dur(`${p}.appId biçimi yanlış: "${appId}" (ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY olmalı; '~' işaretine dikkat)`);
  oyun[p] = {};
  let test = u[1] === GOOGLE_TEST ? 1 : 0;
  for (const f of BIRIMLER) {
    const v = String(a[f] ?? '').trim();
    const m = BIRIM.exec(v);
    if (!m) dur(`${p}.${f} biçimi yanlış: "${v}" (ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY olmalı; '/' işaretine dikkat)`);
    if (m[1] !== u[1] && m[1] !== GOOGLE_TEST) dur(`${p}.${f} başka bir AdMob hesabının birimi (birim: ${m[1]}, uygulama: ${u[1]})`);
    if (m[1] === GOOGLE_TEST) test++;
    oyun[p][f] = v;
  }
  oyun[p].appId = appId;
  ozet.push(`${p}: ${test === 4 ? 'Google TEST kimlikleri (gerçek reklam çıkmaz)' : test === 0 ? 'GERÇEK kimlikler' : 'karışık (bazı kimlikler hâlâ test)'}`);
}
const testDevices = ayar.testDevices ?? [];
if (!Array.isArray(testDevices) || testDevices.some(d => typeof d !== 'string' || !/^[A-Za-z0-9-]{8,64}$/.test(d.trim()))) {
  dur('testDevices, test cihazı kimliklerinden oluşan bir liste olmalı (örnek: ["33BE2250B43518CCDA7DE426D04EE231"])');
}
oyun.testDevices = testDevices.map(d => d.trim());

// Oyunun okuduğu kopya: yalnızca kopyalanan platform (elle çalıştırılınca ikisi de, klasörü varsa)
const platform = process.env.CAPACITOR_PLATFORM_NAME;
const yazildi = [];
for (const p of PLATFORMLAR) {
  if (platform && platform !== p) continue;
  if (!existsSync(HEDEF[p])) continue;
  writeFileSync(join(HEDEF[p], 'admob.config.json'), JSON.stringify(oyun) + '\n');
  yazildi.push(p);
}

// iOS uygulama kimliği (Info.plist): her çalışmada eşitlenir, böylece depodaki dosya da hep güncel kalır
let plist = '';
if (existsSync(PLIST)) {
  const eski = readFileSync(PLIST, 'utf8');
  const kalip = /(<key>GADApplicationIdentifier<\/key>\s*<string>)[^<]*(<\/string>)/;
  if (!kalip.test(eski)) dur(`Info.plist içinde GADApplicationIdentifier bulunamadı (${PLIST})`);
  const yeni = eski.replace(kalip, `$1${oyun.ios.appId}$2`);
  if (yeni !== eski) { writeFileSync(PLIST, yeni); plist = 'güncellendi'; } else plist = 'güncel';
}

console.log(`[admob] ${ozet.join(' · ')} · test cihazı: ${oyun.testDevices.length}`);
console.log(`[admob] oyuna kopya: ${yazildi.length ? yazildi.join(', ') : 'yok (önce npx cap sync)'}${plist ? ` · iOS Info.plist ${plist}` : ''} · Android kimliği derlemede okunur`);
if (ozet.every(s => s.includes('TEST'))) console.log('[admob] Yayından önce AdMob hesabındaki gerçek kimlikleri admob.config.json dosyasına yaz.');
