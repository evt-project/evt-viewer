/**
 * @ngdoc object
 * @module evtviewer.tabsContainer
 * @name evtviewer.tabsContainer.controller:TabsContainerCtrl
 * @description
 * # TabsContainerCtrl
 * This is the controller for the {@link evtviewer.tabsContainer.directive:evtTabsContainer evtTabsContainer} directive.
 * @requires $log
 * @requires $scope
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
**/
angular.module('evtviewer.tabsContainer')

.controller('TabsContainerCtrl', function($log, $scope, parsedData, evtInterface) {
    var _console = $log.getInstance('tabsContainer');

    

    _console.log('TabsContainerCtrl running');
});
