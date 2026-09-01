/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: (string | { url: string; revision: string | null })[];
};

const CACHE_NAME = 'menteencalma-cache-v1';
const OFFLINE_URL = '/offline.html'; // Define an offline fallback page

// This will be replaced by the Workbox build process with the list of files to precache
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  console.log('PWA Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PWA Service Worker: Caching offline page');
        return cache.add(OFFLINE_URL);
      })
      .catch((error) => {
        console.error('PWA Service Worker: Offline page caching failed', error);
      })
  );
  self.skipWaiting(); // Ensure the new service worker activates immediately after installation
});

// Navigation route: always try network first for navigation, then fall back to offline page
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'navigations',
    plugins: [
      {
        fetchDidSucceed: async ({ request, response }) => {
          // If the network request was successful but the status is not 2xx,
          // treat it as a failure to trigger handlerDidError.
          if (response.status >= 300 || response.status === 0) {
            console.warn(`PWA Service Worker: Network navigation for ${request.url} returned status ${response.status}. Falling back to offline.`);
            throw new Error('Non-2xx network response for navigation');
          }
          return response;
        },
        handlerDidError: async ({ request }) => {
          console.warn(`PWA Service Worker: NetworkFirst failed for ${request.url}. Attempting to serve offline page.`);
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) {
            return offlinePage;
          }
          // If the offline page itself is not cached, return a generic fallback
          console.error('PWA Service Worker: Offline page not found in cache. Serving generic offline fallback.');
          return new Response('<h1>Offline</h1><p>You are currently offline.</p>', {
            headers: { 'Content-Type': 'text/html' },
            status: 503,
            statusText: 'Service Unavailable',
          });
        },
      },
    ],
  })
);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache opaque responses and successful responses
      }),
    ],
  })
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'worker' ||
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

self.addEventListener('activate', (event) => {
  console.log('PWA Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const expectedCacheNames = [CACHE_NAME, 'navigations', 'images', 'static-resources'];
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCacheNames.includes(cacheName)) {
            console.log('PWA Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => {
      self.clients.claim();
      console.log('PWA Service Worker: Clients claimed.');
    })
  );
});

