/**
 * @ngdoc directive
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.directive:evtSourceSeg
 * @description 
 * # evtSourceSeg
 * <p>Custom directive that will show the segment within the source text.</p>
 * <p>It uses the {@link evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl sourceSegCtrl} controller. </p>
 *
 * @scope
 * @param {string=} segId id of connected segment
 * @param {string=} sourceId id of connected source
 *
 * @restrict E
 *
 * @requires evtviewer.sourcesApparatusEntry.evtSourceSeg
 *
 * @author CM
**/
angular.module('evtviewer.sourcesApparatusEntry')

.directive('evtSourceSeg', function(evtSourceSeg) {
    return {
        restrict: 'E',
        scope: {
            segId : '@',
            //quoteId : '@',
            sourceId : '@'
        },
        transclude: true,
        templateUrl: 'src/sourcesApparatusEntry/sourceSeg.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'sourceSegCtrl',
        link: function(scope, element, attr) {
            
            //Initialize sourceSeg
            var currentSeg = evtSourceSeg.build(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentSeg){
                    currentSeg.destroy();
                }     
            });
        }
    };
});