/****************/
/*AUTHOR --> @CM*/
/****************/
angular.module('evtviewer.dataHandler')

.service('evtAnaloguesParser', function($q, evtParser, parsedData, evtCriticalApparatusParser, evtSourcesParser, config) {
    //TODO
    //Forse dovrai spostare tutti i parser degli elementi critici in un unico file :(
    var parser = {}

    var apparatusEntryDef = '<app>',
        quoteDef          = '<quote>',
        analoguesUrl      = config.analoguesUrl || '',
        analogueDef       = '<seg>,<ref[type=parallelPassage]>';

    var match = '(',
        anAnalogueDef = analogueDef.split(",");

    for (var i = 0; i < anAnalogueDef.length; i++) {
        if (anAnalogueDef[i].indexOf("[") < 0) {
            match += anAnalogueDef[i].replace(/[<>]/g, '');
        } else {
            var bracketOpen = anAnalogueDef[i].indexOf("[");
            match += anAnalogueDef[i].substring(1, bracketOpen);
            var bracketClose = anAnalogueDef[i].indexOf("]");
            var equal = anAnalogueDef[i].indexOf("=");
            match += '.*?'+anAnalogueDef[i].substring(bracketOpen + 1, equal);
            match += '.*?';
            match += anAnalogueDef[i].substring(equal + 1, bracketClose);
        }
        if (i < anAnalogueDef.length -1) {
            match+='|';
        } else if ( i = anAnalogueDef.length - 1) {
            match+=')';
        }
    }

    var sRegExpInput = new RegExp(match, 'ig');
    
    /*********************/
    /*parseAnalogues(doc)*/
    /*********************/
    /*Looks for all the passages in the critical text that may have an analogueDef
    inside of them or outside. Calls parseAnalogue for every analogue element found.
    Then, if there is no external document for the analogue, it calls handleAnalogue.*/
    parser.parseAnalogues = function(doc) {
        var deferred = $q.defer(),
            currentDocument = angular.element(doc);

            console.log(match);

        angular.forEach(currentDocument.find(analogueDef.replace(/[<>]/g, '')),
        function(element){
            var isInBody = evtParser.isNestedInElem(element, 'body');
            if (isInBody){
                var analogue = parser.parseAnalogue(element);
                //Qui aggiungere controllo su sourceId e souceRefId
                //In questo modo non si aggiunge inutilmente analogue senza fonti
                if (analogue._indexes.sourceId.length > 0
                    || analogue._indexes.sourceRefId.length > 0) {
                    parsedData.addAnalogue(analogue);
                }
            }
        });

        if (parsedData.getAnalogues()._indexes.refId.length > 0) {
            if (analoguesUrl === '') {
                if ( currentDocument.find('text group text').length > 0 ) {
                    defDocElement = 'text group text';
                } else if ( currentDocument.find('text').length > 0 ) {
                    defDocElement = 'text';
                } else if ( currentDocument.find('div[subtype="edition_text"]').length > 0 ) {
                    defDocElement = 'div[subtype="edition_text"]';
                }
                angular.forEach(currentDocument.find(defDocElement),
                    function(element){
                        parser.handleAnalogue(element);
                });
            }
        }

        //Qui servirebbe per eliminare le analogue apparentemente con riferimento,
        //ma che in realtà hanno un id che non corrisponde ad alcun elemento nel doc.
        parser.updateAnalogues();

        console.log('## Analogues ##', parsedData.getAnalogues());

        deferred.resolve('success');
        return deferred;
    }

    /**********************/
    /*handleAnalogue(elem)*/
    /**********************/
    /*Looks for the element (inside the current document or an outside document)
    that has an xml:id corresponding to one of those in the array of he collection.
    If so, it parses that element with the function parseSource(source), then
    pushes the result in the sources array of all the analogue entries that have
    him. If an analogue has no sourceId or sourceRefId, it is deleted by the updateAnalogues()*/
    parser.handleAnalogue = function(element) {
        //TO DO
    }

    /*******************/
    /*updateAnalogues()*/
    /*******************/
    /*Deletes all the analogues that havo no sourceId or sourceRefId*/
    parser.updateAnalogues = function() {
        //TODO
    }

    /****************************/
    /*parseAnalogueContent(elem)*/
    /****************************/
    /** */
    /** */
    var parseAnalogueContent = function(elem) {
        var contentEl = {
            tagName : elem.tagName,
            type : 'analogueContent',
            attributes: [],
            content : [],
            _xmlSource: elem.outerHTML
        };
        
        if (elem.attributes) {
            for (var i = 0; i < elem.attributes.length; i++) {
                var attrib = elem.attributes[i];
                if (attrib.specified) {
                    contentEl.attributes[attrib.name] = attrib.value;
                }
            }
        }

        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    contentEl.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {
                if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtSourcesParser.parseQuote(child));
                } else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtCriticalApparatusParser.handleAppEntry(child));
                } else if (sRegExpInput.test(child.outerHTML)) {
                    console.log("CE L'HAI FATTA!");
                    contentEl.content.push(parser.parseAnalogue(child));
                }/*
                TODO: REG EXPR o ANGULAR.ELEMENT.FIND
                else if (analogueDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtAnaloguesParser.parseAnalogue(child));
                } else if (child.tagName === 'witDetail') {
                    contentEl.content.push(evtCriticalApparatusParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    contentEl.content.push(evtParser.parseNote(child));
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(child.children[i].cloneNode(true));
                        parseAnalogueContent(child.children[i])
                    }
                } else {
                    contentEl.content.push(parseAnalogueContent(child));
                }
            }
        });

        return contentEl;
    }
    
    /**********************/
    /*parseAnalogue(entry)*/
    /**********************/
    /*Saves the references to external bibliographic reference
    inside the analoguesCollecgtion array and the analogue parsed inside of the collection*/
    parser.parseAnalogue = function(entry) {
        var analogue = {
            id : '',
            type : 'analogue',
            attributes : [],
            content : [],
            sources : [],
            _indexes : {
                sourceId : [],
                sourceRefId : [],
                subAnalogues : []
            },
            _subAnalogue : false,
            _xmlSource : entry.outerHTML || ''
        }

        //Parsing the id or creating it with the evtParser.xpath method
        var id = entry.getAttribute('xml:id') || evtParser.xpath(entry).substr(1);
        analogue.id = id;

        //Parsing the attributes
        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.specified) {                    
                    analogue.attributes[attrib.name] = attrib.value;                 
                }
                /*If there is a source or corresp or ref attribute, its values
                are saved inside the sourceRefId array*/
                if (attrib.name === 'source') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    analogue._indexes.sourceRefId = values;
                }
                if (attrib.name === 'corresp') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    analogue._indexes.sourceRefId = values;
                }
                if (attrib.name === 'ref') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    analogue._indexes.sourceRefId = values;
                }
            }
        }

        //Nesting of the current analogueDef element in another analogueDef element
        //reg expr needed! or other solution :/

        //Parsing the contents
        angular.forEach(entry.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    analogue.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {

                var subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');
                //Array of TEI-elements for bibliographic references
                var biblEl = ['bibl', 'biblStruct', 'biblFull', 'msDesc'];
                //Array of TEI-elements for pointers
                var linkEl = ['ptr', 'ref', 'link'];

                //Parsing bibliographic references
                //If there is a listBibl...
                if (child.tagName === 'listBibl') {
                    //...parse the childNodes that are a link or a ptr
                    for (var i = 0; i < child.children.length; i++) {
                        if (biblEl.indexOf(child.children[i].tagName) >= 0) {
                            var bibl = parser.parseSource(child.children[i], entry);
                            //...then add their id to the sourceId array.
                            analogue._indexes.sourceId.push(bibl.id);
                            analogue.content.push(bibl);
                        } else {
                            analogue.content.push(parseAnalogueContent(child.children[i]));
                        }
                    }
                } // If there is a bibliographic element, parse it as a Source.
                  else if (biblEl.indexOf(child.tagName) >= 0) {
                    var bib = parser.parseSource(child, entry);
                    //Then add its id to the sourceId array.
                    analogue._indexes.sourceId.push(bib.id);
                    analogue.content.push(bib);
                } //If there is a link or pointer or ref...
                  else if (linkEl.indexOf(child.tagName) >= 0) {
                    analogue.content.push(parseAnalogueContent(child));
                    if (child.hasAttribute('target')) {
                        var attrib = child.getAttribute('target');
                        var values = attrib.replace(/#/g, '').split(" ");
                        for (var i = 0; i < values.length; i++) {
                            //...add its target values to the sourceRefId array.
                            analogue._indexes.sourceRefId.push(values[i]);
                        }
                    }
                } //If there is a linkGrp...
                  else if (child.tagName === 'linkGrp') {
                      //...parse the children...
                    for (var i = 0; i < child.children.length; i++) {
                        if (linkEl.indexOf(child.children[i].tagName) >= 0) {
                            analogue.content.push(parseAnalogueContent(child.children[i]));
                            if (child.children[i].hasAttribute('target')) {
                                var attr = child.children[i].getAttribute('target');
                                var val = attr.replace(/#/g, '').split(" ");
                                for (var i = 0; i < val.length; i++) {
                                    //...and add their target values to the SourceRefId array.
                                    analogue._indexes.sourceRefId.push(val[i]);
                                }
                            }
                        }
                    }
                } //If there is an apparatus Entry, parse it with handleAppEntry.
                  else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    analogue.content.push(evtCriticalApparatusParser.handleAppEntry(child));
                } //If there is a nested quote, parse it recursively.
                  else if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    analogue.content.push(evtSourcesParser.parseQuote(child));
                } else if (sRegExpInput.test(childXml)) {
                    console.log("CE L'HAI FATTA!", angular.element(child), childXml);
                    analogue.content.push(parser.parseAnalogue(child));
                }/*
                TODO: REG EXPR o angular.element.find
                else if (analogueDef.indexOf('<'+child.tagName+'>') >= 0) {
                    content.push(evtAnaloguesParser.parseAnalogue(child));
                } else if (child.tagName === 'witDetail') {
                    content.push(evtCriticalApparatusParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    analogue.content.push(evtParser.parseNote(child));
                } 
                  else {
                    analogue.content.push(parseAnalogueContent(child));
                }
            }
        });

        return analogue;
    }

    /*parseSource(source)*/
    /*Parses the source element in order to then push it inside the corresponding
    analogue array*/
    parser.parseSource = function(entry) {
        var source = {
            id : '',
            attributes : [],
            bibl : [],
            text : [],
            url : [],
            _xmlSource : entry.outerHTML || ''
        }

        return source;
    }
    
    /*************************** */
    /*parseExternalAnalogues(doc)*/
    /*************************** */
    /** */
    /** */
    parser.parseExternalAnalogues = function(doc) {
        //TODO: risolvere problema di childNodes[0]
        var deferred = $q.defer();
        for (var i = 0; i < doc.childNodes.length; i++) {
            parser.handleAnalogue(doc.childNodes[i]);
        }
        console.log('## External Analogues Received ##', parsedData.getAnalogues());

        parser.updateAnalogues();
        
        deferred.resolve('success');
        return deferred;
    }

    return parser;
});