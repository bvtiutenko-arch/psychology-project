import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

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
