/**
 * @ngdoc object
 * @module evtviewer.versionApparatusEntry
 * @name evtviewer.versionApparatusEntry.controller:versionApparatusEntryCtrl
 * @description 
 * # versionApparatusEntryCtrl
 * TODO: Add description and list of dependencies!
 * The controller for the {@link evtviewer.versionApparatusEntry.directive:evtVersionApparatusEntry evtVersionApparatusEntry} directive. 
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.versionApparatusEntry')

.controller('versionApparatusEntryCtrl', function(config, evtBox, evtApparatuses, evtVersionApparatusEntry, $scope) {
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
        evtApparatuses.alignScrollToApp(vm.appId);
    };

    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtVersionApparatusEntry.destroy(tempId);
    };
});