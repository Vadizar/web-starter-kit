// наименование для нашего хранилища кэша
var CACHE_NAME = 'app_serviceworker_v_1',
// ссылки на кэшируемые файлы
    cacheUrls = [
        '/ru',
        '/en',
        '/ru/godlike.css',
        '/en/godlike.css',
        '/ru/insteadman',
        '/en/insteadman',

        '/css/style.css',
        '/js/script.js',

        '/fonts/ns.woff2',
        '/fonts/ns-700.woff2',
        '/fonts/ns-italic.woff2',
        '/fonts/tech.woff2',

        '/img/logo/1000.tech.svg',

        '/img/portfolio/01.jpg',
        '/img/portfolio/02.jpg',
        '/img/portfolio/03.jpg',
        '/img/portfolio/04.jpg',
        '/img/portfolio/01.webp',
        '/img/portfolio/02.webp',
        '/img/portfolio/03.webp',
        '/img/portfolio/04.webp',

        '/img/team/01.jpg',
        '/img/team/02.jpg',
        '/img/team/03.jpg',
        '/img/team/01.webp',
        '/img/team/02.webp',
        '/img/team/03.webp',

        '/img/bg0.jpg',
        '/img/bg1.jpg',
        '/img/bg2.jpg',
        '/img/bg0.webp',
        '/img/bg1.webp',
        '/img/bg2.webp'
    ];

self.addEventListener('install', function(event) {
    // задержим обработку события
    // если произойдёт ошибка, serviceWorker не установится
    event.waitUntil(
        // находим в глобальном хранилище Cache-объект с нашим именем
        // если такого не существует, то он будет создан
        caches.open(CACHE_NAME).then(function(cache) {
            // загружаем в наш cache необходимые файлы
            return cache.addAll(cacheUrls);
        })
    );
});

// период обновления кэша - минута
var MAX_AGE = 60;

self.addEventListener('fetch', function(event) {

    event.respondWith(
        // ищем запрошенный ресурс среди закэшированных
        caches.match(event.request).then(function(cachedResponse) {
            var lastModified, fetchRequest;

            // если ресурс есть в кэше
            if (cachedResponse) {
                // получаем дату последнего обновления
                lastModified = new Date(cachedResponse.headers.get('last-modified'));
                // и если мы считаем ресурс устаревшим
                if (lastModified && (Date.now() - lastModified.getTime()) > MAX_AGE) {

                    fetchRequest = event.request.clone();
                    // создаём новый запрос
                    return fetch(fetchRequest).then(function(response) {

                        var responseClone = response.clone();

                        // при неудаче всегда можно выдать ресурс из кэша
                        if (!response || response.status !== 200) {
                            return cachedResponse;
                        } else {
                            // обновляем кэш
                            caches.open(CACHE_NAME).then(function(cache) {
                                cache.put(event.request, responseClone);
                            });
                            // возвращаем свежий ресурс
                            return response;
                        }
                    }).catch(function() {
                        return cachedResponse;
                    });
                }
                return cachedResponse;
            }

            // запрашиваем из сети как обычно
            return fetch(event.request);
        })
    );
});