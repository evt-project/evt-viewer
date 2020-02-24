angular.module('evtviewer.3dhop')

.controller('TreDHOPCtrl', function($log, $scope, $http) {
	var vm = this;
   var _console = $log.getInstance('3dhop');
   $http.get("array.json")
      .success(function (response) {
         $scope.options = response.dati[0];
         console.log("Prova");
         var objurl = response.dati[0];
         console.log(objurl);
      });
});
