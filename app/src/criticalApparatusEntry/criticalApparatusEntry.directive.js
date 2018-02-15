/**
 * @ngdoc directive
 * @module evtviewer.criticalApparatusEntry
 * @name evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry
 * @description 
 * # evtCriticalApparatusEntry
 * <p>Custom element that identifies a critical apparatus entry, whose contents are properly organized.</p>
 * <p>It is an inline element that can be used both alone or after a connected reading/lemma, and is divided in two main area:
 * <ul>
 * <li>at the top there is a fixed area that shows the traditional apparatus text, composed of the lemma, eventually
 * followed by siglas of witnesses attesting it, and significant readings, eventually followed by siglas of witnesses 
 * attesting them.</li>
 * <li>at the bottom there is a dynamic area where additional contents are properly divided into tabs allowing a quicker
 * access to the information itself. Example of tab can be "Orthografic Variants", "Critical note", "XML Source", etc.
 * If there are no additional information this area is automatically hidden from UI.</li></ul></p>
 * <p>It uses the {@link evtviewer.criticalApparatusEntry.controller:CriticalApparatusEntryCtrl CriticalApparatusEntryCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry evtCriticalApparatusEntry} provider.</p>
 *
 * @scope
 * @param {string=} appId id of critical apparatus entry to be shown
 * @param {string=} readingId id of connected reading
 * @param {string=} scopeWit id of scope witness
 * @param {string=} type type of apparatus ('pinned')
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
            exponent    : '@'
        },
        transclude: true,
        templateUrl: 'src/criticalApparatusEntry/criticalApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'CriticalApparatusEntryCtrl',
        link: function(scope, element, attrs){
            scope.scopeViewMode = evtInterface.getState('currentViewMode');
            var currentAppEntry = evtCriticalApparatusEntry.build(scope.appId, scope);
            if (!evtInterface.isCriticalApparatusInline()) {
                currentAppEntry.selected = evtInterface.getState('currentAppEntry') === scope.appId;
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