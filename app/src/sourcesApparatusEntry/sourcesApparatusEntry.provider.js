angular.module('evtviewer.sourcesApparatusEntry')

.provider('evtSourcesApparatusEntry', function() {
    this.$get = function(parsedData, evtSourcesApparatus) {
        var sourceEntry = {},
            //Collezione di istanze della direttiva?
            collection = {},
            list = [],
            idx = 0;
        
        sourceEntry.build = function(id, scope) {
            var currentId = idx++,
                scopeWit = scope.scopeWit || '';
                entryId = id || undefined;

            var scopeHelper = {};

            //Modo per non aggiungere nuove istanze della direttiva?
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var content;

            var quoteEntry = parsedData.getQuote(id);
            if (quoteEntry !== undefined) {
                content = evtSourcesApparatus.getContent(quoteEntry, scopeWit);
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
    }
});