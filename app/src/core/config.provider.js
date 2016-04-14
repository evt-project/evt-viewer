angular.module('evtviewer.core')

.constant('BASECONFIG', {
    debug: false
})

.provider('config', function(UtilsProvider, GLOBALDEFAULTCONF, BASECONFIG) {
    var config = {};

    UtilsProvider.deepExtend(config, GLOBALDEFAULTCONF);

    // Read 'globalConfig' from the global scope and use those settings
    if (typeof(window.globalConfig) !== 'undefined' && angular.isObject(window.globalConfig)) {
        UtilsProvider.deepExtend(config, window.globalConfig);
    }

    if (typeof(window.GLOBALCONFIG) === 'undefined') {
        window.GLOBALCONFIG = config;
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

    this.isModuleActive = function(moduleName) {
        return angular.isObject(config.modules[moduleName]) && config.modules[moduleName].active === true;
    };

    this.extendDefault = function(json){
        UtilsProvider.deepExtendSkipDefault(config, json);
    };

    this.$get = function() {
        config.isValid        = this.isValid;
        config.isModuleActive = this.isModuleActive;
        config.extendDefault  = this.extendDefault;
        return config;
    };

});