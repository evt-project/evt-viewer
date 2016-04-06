angular.module('evtviewer.criticalApparatusEntry')

.controller('CriticalApparatusEntryCtrl', function($log, $scope, evtCriticalApparatusEntry, evtReading) {
    $scope.content = {};
    var vm = this;

    this.openSubContent = function(subContentName) {
        vm._subContentOpened = subContentName;
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

    this.isPinned = function(){
        return evtCriticalApparatusEntry.isPinned(vm.appId);
    };

    this.togglePin = function(){
        if (vm.isPinned()) {
            console.log('unpin');
            evtCriticalApparatusEntry.unpin(vm.appId);
        } else {
            evtCriticalApparatusEntry.pin(vm.appId);
        }
        document.cookie = 'pinned' + "=" + evtCriticalApparatusEntry.getPinned() + "; 1";
    };


    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtCriticalApparatusEntry.destroy(tempId);
    }
});