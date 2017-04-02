angular.module('evtviewer.sourcesApparatusEntry')

.provider('evtSourcesApparatusEntry', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }
    
    this.$get = function(parsedData, evtSourcesApparatus, $log, evtInterface) {
        var sourceEntry = {},
            collection  = {},
            list        = [],
            idx         = 0;
        
        sourceEntry.build = function(scope) {
            var currentId = idx++,
                entryId = scope.quoteId || undefined,
                scopeWit = scope.scopeWit || '';

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var scopeHelper = {},
                content,
                firstSubContentOpened = '',
                /*src_list will be used to dynamically change the tabs
                  and the contents depending on the  activeSource*/
                src_list = {
                    _indexes : []
                },
                tabs = {
                    _indexes: []
                };

            var quoteEntry = parsedData.getQuote(scope.quoteId);

            if (quoteEntry !== undefined) {
                
                //Content of the apparatus entry
                content = evtSourcesApparatus.getContent(quoteEntry, scopeWit);
                
                //Apparatus header
                var head = content.quote;
                
                //Array of sources objects
                var sources = content.sources;
                sources.length = content.sources.length;
                
                //Adding infromation to the src_list
                for (var i in sources) {
                    src_list._indexes.push(sources[i].id);
                    src_list[sources[i].id] = sources[i];
                    src_list[sources[i].id].tabs = {
                        _indexes: []
                    }
                    if (src_list[sources[i].id].text !== '') {
                        src_list[sources[i].id].tabs._indexes.push('text');
                        src_list[sources[i].id].tabs.text = {
                            label: 'Text'
                        }
                    }
                    if (src_list[sources[i].id].bibl !== '') {
                        src_list[sources[i].id].tabs._indexes.push('biblRef');
                        src_list[sources[i].id].tabs.biblRef = {
                            label: 'Bibliographic Reference'
                        }
                    }
                    //TO DO: More Info a partire dagli attributes di quote e di source
                    if (src_list[sources[i].id]._xmlSource !== '') {
                        src_list[sources[i].id].tabs._indexes.push('xmlSource');
                        src_list[sources[i].id].tabs.xmlSource = {
                            label: 'XML'
                        }
                    }
                }
                
                var currentTabs = src_list[sources[0].id].tabs;
                for (var j = 0; j < currentTabs._indexes.length; j++) {
                    var value = currentTabs._indexes[j];
                    tabs._indexes.push(currentTabs._indexes[j]);
                    tabs[value] = currentTabs[value];
                }

                //Adding the xmlSource tab and variable
                if (quoteEntry._xmlSource !== '') {
                    var xml = content._xmlSource;
                }

                if (tabs._indexes.length > 0 && defaults.firstSubContentOpened !== ''){
                    if (tabs._indexes.indexOf(defaults.firstSubContentOpened) < 0) {
                        firstSubContentOpened = tabs._indexes[0];
                    } else {
                        firstSubContentOpened = defaults.firstSubContentOpened;
                    }
                }

            }

            var selected = false;

            if (evtInterface.getCurrentQuote() === scope.quoteId) {
                selected = true;
            }

            scopeHelper = {
                uid               : currentId,
                head              : head,
                xml               : xml,
                sources           : sources,
                src_list          : src_list,
                _activeSource     : sources[0].id, /*By default the active Source is the first (and maybe only one) source inserted inside the sources array*/
                tabs              : tabs,
                _subContentOpened : firstSubContentOpened,
                over              : false,
                selected          : selected,
            }
            
            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });
            
            return collection[currentId];
        }

        sourceEntry.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        sourceEntry.getList = function() {
            return list;
        };

        sourceEntry.destroy = function(tempId) {
            delete collection[tempId];
        };
        
        return sourceEntry;
    };
});