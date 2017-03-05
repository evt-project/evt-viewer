angular.module('evtviewer.box')

.provider('evtBox', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log, $q, $timeout, config, parsedData, evtParser, evtCriticalParser, xmlParser, evtInterface, evtImageTextLinking) {
        var box        = {},
            collection = {},
            list       = [],
            idx        = 0;

        var _console = $log.getInstance('box');
        //
        // Control function
        //
        function updateState(key, value) {
            // _console.log('vm - updating state '+key+': '+value);
            var vm        = this;
            vm.state[key] = value;
            return vm.state[key];
        }

        function getState(key) {
            var vm = this;
            return vm.state[key];
        }

        function destroy() {
            var tempId = this.uid;
            // this.$destroy();
            delete collection[tempId];
            // _console.log('vm - destroy ' + tempId);
        }

        // Critical edition control
        function toggleCriticalAppFilter(filter, value){
            var vm      = this,
                filters = vm.state.filters;
            if (filters[filter] === undefined ) {
                filters[filter] = {
                    name       : filter,
                    any        : true,
                    totActive  : 0,
                    values     : {
                                    length : 0
                                }
                };
            }
            if ( filters[filter].totActive === undefined ) {
                filters[filter].totActive = 0;
            }

            var values = filters[filter].values;
            if (values[value] === undefined) {
                values[values.length] = value;
                values[value] = {
                                    name   : value,
                                    active : true,
                                    color  : parsedData.getCriticalEntriesFilterColor(filter, value)
                                };
                values.length++;
            } else {
                values[value].active = !values[value].active;
            }

            if (values[value].active) {
                filters[filter].totActive++;
                filters._totActive++;
            } else {
                filters[filter].totActive--;
                filters._totActive--;
            }

            filters[filter].any = (filters[filter].totActive === 0);
        }

        function clearFilter(filter){
            var vm = this;
            vm.state.filters[filter].values    = { length: 0 };
            vm.state.filters._totActive       -= vm.state.filters[filter].totActive;
            vm.state.filters[filter].totActive = 0;
        }


        function toggleTopBox() {
            var vm = this;
            if (vm.state.topBoxOpened !== undefined) {
                vm.state.topBoxOpened = !vm.state.topBoxOpened;
            }
        }

        function toggleFilterBox() {
            var vm = this;
            if (vm.state.filterBox !== undefined) {
                vm.state.filterBox = !vm.state.filterBox;
            }
        }

        function updateTopBoxContent(newContent) {
            var vm = this;
            vm.topBoxContent = newContent;
        }

        function fontSize() {
            var vm = this;
            return 'font-size:'+vm.state.fontSize+'%' || '';
        }

        function fontSizeIncrease() {
            var vm = this;
            vm.state.fontSize = parseInt(vm.state.fontSize)+4;
        }

        function fontSizeDecrease() {
            var vm = this;
            vm.state.fontSize = parseInt(vm.state.fontSize)-4;

        }

        function fontSizeReset() {
            var vm = this;
            vm.state.fontSize = '100';
        }

        function toggleBtnGroup(groupState){
            groupState = !groupState;
        }

        function isITLactive() { //TEMP
            return evtInterface.getToolState('ITL') === 'active';
        }

        //
        // Box builder
        //
        box.build = function(scope, vm) {
            var currentId   = vm.id || idx++,
                currentType = vm.type || 'default',
                topMenuList = {
                    selectors : [],
                    buttons   : []
                },
                bottomMenuList = {
                    selectors : [],
                    buttons   : []
                },
                content,
                topBoxContent = '<span class="alert-msg">No info available</span>',
                state      = {
                    topBoxOpened  : false,
                    fontSizeBtn   : false,
                    fontSize      : '100',
                    topBoxContent : ''
                },
                appFilters = [],
                updateContent,
                isLoading = true;

            var genericTools = {
                fontSizeBtn   : [ {title: 'Reset font size', label: '', icon: 'font-size-reset', type: 'fontSizeReset'},
                                {title: 'Decrease font size', label: '', icon: 'font-size-minus', type: 'fontSizeDecrease'},
                                {title: 'Increase font size', label: '', icon: 'font-size-plus', type: 'fontSizeIncrease'}]
            };

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            // _console.log('vm - building box for ' + currentId);
            var newContent;
            switch (currentType) {
                case 'image':
                    topMenuList.selectors.push({id:'page_'+currentId, type: 'page', initValue: evtInterface.getCurrentPage() });

                    topMenuList.buttons.push({title:'Thumbnails', label: 'Thumbs', icon: 'thumbnails', type: 'thumbs' });
                    topMenuList.buttons.push({title: 'Image Text Linking', label: '', icon: 'itl', type: 'itl'});

                    updateContent = function(){
                        scope.vm.isLoading = true;
                        var currentPage = evtInterface.getCurrentPage(),
                            pageSource   = parsedData.getPage(currentPage).source || '';
                        pageSource = pageSource === '' ? 'data/images/'+currentPage+'.png' : pageSource;
                        scope.vm.content = '<img src="'+pageSource+'" alt="Image of page '+currentPage+' of '+evtInterface.getCurrentDocument()+'" onerror="this.setAttribute(\'src\', \'images/empty-image.jpg\')"/>';

                        // TEMP... TODO: creare direttiva per gestire le zone sull'immagine
                        var zonesHTML = '',
                            zones = parsedData.getZones();
                        for (var zoneId in zones._indexes) {
                            var zone = zones[zones._indexes[zoneId]];
                            if (zone) {
                                if ( zone.page === currentPage ) {
                                    zonesHTML += '<div class="zoneInImg" data-zone-id="'+zone.id+'" data-zone-name="'+zone.rendition+'"';
                                    if (zone.corresp && zone.corresp !== '') {
                                        var correspId = zone.corresp.replace('#', '');
                                        zonesHTML += ' data-corresp-id="'+ correspId +'"';
                                        if (zone.rendition === 'Line') {
                                            zonesHTML += ' data-line="'+ correspId +'"';
                                        } else if (zone.rendition === 'HotSpot') {
                                            zonesHTML += ' data-hs="'+ correspId +'"';
                                        }
                                    }
                                    zonesHTML += '>' + zone.id + ' (' + zone.lrx + ', '+ zone.lry + ') (' + zone.ulx + ', '+ zone.uly + ') </div>';
                                }
                            }
                        }
                        scope.vm.content += zonesHTML;
                        // =/ END TEMP
                        scope.vm.isLoading = false;
                    };
                    break;
                case 'text':
                    //TODO: Differentiate main text from second one
                    topMenuList.selectors.push({ id:'document_'+currentId, type: 'document', initValue: evtInterface.getCurrentDocument() });
                    if (!parsedData.isCriticalEditionAvailable()) {
                        topMenuList.selectors.push({ id:'page_'+currentId, type: 'page', initValue: evtInterface.getCurrentPage() },
                                                   { id:'editionLevel_'+currentId, type: 'edition', initValue: evtInterface.getCurrentEdition() });
                    } else {
                        topMenuList.buttons.push({title: 'Witnesses List', label: '', icon: 'witnesses', type: 'witList'});
                    }
                    appFilters = parsedData.getCriticalEntriesFiltersCollection();
                    if (appFilters.forLemmas > 0) {
                        topMenuList.buttons.push({title: 'Color key', label: '', icon: 'color-legend', type: 'colorLegend'});
                        bottomMenuList.buttons.push({title: 'Filters', label: 'Filters', icon: 'filters', type: 'toggleFilterApp', show: function(){ return vm.edition === 'critical'; }});
                        appFilters = appFilters.filters;
                    }
                    state.filters = {
                        _totActive : 0
                    };
                    state.filterBox = false;
                    state.docId   = evtInterface.getCurrentDocument();
                    if (config.toolHeatMap) {
                        bottomMenuList.buttons.push({title: 'Heat Map', label: 'Heat Map', icon: 'heatmap', type: 'heatmap', show: function(){ return vm.type === 'text' && vm.edition === 'critical'; }});
                    }
                    bottomMenuList.buttons.push({title: 'Change font size', label: '', icon: 'font-size', type: 'fontSizeTools', show: function(){ return true; }});

                    updateContent = function(){
                        scope.vm.isLoading = true;
                        var newDoc,
                            promises = [],
                            isITLon  = evtInterface.getToolState('ITL') === 'active',
                            errorMsg = '<span class="alert-msg alert-msg-error">There was an error in the parsing of the text. <br />Try a different browser or contact the developers.</span>',
                            noTextAvailableMsg = '<span class="alert-msg alert-msg-error">Text is not available.</span>';
                        if ( scope.vm.edition !== undefined && scope.vm.edition === 'critical') { // Critical edition
                            newDoc = parsedData.getCriticalText(scope.vm.state.docId);
                            if (newDoc === undefined) {
                                newDoc = parsedData.getDocument(scope.vm.state.docId);
                                try {
                                    promises.push(evtCriticalParser.parseCriticalText(newDoc.content, scope.vm.state.docId).promise);
                                    $q.all(promises).then(function(){
                                        scope.vm.content = parsedData.getCriticalText(scope.vm.state.docId) || noTextAvailableMsg;
                                        scope.vm.isLoading = false;
                                    });
                                }
                                catch(err) {
                                    newContent = errorMsg;
                                    scope.vm.isLoading = false;
                                }
                            } else {
                                scope.vm.content = newDoc || noTextAvailableMsg;
                                scope.vm.isLoading = false;
                            }
                        } else { // Other edition level
                            // parsedData.getDocument(scope.vm.state.docId).content
                            var currentPage = evtInterface.getCurrentPage(),
                                currentDoc  = evtInterface.getCurrentDocument(),
                                currentEdition = evtInterface.getCurrentEdition();
                            newDoc = parsedData.getPageText(currentPage, currentDoc, currentEdition);
                            if (newDoc === undefined) {
                                newDoc = parsedData.getPageText(currentPage, currentDoc, 'original');
                                try {
                                    promises.push(evtParser.parseTextForEditionLevel(currentPage, currentDoc, currentEdition, newDoc).promise);
                                    $q.all(promises).then(function(){
                                        scope.vm.content = parsedData.getPageText(currentPage, currentDoc, currentEdition) || noTextAvailableMsg;
                                        scope.vm.isLoading = false;
                                        if (isITLon) {
                                            $timeout(function(){
                                                evtImageTextLinking.prepareLines();
                                                evtImageTextLinking.prepareZoneInImgInteractions();
                                            });
                                        }
                                    });
                                }
                                catch(err) {
                                    newContent = errorMsg;
                                    scope.vm.isLoading = false;
                                }
                            } else {
                                scope.vm.content = newDoc || noTextAvailableMsg;
                                scope.vm.isLoading = false;
                                if (isITLon) {
                                    $timeout(function(){
                                        evtImageTextLinking.prepareLines();
                                        evtImageTextLinking.prepareZoneInImgInteractions();
                                    });
                                }
                            }
                            scope.vm.isLoading = false;
                        }
                    };
                    break;
                case 'witness':
                    var witPageId = vm.witPage !== undefined && vm.witPage !== '' ? vm.witness+'-'+vm.witPage : '';
                    topMenuList.selectors.push({id:'witnesses_'+currentId, type: 'witness', initValue: vm.witness },
                                               {id:'page_'+currentId, type: 'witness-page', initValue: witPageId });

                    topMenuList.buttons.push({title: 'Info', label: '', icon: 'info', type: 'toggleInfoWit' },
                                             {title: 'Remove Witness', label: '', icon: 'remove', type: 'removeWit' });

                    appFilters = parsedData.getCriticalEntriesFiltersCollection();
                    if (appFilters.forVariants > 0) {
                        bottomMenuList.buttons.push({title: 'Filters', label: 'Filters', icon: 'filters', type: 'toggleFilterApp', show: function(){return 'true';} });
                        appFilters = appFilters.filters;
                    }
                    state.filters = {
                        _totActive : 0
                    };
                    state.filterBox = false;

                    bottomMenuList.buttons.push({title: 'Change font size', label: '', icon: 'font-size', type: 'fontSizeTools', show: function(){ return true; }});
                    updateContent = function(){
                        scope.vm.isLoading = true;
                        var errorMsg           = '<span class="alert-msg alert-msg-error">There was an error in the parsing of the text. <br />Try a different browser or contact the developers.</span>',
                            noTextAvailableMsg = 'Text of witness '+vm.witness+' is not available.';

                        if ( vm.witness !== undefined ) {
                            // Main content
                            var currentDocId = evtInterface.getCurrentDocument(),
                                newContent = parsedData.getWitnessText(vm.witness, currentDocId) || undefined;
                            if ( newContent === undefined ) {
                                var documents  = parsedData.getDocuments(),
                                    currentDoc = '';
                                if (documents._indexes.length > 0) {
                                    currentDoc = documents[currentDocId];
                                }
                                if (currentDoc !== undefined) {
                                    try {
                                        var promises = [];
                                        promises.push(evtCriticalParser.parseWitnessText(currentDoc.content, currentDocId, vm.witness).promise);
                                        $q.all(promises).then(function(){
                                            scope.vm.content = parsedData.getWitnessText(vm.witness, currentDocId) || noTextAvailableMsg;
                                            scope.vm.isLoading = false;
                                        });
                                    }
                                    catch(err) {
                                        scope.vm.content = errorMsg;
                                        scope.vm.isLoading = false;
                                    }
                                } else {
                                    scope.vm.content = noTextAvailableMsg;
                                    scope.vm.isLoading = false;
                                }
                            } else {
                                scope.vm.content = newContent;
                                scope.vm.isLoading = false;
                            }
                        }
                    };
                    break;
                default:
                    isLoading = false;
                    if (currentType === 'pinnedBoard') {
                        topMenuList.buttons.push({title: 'Close Board', label: '', icon: 'remove', type: 'closePinned' });
                    } else {
                        topMenuList.buttons.push({title: 'Remove Box', label: '', icon: 'remove', type: 'removeBox' });
                    }
                    updateContent = function(newContent) {
                        scope.vm.content = newContent;
                    };
                    break;
            }

            scopeHelper = {
                // expansion
                uid                     : currentId,
                defaults                : angular.copy(defaults),

                // model
                topMenuList             : topMenuList,
                bottomMenuList          : bottomMenuList,
                content                 : content,
                topBoxContent           : topBoxContent,
                state                   : state,
                appFilters              : appFilters,
                isLoading               : isLoading,
                genericTools            : genericTools,

                // function
                updateContent           : updateContent,
                updateTopBoxContent     : updateTopBoxContent,
                updateState             : updateState,
                getState                : getState,
                destroy                 : destroy,
                toggleCriticalAppFilter : toggleCriticalAppFilter,
                toggleFilterBox         : toggleFilterBox,
                toggleTopBox            : toggleTopBox,
                clearFilter             : clearFilter,
                fontSize                : fontSize,
                fontSizeIncrease        : fontSizeIncrease,
                fontSizeDecrease        : fontSizeDecrease,
                fontSizeReset           : fontSizeReset,
                toggleBtnGroup          : toggleBtnGroup,

                isITLactive             : isITLactive //TEMP
            };

            collection[currentId] = angular.extend(vm, scopeHelper);
            list.push({
                id   : currentId,
                type : currentType
            });

            return collection[currentId];
        };


        //
        // Service function
        //
        box.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        box.getList = function() {
            return list;
        };

        box.getListByType = function(type) {
            var listType = [];
            for (var i in collection) {
                if (collection[i].type === type) {
                    listType.push(collection[i]);
                }
            }
            return listType;
        };

        box.getElementByValueOfParameter = function(parameter, value) {
            var element;
            for (var i in collection) {
                if (collection[i][parameter] === value) {
                    element = collection[i];
                }
            }
            return element;
        };

        box.alignScrollToApp = function(appId){
            for (var i in collection) {
                if (collection[i].scrollToAppEntry !== undefined){
                    collection[i].scrollToAppEntry(appId);
                }
            }
        };

        return box;
    };

});
