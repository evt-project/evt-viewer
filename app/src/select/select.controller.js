/**
 * @ngdoc object
 * @module evtviewer.select
 * @name evtviewer.select.controller:SelectCtrl
 * @description 
 * # SelectCtrl
 * This is the controller for the {@link evtviewer.select.directive:evtSelect evtSelect} directive. 
 * @requires $log
 * @requires evtviewer.select.evtSelect
 * @requires evtviewer.dataHandler.parsedData
 **/
angular.module('evtviewer.select')

.controller('SelectCtrl', function($log, $element, $scope, evtSelect, parsedData) {    
    var vm = this;
    
    var _console = $log.getInstance('select');

    // 
    // Control function
    // 
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#expand
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Expand the option list.
     */
    vm.expand = function() {
        vm.expanded = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#collapse
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Collapse the option list.
     */
    vm.collapse = function() {
        vm.expanded = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#toggleExpand
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Expand/collapse the option list. 
     * Close any other <code>&lt;evt-select&gt;</code> expanded.
     * If option list has to open up, update container position.
     */
    vm.toggleExpand = function(closeSiblings) {
        if (!closeSiblings) {
            evtSelect.closeAll(vm.uid);
        }
        if (vm.openUp) {
            vm.updateContainerPosition(vm.currentType);
        }
        vm.expanded = !vm.expanded;
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#getOptionSelected
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Retrieve the option selected to be shown. 
     * @returns {Object} selected option, structured as follows
        <pre>
            var selectedOption = {
                value,
                label,
                title
            };
        </pre>
     */
    vm.getOptionSelected = function() {
        var selectedOption;
        if (vm.optionSelected && vm.optionSelected.length > 0)  {
            if (vm.optionSelected.length === 1) {
                selectedOption = vm.optionSelected[0];
            } else {
                selectedOption = {
                    value: 'MULTI',
                    label: 'SELECTS.MULTIPLE_SELECTION',
                    title: 'SELECTS.MULTIPLE_OPTIONS_SELECTED'
                };
            }
        } else {
            selectedOption = {
                value: '',
                label: 'SELECTS.NO_SELECTION',
                title: 'SELECTS.OPEN_TO_SELECT_ELEMENT'
            };
        }
        return selectedOption;
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#selectOption
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Select a give option.
     * @param {Object} option option to select, structured as follows
        <pre>
            var selectedOption = {
                value,
                label,
                title
            };
        </pre>
     */
    vm.selectOption = function(option) {
        if (!option) {
            return;
        }
        if (vm.expanded) {
            vm.toggleExpand();
        }
        if (option.value === 'NONE' && vm.multiselect ) {
            option = {
                value: '',
                label: 'SELECTS.NO_SELECTION',
                title: 'SELECTS.OPEN_TO_SELECT_ELEMENT'
            };
        }

        if (vm.multiselect) {
            var optionSelectedIndex = vm.getSelectedOptionIndex(option);

            // If already selected deselect
            if (optionSelectedIndex >= 0) {
                vm.optionSelected.splice(optionSelectedIndex, 1);
            } else {
                if (vm.optionSelected === undefined) {
                    vm.optionSelected = [];
                } else if (vm.optionSelected.length > 0) {
                    if (vm.optionSelected[0].value === '' || vm.optionSelected[0].value === 'ALL' || vm.optionSelected[0].value === 'NONE') {
                        vm.optionSelected.splice(0, 1);
                    }
                }
                vm.optionSelected.push(option);
            }
            // Otherwise select
        } else {
            vm.optionSelected = [option];
        }

        // Set selector visible value
        if (vm.optionSelected && vm.optionSelected.length > 1) {
            vm.optionSelectedValue = 'SELECTS.MULTIPLE_SELECTION';
        } else {
            vm.optionSelectedValue = option !== undefined ? option.value : undefined;
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#getSelectedOptionIndex
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Retrieve selected option index in option list.
     * @param {Object} option option to handle, structured as follows
        <pre>
            var selectedOption = {
                value,
                label,
                title
            };
        </pre>
     * @returns {number} index of selected option 
     */
    vm.getSelectedOptionIndex = function(option) {
        var optionSelected = vm.optionSelected || [],
            i = 0,
            found = false; 
        while (i < optionSelected.length && !found) {
            found = optionSelected[i].value === option.value;
            i++;
        }
        return found ? i-1 : -1;
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#selectOptionByValue
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Select option by value. 
     * Option will be formatted according to type ("page", "document", "edition",  
     * "witness", "witness-page", "source", "version").
     * @param {any} optionValue value of option to select
     */
    vm.selectOptionByValue = function(optionValue) {
        var option;
        if (optionValue !== undefined && optionValue !== '' ) {
            switch(vm.currentType) {
                case 'page':
                    option = vm.formatOption(parsedData.getPage(optionValue));
                    break;
                case 'document':
                    option = vm.formatOption(parsedData.getDocument(optionValue));
                    break;
                case 'div':
                    option = vm.formatOption(parsedData.getDiv(optionValue));
                    break;
                case 'edition': 
                case 'comparingEdition': 
                    option = vm.formatOption(parsedData.getEdition(optionValue));
                    break;
                case 'witness':
                    option = vm.formatOption(parsedData.getWitness(optionValue));
                    break;
                case 'witness-page':
                    option = vm.formatOption(parsedData.getPage(optionValue));
                    break;
                case 'source':
                    var source,
                        sources = parsedData.getSources()._indexes.availableTexts;
                    for (var i in sources) {
                        if (sources[i].id === optionValue) {
                            source = sources[i];
                        }
                    }
                    option = vm.formatOption(source);
                    break;
                case 'version':
                    option = vm.formatOption(optionValue);
                    break;
                case 'generic':
                    if (vm.optionList) {
                        var optionsFiltered;
                        optionsFiltered = vm.optionList.filter(function(item) { return item.value === optionValue });
                        option = optionsFiltered ? optionsFiltered[0] : undefined;
                    }
                    break;
                default:
                    if (optionValue === 'NONE' && vm.multiselect ) {
                        option = {
                            value: '',
                            label: 'SELECTS.NO_SELECTION',
                            title: 'SELECTS.OPEN_TO_SELECT_ELEMENT'
                        };
                    } else {
                        if (vm.optionList) {
                            var optionsFiltered;
                            optionsFiltered = vm.optionList.filter(function(item) { return item && item.value === optionValue });
                            if (optionsFiltered && optionsFiltered[0]) {
                                option = optionsFiltered[0];
                            } else {
                                option = vm.optionList[0];
                            }
                        }
                    } 
                    break;
            }
        } else {
            if (optionValue === 'NONE' && vm.multiselect ) {
                option = {
                    value: '',
                    label: 'SELECTS.NO_SELECTION',
                    title: 'SELECTS.OPEN_TO_SELECT_ELEMENT'
                };
            } else {
                option = vm.optionList[0];
            }
        } 

        if (option !== undefined) {    
            vm.selectOption(option);            
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#isOptionSelected
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * Check if an option is already selected (this method was defined to handle also
     * multiselection cases).
     *
     * @param {Object} option option to check, structured as follows
        <pre>
            var selectedOption = {
                value,
                label,
                title
            };
        </pre>
     */
    vm.isOptionSelected = function(option) {
        if (option !== undefined) {
            if (typeof(vm.optionSelected) === 'undefined') {
                return;
            }

            if (vm.multiselect) {
                var optionSelected = vm.optionSelected || [],
                    i = 0,
                    found = false; 
                while (i < optionSelected.length && !found) {
                    found = optionSelected[i].value === option.value;
                    i++;
                }
                return found;
            } else {
                return vm.optionSelected && vm.optionSelected.length === 1 && vm.optionSelected[0].value === option.value;
            }
        }

    };
    vm.doCallback = function(optionSelected, option) {
        vm.callback(optionSelected, option);
        $scope.onOptionSelected({option: option});
    };
    /**
     * @ngdoc method
     * @name evtviewer.select.controller:SelectCtrl#destroy
     * @methodOf evtviewer.select.controller:SelectCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.select.evtSelect evtSelect} provider.</p>
     */
    vm.destroy = function() {
        var tempId = vm.uid;
        // this.$destroy();
        evtSelect.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // _console.log('SelectCtrl running');
});