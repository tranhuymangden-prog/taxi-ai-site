// sw.js — v3 (force update) — no external HTTP URLs
const CACHE_NAME = "taxi-ai-v3";

// BASE = thư mục hiện tại của site
//  - https://.../taxi-ai-site/index.html -> BASE="/taxi-ai-site/"
//  - https://taximangden.eu.org/index.html -> BASE="/"
const BASE = location.pathname.replace(/\/[^/]*$/, "/");

const URLS = [
  BASE,
  BASE + "index.html",
  BASE + "script.js",
  BASE + "manifest.webmanifest",
  BASE + "favicon.ico",
  BASE + "icon-192.png",
  BASE + "icon-512.png"
];

self.addEventListener("install", (e) => {
  // Ép SW mới kích hoạt ngay
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(URLS)));
});

self.addEventListener("activate", (e) => {
  // Nhận quyền kiểm soát ngay
  clients.claim();
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
