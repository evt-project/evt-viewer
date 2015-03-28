angular.module('evtviewer.core')

.constant('BASECONFIG', {
    debug: false
})

.provider('Config', function(UtilsProvider, GLOBALDEFAULTCONF, BASECONFIG) {
    var config = this;

    UtilsProvider.deepExtend(config, GLOBALDEFAULTCONF);

    // Read 'evtviewerConfig' from the global scope and use those settings
    if (typeof(window.evtviewerConfig) !== 'undefined' && angular.isObject(window.evtviewerConfig)) {
        UtilsProvider.deepExtend(config, window.evtviewerConfig);
    }

    if (typeof(window.EVTVIEWER) === 'undefined') {
        window.EVTVIEWER = {
            config: config
        };
    }

    this.makeDefaults = function(name, options) {
        var defaults = angular.copy(BASECONFIG);

        // Extend the very basic defaults with given options
        if (typeof(options) !== 'undefined') {
            UtilsProvider.deepExtend(defaults, options);
        }

        // Try to see if there's a provided configuration for this module,
        // and use it to extend our options
        if (typeof(config.modules[name]) !== 'undefined') {
            UtilsProvider.deepExtend(defaults, config.modules[name]);
            // console.log('BaseComponent extending with Config.modules conf');
        }

        // Save the built configuration into the Config with our name
        config.modules[name] = defaults;

        return defaults;
    };

    this.isValid = function() {
        // TODO: set the rules for checking
        return true;
    };

    this.$get = function() {
        config.isValid = this.isValid;

        config.isModuleActive = function(moduleName) {
            return angular.isObject(config.modules[moduleName]) && config.modules[moduleName].active === true;
        };

        return config;
    };

});