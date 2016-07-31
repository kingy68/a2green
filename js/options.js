app.controller('optionsController', function($scope, $http, $timeout) {
  console.log('OPTIONS!');
  console.log($scope.travelOptions);

  $scope.driveTime = $scope.travelOptions.driving.time;
  $scope.metroTime = $scope.travelOptions.publicTrans.time;
  $scope.bikeTime = $scope.travelOptions.bike.time;

  // Set Quantity bar
  var quantity = $scope.travelOptions.driving.parkingOptions[0].Spots;
  if (quantity == 0) {
    document.getElementById('quantity-progress').style.width = '0%';
    $scope.quantityWord = 'No Parks';
  }
  else if (quantity > 0 && quantity <= 10) {
    document.getElementById('quantity-progress').style.width = '20%';
    $scope.quantityWord = 'Few Parks';
  }
  else if (quantity > 10 && quantity <= 20) {
    document.getElementById('quantity-progress').style.width = '40%';
    $scope.quantityWord = 'Hurry';
  }
  else if (quantity > 20 && quantity <= 50) {
    document.getElementById('quantity-progress').style.width = '60%';
    $scope.quantityWord = 'No Rush';
  }
  else if (quantity > 50 && quantity <= 100) {
    document.getElementById('quantity-progress').style.width = '80%';
    $scope.quantityWord = 'Heaps';
  }
  else if (quantity > 100) {
    document.getElementById('quantity-progress').style.width  ='100%';
    $scope.quantityWord = 'Parks Everywhere!';
  }

  // Set Price bar
  var price = $scope.travelOptions.driving.cost;
  if (price == 0) {
    document.getElementById('price-progress').style.width = '0%';
    $scope.priceWord = 'Free!!';
  }
  else if (price > 0 && price <= 2) {
    document.getElementById('price-progress').style.width = '20%';
    $scope.priceWord = 'Cheap';
  }
  else if (price > 2 && price <= 4) {
    document.getElementById('price-progress').style.width = '40%';
    $scope.priceWord = 'Spare Change';
  }
  else if (price > 4 && price <= 6) {
    document.getElementById('price-progress').style.width = '60%';
    $scope.priceWord = 'Notes Required';
  }
  else if (price > 6 && price <= 10) {
    document.getElementById('price-progress').style.width = '80%';
    $scope.priceWord = 'Expensive';
  }
  else if (price > 10) {
    document.getElementById('price-progress').style.width  ='100%';
    $scope.priceWord = 'Super Expensive!';
  }

  // Set Congestion bar (in m/s)
  var congestion = $scope.travelOptions.driving.distanceVal / $scope.travelOptions.driving.timeVal;
  if (congestion <= 2) {
    document.getElementById('congestion-progress').style.width = '100%';
    $scope.congestionWord = 'Very High';
  }
  else if (congestion > 2 && congestion <= 5) {
    document.getElementById('congestion-progress').style.width = '80%';
    $scope.congestionWord = 'High';
  }
  else if (congestion > 5 && congestion <= 10) {
    document.getElementById('congestion-progress').style.width = '60%';
    $scope.congestionWord = 'Moderate';
  }
  else if (congestion > 10 && congestion <= 17) {
    document.getElementById('congestion-progress').style.width = '40%';
    $scope.congestionWord = 'Normal';
  }
  else if (congestion > 17 && congestion <= 25) {
    document.getElementById('congestion-progress').style.width = '20%';
    $scope.congestionWord = 'Light';
  }
  else if (congestion > 25) {
    document.getElementById('congestion-progress').style.width  ='0%';
    $scope.congestionWord = 'Doing 100KPH!';
  }
});
