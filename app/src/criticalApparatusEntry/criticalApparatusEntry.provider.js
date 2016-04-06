angular.module('evtviewer.criticalApparatusEntry')

.provider('evtCriticalApparatusEntry', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function(parsedData, baseData, evtCriticalParser, evtCriticalApparatus) {
        var appEntry   = {},
            collection = {},
            list       = [],
            idx        = 0,
            pinned     = [];
        

        // 
        // Reading builder
        // 
        
        appEntry.build = function(id, scope) {
            var currentId = idx++,
                entryId   = id || undefined,
                scopeWit  = scope.scopeWit || '';

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            // Get Apparatus Entry content 
            var content;
            var criticalEntry = parsedData.getCriticalEntryById(id);
            if (criticalEntry === undefined) {
                var XMLdocument = baseData.getXMLDocuments()[0];
                XMLdocument = XMLdocument.cloneNode(true);
                evtCriticalParser.findCriticalEntryById(XMLdocument, id);
                delete XMLdocument;
                criticalEntry = parsedData.getCriticalEntryById(id);
            }

            if (criticalEntry !== undefined) {
                content = evtCriticalApparatus.getContent(criticalEntry, criticalEntry._subApp, scopeWit);
            }

            scopeHelper = {
                // expansion
                uid               : currentId,
                scopeWit          : scopeWit,
                appId             : entryId,
                readingId         : scope.readingId,
                content           : content,
                _subContentOpened : defaults.firstSubContentOpened,
                over              : false
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
        appEntry.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        appEntry.getList = function() {
            return list;
        };

        appEntry.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        appEntry.getPinned = function() {
            return pinned;
        };

        appEntry.setPinned = function(pinnedArray) {
            pinned = pinnedArray;
        };

        appEntry.isPinned = function(appId) {
            return pinned.indexOf(appId) >= 0;
        };

        appEntry.pin = function(appId) {
            if (pinned.indexOf(appId) < 0) {
                pinned.push(appId);
            }
        };

        appEntry.unpin = function(appId) {
            var index = pinned.indexOf(appId);
            if (index >= 0) {
                pinned.splice(index, 1);
            }
        };

        return appEntry;
    };

});