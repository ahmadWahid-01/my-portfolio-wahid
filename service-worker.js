self.addEventListener("install", e => {
  console.log("[SW] Installing...");
  e.waitUntil(
    caches.open("wahid-cache-v1").then(cache => {
      return cache.addAll([
        "/portfolio-wahid/",
        "/portfolio-wahid/index.html",
        "/portfolio-wahid/style.css",
        "/portfolio-wahid/script.js",
        "/portfolio-wahid/img/2.jpg",
        "/portfolio-wahid/img/icon-192.png",
        "/portfolio-wahid/img/icon-512.png"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  console.log("[SW] Activated");
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== "wahid-cache-v1")
            .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});