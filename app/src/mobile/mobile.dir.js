angular.module('evtviewer.mobile')

.directive('mainMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/Mobile/Mobile.dir.tmpl.html'
        // controller: 'MobileCtrl'
    };
});