app.controller('mapController', function($http, $timeout, NgMap) {
  var vm = this;
  vm.stores = [];
  NgMap.getMap().then(function(evtMap) {
    console.log(evtMap);
    map = evtMap;

    // Default to Victoria Square
    var latitude = -34.928633;
    var longitude = 138.599971;
    if ($scope.zoomToCoords) {
        latitude = $scope.zoomToCoords[1];
        longitude = $scope.zoomToCoords[0];
    };

    var latLng = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({position: latLng, map: map});
    map.setCenter(latLng);
    map.setZoom(17);
  });
});
