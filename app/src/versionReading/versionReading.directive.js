/**
 * @ngdoc directive
 * @module evtviewer.versionReading
 * @name evtviewer.versionReading.directive:evtVersionReading
 * @description 
 * # evtVersionReading
 * <p>Element that identify a double recensio reading connected to a specific double recensio apparatus. </p>
 * <p>When the user clicks on it, the connected double recensio apparatus with all the information retrieved 
 * from the source encoded text (and stored in {@link evtviewer.dataHandler.parsedData parsedData}) will be shown</p>
 * <p>It uses the {@link evtviewer.versionReading.controller:versionReadingCtrl versionReadingCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.versionReading.evtVersionReading evtVersionReading} provider.</p>
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
 * @requires evtviewer.versionReading.evtVersionReading
 * @requires evtviewer.interface.evtInterface
 *
 * @author CM
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
            scope.currentViewMode = evtInterface.getState('currentViewMode');
            var currentVersionReading = evtVersionReading.build(scope);

            scope.$on('destroy', function() {
                if (currentVersionReading) {
                    currentVersionReading.destroy();
                }
            });
        }
    };
});