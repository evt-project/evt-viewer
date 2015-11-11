angular.module('evtviewer.interface')

.service('evtInterface', function(evtCommunication, config, $routeParams, xmlParser, evtSelect, evtBox, evtParser, parsedData) {
    var mainInterface = {};

        mainInterface.boot = function() {        
            evtCommunication.getData(config.dataUrl).then(function () {
                //if I have params to read in the route, I update on them
                if ( $routeParams.pageId !== undefined || $routeParams.docId !== undefined || $routeParams.witIds !== undefined) {
                    if ( $routeParams.pageId !== undefined ) {
                        mainInterface.updateCurrentPage($routeParams.pageId);
                    } 
                    if ( $routeParams.docId !== undefined ) {
                        mainInterface.updateCurrentDocument($routeParams.docId);
                    }
                    if ( $routeParams.witIds !== undefined ) {
                        mainInterface.updateWitness($routeParams.witIds, 'witnessText');
                    }
                } 
                //else I set the first page and the first document in the collection
                else {
                    var pages = parsedData.getPages(),
                        documents = parsedData.getDocuments(),
                        firstPage,
                        firstDoc;
                    if (pages.length > 0) {
                        firstPage = pages.list[pages[0]].value || undefined;
                    }
                    if (documents.length > 0) {
                        firstDoc = documents.list[documents[0]].value || undefined;
                    }
                    mainInterface.updateParams(firstPage, firstDoc);
                }
            });
        };

        mainInterface.getCurrentPage = function(){
            var pageSelector = evtSelect.getById('page');
            if ( pageSelector !== undefined ){
                return pageSelector.optionSelected;
            }
        };

        mainInterface.getCurrentDocument = function() {
            var docSelector = evtSelect.getById('document');
            if ( docSelector !== undefined ){
                return docSelector.optionSelected;
            } else {
                var documents = parsedData.getDocuments();
                if (documents.length > 0) {
                    return documents.list[documents[0]];
                }
            }
        };

        mainInterface.updateCurrentPage = function(pageId) {
            console.log('#evtInterface#', 'updating current page setting it to ' + pageId);
            var option = { },
                pageSelector = { },
                mainTextBox = { },
                mainImageBox = { },
                text,
                img;
                
            option = parsedData.getPage(pageId);
            
            if ( option !== undefined ) {
                // Updating page Selected
                pageSelector = evtSelect.getById('page');
                // TODO check defined
                if ( pageSelector !== undefined ) {
                    pageSelector.optionSelected = option;
                    pageSelector.callback(option);
                }
            }
            
            text = parsedData.getPageText(pageId);
            img = parsedData.getPageImage(pageId);

            // Updating mainText Box content
            mainTextBox = evtBox.getById('mainText');
            if ( mainTextBox !== undefined ) {
                if ( text !== undefined ) {
                    mainTextBox.updateContent(text.diplomatic);
                } else {
                    mainTextBox.updateContent('Testo non disponibile.');
                }
            }
            
            // Updating mainImage Box content
            mainImageBox = evtBox.getById('mainImage');
            if ( mainImageBox !== undefined ) {
                if ( img !== undefined ) {
                    mainImageBox.updateContent('<img src="'+img.url+'" />');
                } else {
                    mainImageBox.updateContent('Si è verificato un errore.');
                }
            }
        };

        mainInterface.updateCurrentDocument = function(docId) {
            console.log('#evtInterface#', 'updating current text setting it to '+docId);
            var option = { },
                docSelector = { };

            option = parsedData.getDocument(docId);
            
            if ( option !== undefined ) {
                // Updating page Selected
                docSelector = evtSelect.getById('document');
                // TODO check defined
                if ( docSelector !== undefined ) {
                    docSelector.optionSelected = option;
                    docSelector.callback(option);
                }
            }    
        };

        mainInterface.updateWitness = function(sigla, boxId) {
            console.log('#evtInterface#', 'updating current witness setting it to '+sigla);
            var witness = { },
                witSelector = { },
                textBox = { },
                currentDoc,
                content;

            witness = parsedData.getWitness(sigla);
            
            if ( witness !== undefined ) {
                // Updating page Selected
                witSelector = evtSelect.getById('witnesses');
                // TODO check defined
                if ( witSelector !== undefined ) {
                    witSelector.optionSelected = witness;
                    witSelector.callback(witness);
                }
            } 
            sigla = sigla.replace(/#/g, '');
            if ( witness !== undefined ) {
                content = witness.content;
            }
            if (content === undefined) {
                currentDoc = mainInterface.getCurrentDocument();
                if (currentDoc !== undefined) {
                    content = evtParser.parseWitnessText(xmlParser.parse(currentDoc.content), sigla);
                }    
            }
            textBox = evtBox.getById(boxId);
            if ( content !== undefined ) {
                textBox.updateContent(content.innerHTML);
            } else {
                textBox.updateContent('Testo non disponibile.');
            }
        };

        mainInterface.updateParams = function(pageId, docId, witIds) {
            console.log('#evtInterface#', 'updating params [Page: ' + pageId + ' | Text: ' + docId+' | Witnesses: '+witIds+']');
            
            if ( pageId !== undefined ) {
                mainInterface.updateCurrentPage(pageId);
            }

            if ( docId !== undefined ) {
                mainInterface.updateCurrentDocument(docId);
            }

            if (witIds !== undefined) {
                var witnesses = witIds.split('#').filter(function(el) {return el.length !== 0;});
                // for (var i = 0; i < witnesses.length; i++) {
                    mainInterface.updateWitness(witnesses[witnesses.length-1], 'witnessText');
                // }
            }
        };
    return mainInterface;
});