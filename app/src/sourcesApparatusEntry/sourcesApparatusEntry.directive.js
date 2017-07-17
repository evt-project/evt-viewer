/**
 * @ngdoc directive
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry
 * @description 
 * # evtSourcesApparatusEntry
 * TODO: Add description!
 * It uses the {@link evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl sourcesApparatusEntryCtrl} controller. 
 *
 * @scope
 * @param {string=} quoteId id of connected quote
 * @param {string=} scopeWit id of scope witness
 *
 * @restrict E
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.sourcesApparatusEntry')

.directive('evtSourcesApparatusEntry', function(evtSourcesApparatusEntry, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            quoteId  : '@',
            scopeWit : '@'
        },
        transclude: true,
        templateUrl: 'src/sourcesApparatusEntry/sourcesApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'sourcesApparatusEntryCtrl',
        link: function(scope, element, attrs){
            scope.scopeViewMode = evtInterface.getCurrentViewMode();
            var currentEntry = evtSourcesApparatusEntry.build(scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentEntry){
                    currentEntry.destroy();
                }     
            });
        }
    };
});