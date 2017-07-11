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
            type        : '@',
        },
        transclude: true,
        templateUrl: 'src/reading/reading.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'ReadingCtrl',
        link: function(scope, element, attrs){
            // Initialize reading
            scope.currentViewMode = evtInterface.getCurrentViewMode();
            scope.inlineApparatus = evtInterface.isCriticalApparatusInline();
            var currentReading = evtReading.build(scope.appId, scope);
            if (scope.inlineApparatus && evtInterface.getCurrentAppEntry() === scope.appId) {
                console.log('openApparatus')
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