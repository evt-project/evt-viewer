angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourcesApparatusEntryCtrl', function() {
    var vm = this;
    this.toggleSource = function(sourceId) {
        if (vm._activeSource !== sourceId) {
            vm._activeSource = sourceId;
        }
    }
});