angular.module('evtviewer.3dhop')

.controller('TreDHOPCtrl', function($log, $scope, $http) {
	var vm = this;
   var _console = $log.getInstance('tdhop');
   var tying= JSON.parse(JSON.stringify(config.witnessesGroups));
   console.log("Caricamento CONFIG " +tying);
});
