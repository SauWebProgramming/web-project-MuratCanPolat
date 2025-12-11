const CACHE_NAME = 'agar-clone-v1';
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