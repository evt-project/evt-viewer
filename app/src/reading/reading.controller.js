angular.module('evtviewer.reading')

.controller('ReadingCtrl', function($log, $scope, evtReading, parsedData, evtPopover, evtCriticalFormatter, evtCriticalParser, baseData) {
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

    this.isApparatusOpened = function() {
        return (vm.apparatusOpened && !$scope.$parent.vm.state.topBoxOpened);
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
        if ( !vm.hidden ) {
            if (vm.over === false) {
                evtReading.mouseOverById(vm.appId);
            } else {
                evtReading.mouseOutAll();
            }
        }
    };

    this.toggleSelectAppEntries = function($event) {
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

    this.toggleApparatus = function($event) {
        $event.stopPropagation();
        evtPopover.closeAll();
        if ( !vm.hidden ) {
            if (!vm.tooltipOver) {
                if ( vm.apparatusContent === '') {
                    var criticalEntry = parsedData.getCriticalEntryByPos(vm.appId);
                    if (criticalEntry !== undefined) {
                        vm.apparatusContent = evtCriticalFormatter.formatCriticalEntry(criticalEntry);
                    } else {
                        var XMLdocument = baseData.getXMLDocuments()[0];
                        XMLdocument = XMLdocument.cloneNode(true);
                        evtCriticalParser.findCriticalEntryById(XMLdocument, vm.appId);
                        delete XMLdocument;
                        var criticalEntry = parsedData.getCriticalEntryByPos(vm.appId);
                        if (criticalEntry !== undefined) {
                            vm.apparatusContent = evtCriticalFormatter.formatCriticalEntry(criticalEntry);
                        }
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

    this.colorFilters = function() {
        var filterLabels = parsedData.getCriticalEntriesFilters();
        var colors = '';
        var opacity = vm.over || ((vm.active || vm.tooltipOver) && !$scope.$parent.vm.state.topBoxOpened) ? '1' : '.6';
        for (var label in filterLabels) {
            var filterLabel = filterLabels[label].name;
            if (vm.entryAttr !== undefined && vm.entryAttr[filterLabel] !== undefined) {
                for (var filter in filterLabels[label].values) {
                    var filterColor = filterLabels[label].values[filter].color,
                        filterValue = filterLabels[label].values[filter].name;
                    if (vm.entryAttr[filterLabel] === filterValue){
                        var color = filterColor.replace('rgb', 'rgba');
                        colors += color.slice(0, -1)+','+opacity+'),';
                    }
                }
            }
        }
        var background;
        if (colors !== '' ) {
            colors = colors.slice(0, -1);
            if ( (colors.match('rgb', 'gi') && colors.match('rgb', 'gi').length > 1) || (colors.match('#', 'gi') && colors.match('#', 'gi').length > 1)) {
                background  = 'background: -moz-linear-gradient(top,'+colors+');';
                background += 'background: -webkit-linear-gradient(top,'+colors+');';
                background += 'background: ms-linear-gradient(top,'+colors+');'
                background += 'background: linear-gradient(top,'+colors+');';
            } else {
                background = 'background: '+colors;
            }
        }
        return background;
    };

    this.fitFilters = function(){
        var condizione = 'OR', //TODO: Decidere come gestire
            fit        = false,
            count      = 0,
            match,
            filter,
            i,
            values,
            value;
        
        var filters = $scope.$parent.vm.state.filters;
        
        if (condizione === 'OR') {
            // basta che almeno un filtro corrisponda, quindi non importa ciclarli tutti
            match = false;
            for (filter in filters) {
                if (filters[filter].totActive > 0) {
                    count++;
                    if (vm.entryAttr !== undefined && vm.entryAttr[filter] !== undefined){
                        i = 0;
                        values = filters[filter].values;
                        while ( i < values.length && !match) {
                            value = values[values[i]].name;
                            match = match || vm.entryAttr[filter] === value;
                            i++;
                        }
                    }
                }
                if (match) { break; }
            }
            fit = match;
        } else { //default
            var visible = true;
            for (filter in filters) {
                if (filters[filter].totActive > 0) {
                    count++;
                    match = false; 
                    if (vm.entryAttr !== undefined && vm.entryAttr[filter] !== undefined){
                        values = filters[filter].values;
                        for ( i = 0; i < values.length; i++ ) {
                            value = values[values[i]].name;
                            match = match || vm.entryAttr[filter] === value;
                        }
                    }
                    visible = visible && match;
                }
            }
            fit = visible;
        }
        if (count === 0) {
            fit = true;
        }
        return fit;
    };

    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtReading.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    }
    // _console.log('ReadingCtrl running');
});