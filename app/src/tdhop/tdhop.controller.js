angular.module('evtviewer.tdhop')
   .controller('TreDHOPCtrl', ["$scope", "$route",  "evtInterface", "$log", function($scope, $route, evtInterface, $log) {
      //var _console = $log.getInstance('tredhop');
      var vm = this;
      //$scope.reloadPage = function(){window.location.reload();}
      $scope.elencoCitta = [
			{codice: "RM", nome: "Roma"},
			{codice: "MI", nome: "Milano"},
			{codice: "NA", nome: "Napoli"},
			{codice: "PA", nome:"Palermo"}
		];
   }]);
