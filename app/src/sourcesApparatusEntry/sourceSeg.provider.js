angular.module('evtviewer.sourcesApparatusEntry')

.provider('evtSourceSeg', function() {
    
    //defaults here

    var currentQuote = '';

    this.$get = function(parsedData, evtSourcesApparatus, evtInterface) {
        var sourceSeg = {},
            collection = {},
            list = [],
            idx = 0;
        
        sourceSeg.build = function(scope) {
            var currentId = idx++,
                segId = scope.segId || undefined,
                quoteId, //= scope.quoteId || undefined,
                sourceId = scope.sourceId || undefined;
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var currentQuoteId = evtInterface.getCurrentQuote() || '';

            var quote,
                quotes = [],
                quotesId = parsedData.getSources()._indexes.correspId[sourceId][segId];
            for (var i = 0; i < quotesId.length; i++) {
                quote = evtSourcesApparatus.getContent(parsedData.getQuote(quotesId[i]), '').quote; //TODO: modificare in abbrQuote
                quotes.push({id: quotesId[i], text: quote});
            }

            if (quotesId.indexOf(currentQuoteId) >= 0) {
                quoteId = currentQuoteId;
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
                    _quoteSelected : quoteId || ''
                }
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        }

        sourceSeg.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        sourceSeg.getList = function() {
            return list;
        };

        sourceSeg.mouseOutAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.mouseOut();
            });
        };

        sourceSeg.mouseOverBySegId = function(segId) {
            angular.forEach(collection, function(currentEntry) {
                if (currentEntry.segId === segId) {
                    currentEntry.mouseOver();
                } else {
                    currentEntry.mouseOut();
                }
            })
        };

        sourceSeg.unselectAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.unselect();
            });
        };

        sourceSeg.closeAllPanels = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.panel.opened = false;
            });
        };

        sourceSeg.updateCurrentQuote = function(quoteId) {
            if (currentQuote !== quoteId) {
                angular.forEach(collection, function(currentEntry) {
                    var quotes = currentEntry.panel.quotes;
                    for (var i = 0; i < quotes.length; i++) {
                        if (quotes[i].id === quoteId
                            && currentEntry.getQuoteId() !== quoteId) {
                            currentEntry.setQuoteId(quoteId);
                            currentQuote = quoteId;
                        }
                    }
                });
            }
        };

        sourceSeg.getCurrentQuote = function() {
            return currentQuote;
        };

        sourceSeg.destroy = function(tempId) {
            delete collection[tempId];
        };

        return sourceSeg;
    };
});