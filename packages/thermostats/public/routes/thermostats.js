'use strict';

angular.module('mean.thermostats').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('thermostats', {
      url: '/thermostats/:thermostatId',
      templateUrl: 'thermostats/views/show.html'
    });
  }
]);