const CACHE_NAME = 'sshihabb007-pwa-v22';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css?v=2.8',
    './js/theme.js',
    './js/load-components.js?v=2.8',
    './js/shihab-security.js',
    './asset/fav.png',
    './components/header.html?v=2.8',
    './components/footer.html?v=2.8',
    './front/projects.html',
    './front/contact.html',
    // Tools Hub
    './tools/',
    './tools/index.html',
    './tools/tools.css?v=1.2',
    './tools/tools.js?v=1.1',
    // Tools
    './advanced-calculator/',
    './advanced-calculator/index.html',
    './age-calculator/',
    './age-calculator/index.html',
    './audio-to-text/',
    './audio-to-text/index.html',
    './bmi-calculator/',
    './bmi-calculator/index.html',
    './compressor/',
    './compressor/index.html',
    './currency-converter/',
    './currency-converter/index.html',
    './land-calculator/',
    './land-calculator/index.html',
    './power-calculator/',
    './power-calculator/index.html',
    './qr-generator/',
    './qr-generator/index.html',
    './tax-calculator/',
    './tax-calculator/index.html',
    './universal-downloader/',
    './universal-downloader/index.html',
    './universal-downloader/style.css',
    './universal-downloader/script.js',
    './universal-downloader/manifest.json'
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
    if (requestUrl.origin !== self.location.origin) return;
    if (requestUrl.pathname.endsWith('.wasm') ||
        requestUrl.pathname.endsWith('.wav') ||
        requestUrl.pathname.endsWith('.pdf')) return;

    // Network-first for HTML pages (always fresh, ignore query string for cache matching)
    if (requestUrl.pathname.endsWith('.html') || requestUrl.pathname.endsWith('/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(c => c.put(requestUrl.pathname, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(requestUrl.pathname).then(r => r || caches.match(event.request)))
        );
        return;
    }

    // Stale-While-Revalidate for CSS/JS/assets (preserve query string so version bumps bust cache)
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
            }).catch(() => cachedResponse || caches.match(event.request, { ignoreSearch: true }));

            return cachedResponse || networkFetch;
        })
    );
});
