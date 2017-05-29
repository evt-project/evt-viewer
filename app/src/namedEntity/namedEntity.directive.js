angular.module('evtviewer.namedEntity')

.directive('evtNamedEntity', function(evtNamedEntity, parsedData) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
            entityListId : '@',
            entityType : '@',
            entityListPos : '@'
        },
        transclude: true,
        templateUrl: 'src/namedEntity/namedEntity.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize namedEntity
            scope.vm = {
                entityId: scope.entityId,
                entityListId: scope.entityListId,
                entityType: scope.entityType,
                entityListPos: scope.entityListPos
            };
            var currentNamedEntity = evtNamedEntity.build(scope.entityId, scope);
            
            // Garbage collection
            scope.$on('$destroy', function() {
                if (scope.vm.uid) {
                    evtNamedEntity.destroy(scope.vm.uid);
                }     
            });
        }
    };
});