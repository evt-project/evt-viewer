/**
 * @ngdoc directive
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry
 * @description 
 * # evtVersionApparatusEntry
 * <p>Custom element that identifies a double recensio apparatus entry, whose contents are properly organized.</p>
 * <p>It is an inline element that can be used both alone or after a connected portion of text, and is divided in two main area:
 * <ul>
 * <li>at the top there is a fixed area that shows the different version of text, eventually cropped to fit in the available window space.</li>
 * <li>at the bottom there is a dynamic area where additional contents are properly divided into tabs allowing a quicker
 * access to the information itself. Example of tab can be "Critical note", "Additional info", "XML Source", etc.
 * If there are no additional information this area is automatically hidden from UI.</li></ul></p>
 * <p>It uses the {@link evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl versionApparatusEntryCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.versionApparatusEntry.evtVersionApparatusEntry evtVersionApparatusEntry} provider.</p>
 *
 * @scope
 * @param {string=} appId id of version apparatus entry to be shown
 * @param {string=} readingId id of reading to be shown
 * @param {string=} scopeWit id of scope witness
 * @param {string=} scopeVer id of scope version
 *
 * @restrict E
 *
 * @requires evtviewer.versionApparatusEntry.evtVersionApparatusEntry
 * @requires evtviewer.interface.evtInterface
 * @author CM
**/
angular.module('evtviewer.versionApparatusEntry')

.directive('evtVersionApparatusEntry', function(evtVersionApparatusEntry, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            appId     : '@',
            readingId : '@',
            scopeWit  : '@',
            scopeVer  : '@'
        },
        transclude: true,
        templateUrl: 'src/versionApparatusEntry/versionApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'versionApparatusEntryCtrl',
        link: function(scope, element, attrs) {
            scope.scopeViewMode = evtInterface.getState('currentViewMode');

            var currentVersionAppEntry = evtVersionApparatusEntry.build(scope);

            scope.$on('destroy', function() {
                if (currentVersionAppEntry) {
                    currentVersionAppEntry.destroy();
                }
            });
        }
    };
});