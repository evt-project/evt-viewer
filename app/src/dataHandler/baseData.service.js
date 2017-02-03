angular.module('evtviewer.dataHandler')

.service('baseData', function($log, xmlParser, evtParser, evtCriticalParser, evtProjectInfoParser, evtPrimarySourcesParser) {
    var baseData     = {},
        state        = {
            XMLDocuments: [],
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
            evtCriticalParser.parseWitnesses(docElements);
            
            evtProjectInfoParser.parseProjectInfo(docElements);
            _console.log('XML TEI parsed and stored ', state.XMLDocuments);
        } else {
            _console.error('Something wrong with the XML');
        }
    };

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