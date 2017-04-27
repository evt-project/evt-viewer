angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourceSegCtrl', function(evtInterface, evtSourceSeg, evtBox) {
    var vm = this;

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

    this.getQuoteId = function() {
        return vm.quoteId;
    };

    this.setQuoteId = function(quoteId) {
        if (vm.quoteId !== quoteId) {
            vm.quoteId = quoteId;
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        vm.panel.opened = !vm.panel.opened;
        vm.selected = !vm.selected;
        evtSourceSeg.mouseOutAll();
    };

    this.toggleQuoteOver = function($event, quoteId) {
        $event.stopPropagation();
        if (vm.panel._quoteOver !== quoteId) {
            evtSourceSeg.mouseOutAll();
            vm.panel._quoteOver = quoteId;
        }
    };

    this.selectQuote = function($event, quoteId) {
        $event.stopPropagation();
        if (vm.quoteId !== quoteId) {
            vm.quoteId = quoteId;
            if (evtSourceSeg.getCurrentQuote() !== quoteId) {
                evtSourceSeg.updateCurrentQuote(quoteId);
            }
            evtBox.alignScrollToQuote(quoteId);
            evtInterface.updateCurrentQuote(quoteId);
        }
    };

    this.destroy = function() {
        var tempId = this.uid;
        evtSourceSeg.destroy(tempId);
    }
});