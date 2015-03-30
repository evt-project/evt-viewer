angular.module('evtviewer.mobile')

.directive('viewMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/mobile/mobileView.dir.tmpl.html',
        controller: 'MobileViewCtrl'
    };
});