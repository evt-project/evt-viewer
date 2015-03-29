angular.module('evtviewer.dataModel')

.service('baseData', function($log, xmlParser) {
    var baseData = {},
        state = {
            XMLDocuments: [],
            XMLStrings: []
        };

    var _console = $log.getInstance('baseData');

    var addXMLDocument = function(doc) {
        var docElements = xmlParser.parse(doc);
        if (docElements.documentElement.nodeName === 'TEI') {
            state.XMLDocuments.push(docElements);
            _console.log('XML TEI parsed and stored in XMLDocuments ', state.XMLDocuments);
        } else {
            _console.error('Something wrong with the XML');
        }
    };

    baseData.addXMLString = function(xmlString) {
        state.XMLStrings.push(xmlString);
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