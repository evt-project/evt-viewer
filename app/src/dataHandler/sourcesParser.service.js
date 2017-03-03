angular.module('evtviewer.dataHandler')

angular.module('evtviewer.dataHandler')

.service('evtSourcesParser', function($q, parsedData, evtParser, evtCriticalParser, xmlParser, config) {
    var parser = {};

    var apparatusEntryDef = '<app>',
        quoteDef          = '<quote>';
    // Al momento ho usato solo questa variabile
    //Queste due le userò appena inizierò a parsare le fonti
    var sourceDef  = '<cit>',
        sourcesUrl = ''; // Parsing di più documenti

    /******** */
    /* QUOTES */
    /**********/

    /**************************/
    /*parseQuoteContent(child)*/
    /********************************************************************************/
    /*Supporting function that parses the content of a quotation inside the critical*/
    /*text or the text of a witness. If it finds a nested quote, an analogue, a note*/
    /*or a critical apparatus entry, it calls the corresponding functions. If the   */
    /*parsed element has children, the function calls itself recursively, otherwise */
    /*the parseXMLElement function is called and the result added to the content.   */
    /*@child --> content element to be parsed | @author --> CM                      */
    /****************************************************************************** */
    var parseQuoteContent = function(elem) {
        var contentEl = {
            tagName : elem.tagName,
            type : 'quoteContent',
            attributes: [],
            content : []
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
                    contentEl.content.push(parseQuote(child));
                } else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtCriticalParser.handleAppEntry(child));
                } /*else if (analogueDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtAnaloguesParser.parseAnalogue(child));
                } else if (child.tagName === 'witDetail') {
                    contentEl.content.push(evtCriticalParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    contentEl.content.push(evtParser.parseNote(child));
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(parseQuoteContent(child.children[i]));
                    }
                } else {
                    contentEl.content.push(parseQuoteContent(child));
                }
            }
        });

        /*if (child.children.length <= 0){
            contentEl.content.push(child.cloneNode(true));
        }
        else if (child.children.length > 0){
            for (var i =0; i <child.children.length; i++) {
                contentEl.content.push(parseQuoteContent(child.children[i]));
            }
        }*/
        return contentEl;
    }

    /* *************** */
    /* parseQuote(doc) */
    /* ****************************************************************** */
    /* Function to parse the content and the attributes of a single entry */
    /* of the sources apparatus inside of the critical text and save it   */
    /* in parsedData.                                                     */
    /* @entry-> the XML element that marks up the quotation of a source   */
    /* inside the text to be parsed                                       */
    /* @author: CM                                                        */
    /* ****************************************************************** */
    var parseQuote = function(entry){
        
        var quote = {
            id : '',
            attributes: [],
            content: [],
            _indexes: {
                sourceId: [],//array in cui salvo gli id delle entrate bibliografiche nell'elemento
                sourceRefId: [], //array in cui salvo gli id delle fonti cui l'entrata fa riferimento
                subQuotes: [], //salvo gli id dei quoteDef annidati                
            },
            _subQuote: false, //indica se l'entrata in questione è annidata o meno in un quoteDef
        }

        //Parsing the id or creating it with the evtParser.xpath method
        var id;
        if (entry.getAttribute('xml:id')) {
            id = entry.getAttribute('xml:id');
        } else {
            id = evtParser.xpath(entry).substr(1);
        }
        quote.id = id;

        //Parsing the attributes
        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.specified) {                    
                    quote.attributes[attrib.name] = attrib.value;                 
                }
                if (attrib.name === 'source') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    quote._indexes.sourceRefId = values;
                }
                if (attrib.name === 'corresp') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    quote._indexes.sourceRefId = values;
                }
            }
        }

        //Check if the sourceAppDef element is nested in another quoteDef element
        quote._subQuote = evtParser.isNestedInElem(entry, quoteDef.replace(/[<>]/g, ''));

        //Parsing the contents
        angular.forEach(entry.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    quote.content.push(child.textContent.trim());
                }
            } else if (child.nodeType === 1) {
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
                            var bibl = parseSource(child.children[i], entry);
                            //...then add their id to the sourceId array.
                            quote._indexes.sourceId.push(bibl.id);
                            quote.content.push(bibl);
                        }
                    }
                } // If there is a bibliographic element, parse it as a Source.
                  else if (biblEl.indexOf(child.tagName) >= 0) {
                    var bib = parseSource(child, entry);
                    //Then add its id to the sourceId array.
                    quote._indexes.sourceId.push(bib.id);
                    quote.content.push(bib);
                } //If there is a link or pointer or ref...
                  else if (linkEl.indexOf(child.tagName) >= 0) {
                    quote.content.push(child);
                    if (child.hasAttribute('target')) {
                        var attrib = child.getAttribute('target');
                        var values = attrib.replace(/#/g, '').split(" ");
                        for (var i = 0; i < values.length; i++) {
                            //...add its target values to the sourceRefId array.
                            quote._indexes.sourceRefId.push(values[i]);
                        }
                    }
                } //If there is a linkGrp...
                  else if (child.tagName === 'linkGrp') {
                      //...parse the children...
                    for (var i = 0; i < child.children.length; i++) {
                        if (linkEl.indexOf(child.children[i].tagName) >= 0) {
                            quote.content.push(child.children[i]);
                            if (child.children[i].hasAttribute('target')) {
                                var attr = child.children[i].getAttribute('target');
                                var val = attr.replace(/#/g, '').split(" ");
                                for (var i = 0; i < val.length; i++) {
                                    //...and add their target values to the SourceRefId array.
                                    quote._indexes.sourceRefId.push(val[i]);
                                }
                            }
                        }
                    }
                } //If there is an apparatus Entry, parse it with handleAppEntry.
                  else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    quote.content.push(evtCriticalParser.handleAppEntry(child));
                } //If there is a nested quote, parse it recursively.
                  else if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    var subQuote = parseQuote(child);
                    quote.content.push(subQuote);
                    //Then add the id to the subQuotes array.
                    quote._indexes.subQuotes.push(subQuote.id);
                } /*else if (analogueDef.indexOf('<'+child.tagName+'>') >= 0) {
                    content.push(evtAnaloguesParser.parseAnalogue(child));
                } else if (child.tagName === 'witDetail') {
                    content.push(evtCriticalParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    quote.content.push(evtParser.parseNote(child));
                } 
                  else {
                    quote.content.push(parseQuoteContent(child));
                }
            }
        });

        return quote;
    }

    /* ******* */
    /* SOURCES */
    /* ******* */

    /********************************* */
    /* parseSourcesEntryReference(elem)*/
    /******************************************************************/
    /* Function to parse an element inside of a quoteDef element  */
    /* that may point to the bibliographic reference of the quotation */
    /* @elem --> an element inside of quoteDef, like <ptr>, <link>*/
    /* @author: CM                                                    */
    /**************************************************************** */
    var parseSourcesEntryReference = function (elem) {
        
        var refElement = {
            id: elem.getAttribute('xml:id') || evtParser.xpath(elem),
            tagName: elem.tagName,
            attributes : [],
            content: [],
            // In questo array salvo i riferimenti alle fonti, che poi copierò nel sourceId dell'entrata
            _indexes: []
        }

        //salvo gli attributi
        if (elem.attributes) {
            var refValues = [];
            for (var i = 0; i < elem.attributes.length; i++) {
                var attrib = elem.attributes[i];
                if (attrib.specified) {
                    refElement.attributes[attrib.name] = attrib.value;
                    // Se trovo uno dei seguenti attributi...
                    if (attrib.name === 'source' 
                        || attrib.name === 'target'
                        || attrib.name === 'corresp'
                        || attrib.name === 'xml:id'
                        || attrib.name === 'ref'){
                        var values = attrib.value.replace(/#/g, '').split(" ");
                        for (var i = 0; i < values.length; i++) {
                            refValues.push(values[i]);
                        }
                    }
                }
            }
            //...lo aggiungo nell'array dei riferimenti alle fonti
            for (var i = 0; i < refValues.length; i++) {
                refElement._indexes.push(refValues[i]);
            }
        }

        //parso i contenuti
        angular.forEach(elem.childNodes, function(child) {
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    refElement.content.push(child.textContent.trim());
                }
            } else if (child.tagName === 'linkGrp') {
                angular.forEach(child.childNodes, function(subChild) {
                    var link = parseSourcesEntryReference(subChild);
                    refElement.content[link.id] = link;
                })
            } else {
                refElement.content.push(child.cloneNode(true));
            }
        });

        return refElement;
    }

    /*********************/
    /*parseSource(source)*/
    /**************************************************************/
    /*Function to parse a source bibliographic reference, and save*/
    /*it in SourcesCollection.                                    */
    /*@source --> source to parse                                 */
    /*@author --> CM                                              */
    /************************************************************ */
    var parseSource = function(entry, quote) {
        var source = {
            id: '',
            attributes: [],
            quotesEntriesId: [],
            content: [],
            bibl: {
                _encodingStructure: [],
            },
            text: [],
            textUrl: ''
        }

        var id;

        if (entry.attributes) {
            for (var i = 0; i < entry.attributes.length; i++) {
                var attrib = entry.attributes[i];
                if (attrib.name === 'xml:id') {
                    id = attrib.value;
                } 
                if (attrib.specified) {
                    source.attributes[attrib.name] = attrib.value;
                    source.attributes.length++;
                }
            }
        }

        if (id === undefined) {
            id = evtParser.xpath(entry).substr(1);
        }

        source.id = id;
        
        if (parsedData.getQuotes()._indexes.sourcesRef[source.id] !== undefined) {
            source.quotesEntriesId = parsedData.getQuotes()._indexes.sourcesRef[source.id];
        } else {
            if (quote.hasAttribute('xml:id')) {
                source.quotesEntriesId.push(quote.getAttribute('xml:id'));
            } else {
                source.quotesEntriesId.push(evtParser.xpath(quote).substr(1));
            }
        }

        angular.forEach(entry.childNodes, function(child){
            if (child.nodeType === 3) {
                if (child.textContent.trim() !== '') {
                    source.text.push(child.textContent.trim());
                }
            }
            else if (child.nodeType === 1) {
                if (child.parentNode.tagName === 'cit' && child.tagName === 'quote') {
                    var contentEl = parseSourcesEntryReference(child);
                    source.content[child.tagName] = contentEl;
                    source.content.push(child.textContent);
                }
                else if (child.tagName === 'bibl' /*|| child.tagName === 'biblFull' || child.tagName === 'biblStruct'*/){
                    var biblEl = ['author', 'title', 'editor', 'publisher', 'pubPlace', 'date', 'citedRange', 'edition'];
                    for (var i = 0; i < child.childNodes.length; i++) {
                        if (biblEl.indexOf(child.childNodes[i].tagName) >= 0) {
                            var biblElem = parseSourcesEntryReference(child.childNodes[i]);
                            source.bibl[biblElem.tagName] = biblElem;
                            source.bibl._encodingStructure[biblElem.id] = biblElem;
                        }
                    }
                }
            }
        });

        parsedData.addSource(source);

        return source;
    };
    
    /****************** */
    /*handleSource(elem)*/
    /************************************************************ */
    /*Function to search XML elements containing information about*/
    /*sources, cited inside the critical text. These elements are */
    /*referred through an xml:id attribute.                       */
    /*@elem --> element to analyze                                */
    /*@author --> CM                                              */
    /************************************************************ */
    var handleSource = function(elem){
        //Get the ids saved in quotesCollection
        var ref = parsedData.getQuotes()._indexes.sourcesRef._id;
        if (elem.nodeType === 3) {
            return;
        }
        else if (elem.nodeType === 1) {
            if (elem.attributes.length > 0) {
                for (var i = 0; i < elem.attributes.length; i++) {
                    //Search elements that have the xml:id attribute
                    if (elem.attributes[i].name === 'xml:id') {
                        var attr = elem.attributes[i].value;
                        //If the value of the xml:id attribute of the element is equal to one of the ids...
                        if (ref.indexOf(attr) >= 0) {
                            //...the element is parsed by parseSource(source) and saved in the SourcesCollection
                            parseSource(elem);
                        }
                    }
                }
            }
            else if (elem.childNodes.length > 0) {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    handleSource(elem.childNodes[i]);
                }
            }
        }
    };

    /* *****************/
    /* parseQuotes(doc)*/
    /* ****************************************************************/
    /* Function to parse the blocks of the critical texts that cite a */
    /* source in the XML file (sourceAppDef)                          */
    /* and save them in parsedData                                    */
    /* @doc document -> XML to be parsed                              */
    /* @author: CM                                                    */
    /* ****************************************************************/
    parser.parseQuotes = function(doc) {
        var deferred = $q.defer();
        var currentDocument = angular.element(doc); //wraps the DOM of doc as a jquery elementContent

        // Avvio parser delle entrate dell'apparato delle fonti
        angular.forEach(currentDocument.find(quoteDef.replace(/[<>]/g, '')),
            function(element){
                var isInBody = evtParser.isNestedInElem(element, 'body');
                if (isInBody){
                    var quote = parseQuote(element);
                    parsedData.addQuote(quote);
                }
            });
            
            console.log('## QUOTES ##', parsedData.getQuotes());

            deferred.resolve('success');
            return deferred;
    };

    var updateQuotes = function(){
        var appEntriesId = parsedData.getSources()._indexes.quotesRef._id;
        var sourcesEntriesId = parsedData.getQuotes()._indexes.encodingStructure;
        var missing = [];
        for (var i = 0; i < sourcesEntriesId.length; i++) {
            if (appEntriesId.indexOf(sourcesEntriesId[i]) < 0) {
                missing.push(sourcesEntriesId[i]);
            }
        }
        for (var i = 0; i < missing.length; i++) {
            //delete parsedData.getQuotes()[missing[i]];
        }
    }

    /***************** */
    /*parseSources(doc)*/
    /**************************************************************/
    /*Function to parse the sources bibliographic references, when*/
    /*they are inside of the critical text document               */
    /*@doc --> XML document to parse                              */
    /*@author --> CM                                              */
    /************************************************************ */
    parser.parseSources = function(doc) {
        var deferred = $q.defer();

        if (parsedData.getQuotes()._indexes.sourcesRef._id.length > 0) {
            var currentDocument = angular.element(doc),
                defDocElement;

            if (config.sourcesUrl === "") {
                if ( currentDocument.find('text group text').length > 0 ) {
                    defDocElement = 'text group text';
                } else if ( currentDocument.find('text').length > 0 ) {
                    defDocElement = 'text';
                } else if ( currentDocument.find('div[subtype="edition_text"]').length > 0 ) {
                    defDocElement = 'div[subtype="edition_text"]';
                }
                angular.forEach(currentDocument.find(defDocElement),
                    function(element){
                        handleSource(element);
                    });
                console.log('## Sources ##', parsedData.getSources());
            }
        }
        else {
            //TODO: implementare gestione di source codificate nel testo.
        }
        //Delete the source entries from the collection, if they don't correspond to a source
        updateQuotes();
        console.log('## QUOTES UPDATED ##', parsedData.getQuotes());
        
        deferred.resolve('success');
        return deferred;
    };

    /***************************/
    /*parseExternalSources(doc)*/
    /**************************************************************/
    /*Function to parse the sources bibliographic references, when*/
    /*they are inside an external document                        */
    /*@doc --> XML external document to parse                     */
    /*@author --> CM                                              */
    /************************************************************ */
    parser.parseExternalSources = function(doc) {
        //TODO: risolvere problema di childNodes[0]
        var deferred = $q.defer();
        for (var i = 0; i < doc.childNodes.length; i++) {
            handleSource(doc.childNodes[i]);
        }
        console.log('## External Sources ##', parsedData.getSources());

        updateQuotes();
        
        deferred.resolve('success');
        return deferred;
    }

    return parser;
});