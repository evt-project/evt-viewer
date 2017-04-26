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
    }
})