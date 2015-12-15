// angular.module('myMvpProjectApp')

//   .controller('BitcoinController', function ($scope, Ticker, localStorageService) {
//     // var ticksInStore = localStorageService.get('ticks');

//     // $scope.ticks = ticksInStore || [];

//     // $scope.$watch('ticks', function() {
//     //   localStorageService.set('ticks', $scope.ticks);
//     // }, true);

//     $scope.liveTick = '';

//     $scope.getLiveTicks = function() {
//       Ticker.fetchData()
//       .then(function(tick) {
//         console.log('tick: ', tick);
//         $scope.liveTick = tick;

//         // if ($scope.ticks.indexOf(tick) === -1) {
//         //   $scope.liveTick = tick.data;
//         //   $scope.ticks.push(tick.data);
//         //   console.log('ticks: ', $scope.ticks);
//         // }
//         console.log('liveTick: ', $scope.liveTick)
//       })
//       .catch(function(err) {
//         console.log(err);
//         console.error(err);
//       });
//     };

//     setInterval(function() {
//         $scope.getLiveTicks();
//     }, 5000);
//   });
