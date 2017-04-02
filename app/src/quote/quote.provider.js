angular.module('evtviewer.quote')

.provider('evtQuote', function(){

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }

    var currentQuote = '';

    this.$get = function(parsedData) {
        var quote = {},
            collection = {},
            list = [],
            idx = 0;
            
        quote.build = function(scope) {
            var currentId = idx++,
            entryId = scope.quoteId || undefined;

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var scopeHelper = {}

            scopeHelper = {
                uid: currentId,
                scopeWit : scope.scopeWit || '',
                quoteId : entryId,
                
                over             : false,
                apparatus        : {
                    opened            : false,
                    content           : {},
                    _loaded           : false,
                    //_subContentOpened : 'criticalNote'
                },
                selected         : entryId === quote.getCurrentQuote(),
                openTriggerEvent : angular.copy(defaults.openTriggerEvent),
                defaults         : angular.copy(defaults)
            }

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };

        quote.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        quote.getList = function() {
            return list;
        };

        quote.setCurrentQuote = function(quoteId) {
            currentQuote = quoteId;
        };

        quote.getCurrentQuote = function(){
            return currentQuote;
        };

        quote.mouseOutAll = function() {
            angular.forEach(collection, function(currentQuote) {
                currentQuote.mouseOut();
            });
        };

        quote.mouseOverByQuoteId = function(quoteId) {
            angular.forEach(collection, function(currentQuote) {
                if (currentQuote.quoteId === quoteId) {
                    currentQuote.mouseOver();
                } else {
                    currentQuote.mouseOut();
                }
            });
        };

        quote.unselectAll = function() {
            angular.forEach(collection, function(currentQuote) {
                currentQuote.unselect();
            });
        };

        quote.closeAllApparatus = function(skipId) {
            angular.forEach(collection, function(currentQuote) {
                if (skipId === undefined) {
                    currentQuote.closeApparatus();
                } else if (currentQuote.uid !== skipId) {
                    currentQuote.closeApparatus();
                }
            });
        };

        quote.selectById = function(quoteId) {
            angular.forEach(collection, function(currentQuote) {
                if (currentQuote.quoteId === quoteId) {
                    currentQuote.setSelected();
                } else {
                    currentQuote.unselect();
                }
            });  
            quote.setCurrentQuote(quoteId);
        };

        quote.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return quote;
    };
});