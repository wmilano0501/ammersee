const CACHE = 'ammersee-v1';
const OFFLINE_FILES = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Netzwerk-Anfragen (API-Calls) immer live lassen
  if (e.request.url.includes('api.')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // App-Shell: Cache first, Netzwerk als Fallback
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
