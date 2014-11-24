angular.module('evtviewer.core')

.factory('Config', function($window, Utils, EVTVIEWERDEFAULTCONF) {
    var Config = {};

    Utils.deepExtend(Config, EVTVIEWERDEFAULTCONF);

    // Read 'evtviewerConfig' from the global scope and use those settings
    if (typeof($window.evtviewerConfig) !== 'undefined' && angular.isObject($window.evtviewerConfig)) {
        Utils.deepExtend(Config, $window.evtviewerConfig);
    }

    Config.isValid = function() {
        // TODO: set the rules for checking
        return true;
    };

    Config.isModuleActive = function(moduleName) {
        return angular.isObject(Config.modules[moduleName]) && Config.modules[moduleName].active === true;
    };

    if (typeof($window.EVTVIEWER) === 'undefined') {
        $window.EVTVIEWER = {
            config: Config
        };
    }

    return Config;
});