'use strict';

angular.module('mean.thermostats', ['ngLodash']).
  controller('ThermostatsController', ['$http', '$scope', '$location', '$stateParams', 'lodash', 'Global',
  function($http, $scope, $location, $stateParams, lodash, Global) {
    $scope.global = Global;
    $scope.graphs = {};

    var user = window.user;

    if(user.sessionToken === undefined) $location.url('/'); //ensure the user is set

    $http.get('/thermostats/' + $stateParams.thermostatId, { params: { sessionToken: user.sessionToken } }).
      success(function(response){ $scope.thermostat = response; });

    $scope.package = {
      name: 'dashboard'
    };

    $scope.showThermostatData = function(){ };
  }
]);
