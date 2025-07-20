// Service Worker to fix Firebase SDK v9+ referrer header issue
// This fixes the API_KEY_HTTP_REFERRER_BLOCKED error
// See: https://github.com/firebase/firebase-js-sdk/issues/5657

self.addEventListener('fetch', function (event) {
  var urlObj = new URL(event.request.url);
  
  // Fix Firebase Identity Toolkit API requests
  if (urlObj.origin === 'https://identitytoolkit.googleapis.com') {
    console.log('Fixing Firebase referrer for:', event.request.url);
    event.respondWith(
      fetch(new Request(event.request, { 
        referrer: self.location.origin 
      }))
    );
  }
  
  // Fix other Firebase API endpoints if needed
  if (urlObj.origin === 'https://firestore.googleapis.com' || 
      urlObj.origin === 'https://firebase.googleapis.com') {
    event.respondWith(
      fetch(new Request(event.request, { 
        referrer: self.location.origin 
      }))
    );
  }
});

self.addEventListener('install', function(event) {
  console.log('Firebase referrer fix service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Firebase referrer fix service worker activated');
  event.waitUntil(self.clients.claim());
});
