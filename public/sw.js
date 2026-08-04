/*
 * Temporary cleanup worker for the legacy PWA service worker.
 * It clears old caches and unregisters itself after activation.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        ),
      ),
      self.registration.unregister(),
    ]).then(() =>
      self.clients
        .matchAll({ type: "window" })
        .then((windowClients) => {
          windowClients.forEach((windowClient) => {
            windowClient.navigate(windowClient.url);
          });
        }),
    ),
  );
});
