angular.module('evtviewer.select')

.directive('evtSelect', function(evtSelect) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@'
        },
        templateUrl: 'src/select/select.directive.tmpl.html',
        link: function(scope) {

            // Initialize select
            var currentSelect = scope.vm = evtSelect.build(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentSelect){
                    currentSelect.destroy();
                }     
            });
        }
    };
});