/**
 * @ngdoc directive
 * @module evtviewer.reading
 * @name evtviewer.reading.directive:evtReading
 * @description 
 * # evtReading
 * <p>Element that identify a critical reading connected to a specific critical apparatus. </p>
 * <p>It can be used both in the critical and in witnesses text: in the first case it will show the lemma,
 * in the second case it will show the reading for the specific scope witness.</p>
 * <p>It is used in features like critical variant linking or filtering and heat map.</p>
 * <p>When the user clicks on it, the connected critical apparatus with all the information retrieved 
 * from the source encoded text (and stored in {@link evtviewer.dataHandler.parsedData parsedData}) will be shown</p>
 * <p>It uses the {@link evtviewer.reading.controller:ReadingCtrl ReadingCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.reading.evtReading evtReading} provider.</p>
 *
 * @scope
 * @param {string} appId id of connected critical apparatus
 * @param {string} readingId id of reading to be shown
 * @param {string} type of reading element ('variant', 'lemma')
 * @param {string} scopeWit id of scope witness
 * @param {string=} readingType tipology of reading
 * @param {number=} variance value of variance connected to reading
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