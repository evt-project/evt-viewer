/*globals ActiveXObject*/

angular.module('evtviewer.dataModel')

.service('DataModel', function(BaseComponent) {
    var dataModel = new BaseComponent('DataModel'),
        state = {
            XMLDocuments: [],
            XMLStrings: []
        };

    var xmlToDOM = function(xmlString) {
        var parseData = DOMParser ? (new DOMParser()).parseFromString(xmlString, 'text/xml') : ((new ActiveXObject('Microsoft.XMLDOM')).loadXML(xmlString));
        if (parseData.documentElement.nodeName !== 'parsererror' && parseData.documentElement.nodeName !== 'html') {
            dataModel.addXMLDocument(parseData);
            dataModel.log('XML data parsed and stored');
        }
    };

    dataModel.addXMLString = function(xmlString) {
        state.XMLStrings.push(xmlString);
        xmlToDOM(xmlString);
    };

    dataModel.addXMLDocument = function(doc) {
        state.XMLDocuments.push(doc);
        dataModel.log('Add XML document', state.XMLDocuments);
    };

    dataModel.getXMLDocuments = function() {
        return state.XMLDocuments;
    };

    dataModel.getXMLStrings = function() {
        return state.XMLStrings;
    };

    return dataModel;
});