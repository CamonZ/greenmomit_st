'use strict';

angular.module('mean.dashboard').
  controller('DashboardController', ['$http', '$scope', '$rootScope', 'Global', 'Dashboard',
  function($http, $scope, $rootScope, Global, Dashboard) {
    $scope.global = Global;

    var user = window.user;
    console.log(user);
    $http.get('/thermostats', { params: { sessionToken: user.sessionToken } }).
      success(function(response){
        console.log(response);
      });

    $scope.package = {
      name: 'dashboard'
    };
  }
]);
