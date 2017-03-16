angular.module('evtviewer.sourcesApparatusEntry')

.provider('evtSourcesApparatusEntry', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }
    
    this.$get = function(parsedData, evtSourcesApparatus, $log) {
        var sourceEntry = {},
            //Collezione di istanze della direttiva?
            collection = {},
            list = [],
            idx = 0;
        
        sourceEntry.build = function(id, scope) {
            var currentId = idx++,
                entryId = id || undefined;
                scopeWit = scope.scopeWit || '';

            var scopeHelper = {};

            //Modo per non aggiungere nuove istanze della direttiva?
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            //var nome = {nome:'pippo'};
            var content;

            var quoteEntry = parsedData.getQuote(id);
            if (quoteEntry !== undefined) {
                //content.nome = 'minnie';
                var c = evtSourcesApparatus.getContent(quoteEntry, scopeWit);
                content = c.quote;
            }

            scopeHelper = {
                content : content,
            }
            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });
            
            return collection[currentId];
        }

        return sourceEntry;
    }
});