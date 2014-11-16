angular.module('evtviewer.Core')
.constant("BASECOMPONENTDEFAULTS", {
    debug: false
})
.factory('BaseComponent', function($window, $log, Config, Utils, BASECOMPONENTDEFAULTS) {

    var BaseComponent = function(name, options) {
        this.name = name;
        this.options = angular.copy(BASECOMPONENTDEFAULTS);

        // Extend the very basic defaults with given options
        if (typeof(options) !== "undefined") {
            Utils.deepExtend(this.options, options);
        }

        // The first one extending BaseComponent will create the
        // global EVTVIEWER object
        if (typeof($window.EVTVIEWER) === 'undefined') {
            $window.EVTVIEWER = {
                config: Config
            };
            this.log('Created EVTVIEWER global object');
        }

        // Try to see if there's a provided configuration for this module,
        // and use it to extend our options
        if (typeof(Config.modules[this.name]) !== "undefined") {
            Utils.deepExtend(this.options, Config.modules[this.name]);
            this.log('BaseComponent extending with Config.modules conf');
        }

        // Save the built configuration into the Config with our name
        Config.modules[this.name] = this.options;
    };

    BaseComponent.prototype.err = function() {
        var fileErr = function() {
            try { throw Error(''); } catch(err) { return err; }
        };
        var currentErr = fileErr();
        var callerLine = currentErr.stack.split('\n')[5];

        var args = Array.prototype.slice.call(arguments);
        args.unshift("#EVTViewer " + this.name + "#");
        args.push(callerLine);
        $log.error.apply(null, args);
    };

    BaseComponent.prototype.log = function() {
        if (Config.debugAllModules === true || this.options.debug === true) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("#" + this.name + "#");
            $log.log.apply(null, args);
        }
    };
    
    return BaseComponent;
});