/**
 * @ngdoc directive
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.directive:evtBiblElem
 * @description 
 * # evtBiblElem
 * TODO: Add description!
 * It uses the {@link evtviewer.bibliography.controller:BiblElemCtrl BiblElemCtrl} controller.
 *
 * @scope
 * @param {string=} biblId id of bibliographic entry to be shown
 *
 * @restrict E
**/
angular.module('evtviewer.bibliography')

.directive('evtBiblElem', function() {
    return {
        restrict: 'E',
        scope: {
            biblId : '@'
        },
        transclude: true,
        templateUrl: 'src/bibliography/biblElem.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'BiblElemCtrl'
    };
});