angular.module('evtviewer.analoguesApparatusEntry')

.controller('analoguesApparatusEntryCtrl', function(evtAnaloguesApparatusEntry) {
    var vm = this;

    this.destroy = function() {
        var tempId = this.uid;
        evtAnaloguesApparatusEntry.destroy(tempId);
    }
});