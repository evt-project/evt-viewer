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
**/
angular.module('evtviewer.navBar')

.controller('NavbarCtrl', function(config, $log, $scope, evtNavbar) {
    var vm = this;
    
    var _console = $log.getInstance('navBar');
    // 
    // Control function
    // 
	// metodi vari
});