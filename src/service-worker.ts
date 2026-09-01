/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'menteencalma-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx', // This will be replaced by the bundled JS in a real build
  '/src/App.tsx',
  '/src/index.css',
  '/src/components/auth/Login.tsx',
  '/src/components/causal/CausalMatrixForm.tsx',
  '/src/components/core/Dashboard.tsx',
  '/src/firebase.ts',
  '/src/hooks/useAuth.ts',
  '/src/services/patternEngine.ts',
  '/src/types/causal.ts',
  // Add other critical assets like images, fonts, etc.
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
  '/icons/maskable_icon.png',
  // Note: In a production build, these paths would typically point to the bundled
  // and hashed assets in the 'dist' folder. For now, we're listing source files
  // as a placeholder, assuming a build process will handle the actual asset paths.
  // A more robust solution would involve injecting these paths during the build.
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('Service Worker: Cache addAll failed', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        console.log('Service Worker: Serving from cache:', event.request.url);
        return response;
      }

      // No cache hit - fetch from network
      console.log('Service Worker: Fetching from network:', event.request.url);
      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and can only be consumed once. Since we are consuming this
        // once by the browser and once by the cache, we need to clone it.
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((error) => {
        console.error('Service Worker: Fetch failed:', event.request.url, error);
        // You could return an offline page here
        // return caches.match('/offline.html');
        throw error; // Re-throw to indicate fetch failure
      });
    })
  );
});
