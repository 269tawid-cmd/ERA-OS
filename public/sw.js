const CACHE_NAME = 'era-os-v0.1.0';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  /* Notify all clients that service worker is active — system persistence */
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          message: 'System continuity module active',
          timestamp: Date.now(),
        });
      });
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.hostname !== self.location.hostname) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const contentType = networkResponse.headers.get('content-type') || '';
            if (contentType.includes('text/css') || contentType.includes('text/html')) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
          }
          return networkResponse;
        })
        .catch(() => {
          /* When offline, cached response is returned — operations continue */
          if (cachedResponse) {
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: 'OFFLINE_MODE',
                  message: 'Operations continuing in local mode',
                  timestamp: Date.now(),
                });
              });
            });
          }
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

/* Listen for client connectivity changes */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'ONLINE_RESTORED') {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'LINK_RESTORED',
          message: 'Link restored — synchronizing',
          timestamp: Date.now(),
        });
      });
    });
  }
});
