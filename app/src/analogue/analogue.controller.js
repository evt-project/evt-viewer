angular.module('evtviewer.analogue')

.controller('AnalogueCtrl', function($log, $scope, evtAnalogue, evtPopover, evtInterface, evtApparatuses, evtBox, evtAnaloguesApparatusEntry) {
    var vm = this;

    var _console = $log.getInstance('analogue');

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
    };

    this.isSelect = function() {
        return vm.selected;
    };

    this.isApparatusOpened = function() {
        return (vm.apparatus.opened && !$scope.$parent.vm.state.topBoxOpened);
    };

    this.closeApparatus = function() {
        vm.apparatus.opened = false;
    };

    this.openApparatus = function() {
        vm.apparatus.opened = true;
    };

    this.toggleOverAnalogues = function($event) {
        $event.stopPropagation();
        if (vm.over === false) {
            evtAnalogue.mouseOverByAnalogueId(vm.analogueId);
            evtAnaloguesApparatusEntry.mouseOverByAnalogueId(vm.analogueId);
        } else {
            evtAnalogue.mouseOutAll();
            evtAnaloguesApparatusEntry.mouseOutAll();
        }
    };
    
    this.toggleSelectAnalogues = function($event) {
        //TODO: aggiungere controllo per gli altri elementi critici
        if (vm.selected === false) {
            if (!vm.apparatus.opened) {
                evtAnalogue.selectById(vm.analogueId);
            }
        } else {
            if (vm.apparatus.opened) {
                evtAnalogue.unselectAll();
                evtAnalogue.closeAllApparatus();
            }
        }
        evtInterface.updateUrl();
    };

    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if (vm.over) {
            if (!vm.apparatus.inline) {
                if (evtApparatuses.getCurrentApparatus() !== 'Analogues') {
                    evtApparatuses.setCurrentApparatus('Analogues');
                }
                evtAnaloguesApparatusEntry.selectById(vm.analogueId);
                evtBox.getById('apparatuses').scrollToAnaloguesEntry(vm.analogueId);
            } else if (!vm.apparatus._loaded) {
                vm.apparatus._loaded = true;
            } 
            evtAnalogue.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.over) {
            vm.toggleSelectAnalogues($event);
            if (vm.isSelect() && !vm.apparatus.opened) {
                vm.toggleApparatus($event);
            } else {
                evtAnaloguesApparatusEntry.unselectAll();
            }
        }
    };

    this.isApparatusOpened = function(){
        return vm.apparatus.opened;
    };
    
    this.destroy = function() {
        evtAnalogue.destroy(this.uid);
    }
});