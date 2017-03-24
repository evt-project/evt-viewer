angular.module('evtviewer.analogue')

.controller('AnalogueCtrl', function($log, $scope, evtAnalogue) {
    var vm = this;

    var _console = $log.getInstance('analogue');

    this.destroy = function() {
        var tempId = this.uid;

        evtAnalogue.destroy(tempId);
    }
});