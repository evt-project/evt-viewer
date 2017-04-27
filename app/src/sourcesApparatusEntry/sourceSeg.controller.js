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

    this.toggleOverSeg = function($event, segId) {
        $event.stopPropagation();
        if (vm.over === false) {
            evtSourceSeg.mouseOverBySegId(segId);
        } else {
            evtSourceSeg.mouseOutAll();
        }
    };

    this.callbackClick = function($event, segId) {
        $event.stopPropagation();
        if (!vm.selected) {
            evtSourceSeg.selectBySegId(segId);
        } else {
            evtSourceSeg.unselectAll();
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
        //if (vm.quoteId !== quoteId) {
            vm.quoteId = quoteId;
            //if (evtSourceSeg.getCurrentQuote() !== quoteId) {
                evtSourceSeg.updateCurrentQuote(quoteId);
                evtInterface.updateCurrentQuote(quoteId);
            //}
            evtBox.alignScrollToQuote(quoteId, vm.segId);            
        //}
    };

    this.destroy = function() {
        var tempId = this.uid;
        evtSourceSeg.destroy(tempId);
    }
});