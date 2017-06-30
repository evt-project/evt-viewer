angular.module('evtviewer.versionReading')

.provider('evtVersionReading', function() {
    
    var currentVersionEntry = '';

    this.$get = function() {
        var versionReading = {},
            collection = {},
            list = [],
            idx = 0;
        
        versionReading.build = function(scope) {
            var currentId = idx++,
                entryId = scope.appId || undefined;
            if (collection[currentId] !== undefined) {
                return;
            }
            var scopeHelper = {
                uid : currentId,
                appId : entryId,
                readingId : scope.readingId,
                type : scope.type,
                scopeWit : scope.scopeWit,
                scopeVersion : scope.scopeVersion,
                over : false,
                selected : entryId === versionReading.getCurrentVersionEntry(),
                apparatus : {
                    opened : false,
                    _subContentOpened : '',
                },
                highlightedText : false
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };

        versionReading.getCurrentVersionEntry = function() {
            return currentVersionEntry;
        };

        versionReading.setCurrentVersionEntry = function(appId) {
            if (appId !== undefined && appId !== currentVersionEntry) {
                currentVersionEntry = appId;
            }
        };

        versionReading.mouseOutAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.mouseOut();
            });
        };

        versionReading.mouseOverByAppId = function(appId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    currentReading.mouseOver();
                } else {
                    currentReading.mouseOut();
                }
            });
        };

        versionReading.selectById = function(appId) {
            angular.forEach(collection, function(currentReading) {
                if (currentReading.appId === appId) {
                    currentReading.setSelected();
                } else {
                    currentReading.unselect();
                }
            }); 
            versionReading.setCurrentVersionEntry(appId);
        };

        versionReading.unselectAll = function() {
            angular.forEach(collection, function(currentReading) {
                currentReading.unselect();
            });
        };

        versionReading.closeAllApparatus = function(skipId) {
            angular.forEach(collection, function(currentReading) {
                if (skipId === undefined) {
                    currentReading.closeApparatus();
                } else if (currentReading.uid !== skipId) {
                    currentReading.closeApparatus();
                }
            });
        };

        versionReading.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return versionReading;
    };
});