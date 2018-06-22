const staticCacheName = "mws-r-static-v1";

this.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then(function(cache) {
        return cache.addAll([
          "/",
          "/index.html",
          "/css/styles.css",
          "/restaurant.html",
          "/data/restaurants.json",
          "/js/main.js",
          "/js/dbhelper.js",
          "/js/restaurant_info.js",
          "/offline-map.html",
          "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=AIzaSyApmoY54_QVp80zMhBn6K9phNui_6SbpL0&libraries=places&callback=initMap"
        ]);
      })
      .catch(function(error) {
        console.log(error);
      })
  );
});

this.addEventListener("fetch", function(event) {
  // if (
  //   event.request.url.indexOf("https://maps.googleapis.com/maps/api/js") == 0
  // ) {
  //   event.respondWith(
  //     fetch(event.request)
  //       .then(function(response) {
  //         console.log("Returning data " + event.request.url);
  //         return response;
  //       })
  //       .catch(function(err) {
  //         console.log(err);
  //         return caches.match("/offline-map.html");
  //       })
  //   );
  // } else {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      if (resp) return resp;

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        // Check if we received a valid response
        // if (!response || response.status !== 200 || response.type !== "basic") {
        //   return response;
        // }

        var responseToCache = response.clone();

        caches.open(staticCacheName).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
  // }
});

this.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return cacheName.startsWith("mws-") && cacheName != staticCacheName;
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
