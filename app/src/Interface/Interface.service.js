angular.module('evtviewer.interface')

.run(function ($injector, Config) {
    if (Config.isValid()){
        if (Config.isModuleActive('Interface')) {
            var mainInterface = $injector.get('Interface');
            mainInterface.boot();
        }
    }
})

.constant('INTERFACEDEFAULTS', {
    active: true
})

.service('Interface', function (BaseComponent, INTERFACEDEFAULTS) {
    var mainInterface = new BaseComponent('Interface', INTERFACEDEFAULTS);
    
    mainInterface.boot = function () {
        // boom! 
    };

    return mainInterface;
});