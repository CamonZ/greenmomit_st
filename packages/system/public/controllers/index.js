'use strict';

angular.module('mean.system').controller('IndexController', ['$http', '$location', '$scope', 'Global',
  function($http, $location, $scope, Global) {
    $scope.global = Global;
    $location.url('/dashboard');
  }
]);
