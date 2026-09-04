const CACHE = 'footage-archive-v3';
const CORE = ['./', './index.html', './cartas.html', './carta-01.html', './carta-02.html', './carta-03.html', './carta-04.html', './carta-05.html', './carta-06.html', './carta-07.html', './carta-08.html', './carta-09.html', './carta-10.html', './carta-11.html', './galeria.html', './notas.html', './styles.css', './app.js', './config.js', './manifest.json'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.includes('/.history/')) return;
  const freshFirst = event.request.mode === 'navigate' || /\/(app|config|sw)\.js$/.test(requestUrl.pathname);
  event.respondWith((freshFirst ? fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }) : caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }))).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
});
