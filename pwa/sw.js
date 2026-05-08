/**
 * Service Worker for MD Helper - Cache-first strategy.
 */

const CACHE_NAME = 'md-helper-v1';
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '');

function asset(path) {
  return BASE_PATH + path;
}

const OFFLINE_PAGE = asset('/offline.html');

const STATIC_ASSETS = [
  OFFLINE_PAGE,
  asset('/index.html'),
  asset('/css/main.css'),
  asset('/css/base/_variables.css'),
  asset('/css/base/_reset.css'),
  asset('/css/base/_utilities.css'),
  asset('/css/components/_app.css'),
  asset('/css/components/_header.css'),
  asset('/css/components/_editor.css'),
  asset('/css/components/_preview.css'),
  asset('/css/components/_toolbar.css'),
  asset('/css/components/_actions.css'),
  asset('/css/components/_dialog.css'),
  asset('/css/components/_toast.css'),
  asset('/css/components/_overlay.css'),
  asset('/css/components/_cheatsheet.css'),
  asset('/css/components/_divider.css'),
  asset('/js/main.js'),
  asset('/js/utils/helpers.js'),
  asset('/js/modules/storage.js'),
  asset('/js/modules/preview.js'),
  asset('/js/modules/undoRedo.js'),
  asset('/js/modules/editor.js'),
  asset('/js/modules/findReplace.js'),
  asset('/js/modules/dragDrop.js'),
  asset('/js/modules/export.js'),
  asset('/js/modules/toast.js'),
  asset('/js/modules/layout.js'),
  asset('/js/modules/keyboard.js'),
  asset('/pwa/manifest.json'),
  asset('/pwa/icons/icon-192x192.png'),
  asset('/pwa/icons/icon-512x512.png'),
  // External CDN libraries
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
];

// Install - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    }).catch((err) => {
      console.log('SW install failed:', err);
      // Continue even if some assets fail
      return self.skipWaiting();
    })
  );
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch - cache-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        // Don't cache non-success responses
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Clone and cache successful responses
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_PAGE);
        }

        return new Response('Offline - MD Helper', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      });
    })
  );
});
