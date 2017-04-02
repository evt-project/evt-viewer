angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourcesApparatusEntryCtrl', function($scope, evtSourcesApparatusEntry, evtQuote) {
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

    this.toggleSubContent = function(subContentName) {
        if (vm._subContentOpened !== subContentName) {
            vm._subContentOpened = subContentName;
        } else {
            vm._subContentOpened = '';
        }
    };

    this.toggleOverQuotes = function($event) {
        $event.stopPropagation();
        if (vm.quoteId === undefined){
            if (vm.over === false) {
                evtQuote.mouseOverByQuoteId(vm.quoteId);
            } else {
                evtQuote.mouseOutAll();
            }
        }
    };

    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtSourcesApparatusEntry.destroy(tempId);
    };
});