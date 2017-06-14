angular.module('evtviewer.criticalApparatusEntry')

.controller('CriticalApparatusEntryCtrl', function($log, $scope, config, evtCriticalApparatusEntry, evtPinnedElements, evtReading, evtBox) {
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
        return evtPinnedElements.isPinned(vm.appId)
    };

    this.getPinnedState = function() {
        return vm.isPinned() ? 'pin-on' : 'pin-off';
    };

    this.togglePin = function(){
        if (vm.isPinned()) {
            evtPinnedElements.removeElement({id: vm.appId, type: 'criticalApparatusEntry'});
        } else {
            evtPinnedElements.addElement({id: vm.appId, type: 'criticalApparatusEntry'});
        }
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