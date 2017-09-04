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
     
    $scope.service = evtInterface; 
    $scope.$watch('service.getHomePanel()', function(newVal) { 
        if (newVal !== '') { 
            $scope.toggleSubContent(newVal); 
        }
    });


    $scope.service.setTabContainerPanel($scope.tabs);

    _console.log('TabsContainerCtrl running');
});
