'use strict';

angular.module('mean.dashboard', ['ngLodash']).
  controller('DashboardController', ['$http', '$scope', '$location', 'lodash', 'Global',
  function($http, $scope, $location, lodash, Global) {
    $scope.loading = true;
    $scope.global = Global;
    $scope.graphs = {};

    var user = window.user;

    if(user.sessionToken === undefined) $location.url('/'); //ensure the user is set

    $http.get('/thermostats', { params: { sessionToken: user.sessionToken } }).
      success(function(response){
        $scope.loading = false;
        $scope.thermostats = response;
        lodash.each(response, function(val){ $scope.graphs[val.id] = {visible: true, chart: undefined}; });
      });

    $scope.package = {
      name: 'dashboard'
    };

    $scope.getTemperatures = function(thermostatId){ $location.url('/thermostats/' + thermostatId); };
  }
]);
