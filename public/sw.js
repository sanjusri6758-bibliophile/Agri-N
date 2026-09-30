// AgriN Progressive Web App Service Worker
// Provides offline resilience for farmers in remote areas with low or zero connectivity.

const CACHE_NAME = 'agrin-static-v1';
const API_CACHE_NAME = 'agrin-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/src/main.tsx',
  '/src/index.css'
];

// Install Event - Pre-cache critical app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[AgriN SW] Pre-caching non-fatal asset warning:', err);
      });
    })
  );
});

// Activate Event - Clean up stale cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interception
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests for cache matching
  if (request.method !== 'GET') {
    return;
  }

  // Handle API Requests (Network First with Cache Fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone and update cache
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed: attempt to serve from API cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // Return graceful synthetic offline JSON payload if not in cache
          return new Response(
            JSON.stringify({
              success: true,
              offline: true,
              message: 'Served from AgriN Offline Cache. You are currently operating in low-connectivity mode.',
              timestamp: new Date().toISOString()
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            }
          );
        })
    );
    return;
  }

  // Handle Static Assets & Navigation (Stale-While-Revalidate / Cache First)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Return index.html for navigation when completely offline
          if (request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for messages from frontend
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
