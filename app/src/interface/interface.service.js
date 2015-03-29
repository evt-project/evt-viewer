angular.module('evtviewer.interface')

.run(function($injector, Config) {
    if (Config.isValid()) {
        if (Config.isModuleActive('interface')) {
            var mainInterface = $injector.get('evtInterface');
            mainInterface.boot();
        }
    }
})

.constant('INTERFACEDEFAULTS', {
    active: true
})

.service('evtInterface', function(evtCommunication, Config, INTERFACEDEFAULTS) {
    var mainInterface = {};

    mainInterface.boot = function() {
        evtCommunication.getData(Config.dataUrl);
    };

    return mainInterface;
});