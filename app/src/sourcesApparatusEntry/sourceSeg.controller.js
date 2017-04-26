angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourceSegCtrl', function(evtInterface) {
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
            vm.quoteId === quoteId;
        }
    };
});