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
  { url: '/', revision: null }, // Explicitly precache the root path, which typically resolves to index.html
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

// Cache static assets (CSS, JS, images, fonts, manifest)
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.url.endsWith('/manifest.json'), // Explicitly cache manifest.json
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
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      console.log('Serving offline.html for navigation request:', request.url);
      return offlinePage;
    }
    // Fallback if offline.html is somehow not in cache (highly unlikely due to precaching)
    console.error('Offline page not found in cache, serving generic network error for navigation:', request.url);
    return new Response('Offline page not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain' })
    });
  }
  // For other types of requests, return a generic network error response.
  // This provides a more consistent offline experience than letting the browser handle it.
  console.warn('Network error for non-navigation request:', request.url);
  return new Response('Network error', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({ 'Content-Type': 'text/plain' })
  });
});

// Handle message from client to skip waiting and activate new service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // `self.skipWaiting()` forces the waiting service worker to become the active service worker.
    // This is often used in conjunction with a "New content available, click to refresh" UI.
    self.skipWaiting();
  }
});

// Add sync event listener for background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-causal-matrices') {
    // Notify all open clients that a background sync for causal matrices has occurred
    event.waitUntil(
      (async () => {
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_PENDING_CAUSAL_MATRICES' });
        });
      })()
    );
  }
});

