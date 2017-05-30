angular.module('evtviewer.namedEntity')

.directive('evtNamedEntity', function(evtNamedEntity) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
            entityType : '@'
        },
        transclude: true,
        templateUrl: 'src/namedEntity/namedEntity.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize namedEntity
            scope.vm = {
                entityId: scope.entityId,
                entityType: scope.entityType
            };
            var currentNamedEntity = evtNamedEntity.build(scope.entityId, scope);
            
            var entityElement = element.find('.namedEntity'),
                entityDetails = element.find('.namedEntity__details');

            scope.vm.toggleState = function() {
                if (scope.vm.opened) {
                    entityElement.addClass('opened');
                } else {
                    entityElement.removeClass('opened');
                }
            };

            scope.vm.toggleSection = function(section) {
                if (scope.vm[section]) {
                    entityDetails.addClass(section);
                } else {
                    entityDetails.removeClass(section);
                }
            };

            // Garbage collection
            scope.$on('$destroy', function() {
                if (scope.vm.uid) {
                    evtNamedEntity.destroy(scope.vm.uid);
                }     
            });
        }
    };
});