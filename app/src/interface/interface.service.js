angular.module('evtviewer.interface')

.service('evtInterface', function(evtCommunication, config) {
    var mainInterface = {};

    mainInterface.boot = function() {
        evtCommunication.getData(config.dataUrl);
    };

    return mainInterface;
});