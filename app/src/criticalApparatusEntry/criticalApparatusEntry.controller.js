angular.module('evtviewer.criticalApparatusEntry')

.controller('CriticalApparatusEntryCtrl', function($log, $scope, config, evtCriticalApparatusEntry, evtReading, evtBox) {
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
                evtReading.mouseOverByAppId(vm.appId);
            } else {
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
});