/**
 * @ngdoc service
 * @module evtviewer.core
 * @name evtviewer.core.config
 * @description 
 * # config
 * Provider used to handle configurations of evtviewer modules.
 * It exposes useful methods that helps to extend base configuration 
 * with external one. 
**/
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
    /**
    * @ngdoc method
    * @name evtviewer.core.config#makeDefaults
    * @methodOf evtviewer.core.config
    *
    * @description
    * Retrieve extended configurations for a particular module.
    *  - It will extend the very basic defaults with given options.
    *  - Try to see if there's a provided configuration for the given module, and use it to extend base options
    *  - Save the built configuration into the Config with given name.
    *
    * @param {string} name name of module
    * @param {Object} options configuration extension
    *
    * @returns {Objects} configurations build from base configs extended with given options
    */
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
    /**
    * @ngdoc method
    * @name evtviewer.core.config#isValid
    * @methodOf evtviewer.core.config
    *
    * @description
    * Check if configs are valid
    *
    * @returns {boolean} whether the configs are valid or not
    *
    * @todo set the rules for checking
    */
    this.isValid = function() {
        return true;
    };
    /**
    * @ngdoc method
    * @name evtviewer.core.config#isModuleActive
    * @methodOf evtviewer.core.config
    *
    * @description
    * Check if given module is active.
    *
    * @param {string} moduleName name of module to check
    *
    * @returns {boolean} whether the module is active or not
    */
    this.isModuleActive = function(moduleName) {
        return angular.isObject(config.modules[moduleName]) && config.modules[moduleName].active === true;
    };
    /**
    * @ngdoc method
    * @name evtviewer.core.config#extendDefault
    * @methodOf evtviewer.core.config
    *
    * @description
    * Extend default configuration with new values
    *
    * @param {Object} json JSON object containing new configuration values
    */
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