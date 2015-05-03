/**
 * @name evtviewer.mobile
 */

angular.module('evtviewer.mobile')

.directive('mainMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/mobile/mobile.dir.tmpl.html'
    };
});