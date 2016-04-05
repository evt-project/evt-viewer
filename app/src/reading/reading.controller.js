angular.module('evtviewer.reading')

.controller('ReadingCtrl', function($log, $scope, evtReading, parsedData, evtPopover, evtCriticalParser, baseData, evtInterface) {
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

    this.isApparatusOpened = function() {
        return (vm.apparatus.opened && !$scope.$parent.vm.state.topBoxOpened);
    };

    this.closeApparatus = function() {
        vm.apparatus.opened = false;
    };

    this.openApparatus = function() {
        vm.apparatus.opened = true;
    };

    this.toggleApparatus = function() {
        vm.apparatus.opened = !vm.apparatus.opened;
    };

    this.toggleTooltipOver = function() {
        vm.tooltipOver = !vm.tooltipOver;
    };

    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if ( !vm.hidden ) {
            if ( vm.over === false ) {
                evtReading.mouseOverByAppId(vm.appId);
            } else {
                evtReading.mouseOutAll();
            }
        }
    };

    this.toggleSelectAppEntries = function($event) {
        $event.stopPropagation();
        if ( !vm.hidden ) {
            if (vm.selected === false) {
                if (!vm.apparatus.opened){
                    evtReading.selectById(vm.appId);
                    evtInterface.updateCurrentAppEntry(vm.appId);
                }
            } else {
                if (vm.apparatus.opened){
                    evtReading.unselectAll();
                    evtInterface.updateCurrentAppEntry('');
                }
            }
        }
        evtInterface.updateUrl();
    };

    this.toggleApparatus = function($event) {
        $event.stopPropagation();
        // evtPopover.closeAll();
        if ( !vm.hidden ) {
            if ( !vm.apparatus._loaded) {
                vm.apparatus._loaded = true;
            } 
            
            // evtReading.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        vm.toggleSelectAppEntries($event);
        if (!vm.selected || !vm.apparatus.opened){
            vm.toggleApparatus($event);
        }
    };

    this.isApparatusOpened = function(){
        return vm.apparatus.opened;
    };

    this.openApparatusSubContent = function(subContent) {
        vm.apparatus._subContentOpened = subContent;
    };

    this.backgroundColor = function(){
        if ($scope.$parent.vm.type === 'witness') {
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
            return 'background: rgba(255, 108, 63, '+opacity+')';
        } else {
            if (vm.selected && !$scope.$parent.vm.state.topBoxOpened){
                return 'background: rgb(101, 138, 255)';
            }
            // opacity = vm.over && !$scope.$parent.vm.state.topBoxOpened ? '1' : '.3';
            // return 'background: rgba(208, 220, 255, '+opacity+')';
            return '';
        }
    };

    var colorFilters = function() {
        var filterLabels = parsedData.getCriticalEntriesFilters();
        var app          = parsedData.getCriticalEntryById(vm.appId);
        var background;
        if (vm.readingId !== undefined){
            var reading       = app.content[vm.readingId];
            var readingAttributes = reading.attributes || {};
            if (Object.keys(readingAttributes).length > 0) {
                var colors = '';
                var opacity = (vm.over || vm.selected) && !$scope.$parent.vm.state.topBoxOpened ? '1' : '.4';
                for (var label in filterLabels) {
                    var filterLabel = filterLabels[label].name;
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
                
                if (colors !== '' ) {
                    colors = colors.slice(0, -1);
                    if ( (colors.match('rgb', 'gi') && colors.match('rgb', 'gi').length > 1) || (colors.match('#', 'gi') && colors.match('#', 'gi').length > 1)) {
                        background  = 'background: -moz-linear-gradient(left,'+colors+');';
                        background += 'background: -webkit-linear-gradient(left,'+colors+');';
                        background += 'background: ms-linear-gradient(left,'+colors+');'
                        background += 'background: linear-gradient(left,'+colors+');';
                    } else {
                        background = 'background: '+colors;
                    }
                }
            }
        }
        if (background === undefined) {
            if ((vm.over || vm.selected) && !$scope.$parent.vm.state.topBoxOpened) {
                background = 'background: rgba(101, 138, 255)';    
            }
        }
        return background;
    };

    this.fitFilters = function(){
        var app = parsedData.getCriticalEntryById(vm.appId),
            reading,
            readingAttributes;
        
        if (vm.readingId !== undefined){
            reading           = app.content[vm.readingId];
            readingAttributes = reading.attributes || {};
        }
        var condizione = 'OR', //TODO: Decidere come gestire
            fit        = false,
            count      = 0,
            match,
            filter,
            i,
            values,
            value;
        
        var filters = $scope.$parent.vm.state.filters || {};
        var filterKeys = Object.keys(filters);
        if (condizione === 'OR') {
            // basta che almeno un filtro corrisponda, quindi non importa ciclarli tutti
            match = false;
            for (var key in filterKeys) {
                var filterLabel = filterKeys[key];
                var filter      = filters[filterLabel];
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
            for (var key in filterKeys) {
                var filterLabel = filterKeys[key];
                var filter      = filters[filterLabel];
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
    }
    // _console.log('ReadingCtrl running');
});