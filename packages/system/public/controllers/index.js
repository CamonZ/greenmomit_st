'use strict';

angular.module('mean.system').controller('IndexController', ['$http', '$location', '$scope', '$rootScope', 'Global',
  function($http, $location, $scope, $rootScope, Global) {
    $scope.global = Global;

    $http.get('/greenmomit_login')
      .success(function(response){
        console.log(response);
        $rootScope.user = response;
        $location.url('/dashboard');
      });
  }
]);
