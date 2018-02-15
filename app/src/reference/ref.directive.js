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

.directive('ref', function(evtRef) {
    return { //rivedere dipendenze
        restrict: 'C',
        scope: {
            target: '@',
            type: '@'
        },
        replace: true,
        transclude: true,
        controllerAs: 'vm',
        controller: 'RefCtrl',
        template: '<span class="evtRef" ng-click="vm.handleRefClick($event)" ng-transclude></span>',
        link: function(scope) {
            // Initialize reading
            var currentRef = evtRef.build(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentRef && currentRef.destroy) {
                    currentRef.destroy();
                }
            });
        }
    };
});