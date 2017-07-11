angular.module('evtviewer.quote')

.controller('QuoteCtrl', function($log, $scope, evtQuote, evtPopover, evtInterface, evtApparatuses, evtBox, evtSourcesApparatusEntry, evtSourceSeg, parsedData) {
    var vm = this;
    
    var _console = $log.getInstance('quote');

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

    this.isSelected = function() {
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
        vm.apparatus._loaded = true;
    };

    this.toggleOverQuotes = function($event) {
        $event.stopPropagation();
        if ( vm.over === false ) {
            evtQuote.mouseOverByQuoteId(vm.quoteId);
            evtSourcesApparatusEntry.mouseOverByQuoteId(vm.quoteId);           
        } else {
            evtQuote.mouseOutAll();
            evtSourcesApparatusEntry.mouseOutAll();
        }
    };

    this.toggleSelectQuotes = function($event) {
        //TODO: aggiungere controllo per gli altri elementi critici
        if (vm.selected === false) {
            evtQuote.selectById(vm.quoteId);
            evtSourcesApparatusEntry.selectById(vm.quoteId);
            if (!vm.apparatus.inline) {
                evtApparatuses.setCurrentApparatus('sources');
                evtApparatuses.alignScrollToQuote(vm.quoteId);
            } 
            evtInterface.updateCurrentQuote(vm.quoteId);
        } else {
            evtQuote.unselectAll();
            evtInterface.updateCurrentQuote('');
            evtSourcesApparatusEntry.unselectAll();
        }

        evtInterface.updateUrl();
    };

    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if (vm.over) {
            if ( !vm.apparatus._loaded ) {
                vm.apparatus._loaded = true;
            } 
            
            evtQuote.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.over) {
            vm.toggleSelectQuotes($event);
            if (!vm.isSelected() || (vm.apparatus.inline && !vm.apparatus.opened)){
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
    
    this.hasScopeSource = function() {
        var quotesRef = parsedData.getSources()._indexes.quotesRef[vm.quoteId] || undefined,
            currentSourceText = evtInterface.getCurrentSourceText();
        if (quotesRef !== undefined && quotesRef.indexOf(currentSourceText) >= 0) {
            return true;
        } else {
            return false;
        }
    };

    this.destroy = function() {
        evtQuote.destroy(this.uid);
    };
});