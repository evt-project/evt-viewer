/**
 * @ngdoc directive
 * @module evtviewer.criticalApparatusEntry
 * @name evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry
 * @description 
 * # evtCriticalApparatusEntry
 * TODO: Add description!
 * It uses the {@link evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl CriticalApparatusEntryCtrl} controller.
 *
 * @scope
 * @param {string=} appId id of critical apparatus entry to be shown
 * @param {string=} readingId id of connected reading
 * @param {string=} scopeWit id of scope witness
 * @param {string=} type type of apparatus ('pinned')
 * @param {boolean=} visible [TODO: check if necessary]
 * @param {string=} exponent connected exponend 
 *
 * @restrict E
**/
angular.module('evtviewer.criticalApparatusEntry')

.directive('evtCriticalApparatusEntry', function(evtCriticalApparatusEntry, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            appId       : '@',
            readingId   : '@',
            scopeWit    : '@',
            type        : '@',
            visible     : '@',
            exponent    : '@'
        },
        transclude: true,
        templateUrl: 'src/criticalApparatusEntry/criticalApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'CriticalApparatusEntryCtrl',
        link: function(scope, element, attrs){
            scope.scopeViewMode = evtInterface.getCurrentViewMode();
            var currentAppEntry = evtCriticalApparatusEntry.build(scope.appId, scope);
            if (!evtInterface.isCriticalApparatusInline()) {
                currentAppEntry.selected = evtInterface.getCurrentAppEntry() === scope.appId;
            }
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentAppEntry){
                    currentAppEntry.destroy();
                }     
            });
        }
    };
});