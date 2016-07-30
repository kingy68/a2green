angular.module('main', [
'ngRoute',
'ngAnimate',
'components',
'esri.map',
'ngMaterial'
])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink');
})

.config(function($routeProvider) {
    $routeProvider

      .when('/', {
          templateUrl: 'pages/launch.html',
          controller: 'launchController'
      })

      .when('/launch', {
          templateUrl: 'pages/launch.html',
          controller: 'launchController'
      })

      .when('/map', {
          templateUrl: 'pages/map.html',
          controller: 'mapController'
      });
})

.controller('launchController', function($scope) {
    $scope.pageClass = 'page-launch';
})

.controller('mapController', function($scope) {
    $scope.pageClass = 'page-map';
});
