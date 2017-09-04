/**
 * @ngdoc service
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
 * @description 
 * # evtSourcesApparatusEntry
 * This provider expands the scope of the
 * {@link evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry evtSourcesApparatusEntry} 
 * directive and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.sourcesApparatusEntry.evtSourcesApparatus
 * @requires evtviewer.interface.evtInterface
 *
 * @author CM
**/
angular.module('evtviewer.sourcesApparatusEntry')

.provider('evtSourcesApparatusEntry', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentSourcesEntry = '';
    
    this.$get = function(parsedData, evtSourcesApparatus, $log, evtInterface) {
        var sourceEntry = {},
            collection  = {},
            list        = [],
            idx         = 0;
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#build
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * <p>This method will extend the scope of 
         * {@link evtviewer.sourcesApparatusEntry.directive:evtSourcesApparatusEntry evtSourcesApparatusEntry} directive 
         * according to selected configurations and parsed data.</p>
         * <p>In particular it will decide which sub content tabs have to be shown and which have to hidden.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    uid,
                    quoteId,
                    head,
                    xml,
                    sources,
                    srcList,
                    _activeSource,
                    _overSource,
                    tabs,
                    _subContentOpened,
                    over,
                    selected,
                    currentViewMode
                };
            </pre>
         */
        sourceEntry.build = function(scope) {
            var currentId = idx++,
                entryId = scope.quoteId || undefined,
                scopeWit = scope.scopeWit || '';

            if (collection[currentId] !== undefined) {
                return;
            }

            var content,
                firstSubContentOpened = '',
                // srcList will be used to dynamically change the tabs
                // and the contents depending on the  activeSource
                srcList = {
                    _indexes : []
                },
                tabs = {
                    _indexes: []
                };

            var quoteEntry = parsedData.getQuote(scope.quoteId),
                head,
                sources,
                xml;

            if (quoteEntry !== undefined) {
                
                //Content of the apparatus entry
                content = evtSourcesApparatus.getContent(quoteEntry, scopeWit);
                
                //Apparatus header
                head = content.quote;
                
                //Array of sources objects
                sources = content.sources;
                sources.length = content.sources.length;
                
                //Adding infromation to the srcList
                for (var i in sources) {
                    srcList._indexes.push(sources[i].id);
                    srcList[sources[i].id] = sources[i];
                    srcList[sources[i].id].tabs = {
                        _indexes: []
                    };
                    if (srcList[sources[i].id].text !== '' || srcList[sources[i].id].url !== '') {
                        srcList[sources[i].id].tabs._indexes.push('text');
                        srcList[sources[i].id].tabs.text = {
                            label: 'SOURCES.TEXT'
                        };
                    }
                    if (srcList[sources[i].id].bibl !== '') {
                        srcList[sources[i].id].tabs._indexes.push('biblRef');
                        srcList[sources[i].id].tabs.biblRef = {
                            label: 'SOURCES.BIBLIOGRAPHIC_REFERENCE'
                        };
                    }
                    //TO DO: More Info a partire dagli attributes di quote e di source
                    if (srcList[sources[i].id]._xmlSource !== '') {
                        srcList[sources[i].id].tabs._indexes.push('xmlSource');
                        srcList[sources[i].id].tabs.xmlSource = {
                            label: 'SOURCES.XML'
                        };
                    }
                }
                
                var currentTabs = sources && sources[0] && srcList[sources[0].id] ? srcList[sources[0].id].tabs : { _indexes: [] };
                for (var j = 0; j < currentTabs._indexes.length; j++) {
                    var value = currentTabs._indexes[j];
                    tabs._indexes.push(currentTabs._indexes[j]);
                    tabs[value] = currentTabs[value];
                }

                //Adding the xmlSource tab and variable
                if (quoteEntry._xmlSource !== '') {
                    xml = content._xmlSource;
                }

                if (tabs._indexes.length > 0 && defaults.firstSubContentOpened !== ''){
                    if (tabs._indexes.indexOf(defaults.firstSubContentOpened) < 0) {
                        firstSubContentOpened = tabs._indexes[0];
                    } else {
                        firstSubContentOpened = defaults.firstSubContentOpened;
                    }
                }

            }

            var scopeHelper = {
                uid               : currentId,
                quoteId           : scope.quoteId,
                head              : head,
                xml               : xml,
                sources           : sources,
                srcList          : srcList,
                _activeSource     : sources[0] ? sources[0].id : undefined, //By default the active Source is the first (and maybe only one) source inserted inside the sources array
                _overSource       : '',
                tabs              : tabs,
                _subContentOpened : firstSubContentOpened,
                over              : false,
                selected          : false,
                currentViewMode   : evtInterface.getState('currentViewMode')
            };
            
            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });
            
            return collection[currentId];
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#getById
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Get the reference to <code>&lt;evt-sources-apparatus-entry&gt;</code>
         * with given id.
         * 
         * @param {string} currentId id of sources apparatus entry to handle
         *
         * @returns {Object} object representing the reference to <code>&lt;evt-sources-apparatus-entry&gt;</code>
         * with given id
         */
        sourceEntry.getById = function(currentId) {
            if (collection[currentId] !== undefined) {
                return collection[currentId];
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#getList
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Get the list of all the instance of <code>&lt;evt-sources-apparatus-entry&gt;</code>.
         *
         * @returns {array} array of ids of all the instance of <code>&lt;evt-sources-apparatus-entry&gt;</code>.
         */
        sourceEntry.getList = function() {
            return list;
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#setCurrentSourcesEntry
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Set current sources apparatus entry.
         * @param {string} quoteId Id of sources apparatus entry to be set as current one
         */
        sourceEntry.setCurrentSourcesEntry = function(quoteId) {
            if (evtInterface.getCurrentQuote !== quoteId) {
                evtInterface.updateState('currentQuote', quoteId);
            }
            currentSourcesEntry = quoteId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#getCurrentSourcesEntry
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Retrieve current sources apparatus entry.
         * @returns {string} id of current sources apparatus entry
         */
        sourceEntry.getCurrentSourcesEntry = function() {
            return currentSourcesEntry;
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#mouseOutAll
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Simulate a "*mouseout*" event on all instances of <code>&lt;evt-sources-apparatus-entry&gt;</code>
         */
        sourceEntry.mouseOutAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.mouseOut();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#mouseOverByQuoteId
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Simulate a "*mouseover*" event on all instances of <code>&lt;evt-sources-apparatus-entry&gt;</code> 
         * with given entry id 
         * @param {string} quoteId Id of sources apparatus entry to handle
         */
        sourceEntry.mouseOverByQuoteId = function(quoteId) {
            angular.forEach(collection, function(currentEntry) {
                if (currentEntry.quoteId === quoteId) {
                    currentEntry.mouseOver();
                } else {
                    currentEntry.mouseOut();
                }
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#unselectAll
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Unselect all instances of <code>&lt;evt-sources-apparatus-entry&gt;</code>
         */
        sourceEntry.unselectAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.unselect();
            });
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#unselectAll
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * <p>Select all <code>&lt;evt-sources-apparatus-entry&gt;</code>s connected to a given critical entry.</p>
         * <p>Set given <code>quoteId</code> as current one.</p>
         * @param {string} quoteId Id of sources apparatus entry to handle
         */
        sourceEntry.selectById = function(quoteId) {
            angular.forEach(collection, function(currentEntry) {
                if (currentEntry.quoteId === quoteId) {
                    currentEntry.setSelected();
                } else {
                    currentEntry.unselect();
                    currentEntry.closeSubContent();
                }
            });  
            sourceEntry.setCurrentSourcesEntry(quoteId);
        };
        /**
         * @ngdoc method
         * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry#destroy
         * @methodOf evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-sources-apparatus-entry&gt;</code>
         * 
         * @param {string} tempId Id of <code>&lt;evt-sources-apparatus-entry&gt;</code> to destroy
         */
        sourceEntry.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return sourceEntry;
    };
});