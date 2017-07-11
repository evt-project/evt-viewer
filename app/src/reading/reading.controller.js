angular.module('evtviewer.reading')

.controller('ReadingCtrl', function(config, $log, $scope, evtReading, parsedData, evtPopover, evtCriticalApparatusParser, baseData, evtInterface, config, evtCriticalApparatusEntry, evtApparatuses, evtBox) {
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
        vm.selected = true;
    };

    this.unselect = function() {
        vm.selected = false;
    };

    this.isSelect = function() {
        if (vm.parentAppId !== undefined ) {
            return vm.selected || (evtInterface.getCurrentAppEntry() === vm.parentAppId);
        } else {
            return vm.selected;
        }
    };

    this.isApparatusOpened = function() {
        return (vm.apparatus.opened && !$scope.$parent.vm.state.topBoxOpened);
    };

    this.closeApparatus = function() {
        vm.apparatus.opened = false;
    };

    this.openApparatus = function() {
        vm.apparatus.opened = true;
        vm.apparatus._loaded = true;
    };

    this.toggleTooltipOver = function() {
        vm.tooltipOver = !vm.tooltipOver;
    };

    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if ( !vm.hidden ) {
            if ( vm.over === false ) {
                evtReading.mouseOverByAppId(vm.appId);
                evtCriticalApparatusEntry.mouseOverByAppId(vm.appId);
            } else {
                evtReading.mouseOutAll();
                evtCriticalApparatusEntry.mouseOutAll();
            }
        }
    };

    this.toggleSelectAppEntries = function($event) {
        if ( !vm.hidden ) {
            if (vm.selected === false) {
                evtReading.selectById(vm.appId);
                evtCriticalApparatusEntry.selectById(vm.appId);
                if (!vm.apparatus.inline) {
                    evtApparatuses.setCurrentApparatus('criticalApparatus');
                    evtApparatuses.alignScrollToApp(vm.appId);
                } 
                evtInterface.updateCurrentAppEntry(vm.appId);
            } else {
                evtInterface.updateCurrentAppEntry('');
                evtReading.unselectAll();
                evtCriticalApparatusEntry.unselectAll();
            }
        }
        evtInterface.updateUrl();
    };

    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if ( !vm.hidden && vm.over ) {
            if ( !vm.apparatus._loaded) {
                vm.apparatus._loaded = true;
            } 
            
            evtReading.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.over) {
            vm.toggleSelectAppEntries($event);
            if (!vm.isSelect() || (vm.apparatus.inline && !vm.apparatus.opened)){
                vm.toggleApparatus($event);
            }
        }
    };

    this.isApparatusOpened = function(){
        return vm.apparatus.opened;
    };

    this.openApparatusSubContent = function(subContent) {
        vm.apparatus._subContentOpened = subContent;
    };

    this.backgroundColor = function(){
        if (vm.type === 'variant') {
            return colorFilters();
        } else {
            return colorVariance();
        }
    };

    var colorVariance = function() {
        var opacity;
        if ($scope.$parent.vm.state.heatmap) {
            var maxVariance = parsedData.getCriticalEntriesMaxVariance();
            opacity = vm.over && !$scope.$parent.vm.state.topBoxOpened ? '1' : vm.variance/maxVariance;
            var color = config.heatmapColor.replace('rgb', 'rgba').slice(0, -1)+','+opacity+')';
            return 'background: '+color;
        } else {
            return colorFilters();
        }
    };

    var colorFilters = function() {
        var background, filterLabels, possibleFilters;
        var app, reading, readingAttributes;
        
        var possibleVariantFilters = config.possibleVariantFilters, 
            possibleLemmaFilters   = config.possibleLemmaFilters;
        
        var parentStatusOver = false;
        if (vm.parentAppId) {
            var parentRef = evtReading.getById(vm.parentAppId);
            parentStatusOver = parentRef ? parentRef.over || parentRef.isSelect() : false;
        }

        if (vm.appId !== undefined) {
            app     = parsedData.getCriticalEntryById(vm.appId);
            reading = vm.readingId !== undefined ? app.content[vm.readingId] : app.content[app.lemma];
            if (reading !== undefined){
                readingAttributes = reading.attributes || {};
            
                filterLabels = parsedData.getCriticalEntriesFilters();

                possibleFilters = $scope.$parent.vm.type === 'witness' ? possibleVariantFilters : possibleLemmaFilters;
                if (Object.keys(readingAttributes).length > 0) {
                    var colors = '';
                    var opacity = (vm.over || vm.isSelect() || parentStatusOver) && !$scope.$parent.vm.state.topBoxOpened ? '1' : '.4';
                    for (var label in filterLabels) {
                        var filterLabel = filterLabels[label].name;
                        if (possibleFilters.indexOf(filterLabel) >= 0) {
                            if (readingAttributes !== undefined && readingAttributes[filterLabel] !== undefined) {
                                for (var filter in filterLabels[label].values) {
                                    var filterColor = filterLabels[label].values[filter].color,
                                        filterValue = filterLabels[label].values[filter].name;
                                    if (readingAttributes[filterLabel] === filterValue){
                                        var color = filterColor.replace('rgb', 'rgba');
                                        colors += color.slice(0, -1)+','+opacity+'),';
                                    }
                                }
                            }
                        }
                    }
                    
                    if (colors !== '' ) {
                        colors = colors.slice(0, -1);
                        if ( (colors.match(/rgb/gi) && colors.match(/rgb/gi).length > 1) || (colors.match(/#/gi) && colors.match(/#/gi).length > 1)) {
                            background  = 'background: -moz-linear-gradient(left,'+colors+');';
                            background += 'background: -webkit-linear-gradient(left,'+colors+');';
                            background += 'background: ms-linear-gradient(left,'+colors+');';
                            background += 'background: linear-gradient(left,'+colors+');';
                        } else {
                            background = 'background: '+colors;
                        }
                    }
                }   
            }
        }
        if (background === undefined) {
            if (!$scope.$parent.vm.state.topBoxOpened) {
                if (vm.over || vm.isSelect() || parentStatusOver) {
                    background = 'background: '+config.variantColorDark;
                } else {
                    background = 'background: '+config.variantColorLight;
                }
            }
        }
        return background;
    };

    this.fitFilters = function(){
        var app = parsedData.getCriticalEntryById(vm.appId),
            reading,
            readingAttributes;
        
        var condizione = 'OR', //TODO: Decidere come gestire
            fit        = false,
            count      = 0,
            match,
            filter,
            filterLabel,
            i,
            values,
            value,
            key;
        if (app !== undefined){
            reading = vm.readingId !== undefined ? app.content[vm.readingId] : app.content[app.lemma];
            if (reading !== undefined){
                readingAttributes = reading.attributes || {};
            
                var filters = $scope.$parent.vm.state.filters || {};
                var filterKeys = Object.keys(filters);
                if (condizione === 'OR') {
                    // basta che almeno un filtro corrisponda, quindi non importa ciclarli tutti
                    match = false;
                    for (key in filterKeys) {
                        filterLabel = filterKeys[key];
                        filter      = filters[filterLabel];
                        if (filter.totActive > 0) {
                            count++;
                            if (readingAttributes !== undefined && readingAttributes[filterLabel] !== undefined){
                                i = 0;
                                values = filter.values;
                                while ( i < values.length && !match) {
                                    value = values[values[i]].name;
                                    match = match || readingAttributes[filterLabel] === value;
                                    i++;
                                }
                            }
                        }
                        if (match) { break; }
                    }
                    fit = match;
                } else { //default
                    var visible = true;
                    for (key in filterKeys) {
                        filterLabel = filterKeys[key];
                        filter      = filters[filterLabel];
                        if (filter.totActive > 0) {
                            count++;
                            match = false; 
                            if (readingAttributes !== undefined && readingAttributes[filterLabel] !== undefined){
                                values = filter.values;
                                for ( i = 0; i < values.length; i++ ) {
                                    value = values[values[i]].name;
                                    match = match || readingAttributes[filterLabel] === value;
                                }
                            }
                            visible = visible && match;
                        }
                    }
                    fit = visible;
                }
            }
        }
        
        if (count === 0) {
            fit = true;
        }
        vm.hidden = !fit;
        return fit;
    };

    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtReading.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // _console.log('ReadingCtrl running');
});