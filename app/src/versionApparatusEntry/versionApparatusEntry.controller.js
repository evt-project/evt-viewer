angular.module('evtviewer.versionApparatusEntry')

.controller('versionApparatusEntryCtrl', function(config, evtBox, evtVersionApparatusEntry) {
    var vm = this;
    
     this.toggleSubContent = function(subContentName) {
        if (vm._subContentOpened !== subContentName) {
            vm._subContentOpened = subContentName;
        } else {
            vm._subContentOpened = '';
        }
    };

    this.isPinAvailable = function(){
        return config.toolPinAppEntries;
    };
    
    this.alignReadings = function(){
        evtBox.alignScrollToApp(vm.appId);
    };

    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtVersionApparatusEntry.destroy(tempId);
    };
});