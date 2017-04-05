angular.module('evtviewer.analoguesApparatusEntry')

.controller('analoguesApparatusEntryCtrl', function(evtAnaloguesApparatusEntry) {
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

    this.toggleSubContent = function(subContentName) {
        if (vm._subContentOpened !== subContentName) {
            vm._subContentOpened = subContentName;
        } else {
            vm._subContentOpened = '';
        }
    };

    this.destroy = function() {
        var tempId = this.uid;
        evtAnaloguesApparatusEntry.destroy(tempId);
    }
});