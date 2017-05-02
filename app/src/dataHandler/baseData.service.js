angular.module('evtviewer.dataHandler')

.service('baseData', function($log, xmlParser, evtParser, evtCriticalApparatusParser, evtSourcesParser, evtProjectInfoParser, evtPrimarySourcesParser, evtAnaloguesParser, config) {
    var baseData     = {},
        state        = {
            XMLDocuments: [],
            //Added by CM to save references to external documents
            XMLExtDocuments: [],
            //Added by CM to save references to sources text documents
            XMLSrcDocuments: [],
            XMLStrings: []
        };

    var _console = $log.getInstance('baseData');

    var addXMLDocument = function(doc) {
        var docElements = xmlParser.parse(doc);
        if (docElements.documentElement.nodeName === 'TEI') {
            state.XMLStrings.push(doc);
            state.XMLDocuments.push(docElements);
            // Parse pages
            // evtParser.parsePages(docElements);
            // Parse documents
            evtParser.parseGlyphs(docElements); //TODO: Decide if it is necessary to move this somewhere else
            evtPrimarySourcesParser.parseZones(docElements); //TODO: Decide if it is necessary to move this somewhere else
            
            var parsedDocuments = evtParser.parseDocuments(docElements);
            // Parse witnesses list
            evtCriticalApparatusParser.parseWitnesses(docElements);

            // Parse the Sources Apparatus entries (@author: CM)
            evtSourcesParser.parseQuotes(docElements);

            if (config.sourcesUrl === "") {
                evtSourcesParser.parseSources(docElements);
            } else {
                evtSourcesParser.parseSources(docElement, state.XMLExtDocuments["sources"]);
            }
            if (config.analoguesUrl === "") {
                evtAnaloguesParser.parseAnalogues(docElements, '');
            } else {
                evtAnaloguesParser.parseAnalogues(docElements, state.XMLExtDocuments["analogues"]);
            }

            evtProjectInfoParser.parseProjectInfo(docElements);
            _console.log('XML TEI parsed and stored ', state.XMLDocuments);
        } else {
            _console.error('Something wrong with the XML');
        }
    };

    /********************************************************/
    /*Method to store the external XML files and parse them */
    /*@author: CM                                           */
    /********************************************************/

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

    /*Method to store XML documents for Source-Text view*/
    /*@author: CM*/
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
    }

    baseData.addXMLString = function(xmlString) {
        addXMLDocument(xmlString);
    };

    baseData.getXMLDocuments = function() {
        return state.XMLDocuments;
    };

    baseData.getXMLStrings = function() {
        return state.XMLStrings;
    };

    return baseData;
});