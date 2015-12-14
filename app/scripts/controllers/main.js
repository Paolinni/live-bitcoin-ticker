'use strict';

angular.module('myMvpProjectApp')

  .controller('MainCtrl', function ($scope, localStorageService) {
    var todosInStore = localStorageService.get('todos');

    $scope.todos = todosInStore || ['bob','cheese'];

    $scope.$watch('todos', function() {
      localStorageService.set('todos', $scope.todos);
    }, true);

    $scope.todo = '';

    $scope.addTodo = function() {
      if ($scope.todos.indexOf($scope.todo) !== -1) {
        //todo: implement dirty checker for this
        alert('That todo already exists!');
      } else if ($scope.todo) {
        $scope.todos.push($scope.todo);
        $scope.todo = '';
      }
    };

    $scope.removeTodo = function(index) {
      $scope.todos.splice(index, 1);
    };

  });
