/* Hero Block: çevrimdışı oynama için hizmet çalışanı (service worker).
   Oyun bir kez internetle açılınca oyunun dosyaları telefona kaydedilir; sonra bağlantı ve ana ekran
   simgesi internet olmadan da çalışır.
   - Oyun sayfası: önce internet (en yeni sürüm gelsin); bağlantı yoksa ya da 3 sn içinde yanıt gelmezse kayıtlı kopya.
   - Diğer sayfalar (gizlilik politikası, kullanım koşulları, destek, veri silme): önce internet, bağlantı yoksa kayıtlı kopyası.
   - Yazı tipleri ve simgeler: önce kayıtlı kopya.
   - version.json hiç kaydedilmez: açık kalan oyun yeni sürümü buradan öğrenir. */
'use strict';
const VERSION = '896f164536';
const CACHE = 'blok-kahramani-' + VERSION;
const SHELL = ["./", "gizlilik.html", "kosullar.html", "destek.html", "veri-silme.html", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "favicon-32.png", "muzik/ana-menu.mp3", "fonts/rajdhani-600-latin-ext.woff2", "fonts/rajdhani-600-latin.woff2", "fonts/rajdhani-700-latin-ext.woff2", "fonts/rajdhani-700-latin.woff2", "fonts/russo-one-400-latin-ext.woff2", "fonts/russo-one-400-latin.woff2"];
const INDEX = new URL('./', self.registration.scope).href;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('blok-kahramani-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (new URL(req.url).pathname.endsWith('/version.json')) return; // her zaman internetten
  if (req.mode === 'navigate' && !/\/(index\.html)?$/.test(new URL(req.url).pathname)) {
    e.respondWith(fetch(req).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match(INDEX))));
    return;
  }
  if (req.mode === 'navigate') {
    // Oyun sayfası: internetten gelen yeni sürüm kaydedilir; gelmezse kayıtlı kopya açılır
    const net = fetch(req);
    e.waitUntil(net.then(res => {
      if (res.ok && !res.redirected) { const copy = res.clone(); return caches.open(CACHE).then(c => c.put(INDEX, copy)); }
    }).catch(() => {}));
    const slow = new Promise((_, reject) => setTimeout(() => reject(new Error('yavaş bağlantı')), 3000));
    e.respondWith(Promise.race([net, slow]).catch(() => caches.match(INDEX).then(hit => hit || net)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
