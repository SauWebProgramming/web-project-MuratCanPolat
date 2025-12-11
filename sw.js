const CACHE_NAME = 'agar-clone-v1.3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/game.js',
  './js/player.js',
  './js/bot.js',
  './js/food.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Eski cache silindi:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});