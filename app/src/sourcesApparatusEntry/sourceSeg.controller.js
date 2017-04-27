angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourceSegCtrl', function(evtInterface, evtSourceSeg, evtBox) {
    //$scope.content = {};
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

    this.toggleOverSeg = function($event) {
        $event.stopPropagation();
        if (vm.over === false) {
            evtSourceSeg.mouseOverBySegId(vm.segId);
        } else {
            evtSourceSeg.mouseOutAll();
        }
    };

    this.callbackClick = function($event) {
        $event.stopPropagation();
        evtSourceSeg.unselectAll();
        evtSourceSeg.closeAllPanels();
        if (vm.panel.opened === false) {
            vm.panel.opened = true;
        } else {
            //evtSourceSeg.closeAllPanels();
            vm.panel.opened = false;
        }
        if (vm.selected === false) {
            vm.selected = true;
        } else {
            //evtSourceSeg.unselectAll();
            vm.selected = false;
        }
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