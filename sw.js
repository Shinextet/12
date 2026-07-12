const CACHE_NAME = 'ngwe-su-pro-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// App ကို install လုပ်တဲ့အခါ လိုအပ်တဲ့ဖိုင်တွေအားလုံးကို cache ထဲသိမ်းမည်
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Cache အဟောင်းတွေကို ရှင်းလင်းမည်
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Internet မရှိလည်း Cache ထဲကဖိုင်ကို ပြန်ပေးမည် (Offline-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
