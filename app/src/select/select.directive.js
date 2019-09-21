/**
 * @ngdoc directive
 * @module evtviewer.select
 * @name evtviewer.select.directive:evtSelect
 * @description 
 * # evtSelect
 * <p>Element designed upon HTML &lt;select&gt;
 * that will populate options list and handle selection according to a particular type.</p>
 * <p>It uses the {@link evtviewer.select.controller:SelectCtrl SelectCtrl} controller.</p>
 * <p>The initial scope is extended in {@link evtviewer.select.evtSelect evtSelect} provider.</p>
 *
 * @scope
 * @param {string=} id id of select
 * @param {string=} type type of select ('page', 'document', 'edition', 'named-entities', 'witness', 'witness-page', 'pinned-filter', 'source', 'version')
 * @param {string=} init initial value selected
 * @param {boolean=} openUp whether the select should open bottom->up instad of up->bottom
 * @param {boolean=} multiselect whether of not select should allow multiple values selected
 *
 * @requires $timeout
 * @requires evtviewer.select.evtSelect
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.UItools.evtPinnedElements
 *
 * @restrict E
**/
angular.module('evtviewer.select')

.directive('evtSelect', function($timeout, evtSelect, evtInterface, evtPinnedElements, parsedData) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            type: '@',
            init: '@',
            openUp: '@',
            multiselect: '@',
            options: '=',
            smaller: '@',
            emptyOption: '@',
            selectedOption: '@',
            onOptionSelected: '&'
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
                        var firstOption = scope.vm.optionList ? scope.vm.optionList[0] : undefined;
                        currentSelect.callback(undefined, firstOption);
                    }
                }
            });
            
            scope.$watch(function() {
                return scope.selectedOption;
            }, function(newItem, oldItem) {
                if (oldItem !== newItem) {
                    currentSelect.selectOptionByValue(scope.selectedOption);
                }
            }, true);  

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
                    return evtInterface.getState('currentPage');
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'edition') {
                scope.$watch(function() {
                    return evtInterface.getState('currentEdition');
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'comparingEdition') {
                scope.$watch(function() {
                    return evtInterface.getState('currentComparingEdition');
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'source') {
                scope.$watch(function() {
                    return evtInterface.getState('currentSource') ;
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'document') {
                scope.$watch(function() {
                    return evtInterface.getState('currentDoc');
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }

            if (scope.type === 'div') {
                scope.$watch(function() {
                    var currentDoc = evtInterface.getState('currentDoc');
                    return evtInterface.getState('currentDivs')[currentDoc];
                }, function(newItem, oldItem) {
                    if (oldItem !== newItem) {
                        var oldDiv = parsedData.getDiv(oldItem),
                            newDiv = parsedData.getDiv(newItem);
                        if (oldDiv && newDiv) {
                            currentSelect.optionList = []
                            currentSelect.formatOptionList(parsedData.getDivs()._indexes.main[newDiv.doc], currentSelect.optionList, newDiv.section)
                        }
                        currentSelect.selectOptionByValue(newItem);
                    }
                }, true); 
            }            

            if (scope.type === 'version' && evtInterface.getState('currentViewMode') === 'collation') {
                scope.$watch(function() {
                    return evtInterface.getState('currentVersion');
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