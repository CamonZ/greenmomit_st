'use strict';

angular.module('mean.system').controller('IndexController', ['$http', '$location', '$scope', 'Global',
  function($http, $location, $scope, Global) {
    $scope.global = Global;

    $http.get('/greenmomit_login')
      .success(function(response){
        window.user = response;
        $location.url('/dashboard');
      });
  }
]);
