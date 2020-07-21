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
        template: require('./mobile.dir.tmpl.html'),
    };
});
