angular.module('evtviewer.analoguesApparatusEntry')

.provider('evtAnaloguesApparatusEntry', function() {
    
    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }

    this.$get = function(parsedData, $log/*, evtAnaloguesApparatus*/) {
        var analoguesAppEntry = {},
            collection     = {},
            list           = [],
            idx            = 0;
        
        analoguesAppEntry.build = function (scope) {
            var currentId = idx++,
                entryId = scope.analogueId || undefined,
                scopeWit = scope.scopeWit || '';
            
            var scopeHelper = {};

            if (typeof(collection[currentId] !== 'undefined')) {
                return;
            }

            var content;

            var analogueEntry;

            return collection[currentId];
        }

        analoguesAppEntry.destroy = function(tempId) {
            delete collection[tempId];
        }

        return analoguesAppEntry;
    };

});