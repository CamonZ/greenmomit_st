'use strict';

angular.module('mean.dashboard', ['ngLodash']).
  controller('DashboardController', ['$http', '$scope', '$location', 'lodash', 'Global',
  function($http, $scope, $location, lodash, Global) {
    $scope.global = Global;
    $scope.graphs = {};

    var user = window.user;

    if(user.sessionToken === undefined) $location.url('/'); //ensure the user is set

    $http.get('/thermostats', { params: { sessionToken: user.sessionToken } }).
      success(function(response){
        $scope.thermostats = response;
        lodash.each(response, function(val){ $scope.graphs[val.id].visible = false; });
        console.log(response);
      });

    $scope.package = {
      name: 'dashboard'
    };

    $scope.getTemperatures = function(){
      var thermostatId = $scope.thermostat;
      $http.get('/thermostats/' + thermostatId).success(function(response){
        if(!$scope.graphs[thermostatId].visible){
          $scope.graphs[thermostatId].visible = true;

          var d = [
            {timestamp: '2014-09-07', temp: 25.7}, 
            {timestamp: '2014-09-06', temp: 23.7}, 
            {timestamp: '2014-09-05', temp: 24.7}];

          var options = {
            element: 'temperature-statistics-' + thermostatId,
            xkey: 'timestamp',
            ykeys: ['temp'],
            labels: ['Temperature'],
            data: d
          };

          new Morris.Line(options);
        }
        else{
          $scope.graphs[thermostatId].visible = false;
        }
      });
    };
  }
]);
