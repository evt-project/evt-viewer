angular.module('evtviewer.criticalApparatusEntry')

.controller('CriticalApparatusEntryCtrl', function($log, $scope, config, evtCriticalApparatusEntry, evtReading, evtBox, evtInterface) {
    $scope.content = {};
    var vm = this;

    this.toggleSubContent = function(subContentName) {
        if (vm._subContentOpened !== subContentName) {
            vm._subContentOpened = subContentName;
        } else {
            vm._subContentOpened = '';
        }
    };

    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if (vm.readingId === undefined){
            if (vm.over === false) {
                evtCriticalApparatusEntry.mouseOverByAppId(vm.appId);
                evtReading.mouseOverByAppId(vm.appId);
            } else {
                evtCriticalApparatusEntry.mouseOutAll();
                evtReading.mouseOutAll();
            }
        }
    };

    this.isPinAvailable = function(){
        return config.toolPinAppEntries;
    };

    this.isPinned = function(){
        return evtCriticalApparatusEntry.isPinned(vm.appId);
    };

    this.getPinnedState = function() {
        return vm.isPinned() ? 'pin-on' : 'pin-off';
    };

    this.togglePin = function(){
        if (vm.isPinned()) {
            console.log('unpin');
            evtCriticalApparatusEntry.unpin(vm.appId);
        } else {
            evtCriticalApparatusEntry.pin(vm.appId);
        }
        document.cookie = 'pinned' + '=' + evtCriticalApparatusEntry.getPinned() + '; 1';
    };

    this.alignReadings = function(){
        evtBox.alignScrollToApp(vm.appId);
    };

    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtCriticalApparatusEntry.destroy(tempId);
    };

    this.mouseOver = function() {
        vm.over = true;
    };
    
    this.mouseOut = function() {
        vm.over = false;
    };

    this.setSelected = function() {
        vm.selected = true;
    };

    this.unselect = function() {
        vm.selected = false;
    };

    this.isSelect = function() {
        if (evtInterface.getCurrentAppEntry() === vm.appId) {
            return true;
        } else {
            return vm.selected;
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.currentViewMode === 'readingTxt') {
            if (this.isSelect()) {
                evtCriticalApparatusEntry.unselectAll();
            } else {
                evtCriticalApparatusEntry.unselectAll();
                evtCriticalApparatusEntry.selectById(vm.appId);
                evtReading.selectById(vm.appId);
            }
        }
    };
});