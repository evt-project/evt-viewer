/**
 * @name evtviewer.mobile
 */
 
angular.module('evtviewer.mobile')

.directive('viewMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        template: require('./mobileView.dir.tmpl.html'),
        controller: 'MobileViewCtrl'
    };
});
