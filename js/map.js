app.controller('mapController', function($http, $timeout, NgMap) {
  var vm = this;
  vm.stores = [];
  NgMap.getMap().then(function(evtMap) {
    console.log(evtMap);
    map = evtMap;

    var apiKey = 'AIzaSyC5a7ymlxbZGCuacce1JjbaOdoqc16E9dU';

    var dirRequest = 'origin=-34.56,138.36&destination=-34.59,138.41&mode=driving&key=' + apiKey;
    var directionsService = new google.maps.DirectionsService();
    console.log(directionsService);

    var directionsRequest = {
      origin: '7 Alison Avenue, Blackwood',
      destination: '15 Bentham Street, Adelaide',
      travelMode: 'DRIVING'
    };
    // directionsService.route(directionsRequest, function(resp, status) {
    //   console.log(resp);
    // });
  });
});
