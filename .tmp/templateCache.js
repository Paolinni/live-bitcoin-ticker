angular.module('myMvpProjectApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/bitcoin.html',
    "<div class=\"container\" ng-controller=\"GraphController\"> <h2>Live Bitcoin Ticker</h2> <h1> <span class=\"tick-price-txt\">Current Value: </span> <span type=\"text\" class=\"tick-price\">{{ liveTick.data.last | currency }}</span> Update in: <span class=\"counter\">{{ countDownNewTick }}</span> </h1> <div> <div linear-chart chart-data=\"coinData\"></div> </div> </div>"
  );


  $templateCache.put('views/todos.html',
    "<div class=\"container\"> <h2>My Todos</h2> <form role=\"form\" ng-submit=\"addTodo()\"> <div class=\"row\"> <div class=\"input-group\"> <input type=\"text\" ng-model=\"todo\" placeholder=\"What todo?\" class=\"form-control\"> <span class=\"input-group-btn\"> <input type=\"submit\" class=\"btn btn-primary\" value=\"Add\"> </span> </div> </div> </form> <p class=\"input-group\" ng-repeat=\"todo in todos\"> <span type=\"text\" ng-model=\"todo\" class=\"todos\">{{ todo }}</span> <button class=\"btn btn-danger\" ng-click=\"removeTodo($index)\">X</button> </p> </div>"
  );

}]);
