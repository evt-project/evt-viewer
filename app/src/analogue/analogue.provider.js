angular.module('evtviewer.analogue')

.provider('evtAnalogue', function() {
    
    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function(parsedData) {
        var analogue   = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        // Analogue builder
        analogue.build = function(scope) {
            var currentId = idx++,
                entryId = scope.analogueId || undefined,
                attributes = '';
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var scopeHelper = {};

            scopeHelper = {
                uid: currentId,
                scopeWit: scope.scopeWit || '',
                analogueId: entryId
            }
            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });
            return collection[currentId];
        };

        analogue.destroy = function(tempId) {
            delete collection[tempId];
        };

        return analogue;
    };
});