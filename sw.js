const CACHE_NAME = 'albanien-guide-v22';

// Hier alle Dateien eintragen, die offline verfügbar sein müssen (mit ./ für stabileres Routing)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './pics/header.png',
  './pics/icon_192.png',
  './pics/icon_512.png'
];

// Beim Installieren der App werden die Dateien in den Cache geladen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Dateien werden gecacht');
      return cache.addAll(ASSETS);
    })
  );
  // Zwingt den wartenden Service Worker, sofort aktiv zu werden
  self.skipWaiting();
});

// Aktivierung und Löschen alter Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Alten Cache gelöscht:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Übernimmt sofort die Kontrolle über alle geöffneten Tabs/Installationen
      return self.clients.claim();
    })
  );
});

// Netzwerk-Anfragen abfangen: Erst im Cache suchen, sonst Netzwerk
self.addEventListener('fetch', event => {
  // Nur GET-Anfragen abfangen (wichtig für Browser-Erweiterungen)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});