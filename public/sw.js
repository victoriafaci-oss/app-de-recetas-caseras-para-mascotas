// If running on preview or dev containers (e.g. *.run.app, localhost), self-destruct immediately
if (self.location.hostname.includes('run.app') || self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  self.addEventListener('install', () => {
    self.skipWaiting();
  });
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
        .then(() => {
          return self.clients.matchAll({ type: 'window' }).then((clients) => {
            clients.forEach((c) => c.navigate(c.url));
          });
        })
    );
  });
  self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
  });
} else {
  // Production PWA (Cloudflare Pages, custom domain)
  const CACHE_NAME = 'pawlove-v6';
  const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.png',
    '/apple-touch-icon.png',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/pwa-maskable-512x512.png'
  ];

  self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('[SW] Cache prefetch error:', err);
        });
      })
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener('message', (event) => {
    if (event.data && (event.data.type === 'SKIP_WAITING' || event.data === 'skipWaiting')) {
      self.skipWaiting();
    }
  });

  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);

    // Never intercept sw.js, Vite dev modules, API routes, or payment redirects
    if (
      url.pathname.startsWith('/@') ||
      url.pathname.startsWith('/src/') ||
      url.pathname.startsWith('/node_modules/') ||
      url.pathname.includes('vite') ||
      url.pathname === '/sw.js' ||
      url.pathname.startsWith('/api/') ||
      url.pathname === '/promocion' ||
      url.pathname.startsWith('/checkout/')
    ) {
      return;
    }

    // Skip Stripe, PayPal, and external third-party origins
    if (url.origin !== self.location.origin) return;

    // Navigation requests: Network-First with safe async fallback to cached /index.html
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            const cachedIndex = await caches.match('/index.html');
            if (cachedIndex) return cachedIndex;
            const cachedRoot = await caches.match('/');
            if (cachedRoot) return cachedRoot;
            return new Response('', { status: 503 });
          })
      );
      return;
    }

    // Static assets: Stale-while-revalidate / cache-first
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cached || new Response('', { status: 404 }));

        return cached || fetchPromise;
      })
    );
  });
}

