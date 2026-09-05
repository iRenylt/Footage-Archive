const CACHE = 'footage-archive-v5';
const CORE = ['./', './index.html', './cartas.html', './carta-01.html', './carta-02.html', './carta-03.html', './carta-04.html', './carta-05.html', './carta-06.html', './carta-07.html', './carta-08.html', './carta-09.html', './carta-10.html', './carta-11.html', './galeria.html', './notas.html', './styles.css', './app.js', './config.js', './content.js', './manifest.json'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.includes('/.history/')) return;
  if (requestUrl.origin !== self.location.origin) return;
  const networkRequest = new Request(event.request, { cache: 'no-store' });
  event.respondWith(fetch(networkRequest).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
});
