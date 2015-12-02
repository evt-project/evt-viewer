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

            scope.$watch('vm.optionSelected.value', function(newItems, oldItems) {                
                if (newItems !== oldItems) {
                    if (scope.type === 'witness') {
                        scope.$emit('UPDATE_WITNESS', newItems);
                    } else if (scope.type === 'document') {
                        scope.$emit('UPDATE_DOCUMENT', newItems);
                    }
                }
                if (scope.type === 'edition') {
                    scope.$emit('UPDATE_EDITION', newItems);
                }
            }, true);

            scope.$watch('vm.dataSource' , function(newItems, oldItems) {
                if (newItems !== oldItems) {
                    scope.vm.optionList = scope.vm.formatOptionList(newItems);
                    if (scope.vm.optionSelected === undefined) {
                        scope.vm.selectOption(scope.vm.optionList[0]);
                    }
                }
            }, true);
        }
    };
});