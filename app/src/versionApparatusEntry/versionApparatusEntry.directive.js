/**
 * @ngdoc directive
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry
 * @description 
 * # evtVersionApparatusEntry
 * TODO: Add description!
 * It uses the {@link evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl versionApparatusEntryCtrl} controller. 
 *
 * @scope
 * @param {string=} appId id of version apparatus entry to be shown
 * @param {string=} readingId id of reading to be shown
 * @param {string=} scopeWit id of scope witness
 * @param {string=} scopeVer id of scope version
 *
 * @restrict E
 *
 * @author Chiara Martignano
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