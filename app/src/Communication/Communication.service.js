/*globals ActiveXObject*/

angular.module('evtviewer.communication')

.constant('COMMUNICATIONDEFAULTS', {
    mode: 'xml'
})

.service('Communication', function ($http, BaseComponent, DataModel, COMMUNICATIONDEFAULTS) {
    var communication = new BaseComponent('Communication', COMMUNICATIONDEFAULTS);

    communication.getData = function (url) {
        $http.get(url)
            .success(function(data){
                var results;
                if (typeof(data) ==='string') {
                    results = DOMParser ? (new DOMParser()).parseFromString(data, 'text/xml') : ((new ActiveXObject('Microsoft.XMLDOM')).loadXML(data));
                    if (results.documentElement.nodeName !== 'parsererror' && results.documentElement.nodeName !== 'html') {
                        DataModel.addXMLData(results);
                        communication.log('XML Data parsed');
                    }
                } else {
                    // TODO: JSON? 
                }
            })
            .error(function(){
                communication.err('Something wrong during loading');
            });
    };

    return communication;
});