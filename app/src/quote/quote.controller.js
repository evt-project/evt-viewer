angular.module('evtviewer.quote')

.controller('QuoteCtrl', function($log, $scope, evtQuote, evtPopover, evtInterface, evtApparatuses, evtBox, evtSourcesApparatusEntry, evtSourceSeg) {
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

    this.toggleOverQuotes = function($event) {
        $event.stopPropagation();
            if ( vm.over === false ) {
                evtQuote.mouseOverByQuoteId(vm.quoteId);
                evtSourcesApparatusEntry.mouseOverByQuoteId(vm.quoteId);
                /*if (currentViewMode === srcTxt) {
                    evtSourceSeg.mouseOverByQuoteId(vm.quoteId)
                } */
            } else {
                evtQuote.mouseOutAll();
                evtSourcesApparatusEntry.mouseOutAll();
            }
    };

    this.toggleSelectQuotes = function($event) {
        //TODO: aggiungere controllo per gli altri elementi critici
        if (vm.selected === false) {
            if (!vm.apparatus.opened){
                evtQuote.selectById(vm.quoteId);
            }
        } else {
            if (vm.apparatus.opened){
                evtQuote.unselectAll();
            }
        }
        evtInterface.updateUrl();
    };

    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if (vm.over) {
            if(!vm.apparatus.inline) {
                    if (evtApparatuses.getCurrentApparatus() !== 'Sources') {
                        evtApparatuses.setCurrentApparatus('Sources');
                    }                    
                    //Dopo l'avvio ancora non è stato creato alcun apparato, non c'è un apparato corrente
                    evtSourcesApparatusEntry.selectById(vm.quoteId);
                    evtBox.getById('apparatuses').scrollToQuotesEntry(vm.quoteId);
                } else
            
            if ( !vm.apparatus._loaded) {
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
            if (!vm.isSelect() || !vm.apparatus.opened){
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
    
    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
         //this.$destroy();
        evtQuote.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // _console.log('QuoteCtrl running');
});