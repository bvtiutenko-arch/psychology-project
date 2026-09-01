/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

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
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('PWA Service Worker: Offline page caching failed', error);
      })
  );
});

// Navigation route: always try network first for navigation, then fall back to offline page
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'navigations',
    plugins: [
      {
        handlerDidError: async () => caches.match(OFFLINE_URL),
      },
    ],
  })
);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
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

