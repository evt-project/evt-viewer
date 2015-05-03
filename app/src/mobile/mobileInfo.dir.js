/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

.directive('infoMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/mobile/mobileInfo.dir.tmpl.html',
        controller: 'MobileInfoCtrl'
    };
});