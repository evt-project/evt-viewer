angular.module('evtviewer.mobile')

.directive('menuMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/Mobile/MobileMenu.dir.tmpl.html',
        controller: 'MobileMenuCtrl'
    };
});