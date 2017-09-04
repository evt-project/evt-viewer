/**
 * @ngdoc directive
 * @module evtviewer.analoguesApparatusEntry
 * @name evtviewer.analoguesApparatusEntry.directive:evtAnaloguesApparatusEntry
 * @description 
 * # evtAnaloguesApparatusEntry
 * <p>Custom element that identifies an analogue apparatus entry, whose contents are properly organized.</p>
 * <p>It is an inline element that can be used both alone or after a connected analogue, and is divided in three main area:
 * <ul>
 * <li>at the top there is a fixed area that shows the text of the analogue and allows the user to navigate within a single analogue apparatus
 * to search for the desired entry without having to consult the critical text;</li>
 * <li>in the middle there is another fixed area that shows a list of parallel texts in the form of 
 * synthetic bibliographic references, consisting of the author's name and the title;</li>
 * <li>at the bottom there is a dynamic area where additional contents are properly divided into tabs allowing a quicker
 * access to the information itself. Example of tab can be "Text of analogue", "Bibliographic Reference", "XML Source", etc.
 * If there are no additional information this area is automatically hidden from UI.</li></ul></p>
 * <p>It uses the {@link evtviewer.analoguesApparatusEntry.controller:analoguesApparatusEntryCtrl analoguesApparatusEntryCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.analoguesApparatusEntry.evtAnaloguesApparatusEntry evtAnaloguesApparatusEntry} provider.</p>
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