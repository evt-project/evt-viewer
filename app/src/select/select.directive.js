angular.module('evtviewer.select')

.directive('evtSelect', function(evtSelect, parsedData) {
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

            if (scope.type === 'witness-page') {
                scope.$on('UPDATE_WITNESS', function(event, wit){
                    scope.vm.dataSource = parsedData.getWitnessPages(wit);
                });
                scope.$watch('vm.optionSelected', function(newOpt, oldOpt){
                    if (newOpt !== oldOpt) {
                        scope.$emit('CHANGE_WITNESS_PAGE', newOpt);
                    }
                });
                scope.$on('UPDATE_WITNESS_PAGE', function(event, pageId){
                    if (pageId !== scope.vm.optionSelected.value) {
                        scope.vm.selectOptionByValue(pageId);
                    }
                });
            }

            scope.$watch('vm.dataSource' , function(newItems, oldItems) {
                if (newItems !== oldItems) {
                    scope.vm.optionList = scope.vm.formatOptionList(newItems);
                    if (scope.vm.optionList !== undefined) {
                        scope.vm.selectOption(scope.vm.optionList[0]);
                    } else {
                        scope.vm.selectOption = {};
                    }
                }
            }, true);
        }
    };
});