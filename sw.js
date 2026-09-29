/* Toy Haven — Service Worker
   Caches the app shell so the site's core pages load offline after a first
   visit. Data still relies on localStorage, which already works offline. */

const CACHE_NAME = "toy-haven-v3";

importScripts("js/data.js");

const PRODUCT_IMAGES = TOY_HAVEN_PRODUCTS.map((p) => p.image);
const CATEGORY_IMAGES = [
  ...Object.values(TOY_HAVEN_CATEGORIES).map((c) => c.tileImage),
  ...TOY_HAVEN_HERO_SLIDES.map((s) => s.image)
];

const APP_SHELL = [
  "index.html",
  "products.html",
  "cart.html",
  "checkout.html",
  "wishlist.html",
  "support.html",
  "css/style.css",
  "js/data.js",
  "js/main.js",
  "manifest.json",
  "assets/icon.svg",
  "assets/favicon.svg",
  ...PRODUCT_IMAGES,
  ...CATEGORY_IMAGES
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
