angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourcesApparatusEntryCtrl', function($scope, evtSourcesApparatusEntry, evtQuote, evtBox, evtInterface, parsedData) {
    $scope.content = {};
    var vm = this;
    
    /**********************/
    /*toggleSource(source)*/
    /***************************/
    /*Set the new active source*/
    /***************************/
    this.toggleSource = function(sourceId) {
        if (vm._activeSource !== sourceId) {
            vm._activeSource = sourceId;
            //Reset the tabs for that source
            vm.tabs = {
            _indexes : []
            };
            //Copy the source tabs into the directive tabs
            var currentTabs = vm.src_list[vm._activeSource].tabs;
            for (var i = 0; i < currentTabs._indexes.length; i++) {
                var value = currentTabs._indexes[i];
                vm.tabs._indexes.push(currentTabs._indexes[i]);
                vm.tabs[value] = currentTabs[value];
            }
        }
    }

    this.toggleOverSource = function($event, sourceId) {
        $event.stopPropagation();
        //Provoca uno sfarfallio
        vm.over = !vm.over;
        if (vm._overSource !== sourceId) {
            vm._overSource = sourceId;
        } else {
            vm._overSource = '';
        }
    };

    this.getActiveSourceAbbr = function(activeSourceId) {
        for (var i = 0; i < vm.sources.length; i++) {
            if (vm.sources[i].id === activeSourceId ) {
                return vm.sources[i].abbr;
            }
        }
    };
    
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
        if (evtInterface.getCurrentQuote() === vm.quoteId) {
            return true;
        } else {
            return vm.selected;
        }
    };

    this.closeSubContent = function() {
        vm._subContentOpened = '';
    };

    this.toggleSubContent = function(subContentName) {
        if (vm._subContentOpened !== subContentName) {
            vm._subContentOpened = subContentName;
        } else {
            vm._subContentOpened = '';
        }
    };

    this.toggleOverSourcesEntries = function($event) {
        $event.stopPropagation();
        if (vm.over === false) {
            evtSourcesApparatusEntry.mouseOverByQuoteId(vm.quoteId);
            if (vm.currentViewMode === 'readingTxt') {
                evtQuote.mouseOverByQuoteId(vm.quoteId);
            }
        } else {
            evtSourcesApparatusEntry.mouseOutAll();
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.currentViewMode === 'readingTxt') {
            //evtSourcesApparatusEntry.unselectAll();
            //this.setSelected();
            evtSourcesApparatusEntry.selectById(vm.quoteId);
            evtQuote.selectById(vm.quoteId);
        }
    };

    this.alignQuotes = function() {
        evtBox.alignScrollToQuote(vm.quoteId);
        evtQuote.selectById(vm.quoteId);
    };

    this.isSourceTextAvailable = function(sourceId) {
        availableTexts = parsedData.getSources()._indexes.availableTexts;
        var isAvailable = false;
        for (var i = 0; i < availableTexts.length; i++) {
            if (availableTexts[i].id === sourceId) {
                isAvailable = true;
            }
        }
        return isAvailable;
    }

    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtSourcesApparatusEntry.destroy(tempId);
    };
});