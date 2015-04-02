angular.module('evtviewer.select')

.directive('evtSelect', function(evtSelect, parsedData) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@'
        },
        templateUrl: 'src/select/select.directive.tmpl.html',
        link: function(scope) {

            // Add attributes in vm
            scope.vm = {
                id: scope.id,
                type: scope.type
            };

            // Initialize select
            var currentSelect = evtSelect.build(scope.vm);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentSelect){
                    currentSelect.destroy();
                }     
            });
        }
    };
});