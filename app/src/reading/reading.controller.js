angular.module('evtviewer.reading')

.controller('ReadingCtrl', function($log, $scope, evtReading, parsedData, evtPopover) {
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
        // _console.log('# setSelected #');
        vm.active = true;
    };

    this.unselect = function() {
        // _console.log('# unselect #');
        vm.active = false;
    };

    this.closeApparatus = function() {
        // _console.log('# closeApparatus #');
        vm.apparatusOpened = false;
    };

    this.openApparatus = function() {
        // _console.log('# openApparatus #');
        vm.apparatusOpened = true;
    };

    
    this.toggleTooltipOver = function() {
        // _console.log('# toggleTooltipOver #');
        vm.tooltipOver = !vm.tooltipOver;
    };

    this.toggleOverAppEntries = function($event) {
        // _console.log('# toggleOverAppEntries #');
        $event.stopPropagation();
        if ( !vm.hidden ) {
            if (vm.over === false) {
                evtReading.mouseOverById(vm.appId);
            } else {
                evtReading.mouseOutAll();
            }
        }
    };

    this.toggleSelectAppEntries = function($event) {
        // _console.log('# toggleSelectAppEntries #');
        $event.stopPropagation();
        if ( !vm.hidden ) {
            if (!vm.tooltipOver) {
                if (vm.active === false) {
                    evtReading.selectById(vm.appId);
                } else {
                    evtReading.unselectAll();
                }
            }
        }
    };

    var formatCriticalEntry = function(entry) {
        var appText  = '',
            readings = entry.readings,
            content  = '',
            i        = 0;
        // se entry e' un raggruppamento di letture (<app> o <rdgGrp>), avra' delle letture
        if (readings !== undefined) {
            // ciclo le letture per ottenere la stampa del testo con sigla testimone
            for (i = 0; i < readings.length; i++) {
                var reading    = readings[readings[i]],
                    text       = '',
                    witnesses  = '',
                    attributes = '';
                if (readings.__elemTypes[readings[i]] === 'lem' || readings.__elemTypes[readings[i]] === 'rdg') { //lem o rdg
                    // recupero il contenuto
                    content = reading.content || [];
                    for (var j = 0; j < content.length; j++) {
                        if (typeof content[j] === 'object') { //annidamento
                            text += '{'+formatCriticalEntry(content[j])+'} ';
                        } else {
                            text += content[j];
                        }
                    }
                } else if (readings.__elemTypes[readings[i]] === 'rdgGrp' || readings.__elemTypes[readings[i]] === 'app') { //rdgGrp o app
                    text += '{'+formatCriticalEntry(reading)+'} ';
                }
                if (text === '') {
                    text = '<i>omit.</i>';
                }
                // recupero i testimoni e gli altri attributi
                if (reading.attributes !== undefined) {
                    for (var key in reading.attributes) {
                        if (key === 'wit') {
                            var wits = reading.attributes[key].split('#').filter(function(el) {return el.length !== 0;});
                            for(var s = 0; s < wits.length; s++ ){
                                var sigla = wits[s].replace(' ', '');
                                if (parsedData.isWitnessesGroup(sigla)) {
                                    witnessesInGroup = parsedData.getWitnessesInGroup(sigla);
                                    if (witnessesInGroup.length > 0) {
                                        for(var w = 0; w < witnessesInGroup.length; w++ ){
                                            witnesses += '<span class="wit" onclick="console.log(\'openWit '+witnessesInGroup[w]+'\');">'+witnessesInGroup[w]+'</span>';    
                                        }
                                    } else {
                                        witnesses += '<span class="wit" onclick="console.log(\'openWit '+sigla+'\');">'+sigla+'</span>';    
                                    }
                                } else {
                                    witnesses += '<span class="wit" onclick="console.log(\'openWit '+sigla+'\');">'+sigla+'</span>';
                                }
                            }
                        } else {
                            attributes += '<span class="'+key+'">'+reading.attributes[key]+'</span>';
                        }
                    }
                }
                if (attributes !== '') {
                    attributes = '<span class="attributes">'+attributes+'</span>';
                }
                if (witnesses !== '') {
                    witnesses = '<span class="witnesses">'+witnesses+'</span>';
                }
                appText += text + witnesses + attributes;
                appText += ', ';
            }
        } 
        return appText.trim().slice(0, -1);
    };

    this.toggleApparatus = function($event){
        // _console.log('# toggleApparatus #');
        $event.stopPropagation();
        evtPopover.closeAll();
        if ( !vm.hidden ) {
            if (!vm.tooltipOver) {
                if ( vm.apparatusContent === '') {
                    var criticalEntry = parsedData.getCriticalEntryByPos(vm.appId);
                    if (criticalEntry !== undefined) {
                        vm.apparatusContent = formatCriticalEntry(criticalEntry);
                    }
                    if (criticalEntry.note !== '') {
                        vm.apparatusContent += '<br /><p>'+criticalEntry.note+'</p>';
                    }
                } 
                if (!vm.tooltipOver) {
                    if ( vm.apparatusOpened ) {
                        vm.closeApparatus();
                    } else {
                        evtReading.closeAllApparatus(vm.uid);
                        vm.apparatusOpened = !vm.apparatusOpened;
                        if (vm.apparatusOpened === true) {
                            vm.resizeTooltip($event, vm.defaults);
                        }
                    }
                }
            }
        }
    };

    this.destroy = function() {
        // _console.log('# destroy #');
        var tempId = vm.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        _console.log('vm - destroy ' + tempId);
    };

    // _console.log('ReadingCtrl running');
});