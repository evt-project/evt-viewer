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
 * @requires evtviewer.parsedData
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.select.evtSelect
**/
angular.module('evtviewer.navBar')

.controller('NavbarCtrl', ['$log', 'evtInterface', 'config', function($log, evtInterface, config) {
    var vm = this;
    
    var _console = $log.getInstance('navBar');

    vm.showNavigator = function(){
        return !evtInterface.getState('isThumbNailsOpened') && !evtInterface.getState('isVisCollOpened');
    };
    vm.config = config;
    _console.log(config, vm.config)
    // 
    // Control function
    // 
	// metodi vari
}]);