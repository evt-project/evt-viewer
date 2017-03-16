angular.module('evtviewer.sourcesApparatusEntry')

.directive('evtSourcesApparatusEntry', function(evtSourcesApparatusEntry, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            quoteId       : '@',
            scopeWit : '@',
        },
        transclude: true,
        templateUrl: 'src/sourcesApparatusEntry/sourcesApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'sourcesApparatusEntryCtrl',
        link: function(scope, element, attrs){
            scope.scopeViewMode = evtInterface.getCurrentViewMode();
            var currentEntry = evtSourcesApparatusEntry.build(scope.quoteId, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentEntry){
                    currentEntry.destroy();
                }     
            });
        }
    };
});