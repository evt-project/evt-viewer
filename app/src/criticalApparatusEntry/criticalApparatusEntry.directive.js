angular.module('evtviewer.criticalApparatusEntry')

.directive('evtCriticalApparatusEntry', function(evtCriticalApparatusEntry, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            appId       : '@',
            readingId   : '@',
            scopeWit    : '@',
            type        : '@',
            visible     : '@',
            exponent    : '@'
        },
        transclude: true,
        templateUrl: 'src/criticalApparatusEntry/criticalApparatusEntry.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'CriticalApparatusEntryCtrl',
        link: function(scope, element, attrs){
            scope.scopeViewMode = evtInterface.getCurrentViewMode();
            var currentAppEntry = evtCriticalApparatusEntry.build(scope.appId, scope);
            
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentAppEntry){
                    currentAppEntry.destroy();
                }     
            });
        }
    };
});