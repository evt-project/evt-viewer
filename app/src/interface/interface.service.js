angular.module('evtviewer.interface')

.run(function($injector, config) {
    if (config.isValid()) {
        if (config.isModuleActive('interface')) {
            var mainInterface = $injector.get('evtInterface');
            mainInterface.boot();
        }
    }
})

.service('evtInterface', function(evtCommunication, config) {
    var mainInterface = {};

    mainInterface.boot = function() {
        evtCommunication.getData(config.dataUrl);
    };

    return mainInterface;
});