angular.module('evtviewer.dataModel')

.service('BaseData', function(BaseComponent, xmlParser) {
    var baseData = new BaseComponent('BaseData'),
        state = {
            XMLDocuments: [],
            XMLStrings: []
        };

    var addXMLDocument = function(doc) {
        var docElements = xmlParser.parse(doc);
        if (docElements.documentElement.nodeName === 'TEI') {
            state.XMLDocuments.push(docElements);
            baseData.log('XML TEI parsed and stored in XMLDocuments ', state.XMLDocuments);
        } else {
            baseData.err('Something wrong with the XML');
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