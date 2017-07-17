/**
 * @ngdoc service
 * @module evtviewer.quote
 * @name evtviewer.quote.evtQuote
 * @description 
 * # evtQuote
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.reading')

.provider('evtReading', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';

    this.$get = function(config, parsedData) {
        var reading    = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var number = 0;
        // 
        // Reading builder
        // 
        
        reading.build = function(id, scope) {
            var currentId  = idx++,
                entryId    = id || undefined,
                attributes = '',
                parentEntryId,
                showExponent = config.showReadingExponent;
            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            var exponent = parsedData.getCriticalEntryExponent(scope.appId);

            if (scope.readingId !== undefined){
                var aAttributes = parsedData.getReadingAttributes(scope.readingId, id) || [];
                for (var attr in aAttributes) {
                    if (attr !== 'wit' && attr !== 'xml:id'){
                        attributes += attr.toUpperCase()+': '+aAttributes[attr]+' - ';
                    }
                }
                if (attributes !== '') {
                    attributes = attributes.slice(0, -3);
                }
            }
            var appObj = parsedData.getCriticalEntryById(entryId);
            if (appObj && appObj._subApp) {
                parentEntryId = appObj._indexes._parentEntry || '';
            }

            scopeHelper = {
                // expansion
                uid              : currentId,
                scopeWit         : scope.scopeWit || '',
                appId            : entryId,
                parentAppId      : parentEntryId,
                readingId        : scope.readingId,
                readingType      : scope.readingType,
                variance         : scope.variance,
                type             : scope.type,
                attributes       : attributes,
                exponent         : exponent,
                showExponent     : showExponent,

                over             : false,
                apparatus        : {
                    opened            : false,
                    content           : {},
                    _loaded           : false,
                    _subContentOpened : 'criticalNote',
                    inline            : scope.inlineApparatus
                },
                selected         : entryId === reading.getCurrentAppEntry(),
                openTriggerEvent : angular.copy(defaults.openTriggerEvent),
                defaults         : angular.copy(defaults)
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId,
                entryId: entryId
            });

            return collection[currentId];
        };


        //
        // Service function
        // 
        reading.getById = function(appId) {
            var foundReading;
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    foundReading = currentReading;
                }
            });  
            return foundReading;
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

        reading.mouseOverByAppId = function(appId) {
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