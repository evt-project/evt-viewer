angular.module('evtviewer.apparatuses')

.controller('apparatusesCtrl', function(evtApparatuses, $scope) {
    var vm = this;

    this.setCurrentApparatus = function(app) {
        evtApparatuses.setCurrentApparatus(app);
    };

    this.toggleAppStructure = function(appStructure) {
        if (vm.appStructure !== appStructure) {
            vm.appStructure = appStructure;
        }
    }

    this.toggleOpenApparatus = function(apparatus) {
        if (vm.openApparatus !== apparatus) {
            vm.openApparatus = apparatus;
        }
    }

    this.getList = function(app){
        for (var i in vm.apparatuses) {
            if (vm.apparatuses[i].label === app){
                return vm.apparatuses[i].list;
            }
        }
    }

    this.destroy = function() {
        var tempId = this.uid;
        evtApparatuses.destroy(tempId);
    }
});