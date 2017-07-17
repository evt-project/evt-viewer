/**
 * @ngdoc directive
 * @module evtviewer.select
 * @name evtviewer.select.directive:evtSelect
 * @description 
 * # evtSelect
 * TODO: Add description!
 * It uses the {@link evtviewer.select.controller:SelectCtrl SelectCtrl} controller. 
 *
 * @scope
 * @param {string=} id id of select
 * @param {string=} type type of select ('page', 'document', 'edition', 'named-entities', 'witness', 'witness-page', 'pinned-filter', 'source', 'version')
 * @param {string=} init initial value selected
 * @param {boolean=} openUp whether the select should open bottom->up instad of up->bottom
 * @param {boolean=} multiselect whether of not select should allow multiple values selected
 *
 * @restrict E
**/
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

            scope.vm.updateContainerPosition = function(type) {
                var optionContainer = element.find('.option_container'),
                    selector = element.find('.selector'),
                    labelSelected = element.find('.label_selected');
                //optionContainer.css('position', 'sticky');
                optionContainer.css('position', 'absolute');
                var newMarginTop;
                //TEMP => TODO: understand why the behaviour is different
                //if (type === 'pinned-filter') {
                    newMarginTop = optionContainer.height() + 2; 
                //} else {
                //    newMarginTop = optionContainer.height() + labelSelected.height();
                //}
                optionContainer.css('margin-top', -newMarginTop + 'px');
            };
            $timeout(function(){
                if (currentSelect.openUp) {
                    currentSelect.updateContainerPosition(scope.type);
                }

                if (currentSelect !== undefined) {
                    if (scope.init !== undefined && scope.init !== '') {
                        currentSelect.selectOptionByValue(scope.init);
                    } else if (!scope.multiselect) {
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

            if (scope.type === 'source') {
                scope.$watch(function() {
                    return evtInterface.getCurrentSource();
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

            if (scope.type === 'version' && evtInterface.getCurrentViewMode() === 'collation') {
                scope.$watch(function() {
                    return evtInterface.getCurrentVersion();
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
                        var selector = element.find('.selector');                        
                        if (currentSelect.optionList.length > 0) {
                            selector.show();
                        } else {
                            selector.hide();
                        }
                        $timeout(function() {
                            var currentOptionSelected = currentSelect.getOptionSelected();
                            if (currentOptionSelected.value === 'ALL' || currentOptionSelected.value === 'MULTI') {
                                var optionSelectAll = {
                                    value : 'ALL',
                                    label : 'SELECTS.SELECTS_ALL',
                                    title : 'SELECTS.SELECTS_ALL_TYPES',
                                    additionalClass: 'doubleBorderTop'
                                };
                                currentSelect.callback(currentOptionSelected, optionSelectAll);
                            }
                            currentSelect.updateContainerPosition(currentSelect.type);
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