angular.module('evtviewer.reading')

.controller('ReadingCtrl', function($log, $scope, evtReading) {
    var vm = this;
    
    var _console = $log.getInstance('reading');

    // 
    // Control function
    // 

    this.mouseOver = function() {
        vm.over = true;
    };
    
    this.mouseOut = function() {
        vm.over = false;
    };

    this.setSelected = function() {
        vm.active = true;
    };

    this.unselect = function() {
        vm.active = false;
    };

    this.toggleOverAppEntries = function() {
        if (vm.over === false) {
            evtReading.mouseOverById(vm.appEntryId);
        } else {
            evtReading.mouseOutAll();
        }
    };

    this.toggleSelectAppEntries = function() {
        if (vm.active === false) {
            evtReading.selectById(vm.appEntryId);
        } else {
            evtReading.unselectAll();
        }
    };

    this.destroy = function() {
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        _console.log('vm - destroy ' + tempId);
    };

    _console.log('ReadingCtrl running');
});