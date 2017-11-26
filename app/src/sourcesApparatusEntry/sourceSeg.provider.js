/**
 * @ngdoc service
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.evtSourceSeg
 * @description 
 * # evtSourceSeg
 * This provider expands the scope of the
 * {@link evtviewer.sourcesApparatusEntry.directive:evtSourceSeg evtSourceSeg} 
 * directive and stores its reference untill the directive remains instantiated.
 *
 * @author CM
**/
angular.module('evtviewer.sourcesApparatusEntry')

.provider('evtSourceSeg', function() {
    
    //defaults here

    var currentQuote = '';

    this.$get = function(parsedData, evtSourcesApparatus, evtInterface) {
        var sourceSeg = {},
            collection = {},
            list = [],
            idx = 0;
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#build
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * <p>This method will extend the scope of 
         * {@link evtviewer.sourcesApparatusEntry.directive:evtSourceSeg evtSourceSeg} directive 
         * according to selected configurations and parsed data.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
                    segId,
                    quoteId,
                    sourceId,
                    
                    over,
                    selected,

                    panel : {
                        quotes,
                        _quoteOver,
                        _quoteSelected
                    }
                };
            </pre>
         */
        sourceSeg.build = function(scope) {
            var currentId = idx++,
                segId = scope.segId || undefined,
                quoteId, //= scope.quoteId || undefined,
                sourceId = scope.sourceId || undefined;
            
            if (collection[currentId] !== undefined) {
                return;
            }

            var currentQuoteId = evtInterface.getState('currentQuote')  || '';

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
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#getById
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Get the reference to <code>&lt;evt-source-seg&gt;</code>
         * with given id.
         * 
         * @param {string} currentId id of source segment entry to handle
         *
         * @returns {Object} object representing the reference to <code>&lt;evt-source-seg&gt;</code>
         * with given id
         */
        sourceSeg.getById = function(currentId) {
            if (collection[currentId] !== undefined) {
                return collection[currentId];
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#getList
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-source-seg&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-source-seg&gt;</code>.
         */
        sourceSeg.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#mouseOutAll
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-source-seg&gt;</code>
         */
        sourceSeg.mouseOutAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.mouseOut();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#mouseOverBySegId
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-source-seg&gt;</code> 
         * with given entry id 
         * @param {string} segId Id of analogues apparatus entry to handle
         */
        sourceSeg.mouseOverBySegId = function(segId) {
            angular.forEach(collection, function(currentEntry) {
                if (currentEntry.segId === segId) {
                    currentEntry.mouseOver();
                } else {
                    currentEntry.mouseOut();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#selectBySegId
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * <p>Select all <code>&lt;evt-source-seg&gt;</code>s connected to a given segment.</p>
         * <p>Set given <code>segId</code> as current one.</p>
         * @param {string} segId Id of source segment to handle
         */
        sourceSeg.selectBySegId = function(segId) {
            angular.forEach(collection, function(currentEntry) {
                if (currentEntry.segId === segId) {
                    currentEntry.setSelected();
                } else {
                    currentEntry.unselect();
                    currentEntry.unselectQuote();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#unselectAll
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Unselect all instances of <code>&lt;evt-source-seg&gt;</code>
         */
        sourceSeg.unselectAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.unselect();
                currentEntry.unselectQuote();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#updateCurrentQuote
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Set current analogues apparatus entry.
         * @param {string} quoteId Id of quote entry to be set as current one
         */
        sourceSeg.updateCurrentQuote = function(quoteId) {
            if (currentQuote !== quoteId) {
                angular.forEach(collection, function(currentEntry) {
                    var quotes = currentEntry.panel.quotes;
                    for (var i = 0; i < quotes.length; i++) {
                        if (quotes[i].id === quoteId && currentEntry.getQuoteId() !== quoteId) {
                            currentEntry.setQuoteId(quoteId);
                            currentQuote = quoteId;
                        }
                    }
                });
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#getCurrentQuote
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Retrieve current quote entry.
         * @returns {string} ID of current quote
         */
        sourceSeg.getCurrentQuote = function() {
            return currentQuote;
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourceSeg#destroy
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourceSeg
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-source-seg&gt;</code>
         * 
         * @param {string} tempId Id of <code>&lt;evt-source-seg&gt;</code> to destroy
         */
        sourceSeg.destroy = function(tempId) {
            delete collection[tempId];
        };

        return sourceSeg;
    };
});