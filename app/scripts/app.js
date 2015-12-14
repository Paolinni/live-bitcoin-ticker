'use strict';

/**
 * @ngdoc overview
 * @name myMvpProjectApp
 * @description
 * # myMvpProjectApp
 *
 * Main module of the application.
 */

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
        controller: 'todoController',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
