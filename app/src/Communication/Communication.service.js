angular.module('evtviewer.communication')

.constant('COMMUNICATIONDEFAULTS', {
    mode: 'xml'
})

.service('Communication', function($http, BaseComponent, BaseData, COMMUNICATIONDEFAULTS) {
    var communication = new BaseComponent('Communication', COMMUNICATIONDEFAULTS);

    communication.getData = function(url) {
        $http.get(url)
            .success(function(data) {
                if (typeof(data) === 'string') {
                    BaseData.addXMLString(data);
                    communication.log('XML Data received');
                } else {
                    // TODO: JSON? 
                }
            })
            .error(function() {
                communication.err('Something wrong during loading');
            });
    };

    return communication;
});