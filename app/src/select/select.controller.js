angular.module('evtviewer.select')

.controller('SelectCtrl', function($log, evtSelect, parsedData) {    
    var vm = this;
    
    var _console = $log.getInstance('select');

    // 
    // Control function
    // 

    this.expand = function() {
        vm.expanded = true;
    };

    this.collapse = function() {
        vm.expanded = false;
    };

    this.toggleExpand = function(closeSiblings) {
        if (!closeSiblings) {
            evtSelect.closeAll(vm.uid);
        }
        vm.expanded = !vm.expanded;
        // _console.log('vm - toggleExpand for ' + vm.uid);
    };

    this.getOptionSelected = function() {
        return vm.optionSelected;
    };

    this.selectOption = function(option) {
        vm.optionSelected = option;
        vm.optionSelectedValue = option !== undefined ? option.value : undefined;
        if (vm.expanded) {
            vm.toggleExpand();
        }
    };

    this.selectOptionByValue = function(optionValue) {
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
                    //TODO
                    option = vm.optionList[0];
                    break;
                default:
                    option = vm.optionList[0];
                    break;
            }
        } else {
            option = vm.optionList[0];
        } 

        if (option !== undefined) {    
            vm.selectOption(option);            
        }
    };

    this.isOptionSelected = function(option) {
        if (option !== undefined) {
            if (typeof(vm.optionSelected) === 'undefined') {
                return;
            }
            return vm.optionSelected.value === option.value;
        }

    };

    this.destroy = function() {
        var tempId = this.uid;
        // this.$destroy();
        evtSelect.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // _console.log('SelectCtrl running');
});