angular.module('evtviewer.analogue')

.provider('evtAnalogue', function() {
    
    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAnaloguesEntry = '';

    this.$get = function(parsedData, evtInterface) {
        var analogue   = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        // Analogue builder
        analogue.build = function(scope) {
            var currentId = idx++,
                entryId = scope.analogueId || undefined;
            
            if (collection[currentId] !== undefined) {
                return;
            }

            var scopeHelper = {
                uid : currentId,
                scopeWit : scope.scopeWit || '',
                analogueId : entryId,
                scopeViewMode : evtInterface.getCurrentViewMode(),

                over : false,
                selected : entryId === analogue.getCurrentAnaloguesEntry(),
                apparatus : {
                    opened : false,
                    content: {},
                    _loaded : false,
                    inline : evtInterface.getCurrentViewMode() !== 'readingTxt'
                },
                openTriggerEvent : angular.copy(defaults.openTriggerEvent),
                defaults: angular.copy(defaults)
            }

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });
            return collection[currentId];
        };

        analogue.getById = function(currentId) {
            if (collection[currentId] !== undefined) {
                return collection[currentId];
            }
        };

        analogue.getList = function() {
            return list;
        };

        analogue.setCurrentAnaloguesEntry = function(analogueId) {
            if (evtInterface.getCurrentAnalogue() !== analogueId) {
                evtInterface.updateCurrentAnalogue(analogueId)
            }
            currentAnaloguesEntry = analogueId;
        };

        analogue.getCurrentAnaloguesEntry = function() {
            return currentAnaloguesEntry;
        };

        analogue.mouseOutAll = function() {
            angular.forEach(collection, function(currentAnalogue) {
                currentAnalogue.mouseOut();
            });
        };

        analogue.mouseOverByAnalogueId = function(analogueId) {
            angular.forEach(collection, function(currentAnalogue) {
                if (currentAnalogue.analogueId === analogueId) {
                    currentAnalogue.mouseOver();
                } else {
                    currentAnalogue.mouseOut();
                }
            });
        };

        analogue.unselectAll = function() {
            angular.forEach(collection, function(currentAnalogue) {
                currentAnalogue.unselect();
            });
            evtInterface.updateCurrentAnalogue('');
        };

        analogue.closeAllApparatus = function(skipId) {
            angular.forEach(collection, function(currentAnalogue) {
                if (skipId === undefined) {
                    currentAnalogue.closeApparatus();
                } else if (currentAnalogue.uid !== skipId) {
                    currentAnalogue.closeApparatus();
                }
            });
        };

        analogue.selectById = function(analogueId) {
            angular.forEach(collection, function(currentAnalogue) {
                if (currentAnalogue.analogueId === analogueId) {
                    currentAnalogue.setSelected();
                } else {
                    currentAnalogue.unselect();
                }
            });
            evtInterface.updateCurrentAnalogue(analogueId);
            analogue.setCurrentAnaloguesEntry(analogueId);
        };

        analogue.destroy = function(tempId) {
            delete collection[tempId];
        };

        return analogue;
    };
});