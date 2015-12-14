'use strict';

angular.module('myMvpProjectApp')

  .controller('MainCtrl', function ($scope) {
    $scope.todos = ['item1', 'item2', 'item3'];
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

  });
