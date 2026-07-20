// Service Worker — Network First, fallback a Cache (solo assets/páginas públicas)
const CACHE_NAME = "milo-paints-v2";
const PRECACHE_URLS = ["/galeria"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

function shouldBypassCache(request) {
  const url = new URL(request.url);

  // Nunca cachear APIs ni métodos que no sean GET
  if (request.method !== "GET") return true;
  if (url.pathname.startsWith("/api/")) return true;

  // Solo same-origin
  if (url.origin !== self.location.origin) return true;

  return false;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (shouldBypassCache(request)) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
