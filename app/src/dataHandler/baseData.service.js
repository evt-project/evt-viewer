angular.module('evtviewer.dataHandler')

.service('baseData', function($log, xmlParser, evtParser, evtCriticalParser, evtProjectInfoParser) {
    var baseData     = {},
        state        = {
            XMLDocuments: [],
            XMLExtDocuments: [],
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
            var parsedDocuments = evtParser.parseDocuments(docElements);
            // Parse witnesses list
            evtCriticalParser.parseWitnesses(docElements);

            // Parse the Sources Apparatus entries (@author: CM)
            evtCriticalParser.parseSourcesAppEntries(docElements);

            evtCriticalParser.parseSources(docElements);
            
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
            
            if (type === 'sources') {
                evtCriticalParser.parseExternalSources(docElements);
            }
            _console.log('External Files parsed and stored', state.XMLExtDocuments);
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