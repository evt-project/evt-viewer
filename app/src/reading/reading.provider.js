angular.module('evtviewer.reading')

.provider('evtReading', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';

    this.$get = function(parsedData) {
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
                parentEntryId;

            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            var exponents = parsedData.getCriticalEntries()._indexes.exponents,
                exponent;
            for (var i = 0; i < exponents.length; i++) {
                var expAppId = exponents[i].appId;
                if (expAppId !== undefined && expAppId === scope.appId) {
                    exponent = exponents[i].exponent;
                }
            }
            if (exponent === undefined) {
                number++;
                var firstExp,
                lastExp;
                if (number > 26) {
                    firstExp = (Math.floor(number/26))+96;
                    if (number%26 === 0) {
                        exponent = '&#'+(firstExp-1)+'; z';
                    } else {
                    lastExp = (number%26)+96;
                    exponent='&#'+firstExp+'; &#'+lastExp+';'; }
                } else {
                    exponent = '&#'+(number+96)+';';
                }
                parsedData.getCriticalEntries()._indexes.exponents.push({appId: scope.appId, exponent: exponent});
            }            

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

                over             : false,
                apparatus        : {
                    opened            : false,
                    content           : {},
                    _loaded           : false,
                    _subContentOpened : 'criticalNote',
                    inline            : scope.currentViewMode !== 'readingTxt'
                },
                selected         : entryId === reading.getCurrentAppEntry(),
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