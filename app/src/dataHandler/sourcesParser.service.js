/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtSourcesParser
 * @description 
 * # evtSourcesParser
 * Service containing methods to parse data regarding sources
 *
 * @requires $q
 * @requires xmlParser
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.evtCriticalElementsParser
 *
 * @author CM
**/
angular.module('evtviewer.dataHandler')

.service('evtSourcesParser', function($q, parsedData, evtParser, evtCriticalElementsParser, xmlParser, config) {
    var parser = {};

    var apparatusEntryDef = '<app>',
        quoteDef          = config.quoteDef || '<quote>';
    // Al momento ho usato solo questa variabile
    // Queste due le userò appena inizierò a parsare le fonti
    var sourceDef  = '<cit>',
        sourcesUrl = ''; // Parsing di più documenti
    
    /**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtSourcesParser#handleSource
     * @methodOf evtviewer.dataHandler.evtSourcesParser
     *
     * @description
     * [PRIVATE] This function will search XML elements containing information about
     * sources, cited inside the critical text. These elements are referred through an xml:id attribute.
     *
     * @param {element} elem XML element to analyze
     *
     * @author CM
     */
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
                            evtCriticalElementsParser.parseSource(elem);
                        }
                    }
                }
            }
            else if (elem.childNodes.length > 0) {
                for (var j = 0; j < elem.childNodes.length; j++) {
                    handleSource(elem.childNodes[j]);
                }
            }
        }
    };

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesParser#parseQuotes
     * @methodOf evtviewer.dataHandler.evtSourcesParser
     *
     * @description
     * This method will parse the blocks of the critical texts that cite a
     * source in the XML file (<code>sourceAppDef</code>).
     *
     * @param {element} doc XML element to parse
     *
     * @author CM
     */
    parser.parseQuotes = function(doc) {
        var deferred = $q.defer();
        var currentDocument = angular.element(doc); //wraps the DOM of doc as a jquery elementContent

        // Avvio parser delle entrate dell'apparato delle fonti
        angular.forEach(currentDocument.find(quoteDef.replace(/[<>]/g, '')),
            function(element){
                var isInBody = evtParser.isNestedInElem(element, 'body');
                if (isInBody){
                    var quote = evtCriticalElementsParser.parseQuote(element);
                    parsedData.addQuote(quote);
                }
            });
            
        console.log('## Quotes ##', parsedData.getQuotes());

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
                sourcesEntriesId.splice(i, 1);
            }
        }
        for (var j = 0; j < missing.length; j++) {
            delete parsedData.getQuotes()[missing[j]];
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesParser#parseSources
     * @methodOf evtviewer.dataHandler.evtSourcesParser
     *
     * @description
     * This method will parse the sources bibliographic references, when
     * they are inside of the critical text document.
     *
     * @param {element} doc XML element to parse
     *
     * @author CM
     */
    parser.parseSources = function(doc, extDoc) {
        var deferred = $q.defer();

        if (parsedData.getQuotes()._indexes.sourcesRef._id.length > 0) {
            if (config.sourcesUrl === '') {
                var currentDocument = angular.element(doc),
                defDocElement;
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
                //Delete the source entries from the collection, if they don't correspond to a source
                updateQuotes();
            } else {
                if (extDoc) {
                    parser.parseExternalSources(extDoc);
                }
            }
        }        
        
        deferred.resolve('success');
        return deferred;
    };
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtSourcesParser#parseExternalSources
     * @methodOf evtviewer.dataHandler.evtSourcesParser
     *
     * @description
     * This method will parse the sources bibliographic references, when
     * they are inside an external document.
     *
     * @param {element} doc external XML document to parse
     *
     * @author CM
     */
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
    };

    return parser;
});