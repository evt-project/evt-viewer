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

            collection[currentId] = scope.vm;
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
    };
});