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
        template: require('./mobile/mobileInfo.dir.tmpl.html'),
        controller: 'MobileInfoCtrl'
    };
});