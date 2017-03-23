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
    
    //Creating the regular expression that will help finding nested analogueDef
    var match = '(',
        anAnalogueDef = analogueDef.split(",");

    for (var i = 0; i < anAnalogueDef.length; i++) {
        if (anAnalogueDef[i].indexOf("[") < 0) {
            match += anAnalogueDef[i].replace(/[<>]/g, '');
        } else {
            var bracketOpen = anAnalogueDef[i].indexOf("[");
            if(anAnalogueDef[i].substring(1, bracketOpen) !== "[") {
                match += anAnalogueDef[i].substring(1, bracketOpen)
            }
            match += '[^<>]*?';
            var bracketClose = anAnalogueDef[i].indexOf("]");
            var equal = anAnalogueDef[i].indexOf("=");
            match += anAnalogueDef[i].substring(bracketOpen + 1, equal);
            match += '\\s*?=\\s*?[\'\"]\\s*?';
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
    /***********************************************************************************/
    /*Looks for all the passages in the critical text that may have an analogueDef     */
    /*inside of them or outside. Calls parseAnalogue for every analogue element found. */
    /*Then, if there is no external document for the analogue, it calls handleAnalogue.*/
    /*Finally it calls updateAnalogues() to remove analogues that aren't correctly     */
    /*linked to a source.                                                              */
    /* @doc --> XML document to be parsed                                              */
    /***********************************************************************************/
    parser.parseAnalogues = function(doc) {
        var deferred = $q.defer(),
            currentDocument = angular.element(doc);

        //console.log(match);

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

        if (parsedData.getAnalogues()._refId._indexes.length > 0) {
            if (analoguesUrl === '' || analoguesUrl === undefined) {
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
    /*******************************************************************************************/
    /*Function that looks for the element (inside the current document or an external document)*/
    /*that has an xml:id attribute corresponding to one of the ids saved in the array of the   */
    /*collection. If so, it parses that element with the function parseSource(source), then    */
    /*pushes the result in the sources array of all the analogue entries that refer to that    */
    /*source.                                                                                  */
    /*@elem --> element to be parsed inside the document                                       */
    /*******************************************************************************************/
    parser.handleAnalogue = function(elem) {
        var ref = parsedData.getAnalogues()._refId;
        var indexes = parsedData.getAnalogues()._refId._indexes;
        //console.log('weila', ref)
        if (elem.nodeType === 3) {
            return;
        } else if (elem.nodeType === 1) {
            if (elem.attributes.length > 0) {
                for (var i = 0; i < elem.attributes.length; i++) {
                    if (elem.attributes[i].name === 'xml:id') {
                        var attr = elem.attributes[i].value;
                        if (indexes.indexOf(attr) >= 0) {
                            var source = parser.parseSource(elem);
                            for (var j = 0; j < ref[attr].length; j++) {
                                var analogue = parsedData.getAnalogue(ref[attr][j]);
                                analogue.sources.push(source);
                            }
                        }
                    }
                }
            } else if (elem.childNodes.length > 0) {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    parser.handleAnalogue(elem.childNodes[i]);
                }
            }
        }
    }

    /*******************/
    /*updateAnalogues()*/
    /*************************************************************/
    /*Deletes all the analogues that have an empty sources array.*/
    /*************************************************************/
    parser.updateAnalogues = function() {
        var analogues = parsedData.getAnalogues();
        console.log(analogues);
        var index = parsedData.getAnalogues()._indexes.encodingStructure;
        for (var i = 0; i < index.length; i++) {
            var analogue = parsedData.getAnalogue(index[i]);
            if (analogue.sources.length <= 0) {
                //delete analogues[index[i]];
            }
        }
    
    }

    /****************************/
    /*parseAnalogueContent(elem)*/
    /******************************************************************************/
    /*Creates a new object of type 'analogueContent' that is added to the analogue*/
    /*content array.                                                              */
    /* @elem --> element nested in an AnalogueDef that has to be parsed           */
    /**************************************************************************** */
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
                var subst = angular.element(child)["0"].innerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
                var childXml = angular.element(child)["0"].outerHTML.replace(subst, '');

                if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtSourcesParser.parseQuote(child));
                } else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtCriticalApparatusParser.handleAppEntry(child));
                } else if (sRegExpInput.test(childXml)) {
                    contentEl.content.push(parser.parseAnalogue(child));
                }/* else if (child.tagName === 'witDetail') {
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
    /*****************************************************************************************/
    /*Saves all the information about the parsed XML Element in an object of type 'analogue'.*/
    /*@entry --> XML element to be parsed                                                    */
    /*************************************************************************************** */
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
                            analogue.sources.push(bibl);
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
                    analogue.sources.push(bib);
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
                    analogue.content.push(parser.parseAnalogue(child));
                }/*else if (child.tagName === 'witDetail') {
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

    /******************* */
    /*parseSource(source)*/
    /*************************************************************************** */
    /*Parses the source element in order to then push it inside the corresponding*/
    /*analogue array                                                             */
    /* @source --> XML element to be parsed                                      */
    /*************************************************************************** */
    parser.parseSource = function(entry) {
        var source = {
            id : '',
            title : [],
            author : [],
            attributes : [],
            bibl : [],
            text : [],
            url : [],
            _xmlSource : entry.outerHTML || ''
        }

        //Parsing the attributes and creating source.id
        var id;
        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.specified) {
                    if (attrib.name === 'xml:id') {
                        id = attrib.value;
                    }
                    if (attrib.name === 'target' ||
                        attrib.name === 'source' ||
                        attrib.name === 'ref') {
                            var values = attrib.value.replace(/#/g, '').split(" ");
                            for (var i = 0; i < values.length; i++) {
                                url.push(values[i]);
                            }
                        }
                    source.attributes[attrib.name] = attrib.value;
                    source.attributes.length++;
                }
            }
        }
        if (id === undefined) {
            id = evtParser.xpath(entry).substr(1);
        }
        source.id = id;

        angular.forEach(entry.childNodes, function(child){
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    source.bibl.push(child.textContent.trim());
                }
            }
            else if (child.nodeType === 1) {
                //Array of TEI-elements for pointers
                var linkEl = ['ptr', 'ref', 'link'];

                if (entry.tagName === 'cit' && child.tagName === 'quote') {
                    var contentEl = parseSourceContent(child);
                    source.text.push(contentEl);
                } else if (linkEl.indexOf(child.tagName) >= 0) {
                    if (child.tagName === 'ref') {
                        source.bibl.push(parseSourceContent(child));
                    } else {
                        source.bibl.push(child);
                    }
                    if (child.hasAttribute('target')) {
                        var attrib = child.getAttribute('target');
                        var val = attrib.replace(/#/g, '').split(" ");
                        for (var i = 0; i < val.length; i++) {
                            //...add its target values to the url array.
                            source.url.push(val[i]);
                        }
                    }
                } //If there is a linkGrp...
                  else if (child.tagName === 'linkGrp') {
                      //...parse the children...
                    for (var i = 0; i < child.children.length; i++) {
                        if (linkEl.indexOf(child.children[i].tagName) >= 0) {
                            if (child.tagName === 'ref') {
                                source.bibl.push(parseSourceContent(child));
                            } else {
                                source.bibl.push(child.children[i]);
                            }
                            if (child.children[i].hasAttribute('target')) {
                                var attr = child.children[i].getAttribute('target');
                                var val = attr.replace(/#/g, '').split(" ");
                                for (var i = 0; i < val.length; i++) {
                                    //...and add their target values to the url array.
                                    source.url.push(val[i]);
                                }
                            }
                        }
                    }
                } else if (child.tagName === 'citedRange') {
                    if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
                        source.url.push(child.getAttribute('target'));
                    }
                } else {
                    childContent = parseSourceContent(child, entry)
                    if (childContent.tagName === 'author') {
                        source.author.push(childContent.content);
                    }
                    if (childContent.tagName === 'title') {
                        source.title = childContent.content;
                    }
                    source.bibl.push(childContent);
                    for (var i = 0; i < childContent.url.length; i++) {
                        source.url.push(childContent.url[i]);
                    }
                }
            }
        });

        return source;
    }

    /************************ */
    /*parseSourceContent(elem)*/
    /*******************************************************************/
    /* Function to parse the element contained inside a source element.*/
    /* @ elem --> element to be parsed                                 */
    /*******************************************************************/
    var parseSourceContent = function (elem){
        var contentEl = {
            tagName : elem.tagName,
            type : 'sourceContent',
            attributes: [],
            content : [],
            url: []
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
                if (child.tagName === 'citedRange') {
                    if (child.getAttribute('target') !== null && child.getAttribute('target') !== '') {
                        contentEl.url.push(child.getAttribute('target'));
                    }
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(parseSourceContent(child.children[i]));                        
                    }
                } else {
                    contentEl.content.push(parseSourceContent(child));
                }
            }
        });

        return contentEl;
    }

    /*************************** */
    /*parseExternalAnalogues(doc)*/
    /******************************************************************/
    /*Function that parses the external analogues document, by calling*/
    /*on each child node handleAnalogue(element)                      */
    /*@doc --> external XML document that contains the analogues      */
    /******************************************************************/
    parser.parseExternalAnalogues = function(doc) {
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