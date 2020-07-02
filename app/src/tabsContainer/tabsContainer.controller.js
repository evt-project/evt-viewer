/**
 * @ngdoc object
 * @module evtviewer.tabsContainer
 * @name evtviewer.tabsContainer.controller:TabsContainerCtrl
 * @description
 * # TabsContainerCtrl
 * This is the controller for the {@link evtviewer.tabsContainer.directive:evtTabsContainer evtTabsContainer} directive.
 * @requires $log
**/
angular.module('evtviewer.tabsContainer')

.controller('TabsContainerCtrl', ['$log', function($log) {
    var _console = $log.getInstance('tabsContainer');

    

    _console.log('TabsContainerCtrl running');
}]);
