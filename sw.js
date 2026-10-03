/* Gym Tracker — optional offline cache.
   Only needed when the app is hosted on a web address (e.g. GitHub Pages) and
   should open without internet. Put this file in the same folder as the HTML
   file; the app registers it automatically. Opening the HTML file directly
   from your device does not need it. */
const CACHE = 'gym-tracker-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Serve from the cache instantly and refresh the cached copy in the background,
// so the app starts offline and picks up a new version on the next launch.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req)
      .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
      .catch(() => cached);
    return cached || fresh;
  }));
});
