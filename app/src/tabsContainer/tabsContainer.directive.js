angular.module('evtviewer.tabsContainer')

.directive('evtTabsContainer', function() {

    return {
        restrict: 'E',
        scope: {
            type        : '@',
            orientation : '@'
        },
        templateUrl: 'src/tabsContainer/tabsContainer.dir.tmpl.html',
        controller: 'TabsContainerCtrl'
    };
});