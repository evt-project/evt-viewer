angular.module('evtviewer.dataHandler')

.service('baseData', function($log, GLOBALDEFAULTCONF, xmlParser, evtParser, evtCriticalParser) {
    var baseData = {},
        state = {
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
            evtParser.parseDocuments(docElements);
            // Parse witnesses list
            evtCriticalParser.parseWitnesses(docElements);
            // Parse critical entries
            if (GLOBALDEFAULTCONF.loadCriticalEntriesImmediately){
                evtCriticalParser.parseCriticalEntries(docElements);
            }
            // evtCriticalParser.findCriticalEntryById(docElements, 'TEI:eq(0)>text:eq(0)>body:eq(0)>div:eq(0)>div:eq(0)>p:eq(0)>app:eq(0)');
            // Parse critical text
            evtCriticalParser.parseCriticalText(docElements);
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