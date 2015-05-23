angular.module('evtviewer.popover')

.controller('PopoverCtrl', function($log, $scope, evtPopover) {
    var vm = this;
    
    var _console = $log.getInstance('popover');

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
            evtPopover.closeAll(vm.uid);
        }
        vm.expanded = !vm.expanded;
        _console.log('vm - toggleExpand for ' + vm.uid);
    };

    this.destroy = function() {
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        _console.log('vm - destroy ' + tempId);
    };

    _console.log('PopoverCtrl running');
});