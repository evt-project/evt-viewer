/**
 * @name evtviewer.mobile
 */
 
angular.module('evtviewer.mobile')

.directive('searchMobile', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        template: require('./mobile/mobileSearch.dir.tmpl.html'),
        controller: 'MobileSearchCtrl'
    };
});