const CACHE_NAME = 'albanien-guide-v1';
// Hier alle Dateien eintragen, die offline verfügbar sein müssen
const ASSETS = [
  'index.html',
  'manifest.json',
  'sw.js',
  'pics/header.png', // <-- Hier auch den Ordner "pics/" davorpacken!
  'pics/icon_192.png',
  'pics/icon_512.png'
];

// Beim Installieren der App werden die Dateien in den Cache geladen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Dateien werden gecacht');
      return cache.addAll(ASSETS);
    })
  );
});

// Aktivierung und Löschen alter Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Netzwerk-Anfragen abfangen: Erst im Cache suchen, sonst Netzwerk
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
