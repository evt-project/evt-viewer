angular.module('evtviewer.interface')

.service('evtInterface', function(evtCommunication, config, $routeParams, parsedData) {    
    var mainInterface = {};
        var state = {
            currentViewMode  : undefined,
            currentDoc       : undefined,
            currentPage      : undefined,
            currentWits      : undefined,
            currentWitsPages : undefined,
            currentEdition   : undefined,
        };

        var availableViewModes = [
            {
                label    : 'Image Text',
                icon     : 'imgTxt',
                viewMode : 'imgTxt'
            },
            {
                label    : 'Text Text',
                icon     : 'txtTxt',
                viewMode : 'txtTxt'
            },
            {
                label    : 'Critical',
                icon     : 'critical',
                viewMode : 'critical'
            },
            {
                label    : 'Collation',
                icon     : 'collation',
                viewMode : 'collation'
            }];

        mainInterface.boot = function() {  
            evtCommunication.getData(config.dataUrl).then(function () {
                mainInterface.updateParams($routeParams);
            });
        };

        /* ********** */
        /* PARAMS GET */
        /* ********** */
        mainInterface.getAvailableViewModes = function() {
            return availableViewModes;
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

        mainInterface.getCurrentWitnesses = function(){
            return state.currentWits;
        };

        mainInterface.getCurrentWitnessesPages = function(){
            return state.currentWitsPages;
        };

        mainInterface.getCurrentWitnessPage = function(wit){
            return state.currentWitsPages[wit];
        };

        mainInterface.existCriticalText = function(){
            return parsedData.getCriticalText(state.currentDoc) !== undefined;
        };
        /* ************** */
        /* PARAMS UPDATES */
        /* ************** */
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

        // WITNESS
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

            //TODO: Add scroll to new box added
        };
        mainInterface.addWitnessAtIndex = function(newWit, index) {
            state.currentWits.splice(index, 0, newWit);
        };
        mainInterface.removeWitness = function(wit) {
            var witIndex = state.currentWits.indexOf(wit);
            if (witIndex >= 0) {
                state.currentWits.splice(witIndex, 1);
                delete state.currentWitsPages[wit];
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
            state.currentWits[oldWitOldIndex] = newWit;
            //TODO: update box scroll to page on switching...
        };
        
        mainInterface.updateParams = function(params) {
            var viewMode = config.defaultViewMode,
                edition  = config.defaultEdition,
                pageId,
                docId,
                witnesses,
                witIds = [],
                witPageIds = {};

            // VIEW MODE 
            if (params.viewMode !== undefined) {
                viewMode = params.viewMode;
            }

            // EDITION 
            if (params.edition !== undefined ) {
                edition = params.edition;
            } else {
                if (viewMode === 'critical') {
                    edition = 'critical';
                }
            }

            // PAGE
            if ( params.pageId !== undefined ) {
                pageId = params.pageId;
            } else {
                var pages = parsedData.getPages();
                if (pages.length > 0) {
                    pageId = pages[pages[0]].value || undefined;
                }
            }

            // DOCUMENT
            if ( params.docId !== undefined ) {
                docId  = params.docId;
            } else {
                var documents = parsedData.getDocuments();
                if (documents.length > 0) {
                    docId = documents[documents[0]].value || undefined;
                }
            }
            // WITNESSES
            if (params.ws !== undefined) {
                witnesses = params.ws.split(',').filter(function(el) {return el.length !== 0;});
                for (var w in witnesses) {
                    var wit     = witnesses[w].split('@')[0],
                        witPage = witnesses[w].split('@')[1];
                    if (parsedData.getWitness(wit) !== undefined){
                        witIds.push(wit);
                        if (witPage !== undefined && parsedData.getPage(wit+'-'+witPage) !== undefined){
                            witPageIds[wit] = witPage;
                        }
                    }
                }
            } else if (viewMode === 'collation'){
                witIds = parsedData.getWitnessesList();
                if (witIds.length > config.maxWitsLoadTogether) {
                    witIds = witIds.slice(0, config.maxWitsLoadTogether);
                }
            }
            
            if ( viewMode !== undefined ) {
                mainInterface.updateCurrentViewMode(viewMode);
            }

            if ( edition !== undefined ) {
                mainInterface.updateCurrentEdition(edition);
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
            mainInterface.updateUrl();
        };

        mainInterface.updateUrl = function() {
            var viewMode   = state.currentViewMode,
                searchPath = '';

                searchPath += state.currentDoc === undefined ? '' : (searchPath === '' ? '' : '&')+'d='+state.currentDoc;
                searchPath += state.currentPage === undefined ? '' : (searchPath === '' ? '' : '&')+'p='+state.currentPage;
                searchPath = state.currentEdition === undefined ? '' : (searchPath === '' ? '' : '&')+'e='+state.currentEdition;
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
                
            if (viewMode !== undefined) {
                // window.history.pushState(null, null, '#/'+viewMode+'?'+searchPath.substr(1));
                window.location = '#/'+viewMode+'?'+searchPath.substr(1);
            }
        };
    return mainInterface;
});