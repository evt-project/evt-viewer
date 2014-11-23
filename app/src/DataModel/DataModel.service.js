angular.module('evtviewer.dataModel')
.service('DataModel', function (BaseComponent) {
    var dataModel = new BaseComponent('DataModel'),
        state = {
            XMLData: []
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