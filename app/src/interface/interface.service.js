angular.module('evtviewer.interface')

.service('evtInterface', function($rootScope, $timeout, evtCommunication, evtCriticalApparatusParser, evtCriticalParser, evtPinnedElements, evtCriticalApparatusEntry, evtAnaloguesParser, config, $routeParams, parsedData, evtReading, $q) {
    var mainInterface = {};
        var state = {
            currentViewMode  : undefined,
            currentDoc       : undefined,
            currentPage      : undefined,
            currentWits      : undefined,
            currentWitsPages : undefined,
            currentEdition   : undefined,
            currentAppEntry  : undefined,
            currentHighlightedZone: undefined,
            isLoading        : true,
            isPinnedAppBoardOpened : false,
            secondaryContent : '',
			dialog : {
				home : ''
			},
            /*ADDED BY CM*/
            isApparatusBoxOpen : true,
            currentApparatus   : undefined,
            currentQuote       : undefined,
            currentAnalogue    : undefined,
            currentSource      : undefined,
            currentSourceText  : undefined,
            currentVersions    : undefined,
            currentVersionEntry: undefined,
            currentVersion     : undefined
        };

        var properties = {
            indexTitle         : '',
            logoUrl            : '',
            enableXMLdownload  : false,
            availableViewModes : [ ],
            availableWitnesses : [ ],
            witnessSelector    : false,
            namedEntitiesLists : false,
            availableSourcesTexts : [ ],
            isSourceLoading    : false,
            parsedSourcesTexts : [ ],
            availableVersions  : [ ],
            versionSelector    : false
        };

        var tools = {

        };

        mainInterface.boot = function() {  
            evtCommunication.getExternalConfig(config.configUrl).then(function(){
                properties.indexTitle         = config.indexTitle;
                properties.logoUrl            = config.logoUrl;
                properties.enableXMLdownload  = config.enableXMLdownload;
                properties.availableViewModes = config.availableViewModes;
                
                //TODO: object containing all the external files in globaldefault
                
                // Parse the external Sources file, if defined (@author: CM)
                if (config.sourcesUrl !== '') {
                        evtCommunication.getExternalData(config.sourcesUrl);
                    }
                // Parse the external Analogues file, if defined (@author: CM)
                if (config.analoguesUrl !== '') {
                        evtCommunication.getExternalData(config.analoguesUrl);
                }

                evtCommunication.getData(config.dataUrl).then(function () {
                    // Remove Collation View Mode if Witnesses List Empty
                    for (var i = 0, totViews = properties.availableViewModes.length; i < totViews; i++) {
                        var viewModeName = properties.availableViewModes[i].viewMode;
                        if (viewModeName === 'collation' && parsedData.getWitnessesList().length === 0) {
                            properties.availableViewModes[i].visible = false;
                        }
                        if (viewModeName === 'versions' && mainInterface.getAllVersionsNumber() < 2) {
                            properties.availableViewModes[i].visible = false;
                        }
                        if (viewModeName === 'srcTxt' && (!parsedData.getSources()._indexes.availableTexts || parsedData.getSources()._indexes.availableTexts.length === 0)) {
                            properties.availableViewModes[i].visible = false;   
                        }
                    }

                    // Remove Named Entities Lists button if Named Entities Lists Collection is Empty
                    properties.namedEntitiesLists = parsedData.getNamedEntitiesCollection()._indexes.length > 0;

                    if (config.availableEditionLevel) {
                        for (var e = 0; e < config.availableEditionLevel.length; e++) {
                            var edition = config.availableEditionLevel[e];
                            if (edition.visible) {
                                parsedData.addEdition(edition);    
                            }
                        }
                    }

                    mainInterface.updateParams($routeParams);

                    var promises = [];
                    
                    var currentDocFirstLoad = parsedData.getDocument(state.currentDoc);
                    if (currentDocFirstLoad !== undefined){
                        
                        // Parse critical entries
                        if (config.loadCriticalEntriesImmediately){
                            promises.push(evtCriticalApparatusParser.parseCriticalEntries(currentDocFirstLoad.content).promise);
                        }

                        // Parse the versions entries
                        if (config.versions.length > 1) {
                            promises.push(evtCriticalApparatusParser.parseVersionEntries(currentDocFirstLoad.content).promise);
                        }

                        // Parse critical text
                        if ((config.editionType === 'critical' || config.editionType === 'multiple') && parsedData.isCriticalEditionAvailable()) {
                            if (config.versions.length > 0 && config.versions[0] !== undefined) {
                                promises.push(evtCriticalParser.parseCriticalText(currentDocFirstLoad.content, state.currentDoc, config.versions[0]).promise);
                            } else {
                                promises.push(evtCriticalParser.parseCriticalText(currentDocFirstLoad.content, state.currentDoc).promise);
                            }
                        }
                        
                        $q.all(promises).then(function() {
                            // Update current app entry
                            if (state.currentAppEntry !== undefined && 
                                parsedData.getCriticalEntryById(state.currentAppEntry) === undefined) {
                                mainInterface.updateCurrentAppEntry('');
                            }
                            
                            /** Temp | TODO: add to updateParams? **/
                            // Prepare the sources texts available and the source text to show as default
                            // in the src-Txt view
                            var sourcesTexts = parsedData.getSources()._indexes.availableTexts;
                            if (Object.keys(sourcesTexts).length !== 0) {
                                for (var i in sourcesTexts) {
                                    properties.availableSourcesTexts.push(sourcesTexts[i].id);
                                }
                                mainInterface.updateCurrentSourceText(properties.availableSourcesTexts[0]);
                            }

                            /** Temp | TODO: add to updateParams? **/
                            // Prepare version to show as default in the versions view if there
                            // are only two versions of the text, and available versions
                            state.currentVersions = [];
                            if (config.versions.length === 2) {
                                state.currentVersions.push(config.versions[1]);
                            } else {
                                for (var v = 1; v < config.versions.length; v++) {
                                    properties.availableVersions.push(config.versions[v]);
                                }
                            }
                            
                            mainInterface.updateUrl();
                            
                            var quotesList = parsedData.getQuotes()._indexes.encodingStructure || [],
                                quotesInBox = !config.showInlineSources && quotesList.length > 0
                                analoguesList = parsedData.getAnalogues()._indexes.encodingStructure || [],
                                analoguesInBox = !config.showInlineAnalogues && analoguesList.length > 0;
                            state.isApparatusBoxOpen = (!config.showInlineCriticalApparatus || quotesInBox || analoguesInBox);

                            $rootScope.$applyAsync(state.isLoading = false);

                            // Update Pinned entries
                            $timeout(function() {
                                evtPinnedElements.getElementsFromCookies();
                            }, 10);
                        });
                    }
                });
            });
        };

        /* ********** */
        /* PARAMS GET */
        /* ********** */
		
		mainInterface.setTabContainerPanel = function(arr){
			state.dialog.tabContainerPanel = arr;
		};
		
		mainInterface.getTabContainerPanel = function(){
			return state.dialog.tabContainerPanel;
		};
		
		mainInterface.setHomePanel = function(string){
			state.dialog.home = string;
		};
		
		mainInterface.getHomePanel = function(){
			return state.dialog.home;
		};
		
        mainInterface.isLoading = function() {
            return state.isLoading;
        };
        
        mainInterface.isToolAvailable = function(toolName){
            return config[toolName];
        };
        mainInterface.getToolState = function(toolName) {
            return (tools[toolName] ? tools[toolName].status : undefined);
        };

        mainInterface.getProperties = function(){
            return properties;
        };

        mainInterface.getProperty = function(name){
            return properties[name];
        };

        mainInterface.getAvailableViewModes = function() {
            return properties.availableViewModes;
        };

        mainInterface.getCurrentViewMode = function(){
            return state.currentViewMode;
        };

        mainInterface.getCurrentPage = function(){
            return state.currentPage;
        };

        mainInterface.getCurrentDocument = function() {
            return state.currentDoc;
        };

        mainInterface.getCurrentEdition = function(){
            return state.currentEdition;
        };

        mainInterface.getCurrentHighlightZone = function() {
            return state.currentHighlightedZone;
        };

        mainInterface.getAvailableWitnesses = function() {
            return properties.availableWitnesses;
        };

        mainInterface.getCurrentWitnesses = function(){
            return state.currentWits;
        };

        mainInterface.getCurrentWitnessesPages = function(){
            return state.currentWitsPages;
        };

        mainInterface.getCurrentWitnessPage = function(wit){
            return state.currentWitsPages[wit];
        };

        mainInterface.getCurrentAppEntry = function(){
            return state.currentAppEntry;
        };

        mainInterface.existCriticalText = function(){
            return parsedData.getCriticalText(state.currentDoc) !== undefined;
        };

        mainInterface.isPinnedAppBoardOpened = function() {
            return state.isPinnedAppBoardOpened;
        };

        mainInterface.getSecondaryContentOpened = function(){
            return state.secondaryContent;
        };

        mainInterface.isCriticalApparatusInline = function() {
            return config.showInlineCriticalApparatus || mainInterface.getCurrentViewMode() !== 'readingTxt';
        };

		mainInterface.isSourcesInline = function() {
            return config.showInlineSources || mainInterface.getCurrentViewMode() !== 'readingTxt';
        };

        mainInterface.isAnaloguesInline = function() {
            return config.showInlineAnalogues || mainInterface.getCurrentViewMode() !== 'readingTxt';
        };
        /* ************** */
        /* PARAMS UPDATES */
        /* ************** */
        mainInterface.setLoading = function(state) {
            state.isLoading = state;
        };

        mainInterface.togglePinnedAppBoardOpened = function() {
            state.isPinnedAppBoardOpened = !state.isPinnedAppBoardOpened;
        };
        
        mainInterface.setToolState = function(toolName, status) {
            if (!tools[toolName]) {
                tools[toolName] = {};
            }
            tools[toolName].status = status;
        };

        mainInterface.updateProperty = function(property, value){
            properties[property] = value;
        };

        mainInterface.updateSecondaryContentOpened = function(secondaryContent){
            state.secondaryContent = secondaryContent;
        };

        
        mainInterface.updateCurrentViewMode = function(viewMode) {
            state.currentViewMode = viewMode;
        };

        mainInterface.updateCurrentPage = function(pageId) {
            state.currentPage = pageId;
        };

        mainInterface.updateCurrentDocument = function(docId) {
            state.currentDoc = docId;
        };

        mainInterface.updateCurrentEdition = function(edition){
            state.currentEdition = edition;
        };

        mainInterface.updateCurrentHighlightZone = function(zone) {
            var currentZone = state.currentHighlightedZone;
            if ( !currentZone || !zone || !(currentZone.id === zone.id && currentZone.name === zone.name) ) {
                state.currentHighlightedZone = zone;
            }
        };

        mainInterface.updateCurrentAppEntry = function(appId){
            state.currentAppEntry = appId;
        };

        /*************/
        /*Added by CM*/
        /*************/

        //ApparatusBoxOpen
        mainInterface.toggleApparatusBoxOpen = function() {
            state.isApparatusBoxOpen = !state.isApparatusBoxOpen;
        };

        mainInterface.isApparatusBoxOpen = function() {
            return state.isApparatusBoxOpen;
        };
        
        //currentApparatus
        mainInterface.getCurrentApparatus = function() {
            return state.currentApparatus;
        };

        mainInterface.updateCurrentApparatus = function(apparatus) {
            state.currentApparatus = apparatus;
        };

        //Quote
        mainInterface.getCurrentQuote = function() {
            return state.currentQuote;
        };

        mainInterface.updateCurrentQuote = function(quoteId) {
            state.currentQuote = quoteId;
        };

        //Analogue
        mainInterface.getCurrentAnalogue = function() {
            return state.currentAnalogue;
        };

        mainInterface.updateCurrentAnalogue = function(analogueId) {
            state.currentAnalogue = analogueId;
        };

        //Source
        mainInterface.getCurrentSource = function() {
            return state.currentSource;
        };

        mainInterface.updateCurrentSource = function(sourceId) {
            state.currentSource = sourceId;
        };

        //Available Sources Texts
        mainInterface.getAvailableSourcesTexts = function() {
            return properties.availableSourcesTexts;
        };

        //Current source text
        mainInterface.getCurrentSourceText = function() {
            return state.currentSourceText;
        };

        mainInterface.updateCurrentSourceText = function(sourceId) {
            var source = parsedData.getSource(sourceId),
                isTextAvailable = source !== undefined && source._textAvailable;
            if (isTextAvailable) {
                var isTextParsed = (Object.keys(parsedData.getSource(sourceId).text).length > 0);
                if (!isTextParsed) {
                    properties.isSourceLoading = !properties.isSourceLoading;
                    evtCommunication.getSourceTextFile(config.sourcesTextsUrl+sourceId+'.xml', sourceId).then(function() {
                        properties.isSourceLoading = !properties.isSourceLoading;
                        properties.parsedSourcesTexts.push(sourceId);
                    });
                }
            }
            state.currentSourceText = sourceId;
        };

        //Method to check if the source has been loaded, returns a boolean
        mainInterface.isSourceLoading = function() {
            return properties.isSourceLoading;
        };
        
        //Method to get the list of the parsed sources texts
        mainInterface.getParsedSourcesTexts = function() {
            return properties.parsedSourcesTexts;
        };

        /************/
        /* VERSIONS */
        /************/

        // Method to get the array of the available versions
        mainInterface.getAvailableVersions = function() {
            return properties.availableVersions;
        };

        // Method to remove a version from the available versions list
        // @version --> id of the version that has to be removed
        // returns void
        mainInterface.removeAvailableVersion = function(version) {
            var index = properties.availableVersions.indexOf(version);
            if (index !== undefined) {
                properties.availableVersions.splice(index, 1);
            }
        };

        mainInterface.addAvailableVersion = function(version) {
            var index = properties.availableVersions.indexOf(version);
            if (index === -1) {
                properties.availableVersions.push(version);
            }
        };

        // Method to add a version box in the interface
        // @version --> id of the version to add
        // @index --> index of the position, if undefined the version is added at the end of the array
        mainInterface.addVersion = function(version, index) {
            if (index === undefined) {
                state.currentVersions.push(version);
            } else {
                state.currentVersions.splice(index, 0, version);
            }
            mainInterface.removeAvailableVersion(version);
        };

        // Method to remove a vesion box from the interface
        // @version --> id of the version to remove
        mainInterface.removeVersion = function(version) {
            var index = state.currentVersions.indexOf(version);
            if (index >= 0) {
                state.currentVersions.splice(index, 1);
            }
            if (properties.availableVersions.indexOf(version) < 0) {
                properties.availableVersions.push(version);
            }
        };

        // Method to change the version viewed inside of a version box
        // @oldVer --> the old version to change
        // @newVer --> the new version to view
        mainInterface.switchVersions = function(oldVer, newVer) {
            var newVerOldIndex = state.currentVersions.indexOf(newVer),
                oldVerOldIndex = state.currentVersions.indexOf(oldVer);
            if (newVerOldIndex >= 0) {
                state.currentVersions[newVerOldIndex] = oldVer;
            } else {
                mainInterface.addAvailableVersion(oldVer);
            }
            state.currentVersions[oldVerOldIndex] = newVer;
            mainInterface.removeAvailableVersion(newVer);            
        };

        // Method to get how many different versions have been encoded by the editor
        mainInterface.getAllVersionsNumber = function() {
            return config.versions.length;
        };

        mainInterface.getCurrentVersions = function(){
            return state.currentVersions;
        };

        mainInterface.getCurrentVersionEntry = function() {
            return state.currentVersionEntry;
        };

        mainInterface.updateCurrentVersionEntry = function(appId) {
            if (appId !== undefined) {
                state.currentVersionEntry = appId;
            }
        };

        mainInterface.getCurrentVersion = function() {
            return state.currentVersion;
        };

        mainInterface.updateCurrentVersion = function(ver) {
            if (ver !== undefined && config.versions.indexOf(ver) !== -1) {
                state.currentVersion = ver;
            }
        };

        /** End of addition **/

        // WITNESS
        mainInterface.removeAvailableWitness = function(witness) {
            var index = properties.availableWitnesses.indexOf(witness);
            if (index !== undefined){
                properties.availableWitnesses.splice(index, 1);
            }
        };
        mainInterface.updateWitnessesPage = function(witness, pageId) {
            state.currentWitsPages[witness] = pageId;
        };
        mainInterface.updateCurrentWitnesses = function(witIds) {
            state.currentWits = witIds;
        };
        mainInterface.updateCurrentWitnessesPages = function(witPages) {
            state.currentWitsPages = witPages;
        };
        mainInterface.addWitness = function(newWit) {
            //TODO: Decide where to add the new witness: either before or after the others
            // if (mainInterface.existCriticalText()) {
            //     state.currentWits.unshift(newWit);
            // } else {
                state.currentWits.push(newWit);
            // }
            mainInterface.removeAvailableWitness(newWit);
            //TODO: Add scroll to new box added
        };
        mainInterface.addWitnessAtIndex = function(newWit, index) {
            state.currentWits.splice(index, 0, newWit);
            mainInterface.removeAvailableWitness(newWit);
        };
        mainInterface.removeWitness = function(wit) {
            var witIndex = state.currentWits.indexOf(wit);
            if (witIndex >= 0) {
                state.currentWits.splice(witIndex, 1);
                delete state.currentWitsPages[wit];
            }
            if (properties.availableWitnesses.indexOf(wit) < 0) {
                properties.availableWitnesses.push(wit);
            }
        };
        mainInterface.switchWitnesses = function(oldWit, newWit) {
            // se il testimone che sto selezionando è già visualizzato 
            // lo scambio con il vecchio testimone
            var newWitOldIndex = state.currentWits.indexOf(newWit),
                oldWitOldIndex = state.currentWits.indexOf(oldWit);
            if (newWitOldIndex >= 0) {
                state.currentWits[newWitOldIndex] = oldWit;
            }
            if (oldWitOldIndex >= 0) {
                state.currentWits[oldWitOldIndex] = newWit;
            }
            //TODO: update box scroll to page on switching...
        };

        mainInterface.resetCurrentWitnesses = function() {
            state.currentWits = [];
        };

        mainInterface.updateAvailableWitnessesByVersion = function(scopeVer) {
            var scopeVerWits = parsedData.getVersionEntries()._indexes.versionWitMap[scopeVer];
            var currentWits = [],
                availableWitnesses = [];
            if (scopeVerWits !== undefined && scopeVerWits.length > 0) {
                // Remove from current wits those that are not in current version
                for (var i = 0; i < state.currentWits.length; i++) {
                    if (scopeVerWits.indexOf(state.currentWits[i]) >= 0) {
                        currentWits.push(state.currentWits[i]);
                    }
                }
                state.currentWits = currentWits;
                // Set available witnesses depending on those in current version that are not selected yet
                for (var j = 0; j < scopeVerWits.length; j++) {
                    if (currentWits.indexOf(scopeVerWits[j]) < 0) {
                        availableWitnesses.push(scopeVerWits[j]);
                    }
                }
                properties.availableWitnesses = availableWitnesses;
            } else if (scopeVer === config.versions[0]) {
                var allWits = parsedData.getWitnessesList();
                // Remove from current wits those that are not in current version
                for (var i = 0; i < state.currentWits.length; i++) {
                    if (allWits.indexOf(state.currentWits[i]) >= 0) {
                        currentWits.push(state.currentWits[i]);
                    }
                }
                state.currentWits = currentWits;
                // Set available witnesses depending on those in current version that are not selected yet
                for (var h = 0; h < allWits.length; h++) {
                    if (currentWits.indexOf(allWits[h]) < 0) {
                        availableWitness.push(allWits[h]);
                    }
                }
                properties.availableWitnesses = availableWitnesses;
            }
            mainInterface.updateUrl();
        };
        
        // app entry
        mainInterface.updateCurrentAppEntry = function(appEntryId) {
            state.currentAppEntry = appEntryId;
        };

        mainInterface.isViewModeAvailable = function(viewMode) {
            for (var i = 0, totViews = properties.availableViewModes.length; i < totViews; i++) {
                if (properties.availableViewModes[i].viewMode === viewMode) {
                    return properties.availableViewModes[i].visible;
                }
            }
        };

        mainInterface.updateParams = function(params) {
            var viewMode = config.defaultViewMode,
                edition  = config.defaultEdition,
                pageId,
                docId,
                witnesses,
                witIds = [],
                witPageIds = {},
                appId,
                quoteId,
                analogueId,
                sourceId,
                apparatusId;

            //TODO: aggiungere q(citazione), s(fonte), an(passo parallelo) e ap(apparato)

            // VIEW MODE 
            if (params.viewMode !== undefined) {
                // Check if view mode is available
                if (mainInterface.isViewModeAvailable(params.viewMode)) {
                    viewMode = params.viewMode;
                } 
            }

            // EDITION 
            var availableEditionLevel = parsedData.getEditions(); 
            if (params.e !== undefined ) {
                if (parsedData.getEdition(params.e)) {
                    edition = params.e;
                } else {
                    if (availableEditionLevel && availableEditionLevel.length > 0) {
                        edition = availableEditionLevel[0].value;
                    }
                }
            } else {
                if (parsedData.getEdition(edition)) {
                    if (viewMode === 'readingTxt' && edition === 'critical' && parsedData.isCriticalEditionAvailable()) {
                        if (parsedData.getEdition('critical')) {
                            edition = 'critical';
                        } else {
                            edition = availableEditionLevel[0].value;
                        }
                    }
                } else {
                    if (availableEditionLevel && availableEditionLevel.length > 0) {
                        edition = availableEditionLevel[0].value;
                    }
                }
            }

            // PAGE
            if ( params.p !== undefined ) {
                pageId = params.p;
            } else {
                var pages = parsedData.getPages();
                if (pages.length > 0) {
                    pageId = pages[pages[0]].value || undefined;
                }
            }

            // DOCUMENT
            if ( params.d !== undefined && parsedData.getDocument(params.d) !== undefined ) {
                docId  = params.d;
            } else {
                var documents = parsedData.getDocuments();
                if (documents._indexes.length > 0) {
                    docId = documents[documents._indexes[0]].value || undefined;
                }
            }
            // WITNESSES
            var totWits;
            if (params.ws !== undefined) {
                witnesses = params.ws.split(',').filter(function(el) {return el.length !== 0;});
                totWits = parsedData.getWitnessesList();
                properties.availableWitnesses = totWits.slice(0, totWits.length);
                for (var w in witnesses) {
                    var wit     = witnesses[w].split('@')[0],
                        witPage = witnesses[w].split('@')[1];
                    if (parsedData.getWitness(wit) !== undefined){
                        witIds.push(wit);
                        mainInterface.removeAvailableWitness(wit);
                        if (witPage !== undefined && parsedData.getPage(wit+'-'+witPage) !== undefined){
                            witPageIds[wit] = witPage;
                        }
                    }
                }
            } else {
                if (viewMode === 'collation'){
                    // Check if there are multiple versions of the text
                    if (config.versions.length > 1) {
                        witIds = parsedData.getVersionEntries()._indexes.versionWitMap[config.versions[0]];
                    } else {
                        witIds = parsedData.getWitnessesList();
                        if (witIds !== undefined && witIds.length > config.maxWitsLoadTogether) {
                            properties.availableWitnesses = witIds.slice(config.maxWitsLoadTogether);
                            witIds = witIds.slice(0, config.maxWitsLoadTogether);
                        } else {
                            properties.availableWitnesses = [];
                        }
                    }                    
                } else {
                    if (config.versions.length > 1) {
                        // Check if the main version of the text refers to some particular witnesses
                        var mainVerWits = parsedData.getVersionEntries()._indexes.versionWitMap[config.versions[0]];
                        if (mainVerWits!== undefined && mainVerWits.length > 0) {
                            properties.availableWitnesses = mainVerWits.slice(0, mainVerWits.length);
                        }
                    } else {
                        totWits = parsedData.getWitnessesList();
                        properties.availableWitnesses = totWits.slice(0, totWits.length);
                    }
                }
            }
            // APP ENTRY
            if ( params.app !== undefined ) {
                appId  = params.app;
            }

            if ( viewMode !== undefined ) {
                mainInterface.updateCurrentViewMode(viewMode);
            }

            if ( edition !== undefined ) {
                mainInterface.updateCurrentEdition(edition);
            } else if (viewMode === 'collation'){
                mainInterface.updateCurrentEdition('critical');
            }

            if ( pageId !== undefined ) {
                mainInterface.updateCurrentPage(pageId);
            }

            if ( docId !== undefined ) {
                mainInterface.updateCurrentDocument(docId);
            }

            if ( witIds !== undefined) {
                mainInterface.updateCurrentWitnesses(witIds);
            }

            if ( witPageIds !== {}) {
                mainInterface.updateCurrentWitnessesPages(witPageIds);
            }

            if ( appId !== undefined) {
                mainInterface.updateCurrentAppEntry(appId);
                evtReading.setCurrentAppEntry(appId);
            }
            mainInterface.updateUrl();
        };

        mainInterface.updateUrl = function() {
            var viewMode   = state.currentViewMode,
                searchPath = '';

                searchPath += state.currentDoc === undefined ? '' : (searchPath === '' ? '' : '&')+'d='+state.currentDoc;
                searchPath += state.currentPage === undefined ? '' : (searchPath === '' ? '' : '&')+'p='+state.currentPage;
                searchPath += state.currentEdition === undefined ? '' : (searchPath === '' ? '' : '&')+'e='+state.currentEdition;
                if (viewMode === 'collation') {
                    if (state.currentWits !== undefined && state.currentWits.length > 0) {
                        if (searchPath !== '') {
                          searchPath += '&';  
                        }
                        searchPath += 'ws=';
                        for (var w in state.currentWits){
                            var wit = state.currentWits[w],
                                currentPage = mainInterface.getCurrentWitnessPage(wit);
                            searchPath += wit;
                            if (currentPage !== undefined){
                                searchPath += '@'+currentPage;
                            }
                            if (w < state.currentWits.length-1) {
                                searchPath += ',';
                            }
                        }
                    }
                }
                if (state.currentAppEntry !== undefined && state.currentAppEntry !== '') {
                    if (searchPath !== '') {
                      searchPath += '&';  
                    }
                    searchPath += 'app='+state.currentAppEntry;
                }
                
            if (viewMode !== undefined) {
                // window.history.pushState(null, null, '#/'+viewMode+'?'+searchPath.substr(1));
                window.location = '#/'+viewMode+'?'+searchPath;
            }
        };
    return mainInterface;
});