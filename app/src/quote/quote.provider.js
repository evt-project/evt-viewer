angular.module('evtviewer.quote')

.provider('evtQuote', function(){

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }
    var currentQuote = '';

    this.$get = function(parsedData) {
        var quote = {},
            idx = 0;
            
        quote.build = function(id, scope) {
            var currentId = idx++,
            entryId = id || undefined;

            return currentId;
        }
    }
})