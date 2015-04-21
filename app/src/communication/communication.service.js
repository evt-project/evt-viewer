angular.module('evtviewer.communication')

.constant('COMMUNICATIONDEFAULTS', {
    mode: 'xml'
})

.service('evtCommunication', function($http, $log, baseData) {
    var communication = {};
    var _console = $log.getInstance('communication');

    communication.getData = function(url) {
        return $http.get(url)
            .success(function(data) {
                if (typeof(data) === 'string') {
                    baseData.addXMLString(data);
                    _console.log('XML Data received');
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