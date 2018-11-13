
'use strict';

var cacheVersion = 1;
var currentCache = {
  offline: 'musicplayerchache' + cacheVersion
};
const offlineUrl = 'offline.html';

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
          '.',
          'index.html',
          'manifest.json',
          'manifest.webapp',
          'package-lock.json',
          'assets',
          'assets/css',
          'assets/css/.sass-cache',
          'assets/css/main.css',
          'assets/css/main.css.map',
          'assets/css/main.sass',
          'assets/img',
          'assets/js',
          'assets/songs',
          'node_modules',
          offlineUrl
      ]);
    })
  );
});


// Menambahkan pengembalian offline ke online

this.addEventListener('fetch', event => {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              // Return the offline page
              return caches.match(offlineUrl);
          })
    );
  }
  else{
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
      }
});