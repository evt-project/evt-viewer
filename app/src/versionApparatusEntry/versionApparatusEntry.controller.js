angular.module('evtviewer.versionApparatusEntry')

.controller('versionApparatusEntryCtrl', function(config) {
    var vm = this;
    
    this.isPinAvailable = function() {
        return config.toolPinAppEntries;
    };

    this.alignReadings = function() {};

    this.toggleSubContent = function(tab) {};
});