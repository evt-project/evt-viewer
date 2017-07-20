/**
 * @ngdoc service
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
 * @description 
 * # evtSourcesApparatusEntry
 * TODO: Add description and comments for every method
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

        sourceEntry.getById = function(currentId) {
            if (collection[currentId] !== undefined) {
                return collection[currentId];
            }
        };

        sourceEntry.getList = function() {
            return list;
        };

        sourceEntry.setCurrentSourcesEntry = function(quoteId) {
            if (evtInterface.getCurrentQuote !== quoteId) {
                evtInterface.updateState('currentQuote', quoteId);
            }
            currentSourcesEntry = quoteId;
        };

        sourceEntry.getCurrentSourcesEntry = function() {
            return currentSourcesEntry;
        };

        sourceEntry.mouseOutAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.mouseOut();
            });
        };

        sourceEntry.mouseOverByQuoteId = function(quoteId) {
            angular.forEach(collection, function(currentEntry) {
                if (currentEntry.quoteId === quoteId) {
                    currentEntry.mouseOver();
                } else {
                    currentEntry.mouseOut();
                }
            });
        };

        sourceEntry.unselectAll = function() {
            angular.forEach(collection, function(currentEntry) {
                currentEntry.unselect();
            });
        };

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

        sourceEntry.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return sourceEntry;
    };
});