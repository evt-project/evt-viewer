angular.module('evtviewer.selector')

.directive('selector', function(select) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@'
        },
        templateUrl: 'src/Selectors/Selector.dir.tmpl.html',
        link: function(scope) {

            // Initialize select
            var currentSelector = select.build(scope);
            

            console.log(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                // if (currentSelect) currentSelect.destroy();
            });
        }
    };
});