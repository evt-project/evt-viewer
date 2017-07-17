/**
 * @ngdoc directive
 * @module evtviewer.versionReading
 * @name evtviewer.versionReading.directive:evtVersionReading
 * @description 
 * # evtVersionReading
 * TODO: Add description!
 * It uses the {@link evtviewer.versionReading.controller:versionReadingCtrl versionReadingCtrl} controller. 
 *
 * @scope
 * @param {string=} type tipology of version reading
 * @param {string=} appId id of connected critical apparatus entry
 * @param {string=} readingId id of reading to be shown
 * @param {string=} scopeWit id of scope witness
 * @param {string=} scopeVersion id of scope version
 *
 * @restrict E
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.versionReading')

.directive('evtVersionReading', function(evtVersionReading, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            type         : '@',
            appId        : '@',
            readingId    : '@',
            scopeWit     : '@',
            scopeVersion : '@'
        },
        transclude: true,
        templateUrl: 'src/versionReading/versionReading.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'versionReadingCtrl',
        link: function(scope, element, attrs) {
            scope.currentViewMode = evtInterface.getCurrentViewMode();
            var currentVersionReading = evtVersionReading.build(scope);

            scope.$on('destroy', function() {
                if (currentVersionReading) {
                    currentVersionReading.destroy();
                }
            });
        }
    };
});