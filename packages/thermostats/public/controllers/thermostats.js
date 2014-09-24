'use strict';

angular.module('mean.thermostats', ['ngLodash']).
  controller('ThermostatsController', ['$http', '$scope', '$location', '$stateParams', 'lodash', 'Global',
  function($http, $scope, $location, $stateParams, lodash, Global) {
    $scope.global = Global;

    $http.get('/thermostats/' + $stateParams.thermostatId).
      success(function(response){ 
        $scope.thermostat = response; 
      });

    $http.get('/thermostats/' + $stateParams.thermostatId + '/historic_temperatures').
      success(function(response){ 
        $scope.thermostat.historic_temperatures = response; 
      });

    $scope.package = {
      name: 'thermostats'
    };

    $scope.showThermostatData = function(){ };
  }
]);
