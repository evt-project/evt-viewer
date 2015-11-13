angular.module('evtviewer.reading')

.controller('ReadingCtrl', function($log, $scope, evtReading, parsedData) {
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
            evtReading.mouseOverById(vm.appEntry);
        } else {
            evtReading.mouseOutAll();
        }
    };

    this.toggleSelectAppEntries = function() {
        if (vm.active === false) {
            evtReading.selectById(vm.appEntry);
        } else {
            evtReading.unselectAll();
        }
    };

    this.openApparatus = function(){
        var criticalEntry = parsedData.getCriticalEntryByPos(vm.appEntry);
        //TODO: create evt-popover with info about critical apparatus.
        console.log(criticalEntry);
    };

    this.destroy = function() {
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        _console.log('vm - destroy ' + tempId);
    };

    // _console.log('ReadingCtrl running');
});