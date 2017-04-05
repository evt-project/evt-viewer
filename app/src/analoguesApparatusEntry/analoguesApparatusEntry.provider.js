angular.module('evtviewer.analoguesApparatusEntry')

.provider('evtAnaloguesApparatusEntry', function() {
    
    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    }

    this.$get = function(parsedData, $log, evtAnaloguesApparatus) {
        var analoguesAppEntry = {},
            collection     = {},
            list           = [],
            idx            = 0;
        
        analoguesAppEntry.build = function (scope) {
            var currentId = idx++,
                entryId = scope.analogueId || undefined,
                scopeWit = scope.scopeWit || '';
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var scopeHelper = {};

            var content,
                header,
                sources,
                firstSubContentOpened = '',
                _activeSource,
                src_list = {
                    _indexes: []
                },
                tabs = {
                    _indexes: []
                };

            var analogueEntry = parsedData.getAnalogue(scope.analogueId);

            if (analogueEntry !== undefined) {

                //Content of the apparatus entry
                content = evtAnaloguesApparatus.getContent(analogueEntry, scopeWit);

                //Apparatus header
                header = content.header;

                //Array of sources objects
                sources = content.sources;
                sources.length = content.sources.length;

                //Adding information to the src_list
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
                if (analogueEntry._xmlSource !== '') {
                    var xml = content._xmlSource;
                }

                if (tabs._indexes.length > 0 && defaults.firstSubContentOpened !== '') {
                    if (tabs._indexes.indexOf(defaults.firstSubContentOpened) < 0) {
                        firstSubContentOpened = tabs._indexes[0];
                    } else {
                        firstSubContentOpened = defaults.firstSubContentOpened;
                    }
                }

            }

            if (sources !== undefined && sources[0].id !== undefined) {
                _activeSource = sources[0].id
            } else {
                _activeSource = undefined;
            }

            scopeHelper = {
                uid              : currentId,
                header           : header,
                xml              : xml,
                sources          : sources,
                src_list         : src_list,
                _activeSource    : _activeSource,
                _overSource       : '',
                tabs             : tabs,
                _subContentOpened: firstSubContentOpened,
                over              : false,
                selected          : false,
            }

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        }

        analoguesAppEntry.destroy = function(tempId) {
            delete collection[tempId];
        };

        return analoguesAppEntry;
    };

});