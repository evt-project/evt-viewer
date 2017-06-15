angular.module('evtviewer.namedEntity')

.directive('evtNamedEntity', function(evtNamedEntity) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
            entityType : '@',
            location   : '@'
        },
        transclude: true,
        templateUrl: 'src/namedEntity/namedEntity.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize namedEntity
            scope.vm = {
                entityId: scope.entityId,
                entityType: scope.entityType,
                location: scope.location
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

            var headersElement = element.find('.namedEntity__details-headers'),
                panelsElement = element.find('.namedEntity__details-panels');
            scope.vm.toggleSubContentClass = function() {
                var subContent = scope.vm._subContentOpened;
                var elementToRemoveClass = element.find('.namedEntity__details-header.active');
                elementToRemoveClass.removeClass('active');

                if (subContent !== '') {
                    var elementToAddClass = element.find('.namedEntity__details-header-'+subContent);
                    elementToAddClass.addClass('active');
                    headersElement.removeClass('closed');
                    panelsElement.removeClass('closed');
                } else {
                    headersElement.addClass('closed');
                    panelsElement.addClass('closed');
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