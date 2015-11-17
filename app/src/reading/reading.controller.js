angular.module('evtviewer.reading')

.controller('ReadingCtrl', function($log, $scope, evtReading, parsedData) {
    var vm = this;
    
    var _console = $log.getInstance('reading');

    // 
    // Control function
    // 

    this.mouseOver = function() {
        vm.over = true;
    };
    
    this.mouseOut = function() {
        vm.over = false;
    };

    this.setSelected = function() {
        vm.active = true;
    };

    this.unselect = function() {
        vm.active = false;
    };

    this.closeApparatus = function() {
        vm.apparatusOpened = false;
    };

    this.openApparatus = function() {
        vm.apparatusOpened = true;
    };

    
    this.toggleTooltipOver = function() {
        vm.tooltipOver = !vm.tooltipOver;
    };

    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if (vm.over === false) {
            evtReading.mouseOverById(vm.appId);
        } else {
            evtReading.mouseOutAll();
        }
    };

    this.toggleSelectAppEntries = function($event) {
        $event.stopPropagation();
        if (vm.active === false) {
            evtReading.selectById(vm.appId);
        } else {
            evtReading.unselectAll();
        }
    };

    var parseCriticalEntry = function(entry) {
        var appText = '';
        var readings = entry.readings;
        if (readings !== undefined) {
            for (var i = 0; i < readings.length; i++) {
                var reading = readings[readings[i]],
                    text = '';
                if (reading.readings !== undefined) { //rdgGrp
                    for (var k = 0; k < reading.readings.length; k++) {
                        text += parseCriticalEntry(reading.readings[k]);
                    }
                } else {
                    var content = reading.content || [];
                    for (var j = 0; j < content.length; j++) {
                        if (typeof content[j] === 'object') {
                            text += '{'+parseCriticalEntry(content[j])+'} ';
                        } else {
                            text += content[j];
                        }
                    }
                }
                if (text === '') {
                    text = '<i>omit.</i>';
                }
                appText += text;
                if (reading.attributes !== undefined && reading.attributes.wit !== undefined) {
                    appText += ' <strong>'+reading.attributes.wit.replace(/#/gi, ' ')+'</strong>';
                }
                appText += ', ';
            }
        } else if (entry.content !== undefined) { //rdgGrp
            var content = entry.content || [];
            for (var j = 0; j < content.length; j++) {
                if (typeof content[j] === 'object') {
                    appText += '{'+parseCriticalEntry(content[j])+'} ';
                } else {
                    appText += content[j];
                }
            }
        }
        return appText.trim().slice(0, -1);
    };

    this.toggleApparatus = function($event){
        $event.stopPropagation();
        if ( vm.apparatusContent === '') {
            var criticalEntry = parsedData.getCriticalEntryByPos(vm.appId);
            if (criticalEntry !== undefined) {
                vm.apparatusContent = parseCriticalEntry(criticalEntry);
            }
        } 
        if (!vm.tooltipOver) {
            evtReading.closeAllApparatus(vm.uid);
            vm.apparatusOpened = !vm.apparatusOpened;
            if (vm.apparatusOpened === true) {
                vm.resizeTooltip($event, vm.defaults);
            }
        }
        //TODO: create evt-popover with info about critical apparatus.
    };

    this.destroy = function() {
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        _console.log('vm - destroy ' + tempId);
    };

    // _console.log('ReadingCtrl running');
});