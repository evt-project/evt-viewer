angular.module('evtviewer.reading')

.directive('evtReading', function(evtReading, parsedData) {
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
            var currentReading = evtReading.build(scope.appId, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentReading){
                    currentReading.destroy();
                }     
            });
        }
    };
});