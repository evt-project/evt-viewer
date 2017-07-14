/**
 * @ngdoc directive
 * @module evtviewer.analoguesApparatusEntry
 * @name evtAnaloguesApparatusEntry
 * @description ...
 * @usage
**/
angular.module('evtviewer.analoguesApparatusEntry')

.directive('evtAnaloguesApparatusEntry', function(evtAnaloguesApparatusEntry, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            analogueId: '@',
            scopeWit  : '@',
        },
        transclude: true,
        templateUrl: 'src/analoguesApparatusEntry/analoguesApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'analoguesApparatusEntryCtrl',
        link: function(scope, element, attrs){
            scope.scopeViewMode = evtInterface.getCurrentViewMode();
            // Initialize apparatus entry
            var currentEntry = evtAnaloguesApparatusEntry.build(scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentEntry){
                    currentEntry.destroy();
                }     
            });
        }
    };
});