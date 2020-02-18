/**
 * @ngdoc controller
 * @module evtviewer.3dhop
 * @name evtviewer.3dhop.controller:TreDHOPCtrl
 * @description 
 * # TreDHOPCtrl
 * This is the controller for the {@link evtviewer.3dhop.directive:evtTreDHOP evtTreDHOP} directive. 
 *
 * @requires $log
 * @requires $scope
 * @requires evtviewer.core.config
 * @requires evtviewer.3dhop.evtTreDHOP
 * @requires evtviewer.parsedData
 * @requires evtviewer.interface.evtInterface
 **/
angular.module('evtviewer.3dhop')

.controller('TreDHOPCtrl', function($log, $scope, parsedData, evtInterface, evtTreDHOP, $ocLazyLoad, $compile) {
	var vm = this;

	var _console = $log.getInstance('3dhop');

});
