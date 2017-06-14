angular.module('evtviewer.select')

.directive('evtSelect', function($timeout, evtSelect, evtInterface, evtPinnedElements) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@',
            init: '@',
            openUp: '@',
            multiselect: '@'
        },
        templateUrl: 'src/select/select.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'SelectCtrl',
        link: function(scope, element) {
            // Initialize select
            var currentSelect = evtSelect.build(scope, scope.vm);

            var updateContainerPosition = function(scope) {
                var optionContainer = element.find('.option_container'),
                    selector = element.find('.selector'),
                    labelSelected = element.find('.label_selected');
                optionContainer.css('position', 'sticky');
                var newMarginTop;
                //TEMP => TODO: understand why the behaviour is different
                if (scope.type === 'pinned-filter') {
                    newMarginTop = optionContainer.height() + 2; 
                } else {
                    newMarginTop = optionContainer.height() + labelSelected.height();
                }
                optionContainer.css('margin-top', -newMarginTop + 'px')
                optionContainer.css('position', 'absolute');
                
            }
            $timeout(function(){
                if (currentSelect.openUp) {
                    updateContainerPosition(scope);
                }

                if (currentSelect !== undefined) {
                    if (scope.init !== undefined && scope.init !== '') {
                        currentSelect.selectOptionByValue(scope.init);
                    } else {
                        currentSelect.callback(undefined, scope.vm.optionList[0]);
                    }
                }
            });

            if (scope.type === 'witness-page') {
                var witness = scope.$parent.vm.witness;
                scope.$watch(function() {
                    return evtInterface.getCurrentWitnessPage(witness);
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(witness+'-'+newItem);
                    }
                }, true); 
            }

            if (scope.type === 'page') {
                scope.$watch(function() {
                    return evtInterface.getCurrentPage();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'document') {
                scope.$watch(function() {
                    return evtInterface.getCurrentDocument();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'pinned-filter') {
                scope.$watch(function() {
                    return evtPinnedElements.getAvailablePinnedTypes();
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.optionList = currentSelect.formatOptionList(newItem);
                        $timeout(function() {
                            updateContainerPosition(scope);
                        });
                    }
                }, true); 
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