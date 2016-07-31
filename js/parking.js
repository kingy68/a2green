app.controller('parkingController', function($scope, $http, $timeout, $q, $location) {

  $scope.travelOptions.driving.selectedPark = [];

  // Set streetParking
  $scope.streetSpaces = $scope.travelOptions.driving.parkingOptions[0].Spots;
  $scope.streetTicketed = $scope.travelOptions.driving.parkingOptions[0].Ticket == 0 ? 'Free' : 'Required';
  $scope.streetLimit = $scope.travelOptions.driving.parkingOptions[0].Limit == 0 ? 'No Limit' : $scope.travelOptions.driving.parkingOptions[0].Limit.toString() + ' mins'

  // Set Uparking
  $scope.uParkSpaces = $scope.travelOptions.driving.parkingOptions[1].Capacity;
  $scope.uParkName = $scope.travelOptions.driving.parkingOptions[1].Name;
  $scope.uParkCost = '$' + $scope.travelOptions.driving.parkingOptions[1].Cost.toString();

  $scope.clickedStreet = function() {
    $scope.travelOptions.driving.selectedPark = [$scope.travelOptions.driving.parkingOptions[0].LatLng[0], $scope.travelOptions.driving.parkingOptions[0].LatLng[1]];
    $location.path('/map');
  }

  $scope.clickedUpark = function() {
    $scope.travelOptions.driving.selectedPark = [$scope.travelOptions.driving.parkingOptions[1].LatLng[0], $scope.travelOptions.driving.parkingOptions[1].LatLng[1]];
    $location.path('/map');
  }

  function readTextFile(file)
  {
    var deferred = $q.defer();
    var monthLookup = {
      'January': 1,
      'Feburary': 2,
      'March': 3,
      'April': 4,
      'May': 5,
      'June': 6,
      'July': 7,
      'August': 8,
      'September': 9,
      'October': 10,
      'November': 11,
      'December': 12
    };
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
      if(rawFile.readyState === 4)
      {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
          var allText = rawFile.responseText;

          var aqiData = {};
          var dataArr = allText.replace(/ /g,'').split('\n');
          var timeData = dataArr[0].split(',');
          aqiData['dateTimestamp'] = new Date(timeData[3], monthLookup[timeData[2]] - 1, timeData[1], timeData[4].split(':')[0], timeData[4].split(':')[1]);
          dataArr.splice(0, 1);
          for (i = 0; i < dataArr.length; i++) {
            var splitLine = dataArr[i].split(',');
            aqiData[splitLine[1]] = {
              'ozone': splitLine[4],
              'co2': splitLine[5],
              'no2': splitLine[6],
              'so2': splitLine[7],
              'PM10': splitLine[8],
              'PM2.5': splitLine[9],
              'index': splitLine[10]
            }
          }
          deferred.resolve(aqiData);
        }
      }
    }
    rawFile.send(null);

    return deferred.promise;
  }

  var data = readTextFile('static/pi.txt');
  data.then(function(res) {
    console.log(res);

    var g = new JustGage({
      id: "graph",
      value: parseInt(res['AdelaideCBD'].index),
      min: 0,
      max: 200,
      title: "Air Quality Index",
      levelColorsGradient: true
    });
  });
});
