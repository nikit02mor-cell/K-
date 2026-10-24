// Service worker: делает страницу доступной офлайн и подтягивает обновления.
// При выпуске новой версии достаточно поменять номер в CACHE.
const CACHE = "trigonometry-svincompany-v1";
const CORE = [
  "./trigonometry.html",
  "./manifest-trigonometry.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Рекламу и прочие чужие запросы не кэшируем: пропускаем всё, кроме шрифтов Google.
  if (url.origin !== location.origin && !/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) return;

  // Страница: сначала сеть (чтобы сразу видеть обновления), при отсутствии сети — кэш.
  if (req.mode === "navigate" || (url.origin === location.origin && url.pathname.endsWith("/trigonometry.html"))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./trigonometry.html", copy));
          return res;
        })
        .catch(() => caches.match("./trigonometry.html"))
    );
    return;
  }

  // Остальное (иконки, шрифты Google): из кэша, а в фоне обновляем.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
