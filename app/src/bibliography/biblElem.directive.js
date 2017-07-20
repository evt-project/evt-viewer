/**
 * @ngdoc directive
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.directive:evtBiblElem
 * @description 
 * # evtBiblElem
 * <p>Show a single bibliography element formatted according to a specific, globally selected style.</p>
 * <p>It uses the {@link evtviewer.bibliography.controller:BiblElemCtrl BiblElemCtrl} controller.</p>
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