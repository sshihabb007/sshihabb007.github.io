const CACHE_NAME = 'sshihabb007-pwa-v15';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './js/theme.js',
    './js/load-components.js',
    './js/shihab-security.js',
    './asset/fav.png',
    './components/header.html',
    './components/footer.html',
    // QR Generator
    './qr-generator/',
    './qr-generator/index.html',
    // Other tools
    './currency-converter/',
    './currency-converter/index.html',
    './advanced-calculator/',
    './advanced-calculator/index.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // addAll fails silently on individual errors — use Promise.allSettled
            return Promise.allSettled(
                STATIC_ASSETS.map(url => cache.add(url).catch(e => console.warn('Cache miss:', url, e)))
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Skip non-GET, heavy files, and external CDN requests
    if (event.request.method !== 'GET') return;
    if (!requestUrl.origin.includes(self.location.origin.split('//')[1])) return;
    if (requestUrl.pathname.endsWith('.wasm') ||
        requestUrl.pathname.endsWith('.wav') ||
        requestUrl.pathname.endsWith('.pdf')) return;

    // Network-first for HTML pages (always fresh)
    if (requestUrl.pathname.endsWith('.html') || requestUrl.pathname.endsWith('/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Stale-While-Revalidate for CSS/JS/assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const networkFetch = fetch(event.request).then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            }).catch(() => {});

            return cachedResponse || networkFetch;
        })
    );
});
