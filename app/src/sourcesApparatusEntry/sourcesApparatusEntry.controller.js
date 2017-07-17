/**
 * @ngdoc object
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.controller:sourcesApparatusEntryCtrl
 * @description 
 * # sourcesApparatusEntryCtrl
 * TODO: Add description and list of dependencies!
 * The controller for the {@link evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry evtSourcesApparatusEntry} directive. 
 *
 * @author Chiara Martignano
**/
angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourcesApparatusEntryCtrl', function($scope, evtSourcesApparatusEntry, evtQuote, evtBox, evtApparatuses, evtInterface, parsedData) {
    $scope.content = {};
    var vm = this;
    
    // //////////////////// //
    // toggleSource(source) //
    // ///////////////////////// //
    // Set the new active source //
    // ///////////////////////// //
    this.toggleSource = function(sourceId) {
        if (vm._activeSource !== sourceId) {
            vm._activeSource = sourceId;
            //Reset the tabs for that source
            vm.tabs = {
            _indexes : []
            };
            //Copy the source tabs into the directive tabs
            var currentTabs = vm.srcList[vm._activeSource].tabs;
            for (var i = 0; i < currentTabs._indexes.length; i++) {
                var value = currentTabs._indexes[i];
                vm.tabs._indexes.push(currentTabs._indexes[i]);
                vm.tabs[value] = currentTabs[value];
            }
        }
    };

    this.toggleOverSource = function($event, sourceId) {
        //$event.stopPropagation();
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
        vm.closeSubContent();
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
        if (vm.over) {
            evtSourcesApparatusEntry.mouseOutAll();
            if (vm.currentViewMode === 'readingTxt') {
                evtQuote.mouseOutAll();
            }
        } else {
            evtSourcesApparatusEntry.mouseOverByQuoteId(vm.quoteId);
            if (vm.currentViewMode === 'readingTxt') {
                evtQuote.mouseOverByQuoteId(vm.quoteId);
            }
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
        evtApparatuses.alignScrollToQuote(vm.quoteId);
        evtQuote.selectById(vm.quoteId);
    };

    this.isSourceTextAvailable = function(sourceId) {
        var availableTexts = parsedData.getSources()._indexes.availableTexts,
            isAvailable = false;
        for (var i = 0; i < availableTexts.length; i++) {
            if (availableTexts[i].id === sourceId) {
                isAvailable = true;
            }
        }
        return isAvailable;
    };

    this.destroy = function() {
        evtSourcesApparatusEntry.destroy(this.uid);
    };
});