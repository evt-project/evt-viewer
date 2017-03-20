angular.module('evtviewer.dataHandler')

.service('evtSourcesParser', function($q, parsedData, evtParser, evtCriticalApparatusParser, xmlParser, config) {
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
                    contentEl.content.push(parseQuote(child));
                } else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtCriticalApparatusParser.handleAppEntry(child));
                } /*else if (analogueDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtAnaloguesParser.parseAnalogue(child));
                } else if (child.tagName === 'witDetail') {
                    contentEl.content.push(evtCriticalApparatusParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    contentEl.content.push(evtParser.parseNote(child));
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        contentEl.content.push(child.children[i].cloneNode(true));
                        parseQuoteContent(child.children[i])
                    }
                } else {
                    contentEl.content.push(parseQuoteContent(child));
                }
            }
        });

        return contentEl;
    }

    //Tentativo di parsare solo gli elementi XML
    var parxeQuoteContent = function(elem) {
        var content = [];
        if (elem.children.length <= 0) {
            content.push(elem);
        } else {
            angular.forEach(elem.children, function(child){
                if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    content.push(parseQuote(child));
                } else if (apparatusEntryDef.indexOf('<'+child.tagName+'>') >= 0) {
                    content.push(evtCriticalApparatusParser.handleAppEntry(child));
                } /*else if (analogueDef.indexOf('<'+child.tagName+'>') >= 0) {
                    contentEl.content.push(evtAnaloguesParser.parseAnalogue(child));
                } else if (child.tagName === 'witDetail') {
                    contentEl.content.push(evtCriticalApparatusParser.parseWitDetail(child));
                }*/ else if (child.tagName === 'note') {
                    content.push(evtParser.parseNote(child));
                } else if (child.children.length > 0) {
                    for (var i = 0; i < child.children.length; i++) {
                        content.push(child.children[i].cloneNode(true));
                        parxeQuoteContent(child.children[i])
                    }
                } else {
                    content.push(child.cloneNode(true));
                }
            });             
        }
        return content;
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
            type: 'quote',
            id : '',
            attributes: [],
            content: [],
            _indexes: {
                sourceId: [],//array in cui salvo gli id delle entrate bibliografiche nell'elemento
                sourceRefId: [], //array in cui salvo gli id delle fonti cui l'entrata fa riferimento
                subQuotes: [], //salvo gli id dei quoteDef annidati                
            },
            _subQuote: false, //indica se l'entrata in questione è annidata o meno in un quoteDef
            _xmlSource: entry.outerHTML
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
                if (attrib.name === 'ref') {
                    var values = attrib.value.replace(/#/g, '').split(" ");
                    quote._indexes.sourceRefId = values;
                }
            }
        }

        //Check if the sourceAppDef element is nested in another quoteDef element
        var aQuoteDef = quoteDef.split(","),
        i = 0;
        while (i < aQuoteDef.length && !quote._subQuote) {
            quote._subQuote = evtParser.isNestedInElem(entry, aQuoteDef[i].replace(/[<>]/g, ''));
            i++;
        }

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
                        } else {
                            quote.content.push(parseQuoteContent(child.children[i]));
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
                    quote.content.push(parseQuoteContent(child));
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
                            quote.content.push(parseQuoteContent(child.children[i]));
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
                    quote.content.push(evtCriticalApparatusParser.handleAppEntry(child));
                } //If there is a nested quote, parse it recursively.
                  else if (quoteDef.indexOf('<'+child.tagName+'>') >= 0) {
                    var subQuote = parseQuote(child);
                    quote.content.push(subQuote);
                    //Then add the id to the subQuotes array.
                    quote._indexes.subQuotes.push(subQuote.id);
                } /*else if (analogueDef.indexOf('<'+child.tagName+'>') >= 0) {
                    content.push(evtAnaloguesParser.parseAnalogue(child));
                } else if (child.tagName === 'witDetail') {
                    content.push(evtCriticalApparatusParser.parseWitDetail(child));
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
    /* parseSourcesEntryContent(elem)*/
    /******************************************************************/
    /* Function to parse an element inside of a quoteDef element  */
    /* that may point to the bibliographic reference of the quotation */
    /* @elem --> an element inside of quoteDef, like <ptr>, <link>*/
    /* @author: CM                                                    */
    /**************************************************************** */
    var parseSourceContent = function (elem, source) {
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
            title: [],
            author: [],
            attributes: [],
            quotesEntriesId: [],
            bibl: [], //Array that saves the full bibliographic reference of the source (which almost always corresponds the content of the source itself)
            text: {},
            url: [], //Array that saves the link to the full text of the source
            quote: [],
            _xmlSource: entry.outerHTML
        }

        //Parsing the attributes and saving the id
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
        
        //Parsing the quotes that refer to this source.
        if (parsedData.getQuotes()._indexes.sourcesRef[source.id] !== undefined) {
            source.quotesEntriesId = parsedData.getQuotes()._indexes.sourcesRef[source.id];
        } else {
            //If the bibliographic reference of the source is inside a quote,
            //the id of the quote is pushed int he quotesEntriesId array.
            if (quote.hasAttribute('xml:id')) {
                source.quotesEntriesId.push(quote.getAttribute('xml:id'));
            } else {
                source.quotesEntriesId.push(evtParser.xpath(quote).substr(1));
            }
        }

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
                    source.quote.push(contentEl);
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
            delete parsedData.getQuotes()[missing[i]];
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

    parser.getQuoteContentText = function(elem, wit, doc) {
        var spanElement;

        if (elem.content !== undefined) {
            if (elem.content.length === 0) {
                var xmlEl = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
                var el = xmlEl.children[0];
                if (elem.tagName === 'pb') {
                    if (wit !== '' && (el.getAttribute('ed').indexOf(wit) >= 0)) {
                        var newPbElem = document.createElement('span'),
                            id;
                        if (el.getAttribute('ed')) {
                            id  = el.getAttribute('xml:id') || el.getAttribute('ed').replace('#', '')+'-'+el.getAttribute('n'); // || 'page_'+k;
                        } else {
                            id  = el.getAttribute('xml:id'); //|| 'page_'+k;
                        }
                        newPbElem.className = 'pb';
                        newPbElem.setAttribute('data-wit', el.getAttribute('ed'));
                        newPbElem.setAttribute('data-id', id);
                        newPbElem.setAttribute('id', 'pb_'+id);
                        newPbElem.textContent = el.getAttribute('n');
                        spanElement = newPbElem;
                    }
                } else {
                    spanElement = evtParser.parseXMLElement(doc, el, '');
                }
            }
            else if (elem.content.length === 1 && typeof elem.content[0] === 'string') {
                //spanElement = document.createTextNode('FATTO!!!');
                var xmlE = xmlParser.parse(elem._xmlSource.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, ''));
                var e = xmlE.children[0];
                spanElement = evtParser.parseXMLElement(doc, e, '');
            }
            else {
                spanElement = document.createElement('span');
                spanElement.className = elem.tagName;

                var attribKeys = Object.keys(elem.attributes);
                for (var key in attribKeys) {
                    var attrib = attribKeys[key];
                    var value = elem.attributes[attrib];
                    if (attrib !== 'xml:id') {
                        spanElement.setAttribute('data-'+attrib, value);
                    }
                }

                var content = elem.content;
                for (var i in content) {
                    if (typeof content[i] === 'string') {
                        spanElement.appendChild(document.createTextNode(content[i]));
                    } else {
                        if (content[i].type === 'quote') {
                            spanElement.appendChild(parser.getQuoteText(content[i]));
                        } else if (content[i].tagName === 'EVT-POPOVER') {
                            spanElement.appendChild(content[i]);
                        } else if (content[i].type === 'app') {
                            if (wit === '') {
                                spanElement.appendChild(evtCriticalApparatusParser.getEntryLemmaText(content[i]));
                            } else {
                                spanElement.appendChild(evtCriticalApparatusParser.getEntryWitnessReadingText(content[i], wit));
                            }
                        } else
                        // if (elementContent[i].type === 'analogue') {
                            //
                        //} else
                         {
                            var child = parser.getQuoteContentText(content[i], wit, doc);
                            if (child !== undefined) {
                                spanElement.appendChild(child);
                            }
                        }
                    }
                }
            }
        }

        return spanElement;
    }

    /******************* */
    /*getQuoteText(quote)*/
    /******************* */
    parser.getQuoteText = function(quote, wit, doc){
        var spanElement,
            errorElement;

        spanElement = document.createElement('evt-quote');
        spanElement.setAttribute('data-quote-id', quote.id);
        spanElement.setAttribute('data-type', 'quote');
        if (wit !== '' && wit !== undefined){
            spanElement.setAttribute('data-scope-wit', wit);
        }
        var quoteContent = quote.content;

        var link = ['link', 'ptr', 'linkGrp'];

        for (var i in quoteContent) {
            if (typeof quoteContent[i] === 'string') {
                spanElement.appendChild(document.createTextNode(quoteContent[i]));
            } else {
                if (quoteContent[i].tagName === 'EVT-POPOVER') {
                    spanElement.appendChild(quoteContent[i]);
                } else if (quoteContent[i].type === 'app') {
                    if (wit === '') {
                        spanElement.appendChild(evtCriticalApparatusParser.getEntryLemmaText(quoteContent[i]));
                    } else {
                        spanElement.appendChild(evtCriticalApparatusParser.getEntryWitnessReadingText(quoteContent[i], wit));
                    }
                } else if (quoteContent[i].type === 'quote') {
                    spanElement.appendChild(parser.getQuoteText(quoteContent[i], wit, doc));
                }
                //else if (quoteContent[i].type === 'analogue')...
                 else if (quoteContent[i].type === 'quoteContent' && link.indexOf(quoteContent[i].tagName) < 0) {
                     var child = parser.getQuoteContentText(quoteContent[i], wit, doc);
                     if (child !== undefined) {
                         spanElement.appendChild(child);
                         //spanElement.appendChild(document.createTextNode('FATTO!!!'));
                     }
                 }
            }
        }

        //console.log(spanElement);
        return spanElement;
    }

    return parser;
});