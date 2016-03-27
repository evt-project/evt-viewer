angular.module('evtviewer.reading')

.provider('evtReading', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';

    this.$get = function() {
        var reading    = {},
            collection = {},
            list       = [],
            idx        = 0;
        

        // 
        // Reading builder
        // 
        
        reading.build = function(id, scope) {
            var currentId = idx++,
                entryId = id || undefined;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            scopeHelper = {
                // expansion
                uid              : currentId,
                scopeWit         : scope.scopeWit || '',
                appId            : entryId,
                readingId        : scope.readingId,
                readingType      : scope.readingType,
                variance         : scope.variance,

                over             : false,
                tooltipOver      : false,
                apparatusOpened  : false,
                apparatusContent : '',
                active           : entryId === reading.getCurrentAppEntry(),
                openTriggerEvent : angular.copy(defaults.openTriggerEvent),
                defaults         : angular.copy(defaults)
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
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

        reading.setCurrentAppEntry = function(appId) {
            currentAppEntry = appId;
        };

        reading.getCurrentAppEntry = function(){
            return currentAppEntry;
        };

        reading.mouseOutAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.mouseOut();
            });
        };

        reading.mouseOverById = function(appId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
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

        reading.closeAllApparatus = function(skipId) {
            angular.forEach(collection, function(currentReading) {
                if (skipId === undefined) {
                    currentReading.closeApparatus();
                } else if (currentReading.uid !== skipId) {
                    currentReading.closeApparatus();
                }
            });
        };
        reading.selectById = function(appId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    currentReading.setSelected();
                } else {
                    currentReading.unselect();
                }
            });  
            reading.setCurrentAppEntry(appId);
        };

        reading.destroy = function(tempId) {
            delete collection[tempId];
        };

        return reading;
    };

});