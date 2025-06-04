const assetUrls = ['index.html', 'script.js', 'style.css']; 
const staticCacheName = 's-app-v1'; 

self.addEventListener('install', event => { 
    console.log('[SW]: install'); 
    event.waitUntil( 
        caches.open(staticCacheName).then(cache => cache.addAll(assetUrls)) 
    );
});

self.addEventListener('activate', event => { 
    console.log('[SW]: activate'); 
});
