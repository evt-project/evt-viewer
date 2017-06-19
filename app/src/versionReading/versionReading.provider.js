angular.module('evtviewer.versionReading')

.provider('evtVersionReading', function() {
    //
    this.$get = function() {
        var versionReading = {}
            collection = {},
            list = [],
            idx = 0;
        
        versionReading.build = function(scope) {
            var currentId = idx++,
                entryId = scope.appId || undefined;
            var scopeHelper = {
                uid : currentId,
                appId : entryId,
                readingId : scope.readingId,
                type : scope.type,
                scopeWit : scope.scopeWit,
                scopeVersion : scope.scopeVersion,
                over : false,
                selected : false,
                apparatus : {
                    opened : false,
                    _subContentOpened : '',
                }
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
        
        return versionReading;
    }
});