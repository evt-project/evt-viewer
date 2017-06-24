angular.module('evtviewer.versionReading')

.controller('versionReadingCtrl', function($scope, parsedData, config, evtPopover, evtVersionReading, evtInterface, evtBox) {
    var vm = this;

    this.mouseOver = function() {
        vm.over = true;
    };
    
    this.mouseOut = function() {
        vm.over = false;
    };

    this.highlightOn = function() {
        vm.highlightedText = true;
    };

    this.highlightOff = function() {
        vm.highlightedText = false;
    };

    this.setSelected = function() {
        vm.selected = true;
    };

    this.unselect = function() {
        vm.selected = false;
    };

    this.closeApparatus = function() {
        vm.apparatus.opened = false;
    };

    this.isSelect = function() {
        return vm.selected;        
    };

    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if ( vm.over === false ) {
                evtVersionReading.mouseOverByAppId(vm.appId);
            } else {
                evtVersionReading.mouseOutAll();
            }
    };

    this.toggleSelectAppEntries = function($event) {
        if (vm.selected === false) {
            if (!vm.apparatus.opened){
                evtVersionReading.selectById(vm.appId);
                evtInterface.updateCurrentVersionEntry(vm.appId);
            }
        } else {
            if (vm.apparatus.opened){
                evtVersionReading.unselectAll();
                evtInterface.updateCurrentVersionEntry('');
            }
        }
        evtInterface.updateUrl();
    };

    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if ( vm.over ) {
            evtVersionReading.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
            if (vm.apparatus.opened) {
                $scope.$parent.vm.scrollToVersionApparatus(vm.appId);
            }
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.over) {
            vm.toggleSelectAppEntries($event);
            if (!vm.isSelect() || !vm.apparatus.opened){
                vm.toggleApparatus($event);
            }
        }
    };

    this.isScopeRecensioAvailable = function() {
        var boxVersion = $scope.$parent.vm.version || '',
            availableVer = parsedData.getVersionEntries()[vm.appId].content,
            defaultVer = config.versions[0],
            isAvailable = true;
        if (boxVersion !== '' && boxVersion !== defaultVer) {
            if (availableVer[boxVersion] === undefined) {
                isAvailable = false;
            }
        } else {
            if (availableVer[defaultVer] === undefined) {
                isAvailable = false;
            }
        }
        return isAvailable;
    };
});