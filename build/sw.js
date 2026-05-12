const CACHE_STATIC = "static-v1";
const CACHE_IMAGES = "images-v1";
const CACHE_DATA = "data-v1";

// Archivos básicos (solo lo mínimo)
const APP_SHELL = [
  "/",
  "/index.html",
  "/logo.png",
  "/placeholder.jpg",
];
// ========================
// INSTALL
// ========================
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});
// ========================
// ACTIVATE
// ========================
self.addEventListener("activate", (event) => {
  self.clients.claim();

  const allowlist = [CACHE_STATIC, CACHE_IMAGES, CACHE_DATA];

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!allowlist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
// ========================
// FETCH
// ========================
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // ❌ Ignorar cosas de desarrollo o externas
  if (
    url.origin !== location.origin ||
    url.pathname.includes("sockjs") ||
    url.pathname.includes("hot-update")
  ) {
    return;
  }
  // ========================
  // 🖼️ IMÁGENES → cache-first
  // ========================
  if (request.destination === "image") {
    event.respondWith(
      caches.open(CACHE_IMAGES).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch {
          return caches.match("/placeholder.jpg");
        }
      })
    );
    return;
  }
  // ========================
  // 🌐 HTML → network-first
  // ========================
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }
  // ========================
  // ⚪ RESTO → network-first suave
  // ========================
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});