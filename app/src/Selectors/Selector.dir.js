angular.module('evtviewer.selector')

.directive('selector', function(select) {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: 'src/Selectors/Selector.dir.tmpl.html',
        controller: 'SelectorCtrl',
        link: function(scope) {
            // Initialize select
            var currentSelect = select.new(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                // if (currentSelect) currentSelect.destroy();
            });
        }
    };
});