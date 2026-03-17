
const CACHE='igo-testy-2026-blue-final-v1';
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  if (e.request.method !== 'GET') return;
  e.respondWith((async()=>{
    const cached = await caches.match(e.request);
    if (cached) return cached;
    try {{
      return await fetch(e.request, {{cache:'no-store'}});
    }} catch(err) {{
      return cached;
    }}
  })());
});
