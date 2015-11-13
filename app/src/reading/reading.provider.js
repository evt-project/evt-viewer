angular.module('evtviewer.reading')

.provider('evtReading', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';

    this.$get = function() {
        var reading = {},
            collection = {},
            list = [],
            idx = 0;
        

        // 
        // Popover builder
        // 

        reading.build = function(id, vm) {
            var currentId = idx++,
                entryId = id || undefined;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            scopeHelper = {
                // expansion
                uid: currentId,
                appEntryId: entryId,
                over: false,
                active: entryId === reading.getCurrentAppEntry(),
                openTriggerEvent: angular.copy(defaults.openTriggerEvent),
                defaults: angular.copy(defaults)
            };

            collection[currentId] = angular.extend(vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };


        //
        // Service function
        // 
        reading.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        reading.getList = function() {
            return list;
        };

        reading.setCurrentAppEntry = function(appEntryId) {
            currentAppEntry = appEntryId;
        };

        reading.getCurrentAppEntry = function(){
            return currentAppEntry;
        };

        reading.mouseOutAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.mouseOut();
            });
        };

        reading.mouseOverById = function(appEntryId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appEntryId === appEntryId) {
                    currentReading.mouseOver();
                } else {
                    currentReading.mouseOut();
                }
            });  
        };

        reading.unselectAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.unselect();
            });
        };

        reading.selectById = function(appEntryId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appEntryId === appEntryId) {
                    currentReading.setSelected();
                } else {
                    currentReading.unselect();
                }
            });  
            reading.setCurrentAppEntry(appEntryId);
        };

        return reading;
    };

});