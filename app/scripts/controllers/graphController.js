angular.module('myMvpProjectApp')

.controller('GraphController', function ($scope, $interval, Ticker, localStorageService) {
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

        if ($scope.coinData.indexOf(tick.data) === -1) {
          $scope.coinData.push({ hour: $scope.coinData.length+1, value: tick.data.last });
          console.log('ticks: ', $scope.ticks);
        }
        console.log('liveTick: ', $scope.liveTick)
      })
      .catch(function(err) {
        console.log(err);
        console.error(err);
      });
    };
    setInterval(function() {
        $scope.getLiveTicks();
    }, 10000);
})

.directive('linearChart', function($parse, $window){
   return {
      restrict: 'EA',
      template: "<svg width='850' height='200'></svg>",
       link: function(scope, elem, attrs){
           var exp = $parse(attrs.chartData);

           var coinDataToPlot = exp(scope);
           var padding = 5;
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
                   .ticks(coinDataToPlot.length - 1);

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
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
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
});

