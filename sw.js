const CACHE_NAME = 'mis-org-v3';

self.addEventListener('install', (event) => {
  // Installs unconditionally so Chrome never fails the PWA check
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let Firebase Auth and Firestore bypass caching directly
  if (
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('identitytoolkit.googleapis.com') ||
    event.request.url.includes('apis.google.com')
  ) {
    return;
  }

  // Network-first fetch handler required by Chrome PWA specs
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
