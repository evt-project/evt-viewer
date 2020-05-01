angular.module('evtviewer.tdhop', [])
   module.controller('TreDHOPCtrl', ["$scope", "$route", "$log", "evtInterface", function($scope, $route, evtInterface, $log) {
      var vm = this;
      var _console = $log.getInstance('tdhop');
      $scope.reloadPage = function(){window.location.reload();}
   }]);
