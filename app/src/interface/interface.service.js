angular.module('evtviewer.interface')

.service('evtInterface', function(evtCommunication, config, $routeParams, $location, xmlParser, evtParser, parsedData) {    
    var mainInterface = {};

        var state = {
            currentViewMode  : {},
            currentDoc       : undefined,
            currentPage      : undefined,
            currentWits      : {},
            currentWitsPages : {},
            currentEdition   : undefined
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
            }];

        mainInterface.boot = function() {    
            evtCommunication.getData(config.dataUrl).then(function () {
                if ($routeParams.viewMode !== undefined) {
                    mainInterface.updateCurrentViewMode($routeParams.viewMode);
                } else {
                    mainInterface.updateCurrentViewMode('critical');
                }
                mainInterface.updateParams($routeParams);
            });
        };

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

        mainInterface.updateCurrentViewMode = function(viewMode) {
            state.currentViewMode = viewMode;
            // window.history.pushState(null, null, '#/'+viewMode);
            mainInterface.updateUrl();
        };

        mainInterface.updateCurrentPage = function(pageId) {
            state.currentPage = pageId;
            // $location.search({p: state.currentPage});
        };

        mainInterface.updateCurrentDocument = function(docId) {
            state.currentDoc = docId;
            // $location.search({d: state.currentDoc});
        };

        mainInterface.updateCurrentEdition = function(edition){
            state.currentEdition = edition;
            // $location.search({ed: state.currentEdition});
        };

        mainInterface.addWitness = function(newWit) {
            state.currentWits.unshift(newWit);
            // $location.search({ws: state.currentWits.toString()});
            mainInterface.updateUrl();
        };
        
        mainInterface.removeWitness = function(wit) {
            var witIndex = state.currentWits.indexOf(wit);
            if (witIndex >= 0) {
                state.currentWits.splice(witIndex, 1);
            }
            // $location.search({ws: state.currentWits.toString()});
            mainInterface.updateUrl();
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
            // $location.search({ws: state.currentWits.toString()});
            mainInterface.updateUrl();
        };
        mainInterface.updateWitnessesPage = function(witness, pageId) {
            console.log('TODO updateWitnessesPage', witness, pageId);
        };

        mainInterface.updateCurrentWitnesses = function(witIds) {
            state.currentWits = witIds;
            // $location.search({ws: state.currentWits.toString()});
            mainInterface.updateUrl();
        };

        mainInterface.updateParams = function(params) {
            var pageId,
                docId,
                witnesses,
                edition,
                witIds = [],
                search = {};

            // EDITION 
            if (params.viewMode !== undefined && params.viewMode === 'critical') {
                edition = params.viewMode;
            } else {
                edition = 'diplomatic';
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
                    if (parsedData.getWitnessById(witnesses[w]) !== undefined){
                        witIds.push(witnesses[w]);
                    }
                }
            } else {
                witnesses = parsedData.getWitnesses();
                if (Array.isArray(witnesses)) {
                    witIds = witnesses;
                } else {
                    for (var i = 0; i < witnesses.length; i++ ) {
                        var currentOption = witnesses[witnesses[i]];
                        if (currentOption !== undefined) {
                            if ( currentOption.type === 'witness' ) {
                                witIds.push(currentOption.id);
                            } else {
                                for (var j = 0; j < currentOption.content.length; j++ ) {
                                    var currentSubOpt = currentOption.content[currentOption.content[j]];
                                    witIds.push(currentSubOpt.id);
                                }
                            }
                        }
                    }
                }
            }

            if ( edition !== undefined ) {
                mainInterface.updateCurrentEdition(edition);
                // TODO: Change route param for viewMode
            }

            if ( pageId !== undefined ) {
                mainInterface.updateCurrentPage(pageId);
                search.p = pageId;
            }

            if ( docId !== undefined ) {
                mainInterface.updateCurrentDocument(docId);
                search.d = docId;
            }

            if ( witIds !== undefined) {
                mainInterface.updateCurrentWitnesses(witIds);
                search.ws = witIds.toString();
            }

            // $location.search(search);
            mainInterface.updateUrl();
        };

        mainInterface.updateUrl = function() {
            var viewMode   = state.currentViewMode,
                searchPath = '';

                searchPath += state.currentDoc === undefined ? '' : (searchPath === '' ? '' : '&')+'d='+state.currentDoc;
                searchPath += state.currentPage === undefined ? '' : (searchPath === '' ? '' : '&')+'p='+state.currentPage;
                searchPath = state.currentEdition === undefined ? '' : (searchPath === '' ? '' : '&')+'e='+state.currentEdition;
                if (viewMode === 'critical') {
                    searchPath += state.currentWits === undefined || state.currentWits.length === 0 ? '' : (searchPath === '' ? '' : '&')+'ws='+state.currentWits.toString();
                }
                //TODO: Witnesses pages

            window.history.pushState(null, null, '#/'+viewMode+'?'+searchPath.substr(1));  
        };
    return mainInterface;
});