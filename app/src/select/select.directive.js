angular.module('evtviewer.select')

.directive('evtSelect', function(evtSelect, evtInterface) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@',
            init: '@'
        },
        templateUrl: 'src/select/select.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'SelectCtrl',
        link: function(scope) {
            // Initialize select
            var currentSelect = evtSelect.build(scope, scope.vm);

            if (currentSelect !== undefined) {
                if (scope.init !== undefined && scope.init != '') {
                    currentSelect.selectOptionByValue(scope.init);
                } else {
                    currentSelect.callback(undefined, scope.vm.optionList[0]);
                }
            }

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentSelect){
                    currentSelect.destroy();
                }     
            });
        }
    };
});