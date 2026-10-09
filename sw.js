// Cuaderno de Horas — funciona sin internet.
// Al cambiar cualquier archivo de la app, subí el número de versión.
const VERSION = 'cuaderno-v1';
const ARCHIVOS = [
  './', 'index.html', 'manifest.webmanifest', 'xlsx.full.min.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-180.png',
  'fonts/baloo-2-latin-700-normal.woff2', 'fonts/nunito-latin-400-normal.woff2',
  'fonts/nunito-latin-600-normal.woff2', 'fonts/nunito-latin-700-normal.woff2', 'fonts/nunito-latin-800-normal.woff2'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Primero intenta internet (para recibir mejoras); si no hay, usa la copia guardada.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
