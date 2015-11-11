angular.module('evtviewer.criticalApparatus', [])
.directive('reading', function() {
    return {
        restrict: 'E',
        trasclude: true,
        template: '<ng-transclude></ng-transclude>'
    };
})
;