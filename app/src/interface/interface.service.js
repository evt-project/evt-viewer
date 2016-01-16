angular.module('evtviewer.interface')

.service('evtInterface', function(evtCommunication, config, $routeParams, $location, xmlParser, evtParser, parsedData) {    
    var mainInterface = {};

        var state = {
            currentView      : {},
            currentDoc       : undefined,
            currentPage      : undefined,
            currentWits      : {},
            currentWitsPages : {},
            currentEdition   : undefined
        };

        mainInterface.boot = function() {    
            evtCommunication.getData(config.dataUrl).then(function () {
                mainInterface.updateParams($routeParams);
            });
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
            $location.search({ws: state.currentWits.toString()});
        };
        
        mainInterface.removeWitness = function(wit) {
            console.log('removeWitness', wit);
            var witIndex = state.currentWits.indexOf(wit);
            console.log('removeWitness', witIndex);
            if (witIndex >= 0) {
                state.currentWits.splice(witIndex, 1);
            }
            console.log(state.currentWits);
            $location.search({ws: state.currentWits.toString()});
        };

        mainInterface.switchWitnesses = function(oldWit, newWit) {
            console.log('switchWitnesses', oldWit, newWit);
            // se il testimone che sto selezionando è già visualizzato 
            // lo scambio con il vecchio testimone
            var newWitOldIndex = state.currentWits.indexOf(newWit),
                oldWitOldIndex = state.currentWits.indexOf(oldWit);
            if (newWitOldIndex >= 0) {
                state.currentWits[newWitOldIndex] = oldWit;
            }
            state.currentWits[oldWitOldIndex] = newWit;
            $location.search({ws: state.currentWits.toString()});
        };
        mainInterface.updateWitnessesPage = function(witness, pageId) {
            console.log('updateWitnessesPage', witness, pageId);
        };

        mainInterface.updateCurrentWitnesses = function(witIds) {
            state.currentWits = witIds;
            $location.search({ws: state.currentWits.toString()});
        };

        mainInterface.updateParams = function(params) {
            var pageId,
                docId,
                witnesses,
                edition,
                witIds = [],
                search = {};

            // EDITION 
            if (params.viewMode !== undefined) {
                edition = params.viewMode;
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
            $location.search(search);
        };
    return mainInterface;
});