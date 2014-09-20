'use strict';

angular.module('mean.dashboard', ['ngLodash']).
  controller('DashboardController', ['$http', '$scope', '$location', 'lodash', 'Global',
  function($http, $scope, $location, lodash, Global) {
    $scope.loading = true;
    $scope.global = Global;
    $scope.graphs = {};

    $http.get('/thermostats').
      success(function(response){
        $scope.loading = false;
        $scope.thermostats = response;
        //lodash.each(response, function(val){ $scope.graphs[val.id] = {visible: true, chart: undefined}; });
      });

    $scope.package = {
      name: 'dashboard'
    };

    $scope.getTemperatures = function(thermostatId){ $location.url('/thermostats/' + thermostatId); };
  }
]);
