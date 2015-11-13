angular.module('evtviewer.reading')

.directive('evtReading', function(evtReading) {
    return {
        restrict: 'E',
        scope: {
            appEntryId: '@'
        },
        transclude: true,
        templateUrl: 'src/reading/reading.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'ReadingCtrl',
        link: function(scope, element, attrs){
            // Initialize reading
            var currentReading = evtReading.build(scope.appEntryId, scope.vm);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentReading){
                    currentReading.destroy();
                }     
            });
        }
    };
});