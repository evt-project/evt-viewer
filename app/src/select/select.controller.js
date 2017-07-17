/**
 * @ngdoc object
 * @module evtviewer.select
 * @name evtviewer.select.controller:SelectCtrl
 * @description 
 * # SelectCtrl
 * TODO: Add description and list of dependencies!
 * The controller for the {@link evtviewer.select.directive:evtSelect evtSelect} directive. 
**/
angular.module('evtviewer.select')

.controller('SelectCtrl', function($log, evtSelect, parsedData) {    
    var vm = this;
    
    var _console = $log.getInstance('select');

    // 
    // Control function
    // 

    vm.expand = function() {
        vm.expanded = true;
    };

    vm.collapse = function() {
        vm.expanded = false;
    };

    vm.toggleExpand = function(closeSiblings) {
        if (!closeSiblings) {
            evtSelect.closeAll(vm.uid);
        }
        if (vm.openUp) {
            vm.updateContainerPosition(vm.currentType);
        }
        vm.expanded = !vm.expanded;
    };

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

    vm.selectOption = function(option) {
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
                case 'edition': 
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
                default:
                    if (optionValue === 'NONE' && vm.multiselect ) {
                        option = {
                            value: '',
                            label: 'SELECTS.NO_SELECTION',
                            title: 'SELECTS.OPEN_TO_SELECT_ELEMENT'
                        };
                    } else {
                        option = vm.optionList[0];
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

    vm.destroy = function() {
        var tempId = vm.uid;
        // this.$destroy();
        evtSelect.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // _console.log('SelectCtrl running');
});