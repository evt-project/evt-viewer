angular.module('evtviewer.communication')

.constant('COMMUNICATIONDEFAULTS', {
    mode: 'xml'
})

.service('evtCommunication', function($http, $log, baseData, config) {
    var communication = {};
    var _console = $log.getInstance('communication');

    communication.getExternalConfig = function(url) {
        return $http.get(url)
            .success(function(data) {
                config.extendDefault(data);
            })
            .error(function() {
                communication.err('Something wrong during loading configuration file');
            });
    };

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

    communication.err = function(msg) {
        _console.log('# ERROR # ' + msg);
    };

    return communication;
});