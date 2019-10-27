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
        template: require('./mobile/mobileMenu.dir.tmpl.html'),
        controller: 'MobileMenuCtrl'
    };
});