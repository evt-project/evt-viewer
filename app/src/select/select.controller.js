angular.module('evtviewer.select')

.controller('SelectCtrl', function($log, $scope, evtSelect) {
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

        _console.log('vm - toggleExpand for ' + vm.uid);
    };

    this.selectOption = function(option) {
        // _console.log('vm - selectOption ', option);
        vm.optionSelected = option;
        if (vm.expanded) {
            vm.toggleExpand();
        }
        vm.changeRoute.call(undefined, option);
        // vm.callback.call(undefined, option);
    };

    this.selectOptionByValue = function(optionValue) {
        // _console.log('vm - selectOptionByValue ', optionValue);
        var option = vm.dataSource[optionValue];
        if (option !== undefined) {    
            vm.selectOption(option);
        }
    };

    this.isOptionSelected = function(option) {
        if (typeof(vm.optionSelected) === 'undefined') {
            return;
        }
        return vm.optionSelected.value === option.value;
    };

    this.destroy = function() {
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        _console.log('vm - destroy ' + tempId);
    };

    _console.log('SelectCtrl running');
});