// sw.js — phiên bản an toàn cho GitHub Pages (subpath) & custom domain
const CACHE_NAME = "taxi-ai-v2";
const BASE = location.pathname.replace(/\/[^/]*$/, "/"); 
// VD trên GH Pages: /taxi-ai-site/  ; khi dùng domain riêng: "/"

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
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(URLS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
