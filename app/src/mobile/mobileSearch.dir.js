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
        templateUrl: 'src/mobile/mobileSearch.dir.tmpl.html',
        controller: 'MobileSearchCtrl'
    };
});