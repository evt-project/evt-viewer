angular.module('evtviewer.select')

.directive('evtSelect', function(evtSelect) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@'
        },
        templateUrl: 'src/select/select.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'SelectCtrl',
        link: function(scope) {

            // Initialize select
            var currentSelect = evtSelect.build(scope.id, scope.type, scope.vm);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentSelect){
                    currentSelect.destroy();
                }     
            });

            scope.$watch(function() {
                if (currentSelect !== undefined) {
                    return currentSelect.getOptionSelectedValue();
                }
            }, function(newItems, oldItems) {
                if (newItems !== oldItems) {
                    scope.$emit("UPDATE_WITNESS", newItems);
                }
            }, true);
        }
    };
});