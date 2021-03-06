'use strict';

angular.module('myMvpProjectApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/todos', {
        templateUrl: 'views/todos.html',
        controller: 'TodoController'
      })
      .when('/bitcoin', {
        templateUrl: 'views/bitcoin.html',
        controller: 'GraphController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('Ticker', function ($http) {
    var fetchData = function() {
      return $http({
        method: 'GET',
        url: 'https://api.coindesk.com/v1/bpi/currentprice.json'
      })
      .then(function(res) {
        console.log('res data: ', res);
        return res;
      });
    };

    return {
      fetchData: fetchData
    };
  });
