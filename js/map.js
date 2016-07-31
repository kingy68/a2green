app.controller('mapController', function($scope, $http, $timeout, NgMap) {
  var vm = this;
  vm.stores = [];

  var coords = $scope.travelOptions.driving.selectedPark;

  NgMap.getMap().then(function(evtMap) {
    console.log(evtMap);
    map = evtMap;

    // Default to Victoria Square
    var latitude = -34.928633;
    var longitude = 138.599971;
    if (coords) {
        latitude = coords[1];
        longitude = coords[0];
    };

    var latLng = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({position: latLng, map: map});
    map.setCenter(latLng);
    map.setZoom(17);
  });
});
