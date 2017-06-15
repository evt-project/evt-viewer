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
