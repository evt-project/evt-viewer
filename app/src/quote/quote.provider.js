/**
 * @ngdoc service
 * @module evtviewer.quote
 * @name evtviewer.quote.evtQuote
 * @description 
 * # evtQuote
 * This provider expands the scope of the
 * {@link evtviewer.quote.directive:evtQuote evtQuote} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.dataHandler.evtSourcesApparatus
**/
angular.module('evtviewer.quote')

.provider('evtQuote', function(){

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentSourcesEntry = '';

    this.$get = function(parsedData, evtInterface, evtSourcesApparatus) {
        var quote = {},
            collection = {},
            list = [],
            idx = 0;
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#build
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.quote.directive:evtQuote evtQuote} directive 
         * according to selected configurations.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
                    scopeWit,
                    quoteId,
                    scopeViewMode,
                    type,
                    
                    over,
                    apparatus: {
                        opened,
                        content,
                        _loaded,
                        inline
                    },
                    selected,
                    openTriggerEvent,
                    defaults
                };
            </pre>
         */
        quote.build = function(scope) {
            var currentId = idx++,
            entryId = scope.quoteId || undefined;

            if (collection[currentId] !== undefined) {
                return;
            }

            var scopeHelper = {
                uid: currentId,
                scopeWit : scope.scopeWit || '',
                quoteId : entryId,
                scopeViewMode : evtInterface.getState('currentViewMode'),
                type : scope.type || '',
                
                over             : false,
                apparatus        : {
                    opened  : false,
                    content : {},
                    _loaded : false,
                    inline  : scope.inlineApparatus
                },
                selected         : entryId === quote.getCurrentSourcesEntry(),
                openTriggerEvent : angular.copy(defaults.openTriggerEvent),
                defaults         : angular.copy(defaults)
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#getById
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Get the references of the instances of <code>&lt;evt-quote&gt;</code> connected 
         * to a particular sources apparatus entry.
         * 
         * @param {string} currentId id of sources apparatus entry to handle
         *
         * @returns {array} array of references of <code>&lt;evt-quote&gt;</code>s connected 
         * to given sources apparatus entry 
         */
        quote.getById = function(currentId) {
            if (collection[currentId] !== undefined) {
                return collection[currentId];
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#getList
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-quote&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-quote&gt;</code>.
         */
        quote.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#setCurrentSourcesEntry
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Set current sources apparatus entry.
         * @param {string} quoteId id of quote to be set as current one
         */
        quote.setCurrentSourcesEntry = function(quoteId) {
            if (evtInterface.getState('currentQuote')  !== quoteId) {
                evtInterface.updateState('currentQuote', quoteId);
            }
            currentSourcesEntry = quoteId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#getCurrentSourcesEntry
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Retrieve current sources apparatus entry.
         * @returns {string} id of current sources apparatus entry
         */
        quote.getCurrentSourcesEntry = function(){
            return currentSourcesEntry;
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#mouseOutAll
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-quote&gt;</code>
         */
        quote.mouseOutAll = function() {
            angular.forEach(collection, function(currentQuote) {
                currentQuote.mouseOut();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#mouseOverByQuoteId
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-quote&gt;</code> 
         * connected to a given sources apparatus entry
         * @param {string} quoteId id of quote to handle
         */
        quote.mouseOverByQuoteId = function(quoteId) {
            angular.forEach(collection, function(currentQuote) {
                if (currentQuote.quoteId === quoteId) {
                    currentQuote.mouseOver();
                } else {
                    currentQuote.mouseOut();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#unselectAll
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Unselect all instances of <code>&lt;evt-quote&gt;</code>
         */
        quote.unselectAll = function() {
            angular.forEach(collection, function(currentQuote) {
                currentQuote.unselect();
            });
            evtInterface.updateState('currentQuote', '');
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#closeAllApparatus
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * <p>Close sources apparatus for all <code>&lt;evt-quote&gt;</code>s.</p>
         * <p>If a <code>skipId</code> is given, do not peform this action on
         * <code>&lt;evt-quote&gt;</code> with given id</p>
         * @param {string=} skipId id of quote to be skipped
         */
        quote.closeAllApparatus = function(skipId) {
            angular.forEach(collection, function(currentQuote) {
                if (skipId === undefined) {
                    currentQuote.closeApparatus();
                } else if (currentQuote.uid !== skipId) {
                    currentQuote.closeApparatus();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#selectById
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * <p>Select all <code>&lt;evt-quote&gt;</code>s connected to a given sources apparatus entry.</p>
         * <p>Set given <code>quoteId</code> as current one 
         * ({@link evtviewer.quote.evtQuote#setCurrentAppEntry setCurrentAppEntry()}).</p>
         * @param {string} quoteId id of quote to handle
         */
        quote.selectById = function(quoteId) {
            angular.forEach(collection, function(currentQuote) {
                if (currentQuote.quoteId === quoteId) {
                    currentQuote.setSelected();
                } else {
                    currentQuote.unselect();
                }
            });
            evtInterface.updateState('currentQuote', quoteId);  
            quote.setCurrentSourcesEntry(quoteId);
        };
        /**
         * @ngdoc method
         * @name evtviewer.quote.evtQuote#destroy
         * @methodOf evtviewer.quote.evtQuote
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-quote&gt;</code>.
         * 
         * @param {string} tempId id of <code>&lt;evt-quote&gt;</code> to destroy
         */
        quote.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return quote;
    };
});