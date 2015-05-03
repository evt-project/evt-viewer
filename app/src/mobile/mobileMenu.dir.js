/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

.directive('menuMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/mobile/mobileMenu.dir.tmpl.html',
        controller: 'MobileMenuCtrl'
    };
});