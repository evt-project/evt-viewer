/**
 * @ngdoc object
 * @module evtviewer.navBar
 * @name evtviewer.navBar.controller:NavbarCtrl
 * @description 
 * # NavbarCtrl
 * This is the controller for the {@link evtviewer.navBar.directive:evtNavbar evtNavbar} directive. 
 * @requires $log
 * @requires $scope
 * @requires evtviewer.core.config
 * @requires evtviewer.navBar.evtNavbar
 * @requires evtviewer.popover.evtPopover
 * @requires evtviewer.dataHandler.baseData
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.box.evtBox
**/
angular.module('evtviewer.navBar')

.controller('NavbarCtrl', function(config, $log, $scope, evtReading, parsedData, evtPopover, evtCriticalApparatusParser, baseData, evtInterface, evtCriticalApparatusEntry, evtApparatuses, evtBox) {
    var vm = this;
    
    var _console = $log.getInstance('navBar');
    // 
    // Control function
    // 
	// metodi vari
});