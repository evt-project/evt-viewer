angular.module('evtviewer.criticalApparatusEntry')

.controller('CriticalApparatusEntryCtrl', function($log, $scope, config, Utils, evtInterface, evtCriticalApparatusEntry, evtInterface, evtReading, evtBox, evtApparatuses, evtPinnedElements) {
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
        return evtPinnedElements.isPinned(vm.appId);
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
        evtApparatuses.alignScrollToApp(vm.appId);
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
        vm.closeSubContent();
    };

    this.isSelected = function() {
        return vm.selected;
    };

    this.isInline = function() {
        return evtInterface.isCriticalApparatusInline();
    };

    this.closeSubContent = function() {
        vm._subContentOpened = '';
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        var target = $event.target;
        
        if (vm.currentViewMode === 'readingTxt') {
            if (vm.isSelected()) {
                if (target && target.className.indexOf('critical-apparatus-entry_other-content_headers') < 0 &&
                    !Utils.DOMutils.isNestedInClassElem(target, 'critical-apparatus-entry_other-content_headers')) {
                    evtCriticalApparatusEntry.unselectAll();
                    evtReading.unselectAll();
                    evtInterface.updateCurrentAppEntry('');
                }
            } else {
                evtReading.selectById(vm.appId);
                evtInterface.updateCurrentAppEntry(vm.appId);
                evtCriticalApparatusEntry.selectById(vm.appId);
                if (!vm.isInline()) {
                    evtBox.alignScrollToApp(vm.appId);
                }
            }
            evtInterface.updateUrl();
        }
    };

    this.showInlineCriticalApparatus = function() {
        return config.showInlineCriticalApparatus;
    };
});