/**
 * @ngdoc directive
 * @module evtviewer.reading
 * @name evtviewer.reading.directive:evtReading
 * @description 
 * # evtReading
 * TODO: Add description!
 * It uses the {@link evtviewer.reading.controller:ReadingCtrl ReadingCtrl} controller. 
 *
 * @scope
 * @param {string=} appId id of connected critical apparatus
 * @param {string=} readingId id of reading to be shown
 * @param {string=} readingType tipology of reading
 * @param {int=} variance value of variance connected to reading
 * @param {string=} scopeWit id of scope witness
 * @param {string=} type of reading element ('variant', 'lemma')
 *
 * @restrict E
**/
angular.module('evtviewer.reading')

.directive('evtReading', function(evtReading, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            appId       : '@',
            readingId   : '@',
            readingType : '@',
            variance    : '@',
            scopeWit    : '@',
            type        : '@'
        },
        transclude: true,
        templateUrl: 'src/reading/reading.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'ReadingCtrl',
        link: function(scope, element, attrs){
            // Initialize reading
            scope.currentViewMode = evtInterface.getState('currentViewMode');
            scope.inlineApparatus = evtInterface.isCriticalApparatusInline();
            var currentReading = evtReading.build(scope.appId, scope);
            if (scope.inlineApparatus && evtInterface.getState('currentAppEntry') === scope.appId) {
                currentReading.openApparatus();
            }
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentReading){
                    currentReading.destroy();
                }     
            });
        }
    };
});