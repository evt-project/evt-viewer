angular.module('evtviewer.select')

.controller('SelectCtrl', function($log, $scope, evtSelect, evtInterface, parsedData) {    
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
        var option = parsedData.getWitnessById(optionValue);
        if (option !== undefined) {    
            vm.selectOption(vm.formatOption(option));            
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
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        _console.log('vm - destroy ' + tempId);
    };

    _console.log('SelectCtrl running');
});