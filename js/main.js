var app = angular.module('app', [
  'ngRoute',
  'ngMap',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures'
]);

app.run(function($transform) {
  window.$transform = $transform;
});

app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'pages/launch.html', reloadOnSearch: false});
  $routeProvider.when('/start',         {templateUrl: 'pages/start.html', reloadOnSearch: false});
  $routeProvider.when('/options',       {templateUrl: 'pages/options.html', reloadOnSearch: false});
  $routeProvider.when('/map',           {templateUrl: 'pages/map.html', reloadOnSearch: false});
  $routeProvider.when('/parking',       {templateUrl: 'pages/parking.html', reloadOnSearch: false});
  $routeProvider.when('/scroll',        {templateUrl: 'pages/scroll.html', reloadOnSearch: false});
  $routeProvider.when('/toggle',        {templateUrl: 'pages/toggle.html', reloadOnSearch: false});
  $routeProvider.when('/tabs',          {templateUrl: 'pages/tabs.html', reloadOnSearch: false});
  $routeProvider.when('/overlay',       {templateUrl: 'pages/overlay.html', reloadOnSearch: false});
  $routeProvider.when('/accordion',     {templateUrl: 'pages/accordion.html', reloadOnSearch: false});
  $routeProvider.when('/forms',         {templateUrl: 'pages/forms.html', reloadOnSearch: false});
  $routeProvider.when('/touch',         {templateUrl: 'pages/touch.html', reloadOnSearch: false});
  $routeProvider.when('/dropdown',      {templateUrl: 'pages/dropdown.html', reloadOnSearch: false});
  $routeProvider.when('/swipe',         {templateUrl: 'pages/swipe.html', reloadOnSearch: false});
  $routeProvider.when('/drag',          {templateUrl: 'pages/drag.html', reloadOnSearch: false});
  $routeProvider.when('/drag2',         {templateUrl: 'pages/drag2.html', reloadOnSearch: false});
  $routeProvider.when('/carousel',      {templateUrl: 'pages/carousel.html', reloadOnSearch: false});
});

app.directive('toucharea', ['$touch', function($touch){
  // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem){
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if( drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() {
                scope.$apply(function() {
                  dismissFn(scope);
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function(){
  return {
    restrict: 'C',
    scope: {},
    controller: function() {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();

      var zIndex = function(){
        var res = 0;
        if (id === carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(){
        elem[0].style.zIndex = zIndex();
      });

      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function(element, transform, touch) {
          //
          // use translate both as basis for the new transform:
          //
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);

          //
          // Add rotation:
          //
          var Dx    = touch.distanceX,
              t0    = touch.startTransform,
              sign  = Dx < 0 ? -1 : 1,
              angle = sign * Math.min( ( Math.abs(Dx) / 700 ) * 30 , 30 );

          t.rotateZ = angle + (Math.round(t0.rotateZ));

          return t;
        },
        move: function(drag){
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');
          } else {
            elem.removeClass('dismiss');
          }
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(drag) {
          elem.removeClass('dismiss');
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          drag.reset();
        }
      });
    }
  };
});

app.directive('dragMe', ['$drag', function($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element,
        {
          //
          // Here you can see how to limit movement
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            // go back to initial position
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);


app.controller('MainController', function($rootScope, $scope, $location, $q, NgMap){

  //set the google url and key
  var apiKey = 'AIzaSyC5a7ymlxbZGCuacce1JjbaOdoqc16E9dU';
  $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key='+ apiKey;
  $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/geocode/json?key='+ apiKey;

  $scope.travelOptions = {
    'driving': {
      'distance': '',
      'distanceVal': 0,
      'time': '',
      'timeVal': 0,
      'cost': 0,
      'origin': {
        'x': 0,
        'y': 0
      },
      'destination': {
        'x': 0,
        'y': 0
      },
      'parkingOptions': []
    },
    'publicTrans': {
      'time': '',
      'timeVal': 0,
      'cost': 0,
      'transMethod': ''
    },
    'bike': {
      'distanceVal': 0,
      'time': '',
      'timeVal': 0,
      'calories': 0
    }
  };

  $scope.origin = {
    text: '15 bentham street adelaide'
  };

  $scope.destination = {
    text: '25b second street brompton'
  };

  $scope.getData = function() {
    var directionsService = new google.maps.DirectionsService();

    // Get driving info
    var directionsRequestDrive = {
      origin: $scope.origin.text,
      destination: $scope.destination.text,
      travelMode: 'DRIVING'
    }

    directionsService.route(directionsRequestDrive, function(resp, status) {
      console.log(resp);
      if (resp.status != 'ZERO_RESULTS') {
        $scope.travelOptions.driving.distance = resp.routes[0].legs[0].distance.text;
        $scope.travelOptions.driving.distanceVal = resp.routes[0].legs[0].distance.value;
        $scope.travelOptions.driving.time = resp.routes[0].legs[0].duration.text;
        $scope.travelOptions.driving.timeVal = resp.routes[0].legs[0].duration.value;
        $scope.travelOptions.driving.origin.y = resp.routes[0].legs[0].start_location.lat();
        $scope.travelOptions.driving.origin.x = resp.routes[0].legs[0].start_location.lng();
        $scope.travelOptions.driving.destination.y = resp.routes[0].legs[0].end_location.lat();
        $scope.travelOptions.driving.destination.x = resp.routes[0].legs[0].end_location.lng();

        // Calc driving costs
        var dist = resp.routes[0].legs[0].distance.value;
        $scope.travelOptions.driving.cost = (dist/1000 * 0.19) + 7.00;

        var arrivalTime = new Date();
        arrivalTime.setSeconds(arrivalTime.getSeconds() + $scope.travelOptions.driving.timeVal);
        var requiredParkingTime = 200;

        var getOptions = calulateParkingOptions($scope.travelOptions.driving.destination.x, $scope.travelOptions.driving.destination.y,
            (arrivalTime.getHours().toString() + arrivalTime.getMinutes().toString()), arrivalTime.getDay() == 0 ? 7 : arrivalTime.getDay(),
            requiredParkingTime, false);

        getOptions.then(function() {
          console.log('PROCESSING COMPLETE');
          // Go to options page
          // $location.path('/options');
        });
      }
    });

    // Get Metro info
    // var directionsRequestTrans = {
    //   origin: $scope.origin.text,
    //   destination: $scope.destination.text,
    //   travelMode: 'TRANSIT'
    // }
    //
    // directionsService.route(directionsRequestTrans, function(resp, status) {
    //   console.log(resp);
    //   if (resp.status != 'ZERO_RESULTS') {
    //     $scope.travelOptions.publicTrans.time = resp.routes[0].legs[0].duration.text;
    //     $scope.travelOptions.publicTrans.timeVal = resp.routes[0].legs[0].duration.value;
    //
    //     for (i = 0; i < resp.routes[0].legs[0].steps.length; i++) {
    //       var instructions = resp.routes[0].legs[0].steps[i].instructions;
    //       if (instructions.search('bus') != -1 || instructions.search('Bus') != -1) {
    //         $scope.travelOptions.publicTrans.transMethod += 'Bus, ';
    //       }
    //       if (instructions.search('station') != -1 || instructions.search('Station') != -1 || instructions.search('train') != -1 || instructions.search('Train') != -1) {
    //         $scope.travelOptions.publicTrans.transMethod += 'Train, ';
    //       }
    //     }
    //
    //     // Calculate metro costs
    //     var now = new Date();
    //     if ((now.getHours() < 9 || now.getHours() > 15 || now.getDay() == 6) && now.getDay() != 0) {
    //       $scope.travelOptions.publicTrans.cost = 3.54;
    //     } else {
    //       $scope.travelOptions.publicTrans.cost = 1.94;
    //     }
    //   }
    //   metroRef.resolve();
    // });
    //
    // // Get biking info
    // var directionsRequestTrans = {
    //   origin: $scope.origin.text,
    //   destination: $scope.destination.text,
    //   travelMode: 'BICYCLING'
    // }
    //
    // directionsService.route(directionsRequestTrans, function(resp, status) {
    //   console.log(resp);
    //   if (resp.status != 'ZERO_RESULTS') {
    //     $scope.travelOptions.bike.timeVal = resp.routes[0].legs[0].duration.value;
    //     $scope.travelOptions.bike.time = resp.routes[0].legs[0].duration.text;
    //     $scope.travelOptions.bike.distanceVal = resp.routes[0].legs[0].distance.value;
    //   }
    //   bikeRef.resolve();
    // });

    console.log($scope.travelOptions);

    function calulateParkingOptions(x, y, time, day, requireTime, freeOnly) {
      var def = $q.defer();
      console.log(x, y, time, day, requireTime, freeOnly);
      $scope.travelOptions.driving.parkingOptions = ['number 1', 'number 2'];

      //TODO: james put your stuff in here!!

      return def.promise;
    }
  };
});
