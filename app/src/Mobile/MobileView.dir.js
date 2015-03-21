angular.module('evtviewer.mobile')

.directive('viewMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/Mobile/MobileView.dir.tmpl.html',
        controller: 'MobileViewCtrl'
    };
});