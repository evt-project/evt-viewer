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

            var content,
                src_list = {
                    _indexes : []
                },
                tabs = {
                    _indexes: []
                };

            var quoteEntry = parsedData.getQuote(id);
            if (quoteEntry !== undefined) {
                content = evtSourcesApparatus.getContent(quoteEntry, scopeWit);
                var sources = content.sources;
                sources.length = content.sources.length;
                var head = content.quote;
                if (quoteEntry._xmlSource !== '') {
                    tabs._indexes.push('xmlSource');
                    tabs.xmlSource = {
                        label : 'XML'
                    };
                var xml = content._xmlSource;
                }

            }

            scopeHelper = {
                head : head,
                xml : xml,
                sources : sources,
                src_list : src_list,
                tabs : tabs
            }
            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });
            
            return collection[currentId];
        }

        return sourceEntry;
    };
});