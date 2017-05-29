angular.module('evtviewer.namedEntity')

.directive('evtNamedEntityRef', function(evtNamedEntityRef) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
            entityType : '@',
            entityListPos : '@'
        },
        transclude: true,
        templateUrl: 'src/namedEntity/namedEntityRef.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize namedEntity
            scope.vm = {
                entityId: scope.entityId,
                entityType: scope.entityType,
                entityListPos: scope.entityListPos
            };
            var currentNamedEntity = evtNamedEntityRef.build(scope.entityId, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (scope.vm.uid) {
                    evtNamedEntityRef.destroy(scope.vm.uid);
                }     
            });
        }
    };
});