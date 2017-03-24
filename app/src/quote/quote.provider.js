angular.module('evtviewer.quote')

.provider('evtQuote', function(){

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }

    this.$get = function(parsedData) {
        var quote = {},
            collection = {},
            list = [],
            idx = 0;
            
        quote.build = function(id, scope) {
            var currentId = idx++,
            entryId = id || undefined;

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var scopeHelper = {}

            scopeHelper = {
                uid: currentId,
                scopeWit : scope.scopeWit || '',
                quoteId : entryId,
            }

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };


        quote.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return quote;
    };
});