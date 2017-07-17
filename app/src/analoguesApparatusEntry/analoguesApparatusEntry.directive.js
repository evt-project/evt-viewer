/**
 * @ngdoc directive
 * @module evtviewer.analoguesApparatusEntry
 * @name evtviewer.analoguesApparatusEntry.directive:evtAnaloguesApparatusEntry
 * @description 
 * # evtAnaloguesApparatusEntry
 * TODO: Add description!
 * It uses the {@link evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl analoguesApparatusEntryCtrl} controller.
 *
 * @scope
 * @param {string=} analogueId id of analogue to be shown
 * @param {string=} scopeWit id of scope witness
 *
 * @restrict E
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
            scope.scopeViewMode = evtInterface.getState('currentViewMode');
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