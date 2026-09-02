import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

// Fallback to cached app shell for navigation requests when offline
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkOnly({
    plugins: [
      {
        handlerDidError: async () => {
          return (await matchPrecache('/index.html')) || (await matchPrecache('/offline.html')) || Response.error();
        },
      },
    ],
  })
);

// Listen for background sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-causal-matrices') {
    event.waitUntil(
      (self as any).clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients: any[]) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_PENDING_CAUSAL_MATRICES' });
        });
      })
    );
  }
});

// Handle skip waiting for PWA updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
