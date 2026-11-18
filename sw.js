/* Hero Block: site artık oyunun tanıtım ve indirme sayfası; oyun sitede oynanmıyor.
   Sitenin eski hâli oyunu çevrimdışı oynatmak için dosyalarını tarayıcıya kaydediyordu. Oyunu daha önce açmış
   tarayıcılar bu dosyayı güncelleme olarak alır: kayıtlı kopyayı siler ve kendini kaldırır. Sayfa her zaman
   internetten gelir. */
'use strict';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k.startsWith('blok-kahramani-')).map(k => caches.delete(k)));
    } catch (err) { /* önbellek yok */ }
    try { await self.registration.unregister(); } catch (err) { /* zaten kaldırılmış */ }
  })());
});
