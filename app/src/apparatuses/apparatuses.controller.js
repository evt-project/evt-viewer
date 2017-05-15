angular.module('evtviewer.apparatuses')

.controller('apparatusesCtrl', function(evtApparatuses, $scope) {
    var vm = this;

    this.setCurrentApparatus = function(app) {
        evtApparatuses.setCurrentApparatus(app);
    };

    this.getCurrentApparatus = function() {
        evtApparatuses.getCurrentApparatus();
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
        var list = [];
        for (var i in vm.apparatuses) {
            if (vm.apparatuses[i].label === app){
                list = vm.apparatuses[i].list;
            }
        }
        return list;
    }

    this.destroy = function() {
        evtApparatuses.destroy(this.uid);
    }
});