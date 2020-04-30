angular.module('evtviewer.tdhop', [])
   module.controller('TreDHOPCtrl', ["$scope", "$route", function($scope, $route, evtInterface) {
      var vm = this;
      $scope.reloadPage = function(){window.location.reload();}
   }])
