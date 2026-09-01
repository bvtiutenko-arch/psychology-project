import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
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

// This will be the global catch handler for any failed requests.
// It's particularly useful for navigation requests that fail to fetch or find a cached response.
setCatchHandler(async ({ request }) => {
  if (request.mode === 'navigate') {
    return caches.match('/offline.html');
  }
  // For other types of requests, re-throw the error or return a generic error response
  // depending on desired behavior. Here, we'll just return undefined to let the browser handle it.
  return undefined;
});

// Handle message from client to skip waiting and activate new service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // This allows the new service worker to take control of the page immediately
    // after it has finished installing, without waiting for the user to close
    // all tabs or refresh the page.
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

