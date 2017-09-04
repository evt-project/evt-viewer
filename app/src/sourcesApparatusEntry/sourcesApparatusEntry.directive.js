/**
 * @ngdoc directive
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry
 * @description 
 * # evtSourcesApparatusEntry
 * <p>Custom element that identifies a source apparatus entry, whose contents are properly organized.</p>
 * <p>It is an inline element that can be used both alone or after a connected source, and is divided in three main area:
 * <ul>
 * <li>at the top there is a fixed area that shows the text of the source and allows the user to navigate within a single source apparatus
 * to search for the desired entry without having to consult the critical text;</li>
 * <li>in the middle there is another fixed area that shows a list of quoted sources in the form of 
 * synthetic bibliographic references, consisting of the author's name and the title;</li>
 * <li>at the bottom there is a dynamic area where additional contents are properly divided into tabs allowing a quicker
 * access to the information itself. Example of tab can be "Text of source", "Bibliographic Reference", "XML Source", etc.
 * If there are no additional information this area is automatically hidden from UI.</li></ul></p>
 * <p>It uses the {@link evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl sourcesApparatusEntryCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry evtSourcesApparatusEntry} provider.</p>
 *
 * @scope
 * @param {string=} quoteId id of connected quote
 * @param {string=} scopeWit id of scope witness
 *
 * @restrict E
 *
 * @requires evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
 * 
 * @author CM
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
            scope.scopeViewMode = evtInterface.getState('currentViewMode');
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