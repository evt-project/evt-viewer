/**
 * @ngdoc directive
 * @module evtviewer.reference
 * @name evtviewer.reference.directive:ref
 * @description 
 * # ref
 * <p>Element pointing to internal or external resources.</p>
 * <p>A particular action will be performed when clicking on it, 
 * according to target type (internal, external, etc.).</p>
 * <p>It uses the {@link evtviewer.reference.controller:RefCtrl RefCtrl} controller.</p>
 * <p>The initial scope is extended in {@link evtviewer.reference.evtRef evtRef} provider.</p>
 *
 * @scope
 * @param {string=} target referenced target
 * @param {string=} type of reference ('', biblRef', 'biblio')
 *
 * @restrict C
**/
angular.module('evtviewer.reference')

.directive('ref', function(evtRef, $timeout) {
    return { //rivedere dipendenze
        restrict: 'E, C',
        scope: {
            target: '@',
            type: '@'
        },
        replace: true,
        transclude: true,
        controllerAs: 'vm',
        controller: 'RefCtrl',
        templateUrl: 'src/reference/ref.dir.tmpl.html',
        link: function(scope, element) {
            // Initialize reading
            var currentRef = evtRef.build(scope);
            $timeout(function() {
                var tooltipReference = angular.element(element).find('.evtRef_ref')[0];
                var tooltip = new Tooltip(tooltipReference, {
                    title: currentRef.tooltipTitle,
                    placement: 'top',
                    boundariesElement: tooltipReference.parentElement,
                    popperOptions: {}
                });
                currentRef.tooltip = tooltip;
            });
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentRef && currentRef.destroy) {
                    currentRef.destroy();
                }
            });
        }
    };
});