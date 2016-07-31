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


app.controller('MainController', function($rootScope, $scope, $location, $q, $interval, $http){
  //set the google url and key
  var apiKey = 'AIzaSyC5a7ymlxbZGCuacce1JjbaOdoqc16E9dU';
  $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key='+ apiKey;

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
      'transMethod': '',
      'info': '',
      'departureTime': ''
    },
    'bike': {
      'distanceVal': 0,
      'time': '',
      'timeVal': 0,
      'calories': 0
    }
  };

  $scope.origin = {
    text: '25b second street brompton'
  };

  $scope.destination = {
    text: '15 bentham street adeladie'
  };

  $scope.changePage = function() {
    console.log('change page');
    $location.path('/options');
  }

  $scope.getData = function() {
    var directionsService = new google.maps.DirectionsService();

    var drive = getDriving();
    var metro = getMetro();
    var bike = getBike();
    var driveComp = false;
    var metroComp = false;
    var bikeComp = false;

    drive.then(function() {
      driveComp = true;
    });
    metro.then(function() {
      metroComp = true;
    });
    bike.then(function() {
      bikeComp = true;
    });

    var wait = $interval(function() {
      if (driveComp && metroComp && bikeComp) {
        // Go to options page
        $scope.changePage();
        $interval.cancel(wait);
      }
    }, 500);

    function getDriving() {
      var def = $q.defer();
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

          getOptions.then(function(nearest) {
            // You have to pay today!!
            if (nearest.Ticket != 0) {
              // Add on $6 for 2 hours paid parking
              $scope.travelOptions.driving.cost += 6.00;
            }

            $scope.travelOptions.driving.parkingOptions.push(nearest);

            var getUpark = findNearestUPark($scope.travelOptions.driving.destination.x, $scope.travelOptions.driving.destination.y,
                (arrivalTime.getHours().toString() + arrivalTime.getMinutes().toString()), arrivalTime.getDay() == 0 ? 7 : arrivalTime.getDay(),
                requiredParkingTime);

              getUpark.then(function(nearestUpark) {
                $scope.travelOptions.driving.parkingOptions.push(nearestUpark);
                def.resolve();
              });
          });
        }
      });

      return def.promise;
    }

    function getMetro() {
      var def = $q.defer();
      // Get Metro info
      var directionsRequestTrans = {
        origin: $scope.origin.text,
        destination: $scope.destination.text,
        travelMode: 'TRANSIT'
      }

      directionsService.route(directionsRequestTrans, function(resp, status) {
        console.log(resp);
        if (resp.status != 'ZERO_RESULTS') {
          $scope.travelOptions.publicTrans.time = resp.routes[0].legs[0].duration.text;
          $scope.travelOptions.publicTrans.timeVal = resp.routes[0].legs[0].duration.value;

          for (i = 0; i < resp.routes[0].legs[0].steps.length; i++) {
            var instructions = resp.routes[0].legs[0].steps[i].instructions;
            if (instructions.search('bus') != -1 || instructions.search('Bus') != -1) {
              $scope.travelOptions.publicTrans.transMethod += 'Bus, ';
            }
            if (instructions.search('station') != -1 || instructions.search('Station') != -1 || instructions.search('train') != -1 || instructions.search('Train') != -1) {
              $scope.travelOptions.publicTrans.transMethod += 'Train, ';
            }
          }

          $scope.travelOptions.publicTrans.info = resp.routes[0].legs[0].steps[0].instructions;
          $scope.travelOptions.publicTrans.departureTime = resp.routes[0].legs[0].departure_time.text;

          // Calculate metro costs
          var now = new Date();
          if ((now.getHours() < 9 || now.getHours() > 15 || now.getDay() == 6) && now.getDay() != 0) {
            $scope.travelOptions.publicTrans.cost = 3.54;
          } else {
            $scope.travelOptions.publicTrans.cost = 1.94;
          }
        }

        def.resolve();
      });

      return def.promise;
    }

    function getBike() {
      var def = $q.defer();
      // Get biking info
      var directionsRequestTrans = {
        origin: $scope.origin.text,
        destination: $scope.destination.text,
        travelMode: 'BICYCLING'
      }

      directionsService.route(directionsRequestTrans, function(resp, status) {
        console.log(resp);
        if (resp.status != 'ZERO_RESULTS') {
          $scope.travelOptions.bike.timeVal = resp.routes[0].legs[0].duration.value;
          $scope.travelOptions.bike.time = resp.routes[0].legs[0].duration.text;
          $scope.travelOptions.bike.distanceVal = resp.routes[0].legs[0].distance.value;
          $scope.travelOptions.bike.calories = resp.routes[0].legs[0].duration.value * 0.233;
        }

        def.resolve();
      });

      return def.promise;
    }

    console.log($scope.travelOptions);

    function calulateParkingOptions(x, y, time, day, requireTime, freeOnly) {
      var def = $q.defer();

      var map;
      var layer;

      findNearest(x, y, {'time': time, 'day': day, 'requiredTime': requireTime, 'onlyFree': freeOnly}, def);

      function calculateGridNumbers(x, y) {

        var minX = 138.5871718;
        var minY = -34.936313;
        var step = 0.00253622;

        var offsetX = x - minX;
        var offsetY = y - minY;
        var gridX = Math.floor(offsetX / step)
        var gridY = Math.floor(offsetY / step)
        return [gridX, gridY];
      };

      function findNearest(x, y, options, def) {
        minDistance = 100;
        nearest = null;

        carParks.features.forEach(function(feature) {
          var geometry = feature.geometry;
          var attributes = feature.properties;
          // Check the attributes.
          if (options) {
            if (options.time) {
              var fromTime = attributes.FromTime;
              var toTime = attributes.ToTime;
              if (fromTime < toTime && (options.time < fromTime || options.time > toTime))
                return;
              if (fromTime > toTime && (options.time < fromTime && options.time > toTime))
                return;
            };
            if (options.onlyFree) {
              var ticketValue = attributes.Ticket;
              if (ticketValue == 1)
                return;
            };
            if (options.day) {
              var days = attributes.Days.toString();
              if (!days.includes(options.day))
                return;
            };
            if (options.time && options.requiredTime) {
              limit = attributes.Limit;
              if (limit > 0) {  // A time limit exists
                var intendedLeaveTime = options.time + options.requiredTime;
                if (intendedLeaveTime > attributes.ToTime) {
                  // We spill into another set of rules.
                  // TODO
                } else {
                  if (options.requiredTime > limit)
                    return;
                };
              } else {
                // Check if we spill over into another set of rules
                // that does have a time limit.
                // TODO
              };
            };

            // Testing data only
            if (options.origID) {
              var originID = attributes.OrigID;
              if (options.origID != originID)
                return;
            };
          };

          // Only one point
          var featureX = geometry.coordinates[0];
          var featureY = geometry.coordinates[1];
          var dist = Math.sqrt(Math.abs(x-featureX) + Math.abs(y-featureY))
          if (dist < minDistance) {
            minDistance = dist;
            nearest = feature;
          };
        });
        var result = {
          SourceID: nearest.properties.OrigID,
          LatLng: [nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]],
          Days: nearest.properties.Days,
          FromTime: nearest.properties.FromTime,
          ToTime: nearest.properties.ToTime,
          Limit: nearest.properties.Limit,
          Ticket: nearest.properties.Ticket,
          Spots: nearest.properties.Spots
        };
        def.resolve(result);
        return result;
      };
      return def.promise;
    };

    var locations = [
        { name: "Light Square", lat: -34.924148, lng: 138.594054, isOpen: getLightSquareOpen, getCost: getLightSquareCost, url: "static/Light.xml" },
        { name: "Topham Mall", lat: -34.925541, lng: 138.597628, isOpen: getTophamOpen, getCost: getTophamCost, url: "static/Topham.xml" },
        { name: "Gawler Place", lat: -34.921965, lng: 138.601786, isOpen: getGawlerOpen, getCost: getGawlerCost, url: "static/Gawler.xml" },
        { name: "Rundle Mall",lat: -34.922780, lng: 138.606570, isOpen: getRundleOpen, getCost: getRundleCost, url: "static/Rundle.xml" },
        { name: "Frome Street", lat: -34.921970, lng: 138.608061, isOpen: getFromeOpen, getCost: getFromeCost, url: "static/Frome.xml" },
        { name: "Wyatt Street", lat: -34.925047, lng: 138.603913, isOpen: getWyattOpen, getCost: getWyattCost, url: "static/Wyatt.xml" },
        { name: "Pirie-Flinders", lat: -34.925962, lng: 138.607207, isOpen: getPirieOpen, getCost: getPirieCost, url: "static/Pirie.xml" },
        { name: "Grote Street", lat: -34.928323, lng: 138.595990, isOpen: getGroteOpen, getCost: getGroteCost, url: "static/Grote.xml" },
        { name: "Central Market", lat: -34.929522, lng: 138.597992, isOpen: getCentralOpen, getCost: getCentralCost, url: "static/CentralMarket.xml" }
    ];

    function findNearestUPark(x, y, options) {
      var def = $q.defer();
    	minDistance = 100;
      nearest = null;
    	locations.forEach(function(location) {

    		if (options) {
          // Check if the garage is open
          if (!location.isOpen(options.day, options.time, options.requiredTime))
          	return;

          var dist = Math.sqrt(Math.abs(x-location.lng) + Math.abs(y-location.lat))
          if (dist < minDistance) {
          	minDistance = dist;
          	var cost = location.getCost(options.day, options.time, options.requiredTime);
          	nearest = { Name: location.name, Cost: cost, Url: location.url };
            nearest.LatLng = [location.lng, location.lat];
          };
        };
      });

    	// Before we send back the "winner", get its capacity
    	$http({
    		method: "GET",
    		url: nearest.Url
      }).then(function successCallback(xml) {
        console.log(xml);
        var re = /Textbox32="(\w+)"/
        nearest.Capacity = re.exec(xml.data)[1]
        def.resolve(nearest);
      }, function errorCallback(resp) {
        console.log(resp);
        nearest.capacity = 'Unknown';
        def.resolve(nearest);
        console.log('xml fetch error');
      });

      return def.promise;
    };

    function getLightSquareOpen() {
        return true;
    };

    function getLightSquareCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day >= 6) {
            return 7;
        };

        // Night parking
        if (day < 6 && arrival >= 1600 && duration < 1430) {
            return 7;
        };

        // Early bird
        if (day < 6 && arrival < 0830 && duration < 1100) {
            return 15;
        };

        // Standard
        if (duration <= 1)
            return 5;
        if (duration <= 2)
            return 8.50;
        if (duration <= 3)
            return 11;
        if (duration <= 4)
            return 15;
        if (duration <= 5)
            return 18;
        return 21;
    };

    function getTophamOpen(day, arrival, duration) {
        if (arrival < 600)
            return false;
        var leave = arrival + duration;
        if (day < 5 && leave > 2400)
            return false;
        if (day >= 5 && leave > 2600)
            return false;
        return true;
    };

    function getTophamCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day >= 6) {
            return 7;
        };

        // Night parking
        if (day < 6 && arrival >= 1800) {
            return 7;
        };

        // Early bird
        if (day < 6 && arrival < 0930 && arrival + duration < 1800) {
            return 18;
        };
        if (day < 6 && arrival < 0930 && arrival + duration >= 1800) {
           return 24;
        };

        // Standard
        if (duration <= 100)
            return 6.50;
        if (duration <= 200)
            return 10.50;
        if (duration <= 300)
            return 14;
        if (duration <= 400)
            return 19;
        if (duration <= 500)
            return 23;
        return 26;
    };

    function getGawlerOpen(day, arrival, duration) {
        if (day <= 5 && arrival < 700)
            return false;
        if (day == 6 && arrival < 730)
            return false;
        if (day == 7 && arrival < 1000)
            return false;
        var leave = arrival + duration;
        if (leave > 2400)
            return false;
        return true;
    };

    function getGawlerCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day == 7)
            return 7;

        // Night parking
        if ((day < 5 || day == 6) && arrival >= 1800)
            return 7;
        if (day == 5 && arrival >= 2130)
            return 7;

        // Early bird
        if (day < 6 && arrival < 0900 && arrival + duration < 1900)
            return 16;
        if (day < 6 && arrival < 0900 && arrival + duration >= 1900)
           return 23;

        // Standard
        if (duration <= 100)
            return 7;
        if (duration <= 200)
            return 12.50;
        if (duration <= 300)
            return 19;
        if (duration <= 400)
            return 24;
        if (duration <= 500)
            return 30;
        return 32;
    };

    function getRundleOpen(day, arrival, duration) {
        var leave = arrival + duration;
        if (day < 6 && arrival < 0630)
            return false;
        if ((day < 5 || day == 7) && leave > 2400)
            return false;
        return true;
    };

    function getRundleCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day == 7)
            return 7;

        // Night parking
        if ((day < 5 || day == 6) && arrival >= 1800)
            return 7;
        if (day == 5 && arrival >= 2130)
            return 7;

        // Early bird
        if (day < 7 && arrival < 0930 && arrival + duration < 1900)
            return 14;

        // Standard
        if (duration <= 100)
            return 5;
        if (duration <= 200)
            return 10;
        if (duration <= 300)
            return 14;
        if (duration <= 400)
            return 18;
        if (duration <= 500)
            return 23;
        return 29;
    };

    function getFromeOpen(day, arrival, duration) {
        return true;
    };

    function getFromeCost(day, arrival, duration) {
        // Sun flat rate
        if (day == 7)
            return 7;

        // Early bird
        // TODO

        // TEMP: 2 hr assumption
        return 11.50;
    };

    function getWyattOpen(day, arrival, duration) {
        var leave = arrival + duration;
        if (arrival < 0630)
            return false;
        if (leave > 2400)
            return false;
        return true;
    };

    function getWyattCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day > 5)
            return 7;

        // Early bird
        // TODO

        // TEMP: 2 hr assumption
        return 13;
    };

    function getPirieOpen(day, arrival, duration) {
        var leave = arrival + duration;
        if (arrival < 0630)
            return false;
        if (leave > 2400)
            return false;
        return true;
    };

    function getPirieCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day > 5)
            return 7;

        // Early bird
        // TODO

        // TEMP: 2 hr assumption
        return 13.5;
    };

    function getGroteOpen(day, arrival, duration) {
        var leave = arrival + duration;
        if (arrival < 0600)
            return false;
        if (day < 5 && leave > 2400)
            return false;
        if (leave > 2500)
            return false;
        return true;
    };

    function getGroteCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day > 5)
            return 7;

        // Early bird
        // TODO

        // TEMP: 2 hr assumption
        return 8.5;
    };

    function getCentralOpen(day, arrival, duration) {
        return true;
    };

    function getCentralCost(day, arrival, duration) {
        // Sat/Sun flat rate
        if (day > 5)
            return 7;

        // Early bird
        // TODO

        // TEMP: 2 hr assumption
        return 5;
    };
  };
});
