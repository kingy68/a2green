app.controller('mapController', function($http, $timeout, NgMap) {
  var vm = this;
  vm.stores = [];
  NgMap.getMap().then(function(evtMap) {
    console.log(evtMap);
  //  map = evtMap;
  //  vm.map = map;
  //  console.log('loading scripts/starbucks.json');
  //  $http.get('scripts/starbucks.json').then(function(resp) {
  //    console.log('stores', stores);
  //    var stores = resp.data;
  //    for (var i=0; i<stores.length; i++) {
  //      var store = stores[i];
  //      store.position = new google.maps.LatLng(store.latitude,store.longitude);
  //      store.title = store.name;
  //      var marker = new google.maps.Marker(store);
  //      vm.stores.push(marker);
  //    }
  //    console.log('finished loading scripts/starbucks.json', 'vm.stores', vm.stores.length);
  //    vm.markerClusterer = new MarkerClusterer(map, vm.stores, {});
  //  }, function(err) { console.log('err', err)});
  });
});
