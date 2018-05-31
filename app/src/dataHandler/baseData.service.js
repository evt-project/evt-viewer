/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.baseData
 * @description
 * # baseData
 * Service containing methods to handle the initial source of data.
 * It stores the XML documents loaded, allows to launch initial parsers
 * and to retrieve the already loaded documents for further parsing.
 *
 * @requires $log
 * @requires $q
 * @requires $http
 * @requires xmlParser
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.dataHandler.evtSourcesParser
 * @requires evtviewer.dataHandler.evtProjectInfoParser
 * @requires evtviewer.dataHandler.evtPrimarySourcesParser
 * @requires evtviewer.dataHandler.evtAnaloguesParser
 * @requires evtviewer.dataHandler.evtBibliographyParser
 * @requires evtviewer.dataHandler.evtNamedEntitiesParser
 * @requires evtviewer.dialog.evtDialog
**/
angular.module('evtviewer.dataHandler')

.service('baseData', function($log, $q, $http, config, xmlParser, evtParser, evtCriticalApparatusParser, evtSourcesParser, evtProjectInfoParser, evtPrimarySourcesParser, evtAnaloguesParser, evtDialog, evtBibliographyParser, evtNamedEntitiesParser, evtSearch) {
    var baseData     = {},
        state        = {
            XMLDocuments: [],
            //Added by CM to save references to external documents
            XMLExtDocuments: [],
            //Added by CM to save references to sources text documents
            XMLSrcDocuments: [],
            XMLStrings: []
        },
        docElements;

    var _console = $log.getInstance('baseData');

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#addXMLString
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * Add string representing an XML document to collection of stored XML sources.
     * It uses the private method {@link evtviewer.dataHandler.baseData#addXMLDocument addXMLDocument} 
     * that will check if the XML is encoded using the xi:include method. If so, it will load every 
     * XML included before adding it to collection.
     * 
     * @param {string} xmlString String representing the XML source text to be parsed and stored
     * @returns {promise} promise that the parser will end and complete XML string is stored in collection 
     */
    baseData.addXMLString = function(xmlString) {
        var promises = [];
        promises.push(addXMLDocument(xmlString).promise);
        return $q.all(promises);
    };

    baseData.getXML = function() {
      return docElements;
    };

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#getXMLDocuments
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * Get the collection of XML Documents stored in the service
     * @returns {array} Collection of XML Documents stored in the service
     */
    baseData.getXMLDocuments = function() {
        return state.XMLDocuments;
    };

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#getXMLStrings
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * Get the collection of XML Strings stored in the service
     * @returns {array} Collection of XML Strings stored in the service
     */
    baseData.getXMLStrings = function() {
        return state.XMLStrings;
    };
    
    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#addXMLDocument
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * [PRIVATE] Add an XML Document to collection of stored ones (both in string and document format).
     * It also launches the initial parsers that allow to extract the basic information needed.
     * It checks if the XML is encoded using the xi:include method. 
     * If so, it will load every XML included before launching the parsers.
     * @param {string} doc String representing the XML Document to be stored and parsed
     * @returns {promise} promise that the parser will end and complete XML string is stored in collection
     */
    var addXMLDocument = function(doc) {
        var deferred = $q.defer();
        docElements = xmlParser.parse(doc);
        if (docElements.documentElement.nodeName === 'TEI') {
            state.XMLStrings.push(doc);
            loadXIinclude(docElements).promise.then(function(){
                state.XMLDocuments.push(docElements);
                launchXMLParsers(docElements);
                _console.log('XML TEI parsed and stored ', state.XMLDocuments);
                deferred.resolve('success');
            });
        } else {
            _console.error('Something wrong with the XML');
            deferred.resolve('success');
        }
        return deferred;
    };

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#addXMLExtDocument
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * Store the external XML files and parse them (external from the main XML document)
     * @param {string} extDoc String representing the External Document to be stored and parsed
     * @param {string} type Type of document passed [e.g. 'source', 'analogues']
     * @author CM
     */
    baseData.addXMLExtDocument = function(extDoc, type) {
        var docElements = xmlParser.parse(extDoc);
        try {
            state.XMLStrings.push(extDoc);
            state.XMLExtDocuments[type] = docElements;
            state.XMLExtDocuments.length++;
            var parsedDocuments = evtParser.parseExternalDocuments(docElements, type);

            /*if (type === 'sources') {
                evtSourcesParser.parseExternalSources(docElements);
            } else if (type === 'analogues') {
                evtAnaloguesParser.parseExternalAnalogues(docElements);
            }*/
            _console.log('External Files parsed and stored', state.XMLExtDocuments);
        } catch (e) {
            _console.log('Something wrong with the supplementary XML files '+e);
        }
    };

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#addXMLSrcDocument
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * Store XML documents for Source-Text view
     * @param {string} srcDoc String representing the Source Document to be stored and parsed
     * @param {string} id Id of document connected to Source Document
     * @author CM
     */
    baseData.addXMLSrcDocument = function (srcDoc, id) {
        var docElements = xmlParser.parse(srcDoc);
        try {
            state.XMLStrings.push(srcDoc);
            state.XMLSrcDocuments[id] = docElements;
            state.XMLSrcDocuments.length++;
            var parsedDocuments = evtParser.parseExternalDocuments(docElements, id);
            _console.log('Source file parsed and stored', state.XMLSrcDocuments);
        } catch (e) {
            _console.log('Something wrong with the supplementary XML files '+e);
        }
    };

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#launchXMLParsers
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * [PRIVATE] Launch XML basic parser, needed at the very first loading of the application.
     * @param {element} docElements Element representing the tree of the XML document to be parsed.
     */
    var launchXMLParsers = function(docElements) {
        evtParser.analyzeEncoding(docElements);
        // Parse pages
        // evtParser.parsePages(docElements);

        // Parse Zones
        evtPrimarySourcesParser.parseZones(docElements); //TODO: Decide if it is necessary to move this somewhere else

        // Parse documents
        evtParser.parseDocuments(docElements);

        // Parse witnesses list
        evtCriticalApparatusParser.parseWitnesses(docElements);

        // Parse the Sources Apparatus entries (@author: CM)
        if (config.quoteDef !== '') {
            var promiseQuote = [];
            promiseQuote.push(evtSourcesParser.parseQuotes(docElements));
            $q.all(promiseQuote).then(function() {
                if (config.sourcesUrl === '') {
                    evtSourcesParser.parseSources(docElements);
                } else {
                    evtSourcesParser.parseSources(docElements, state.XMLExtDocuments.sources);
                }
            });
        }

        // Parse the Analogues Apparatus entries (@author: CM)
        if (config.analogueDef !== '') {
            if (config.analoguesUrl === '') {
                evtAnaloguesParser.parseAnalogues(docElements, '');
            } else {
                evtAnaloguesParser.parseAnalogues(docElements, state.XMLExtDocuments.analogues);
            }
        }
        //Parse named entity
        evtNamedEntitiesParser.parseEntities(docElements);

        // Parse projet info
        evtProjectInfoParser.parseProjectInfo(docElements);
      
        // Parse bibliography
        evtBibliographyParser.parseBiblInfo(docElements);
   
       // Parse Glyphs
       evtParser.parseGlyphs(docElements);
   
       // Init Search
       //evtSearch.initSearch(docElements);
    };

    /**
     * @ngdoc method
     * @name evtviewer.dataHandler.baseData#loadXIinclude
     * @methodOf evtviewer.dataHandler.baseData
     *
     * @description
     * Find <xi:include> nodes and load referenced files.
     * It will replace <xi:include> node with the <text> found in loaded file
     *
     * @param {element} doc Element representing the tree of the XML document to be parsed.
     * @returns {promise} promise that the parser will end and all the XML document have been read and stored in collection
     * @author CDP
     */
    var loadXIinclude = function(doc) {
        var deferred = $q.defer(),
            mainUrl = config.dataUrl,
            includedFilesLoaded = 0,
            filesToInclude = doc.getElementsByTagName('xi:include');
        mainUrl = mainUrl.substring(0, mainUrl.lastIndexOf('/') + 1);
        if (filesToInclude && filesToInclude.length > 0) {
            var totFilesToInclude = filesToInclude.length;
            angular.forEach(filesToInclude, function(element) {
                var fileUrl = mainUrl + element.getAttribute('href'),
                    fileXpointer = element.getAttribute('xpointer');
                $http.get(fileUrl)
                    .then(function(response) {
                        includedFilesLoaded++;
                        var includedDoc = xmlParser.parse(response.data),
                            includedTextElem = includedDoc.getElementsByTagName('text')[0];
                        element.parentNode.replaceChild(includedTextElem, element);
                        if (includedFilesLoaded === totFilesToInclude) {
                            deferred.resolve('success');
                        }
                    }, function(error) {
                        var fallbackElem = element.getElementsByTagName('fallback')[0],
                            errorDialog  = evtDialog.getById('errorMsg');
                        var errorContent = fallbackElem.innerHTML;
                        errorContent += '<div style="text-align:center;">Warning! <br/> EVT could not work properly.</div>';
                        errorDialog.updateContent(errorContent);
                        errorDialog.setTitle(fileXpointer + ' - XI:INCLUDE ERROR');
                        errorDialog.open();
                        deferred.resolve('success');
                    });
            });
        } else {
            deferred.resolve('success');
        }
        return deferred;
    };

    return baseData;
});
