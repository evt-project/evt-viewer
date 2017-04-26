angular.module('evtviewer.sourcesApparatusEntry')

.provider('evtSourceSeg', function() {
    
    //defaults here

    var currentSourceSeg = '';

    this.$get = function(parsedData, evtSourcesApparatus) {
        var sourceSeg = {},
            collection = {},
            list = [],
            idx = 0;
        
        sourceSeg.build = function(scope) {
            var currentId = idx++,
                segId = scope.segId || undefined,
                quoteId = scope.quoteId || undefined,
                sourceId = scope.sourceId || undefined;
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var quote,
                quotes = [],
                quotesId = parsedData.getSources()._indexes.correspId[sourceId][segId];
            for (var i = 0; i < quotesId.length; i++) {
                quote = evtSourcesApparatus.getContent(parsedData.getQuote(quotesId[i]), '').quote; //TODO: modificare in abbrQuote
                quotes.push({id: quotesId[i], text: quote});
            }

            var scopeHelper = {
                uid : currentId,
                segId : segId,
                quoteId : quoteId,
                sourceId : sourceId,
                
                over : false,
                selected : false,

                panel : {
                    opened : false,
                    quotes : quotes,
                    _quoteOver : '',
                    _quoteSelected : ''
                }
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });
        }

        sourceSeg.destroy = function(tempId) {
            delete collection[tempId];
        };

        return sourceSeg;
    };
});