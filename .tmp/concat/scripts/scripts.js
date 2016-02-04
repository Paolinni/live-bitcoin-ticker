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
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/todos', {
        templateUrl: 'views/todos.html',
        controller: 'TodoController'
      })
      .when('/bitcoin', {
        templateUrl: 'views/bitcoin.html',
        controller: 'GraphController'
      })
      .when('/', {
        templateUrl: 'index.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .factory('Ticker', ["$http", function ($http) {
    var fetchData = function() {
      return $http({
        method: 'GET',
        url: 'https://api.bitcoinaverage.com/ticker/USD'
      })
      .then(function(res) {
        console.log('res data: ', res);
        return res;
      });
    };

    return {
      fetchData: fetchData
    };
  }]);

'use strict';

angular.module('myMvpProjectApp')

  .controller('TodoController', ["$scope", "localStorageService", function ($scope, localStorageService) {
    var todosInStore = localStorageService.get('todos');

    $scope.todos = todosInStore || ['bob','cheese'];

    $scope.$watch('todos', function() {
      localStorageService.set('todos', $scope.todos);
    }, true);

    $scope.todo = '';

    $scope.addTodo = function() {
      if ($scope.todos.indexOf($scope.todo) !== -1) {
        //todo: implement dirty checker for this
      } else if ($scope.todo) {
        $scope.todos.push($scope.todo);
        $scope.todo = '';
      }
      console.log('localStorage: ', $scope.todos);
    };

    $scope.removeTodo = function(index) {
      $scope.todos.splice(index, 1);
      console.log('localStorage: ', $scope.todos);
    };

  }]);

angular.module('myMvpProjectApp')

.controller('GraphController', ["$scope", "$interval", "Ticker", "localStorageService", function ($scope, $interval, Ticker, localStorageService) {
    $scope.countDownNewTick = 0;
    var stop;

    var ticksInStore = localStorageService.get('coinData');

    $scope.coinData = ticksInStore || [{hour: 1, value: 461}];

    $scope.$watch('coinData', function() {
      localStorageService.set('coinData', $scope.coinData);
    }, true);

    $scope.liveTick = '';

    $scope.getLiveTicks = function() {
      Ticker.fetchData()
      .then(function(tick) {
        console.log('tick: ', tick);
        $scope.liveTick = tick;
        $scope.coinData.push({ hour: $scope.coinData.length+1, value: tick.data.last });
        $scope.countDownNewTick = 9;
        $interval.cancel(stop);
          stop = $interval(function() {
            $scope.countDownNewTick--;
          }, 1000);
        console.log('liveTick: ', $scope.liveTick)
      })
      .catch(function(err) {
        console.log(err);
        console.error(err);
      });
    };


    $interval(function() {
        $scope.getLiveTicks();
    }, 10000);
}])

.directive('linearChart', ["$parse", "$window", function($parse, $window){
   return {
      restrict: 'EA',
      template: "<svg width='850' height='200'></svg>",
       link: function(scope, elem, attrs){
           var exp = $parse(attrs.chartData);

           var coinDataToPlot = exp(scope);
           var padding = 25;
           var pathClass = "path";
           var xScale, yScale, xAxisGen, yAxisGen, lineFun;

           var d3 = $window.d3;
           var rawSvg = elem.find('svg');
           var svg = d3.select(rawSvg[0]);

           scope.$watchCollection(exp, function(newVal, oldVal){
               coinDataToPlot = newVal;
               redrawLineChart();
           });

           function setChartParameters(){

               xScale = d3.scale.linear()
                   .domain([coinDataToPlot[0].hour, coinDataToPlot[coinDataToPlot.length-1].hour])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

               yScale = d3.scale.linear()
                   .domain([d3.min(coinDataToPlot, function (d) {
                     return d.value;
                   }), d3.max(coinDataToPlot, function (d) {
                     return d.value;
                   })])
                   .range([rawSvg.attr("height") - padding, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(6);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(10);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.hour);
                   })
                   .y(function (d) {
                       return yScale(d.value);
                   })
                   .interpolate("linear");
           }

         function drawLineChart() {

               setChartParameters();

               svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(12,178)")
                   .call(xAxisGen);

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(40,0)")
                   .call(yAxisGen);

               svg.append("svg:path")
                   .attr({
                       d: lineFun(coinDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
           }

           function redrawLineChart() {

               setChartParameters();

               svg.selectAll("g.y.axis").call(yAxisGen);

               svg.selectAll("g.x.axis").call(xAxisGen);

               svg.selectAll("."+pathClass)
                   .attr({
                       d: lineFun(coinDataToPlot)
                   });
           }

           drawLineChart();
       }
   };
}]);


angular.module('myMvpProjectApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/bitcoin.html',
    "<div class=\"container\" ng-controller=\"GraphController\"> <h2>Live Bitcoin Ticker</h2> <h1> <span class=\"tick-price-txt\">Current Value: </span> <span type=\"text\" class=\"tick-price\">{{ liveTick.data.last | currency }}</span> Update in: <span class=\"counter\">{{ countDownNewTick }}</span> </h1> <div> <div linear-chart chart-data=\"coinData\"></div> </div> </div>"
  );


  $templateCache.put('views/todos.html',
    "<div class=\"container\"> <h2>My Todos</h2> <form role=\"form\" ng-submit=\"addTodo()\"> <div class=\"row\"> <div class=\"input-group\"> <input type=\"text\" ng-model=\"todo\" placeholder=\"What todo?\" class=\"form-control\"> <span class=\"input-group-btn\"> <input type=\"submit\" class=\"btn btn-primary\" value=\"Add\"> </span> </div> </div> </form> <p class=\"input-group\" ng-repeat=\"todo in todos\"> <span type=\"text\" ng-model=\"todo\" class=\"todos\">{{ todo }}</span> <button class=\"btn btn-danger\" ng-click=\"removeTodo($index)\">X</button> </p> </div>"
  );

}]);
