// ═══════════════════════════════════════════════════════
// MeowUI PWA Service Worker
// ═══════════════════════════════════════════════════════
// Strategy:
//   - App shell (HTML)  → Network-first, cache fallback
//   - Static assets     → Cache-first, network fallback
//   - Everything else   → Stale-while-revalidate
// ═══════════════════════════════════════════════════════

const CACHE_NAME = 'meowui-v3';

// Minimal app shell to pre-cache on install.
// Vite hashes JS/CSS filenames, so we only pre-cache the
// entry HTML and icons — the rest is cached on first fetch.
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icon-maskable.svg',
];

// ── Install: pre-cache app shell ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate immediately without waiting for old tabs to close
  self.skipWaiting();
});

// ── Activate: clean up old caches ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Start controlling all open tabs immediately
  self.clients.claim();
});

// ── Fetch: routing strategy ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests (POST, PUT, etc.)
  if (request.method !== 'GET') return;

  // Navigation requests (HTML pages) → Network-first
  // This ensures the user always gets the latest version of the app
  // when online, but can still load offline from cache.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (JS, CSS, images, fonts) → Cache-first
  // Vite-built assets have content hashes in filenames,
  // so a cached version is always correct for its URL.
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else → Stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ═══ Strategy helpers ═══

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    // Cache successful responses for offline use
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Network failed — try cache
    const cached = await caches.match(request);
    if (cached) return cached;
    // If nothing in cache either, return a basic offline page
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MeowUI — Offline</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;color:#333;text-align:center;padding:2rem}.card{background:white;border-radius:1.5rem;padding:3rem 2rem;max-width:340px;box-shadow:0 4px 24px rgba(0,0,0,.08)}h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#666;font-size:.875rem;line-height:1.5}button{margin-top:1.5rem;padding:.75rem 2rem;border:none;border-radius:999px;background:#0AA4B8;color:white;font-weight:600;font-size:.875rem;cursor:pointer}</style></head><body><div class="card"><h1>You\'re offline</h1><p>MeowUI needs an internet connection to load. Please check your connection and try again.</p><button onclick="location.reload()">Retry</button></div></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Both cache and network failed
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Always fetch from network to update cache (fire-and-forget)
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  // Return cached version immediately if available, else wait for network
  return cached || (await fetchPromise) || new Response('', { status: 408 });
}

// ═══ Helpers ═══

function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|avif|ico|json)$/i.test(pathname);
}
