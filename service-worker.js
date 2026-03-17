const CACHE_NAME = 'testy-igo-2026-offline-v20260317-final2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const fallback = await caches.match('./index.html');
      return fallback || new Response('Offline', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
