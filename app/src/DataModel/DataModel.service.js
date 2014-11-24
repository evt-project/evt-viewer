/*globals ActiveXObject*/

angular.module('evtviewer.dataModel')
.service('DataModel', function (BaseComponent) {
    var dataModel = new BaseComponent('DataModel'),
        state = {
            XMLData: []
        };

    dataModel.addXMLString = function (xmlString) {
        var parseData = DOMParser ? (new DOMParser()).parseFromString(xmlString, 'text/xml') : ((new ActiveXObject('Microsoft.XMLDOM')).loadXML(xmlString));
        if (parseData.documentElement.nodeName !== 'parsererror' && parseData.documentElement.nodeName !== 'html') {
            dataModel.addXMLData(parseData);
            dataModel.log('XML string data parsed');
        }
    }; 

    dataModel.addXMLData = function (data) {
        state.XMLData.push(data);
        dataModel.log('Add XML data', state.XMLData);
    };

    dataModel.getXMLData = function () {
        return state.XMLData;
    };

    return dataModel;
});