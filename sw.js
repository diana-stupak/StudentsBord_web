const assetUrls = ['index.html', 'script.js', 'style.css']; // Масив ресурсів, які будуть кешовані
const staticCacheName = 's-app-v1'; // Назва кешу статичних файлів

self.addEventListener('install', event => { // Додати обробник події "install" для Service Worker
    console.log('[SW]: install'); // Вивести повідомлення у консоль під час інсталяції Service Worker
    event.waitUntil( // Очікувати завершення дії, перед тим як закінчити обробку події
        caches.open(staticCacheName).then(cache => cache.addAll(assetUrls)) // Відкрити кеш і додати всі ресурси з масиву assetUrls в кеш
    );
});

self.addEventListener('activate', event => { // Додати обробник події "activate" для Service Worker
    console.log('[SW]: activate'); // Вивести повідомлення у консоль під час активації Service Worker
});
