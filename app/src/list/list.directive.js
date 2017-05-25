angular.module('evtviewer.list')

.directive('evtList', function(evtList, parsedData) {
    return {
        restrict: 'E',
        scope: {
            name : '@'
        },
        transclude: true,
        templateUrl: 'src/list/list.dir.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize list
            scope.vm = {
                name: scope.name
            };
            var currentList = evtList.build(scope.name, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentList){
                    currentList.destroy();
                }     
            });
        }
    };
});