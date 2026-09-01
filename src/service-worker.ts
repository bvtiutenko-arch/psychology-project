import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope;

// This will be replaced by the build process with a list of URLs to precache
// Ensure offline.html is always precached
precacheAndRoute([
  ...self.__WB_MANIFEST,
  { url: '/offline.html', revision: null },
]);

// Cache page navigations (HTML)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses and successful ones
      }),
    ],
  })
);

// Cache static assets (CSS, JS, images, fonts)
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker' ||
    request.destination === 'image' ||
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache Firebase Firestore data (if applicable) - using NetworkFirst for fresh data
// This is a placeholder, actual Firestore caching might need more specific rules
registerRoute(
  ({ url }) => url.origin === 'https://firestore.googleapis.com',
  new StaleWhileRevalidate({ // Changed from NetworkFirst to StaleWhileRevalidate for better offline experience
    cacheName: 'firestore-data',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses and successful ones
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60, // 1 Hour
      }),
    ],
  })
);

// Offline fallback for navigation requests
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // If network fails, try to get from cache
          const cache = await caches.open('pages');
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache, serve offline.html
          return caches.match('/offline.html') || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        }
      })()
    );
  }
});

// Handle message from client to skip waiting and activate new service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Add sync event listener for background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-causal-matrices') {
    console.log('Service Worker: Background sync event received for causal matrices.');
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_PENDING_CAUSAL_MATRICES' });
        });
      })
    );
  }
});

